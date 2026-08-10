const crypto = require("crypto");
//to fetch doctors from the database
const User = require("../models/User");
const ChatMessage = require("../models/ChatMessage");
const { callGemini } = require("../utils/geminiClient");

// Must match the specialization values actually used across the app
// (see patient/Dashboard.jsx SPECIALIZATIONS and authController seedUsers)
const DEPARTMENTS = [
  "Fever",
  "Heart",
  "General",
  "Orthopedic",
  "Skin",
  "Eye",
  "ENT",
];
exports.DEPARTMENTS = DEPARTMENTS;

const DISCLAIMER =
  "This information is AI generated and should not replace professional medical advice.";

const SYSTEM_PROMPT = `You are the MediMitra Assistant, a friendly health-information helper inside a hospital management app.

STRICT RULES:
- You must NEVER diagnose a disease or claim certainty about what condition the user has.
- You may: explain possible common (non-exhaustive) causes for the symptoms described, suggest safe general home-care tips, and explain warning signs that mean the person should seek urgent/in-person care.
- You must recommend exactly ONE hospital department for the user to consult, chosen ONLY from this exact list: ${DEPARTMENTS.join(", ")}. Pick the closest match (e.g. skin issues -> Skin, chest pain/palpitations -> Heart, bone/joint/muscle pain -> Orthopedic, eye issues -> Eye, ear/nose/throat -> ENT, fever/infection -> Fever, anything else/unclear -> General).
- If the user hasn't described enough symptoms yet to recommend a department, ask a brief clarifying question instead, and leave department empty.
- Keep replies concise, warm, and easy to understand for a layperson. Use plain text (no markdown headers).
- Always remember this is informational only, never a substitute for a doctor.

You MUST respond with ONLY a raw JSON object (no markdown fences, no extra text) in exactly this shape:
{"reply": "your full conversational reply to the user, including causes/home-care/warning-signs as relevant", "department": "one of [${DEPARTMENTS.join(", ")}] or empty string if not ready to recommend yet"}`;

// POST /api/ai/chat
exports.chat = async (req, res) => {
  try {
    const {
      message,
      patientName,
      patientId,
      sessionId: incomingSessionId,
    } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ message: "Message is required" });
    }
    if (!patientName || !patientName.trim()) {
      return res.status(400).json({ message: "patientName is required" });
    }
    if (!process.env.GEMINI_API_KEY) {
      return res
        .status(500)
        .json({ message: "GEMINI_API_KEY is not configured on the server" });
    }

    // A new conversation gets a fresh id; continuing an existing one reuses
    // the id the client already has (returned from a previous call here).
    const sessionId = incomingSessionId || crypto.randomUUID();

    // Save the user's question first
    await ChatMessage.create({
      patientName,
      patientId: patientId || null,
      sessionId,
      role: "user",
      message,
    });

    // Pull this conversation's own messages for context (last 12), so
    // reopened/older conversations don't bleed into a newer one's context
    const recent = await ChatMessage.find({ patientName, sessionId })
      .sort({ createdAt: -1 })
      .limit(12);
    const orderedRecent = recent.reverse();

    const contents = orderedRecent.map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.message }],
    }));

    const aiResult = await callGemini({
      apiKey: process.env.GEMINI_API_KEY,
      systemInstruction: SYSTEM_PROMPT,
      contents,
    });
    const reply =
      aiResult.reply ||
      "I'm sorry, I couldn't process that. Could you rephrase your symptoms?";
    const department = DEPARTMENTS.includes(aiResult.department)
      ? aiResult.department
      : "";

    let doctors = [];
    if (department) {
      doctors = await User.find({
        role: "doctor",
        specialization: department,
      }).select("name specialization experience availableTimings");
    }

    // Save the assistant's answer
    await ChatMessage.create({
      patientName,
      patientId: patientId || null,
      sessionId,
      role: "assistant",
      message: reply,
      department,
    });

    res.json({
      success: true,
      sessionId,
      reply,
      department: department || null,
      doctors,
      disclaimer: DISCLAIMER,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/ai/history/:patientName
// Unchanged — returns the full flat message list, kept for backward compatibility.
exports.getHistory = async (req, res) => {
  try {
    const { patientName } = req.params;
    const messages = await ChatMessage.find({ patientName }).sort({
      createdAt: 1,
    });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/ai/conversations/:patientName
// Lists every past conversation as a summary card (for the "Previous
// Conversations" page). Purely a read/aggregation over existing data —
// nothing is modified. Messages that predate the sessionId field (stored
// as '') are grouped one conversation per calendar day so they remain
// browsable without altering the original records.
exports.getConversations = async (req, res) => {
  try {
    const { patientName } = req.params;
    const messages = await ChatMessage.find({ patientName }).sort({
      createdAt: 1,
    });

    const groups = new Map(); // key -> { sessionId, messages: [] }
    for (const m of messages) {
      const key =
        m.sessionId || `legacy-${m.createdAt.toISOString().split("T")[0]}`;
      if (!groups.has(key)) groups.set(key, { sessionId: key, messages: [] });
      groups.get(key).messages.push(m);
    }

    const conversations = Array.from(groups.values())
      .map((g) => {
        const firstQuestion =
          g.messages.find((m) => m.role === "user")?.message ||
          "(no question recorded)";
        const lastMessage = g.messages[g.messages.length - 1];
        const department =
          [...g.messages].reverse().find((m) => m.department)?.department ||
          null;
        return {
          sessionId: g.sessionId,
          preview:
            firstQuestion.length > 80
              ? firstQuestion.slice(0, 80) + "…"
              : firstQuestion,
          messageCount: g.messages.length,
          department,
          startedAt: g.messages[0].createdAt,
          lastMessageAt: lastMessage.createdAt,
        };
      })
      .sort((a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt));

    res.json(conversations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/ai/conversations/:patientName/:sessionId
// Reopens one specific past conversation with its full Q&A transcript.
exports.getConversationById = async (req, res) => {
  try {
    const { patientName, sessionId } = req.params;

    const query = sessionId.startsWith("legacy-")
      ? {
          patientName,
          sessionId: "",
          createdAt: {
            $gte: new Date(`${sessionId.replace("legacy-", "")}T00:00:00.000Z`),
            $lt: new Date(`${sessionId.replace("legacy-", "")}T23:59:59.999Z`),
          },
        }
      : { patientName, sessionId };

    const messages = await ChatMessage.find(query).sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

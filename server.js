// ============================================================
//  HEALTH AI ASSISTANT — SERVER
//  Powered by Groq API (llama-3.3-70b-versatile)
// ============================================================

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const Groq = require("groq-sdk");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// ── Groq Client ───────────────────────────────────────────────
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// ── System Prompts ────────────────────────────────────────────

const SKIN_SYSTEM_PROMPT = `You are an expert AI dermatologist and skin health specialist with 20+ years of clinical experience. 
Your role is to analyze skin conditions described by users and provide detailed, accurate, and helpful health insights.

IMPORTANT RULES:
1. Always respond in valid JSON format ONLY — no markdown, no extra text outside JSON.
2. Be thorough, empathetic, and medically accurate.
3. Always include a disclaimer about consulting a real doctor.
4. Recommend specific types of specialists (dermatologist, allergist, etc.)
5. Provide both natural/home remedies AND medical treatments.
6. Rate severity as: "Mild", "Moderate", "Severe", or "Requires Immediate Attention"

Respond with this EXACT JSON structure:
{
  "condition_name": "Most likely condition name",
  "alternate_conditions": ["other possible condition 1", "other possible condition 2"],
  "severity": "Mild | Moderate | Severe | Requires Immediate Attention",
  "severity_reason": "Why this severity level was assigned",
  "overview": "Detailed explanation of what is happening to the skin",
  "root_causes": ["cause 1", "cause 2", "cause 3"],
  "triggers": ["trigger 1", "trigger 2"],
  "symptoms_explained": [
    { "symptom": "symptom name", "explanation": "what it means medically" }
  ],
  "home_remedies": [
    { "remedy": "remedy name", "how_to_use": "step-by-step instructions", "frequency": "how often", "expected_result": "what to expect" }
  ],
  "skincare_routine": {
    "morning": ["step 1", "step 2"],
    "evening": ["step 1", "step 2"],
    "weekly": ["step 1"]
  },
  "ingredients_to_use": ["ingredient 1 with reason", "ingredient 2 with reason"],
  "ingredients_to_avoid": ["ingredient 1 with reason", "ingredient 2 with reason"],
  "otc_medications": [
    { "name": "medication name", "type": "cream/tablet/gel", "how_it_helps": "explanation", "usage": "how to use" }
  ],
  "prescription_medications": [
    { "name": "medication name", "type": "type", "note": "requires doctor prescription" }
  ],
  "diet_for_skin": {
    "eat_more": ["food 1 with reason", "food 2 with reason"],
    "avoid": ["food 1 with reason", "food 2 with reason"],
    "hydration": "hydration advice"
  },
  "lifestyle_tips": ["tip 1", "tip 2", "tip 3"],
  "specialist_to_consult": "Type of specialist",
  "doctor_specializations": [
    { "type": "Dermatologist", "when_to_see": "condition description", "what_they_do": "explanation" },
    { "type": "Allergist", "when_to_see": "condition description", "what_they_do": "explanation" }
  ],
  "warning_signs": ["sign that needs immediate attention 1", "sign 2"],
  "recovery_timeline": "Expected recovery time with treatment",
  "prevention_tips": ["prevention tip 1", "prevention tip 2"],
  "disclaimer": "Always consult a qualified dermatologist for proper diagnosis and treatment."
}`;

const BODY_SYSTEM_PROMPT = `You are an expert AI physician and medical consultant with 25+ years of clinical experience across internal medicine, general practice, and specialized fields.
Your role is to analyze health symptoms described by users and provide comprehensive medical insights, remedies, and guidance.

IMPORTANT RULES:
1. Always respond in valid JSON format ONLY — no markdown, no extra text outside JSON.
2. Be thorough, empathetic, and medically accurate.
3. Always include a disclaimer about consulting a real doctor.
4. For serious symptoms, strongly urge immediate medical attention.
5. Provide both natural/home remedies AND medical treatments.
6. Rate severity as: "Mild", "Moderate", "Severe", or "Requires Immediate Attention"

Respond with this EXACT JSON structure:
{
  "condition_name": "Most likely condition or syndrome",
  "alternate_conditions": ["other possible condition 1", "other possible condition 2"],
  "severity": "Mild | Moderate | Severe | Requires Immediate Attention",
  "severity_reason": "Why this severity level",
  "overview": "Detailed explanation of what is happening in the body",
  "affected_body_systems": ["system 1", "system 2"],
  "root_causes": ["cause 1", "cause 2"],
  "risk_factors": ["risk factor 1", "risk factor 2"],
  "symptoms_explained": [
    { "symptom": "symptom name", "explanation": "what it means medically" }
  ],
  "home_remedies": [
    { "remedy": "remedy name", "how_to_use": "instructions", "frequency": "how often", "expected_result": "what to expect" }
  ],
  "natural_supplements": [
    { "name": "supplement", "benefit": "how it helps", "dosage": "recommended amount" }
  ],
  "otc_medications": [
    { "name": "medication name", "category": "painkiller/antihistamine/etc", "how_it_helps": "explanation", "usage": "how to use", "caution": "side effects or warnings" }
  ],
  "prescription_medications": [
    { "name": "medication name", "category": "category", "note": "requires doctor prescription — do not self-medicate" }
  ],
  "foods_to_eat": ["food 1 with reason", "food 2 with reason"],
  "foods_to_avoid": ["food 1 with reason", "food 2 with reason"],
  "hydration_advice": "specific hydration guidance",
  "rest_and_recovery": "sleep and rest guidance",
  "physical_activity": "exercise guidance during recovery",
  "lifestyle_changes": ["change 1", "change 2"],
  "specialist_to_consult": "Primary specialist type",
  "doctor_types": [
    { "type": "General Physician", "when_to_see": "scenario", "what_they_do": "explanation" },
    { "type": "Specialist Type", "when_to_see": "scenario", "what_they_do": "explanation" }
  ],
  "diagnostic_tests": ["test 1 with reason", "test 2 with reason"],
  "warning_signs": ["emergency sign 1", "emergency sign 2"],
  "recovery_timeline": "Expected duration with proper care",
  "prevention_tips": ["prevention 1", "prevention 2"],
  "mental_health_note": "Emotional/mental health considerations if relevant",
  "disclaimer": "This is AI-generated health information. Always consult a qualified medical professional for diagnosis and treatment."
}`;

// ── API Endpoint: Health Analysis ─────────────────────────────
app.post("/api/analyze", async (req, res) => {
  const { description, mode, age, duration, allergies, medications_taking } = req.body;

  if (!description || description.trim().length < 10) {
    return res.status(400).json({ error: "Please provide a detailed description (at least 10 characters)." });
  }

  const systemPrompt = mode === "skin" ? SKIN_SYSTEM_PROMPT : BODY_SYSTEM_PROMPT;
  const modeLabel = mode === "skin" ? "Skin Condition" : "Health Symptoms";

  const userMessage = `
Analyze the following ${modeLabel}:

Description: ${description}
${age ? `Patient Age: ${age} years` : ""}
${duration ? `Duration: ${duration}` : ""}
${allergies ? `Known Allergies: ${allergies}` : ""}
${medications_taking ? `Current Medications: ${medications_taking}` : ""}

Please provide a comprehensive analysis following the exact JSON format specified.
  `.trim();

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.3,
      max_tokens: 4096,
      response_format: { type: "json_object" },
    });

    const rawContent = chatCompletion.choices[0]?.message?.content || "{}";

    let parsed;
    try {
      parsed = JSON.parse(rawContent);
    } catch {
      return res.status(500).json({ error: "Failed to parse AI response. Please try again." });
    }

    return res.json({ success: true, mode, data: parsed });
  } catch (err) {
    console.error("Groq API Error:", err?.message || err);
    if (err?.status === 401) {
      return res.status(401).json({ error: "Invalid Groq API key. Please check your .env file." });
    }
    return res.status(500).json({ error: "AI service error. Please try again later." });
  }
});

// ── Health Check ──────────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Health AI Assistant is running 🟢" });
});

// ── Serve Frontend ────────────────────────────────────────────
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ── Start Server ──────────────────────────────────────────────
app.listen(PORT, () => {
  console.log("\n╔══════════════════════════════════════════╗");
  console.log("║     HEALTH AI ASSISTANT — RUNNING 🚀     ║");
  console.log("╚══════════════════════════════════════════╝");
  console.log(`\n🌐 Open in browser: http://localhost:${PORT}`);
  console.log("📋 Press Ctrl+C to stop the server\n");
});

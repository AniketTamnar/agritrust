require("dotenv").config();
const OpenAI = require("openai");

// Optional (only if SSL issue)
// process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  timeout: 30000, // 30 seconds timeout
});

async function askLLM(prompt) {
  try {
    if (!prompt || typeof prompt !== "string") {
      throw new Error("Invalid prompt");
    }

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
You are AgriTrust AI, an agriculture assistant.
Answer farming-related questions clearly and simply.
Give practical examples relevant to Indian agriculture.
Keep response structured and easy to understand.
`
        },
        {
          role: "user",
          content: prompt.trim(),
        },
      ],
      temperature: 0.7,
      max_tokens: 600,
    });

    if (!response.choices || !response.choices[0]?.message?.content) {
      throw new Error("Empty response from AI");
    }

    return response.choices[0].message.content.trim();

  } catch (error) {
    console.error("LLM FULL ERROR:", error);

    // 🔴 Handle OpenAI quota error
    if (error.code === "insufficient_quota") {
      throw new Error("AI quota exceeded. Please check billing.");
    }

    // 🔴 Handle rate limit
    if (error.status === 429) {
      throw new Error("Too many requests. Please try again later.");
    }

    // 🔴 Handle invalid API key
    if (error.status === 401) {
      throw new Error("Invalid API key. Check your .env file.");
    }

    // 🔴 Network error
    if (error.code === "ECONNREFUSED") {
      throw new Error("Cannot connect to AI server.");
    }

    // Default fallback
    throw new Error("AI service unavailable. Please try again.");
  }
}

module.exports = { askLLM };

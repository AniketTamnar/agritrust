require("dotenv").config();
const OpenAI = require("openai");

(async () => {
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  try {
    const res = await client.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are an agriculture assistant." },
        { role: "user", content: "What is the best fertilizer for wheat crops in India?" }
      ]
    });
    console.log(res.choices[0].message.content);
  } catch (e) {
    console.error("❌ Error:", e);
  }
})();

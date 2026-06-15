
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req) {
  try {
    console.log("--- UGC API REQUEST RECEIVED ---");
    const { productUrl, description, tone, platform, apiKey: userKey } = await req.json();
    
    // Check User Key first, then Env fallback
    const apiKey = userKey || process.env.GEMINI_API_KEY;
    console.log("API Key present:", !!apiKey);
    
    if (!apiKey) {
      return Response.json({ 
        error: "Missing API Key", 
        detail: "Please enter your Gemini API Key in the settings or check server .env" 
      }, { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
    Act as a direct-response copywriter expert on ${platform}.
    Create a highly engaging, viral video script for a product.
    
    Product Info: ${description || "No description provided"}
    ${productUrl ? `Product URL Context: ${productUrl}` : ''}
    
    Tone: ${tone}
    Platform: ${platform} (Keep it short, fast-paced, max 30-45 seconds)
    
    Structure the response strictly as valid JSON with the following schema:
    {
      "title": "Catchy Internal Title",
      "hook": "The first 3 seconds text/voiceover to grab attention",
      "script": "The main spoken script",
      "scenes": [
        "Visual description for scene 1",
        "Visual description for scene 2",
        "..."
      ],
      "cta": "Call to action line"
    }
    
    Return ONLY RAW JSON. No markdown formatting.
    `;

    console.log("Generating content with model...");
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();
    console.log("Raw AI Response:", text);
    
    // Clean up potential markdown code blocks
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();

    try {
        const json = JSON.parse(text);
        return Response.json({ success: true, data: json });
    } catch (e) {
        console.error("JSON Parse Error:", text);
        return Response.json({ error: "Failed to parse AI response/Bad Format", raw: text }, { status: 500 });
    }

  } catch (err) {
    console.error("UGC Gen Error:", err);
    return Response.json({ error: "Server Error", detail: err.message }, { status: 500 });
  }
}

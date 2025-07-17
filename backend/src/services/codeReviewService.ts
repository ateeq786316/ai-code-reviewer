// src/services/codeReviewService.ts
import { GoogleGenerativeAI } from "@google/generative-ai";

let genAI: GoogleGenerativeAI | null = null;

if (process.env.GEMINI_API_KEY) {
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
}

export const reviewCodeWithAI = async (code: string) => {
  const prompt = `
You are a senior software engineer.
Please review the following code and:

1. Flag any bugs, vulnerabilities, or bad practices
2. Suggest improvements (with reasons)
3. Assign a risk score (1–10)

Respond in JSON format:
{
  "bugs": [],
  "security_issues": [],
  "suggestions": [],
  "risk_score": 1–10
}

Code:
\`\`\`ts
${code}
\`\`\`
`;

  if (!genAI) {
    console.warn("⚠️ No Gemini API key found. Using mock AI response.");
    return {
      bugs: ['Missing error handling in function', 'Unsafe type casting'],
      security_issues: ['Input not validated', 'No rate limiting on endpoint'],
      suggestions: [
        'Use try/catch for error handling',
        'Sanitize user input to prevent XSS',
        'Implement middleware for request throttling',
      ],
      risk_score: Math.floor(Math.random() * 10) + 1,
    };
  }

  let text = '';
  try {
    const model = genAI.getGenerativeModel({ model: "models/gemini-2.0-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    text = response.text();

    // Remove Markdown code block if present
    const cleaned = text.replace(/```json|```/g, '').trim();
    return JSON.parse(cleaned || '{}');
  } catch (err) {
    console.error("❌ Error using Gemini API:", err);
    return {
      error: 'Failed to fetch or parse Gemini response. Using mock response.',
      raw: text,
      mock: {
        bugs: ['Hardcoded credentials found'],
        security_issues: ['No input validation', 'XSS risk'],
        suggestions: ['Use environment variables', 'Validate all user inputs'],
        risk_score: 7,
      },
    };
  }
};

// src/services/codeReviewService.ts
import { GoogleGenerativeAI } from "@google/generative-ai";

let genAI: GoogleGenerativeAI | null = null;

if (process.env.GEMINI_API_KEY) {
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
}

export const reviewCodeWithAI = async (code: string) => {
  const prompt = `
You are a senior software engineer performing a comprehensive code review. Please analyze the following code and provide a detailed review in JSON format.

Analyze for:
1. Bugs and logical errors
2. Security vulnerabilities (XSS, injection, etc.)
3. Performance issues
4. Code quality and maintainability issues
5. Best practices violations
6. Potential risks

Respond in this exact JSON format:
{
  "bugs": ["list of specific bugs found"],
  "security_issues": ["list of security vulnerabilities"],
  "suggestions": ["list of improvement suggestions"],
  "risk_score": 1-10,
  "performance_issues": ["list of performance concerns"],
  "code_quality_issues": ["list of code quality problems"],
  "best_practices": ["list of best practice violations"]
}

Code to review:
\`\`\`
${code}
\`\`\`

Provide specific, actionable feedback. If no issues are found in a category, use an empty array.
`;

  if (!genAI) {
    console.warn("⚠️ No Gemini API key found. Using enhanced mock AI response.");
    return generateMockResponse(code);
  }

  let text = '';
  try {
    const model = genAI.getGenerativeModel({ model: "models/gemini-2.0-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    text = response.text();

    // Remove Markdown code block if present
    const cleaned = text.replace(/```json|```/g, '').trim();
    const parsedResponse = JSON.parse(cleaned || '{}');
    
    // Merge with local analysis for comprehensive results
    return mergeWithLocalAnalysis(parsedResponse, code);
  } catch (err) {
    console.error("❌ Error using Gemini API:", err);
    return {
      error: 'Failed to fetch or parse Gemini response. Using enhanced mock response.',
      raw: text,
      ...generateMockResponse(code)
    };
  }
};

const generateMockResponse = (code: string) => {
  const codeLower = code.toLowerCase();
  const bugs: string[] = [];
  const securityIssues: string[] = [];
  const suggestions: string[] = [];
  const performanceIssues: string[] = [];
  const codeQualityIssues: string[] = [];
  const bestPractices: string[] = [];
  
  let riskScore = 3; // Start with low risk

  // Analyze for common issues
  if (codeLower.includes('var ')) {
    codeQualityIssues.push('Use of var keyword - prefer const or let');
    suggestions.push('Replace var with const or let for better scoping');
  }

  if (codeLower.includes('==') && !codeLower.includes('===')) {
    bugs.push('Loose equality comparison detected');
    suggestions.push('Use strict equality (===) to avoid type coercion');
    riskScore += 2;
  }

  if (codeLower.includes('innerhtml') || codeLower.includes('outerhtml')) {
    securityIssues.push('Direct DOM manipulation with innerHTML - XSS risk');
    suggestions.push('Use textContent or createElement to prevent XSS attacks');
    riskScore += 3;
  }

  if (codeLower.includes('eval(')) {
    securityIssues.push('Use of eval() function - critical security risk');
    suggestions.push('Never use eval() - use alternative approaches');
    riskScore += 4;
  }

  if (codeLower.includes('settimeout') || codeLower.includes('setinterval')) {
    if (!codeLower.includes('cleartimeout') && !codeLower.includes('clearinterval')) {
      performanceIssues.push('Timer functions without cleanup - memory leak risk');
      suggestions.push('Always clear timers to prevent memory leaks');
      riskScore += 2;
    }
  }

  if (codeLower.includes('console.log')) {
    bestPractices.push('Console.log statements should be removed in production');
    suggestions.push('Remove console.log statements before deployment');
  }

  if (codeLower.includes('password') && codeLower.includes('hardcode')) {
    securityIssues.push('Hardcoded credentials detected');
    suggestions.push('Use environment variables for sensitive data');
    riskScore += 3;
  }

  // Add some generic suggestions if none found
  if (suggestions.length === 0) {
    suggestions.push('Consider adding error handling for robustness');
    suggestions.push('Add input validation where appropriate');
  }

  return {
    bugs,
    security_issues: securityIssues,
    suggestions,
    risk_score: Math.min(riskScore, 10),
    performance_issues: performanceIssues,
    code_quality_issues: codeQualityIssues,
    best_practices: bestPractices
  };
};

const mergeWithLocalAnalysis = (aiResponse: any, code: string) => {
  const mockResponse = generateMockResponse(code);
  
  // Merge arrays, avoiding duplicates
  const mergeArrays = (ai: string[], mock: string[]) => {
    const combined = [...(ai || []), ...mock];
    return [...new Set(combined)]; // Remove duplicates
  };

  return {
    bugs: mergeArrays(aiResponse.bugs, mockResponse.bugs),
    security_issues: mergeArrays(aiResponse.security_issues, mockResponse.security_issues),
    suggestions: mergeArrays(aiResponse.suggestions, mockResponse.suggestions),
    risk_score: Math.max(aiResponse.risk_score || 0, mockResponse.risk_score),
    performance_issues: mergeArrays(aiResponse.performance_issues, mockResponse.performance_issues),
    code_quality_issues: mergeArrays(aiResponse.code_quality_issues, mockResponse.code_quality_issues),
    best_practices: mergeArrays(aiResponse.best_practices, mockResponse.best_practices)
  };
};

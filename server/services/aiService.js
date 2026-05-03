const { GoogleGenerativeAI } = require('@google/generative-ai');

let genAI;
try {
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'dummy_key_if_not_set');
} catch (error) {
  console.warn('Gemini API key not found or invalid.');
}

exports.rewriteReason = async (casualText, requestType) => {
  if (!process.env.GEMINI_API_KEY) {
    return `[Formal rewrite of: ${casualText}] (API Key missing)`;
  }
  
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = `Rewrite the following casual reason for a college ${requestType} request into formal, polite, and professional language suitable for an academic official. Only return the rewritten text without any additional commentary.\n\nOriginal Text: ${casualText}`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim();
  } catch (error) {
    console.error('AI text rewrite error:', error);
    return casualText; // fallback to original if AI fails
  }
};

exports.analyzeMedicalDocument = async (base64Image, mimeType) => {
  if (!process.env.GEMINI_API_KEY) {
    return { verdict: 'Needs Review', extractedText: 'API Key missing, cannot analyze document.' };
  }
  
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = `Analyze this medical document. Extract the following information:
1. Doctor/Hospital Name
2. Patient Name
3. Dates mentioned (from-to or single date)
4. Key Diagnosis/Reason

Based on the document, give a verdict of either "Likely Valid" or "Needs Review". A document needs review if it looks suspicious, lacks dates, or seems incomplete.

Return your response strictly in the following JSON format:
{
  "extractedText": "summary of extracted info...",
  "verdict": "Likely Valid" | "Needs Review"
}`;

    const imageParts = [
      {
        inlineData: {
          data: base64Image,
          mimeType
        }
      }
    ];

    const result = await model.generateContent([prompt, ...imageParts]);
    const responseText = result.response.text();
    
    // Parse JSON from response
    // Using regex to handle markdown code blocks if the model wrapped it
    const jsonStr = responseText.replace(/```json\n?|```/g, '').trim();
    const parsed = JSON.parse(jsonStr);
    
    return {
      verdict: parsed.verdict || 'Needs Review',
      extractedText: parsed.extractedText || 'Could not extract'
    };
  } catch (error) {
    console.error('AI document analysis error:', error);
    return { verdict: 'Needs Review', extractedText: 'AI analysis failed.' };
  }
};

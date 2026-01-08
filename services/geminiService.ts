import { GoogleGenAI, Type } from "@google/genai";
import { MatchResult, OptimizationResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Converts a File object to a Base64 string.
 */
const fileToPart = async (file: File): Promise<{ inlineData: { data: string; mimeType: string } }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (reader.result) {
        const base64Data = (reader.result as string).split(',')[1];
        resolve({
          inlineData: {
            data: base64Data,
            mimeType: file.type,
          },
        });
      } else {
        reject(new Error("Failed to read file"));
      }
    };
    reader.readAsDataURL(file);
  });
};

export const analyzeResumeMatch = async (resume: File, jobDescription: File): Promise<MatchResult> => {
  try {
    const resumePart = await fileToPart(resume);
    const jdPart = await fileToPart(jobDescription);

    const prompt = `
      You are an expert Applicant Tracking System (ATS) optimization specialist.
      Analyze the attached Resume and Job Description.
      
      Tasks:
      1. Calculate a match score (0-100) based on keyword overlap, skill matching, and relevance.
      2. Identify critical keywords/skills present in the Job Description but missing from the Resume.
      3. Provide a brief analysis of the gap.
      4. Extract the full text of the resume so it can be rewritten later.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [resumePart, jdPart, { text: prompt }],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.INTEGER, description: "Match score between 0 and 100" },
            missingKeywords: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING }, 
              description: "List of important keywords found in JD but missing in Resume" 
            },
            summaryAnalysis: { type: Type.STRING, description: "A concise gap analysis summary" },
            extractedResumeText: { type: Type.STRING, description: "The full plain text content of the resume" }
          },
          required: ["score", "missingKeywords", "summaryAnalysis", "extractedResumeText"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as MatchResult;
    }
    throw new Error("No response from AI");
  } catch (error) {
    console.error("Analysis failed:", error);
    throw error;
  }
};

export const optimizeResumeText = async (currentText: string, missingKeywords: string[]): Promise<OptimizationResult> => {
  try {
    const prompt = `
      You are a professional resume writer.
      
      Task: Rewrite the provided resume text to naturally incorporate the following missing keywords, WITHOUT inventing fake experience. 
      Focus heavily on optimizing the "Professional Summary" and "Skills" sections to close the gap.
      Ensure the tone remains professional and the structure is preserved.
      
      Missing Keywords to add: ${missingKeywords.join(", ")}
      
      Original Resume Text:
      ${currentText}
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            optimizedText: { type: Type.STRING, description: "The full rewritten resume text" },
            changesMade: { type: Type.STRING, description: "Brief explanation of what was changed" }
          },
          required: ["optimizedText", "changesMade"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as OptimizationResult;
    }
    throw new Error("No response from AI");

  } catch (error) {
    console.error("Optimization failed:", error);
    throw error;
  }
};

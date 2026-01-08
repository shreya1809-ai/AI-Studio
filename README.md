<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# AI Studio Resume Optimizer
A rapid prototype built using the Google Gemini API to tailor resumes to specific job descriptions.

## How it works
1. Takes a PDF resume and a Job Description text.
2. Uses Gemini 1.5 Pro to analyze keyword gaps.
3. Generates tailored bullet points.

## Run Locally

**Prerequisites:**  Node.js

1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

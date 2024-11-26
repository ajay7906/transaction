// First, install the required package:
// npm install @google/generative-ai

require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testGeminiAPI() {
    try {
        // Initialize the API with your key stored in .env file
        const genAI = new GoogleGenerativeAI('AIzaSyBd8GPvlTVjMjKi2-kRdqP2FIXY2X-svF0');

        // For text-only input
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        // Simple test prompt
        const prompt = "Write a hello world code using javascript";

        // Generate content
        const result = await model.generateContent(prompt);
        const response = await result.response;
        console.log("API Response:", response.text());
        console.log("API is working successfully!");
        
    } catch (error) {
        console.error("API Error:", error.message);
        console.log("API test failed. Please check your API key and connection.");
    }
}

// Create a .env file and add your API key:
// GEMINI_API_KEY=your_api_key_here

testGeminiAPI();
# Annadata AI - Unstop Hackathon Submission

## 1. IDEA TITLE
**Annadata AI**: A Smart, Multilingual Agricultural Ecosystem Empowering Indian Farmers.

## 2. IDEA DESCRIPTION
Annadata AI is a comprehensive digital platform designed to digitize and empower the Indian farming community. It acts as a 24/7 intelligent farming advisor that communicates in both Hindi and English. The core problem it solves is the lack of accessible, real-time, and customized agricultural knowledge for rural farmers. Features include an AI Assistant that can diagnose crop diseases from uploaded photos (Computer Vision), an infinitely expanding Crop Intelligence Library, live Mandi (market) rate generation, real-time localized weather forecasting, a community Q&A forum, and farm-to-mandi transport logistics matching. By combining a highly premium, accessible UI with cutting-edge Generative AI, Annadata AI bridges the technology gap in rural agriculture.

## 3. TECHNICAL DETAILS

### Technologies Used
*   **Frontend**: React (Vite), JavaScript, Vanilla CSS, Framer Motion (for smooth micro-animations), Lucide React (icons).
*   **Backend**: Node.js, Express.js
*   **AI/ML**: Google Gemini 2.0 Flash (For Multimodal Chat, Dynamic JSON Market Data Generation, and Vision-based Crop Disease Scanning)
*   **Cloud & Deployment**: Vercel (Frontend SPA), Railway (Node.js Serverless Backend)
*   **Authentication**: Firebase Phone Authentication (OTP) and JWT Sessions.
*   **Security**: express-rate-limit for endpoint protection.

### Architecture Overview
The application follows a decoupled Client-Server architecture. The frontend is a highly responsive Single Page Application (SPA) built with React and Vite, utilizing a custom dark glassmorphic design system. It communicates securely with the Express.js backend via RESTful APIs. The backend acts as a robust orchestrator: managing MongoDB queries, verifying Firebase authentication tokens, and interfacing with the Google Gemini API. Crucially, the backend utilizes AI not just for chat, but as a "dynamic database"—if a user requests market data or crop information that doesn't exist in the static database, the backend prompts Gemini 2.0 to dynamically generate and structure the requested data in real-time JSON format, serving it instantly to the frontend.

### Database Used
*   **MongoDB Atlas** (Managed via Mongoose ODM for schemas like Users, Crops, Chat History, and Market Rates).

### Third-Party Integrations
*   **Google Gemini AI API**: Powers conversational AI, generative JSON data pipelines, and multimodal image analysis.
*   **Open-Meteo API**: Provides free, real-time weather and forecast data based on HTML5 Geolocation.
*   **Firebase SDK**: Handles secure, password-less Phone Number OTP verification.

## 4. SUBMISSION LINKS

*   **GitHub Repository**: [https://github.com/shahidansari311/annadata_ai](https://github.com/shahidansari311/annadata_ai)
*   **Live Demo / Deployed Link**: [https://annadata-ai-xnords.vercel.app/](https://annadata-ai-xnords.vercel.app/)
*   **Prototype / Figma / PPT Link**:https://drive.google.com/file/d/1k0P4xEhlfKBuqLKFT01fj4AkZjiuMHzA/view?usp=sharing

---

## DEMO 

*   **Demo Video (3-5 Minutes)**: https://drive.google.com/file/d/1TqTGvOVq8pJvEexuew9HW_06PAkrqGs0/view?usp=sharing


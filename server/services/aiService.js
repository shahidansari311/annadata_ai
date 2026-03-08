import { GoogleGenerativeAI } from '@google/generative-ai'

const SYSTEM_PROMPT = `You are "Annadata AI" — a smart, friendly, and expert agricultural assistant built for Indian farmers. You are knowledgeable about:

1. **Crop Management**: Sowing schedules, seed varieties (including Indian varieties like HD-2967, Pusa Basmati), crop rotation, intercropping
2. **Soil & Fertilizers**: Soil types (black soil, alluvial, laterite, red soil), NPK management, organic farming (FYM, vermicompost, Jeevamrit), micronutrient deficiency
3. **Pest & Disease Management**: Common pests in Indian crops (bollworm, stem borer, aphids), IPM practices, organic and chemical control methods
4. **Irrigation**: Drip, sprinkler, flood, furrow irrigation; water management; PMKSY scheme
5. **Mandi & Market**: Mandi prices, MSP (Minimum Support Price), APMC, e-NAM portal, when to sell crops
6. **Government Schemes**: PM Kisan, PM Fasal Bima Yojana, Kisan Credit Card, Soil Health Card, NABARD
7. **Weather & Climate**: Monsoon advisory, frost protection, heat wave management
8. **Livestock**: Basic animal husbandry advice

IMPORTANT RULES:
- Respond in the SAME LANGUAGE the user writes in (Hindi or English)
- If the user writes in Hindi, respond entirely in Hindi (Devanagari script)
- Give practical, actionable advice suitable for Indian farming conditions
- Use Indian units: hectare, quintal, bigha, kg/ha
- Reference Indian crop varieties and local practices
- Mention relevant government schemes when applicable
- Keep responses concise but comprehensive
- Use bullet points and formatting for readability
- Be warm and respectful — address farmers with respect
- If unsure, recommend consulting local KVK (Krishi Vigyan Kendra)
- For medical/veterinary emergencies, advise visiting nearest clinic

NEVER provide financial advice, legal advice, or medical advice for humans. Stay focused on agriculture.`

let genAI = null
let model = null

const initializeAI = () => {
  if (!genAI && process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here') {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })
  }
  return model
}

export const getAIResponse = async (message, chatHistory = [], imageBase64 = null) => {
  const aiModel = initializeAI()

  if (!aiModel) {
    // Fallback when API key is not configured
    return getFallbackResponse(message)
  }

  try {
    // Build chat history for context (exclude base64 from history to save tokens)
    const history = chatHistory.slice(-10).map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content.substring(0, 1000) }], // limit history text length
    }))

    const chat = aiModel.startChat({
      history: [
        { role: 'user', parts: [{ text: 'System instruction: ' + SYSTEM_PROMPT }] },
        { role: 'model', parts: [{ text: 'Understood! I am Annadata AI, ready to help Indian farmers with crop management, pest control, fertilizers, mandi rates, government schemes, and more. I will respond in the same language the farmer uses. How can I help? 🌾' }] },
        ...history,
      ],
      generationConfig: {
        maxOutputTokens: 1500,
        temperature: 0.7,
      },
    })

    const messageParts = [{ text: message }]

    if (imageBase64) {
      try {
        const mimeType = imageBase64.split(';')[0].split(':')[1]
        const data = imageBase64.split(',')[1]
        messageParts.push({
          inlineData: {
            data,
            mimeType
          }
        })
      } catch (e) {
        console.error("Failed to parse image for AI")
      }
    }

    const result = await chat.sendMessage(messageParts)
    const response = result.response.text()
    return response
  } catch (err) {
    console.error('Gemini AI error:', err.message)
    return getFallbackResponse(message)
  }
}

// Fallback responses when AI is not available
const getFallbackResponse = (message) => {
  const isHindi = /[\u0900-\u097F]/.test(message)

  if (isHindi) {
    return `आपके प्रश्न के लिए धन्यवाद! 🙏

मेरे कृषि ज्ञान के आधार पर कुछ सुझाव:

• क्षेत्र-विशिष्ट सलाह के लिए अपने स्थानीय **कृषि विज्ञान केंद्र (KVK)** से परामर्श लें
• विस्तृत फसल जानकारी के लिए हमारी **फसल पुस्तकालय** देखें
• **समुदाय** में अनुभवी किसानों से व्यावहारिक सलाह मिल सकती है
• सरकारी योजनाओं की जानकारी के लिए **PM Kisan पोर्टल** देखें

क्या मैं किसी और चीज़ में मदद कर सकता हूं? 🌾`
  }

  return `Thank you for your question! 🙏

Based on my agricultural knowledge base, here are some insights:

• I recommend consulting with your local **Krishi Vigyan Kendra (KVK)** for region-specific advice
• You can check our **Crop Library** for detailed crop information
• The **Community section** has expert farmers who might have practical experience
• Visit the **PM Kisan portal** for government scheme information

Would you like me to help with anything else? 🌾`
}

export const getMandiRatesFromAI = async (state, district) => {
  const aiModel = initializeAI()
  if (!aiModel) return null
  
  try {
    const prompt = `You are a real-time agricultural market data provider. Provide the current (or highly realistic estimated) mandi (market) rates for major agricultural commodities in the district of ${district}, ${state}, India. 
RESPOND ONLY WITH VALID JSON. Do not include markdown formatting like \`\`\`json.
The JSON must be an array of objects. Each object must strictly follow this structure:
{
  "name": "Crop Name (English)",
  "nameHi": "Crop Name (Hindi)",
  "emoji": "🌾",
  "min": 2000,
  "max": 2500,
  "modal": 2200,
  "trend": "up", // "up", "down", or "stable"
  "change": "+₹50", 
  "sparkline": [40, 45, 60, 55, 70, 65, 80] // Array of 7 numbers representing weekly trend
}
Provide data for at least 6 major crops grown in that specific region. Make it realistic.`

    const result = await aiModel.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.2, // Low temperature for consistent JSON data
      }
    })
    
    let responseText = result.response.text()
    responseText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    
    return JSON.parse(responseText)
  } catch (err) {
    console.error('Failed to generate mandi rates from AI:', err.message)
    return null
  }
}

export const generateCropDetails = async (cropName) => {
  const aiModel = initializeAI()
  if (!aiModel) return null
  
  try {
    const prompt = `You are a professional agricultural data provider. A farmer is searching for information about the crop: "${cropName}".
Provide comprehensive, scientifically accurate details about this crop in a strict JSON format. 
DO NOT include markdown formatting like \`\`\`json. The JSON must match this structure exactly:
{
  "name": "Crop Name (English)",
  "nameHi": "Crop Name (Hindi)",
  "emoji": "🌱", // Appropriate single emoji for this crop
  "season": "kharif", // Must be strictly one of: "kharif", "rabi", or "zaid"
  "soil": "Description of ideal soil (English)",
  "water": "Water requirements (English)",
  "temp": "Ideal temperature range e.g. 20-30°C",
  "duration": "Growth duration e.g. 100-120 days",
  "durationHi": "Growth duration in Hindi e.g. 100-120 दिन",
  "pests": ["Pest 1", "Pest 2"], // Array of strings (English)
  "fertilizer": ["Fertilizer 1", "Fertilizer 2"], // Array of strings (English)
  "irrigation": ["Method 1", "Method 2"], // Array of strings (English)
  "tags": ["Tag1", "Tag2"], // English search tags
  "tagsHi": ["टैग1", "टैग2"] // Hindi search tags
}
Ensure the data is accurate for Indian farming conditions.`

    const result = await aiModel.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.1, // Very low temperature for strict JSON
      }
    })
    
    let responseText = result.response.text()
    responseText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    
    return JSON.parse(responseText)
  } catch (err) {
    console.error('Failed to generate crop from AI:', err.message)
    return null
  }
}

export default { getAIResponse, getMandiRatesFromAI, generateCropDetails }

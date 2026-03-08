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

export const getAIResponse = async (message, chatHistory = []) => {
  const aiModel = initializeAI()

  if (!aiModel) {
    // Fallback when API key is not configured
    return getFallbackResponse(message)
  }

  try {
    // Build chat history for context
    const history = chatHistory.slice(-10).map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }],
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

    const result = await chat.sendMessage(message)
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

export default { getAIResponse }

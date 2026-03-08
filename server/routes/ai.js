import express from 'express'
import { getAIResponse } from '../services/aiService.js'
import ChatHistory from '../models/ChatHistory.js'
import { optionalAuth } from '../middleware/authMiddleware.js'

const router = express.Router()

// ── POST /api/ai/chat ──────────────────────────────────────
router.post('/chat', optionalAuth, async (req, res) => {
  try {
    const { message, sessionId } = req.body

    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Message is required.' })
    }

    // Get or create chat history
    const sid = sessionId || `anon_${Date.now()}`
    let chatHistory = await ChatHistory.findOne({ sessionId: sid })

    if (!chatHistory) {
      chatHistory = new ChatHistory({
        user: req.user?._id || null,
        sessionId: sid,
        messages: [],
      })
    }

    // Add user message to history
    chatHistory.messages.push({
      role: 'user',
      content: message.trim(),
    })

    // Get AI response
    const aiResponse = await getAIResponse(message.trim(), chatHistory.messages)

    // Add AI response to history
    chatHistory.messages.push({
      role: 'assistant',
      content: aiResponse,
    })

    // Keep only last 50 messages
    if (chatHistory.messages.length > 50) {
      chatHistory.messages = chatHistory.messages.slice(-50)
    }

    await chatHistory.save()

    res.json({
      success: true,
      response: aiResponse,
      sessionId: sid,
    })
  } catch (err) {
    console.error('AI Chat error:', err)
    res.status(500).json({ error: 'AI service temporarily unavailable. Please try again.' })
  }
})

// ── GET /api/ai/history ────────────────────────────────────
router.get('/history', optionalAuth, async (req, res) => {
  try {
    const { sessionId } = req.query

    if (!sessionId) {
      return res.status(400).json({ error: 'Session ID is required.' })
    }

    const chatHistory = await ChatHistory.findOne({ sessionId })

    res.json({
      messages: chatHistory?.messages || [],
    })
  } catch (err) {
    console.error('Chat history error:', err)
    res.status(500).json({ error: 'Failed to fetch chat history.' })
  }
})

export default router

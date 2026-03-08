import express from 'express'
import Thread from '../models/Thread.js'
import Answer from '../models/Answer.js'
import { protect, optionalAuth } from '../middleware/authMiddleware.js'

const router = express.Router()

// ── GET /api/community/threads ─────────────────────────────
router.get('/threads', async (req, res) => {
  try {
    const { category, search, page = 1, limit = 20 } = req.query
    const filter = {}

    if (category && category !== 'all') {
      filter.category = category
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { titleHi: { $regex: search, $options: 'i' } },
        { body: { $regex: search, $options: 'i' } },
      ]
    }

    const skip = (parseInt(page) - 1) * parseInt(limit)
    const threads = await Thread.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('author', 'name phone')

    const total = await Thread.countDocuments(filter)

    res.json({ threads, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) })
  } catch (err) {
    console.error('Threads fetch error:', err)
    res.status(500).json({ error: 'Failed to fetch threads.' })
  }
})

// ── GET /api/community/threads/:id ─────────────────────────
router.get('/threads/:id', async (req, res) => {
  try {
    const thread = await Thread.findById(req.params.id).populate('author', 'name phone')
    if (!thread) {
      return res.status(404).json({ error: 'Thread not found.' })
    }

    // Increment views
    thread.views += 1
    await thread.save()

    const answers = await Answer.find({ thread: thread._id })
      .sort({ votes: -1, createdAt: -1 })
      .populate('author', 'name phone')

    res.json({ thread, answers })
  } catch (err) {
    console.error('Thread fetch error:', err)
    res.status(500).json({ error: 'Failed to fetch thread.' })
  }
})

// ── POST /api/community/threads ────────────────────────────
router.post('/threads', protect, async (req, res) => {
  try {
    const { title, titleHi, body, bodyHi, tags, tagsHi, category } = req.body

    if (!title || !body) {
      return res.status(400).json({ error: 'Title and body are required.' })
    }

    const thread = await Thread.create({
      title,
      titleHi: titleHi || '',
      body,
      bodyHi: bodyHi || '',
      author: req.user._id,
      authorName: req.user.name || 'Farmer',
      tags: tags || [],
      tagsHi: tagsHi || [],
      category: category || 'general',
    })

    res.status(201).json({ success: true, thread })
  } catch (err) {
    console.error('Thread create error:', err)
    res.status(500).json({ error: 'Failed to create thread.' })
  }
})

// ── POST /api/community/threads/:id/vote ───────────────────
router.post('/threads/:id/vote', async (req, res) => {
  try {
    const { direction } = req.body // 1 or -1
    const thread = await Thread.findById(req.params.id)

    if (!thread) {
      return res.status(404).json({ error: 'Thread not found.' })
    }

    thread.votes += direction === 1 ? 1 : -1
    await thread.save()

    res.json({ success: true, votes: thread.votes })
  } catch (err) {
    console.error('Vote error:', err)
    res.status(500).json({ error: 'Failed to vote.' })
  }
})

// ── POST /api/community/threads/:id/answers ────────────────
router.post('/threads/:id/answers', protect, async (req, res) => {
  try {
    const { body, bodyHi } = req.body
    const thread = await Thread.findById(req.params.id)

    if (!thread) {
      return res.status(404).json({ error: 'Thread not found.' })
    }

    if (!body) {
      return res.status(400).json({ error: 'Answer body is required.' })
    }

    const answer = await Answer.create({
      thread: thread._id,
      body,
      bodyHi: bodyHi || '',
      author: req.user._id,
      authorName: req.user.name || 'Farmer',
    })

    // Update answer count
    thread.answerCount += 1
    await thread.save()

    res.status(201).json({ success: true, answer })
  } catch (err) {
    console.error('Answer create error:', err)
    res.status(500).json({ error: 'Failed to post answer.' })
  }
})

// ── POST /api/community/answers/:id/vote ───────────────────
router.post('/answers/:id/vote', async (req, res) => {
  try {
    const { direction } = req.body
    const answer = await Answer.findById(req.params.id)

    if (!answer) {
      return res.status(404).json({ error: 'Answer not found.' })
    }

    answer.votes += direction === 1 ? 1 : -1
    await answer.save()

    res.json({ success: true, votes: answer.votes })
  } catch (err) {
    console.error('Answer vote error:', err)
    res.status(500).json({ error: 'Failed to vote.' })
  }
})

export default router

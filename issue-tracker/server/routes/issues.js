// routes/issues.js
const express = require('express');
const router = express.Router();
const Issue = require('../models/Issue');

// @desc    Create a new issue
// @route   POST /api/issues
router.post('/', async (req, res) => {
  try {
    const issue = await Issue.create(req.body);
    res.status(201).json(issue);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// @desc    Get all issues
// @route   GET /api/issues
router.get('/', async (req, res) => {
  try {
    const issues = await Issue.find().sort({ createdAt: -1 });
    res.json(issues);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// @desc    Get single issue
// @route   GET /api/issues/:id
router.get('/:id', async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);
    
    if (!issue) {
      return res.status(404).json({ error: 'Issue not found' });
    }
    
    res.json(issue);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// @desc    Update issue
// @route   PUT /api/issues/:id
router.put('/:id', async (req, res) => {
  try {
    const issue = await Issue.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!issue) {
      return res.status(404).json({ error: 'Issue not found' });
    }
    
    res.json(issue);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// @desc    Delete issue
// @route   DELETE /api/issues/:id
router.delete('/:id', async (req, res) => {
  try {
    const issue = await Issue.findByIdAndDelete(req.params.id);
    
    if (!issue) {
      return res.status(404).json({ error: 'Issue not found' });
    }
    
    res.json({ message: 'Issue deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
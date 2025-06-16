const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET /api/jobs
router.get('/', async (req, res) => {
  try {
    const jobs = await prisma.jobApplication.findMany();
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch jobs.' });
  }
});

module.exports = router;

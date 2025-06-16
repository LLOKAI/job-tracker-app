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

// POST /api/jobs
router.post('/', async (req, res) => {
  const {
    company,
    position,
    status,
    appliedDate,
    location,
    tags,
    notes,
    url
  } = req.body;

  // Basic validation
  if (!company || !position || !status || !appliedDate || !location) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  try {
    const job = await prisma.jobApplication.create({
      data: {
        company,
        position,
        status, // Must be one of the enum values: APPLIED, INTERVIEW, REJECTED, OFFER
        appliedDate: new Date(appliedDate),
        location,
        tags,
        notes,
        url
      }
    });
    res.status(201).json(job);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create job application.' });
  }
});


module.exports = router;

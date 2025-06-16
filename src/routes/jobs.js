const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { z } = require('zod');

// Define the schema for job applications using Zod
// This schema will be used for validation of incoming job application data
const jobSchema = z.object({
  company: z.string().min(1),
  position: z.string().min(1),
  status: z.enum(['APPLIED', 'INTERVIEW', 'REJECTED', 'OFFER']).optional(),
  appliedDate: z.string().optional(),
  location: z.string().min(1),
  tags: z.array(z.string()).optional(),
  notes: z.string().optional(),
  url: z.string().url().optional()
});


// GET /api/jobs
router.get('/', async (req, res) => {
  const { q, status, sort } = req.query;

  const where = {
    ...(q && {
      OR: [
        { company: { contains: q, mode: 'insensitive' } },
        { position: { contains: q, mode: 'insensitive' } },
      ],
    }),
    ...(status && { status }),
  };

  const orderBy = sort
    ? (() => {
        const [field, direction] = sort.split('_');
        return { [field]: direction };
      })()
    : { appliedDate: 'desc' };

  try {
    const jobs = await prisma.jobApplication.findMany({
      where,
      orderBy,
    });

    res.json(jobs);
  } catch (err) {
    throw new Error('Failed to fetch jobs');
  }
});

// POST /api/jobs
router.post('/', async (req, res) => {
  const parse = jobSchema.safeParse(req.body);

  if (!parse.success) {
    throw parse.error; // This will be caught by the error handler middleware
  }

  const data = parse.data;

  try {
    const job = await prisma.jobApplication.create({
      data: {
        company: data.company,
        position: data.position,
        status: data.status || 'APPLIED', // Default value
        appliedDate: data.appliedDate ? new Date(data.appliedDate) : new Date(),
        location: data.location,
        tags: data.tags || [],
        notes: data.notes,
        url: data.url
      }
    });

    res.status(201).json(job);
  } catch (err) {
    throw new Error('Server error while creating job.');
  }
});

// PUT /api/jobs/:id
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const parse = jobSchema.safeParse(req.body);

  if (!parse.success) {
    throw parse.error;
  }

  try {
    // Check if job exists
    const existing = await prisma.jobApplication.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: 'Job not found' });
    }

    const data = parse.data;

    const updatedJob = await prisma.jobApplication.update({
      where: { id },
      data: {
        company: data.company,
        position: data.position,
        status: data.status || 'APPLIED',
        appliedDate: data.appliedDate ? new Date(data.appliedDate) : new Date(),
        location: data.location,
        tags: data.tags || [],
        notes: data.notes,
        url: data.url
      }
    });

    res.json(updatedJob);
  } catch (err) {
    throw new Error('Failed to update job application.');
  }
});

// DELETE /api/jobs/:id
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  // Check if job exists
  const existing = await prisma.jobApplication.findUnique({ where: { id } });
  if (!existing) {
    return res.status(404).json({ error: 'Job not found' });
  }

  try {
    await prisma.jobApplication.delete({ where: { id } });
    // 204 No Content on successful deletion
    res.status(204).send();
  } catch (err) {
    throw new Error('Failed to delete job application.');
  }
});





module.exports = router;

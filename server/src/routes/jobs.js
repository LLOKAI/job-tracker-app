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
  const { q, status, sort, page = 1, limit = 10 } = req.query;

  const where = {
    ...(q && {
      OR: [
        { company: { contains: q, mode: 'insensitive' } },
        { position: { contains: q, mode: 'insensitive' } },
        { tags: { has: q } }, // <-- Add this line to search tags
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

  const skip = (Number(page) - 1) * Number(limit);
  const take = Number(limit);

  try {
    const [jobs, total] = await Promise.all([
      prisma.jobApplication.findMany({
        where,
        orderBy,
        skip,
        take,
      }),
      prisma.jobApplication.count({ where }),
    ]);

    res.json({
      data: jobs,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    throw new Error('Failed to fetch paginated jobs');
  }
});

  // GET /api/jobs/:id - fetch one job by id
  router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
      const job = await prisma.jobApplication.findUnique({
        where: { id }
      });

      if (!job) {
        return res.status(404).json({ error: 'Job not found' });
      }

      res.json(job);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch job' });
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
    const existing = await prisma.jobApplication.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: 'Job not found' });
    }

    const data = parse.data;

    // If status changed, record transition
    if (existing.status !== data.status) {
      await prisma.jobStatusTransition.create({
        data: {
          jobId: id,
          from: existing.status,
          to: data.status,
        }
      });
    }

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

// GET /api/jobs/transitions/all - fetch all status transitions
router.get('/transitions/all', async (req, res) => {
  try {
    const transitions = await prisma.jobStatusTransition.findMany();
    res.json({ data: transitions });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch transitions' });
  }
});



module.exports = router;

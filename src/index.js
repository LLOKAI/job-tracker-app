const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const jobsRouter = require('./routes/jobs');

const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Job Tracker API is running!');
});

app.use('/api/jobs', jobsRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});

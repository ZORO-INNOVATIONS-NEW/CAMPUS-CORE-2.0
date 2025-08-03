//analytics routes

import express from 'express';
import { getAnalyticsData, generateReport } from '../lib/analytics';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const data = await getAnalyticsData();
    res.json(data || { error: "No analytics data found" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/report', async (req, res) => {
  try {
    const report = await generateReport();
    res.json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
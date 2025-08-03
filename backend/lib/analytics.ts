//Analytics controller (new file)
import { Analytics } from '#lib/db.ts';

export const getAnalyticsData = async () => {
  return await Analytics.findOne().sort({ createdAt: -1 });
};

export const generateReport = async () => {
  // Mock report generation
  return { message: "Report generated!" };
};
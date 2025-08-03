//Analytics controller (new file)
import { Analytics } from '#lib/db';

export const getAnalyticsData = async () => {
  return await Analytics.findOne().sort({ createdAt: -1 });
};

export const generateReport = async () => {
  // Mock report generation
  return { message: "Report generated!" };
};
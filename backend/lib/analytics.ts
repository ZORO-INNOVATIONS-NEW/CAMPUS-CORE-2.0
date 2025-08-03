//Analytics controller (new file)
import { Analytics } from '#lib/db.ts';

export const getAnalyticsData = async () => {
  return await Analytics.findOne().sort({ createdAt: -1 });
};

export const generateReport = async () => {
  return { message: "Report generated!" };
};
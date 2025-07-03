import express from 'express';
import * as db from '#lib/db.ts';

import * as controllers from '#controllers/admin/course.ts';

const router = express.Router();

router.post('/create-course',controllers.adminCourse);

router.patch('/update-course/:id', async (req, res) => {
  try {
    const success = await db.update_course(req.params.id, req.body);
    res.json({ success });
  } catch (err) {
if (err instanceof Error) {
  res.status(400).json({ error: err.message });
} else {
  res.status(400).json({ error: 'Unknown error occurred' });
}  }
});

export default router;

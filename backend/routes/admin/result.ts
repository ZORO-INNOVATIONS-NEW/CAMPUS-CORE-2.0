// C:\Users\chandhu\OneDrive\Desktop\SUCCESS\backend\routes\admin\result.ts

import { Router, Request, Response } from 'express';
import * as db from '#lib/db';
import { admin_only } from '#lib/middlewares';
import { z } from 'zod';
import mongoose from 'mongoose';

// Define a custom Request type
interface CustomRequest extends Request {
  user?: db.User; // If admin_only middleware adds a user object
}

const router = Router();

// Zod schemas for validation
const CourseResultSchema = z.object({
  course_id: z.string().nonempty('Course ID is required.'),
  grade: z.string().nonempty('Grade is required.'),
  marks: z.number().min(0).max(100).optional(), // Assuming marks are 0-100
});

const CreateResultRecordSchema = z.object({
  student_id: z.string().nonempty('Student ID is required.'),
  semester: z.number().int().min(1).max(8, 'Semester must be between 1 and 8.'),
  academic_year: z.string().regex(/^[0-9]{4}-[0-9]{4}$/, 'Academic year must be in YYYY-YYYY format (e.g., 2024-2025).'),
  course_results: z.array(CourseResultSchema).optional(), // Can be empty on creation
  gpa: z.number().min(0.0).max(4.0).optional(), // Assuming 4.0 scale
});

const UpdateResultRecordSchema = z.object({
  semester: z.number().int().min(1).max(8, 'Semester must be between 1 and 8.').optional(),
  academic_year: z.string().regex(/^[0-9]{4}-[0-9]{4}$/, 'Academic year must be in YYYY-YYYY format (e.g., 2024-2025).').optional(),
  course_results: z.array(CourseResultSchema).optional(),
  gpa: z.number().min(0.0).max(4.0).optional(),
  published_date: z.string().datetime('Published date must be a valid ISO 8601 date string.').optional(),
}).refine(data => Object.keys(data).length > 0, { message: "At least one field must be provided for update." });

/**
 * @route POST /api/v1/admin/result
 * @description Create a new result record for a student.
 * @access Admin Only
 */
router.post('/result', admin_only, async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    const parsedBody = CreateResultRecordSchema.safeParse(req.body);

    if (!parsedBody.success) {
      res.status(400).json({ error: 'Invalid input data', details: parsedBody.error.errors });
      return;
    }

    const { student_id, semester, academic_year, course_results, gpa } = parsedBody.data;

    // Validate student_id is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(student_id)) {
      res.status(400).json({ error: 'Invalid Student ID format.' });
      return;
    }

    // Check if student exists and is of type 'student'
    const student = await db.UserModel.findById(student_id);
    if (!student || student.type !== 'student') {
      res.status(404).json({ error: 'Student not found or is not a valid student type.' });
      return;
    }

    // Validate course_ids exist if provided
    if (course_results) {
      for (const cr of course_results) {
        if (!mongoose.Types.ObjectId.isValid(cr.course_id)) {
          res.status(400).json({ error: `Invalid Course ID format for course: ${cr.course_id}` });
          return;
        }
        const course = await db.CourseModel.findById(cr.course_id);
        if (!course) {
          res.status(404).json({ error: `Course with ID ${cr.course_id} not found.` });
          return;
        }
      }
    }

    const newResultRecord = await db.createResultRecord({
      student_id: new mongoose.Types.ObjectId(student_id),
      semester,
      academic_year,
      course_results: course_results ? course_results.map(cr => ({
        ...cr,
        course_id: new mongoose.Types.ObjectId(cr.course_id)
      })) : [],
      gpa,
    });

    res.status(201).json({ message: 'Result record created successfully', resultId: newResultRecord._id?.toString() });
  } catch (error: any) {
    console.error('Error creating result record:', error);
    if (error.message && error.message.includes('already exists')) {
      res.status(409).json({ error: error.message });
      return;
    }
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

/**
 * @route PUT /api/v1/admin/result/:resultId
 * @description Update an existing result record (e.g., add/modify course grades, GPA).
 * @access Admin Only
 */
router.put('/:resultId', admin_only, async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    const resultId = req.params.resultId;
    if (!mongoose.Types.ObjectId.isValid(resultId)) {
      res.status(400).json({ error: 'Invalid Result ID format.' });
      return;
    }

    const parsedBody = UpdateResultRecordSchema.safeParse(req.body);

    if (!parsedBody.success) {
      res.status(400).json({ error: 'Invalid update data', details: parsedBody.error.errors });
      return;
    }

    const updateData: any = { ...parsedBody.data };

    // Validate and convert course_results if provided
    if (updateData.course_results) {
      for (const cr of updateData.course_results) {
        if (!mongoose.Types.ObjectId.isValid(cr.course_id)) {
          res.status(400).json({ error: `Invalid Course ID format for course: ${cr.course_id}` });
          return;
        }
        const course = await db.CourseModel.findById(cr.course_id);
        if (!course) {
          res.status(404).json({ error: `Course with ID ${cr.course_id} not found.` });
          return;
        }
        cr.course_id = new mongoose.Types.ObjectId(cr.course_id); // Convert to ObjectId
      }
    }

    if (updateData.published_date) {
      updateData.published_date = new Date(updateData.published_date);
    }

    const updated = await db.updateResultRecord(resultId, updateData);

    if (updated) {
      res.status(200).json({ message: 'Result record updated successfully.' });
    } else {
      res.status(404).json({ error: 'Result record not found or no changes made.' });
    }
  } catch (error: any) {
    console.error('Error updating result record:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

/**
 * @route GET /api/v1/admin/result
 * @description Get all result records.
 * @access Admin Only
 */
router.get('/', admin_only, async (req: CustomRequest, res: Response) => {
  try {
    const results = await db.getAllResults();
    res.status(200).json(results.map(result => ({
      _id: result._id?.toString(),
      student_id: (result.student_id as any)?._id?.toString?.() || result.student_id?.toString?.() || 'N/A',
      student_name: (result.student_id as any)?.name || 'N/A', // Populated student name
      student_rollno: (result.student_id as any)?.rollno || 'N/A', // Populated student rollno
      semester: result.semester,
      academic_year: result.academic_year,
      course_results: result.course_results.map(cr => ({
        course_id: (cr.course_id as any)?._id?.toString?.() || cr.course_id?.toString?.() || 'N/A',
        course_title: (cr.course_id as any)?.title || 'N/A',
        grade: cr.grade,
        marks: cr.marks
      })),
      gpa: result.gpa,
      published_date: result.published_date
    })));
  } catch (error: any) {
    console.error('Error fetching all result records:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

/**
 * @route GET /api/v1/admin/result/:resultId
 * @description Get a specific result record by ID.
 * @access Admin Only
 */
router.get('/:resultId', admin_only, async (req: CustomRequest, res: Response) => {
  try {
    const resultId = req.params.resultId;
    if (!mongoose.Types.ObjectId.isValid(resultId)) {
      res.status(400).json({ error: 'Invalid Result ID format.' });
      return;
    }

    const resultRecord = await db.getResultRecordById(resultId);

    if (!resultRecord) {
      res.status(404).json({ message: 'Result record not found.' });
      return;
    }

    res.status(200).json({
      _id: resultRecord._id?.toString(),
      student_id: (resultRecord.student_id as any)?._id?.toString?.() || resultRecord.student_id?.toString?.() || 'N/A',
      student_name: (resultRecord.student_id as any)?.name || 'N/A',
      student_rollno: (resultRecord.student_id as any)?.rollno || 'N/A',
      semester: resultRecord.semester,
      academic_year: resultRecord.academic_year,
      course_results: resultRecord.course_results.map(cr => ({
        course_id: (cr.course_id as any)?._id?.toString?.() || cr.course_id?.toString?.() || 'N/A',
        course_title: (cr.course_id as any)?.title || 'N/A',
        grade: cr.grade,
        marks: cr.marks
      })),
      gpa: resultRecord.gpa,
      published_date: resultRecord.published_date
    });
  } catch (error: any) {
    console.error('Error fetching specific result record:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

/**
 * @route DELETE /api/v1/admin/result/:resultId
 * @description Delete a result record.
 * @access Admin Only
 */
router.delete('/:resultId', admin_only, async (req: CustomRequest, res: Response) => {
  try {
    const resultId = req.params.resultId;
    if (!mongoose.Types.ObjectId.isValid(resultId)) {
      res.status(400).json({ error: 'Invalid Result ID format.' });
      return;
    }

    const deleted = await db.deleteResultRecord(resultId);

    if (deleted) {
      res.status(200).json({ message: 'Result record deleted successfully.' });
    } else {
      res.status(404).json({ error: 'Result record not found.' });
    }
  } catch (error: any) {
    console.error('Error deleting result record:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

export default router;

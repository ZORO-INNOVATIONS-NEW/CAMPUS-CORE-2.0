import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';

import { faculty_only, admin_only, student_only } from '#lib/middlewares.ts';

import admin_roles from '#routes/admin/roles.ts';
import login from '#routes/login.ts';
import user_info from '#routes/user_info.ts';
import verify_email from '#routes/verify_email.ts';
import admin_create_user from '#routes/admin/create_user.ts';
import admin_course from '#routes/admin/course.ts';
import admin_fee from '#routes/admin/fee.ts';
import admin_result from '#routes/admin/result.ts';

import student_login from '#routes/student/login.ts';
import student_course from '#routes/student/course.ts';
import student_fee from '#routes/student/fee.ts';
import student_result from '#routes/student/results.ts';

import faculty_attendance from '#routes/faculty/attendance.ts';
import analyticsRoutes from '#routes/analytics.ts';
import * as auth_flow_demo_router from '#routes/auth_flow_demo.ts';

import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './swagger/swaggerConfig';

import * as db from '#lib/db.ts';
import * as auth from '#lib/auth.ts';

// Optional custom fallback
import fallbackHandler from './lib/fallback.ts';

const app = express();

// Middleware setup
app.use(cookieParser());
app.use(express.json());

// Swagger UI
app.use('/api/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// General Routes
app.use('/api/v1', login);
app.use('/api/v1', user_info);
app.use('/api/v1', verify_email);

// 👨‍🎓 Student Routes
app.use('/api/v1/student/login', student_login);
app.use('/api/v1/student/fee', student_only, student_fee);
app.use('/api/v1/student/result', student_only, student_result);
app.use('/api/v1/student', student_only, student_course);

// 👩‍🏫 Faculty Routes
app.use('/api/v1/faculty', faculty_only, faculty_attendance);

// 👮‍♂️ Admin Routes
app.use('/api/v1/admin', admin_only, admin_create_user);
app.use('/api/v1/admin', admin_only, admin_course);
app.use('/api/v1/admin', admin_only, admin_fee);
app.use('/api/v1/admin', admin_only, admin_result);
app.use('/api/v1/admin/roles', admin_only, admin_roles);

// Demo route
app.use('/api/v1/demo', auth_flow_demo_router.default);

// Analytics
app.use('/api/analytics', analyticsRoutes);

// Protected test route
app.get('/api/v1/protected', student_only, (req, res) => {
  res.json({ message: 'You have accessed a protected route!', user: (req as any).user });
});

// 404 Fallback (custom or default)
app.use(fallbackHandler); // If using custom fallback (already imported)

// If not using fallbackHandler.ts, uncomment this:
// app.use((req, res) => {
//   res.status(404).json({ error: 'Route not found', path: req.originalUrl });
// });

// Global Error Handler
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URL as string)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1);
  });

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Express running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

import 'dotenv/config';
import express from 'express';
import cookieParser from 'cookie-parser';

// Middlewares
import { faculty_only, admin_only, student_only } from './lib/middlewares';

// Auth and user routes
import login from './routes/login';
import user_info from './routes/user_info';

// Admin routes
import admin_create_user from './routes/admin/create_user';
import admin_course from './routes/admin/course';
import admin_fee from './routes/admin/fee';
import admin_result from './routes/admin/result';

// Student routes
import student_login from './routes/student/login';
import student_course from './routes/student/course';
import student_fee from './routes/student/fee';
import student_result from './routes/student/results';

// Faculty routes
import faculty_attendance from './routes/faculty/attendance';

// Database and auth
import * as db from './lib/db';
import * as auth from './lib/auth';

// Demo route for full login/token/role flow
import * as auth_flow_demo from './routes/auth_flow_demo';

const app = express();

// Middleware setup
app.use(cookieParser());
app.use(express.json());

// General routes (must come before specific role routes to avoid conflicts)
app.use('/api/v1', login);
app.use('/api/v1', user_info);

// Student routes (more specific routes first)
app.use('/api/v1/student/login', student_login);
app.use('/api/v1/student/fee', student_only, student_fee);
app.use('/api/v1/student/result', student_only, student_result);
app.use('/api/v1/student', student_only, student_course);

// Faculty routes
app.use('/api/v1/faculty', faculty_only, faculty_attendance);

// Admin routes
app.use('/api/v1/admin', admin_only, admin_create_user);
app.use('/api/v1/admin', admin_only, admin_course);
app.use('/api/v1/admin', admin_only, admin_fee);
app.use('/api/v1/admin', admin_only, admin_result);

// Demo route for full login/token/role flow
import * as auth_flow_demo_router from './routes/auth_flow_demo';
app.use('/api/v1/demo', auth_flow_demo_router.default);


app.get('/api/v1/protected', student_only, (req, res) => {
  res.json({ message: 'You have accessed a protected route!', user: (req as any).user });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Route not found', 
    path: req.originalUrl 
  });
});

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Internal Server Error' 
  });
});

// Server startup
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});


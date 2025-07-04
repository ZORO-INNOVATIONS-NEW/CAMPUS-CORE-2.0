// // C:\Users\chandhu\OneDrive\Desktop\SUCCESS\backend\lib\db.ts

// import mongoose from 'mongoose';
// // Update this import to match the actual export from '#lib/auth'
// import decodeJwt from './auth'; // Use default import since decodeJwt is the default export

// // Ensure MONGODB_URL is loaded from .env
// if (!process.env.MONGODB_URL) {
//   console.error("MONGODB_URL is not defined in .env file. Please create a .env file.");
//   process.exit(1); // Exit if essential environment variable is missing
// }

// await mongoose.connect(process.env.MONGODB_URL!);

// export interface User {
//   _id?: string;
//   rollno?: string;
//   email: string;
//   pass_hash: string;
//   name: string;
//   type: 'student' | 'faculty' | 'admin';
//   courses?: mongoose.Types.ObjectId[];
// }

// const UserSchema = new mongoose.Schema<User>({
//   email: { type: String, required: true, unique: true, lowercase: true },
//   pass_hash: { type: String, required: true },
//   name: { type: String, required: true },
//   rollno: { type: String, required: false, unique: true, sparse: true, uppercase: true },
//   type: { type: String, required: true, enum: ['student', 'faculty', 'admin'] },
//   courses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'courses' }],
// });

// export const UserModel = mongoose.model<User>('users', UserSchema);

// /////////////////////////////////////////////////////////////////////////////
// // COURSE SCHEMA

// export interface Course {
//   _id?: string;
//   title: string;
//   description: string;
//   resource_link: string;
//   attendance_needed: boolean;
// }

// const CourseSchema = new mongoose.Schema<Course>({
//   title: { type: String, required: true },
//   description: { type: String, required: true },
//   resource_link: { type: String, required: false },
//   attendance_needed: { type: Boolean, required: true, default: false },
// });

// const CourseModel = mongoose.model<Course>('courses', CourseSchema);


// /////////////////////////////////////////////////////////////////////////////
// // ATTENDANCE SCHEMA

// export interface Attendance {
//   _id?: string;
//   course_id: string;
//   student_id: string;
//   date: Date;
//   marked_by: string;
// }

// const AttendanceSchema = new mongoose.Schema({
//   course_id: { type: mongoose.Schema.Types.ObjectId, ref: 'courses', required: true },
//   student_id: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
//   date: { type: Date, required: true },
//   marked_by: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
// });

// const AttendanceModel = mongoose.model<Attendance>('attendances', AttendanceSchema);


// /////////////////////////////////////////////////////////////////////////////
// // COURSE & ATTENDANCE FUNCTIONS

// export async function create_course(data: Course): Promise<string> {
//   const course = new CourseModel(data);
//   const saved = await course.save();
//   return saved._id!.toString();
// }

// export async function update_course(course_id: string, data: Partial<Course>): Promise<boolean> {
//   const updated = await CourseModel.findByIdAndUpdate(course_id, data);
//   return !!updated;
// }

// export async function register_student_to_course(student_id: string, course_id: string): Promise<boolean> {
//   const course = await CourseModel.findById(course_id);
//   if (!course) throw new Error("Course not found");
//   const result = await UserModel.updateOne(
//     { _id: student_id },
//     { $addToSet: { courses: course._id } }
//   );
//   if (result.modifiedCount === 0) {
//     throw new Error("Student is already registered or update failed");
//   }
//   return true;
// }

// export async function mark_attendance(course_id: string, student_id: string, date: Date, marked_by: string): Promise<string> {
//   const exists = await AttendanceModel.findOne({ course_id, student_id, date });
//   if (exists) throw new Error("Attendance already marked for this date");

//   const attendance = new AttendanceModel({ course_id, student_id, date, marked_by });
//   const saved = await attendance.save();
//   return saved._id!.toString();
// }
// /////////////////////////////////////////////////////////////////////////////

// export async function add_user(user: User): Promise<string> {
//   const newdoc = await UserModel.create(user);
//   return newdoc._id;
// }

// /////////////////////////////////////////////////////////////////////////////

// export async function update_email(userid: string, email: string) {
//   await UserModel.findOneAndUpdate({ userid }, { email }, { runValidators: true }).exec();
// }

// export async function update_pass_hash(userid: string, pass_hash: string) {
//   await UserModel.findOneAndUpdate({ _id: userid }, { pass_hash }, { runValidators: true }).exec();
// }

// /////////////////////////////////////////////////////////////////////////////

// export function get_user_from_uid(uid: string): Promise<User | null> {
//   return UserModel.findOne({ _id: uid }).lean<User>().exec();
// }

// export function get_user_from_email(email: string): Promise<User | null> {
//   return UserModel.findOne({ email }).lean<User>().exec();
// }

// export function get_user_from_rollno(rollno: string): Promise<User | null> {
//   return UserModel.findOne({ rollno }).lean<User>().exec();
// }

// /////////////////////////////////////////////////////////////////////////////

// // Use the correct function name as exported by your auth module
// // This function retrieves a user from a JWT token
// export async function get_user_from_token(token: string): Promise<User | null> {
//   if (token) {
//     const data = decodeJwt(token);
//     if (data && data.uid) {
//       const user = await get_user_from_uid(data.uid);
//       if (user) {
//         return user;
//       }
//     }
//   }

//   return null;
// }


// /////////////////////////////////////////////////////////////////////////////
// // FEE SCHEMA (UPDATED based on your provided schema)

// export interface Fee {
//   _id?: mongoose.Types.ObjectId; // Use mongoose.Types.ObjectId for _id
//   student_id: mongoose.Types.ObjectId; // Changed to ObjectId
//   semester: number;
//   academic_year: string;
//   total_amount: number;
//   paid_amount: number;
//   payment_status: 'paid' | 'unpaid' | 'partial';
//   due_date: Date;
//   payment_history: {
//     amount: number;
//     payment_date: Date;
//     transaction_id: string;
//     payment_method: string;
//   }[];
// }

// const FeeSchema = new mongoose.Schema<Fee>({
//   student_id: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
//   semester: { type: Number, required: true, min: 1, max: 8 },
//   academic_year: { type: String, required: true },
//   total_amount: { type: Number, required: true, min: 0 },
//   paid_amount: { type: Number, required: true, default: 0, min: 0 },
//   payment_status: {
//     type: String,
//     required: true,
//     enum: ['paid', 'unpaid', 'partial'],
//     default: 'unpaid'
//   },
//   due_date: { type: Date, required: true },
//   payment_history: [{
//     amount: { type: Number, required: true },
//     payment_date: { type: Date, required: true, default: Date.now },
//     transaction_id: { type: String, required: true },
//     payment_method: { type: String, required: true, enum: ['credit_card', 'debit_card', 'net_banking', 'upi', 'cash'] }
//   }]
// });

// export const FeeModel = mongoose.model<Fee>('fees', FeeSchema);

// /////////////////////////////////////////////////////////////////////////////
// // FEE FUNCTIONS (UPDATED and integrated from your provided functions)

// /**
//  * Creates a new fee record.
//  * @param data Omit<Fee, 'payment_status' | 'paid_amount' | 'payment_history'>
//  */
// export async function createFeeRecord(data: Omit<Fee, '_id' | 'payment_status' | 'paid_amount' | 'payment_history'>): Promise<Fee> {
//   // Check for existing fee record for the same student, semester, academic_year
//   const existingFee = await FeeModel.findOne({
//     student_id: data.student_id,
//     semester: data.semester,
//     academic_year: data.academic_year
//   }).exec();

//   if (existingFee) {
//     throw new Error(`Fee record for student ${data.student_id} for semester ${data.semester} in ${data.academic_year} already exists.`);
//   }

//   const fee = new FeeModel({
//     ...data,
//     paid_amount: 0,
//     payment_status: 'unpaid',
//     payment_history: []
//   });
//   const saved = await fee.save();
//   return saved;
// }

// /**
//  * Records a payment for a specific fee record.
//  * @param feeId The ID of the fee record.
//  * @param amount The amount paid.
//  * @param transactionId The transaction ID.
//  * @param method The payment method.
//  */
// export async function recordPayment(feeId: string, amount: number, transactionId: string, method: string): Promise<Fee> {
//   const fee = await FeeModel.findById(feeId);
//   if (!fee) throw new Error("Fee record not found.");

//   if (amount <= 0) {
//     throw new Error("Payment amount must be positive.");
//   }

//   fee.paid_amount += amount;
//   fee.payment_status = fee.paid_amount >= fee.total_amount ? 'paid' : fee.paid_amount > 0 ? 'partial' : 'unpaid';
//   fee.payment_history.push({ amount, payment_date: new Date(), transaction_id: transactionId, payment_method: method });

//   await fee.save();
//   return fee;
// }

// /**
//  * Gets all fee records for a specific student.
//  * @param studentId The ID of the student.
//  */
// export async function getStudentFees(studentId: string): Promise<Fee[]> {
//   return FeeModel.find({ student_id: new mongoose.Types.ObjectId(studentId) }).lean().exec();
// }

// /**
//  * Gets the current semester's fee record for a student (based on nearest future due date).
//  * This function should ideally be passed the current academic year and semester explicitly,
//  * but for simplicity, it finds the next upcoming fee.
//  * @param studentId The ID of the student.
//  */
// export async function getCurrentSemesterFee(studentId: string): Promise<Fee | null> {
//   // Find fee records for the student that are not yet fully paid
//   return FeeModel.findOne({
//     student_id: new mongoose.Types.ObjectId(studentId),
//     payment_status: { $in: ['unpaid', 'partial'] } // Only consider unpaid or partially paid fees
//   })
//   .sort({ due_date: 1 }) // Sort by due date ascending to get the nearest upcoming one
//   .lean<Fee>()
//   .exec();
// }

// /**
//  * Retrieves a single fee record by its ID.
//  * @param feeId The ID of the fee record.
//  */
// export async function getFeeRecordById(feeId: string): Promise<Fee | null> {
//   return FeeModel.findById(feeId).lean<Fee>().exec();
// }

// /**
//  * Retrieves all fee records (for admin).
//  */
// export async function getAllFeeRecords(): Promise<Fee[]> {
//   return FeeModel.find().lean().exec();
// }

// /**
//  * Updates an existing fee record (admin only).
//  * Note: paid_amount, payment_status, and payment_history should only be modified via recordPayment.
//  * @param feeId The ID of the fee record.
//  * @param data Partial fee data to update.
//  */
// export async function updateFeeRecord(feeId: string, data: Partial<Omit<Fee, '_id' | 'student_id' | 'paid_amount' | 'payment_status' | 'payment_history'>>): Promise<boolean> {
//   const updated = await FeeModel.findByIdAndUpdate(feeId, data, { new: true, runValidators: true });
//   return !!updated;
// }

// /**
//  * Deletes a fee record by its ID (admin only).
//  * @param feeId The ID of the fee record to delete.
//  */
// export async function deleteFeeRecord(feeId: string): Promise<boolean> {
//   const deleted = await FeeModel.findByIdAndDelete(feeId);
//   return !!deleted;
// }

// /////////////////////////////////////////////////////////////////////////////
// // RESULTS SCHEMA (NEW)

// export interface CourseResult {
//   course_id: mongoose.Types.ObjectId;
//   grade: string; // e.g., 'A', 'B+', 'C', 'F', 'Pass', 'Fail'
//   marks?: number; // Optional numerical score
// }

// export interface Result {
//   _id?: mongoose.Types.ObjectId;
//   student_id: mongoose.Types.ObjectId;
//   semester: number; // e.g., 1, 2, 3...
//   academic_year: string; // e.g., "2024-2025"
//   course_results: CourseResult[];
//   gpa?: number; // Optional, calculated GPA for this semester
//   published_date: Date;
// }

// const ResultSchema = new mongoose.Schema<Result>({
//   student_id: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
//   semester: { type: Number, required: true, min: 1 },
//   academic_year: { type: String, required: true },
//   course_results: [{
//     course_id: { type: mongoose.Schema.Types.ObjectId, ref: 'courses', required: true },
//     grade: { type: String, required: true },
//     marks: { type: Number, required: false }
//   }],
//   gpa: { type: Number, required: false, min: 0.0, max: 4.0 }, // Assuming 4.0 scale
//   published_date: { type: Date, required: true, default: Date.now }
// });

// export const ResultModel = mongoose.model<Result>('results', ResultSchema);

// /////////////////////////////////////////////////////////////////////////////
// // RESULTS FUNCTIONS (NEW)

// /**
//  * Creates a new result record for a student for a specific semester and academic year.
//  * @param data Result data including student_id, semester, academic_year, and initial course results.
//  * @returns The created Result document.
//  */
// export async function createResultRecord(data: Omit<Result, '_id' | 'published_date'>): Promise<Result> {
//   const existingResult = await ResultModel.findOne({
//     student_id: data.student_id,
//     semester: data.semester,
//     academic_year: data.academic_year
//   }).exec();

//   if (existingResult) {
//     throw new Error(`Result record for student ${data.student_id} for semester ${data.semester} in ${data.academic_year} already exists.`);
//   }

//   const result = new ResultModel(data);
//   const saved = await result.save();
//   return saved;
// }

// /**
//  * Updates an existing result record, primarily for adding/modifying course results or GPA.
//  * @param resultId The ID of the result record to update.
//  * @param data Partial result data to update.
//  * @returns True if updated successfully, false otherwise.
//  */
// export async function updateResultRecord(resultId: string, data: Partial<Omit<Result, '_id' | 'student_id' | 'published_date'>>): Promise<boolean> {
//   const updated = await ResultModel.findByIdAndUpdate(resultId, data, { new: true, runValidators: true });
//   return !!updated;
// }

// /**
//  * Retrieves all result records for a specific student.
//  * @param studentId The ID of the student.
//  * @returns An array of result records.
//  */
// export async function getStudentResults(studentId: string): Promise<Result[]> {
//   return ResultModel.find({ student_id: new mongoose.Types.ObjectId(studentId) })
//     .populate('course_results.course_id', 'title') // Populate course title for display
//     .lean()
//     .exec();
// }

// /**
//  * Retrieves a specific result record for a student by semester and academic year.
//  * @param studentId The ID of the student.
//  * @param semester The semester number.
//  * @param academicYear The academic year (e.g., "2024-2025").
//  * @returns The result record or null if not found.
//  */
// export async function getStudentResultBySemester(studentId: string, semester: number, academicYear: string): Promise<Result | null> {
//   return ResultModel.findOne({
//     student_id: new mongoose.Types.ObjectId(studentId),
//     semester: semester,
//     academic_year: academicYear
//   })
//   .populate('course_results.course_id', 'title')
//   .lean<Result>()
//   .exec();
// }

// /**
//  * Retrieves a single result record by its ID.
//  * @param resultId The ID of the result record.
//  * @returns The result record or null if not found.
//  */
// export async function getResultRecordById(resultId: string): Promise<Result | null> {
//   return ResultModel.findById(resultId)
//     .populate('course_results.course_id', 'title')
//     .lean<Result>()
//     .exec();
// }

// /**
//  * Retrieves all result records (for admin view).
//  * @returns An array of all result records.
//  */
// export async function getAllResults(): Promise<Result[]> {
//   return ResultModel.find()
//     .populate('course_results.course_id', 'title')
//     .populate('student_id', 'name rollno') // Optionally populate student name and rollno
//     .lean<Result>()
//     .exec();
// }

// /**
//  * Deletes a result record by its ID (admin only).
//  * @param resultId The ID of the result record to delete.
//  * @returns True if deleted successfully, false otherwise.
//  */
// export async function deleteResultRecord(resultId: string): Promise<boolean> {
//   const deleted = await ResultModel.findByIdAndDelete(resultId);
//   return !!deleted;
// }

import mongoose from 'mongoose';
// Update this import to match the actual export from '#lib/auth'
import { jwt_decode as decodeJwt } from './auth';

// Ensure MONGODB_URL is loaded from .env
if (!process.env.MONGODB_URL) {
  console.error("MONGODB_URL is not defined in .env file. Please create a .env file.");
  process.exit(1); // Exit if essential environment variable is missing
}

await mongoose.connect(process.env.MONGODB_URL!);

export interface User {
  _id?: string;
  rollno?: string;
  email: string;
  pass_hash: string;
  name: string;
  type: 'student' | 'faculty' | 'admin';
  courses?: mongoose.Types.ObjectId[];
}

const UserSchema = new mongoose.Schema<User>({
  email: { type: String, required: true, unique: true, lowercase: true },
  pass_hash: { type: String, required: true },
  name: { type: String, required: true },
  rollno: { type: String, required: false, unique: true, sparse: true, uppercase: true },
  type: { type: String, required: true, enum: ['student', 'faculty', 'admin'] },
  courses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'courses' }],
});

export const UserModel = mongoose.model<User>('users', UserSchema);

/////////////////////////////////////////////////////////////////////////////
// COURSE SCHEMA

export interface Course {
  _id?: string;
  title: string;
  description: string;
  resource_link: string;
  attendance_needed: boolean;
}

const CourseSchema = new mongoose.Schema<Course>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  resource_link: { type: String, required: false },
  attendance_needed: { type: Boolean, required: true, default: false },
});

const CourseModel = mongoose.model<Course>('courses', CourseSchema);

export { CourseModel };

/////////////////////////////////////////////////////////////////////////////
// ATTENDANCE SCHEMA

export interface Attendance {
  _id?: string;
  course_id: string;
  student_id: string;
  date: Date;
  marked_by: string;
}

const AttendanceSchema = new mongoose.Schema({
  course_id: { type: mongoose.Schema.Types.ObjectId, ref: 'courses', required: true },
  student_id: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
  date: { type: Date, required: true },
  marked_by: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
});

const AttendanceModel = mongoose.model<Attendance>('attendances', AttendanceSchema);

/////////////////////////////////////////////////////////////////////////////
// COURSE & ATTENDANCE FUNCTIONS

export async function create_course(data: Course): Promise<string> {
  const course = new CourseModel(data);
  const saved = await course.save();
  return saved._id!.toString();
}

export async function update_course(course_id: string, data: Partial<Course>): Promise<boolean> {
  const updated = await CourseModel.findByIdAndUpdate(course_id, data);
  return !!updated;
}

export async function register_student_to_course(student_id: string, course_id: string): Promise<boolean> {
  const course = await CourseModel.findById(course_id);
  if (!course) throw new Error("Course not found");
  const result = await UserModel.updateOne(
    { _id: student_id },
    { $addToSet: { courses: course._id } }
  );
  if (result.modifiedCount === 0) {
    throw new Error("Student is already registered or update failed");
  }
  return true;
}

export async function mark_attendance(course_id: string, student_id: string, date: Date, marked_by: string): Promise<string> {
  const exists = await AttendanceModel.findOne({ course_id, student_id, date });
  if (exists) throw new Error("Attendance already marked for this date");

  const attendance = new AttendanceModel({ course_id, student_id, date, marked_by });
  const saved = await attendance.save();
  return saved._id!.toString();
}

/////////////////////////////////////////////////////////////////////////////

export async function add_user(user: User): Promise<string> {
  const newdoc = await UserModel.create(user);
  return newdoc._id.toString();
}

/////////////////////////////////////////////////////////////////////////////

export async function update_email(userid: string, email: string) {
  await UserModel.findOneAndUpdate({ _id: userid }, { email }, { runValidators: true }).exec();
}

export async function update_pass_hash(userid: string, pass_hash: string) {
  await UserModel.findOneAndUpdate({ _id: userid }, { pass_hash }, { runValidators: true }).exec();
}

/////////////////////////////////////////////////////////////////////////////

export function get_user_from_uid(uid: string): Promise<User | null> {
  return UserModel.findOne({ _id: uid }).lean<User>().exec();
}

export function get_user_from_email(email: string): Promise<User | null> {
  return UserModel.findOne({ email }).lean<User>().exec();
}

export function get_user_from_rollno(rollno: string): Promise<User | null> {
  return UserModel.findOne({ rollno }).lean<User>().exec();
}

/////////////////////////////////////////////////////////////////////////////

export async function get_user_from_token(token: string): Promise<User | null> {
  if (token) {
    const data = decodeJwt(token);
    if (data && data.uid) {
      const user = await get_user_from_uid(data.uid);
      if (user) {
        return user;
      }
    }
  }
  return null;
}

/////////////////////////////////////////////////////////////////////////////
// FEE SCHEMA

export interface Fee {
  _id?: mongoose.Types.ObjectId;
  student_id: mongoose.Types.ObjectId;
  semester: number;
  academic_year: string;
  total_amount: number;
  paid_amount: number;
  payment_status: 'paid' | 'unpaid' | 'partial';
  due_date: Date;
  payment_history: {
    amount: number;
    payment_date: Date;
    transaction_id: string;
    payment_method: string;
  }[];
}

const FeeSchema = new mongoose.Schema<Fee>({
  student_id: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
  semester: { type: Number, required: true, min: 1, max: 8 },
  academic_year: { type: String, required: true },
  total_amount: { type: Number, required: true, min: 0 },
  paid_amount: { type: Number, required: true, default: 0, min: 0 },
  payment_status: {
    type: String,
    required: true,
    enum: ['paid', 'unpaid', 'partial'],
    default: 'unpaid'
  },
  due_date: { type: Date, required: true },
  payment_history: [{
    amount: { type: Number, required: true },
    payment_date: { type: Date, required: true, default: Date.now },
    transaction_id: { type: String, required: true },
    payment_method: { type: String, required: true, enum: ['credit_card', 'debit_card', 'net_banking', 'upi', 'cash'] }
  }]
});

export const FeeModel = mongoose.model<Fee>('fees', FeeSchema);

/////////////////////////////////////////////////////////////////////////////
// FEE FUNCTIONS

export async function createFeeRecord(data: Omit<Fee, '_id' | 'payment_status' | 'paid_amount' | 'payment_history'>): Promise<Fee> {
  const existingFee = await FeeModel.findOne({
    student_id: data.student_id,
    semester: data.semester,
    academic_year: data.academic_year
  }).exec();

  if (existingFee) {
    throw new Error(`Fee record for student ${data.student_id} for semester ${data.semester} in ${data.academic_year} already exists.`);
  }

  const fee = new FeeModel({
    ...data,
    paid_amount: 0,
    payment_status: 'unpaid',
    payment_history: []
  });
  const saved = await fee.save();
  return saved;
}

export async function recordPayment(feeId: string, amount: number, transactionId: string, method: string): Promise<Fee> {
  const fee = await FeeModel.findById(feeId);
  if (!fee) throw new Error("Fee record not found.");

  if (amount <= 0) {
    throw new Error("Payment amount must be positive.");
  }

  fee.paid_amount += amount;
  fee.payment_status = fee.paid_amount >= fee.total_amount ? 'paid' : fee.paid_amount > 0 ? 'partial' : 'unpaid';
  fee.payment_history.push({ amount, payment_date: new Date(), transaction_id: transactionId, payment_method: method });

  await fee.save();
  return fee;
}

export async function getStudentFees(studentId: string): Promise<Fee[]> {
  return FeeModel.find({ student_id: new mongoose.Types.ObjectId(studentId) }).lean().exec();
}

export async function getCurrentSemesterFee(studentId: string): Promise<Fee | null> {
  return FeeModel.findOne({
    student_id: new mongoose.Types.ObjectId(studentId),
    payment_status: { $in: ['unpaid', 'partial'] }
  })
  .sort({ due_date: 1 })
  .lean<Fee>()
  .exec();
}

export async function getFeeRecordById(feeId: string): Promise<Fee | null> {
  return FeeModel.findById(feeId).lean<Fee>().exec();
}

export async function getAllFeeRecords(): Promise<Fee[]> {
  return FeeModel.find().lean().exec();
}

export async function updateFeeRecord(feeId: string, data: Partial<Omit<Fee, '_id' | 'student_id' | 'paid_amount' | 'payment_status' | 'payment_history'>>): Promise<boolean> {
  const updated = await FeeModel.findByIdAndUpdate(feeId, data, { new: true, runValidators: true });
  return !!updated;
}

export async function deleteFeeRecord(feeId: string): Promise<boolean> {
  const deleted = await FeeModel.findByIdAndDelete(feeId);
  return !!deleted;
}

/////////////////////////////////////////////////////////////////////////////
// RESULTS SCHEMA

export interface CourseResult {
  course_id: mongoose.Types.ObjectId | { _id: mongoose.Types.ObjectId; title?: string };
  grade: string;
  marks?: number;
}

export interface Result {
  _id?: mongoose.Types.ObjectId;
  student_id: mongoose.Types.ObjectId | { _id: mongoose.Types.ObjectId; name?: string; rollno?: string };
  semester: number;
  academic_year: string;
  course_results: CourseResult[];
  gpa?: number;
  published_date: Date;
  __v?: number;
  id?: string;
}

const ResultSchema = new mongoose.Schema<Result>({
  student_id: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
  semester: { type: Number, required: true, min: 1 },
  academic_year: { type: String, required: true },
  course_results: [{
    course_id: { type: mongoose.Schema.Types.ObjectId, ref: 'courses', required: true },
    grade: { type: String, required: true },
    marks: { type: Number, required: false }
  }],
  gpa: { type: Number, required: false, min: 0.0, max: 4.0 },
  published_date: { type: Date, required: true, default: Date.now }
});

export const ResultModel = mongoose.model<Result>('results', ResultSchema);

/////////////////////////////////////////////////////////////////////////////
// RESULTS FUNCTIONS

export async function createResultRecord(data: Omit<Result, '_id' | 'published_date'>): Promise<Result> {
  const existingResult = await ResultModel.findOne({
    student_id: data.student_id,
    semester: data.semester,
    academic_year: data.academic_year
  }).exec();

  if (existingResult) {
    throw new Error(`Result record for student ${data.student_id} for semester ${data.semester} in ${data.academic_year} already exists.`);
  }

  const result = new ResultModel(data);
  const saved = await result.save();
  return saved;
}

export async function updateResultRecord(resultId: string, data: Partial<Omit<Result, '_id' | 'student_id' | 'published_date'>>): Promise<boolean> {
  const updated = await ResultModel.findByIdAndUpdate(resultId, data, { new: true, runValidators: true });
  return !!updated;
}

export async function getStudentResults(studentId: string): Promise<Result[]> {
  return ResultModel.find({ student_id: new mongoose.Types.ObjectId(studentId) })
    .populate('course_results.course_id', 'title')
    .lean()
    .exec();
}

export async function getStudentResultBySemester(studentId: string, semester: number, academicYear: string): Promise<Result | null> {
  return ResultModel.findOne({
    student_id: new mongoose.Types.ObjectId(studentId),
    semester: semester,
    academic_year: academicYear
  })
  .populate('course_results.course_id', 'title')
  .lean<Result>()
  .exec();
}

export async function getResultRecordById(resultId: string): Promise<Result | null> {
  return ResultModel.findById(resultId)
    .populate('course_results.course_id', 'title')
    .lean<Result>()
    .exec();
}

export async function getAllResults(): Promise<Result[]> {
  return ResultModel.find()
    .populate('course_results.course_id', 'title')
    .populate('student_id', 'name rollno')
    .lean()
    .exec() as Promise<Result[]>;
}

export async function deleteResultRecord(resultId: string): Promise<boolean> {
  const deleted = await ResultModel.findByIdAndDelete(resultId);
  return !!deleted;
}
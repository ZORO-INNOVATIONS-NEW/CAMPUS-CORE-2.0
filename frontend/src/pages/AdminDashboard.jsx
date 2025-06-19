import React, { useState } from "react";
import Topbar from "../components/AdminDashboard/Topbar";
import Header from "../components/AdminDashboard/Header";
import Navbar from "../components/AdminDashboard/Navbar";
import CourseStats from "../components/AdminDashboard/CourseStats";
import CourseGrid from "../components/AdminDashboard/CourseGrid";
import CourseForm from "../components/AdminDashboard/CourseForm";

const AdminDashboard = () => {
  const [courses, setCourses] = useState([
    { id: 1, title: "React Basics", instructor: "John Doe" },
    { id: 2, title: "Advanced JS", instructor: "Jane Smith" },
  ]);
  const [editingCourse, setEditingCourse] = useState(null);
  const [showForm, setShowForm] = useState(false); // 👈 for toggling form

  const handleSubmit = (course) => {
    const exists = courses.find((c) => c.id === course.id);
    if (exists) {
      setCourses(courses.map((c) => (c.id === course.id ? course : c)));
    } else {
      setCourses([...courses, course]);
    }
    setEditingCourse(null);
    setShowForm(false); // 👈 hide form after submit
  };

  const handleEdit = (course) => {
    setEditingCourse(course);
    setShowForm(true); // 👈 show form when editing
  };

  const handleDelete = (id) =>
    setCourses(courses.filter((course) => course.id !== id));

  const handleAddNew = () => {
    setEditingCourse(null); // clear previous data
    setShowForm(true); // 👈 show form when Add button clicked
  };

  return (
    <div className="bg-gray-100 min-h-screen p-4">
      <Topbar />
      <Header />
      <Navbar />
      <CourseStats onAddNew={handleAddNew} />
      {showForm && (
        <CourseForm onSubmit={handleSubmit} editingCourse={editingCourse} />
      )}
      <CourseGrid courses={courses} onEdit={handleEdit} onDelete={handleDelete} />
    </div>
  );
};

export default AdminDashboard;

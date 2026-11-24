
import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { useStudents } from "../context/StudentContext";

const initialForm = {
  student_name: "",
  email: "",
  phone: "",
  course: "",
  college_name: "",
};

function Dashboard() {
  const {
    students,
    loading,
    fetchStudents,
    createStudent,
    updateStudent,
    deleteStudent,
    searchStudents,
  } = useStudents();

  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchStudents().catch((err) => {
      setError(err.response?.data?.message || "Unable to load students");
    });
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (editingId !== null) {
        await updateStudent(editingId, form);
      } else {
        await createStudent(form);
      }

      setForm(initialForm);
      setEditingId(null);
    } catch (err) {
      setError(err.response?.data?.message || "Operation failed");
    }
  };

  const handleEdit = (student) => {
    setForm({
      student_name: student.student_name,
      email: student.email,
      phone: student.phone,
      course: student.course,
      college_name: student.college_name,
    });

    setEditingId(student.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student?")) {
      return;
    }

    try {
      setError("");
      await deleteStudent(id);
    } catch (err) {
      setError(err.response?.data?.message || "Delete failed");
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();

    searchStudents(search).catch((err) => {
      setError(err.response?.data?.message || "Search failed");
    });
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
  };

  return (
    <div className="layout">
      <Sidebar />

      <main className="main-content">
        <h1>Student Dashboard</h1>
        <p>Manage your student records here.</p>

        {error && <p className="error">{error}</p>}

        <section className="panel">
          <h2>{editingId !== null ? "Update Student" : "Add Student"}</h2>

          <form onSubmit={handleSubmit} className="student-form">
            <input
              name="student_name"
              placeholder="Student Name"
              value={form.student_name}
              onChange={handleChange}
              required
            />

            <input
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
            />

            <input
              name="phone"
              placeholder="Phone Number"
              value={form.phone}
              onChange={handleChange}
              required
            />

            <input
              name="course"
              placeholder="Course"
              value={form.course}
              onChange={handleChange}
              required
            />

            <input
              name="college_name"
              placeholder="College Name"
              value={form.college_name}
              onChange={handleChange}
              required
            />

            <button type="submit">
              {editingId !== null ? "Update Student" : "Add Student"}
            </button>

            {editingId !== null && (
              <button type="button" onClick={resetForm}>
                Cancel
              </button>
            )}
          </form>
        </section>

        <section className="panel">
          <h2>All Students</h2>

          <form onSubmit={handleSearch} className="search-form">
            <input
              placeholder="Search by student name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <button type="submit">Search</button>

            <button
              type="button"
              onClick={() => {
                setSearch("");
                fetchStudents().catch((err) => {
                  setError(err.response?.data?.message || "Unable to load students");
                });
              }}
            >
              Reset
            </button>
          </form>

          {loading ? (
            <p>Loading students...</p>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Course</th>
                    <th>College</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {students.length === 0 ? (
                    <tr>
                      <td colSpan="7">No students found</td>
                    </tr>
                  ) : (
                    students.map((student) => (
                      <tr key={student.id}>
                        <td>{student.id}</td>
                        <td>{student.student_name}</td>
                        <td>{student.email}</td>
                        <td>{student.phone}</td>
                        <td>{student.course}</td>
                        <td>{student.college_name}</td>

                        <td>
                          <button onClick={() => handleEdit(student)}>
                            Edit
                          </button>

                          <button
                            className="delete-btn"
                            onClick={() => handleDelete(student.id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default Dashboard;

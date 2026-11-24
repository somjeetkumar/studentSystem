
import { createContext, useContext, useState } from "react";
import api from "../api";

const StudentContext = createContext();

export const StudentProvider = ({ children }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  // Get all students
  const fetchStudents = async () => {
    setLoading(true);

    try {
      const response = await api.get("/students");
      setStudents(response.data.students || []);
    } finally {
      setLoading(false);
    }
  };

  // Create student
  const createStudent = async (studentData) => {
    const response = await api.post("/students", studentData);
    await fetchStudents();
    return response.data;
  };

  // Update student
  const updateStudent = async (id, studentData) => {
    const response = await api.put(`/students/${id}`, studentData);
    await fetchStudents();
    return response.data;
  };

  // Delete student
  const deleteStudent = async (id) => {
    const response = await api.delete(`/students/${id}`);
    await fetchStudents();
    return response.data;
  };

  // Search student
  const searchStudents = async (name) => {
    if (!name.trim()) {
      return fetchStudents();
    }

    setLoading(true);

    try {
      const response = await api.get(
        `/students/search?name=${encodeURIComponent(name)}`
      );

      setStudents(response.data.students || []);
    } finally {
      setLoading(false);
    }
  };

  return (
    <StudentContext.Provider
      value={{
        students,
        loading,
        fetchStudents,
        createStudent,
        updateStudent,
        deleteStudent,
        searchStudents,
      }}
    >
      {children}
    </StudentContext.Provider>
  );
};

export const useStudents = () => useContext(StudentContext);

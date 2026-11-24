
const pool = require("../config/db");

const isValidStudentId = (id) => /^\d+$/.test(id) && Number(id) > 0;

const hasRequiredStudentFields = ({ student_name, email }) =>
    typeof student_name === "string" && student_name.trim() &&
    typeof email === "string" && email.trim();

// 1. CREATE STUDENT
exports.createStudent = async (req, res) => {
    try {
        const {
            student_name,
            email,
            phone,
            course,
            college_name
        } = req.body;

        if (!hasRequiredStudentFields({ student_name, email })) {
            return res.status(400).json({
                message: "Student name and email are required"
            });
        }

        const result = await pool.query(
            `INSERT INTO students
            (student_name, email, phone, course, college_name)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *`,
            [student_name, email, phone, course, college_name]
        );

        res.status(201).json({
            message: "Student created successfully",
            student: result.rows[0]
        });

    } catch (error) {
        if (error.code === "23505") {
            return res.status(409).json({
                message: "Student email already exists"
            });
        }

        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};


// 2. GET ALL STUDENTS
exports.getStudents = async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM students ORDER BY id DESC"
        );

        res.status(200).json({
            count: result.rows.length,
            students: result.rows
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};


// 3. UPDATE STUDENT
exports.updateStudent = async (req, res) => {
    try {
        const { id } = req.params;

        if (!isValidStudentId(id)) {
            return res.status(400).json({ message: "Invalid student id" });
        }

        const {
            student_name,
            email,
            phone,
            course,
            college_name
        } = req.body;

        if (!hasRequiredStudentFields({ student_name, email })) {
            return res.status(400).json({
                message: "Student name and email are required"
            });
        }

        const result = await pool.query(
            `UPDATE students
             SET student_name = $1,
                 email = $2,
                 phone = $3,
                 course = $4,
                 college_name = $5
             WHERE id = $6
             RETURNING *`,
            [student_name, email, phone, course, college_name, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        res.status(200).json({
            message: "Student updated successfully",
            student: result.rows[0]
        });

    } catch (error) {
        if (error.code === "23505") {
            return res.status(409).json({
                message: "Student email already exists"
            });
        }

        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};


// 4. DELETE STUDENT
exports.deleteStudent = async (req, res) => {
    try {
        const { id } = req.params;

        if (!isValidStudentId(id)) {
            return res.status(400).json({ message: "Invalid student id" });
        }

        const result = await pool.query(
            "DELETE FROM students WHERE id = $1 RETURNING *",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        res.status(200).json({
            message: "Student deleted successfully"
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};


// 5. SEARCH STUDENTS BY NAME
exports.searchStudents = async (req, res) => {
    try {
        const { name } = req.query;

        if (!name || !name.trim()) {
            return res.status(400).json({
                message: "Search name is required"
            });
        }

        const result = await pool.query(
            `SELECT * FROM students
             WHERE student_name ILIKE $1
             ORDER BY id DESC`,
            [`%${name.trim()}%`]
        );

        res.status(200).json({
            count: result.rows.length,
            students: result.rows
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

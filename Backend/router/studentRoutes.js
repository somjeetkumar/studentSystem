const express = require("express");

const router = express.Router();

const {
    createStudent,
    getStudents,
    updateStudent,
    deleteStudent,
    searchStudents
} = require("../controllers/studentController");

const authMiddleware = require("../middleware/authMiddleware");

// All student APIs require JWT authentication
router.use(authMiddleware);

router.get("/", getStudents);

router.post("/", createStudent);

router.put("/:id", updateStudent);

router.delete("/:id", deleteStudent);

router.get("/search", searchStudents);

module.exports = router;
const express = require("express");

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// In-memory student array
let students = [];


// TASK 1: DEFAULT ROUTE
app.get("/", (req, res) => {
    res.status(200).send("Student Management API is running!");
});


// TASK 2: CREATE STUDENT
app.post("/api/students", (req, res) => {
    const { id, name, email, course, age } = req.body;

    // Validate mandatory fields
    if (
        id === undefined || id === null || id === "" ||
        !name || !email || !course ||
        age === undefined || age === null || age === ""
    ) {
        return res.status(400).json({
            message: "All fields are mandatory"
        });
    }

    // Validate ID and age
    if (
        !Number.isInteger(Number(id)) ||
        Number(id) <= 0 ||
        !Number.isFinite(Number(age)) ||
        Number(age) <= 0
    ) {
        return res.status(400).json({
            message: "Invalid student ID or age"
        });
    }

    // Check duplicate ID
    const existingStudent = students.find(
        student => student.id === Number(id)
    );

    if (existingStudent) {
        return res.status(409).json({
            message: "Student ID already exists"
        });
    }

    // Create student
    const newStudent = {
        id: Number(id),
        name,
        email,
        course,
        age: Number(age)
    };

    students.push(newStudent);

    return res.status(201).json({
        message: "Student created successfully!",
        student: newStudent
    });
});


// TASK 3: GET ALL STUDENTS
app.get("/api/students", (req, res) => {
    res.status(200).json({
        message: "All student records",
        students: students
    });
});


// TASK 3: GET STUDENT BY ID
app.get("/api/students/:id", (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            message: "Invalid student ID"
        });
    }

    const student = students.find(
        student => student.id === id
    );

    if (!student) {
        return res.status(404).json({
            message: "Student not found"
        });
    }

    res.status(200).json({
        message: "Student found successfully",
        student: student
    });
});


// TASK 4: UPDATE STUDENT
app.put("/api/students/:id", (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            message: "Invalid student ID"
        });
    }

    const student = students.find(
        student => student.id === id
    );

    if (!student) {
        return res.status(404).json({
            message: "Student not found"
        });
    }

    const { name, email, course, age } = req.body;

    // Validate fields
    if (
        !name || !email || !course ||
        age === undefined || age === null || age === ""
    ) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    if (
        !Number.isFinite(Number(age)) ||
        Number(age) <= 0
    ) {
        return res.status(400).json({
            message: "Invalid age"
        });
    }

    // Update details
    student.name = name;
    student.email = email;
    student.course = course;
    student.age = Number(age);

    res.status(200).json({
        message: "Student updated successfully!",
        student: student
    });
});


// TASK 5: DELETE STUDENT
app.delete("/api/students/:id", (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            message: "Invalid student ID"
        });
    }

    const studentIndex = students.findIndex(
        student => student.id === id
    );

    if (studentIndex === -1) {
        return res.status(404).json({
            message: "Student not found"
        });
    }

    // Delete student from array
    const deletedStudent = students.splice(studentIndex, 1)[0];

    res.status(200).json({
        message: "Student deleted successfully!",
        student: deletedStudent
    });
});


// HANDLE INVALID JSON AND SERVER ERRORS
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400) {
        return res.status(400).json({
            message: "Invalid JSON format"
        });
    }

    console.error(err);

    res.status(500).json({
        message: "Internal Server Error"
    });
});


// START SERVER
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
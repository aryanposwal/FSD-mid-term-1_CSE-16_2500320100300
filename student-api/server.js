
const express = require("express");

const app = express();
const PORT = 3000;

// Middleware to accept JSON data
app.use(express.json());

// In-memory student database
let students = [];

// Default route
app.get("/", (req, res) => {
    res.send("Student Management API is running!");
});


// TASK 2: CREATE STUDENT (POST)
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
        !Number.isFinite(Number(age)) ||
        Number(age) <= 0
    ) {
        return res.status(400).json({
            message: "Invalid student ID or age"
        });
    }

    // Check duplicate student ID
    const existingStudent = students.find(
        student => student.id === Number(id)
    );

    if (existingStudent) {
        return res.status(409).json({
            message: "Student ID already exists"
        });
    }

    // Create student object
    const newStudent = {
        id: Number(id),
        name: name,
        email: email,
        course: course,
        age: Number(age)
    };

    // Store student in array
    students.push(newStudent);

    res.status(201).json({
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


// TASK 4: UPDATE STUDENT DETAILS (PUT)
app.put("/api/students/:id", (req, res) => {

    const id = Number(req.params.id);

    const student = students.find(
        student => student.id === id
    );

    if (!student) {
        return res.status(404).json({
            message: "Student not found"
        });
    }

    const { name, email, course, age } = req.body;

    // Validate mandatory fields
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

    // Update student details
    student.name = name;
    student.email = email;
    student.course = course;
    student.age = Number(age);

    res.status(200).json({
        message: "Student updated successfully!",
        student: student
    });
});


// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

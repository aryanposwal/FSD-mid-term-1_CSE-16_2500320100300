const express = require("express");

const app = express();

const PORT = 3000;

// Middleware to accept JSON data
app.use(express.json());

// Store student records
let students = [];

// Default route
app.get("/", (req, res) => {
    res.send("Student Records API is running!");
});

// Create student record
app.post("/api/students", (req, res) => {

    const { id, name, email, course, age } = req.body;

    // Validate mandatory fields
    if (!id || !name || !email || !course || age === undefined || age === null) {
        return res.status(400).json({
            message: "All fields are mandatory: id, name, email, course, age"
        });
    }

    // Create student object
    const newStudent = {
        id,
        name,
        email,
        course,
        age
    };

    // Store student
    students.push(newStudent);

    res.status(201).json({
        message: "Student created successfully!",
        student: newStudent
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
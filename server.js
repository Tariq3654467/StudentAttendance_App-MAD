const express = require("express");
const app = express();

app.use(express.json());

// CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Simple data storage
let students = [
  { id: 1, name: "John", studentId: "ST001" },
  { id: 2, name: "Jane", studentId: "ST002" },
  { id: 3, name: "Mike", studentId: "ST003" }
];

let attendance = [];

// Get students
app.get("/students", (req, res) => {
  res.json(students);
});

// Add student
app.post("/students", (req, res) => {
  const { name, studentId } = req.body;
  const newStudent = { id: students.length + 1, name, studentId };
  students.push(newStudent);
  res.json(newStudent);
});

// Mark attendance
app.post("/attendance", (req, res) => {
  const { studentId, status } = req.body;
  attendance.push({ studentId, status, date: new Date().toISOString().split('T')[0] });
  res.json({ success: true });
});

// Get attendance
app.get("/attendance", (req, res) => {
  res.json(attendance);
});

app.listen(3000, () => console.log("Server running on port 3000"));
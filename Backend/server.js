const express = require("express");
const cors = require("cors");
require("dotenv").config();

// const authRoutes = require("./routes/authRouter.js");
const authRoutes = require("./router/authRouter.js");
const studentRoutes = require("./router/studentRoutes.js");
// const authRoutes = require('./router/authRouter.js')

const authMiddleware = require("./middleware/authMiddleware.js");

const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));


// Middleware
app.use(express.json());

// Authentication routes
app.use("/api/auth", authRoutes);


app.use("/api/students", studentRoutes);
// Protected route (testing JWT)
app.get("/api/profile", authMiddleware, (req, res) => {
    res.status(200).json({
        message: "You are authenticated!",
        user: req.user
    });
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});





// const express = require("express");
// require("dotenv").config();

// // const authRoutes = require("./routes/authRoutes");
// const studentRoutes = require("./routes/studentRoutes.js");

// const app = express();

// app.use(express.json());

// // Public authentication APIs
// app.use("/api/auth", authRoutes);

// // Protected student APIs
// app.use("/api/students", studentRoutes);

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });
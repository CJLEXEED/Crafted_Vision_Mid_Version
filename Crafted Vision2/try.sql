const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();

// Set up file storage with multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Middleware for handling form-data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// POST endpoint to handle the art submission
app.post('/upload-art', upload.single('artImage'), (req, res) => {
    const { artTitle, artDescription, artPrice } = req.body;
    const artImage = req.file ? req.file.filename : null;

    // Save the art data to the database
    // Example: Save to MongoDB (you can replace this with your DB logic)
    const artData = {
        title: artTitle,
        description: artDescription,
        price: artPrice,
        imagePath: artImage,
    };

    // Simulate saving to database (use actual DB here)
    fs.writeFileSync('artData.json', JSON.stringify(artData, null, 2));

    res.json({ success: true, message: 'Art uploaded successfully!' });
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

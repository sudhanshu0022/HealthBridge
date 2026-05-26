import multer from 'multer';

// Set up disk storage with local destination to avoid undefined file payloads on Windows/development
const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, 'uploads/'); // Temporarily saves to backend/uploads/ folder
    },
    filename: function (req, file, callback) {
        // Appending unique timestamp to avoid name collisions
        callback(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage });

export default upload;
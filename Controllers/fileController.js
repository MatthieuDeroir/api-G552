const fs = require('fs');

class FileController {
    create(req, res) {
        // Handle file upload
        // req.file contains information about the uploaded file

        // Example: Save the file to the file system
        const file = req.file;
        const filePath = 'uploads/' + file.originalname;
        fs.writeFile(filePath, file.buffer, (err) => {
            if (err) {
                return res.status(500).json({ error: err });
            }
            res.status(201).json({ message: 'File uploaded successfully' });
        });
    }

    delete(req, res) {
        // Handle file deletion
        // req.params.fileName contains the name of the file to delete

        // Example: Delete the file from the file system
        const fileName = req.params.fileName;
        const filePath = 'uploads/' + fileName;
        fs.unlink(filePath, (err) => {
            if (err) {
                return res.status(500).json({ error: err });
            }
            res.status(200).json({ message: 'File deleted successfully' });
        });
    }
}

module.exports = FileController;

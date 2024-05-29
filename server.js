const express = require('express');
const ffmpeg = require('ffmpeg.js');
const path = require('path'); // for handling file paths
const multer = require('multer');

const app = express();
const port = process.env.PORT || 3000;

// Configure multer for file uploads (consider security implications)
const upload = multer({ dest: 'uploads/' }); // Configure upload destination

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

app.post('/convert', upload.single('audioFile'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded!');
  }

  const fileName = req.file.originalname;
  const filePath = path.join(__dirname, 'uploads', fileName); // Absolute path

  const command = ffmpeg(filePath)
    .output(path.join(__dirname, 'uploads', `converted_${fileName}`))
    .audioCodec('libmp3lame');

  command.on('end', () => {
    console.log('Conversion completed!');

    const convertedFile = path.join(__dirname, 'uploads', `converted_${fileName}`);

    // Set headers for download
    res.setHeader('Content-Type', 'audio/mpeg'); // Set audio/mpeg for MP3
    res.setHeader('Content-Disposition', `attachment; filename="${convertedFile}"`);
    res.sendFile(convertedFile); // Send the converted audio file
  });

  command.on('error', (err) => {
    console.error('Conversion error:', err);
    res.status(500).send({ message: 'Conversion failed!' });
  });

  command.run();
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

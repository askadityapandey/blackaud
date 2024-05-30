const express = require('express');
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const multer = require('multer');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

app.post('/convert', upload.single('audioFile'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded!');
  }

  const inputPath = req.file.path;
  const outputFormat = 'mp3'; // or retrieve this from a query parameter or form data
  const outputFileName = `converted_${req.file.filename}.${outputFormat}`;
  const outputPath = path.join(__dirname, 'uploads', outputFileName);

  ffmpeg(inputPath)
    .toFormat(outputFormat)
    .on('end', () => {
      console.log('Conversion completed!');
      res.json({ message: 'Conversion completed!', url: `/uploads/${outputFileName}` });
    })
    .on('error', (err) => {
      console.error('Conversion error:', err);
      res.status(500).send({ message: 'Conversion failed!' });
    })
    .save(outputPath);
});

// Serve the uploads directory to make files accessible
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

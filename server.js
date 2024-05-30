const express = require('express');
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const multer = require('multer');

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
  const outputPath = path.join(__dirname, 'uploads', `converted_${req.file.filename}.${outputFormat}`);

  ffmpeg(inputPath)
    .toFormat(outputFormat)
    .on('end', () => {
      console.log('Conversion completed!');
      res.setHeader('Content-Type', 'audio/mpeg'); // Set audio/mpeg for MP3
      res.setHeader('Content-Disposition', `attachment; filename="converted_${req.file.filename}.${outputFormat}"`);
      res.sendFile(outputPath);
    })
    .on('error', (err) => {
      console.error('Conversion error:', err);
      res.status(500).send({ message: 'Conversion failed!' });
    })
    .save(outputPath);
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

const audioFile = document.getElementById('audio-file');
const outputFormat = document.getElementById('output-format');
const convertButton = document.getElementById('convert-button');
const conversionMessage = document.getElementById('conversion-message');

convertButton.addEventListener('click', async () => {
  conversionMessage.textContent = 'Conversion in progress...';

  try {
    const response = await fetch('http://localhost:3000/convert', {
      method: 'POST',
      body: new FormData(), // FormData for file upload
    });

    const data = await response.json();

    if (data.message === 'Conversion successful!') {
      conversionMessage.textContent = 'Conversion complete!';
      // Create a download link (optional)
      const downloadLink = document.createElement('a');
      downloadLink.href = `http://localhost:3000/uploads/${data.convertedFile}`; // Update path if needed
      downloadLink.download = data.convertedFile;
      downloadLink.textContent = 'Download Converted File';
      // (Optional) Add the download link to the DOM
    } else {
      conversionMessage.textContent = data.message; // Handle error message
    }
  } catch (error) {
    console.error('Error:', error);
    conversionMessage.textContent = 'Conversion failed!';
  }
});


// Handle file selection and display filename
audioFile.addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (file) {
    conversionMessage.textContent = `Selected file: ${file.name}`;
  } else {
    conversionMessage.textContent = 'No file selected.';
  }
});

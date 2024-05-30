const audioFile = document.getElementById('audio-file');
const outputFormat = document.getElementById('output-format');
const convertButton = document.getElementById('convert-button');
const conversionMessage = document.getElementById('conversion-message');

convertButton.addEventListener('click', async () => {
  conversionMessage.textContent = 'Conversion in progress...';

  try {
    const formData = new FormData();
    const audioFile = document.getElementById('audio-file').files[0];
    if (audioFile) {
      formData.append('audioFile', audioFile); // Add the selected file to FormData
    } else {
      conversionMessage.textContent = 'Please select an audio file.';
      return; // Exit if no file selected
    }

    const response = await fetch('http://localhost:3000/convert', {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      const data = await response.json(); // Parse JSON only on successful response
      conversionMessage.textContent = data.message; // Display message from server
      
      // Create a download link for the converted file
      const downloadLink = document.createElement('a');
      downloadLink.href = data.url;
      downloadLink.textContent = 'Download Converted File';
      downloadLink.download = ''; // Optionally set the download attribute
      
      // Append the link to the message element
      conversionMessage.appendChild(document.createElement('br')); // Line break
      conversionMessage.appendChild(downloadLink);
    } else {
      const message = await response.text(); // Get error message as text
      conversionMessage.textContent = message; // Display error message from server
    }
  } catch (error) {
    console.error('Error:', error);
    conversionMessage.textContent = 'Conversion failed!';
  }
});

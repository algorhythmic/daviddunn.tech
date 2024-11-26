import fetch from 'node-fetch';

async function uploadPlaceholder() {
  try {
    const response = await fetch('http://localhost:3000/api/upload-placeholder');
    const data = await response.json();
    
    if (data.success) {
      console.log('Successfully uploaded placeholder to S3');
      console.log('URL:', data.url);
    } else {
      console.error('Failed to upload placeholder:', data.error);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

uploadPlaceholder();

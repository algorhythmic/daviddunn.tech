// Helper function to extract S3 key from CloudFront URL
export const extractS3KeyFromUrl = (url: string): string => {
  if (!url) throw new Error('URL is required');

  const cloudfrontUrl = process.env.NEXT_PUBLIC_CLOUDFRONT_URL;
  const s3Url = process.env.NEXT_PUBLIC_S3_URL;

  if (!cloudfrontUrl || !s3Url) {
    throw new Error('CloudFront or S3 URL is not configured');
  }

  try {
    let key: string;
    if (url.startsWith(cloudfrontUrl)) {
      key = url.replace(cloudfrontUrl + '/', '');
    } else if (url.startsWith(s3Url)) {
      key = url.replace(s3Url + '/', '');
    } else {
      throw new Error('Invalid URL format: URL must start with CloudFront or S3 domain');
    }

    return decodeURIComponent(key);
  } catch (error) {
    console.error('Error extracting S3 key:', error);
    throw error;
  }
};

export async function uploadToS3(file: File, path: string): Promise<string> {
  try {
    // Clean the filename and create the full path
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '-');
    const timestamp = Date.now();
    const fullPath = `${path}/${timestamp}-${cleanFileName}`;
    
    console.log('Uploading file to path:', fullPath);

    // Request a pre-signed URL from our API
    const response = await fetch('/api/s3/upload-url', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fileName: fullPath,
        contentType: file.type,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to get upload URL');
    }

    const { uploadUrl, fileUrl } = await response.json();

    // Upload the file using the pre-signed URL
    const uploadResponse = await fetch(uploadUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type,
        'Origin': window.location.origin,
      },
      mode: 'cors',
    });

    if (!uploadResponse.ok) {
      console.error('Upload failed with status:', uploadResponse.status);
      console.error('Upload response:', await uploadResponse.text());
      throw new Error(`Failed to upload file: ${uploadResponse.status}`);
    }

    console.log('Upload successful:', fileUrl);
    return fileUrl;
  } catch (error) {
    console.error('Error uploading to S3:', error);
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        name: error.name,
        stack: error.stack,
      });
    }
    throw new Error('Failed to upload file to S3. Please try again.');
  }
}

export async function deleteFromS3(fileUrl: string | undefined | null): Promise<void> {
  try {
    if (!fileUrl) {
      console.log('No file URL provided, skipping deletion');
      return;
    }

    // Extract the S3 key from the CloudFront URL
    const key = extractS3KeyFromUrl(fileUrl);
    console.log('Attempting to delete file with key:', key);

    // Request deletion through our API
    const response = await fetch('/api/s3/delete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ key }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Delete request failed:', errorData);
      throw new Error(errorData.error || 'Failed to delete file');
    }

    console.log('Successfully deleted file with key:', key);
  } catch (error) {
    console.error('Error deleting from S3:', error);
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        name: error.name,
        stack: error.stack,
      });
    }
    throw error;
  }
}

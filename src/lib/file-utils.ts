import { uploadToS3 } from './s3-utils';

export type FileType = 'resume' | 'resumePreview' | 'linkedin' | 'github' | 'instagram' | 'photo';

export async function handleFileUpload(file: File, type: FileType): Promise<string> {
  let filename;
  const timestamp = Date.now();
  
  if (type === 'resume') {
    filename = `resume-${timestamp}.pdf`;
  } else if (type === 'resumePreview') {
    filename = 'resumepreview.png';
  } else if (type === 'linkedin') {
    filename = 'linkedin-preview.png';
  } else if (type === 'github') {
    filename = 'github-preview.png';
  } else if (type === 'instagram') {
    filename = 'instagram-preview.png';
  } else {
    // For photo gallery uploads, use a timestamp-based name
    const cleanFileName = file.name.toLowerCase().replace(/[^a-z0-9.]/g, '-');
    filename = `${timestamp}-${cleanFileName}`;
  }
  
  const key = `assets/${filename}`;
  return await uploadToS3(file, key);
}

export function validateFileUpload(file: File, type: 'resume' | 'preview' | 'photo'): boolean {
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit`);
  }

  if (type === 'resume' && file.type !== 'application/pdf') {
    throw new Error('Please upload a PDF file for the resume');
  }

  if ((type === 'preview' || type === 'photo') && !file.type.startsWith('image/')) {
    throw new Error('Please upload an image file');
  }

  return true;
}

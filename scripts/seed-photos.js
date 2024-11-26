require('dotenv').config({ path: '.env.local' });
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { connectToMongoDB } = require('../src/lib/db');
const { Photo } = require('../src/models/photo');
const fs = require('fs');
const path = require('path');

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const BUCKET_NAME = process.env.S3_BUCKET_NAME;

// Sample stock photos data
const stockPhotos = [
  {
    title: 'Mountain Landscape',
    description: 'Scenic view of mountains during sunset',
    filename: 'mountain-landscape.jpg',
    tags: ['nature', 'mountains', 'sunset'],
  },
  {
    title: 'Urban Architecture',
    description: 'Modern city buildings with unique architectural design',
    filename: 'urban-architecture.jpg',
    tags: ['city', 'architecture', 'modern'],
  },
  {
    title: 'Ocean Waves',
    description: 'Powerful ocean waves crashing on the shore',
    filename: 'ocean-waves.jpg',
    tags: ['nature', 'ocean', 'waves'],
  },
];

async function uploadToS3(filepath, key) {
  const fileContent = fs.readFileSync(filepath);
  
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: fileContent,
    ContentType: 'image/jpeg',
  });

  try {
    await s3Client.send(command);
    console.log(`Successfully uploaded ${key} to S3`);
    return true;
  } catch (error) {
    console.error(`Error uploading ${key} to S3:`, error);
    return false;
  }
}

async function seedPhotos() {
  try {
    // Connect to MongoDB
    await connectToMongoDB();
    
    // Clear existing photos
    await Photo.deleteMany({});
    console.log('Cleared existing photos from MongoDB');

    // Process each stock photo
    for (const photoData of stockPhotos) {
      const filepath = path.join(process.cwd(), 'public', 'stock-photos', photoData.filename);
      const s3Key = `stock-photos/${photoData.filename}`;

      // Upload to S3
      const uploaded = await uploadToS3(filepath, s3Key);
      
      if (uploaded) {
        // Create MongoDB record
        const photo = new Photo({
          title: photoData.title,
          description: photoData.description,
          s3Key: s3Key,
          tags: photoData.tags,
          dateTaken: new Date(),
          dateUploaded: new Date(),
        });

        await photo.save();
        console.log(`Added ${photoData.title} to MongoDB`);
      }
    }

    console.log('Seeding completed successfully');
  } catch (error) {
    console.error('Error seeding photos:', error);
  } finally {
    process.exit();
  }
}

seedPhotos();

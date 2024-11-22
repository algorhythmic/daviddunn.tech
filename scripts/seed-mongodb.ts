import 'dotenv/config';
import { connectToMongoDB } from '../src/lib/db';
import { Photo } from '../src/models/photo';
import { Post } from '../src/models/post';

const testPhotos = [
  {
    title: "Mountain Sunrise",
    description: "A beautiful sunrise captured from Mount Tamalpais",
    imageUrl: "https://images.unsplash.com/photo-1501908734255-16579c18c25f",
    category: "Nature",
    tags: ["mountains", "sunrise", "california", "landscape"],
    location: "Mount Tamalpais, CA",
    dateTaken: new Date("2023-12-15"),
    metadata: {
      camera: "Sony A7III",
      lens: "24-70mm f/2.8",
      settings: {
        aperture: "f/8",
        shutterSpeed: "1/125",
        iso: 100,
        focalLength: "35mm"
      }
    }
  }
];

const testPosts = [
  {
    title: "Getting Started with Next.js 14",
    slug: "getting-started-with-nextjs-14",
    content: "# Introduction to Next.js 14\n\nNext.js 14 brings several exciting features...",
    excerpt: "Learn about the latest features in Next.js 14 and how to use them effectively.",
    category: "Development",
    tags: ["nextjs", "react", "javascript"],
    published: true,
    publishedAt: new Date("2023-12-01"),
    updatedAt: new Date(),
    metadata: {
      readingTime: 5,
      views: 0,
      likes: 0
    }
  }
];

async function seedMongoDB() {
  try {
    console.log('Connecting to MongoDB...');
    await connectToMongoDB();

    // Clear existing MongoDB data
    console.log('Clearing existing MongoDB data...');
    await Photo.deleteMany({});
    await Post.deleteMany({});

    // Insert test photos
    console.log('Inserting test photos...');
    await Photo.insertMany(testPhotos);

    // Insert test posts one by one to trigger pre-save middleware
    console.log('Inserting test posts...');
    for (const post of testPosts) {
      await Post.create(post);
    }

    console.log('MongoDB seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding MongoDB:', error);
    process.exit(1);
  }
}

seedMongoDB();

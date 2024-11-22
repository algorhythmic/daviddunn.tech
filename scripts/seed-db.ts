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
  },
  {
    title: "Golden Gate Bridge",
    description: "Iconic Golden Gate Bridge during sunset",
    imageUrl: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29",
    category: "Architecture",
    tags: ["bridge", "san francisco", "sunset", "iconic"],
    location: "San Francisco, CA",
    dateTaken: new Date("2023-12-20"),
    metadata: {
      camera: "Sony A7III",
      lens: "70-200mm f/2.8",
      settings: {
        aperture: "f/11",
        shutterSpeed: "1/250",
        iso: 200,
        focalLength: "135mm"
      }
    }
  },
  {
    title: "Street Life",
    description: "Candid street photography in downtown San Francisco",
    imageUrl: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29",
    category: "Street",
    tags: ["street", "urban", "people", "black and white"],
    location: "San Francisco, CA",
    dateTaken: new Date("2023-12-25"),
    metadata: {
      camera: "Fujifilm X100V",
      lens: "23mm f/2",
      settings: {
        aperture: "f/4",
        shutterSpeed: "1/500",
        iso: 400,
        focalLength: "23mm"
      }
    }
  }
];

const testPosts = [
  {
    title: "Getting Started with Street Photography",
    content: `# Getting Started with Street Photography

Street photography is one of the most challenging and rewarding genres of photography. Here's how to get started...

## Essential Equipment
- A camera (any camera!)
- Comfortable shoes
- An open mind

## Tips for Beginners
1. Start in busy areas
2. Be respectful of your subjects
3. Learn to anticipate moments
4. Practice, practice, practice

More detailed guides coming soon!`,
    excerpt: "A beginner's guide to street photography, covering essential equipment and basic techniques.",
    coverImage: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29",
    tags: ["photography", "tutorial", "street photography"],
    category: "Photography",
    published: true,
    publishedAt: new Date("2024-01-15"),
    metadata: {
      readingTime: 5,
    }
  },
  {
    title: "My Photography Workflow",
    content: `# My Photography Workflow

Here's a detailed look at how I process my photos from capture to final export...

## Capture
- Always shoot in RAW
- Use manual mode when possible
- Check histogram frequently

## Post-Processing
1. Import to Lightroom
2. Basic adjustments
3. Color grading
4. Export for web

Stay tuned for more detailed posts about each step!`,
    excerpt: "A detailed look at my photography workflow from capture to final export.",
    coverImage: "https://images.unsplash.com/photo-1501908734255-16579c18c25f",
    tags: ["workflow", "lightroom", "photography"],
    category: "Photography",
    published: true,
    publishedAt: new Date("2024-01-20"),
    metadata: {
      readingTime: 8,
    }
  }
];

async function seedDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    await connectToMongoDB();

    // Clear existing data
    console.log('Clearing existing data...');
    await Photo.deleteMany({});
    await Post.deleteMany({});

    // Insert test photos
    console.log('Inserting test photos...');
    await Photo.insertMany(testPhotos);

    // Insert test posts one by one to trigger the pre-save middleware
    console.log('Inserting test posts...');
    for (const post of testPosts) {
      await Post.create(post);
    }

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();

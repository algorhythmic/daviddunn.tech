import { BlogPost, Photo } from '@/types/schema';

export const testPosts: BlogPost[] = [
  {
    _id: '1',
    title: 'Building a Modern Portfolio with Next.js and TypeScript',
    slug: 'building-modern-portfolio-nextjs-typescript',
    content: `
# Building a Modern Portfolio with Next.js and TypeScript

In this comprehensive guide, we'll explore how to build a modern portfolio website using Next.js 15 and TypeScript. We'll cover everything from setting up the project to implementing advanced features like server-side rendering and API routes.

## Getting Started

First, let's create a new Next.js project with TypeScript support:

\`\`\`bash
npx create-next-app@latest my-portfolio --typescript --tailwind --app
\`\`\`

## Project Structure

Here's how we'll organize our project:

\`\`\`
src/
├── app/
│   ├── layout.tsx    # Root layout
│   ├── page.tsx      # Home page
│   └── globals.css   # Global styles
├── components/       # Reusable components
├── lib/             # Utility functions
└── types/           # TypeScript types
\`\`\`

## Key Features

1. **Server-Side Rendering**: Next.js provides excellent SSR capabilities out of the box.
2. **TypeScript Integration**: Strong typing for better development experience.
3. **Tailwind CSS**: Utility-first CSS framework for rapid styling.
4. **API Routes**: Built-in API functionality for backend operations.

## Implementation Details

Let's implement some key features...
    `,
    excerpt: 'A comprehensive guide to building a modern portfolio website using Next.js, TypeScript, and best practices for web development.',
    publishedAt: new Date('2024-11-15'),
    updatedAt: new Date('2024-11-15'),
    categories: ['Web Development', 'TypeScript'],
    tags: ['next.js', 'typescript', 'react', 'portfolio'],
    readingTime: 8,
    status: 'published',
    featuredImage: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6',
    seoTitle: 'Building a Modern Portfolio Website with Next.js and TypeScript | David Dunn',
    seoDescription: 'Learn how to create a professional portfolio website using Next.js, TypeScript, and modern web development best practices.',
    tableOfContents: {
      items: [
        {
          title: 'Getting Started',
          url: '#getting-started'
        },
        {
          title: 'Project Structure',
          url: '#project-structure'
        },
        {
          title: 'Key Features',
          url: '#key-features'
        },
        {
          title: 'Implementation Details',
          url: '#implementation-details'
        }
      ]
    }
  },
  {
    _id: '2',
    title: 'Mastering TypeScript: Advanced Patterns and Best Practices',
    slug: 'mastering-typescript-advanced-patterns',
    content: `
# Mastering TypeScript: Advanced Patterns and Best Practices

TypeScript has become an essential tool in modern web development. In this article, we'll explore advanced patterns and best practices that will help you write more maintainable and type-safe code.

## Type System Fundamentals

Before diving into advanced patterns, let's review some fundamental concepts:

\`\`\`typescript
// Generic Types
interface Container<T> {
  value: T;
  tag: string;
}

// Union Types
type Result<T, E = Error> = {
  success: true;
  data: T;
} | {
  success: false;
  error: E;
};
\`\`\`

## Advanced Patterns

### The Builder Pattern

\`\`\`typescript
class QueryBuilder<T> {
  private query: Partial<T> = {};

  where(key: keyof T, value: T[keyof T]): this {
    this.query[key] = value;
    return this;
  }

  build(): Partial<T> {
    return this.query;
  }
}
\`\`\`

## Best Practices

1. **Type Inference**: Let TypeScript infer types when possible
2. **Const Assertions**: Use as const for literal types
3. **Discriminated Unions**: For type-safe state management
    `,
    excerpt: 'Explore advanced TypeScript patterns, best practices, and tips for writing maintainable and type-safe code.',
    publishedAt: new Date('2024-11-10'),
    updatedAt: new Date('2024-11-12'),
    categories: ['TypeScript', 'Programming'],
    tags: ['typescript', 'patterns', 'best-practices', 'development'],
    readingTime: 12,
    status: 'published',
    featuredImage: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea',
    seoTitle: 'Mastering TypeScript: Advanced Patterns and Best Practices | David Dunn',
    seoDescription: 'Deep dive into advanced TypeScript patterns and learn best practices for writing maintainable, type-safe code.',
    tableOfContents: {
      items: [
        {
          title: 'Type System Fundamentals',
          url: '#type-system-fundamentals'
        },
        {
          title: 'Advanced Patterns',
          url: '#advanced-patterns',
          items: [
            {
              title: 'The Builder Pattern',
              url: '#the-builder-pattern'
            }
          ]
        },
        {
          title: 'Best Practices',
          url: '#best-practices'
        }
      ]
    }
  },
  {
    _id: '3',
    title: 'The Art of Technical Writing',
    slug: 'art-of-technical-writing',
    content: `
# The Art of Technical Writing

Clear and effective technical documentation is crucial for any software project. In this guide, we'll explore techniques for writing documentation that both users and developers will find helpful.

## Understanding Your Audience

Different audiences require different approaches:

1. End Users: Focus on how-to guides and examples
2. Developers: Include API references and implementation details
3. Maintainers: Document architecture decisions and trade-offs

## Writing Guidelines

### Be Clear and Concise

- Use active voice
- Keep sentences short
- Avoid jargon unless necessary
- Include relevant code examples

### Structure Your Content

Organize your documentation in a logical hierarchy:

1. Overview
2. Getting Started
3. Core Concepts
4. API Reference
5. Examples
6. Troubleshooting
    `,
    excerpt: 'Learn how to write clear, concise, and effective technical documentation that helps both users and developers.',
    publishedAt: new Date('2024-11-05'),
    updatedAt: new Date('2024-11-05'),
    categories: ['Writing', 'Documentation'],
    tags: ['technical-writing', 'documentation', 'communication'],
    readingTime: 6,
    status: 'published',
    seoTitle: 'The Art of Technical Writing: A Guide to Clear Documentation | David Dunn',
    seoDescription: 'Master the art of technical writing and learn how to create clear, effective documentation for developers and users.',
    tableOfContents: {
      items: [
        {
          title: 'Understanding Your Audience',
          url: '#understanding-your-audience'
        },
        {
          title: 'Writing Guidelines',
          url: '#writing-guidelines',
          items: [
            {
              title: 'Be Clear and Concise',
              url: '#be-clear-and-concise'
            },
            {
              title: 'Structure Your Content',
              url: '#structure-your-content'
            }
          ]
        }
      ]
    }
  },
];

// Test photos for search functionality
export const testPhotos: Photo[] = [
  {
    _id: '1',
    title: 'Modern Glass Skyscraper',
    description: 'A stunning glass skyscraper reflecting the city lights.',
    url: 'https://images.unsplash.com/photo-1486718448742-163732cd1544',
    thumbnailUrl: 'https://images.unsplash.com/photo-1486718448742-163732cd1544?w=500&h=375&fit=crop',
    category: 'Architecture',
    tags: ['buildings', 'modern', 'city', 'glass'],
    albumId: '1',
    metadata: {
      dateTaken: new Date('2024-01-15'),
      camera: {
        make: 'Sony',
        model: 'A7 III'
      },
      location: {
        name: 'New York City',
        coordinates: {
          lat: 40.7128,
          lng: -74.0060
        }
      }
    },
    isFeatured: true,
  },
  {
    _id: '2',
    title: 'Mountain Lake Reflection',
    description: 'A serene mountain lake reflecting the surrounding peaks.',
    url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05',
    thumbnailUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=500&h=375&fit=crop',
    category: 'Nature',
    tags: ['landscape', 'mountains', 'reflection', 'water'],
    albumId: '2',
    metadata: {
      dateTaken: new Date('2024-01-10'),
      camera: {
        make: 'Canon',
        model: 'EOS R5'
      },
      location: {
        name: 'Mount Rainier',
        coordinates: {
          lat: 46.8523,
          lng: -121.7603
        }
      }
    },
    isFeatured: true,
  },
  {
    _id: '3',
    title: 'Street Life',
    description: 'A bustling street scene capturing daily urban life.',
    url: 'https://images.unsplash.com/photo-1476984251899-8d7fdfc5c92c',
    thumbnailUrl: 'https://images.unsplash.com/photo-1476984251899-8d7fdfc5c92c?w=500&h=375&fit=crop',
    category: 'Street',
    tags: ['street', 'people', 'urban', 'life'],
    albumId: '3',
    metadata: {
      dateTaken: new Date('2024-01-05'),
      camera: {
        make: 'Fujifilm',
        model: 'X-T4'
      },
      location: {
        name: 'New York City',
        coordinates: {
          lat: 40.7128,
          lng: -74.0060
        }
      }
    },
    isFeatured: false,
  },
];

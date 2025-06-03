# David Dunn's Personal Website (daviddunn.tech)

This repository contains the source code for David Dunn's personal website, hosted at `daviddunn.tech`. It's a modern web application built with Next.js and React, designed to showcase David's profile, projects, and other relevant information.

## Description

It features a dynamic and responsive user interface with various sections, including:
- A **Hero** section for an impactful introduction.
- A **Dashboard** (potentially for displaying dynamic data or metrics).
- A **Portfolio** to showcase projects and work.
- A **Photo Gallery** for visual content.
- An **About** page providing more details about David.

The site is designed with a clean aesthetic and aims to provide a seamless user experience.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (v15.2.4)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **UI Library**: [React](https://reactjs.org/) (v19)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components & Primitives**:
  - [shadcn/ui](https://ui.shadcn.com/) (inferred from `components.json` and Radix UI usage)
  - [Radix UI](https://www.radix-ui.com/) (for accessible, unstyled UI primitives)
  - [Lucide React](https://lucide.dev/) (for icons)
  - [Sonner](https://sonner.emilkowal.ski/) (for toasts/notifications)
  - [Recharts](https://recharts.org/) (for charts, likely used in the Dashboard section)
  - [CMDK](https://cmdk.paco.me/) (for command palette functionality)
- **State Management**: React Context (e.g., `ThemeProvider` for dark mode)
- **Linting**: ESLint (via `next lint`)
- **Package Manager**: [pnpm](https://pnpm.io/)

## Features

- **Responsive Design**: Adapts to various screen sizes for optimal viewing on desktop and mobile devices.
- **Dark Mode**: Includes a `ThemeProvider` for easy theme switching.
- **Interactive Sections**: Dedicated components for Hero, Dashboard, Portfolio, Photo Gallery, and About sections.
- **Modern UI/UX**: Leverages modern libraries and best practices for a smooth and engaging user experience.
- **Clear Navigation**: User-friendly navigation to explore different parts of the site.
- **Optimized Performance**: Built with Next.js for server-side rendering/static site generation capabilities, leading to fast load times.

## Getting Started

To get a local copy up and running, follow these steps.

### Prerequisites

- Node.js (v18.x or later recommended for Next.js 15)
- pnpm (as `pnpm-lock.yaml` is present)

### Installation & Running Locally

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/algorhythmic/daviddunn.tech.git
    cd daviddunn.tech
    ```

2.  **Install dependencies**:
    ```bash
    pnpm install
    ```

3.  **Run the development server**:
    ```bash
    pnpm dev
    ```

    Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Available Scripts

In the project directory, you can run the following scripts using pnpm:

-   `pnpm dev`
    Runs the app in development mode.

-   `pnpm build`
    Builds the app for production to the `.next` folder.

-   `pnpm start`
    Starts a Next.js production server (requires `pnpm build` to be run first).

-   `pnpm lint`
    Runs ESLint to analyze your code for potential errors and style issues.

## Deployment

This Next.js application can be deployed to any platform that supports Node.js applications or Next.js specifically. Some popular choices include:

-   **Vercel**
-   **Netlify**
-   **AWS Amplify**
-   **Google Cloud Run**
-   Other cloud providers or self-hosted solutions.

Refer to the Next.js deployment documentation for more details: [https://nextjs.org/docs/deployment](https://nextjs.org/docs/deployment)

## Author & Acknowledgements

-   **Author**: David Dunn
-   **Initial Scaffolding/UI Components**: Created with the help of [v0.dev](https://v0.dev) and [shadcn/ui](https://ui.shadcn.com/).
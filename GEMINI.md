# GEMINI.md

## Project Overview

This is a Next.js project that serves as a professional review website for mobile games. The standout feature of this project is its ability to automatically generate new articles daily using the Gemini AI. The project is built with Next.js 14, React, and TypeScript for the frontend, and utilizes Firebase for the backend, including Firestore for the database, Firebase Hosting for deployment, and Firebase Authentication. It also uses Tailwind CSS for styling and the Unsplash API for dynamic images.

The project is configured to automatically generate and publish a new article every day at 9:00 AM UTC via a GitHub Actions workflow. This workflow runs a script that uses the Gemini AI to create a unique article about mobile gaming, which is then stored in Firestore and deployed to the live website.

## Building and Running

### Development

To run the project in a local development environment, use the following command:

```bash
npm run dev
```

This will start the Next.js development server, allowing you to view and interact with the website locally.

### Production Build

To create a production-ready build of the website, use the following command:

```bash
npm run build
```

This will generate a static version of the website in the `out` directory, which can then be deployed to a hosting provider.

### Article Generation

The primary script for generating articles is:

```bash
npm run generate-article
```

This script uses the Gemini AI to generate a new article and save it to Firestore. There is also a backup script that uses templates:

```bash
npm run generate-article-template
```

## Development Conventions

*   **TypeScript**: The project is written in TypeScript, so all new code should be written in TypeScript as well.
*   **Tailwind CSS**: The project uses Tailwind CSS for styling. All new components should be styled using Tailwind CSS classes.
*   **Firebase**: The project uses Firebase for its backend. All database interactions should be done through the Firebase services.
*   **GitHub Actions**: The project uses GitHub Actions for automation. Any changes to the deployment or article generation process should be done in the `.github/workflows/generate-article.yml` file.

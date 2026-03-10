# CV Site

A small Next.js App Router site that serves Ege Kaya's CV as downloadable PDF and DOCX files in Turkish and English.

## Features

- Single-page CV download interface
- Turkish and English UI copy with a language toggle
- Direct downloads for Turkish and English PDF and DOCX files
- Production security headers configured in `next.config.mjs`

## Project Structure

- `app/` - App Router layout, page, language state, and UI components
- `public/cv/` - Downloadable CV documents
- `public/logo/` - File-type icons used by the download cards
- `public/` - Static assets served directly by Next.js
- `cv-site.service` - Example system service unit for running the app in a Linux environment

## Prerequisites

- Node.js
- npm

A recent Node.js LTS release is recommended for current Next.js tooling.

## Installation

```bash
npm install
```

## Local Development

```bash
npm run dev
```

The local development server runs on [http://localhost:3001](http://localhost:3001).

## Available Scripts

```bash
npm run dev
npm run lint
npm run build
npm start
```

- `npm run dev` starts the development server on port `3001`
- `npm run lint` runs ESLint
- `npm run build` creates the production build
- `npm start` serves the production build on port `3001`

## Environment Variables

This app does not currently require any application-specific environment variables.

## Deployment

This project can be deployed by building it with `npm run build` and serving it with `npm start`.

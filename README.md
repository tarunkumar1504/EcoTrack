# EcoTrack

EcoTrack is a production-ready carbon footprint tracker for daily habits, built with React, Vite, Tailwind CSS, and Recharts. It combines live calculations, sustainability insights, and accessible progress reporting to help users understand and reduce their environmental footprint.

## Overview
- Measure daily emissions from travel, electricity, food, and waste.
- Track weekly and monthly progress with interactive charts and summary cards.
- Surface sustainability scores, reduction goals, and personalized eco recommendations.
- Keep everything local and fast with client-side persistence and lazy-loaded pages.

## Highlights
- Accessible activity logger and settings screen
- Responsive dashboard with charts, badges, and goal progress
- Carbon reduction goals and sustainability insights
- Unit + UI tests using Vitest and React Testing Library

## Project Architecture
- src/App.jsx: main layout, navigation, lazy-loaded pages
- src/pages: Dashboard, InputForm, Analytics, Suggestions
- src/utils/calculations.js: emission and sustainability calculations
- src/utils/storage.js: localStorage persistence
- tests/: Vitest and React Testing Library suite

## Installation
1. Install dependencies:
   npm install
2. Start the development server:
   npm run dev
3. Run the tests:
   npm test
4. Create a production build:
   npm run build

## Deployment
- Vercel: connect the repository and deploy using the default Vite build command.
- Netlify: set the publish directory to dist and build command to npm run build.

## Screenshots
- Dashboard preview: placeholder for a desktop screenshot
- Analytics preview: placeholder for a chart-focused screenshot
- Mobile view: placeholder for a responsive mobile capture

## Quality & Evaluation Notes
- Accessibility improvements include labels, focus states, and screen-reader friendly status messages.
- Performance improvements include lazy-loaded page modules.
- Testing coverage is organized under tests/ for calculations and key UI flows.

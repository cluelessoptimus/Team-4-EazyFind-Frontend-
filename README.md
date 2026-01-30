# EazyFind Frontend

A high-performance, responsive restaurant discovery interface built with React, Vite, and Tailwind CSS. The frontend is designed for speed, accessibility, and a premium user experience.

## Key Features

- **Instant Load Experience**: Intelligent client-side caching using `localStorage` ensures that users see data immediately on reload.
- **Smart City Detection**: Automatic geolocation-based city detection and proximity search.
- **Advanced Filtering**: Searchable multi-select cuisine filtering, cost-range adjustments, and dynamic sorting by rating or discount.
- **High-Fidelity UI**: Seamless transitions using Framer Motion and layout-stable skeleton loaders to eliminate Cumulative Layout Shift (CLS).
- **Responsive Design**: Mobile-first architecture that scales beautifully from small devices to large desktops.

## Tech Stack

- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **API Client**: Axios

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/cluelessoptimus/Team-4-EazyFind-Frontend-.git
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables (copy `.env.example` if available):
   ```bash
   VITE_API_BASE_URL=http://localhost:8080/api
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Architecture

The project follows a component-based architecture with a centralized API layer:
- `src/pages`: Main application views (Search, Discovery).
- `src/components`: Reusable UI elements (Filters, Cards, Skeletons).
- `src/api`: Centralized Axios client and endpoint definitions.
- `src/index.css`: Global design system tokens and Tailwind configurations.

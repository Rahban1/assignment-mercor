# Mercor Assignment - Hiring Dashboard

A modern, interactive web application for managing and evaluating job candidates. This React-based hiring dashboard provides comprehensive tools for screening, scoring, shortlisting, and selecting candidates from a large applicant pool.

##  Features

### Candidate Management
- **Smart Filtering**: Advanced filtering by location, skills, experience, education level, salary expectations, and work availability
- **Intelligent Scoring**: Automated candidate scoring based on experience, education, skills, diversity factors, and salary alignment
- **Real-time Search**: Dynamic search across candidate names, emails, skills, and other attributes
- **Pagination**: Efficient navigation through large candidate datasets

### Selection Process
- **Shortlisting**: Mark promising candidates for further review with customizable reasons and priority levels
- **Team Selection**: Select up to 5 final candidates with diversity considerations and role assignments
- **Progress Tracking**: Visual progress indicators for team building and selection status

### User Experience
- **Responsive Design**: Fully responsive interface that works seamlessly across desktop, tablet, and mobile devices
- **Dark/Light Mode**: Toggle between themes for comfortable viewing in any environment
- **Smooth Animations**: Polished interactions with Framer Motion animations
- **Modern UI**: Clean, gradient-based design with glassmorphism effects

### Technical Features
- **TypeScript**: Full type safety with Zod schema validation for data integrity
- **State Management**: Zustand for efficient and scalable state management
- **Performance Optimized**: Efficient rendering with pagination and optimized re-renders
- **Accessible**: Built with accessibility best practices in mind

## Technology Stack

- **Frontend**: React 19 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Styling**: Tailwind CSS 4 for utility-first styling
- **Animations**: Framer Motion for smooth, interactive animations
- **Routing**: React Router DOM for navigation
- **State Management**: Zustand for global state
- **Validation**: Zod for runtime type checking and data validation
- **Notifications**: Sonner for elegant toast notifications

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mercor-assignment
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to see the application

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production (TypeScript compilation + Vite build)
- `npm run lint` - Run ESLint for code quality checks
- `npm run preview` - Preview production build locally

## Pages & Navigation

1. **Dashboard** (`/`) - Main candidate browsing and filtering interface
2. **Team Selection** (`/selection`) - View selected and shortlisted candidates
3. **Reports** (`/reports`) - Analytics and insights about the candidate pool

## Key Components

- **CandidateListItem**: Individual candidate card with scoring and action buttons
- **CandidateDetailView**: Full-screen candidate profile with detailed information
- **FilterPanel**: Advanced filtering interface with multiple criteria
- **Pagination**: Efficient navigation through candidate results

## Data Structure

The application processes candidate data with the following key information:
- Personal details (name, email, location, etc.)
- Work experience and roles
- Educational background and degrees
- Skills and competencies
- Salary expectations by work type
- Availability preferences

## Design Philosophy

The application follows modern design principles:
- **Minimalist Interface**: Clean, uncluttered design focusing on content
- **Consistent Branding**: Cohesive color scheme and typography
- **Progressive Disclosure**: Information revealed gradually to avoid overwhelming users
- **Accessibility First**: Designed to be usable by everyone


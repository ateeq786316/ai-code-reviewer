# AI Code Reviewer Website

A modern, responsive website built with React, TypeScript, and Tailwind CSS that showcases an AI-powered code review platform with a professional design aesthetic.

## Features

### 🎨 Design System
- **Professional AI theme** with modern color palette and typography
- **Dark mode** with glassmorphism effects
- **Responsive design** that works on all devices
- **Smooth animations** powered by Framer Motion
- **Custom CSS components** built with Tailwind CSS

### 🚀 Landing Page
- **Hero section** with animated gradient background
- **Feature showcase** with interactive cards highlighting code review capabilities
- **Call-to-action sections** with gradient backgrounds
- **Professional footer** with social links
- **Mobile-responsive navigation** with hamburger menu

### 💻 Code Review Interface
- **AI-powered code analysis** with intelligent suggestions
- **Bug detection** and security vulnerability identification
- **Code quality assessment** with improvement recommendations
- **Smooth transitions** between review sessions
- **Responsive design** for mobile and desktop

### 🎭 Animations & Interactions
- **Scroll-triggered animations** using Framer Motion
- **Hover effects** with 3D transforms
- **Parallax scrolling** effects
- **Micro-interactions** throughout the interface
- **Spring animations** for natural feel

## Tech Stack

- **React 19** - Latest React with hooks
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Lucide React** - Beautiful icon set
- **Vite** - Fast build tool

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd ai-code-reviewer/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   └── ChatInterface.tsx    # Code review interface component
│   ├── App.tsx                  # Main app with routing
│   ├── main.tsx                 # Entry point
│   └── index.css                # Global styles & Tailwind
├── tailwind.config.js           # Tailwind configuration
├── postcss.config.js            # PostCSS configuration
└── package.json                 # Dependencies
```

## Design System

The website uses a comprehensive design system focused on AI and code review:

### Colors
- **Brand**: `#10A37F` (professional green)
- **Accent**: `#22D3A3` (bright green)
- **Neutral**: Dark grays from `#0B0F13` to `#F8FAFC`

### Typography
- **Font Family**: Inter (sans-serif)
- **Weights**: 400, 500, 600, 700
- **Scale**: xs (12px) to 5xl (48px)

### Spacing
- **Base Unit**: 4px
- **Scale**: xxs, xs, sm, md, lg, xl, 2xl, 3xl

### Animations
- **Duration**: 90ms to 520ms
- **Easing**: Spring, cubic-bezier, and inertia curves
- **Keyframes**: Fade-up, hover-tilt, glitch, pulse-glow

## Core Functionality

### AI Code Review Features
- **Intelligent Code Analysis** - Advanced AI understanding of codebases
- **Bug Detection** - Automatic identification of potential issues
- **Smart Suggestions** - Intelligent recommendations for improvements
- **Quality Assurance** - Automated quality checks and standards compliance

### User Experience
- **Code Input Interface** - Easy code pasting and submission
- **Real-time Analysis** - Instant feedback and suggestions
- **Comprehensive Reports** - Detailed review with actionable insights
- **Copy Functionality** - Easy sharing of review results

## Customization

### Adding New Components
1. Create component in `src/components/`
2. Use Tailwind classes from the design system
3. Add Framer Motion animations
4. Import and use in `App.tsx`

### Modifying Colors
Update the color values in `tailwind.config.js` and `src/index.css`

### Adding Animations
Define new keyframes in `tailwind.config.js` and use with Framer Motion

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance

- **Lazy loading** for components
- **Optimized animations** with Framer Motion
- **Efficient CSS** with Tailwind's purge
- **Fast builds** with Vite

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Acknowledgments

- Design inspiration from modern AI platforms
- Icons from Lucide React
- Animation library by Framer Motion
- CSS framework by Tailwind CSS

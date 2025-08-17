import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  Menu, 
  X, 
  Code, 
  Zap, 
  Shield, 
  Globe, 
  ArrowRight, 
  ChevronRight,
  Github,
  Twitter,
  Linkedin,
  Mail,
  Bug,
  Lightbulb,
  CheckCircle
} from 'lucide-react';
import ChatInterface from './components/ChatInterface';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentView, setCurrentView] = useState<'landing' | 'chat'>('landing');
  const { scrollY } = useScroll();
  
  const navbarBg = useTransform(scrollY, [0, 100], ['rgba(10,15,19,0.75)', 'rgba(10,15,19,0.95)']);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0.3]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: <Code className="w-8 h-8" />,
      title: "Intelligent Code Analysis",
      description: "Advanced AI that understands your codebase and provides comprehensive analysis and suggestions."
    },
    {
      icon: <Bug className="w-8 h-8" />,
      title: "Bug Detection",
      description: "Automatically identify potential bugs, security vulnerabilities, and code quality issues."
    },
    {
      icon: <Lightbulb className="w-8 h-8" />,
      title: "Smart Suggestions",
      description: "Get intelligent recommendations for code improvements, best practices, and optimizations."
    },
    {
      icon: <CheckCircle className="w-8 h-8" />,
      title: "Quality Assurance",
      description: "Ensure your code meets industry standards with automated quality checks and reviews."
    }
  ];

  // If chat view is selected, show the chat interface
  if (currentView === 'chat') {
    return <ChatInterface onBack={() => setCurrentView('landing')} />;
  }

  return (
    <div className="min-h-screen bg-neutral-0">
      {/* Navbar */}
      <motion.nav 
        style={{ backgroundColor: navbarBg }}
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b border-white border-opacity-10"
      >
        <div className="max-w-container mx-auto px-6 h-navbar flex items-center justify-between">
          {/* Logo */}
          <motion.div 
            className="flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center">
              <Code className="w-5 h-5 text-neutral-0" />
            </div>
            <span className="text-xl font-semibold text-neutral-700">AI Code Reviewer</span>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-neutral-600 hover:text-brand transition-colors duration-300">Features</a>
            <a href="#about" className="text-neutral-600 hover:text-brand transition-colors duration-300">About</a>
            <a href="#contact" className="text-neutral-600 hover:text-brand transition-colors duration-300">Contact</a>
            <motion.button 
              className="btn-primary px-6 py-2"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setCurrentView('chat')}
            >
              Review Code
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-neutral-600 hover:text-brand transition-colors duration-300"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-neutral-50 border-t border-white border-opacity-10"
          >
            <div className="px-6 py-4 space-y-4">
              <a href="#features" className="block text-neutral-600 hover:text-brand transition-colors duration-300">Features</a>
              <a href="#about" className="block text-neutral-600 hover:text-brand transition-colors duration-300">About</a>
              <a href="#contact-info" className="block text-neutral-600 hover:text-brand transition-colors duration-300">Contact</a>
              <button 
                className="btn-primary w-full py-3"
                onClick={() => setCurrentView('chat')}
              >
                Review Code
      </button>
            </div>
          </motion.div>
        )}
      </motion.nav>

      {/* Hero Section */}
      <motion.section 
        style={{ opacity: heroOpacity }}
        className="relative min-h-hero flex items-center justify-center overflow-hidden"
      >
        {/* Background Gradient */}
        <div className="absolute inset-0 hero-gradient" />
        
        {/* Content */}
        <div className="relative z-10 max-w-content mx-auto px-6 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-5xl md:text-6xl font-semibold text-neutral-700 mb-6 text-balance"
          >
            Elevate Your Code with
            <span className="text-brand block">AI-Powered Reviews</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-lg text-neutral-600 mb-8 max-w-2xl mx-auto"
          >
            Transform your development workflow with intelligent AI that analyzes your code, 
            detects bugs, suggests improvements, and ensures quality standards.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <motion.button 
              className="btn-primary px-8 py-4 text-lg font-medium"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentView('chat')}
            >
              Start Code Review
              <ArrowRight className="w-5 h-5 ml-2 inline" />
            </motion.button>
            <motion.button 
              className="btn-outline px-8 py-4 text-lg font-medium"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              Learn More
            </motion.button>
          </motion.div>
        </div>

        {/* Floating Elements */}
        <motion.div 
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 5, 0]
          }}
          transition={{ 
            duration: 6, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="absolute top-20 left-10 w-32 h-32 bg-brand bg-opacity-10 rounded-full blur-3xl"
        />
        <motion.div 
          animate={{ 
            y: [0, 20, 0],
            rotate: [0, -5, 0]
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: 1
          }}
          className="absolute bottom-20 right-10 w-40 h-40 bg-accent bg-opacity-10 rounded-full blur-3xl"
        />
      </motion.section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-neutral-50">
        <div className="max-w-container mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-semibold text-neutral-700 mb-4">
              Why Choose AI Code Reviewer?
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Our AI platform combines cutting-edge technology with deep code understanding to deliver 
              comprehensive code reviews that improve quality and productivity.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ 
                  y: -8,
                  transition: { type: "spring", stiffness: 300, damping: 20 }
                }}
                className="card-surface rounded-xl p-6 text-center group"
              >
                <div className="w-16 h-16 bg-brand bg-opacity-10 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-brand group-hover:bg-opacity-20 transition-colors duration-200">
                  <div className="text-brand">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-neutral-700 mb-3">
                  {feature.title}
                </h3>
                <p className="text-neutral-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-neutral-100">
        <div className="max-w-container mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-semibold text-neutral-700 mb-4">
              About AI Code Reviewer
            </h2>
            <p className="text-lg text-neutral-600 max-w-3xl mx-auto">
              We're passionate about helping developers write better code. Our AI-powered platform 
              combines cutting-edge technology with industry best practices to provide comprehensive 
              code reviews that improve quality, security, and maintainability.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-brand bg-opacity-10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Code className="w-8 h-8 text-brand" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-700 mb-3">AI-Powered Analysis</h3>
              <p className="text-neutral-600">
                Advanced machine learning algorithms that understand code patterns and identify potential issues.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-brand bg-opacity-10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-brand" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-700 mb-3">Security First</h3>
              <p className="text-neutral-600">
                Comprehensive security analysis to identify vulnerabilities and prevent potential threats.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-brand bg-opacity-10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-brand" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-700 mb-3">Performance Focus</h3>
              <p className="text-neutral-600">
                Optimize your code for better performance with intelligent suggestions and best practices.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="py-24 bg-gradient-to-r from-brand to-accent">
        <div className="max-w-container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-semibold text-neutral-0 mb-6">
              Ready to Transform Your Code Quality?
            </h2>
            <p className="text-lg text-neutral-0 bg-opacity-90 mb-8 max-w-2xl mx-auto">
              Join developers who are already experiencing the future of AI-powered code review.
            </p>
            <motion.button 
              className="bg-white text-brand px-8 py-4 rounded-lg text-lg font-semibold shadow-elevated"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentView('chat')}
            >
              Start Reviewing Free
              <ChevronRight className="w-5 h-5 ml-2 inline" />
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-50 border-t border-white border-opacity-10">
        <div className="max-w-container mx-auto px-6 py-16">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center">
                  <Code className="w-5 h-5 text-neutral-0" />
                </div>
                <span className="text-xl font-semibold text-neutral-700">AI Code Reviewer</span>
              </div>
              <p className="text-neutral-600 mb-6 max-w-md">
                Empowering developers with intelligent AI that analyzes, reviews, and improves code quality 
                for better software development.
              </p>
              <div className="flex space-x-4">
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-neutral-600 hover:text-brand transition-colors duration-200">
                  <Github className="w-5 h-5" />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-neutral-600 hover:text-brand transition-colors duration-200">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-neutral-600 hover:text-brand transition-colors duration-200">
                  <Linkedin className="w-5 h-5" />
                </a>
                <a href="mailto:contact@aicode reviewer.com" className="text-neutral-600 hover:text-brand transition-colors duration-200">
                  <Mail className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Contact Information */}
            <div id="contact-info">
              <h3 className="text-lg font-semibold text-neutral-700 mb-4">Contact</h3>
              <ul className="space-y-2">
                <li className="text-neutral-600">
                  <span className="font-medium">Email:</span> contact@aicode reviewer.com
                </li>
                <li className="text-neutral-600">
                  <span className="font-medium">Support:</span> support@aicode reviewer.com
                </li>
                <li className="text-neutral-600">
                  <span className="font-medium">Business:</span> business@aicode reviewer.com
                </li>
                <li className="text-neutral-600">
                  <span className="font-medium">Location:</span> Remote / Worldwide
                    </li>
              </ul>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold text-neutral-700 mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#features" className="text-neutral-600 hover:text-brand transition-colors duration-200">Features</a></li>
                <li><a href="#about" className="text-neutral-600 hover:text-brand transition-colors duration-200">About</a></li>
                <li><a href="#contact-info" className="text-neutral-600 hover:text-brand transition-colors duration-200">Contact</a></li>
                <li><a href="#" className="text-neutral-600 hover:text-brand transition-colors duration-200">Documentation</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white border-opacity-10 mt-12 pt-8 text-center">
            <p className="text-neutral-600">
              © 2024 AI Code Reviewer. All rights reserved.
            </p>
            </div>
        </div>
      </footer>
    </div>
  );
}

export default App;

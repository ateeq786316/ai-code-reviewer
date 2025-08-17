import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Code, User, Copy, Check, ArrowLeft, AlertTriangle, Zap, Shield, Eye } from 'lucide-react';
import axios from 'axios';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  codeAnalysis?: CodeAnalysis;
}

interface CodeAnalysis {
  overallScore: number;
  issues: CodeIssue[];
  suggestions: CodeSuggestion[];
  risks: CodeRisk[];
  performance: PerformanceNote[];
  bestPractices: string[];
}

interface CodeIssue {
  type: 'error' | 'warning' | 'info';
  severity: 'critical' | 'high' | 'medium' | 'low';
  line?: number;
  message: string;
  suggestion: string;
}

interface CodeSuggestion {
  category: 'performance' | 'readability' | 'security' | 'maintainability';
  title: string;
  description: string;
  codeExample?: string;
}

interface CodeRisk {
  level: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  impact: string;
  mitigation: string;
}

interface PerformanceNote {
  metric: string;
  current: string;
  improved: string;
  impact: string;
}

interface ChatInterfaceProps {
  onBack: () => void;
}

export default function ChatInterface({ onBack }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm your AI Code Reviewer. I can analyze your code, detect bugs, suggest improvements, and ensure code quality. Paste your code below and I'll provide a comprehensive review with detailed analysis, suggestions, and risk assessment!",
      role: 'assistant',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Check backend health on component mount
  useEffect(() => {
    const checkBackendHealth = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        await axios.get(`${apiUrl}/api/health`);
        console.log('✅ Backend is healthy and ready');
      } catch (error: any) {
        console.warn('⚠️ Backend health check failed:', error.message);
        setApiError('Backend service is not available. Using local analysis mode.');
      }
    };

    checkBackendHealth();
  }, []);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      role: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);
    setApiError(null); // Clear previous errors

    try {
      // Call the backend API for real AI analysis
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await axios.post(`${apiUrl}/api/review`, {
        code: inputValue
      });

      const aiReview = response.data.aiReview;
      
      // Transform backend response to frontend format
      const codeAnalysis: CodeAnalysis = transformBackendResponse(aiReview, inputValue);
      
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: "I've analyzed your code thoroughly. Here's my comprehensive review:",
        role: 'assistant',
        timestamp: new Date(),
        codeAnalysis: codeAnalysis
      };
      
      setMessages(prev => [...prev, aiResponse]);
    } catch (error: any) {
      console.error('Error calling backend API:', error);
      setApiError('Failed to connect to the AI Code Reviewer. Please try again later.');
      
      // Fallback to local analysis if API fails
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: "I've analyzed your code thoroughly. Here's my comprehensive review:",
        role: 'assistant',
        timestamp: new Date(),
        codeAnalysis: generateDetailedCodeAnalysis(inputValue)
      };
      
      setMessages(prev => [...prev, aiResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const generateDetailedCodeAnalysis = (userInput: string): CodeAnalysis => {
    // Analyze the actual code content
    const code = userInput.toLowerCase();
    const issues: CodeIssue[] = [];
    const suggestions: CodeSuggestion[] = [];
    const risks: CodeRisk[] = [];
    const performance: PerformanceNote[] = [];
    const bestPractices: string[] = [];

    // Code Quality Analysis
    if (code.includes('var ')) {
      issues.push({
        type: 'warning',
        severity: 'medium',
        message: 'Use of var keyword detected',
        suggestion: 'Replace var with const or let for better scoping and to prevent hoisting issues'
      });
      suggestions.push({
        category: 'readability',
        title: 'Modern Variable Declaration',
        description: 'Use const for values that won\'t be reassigned, let for values that will change',
        codeExample: '// Instead of: var x = 5;\n// Use: const x = 5; or let x = 5;'
      });
    }

    if (code.includes('==') && !code.includes('===')) {
      issues.push({
        type: 'warning',
        severity: 'medium',
        message: 'Loose equality comparison detected',
        suggestion: 'Use strict equality (===) to avoid type coercion issues'
      });
      risks.push({
        level: 'medium',
        description: 'Type coercion can lead to unexpected behavior',
        impact: 'May cause bugs in edge cases',
        mitigation: 'Always use === for comparisons unless type coercion is explicitly needed'
      });
    }

    if (code.includes('settimeout') || code.includes('setinterval')) {
      if (!code.includes('cleartimeout') && !code.includes('clearinterval')) {
        issues.push({
          type: 'warning',
          severity: 'high',
          message: 'Timer functions without cleanup',
          suggestion: 'Always clear timers to prevent memory leaks'
        });
        risks.push({
          level: 'high',
          description: 'Memory leaks from uncleaned timers',
          impact: 'Gradual memory consumption increase',
          mitigation: 'Store timer IDs and clear them when component unmounts'
        });
      }
    }

    if (code.includes('innerhtml') || code.includes('outerhtml')) {
      issues.push({
        type: 'error',
        severity: 'critical',
        message: 'Direct DOM manipulation with innerHTML',
        suggestion: 'Use textContent or createElement to prevent XSS attacks'
      });
      risks.push({
        level: 'critical',
        description: 'Cross-site scripting (XSS) vulnerability',
        impact: 'Security breach, user data compromise',
        mitigation: 'Use safe DOM methods and sanitize all user inputs'
      });
    }

    if (code.includes('eval(')) {
      issues.push({
        type: 'error',
        severity: 'critical',
        message: 'Use of eval() function',
        suggestion: 'eval() is dangerous and should never be used in production code'
      });
      risks.push({
        level: 'critical',
        description: 'Code injection vulnerability',
        impact: 'Complete system compromise',
        mitigation: 'Use alternative approaches like JSON.parse() or function constructors'
      });
    }

    // Performance Analysis
    if (code.includes('for(') && code.includes('length')) {
      performance.push({
        metric: 'Loop Performance',
        current: 'Standard for loop',
        improved: 'Cached length variable',
        impact: '5-15% performance improvement'
      });
      suggestions.push({
        category: 'performance',
        title: 'Cache Array Length',
        description: 'Store array length in a variable to avoid repeated property lookups',
        codeExample: '// Instead of: for(let i = 0; i < arr.length; i++)\n// Use: for(let i = 0, len = arr.length; i < len; i++)'
      });
    }

    if (code.includes('queryselector') && code.includes('for')) {
      performance.push({
        metric: 'DOM Querying',
        current: 'Querying DOM in loops',
        improved: 'Cache DOM elements outside loops',
        impact: 'Significant performance improvement'
      });
      suggestions.push({
        category: 'performance',
        title: 'Cache DOM Elements',
        description: 'Avoid querying the DOM inside loops',
        codeExample: '// Instead of: for(let i = 0; i < items.length; i++) {\n//   document.querySelector(`#item-${i}`);\n// }\n// Cache first: const elements = items.map(item => document.querySelector(`#item-${item.id}`));'
      });
    }

    // Best Practices
    if (code.includes('function') && !code.includes('const') && !code.includes('let')) {
      bestPractices.push('Use arrow functions or function expressions instead of function declarations for better hoisting control');
    }

    if (code.includes('console.log')) {
      bestPractices.push('Remove console.log statements before production deployment');
    }

    if (code.includes('magic numbers') || /\b\d{4,}\b/.test(code)) {
      bestPractices.push('Replace magic numbers with named constants for better readability');
    }

    // Calculate overall score
    const totalIssues = issues.length;
    const criticalIssues = issues.filter(i => i.severity === 'critical').length;
    const highIssues = issues.filter(i => i.severity === 'high').length;
    
    let overallScore = 100;
    overallScore -= criticalIssues * 25;
    overallScore -= highIssues * 15;
    overallScore -= (totalIssues - criticalIssues - highIssues) * 5;
    overallScore = Math.max(overallScore, 0);

    return {
      overallScore,
      issues,
      suggestions,
      risks,
      performance,
      bestPractices
    };
  };

  const transformBackendResponse = (backendResponse: any, originalCode: string): CodeAnalysis => {
    // Transform backend AI response to frontend format
    const issues: CodeIssue[] = [];
    const suggestions: CodeSuggestion[] = [];
    const risks: CodeRisk[] = [];
    const performance: PerformanceNote[] = [];
    const bestPractices: string[] = [];

    // Process bugs from backend
    if (backendResponse.bugs && Array.isArray(backendResponse.bugs)) {
      backendResponse.bugs.forEach((bug: string) => {
        issues.push({
          type: 'error',
          severity: 'high',
          message: bug,
          suggestion: 'Review and fix the identified bug'
        });
      });
    }

    // Process security issues from backend
    if (backendResponse.security_issues && Array.isArray(backendResponse.security_issues)) {
      backendResponse.security_issues.forEach((securityIssue: string) => {
        risks.push({
          level: 'critical',
          description: securityIssue,
          impact: 'Security vulnerability detected',
          mitigation: 'Address the security issue immediately'
        });
      });
    }

    // Process code quality issues from backend
    if (backendResponse.code_quality_issues && Array.isArray(backendResponse.code_quality_issues)) {
      backendResponse.code_quality_issues.forEach((qualityIssue: string) => {
        issues.push({
          type: 'warning',
          severity: 'medium',
          message: qualityIssue,
          suggestion: 'Improve code quality and maintainability'
        });
      });
    }

    // Process performance issues from backend
    if (backendResponse.performance_issues && Array.isArray(backendResponse.performance_issues)) {
      backendResponse.performance_issues.forEach((perfIssue: string) => {
        performance.push({
          metric: 'Performance Issue',
          current: perfIssue,
          improved: 'Optimize the identified performance concern',
          impact: 'Improved performance and user experience'
        });
      });
    }

    // Process suggestions from backend
    if (backendResponse.suggestions && Array.isArray(backendResponse.suggestions)) {
      backendResponse.suggestions.forEach((suggestion: string) => {
        suggestions.push({
          category: 'maintainability',
          title: 'Code Improvement',
          description: suggestion,
          codeExample: undefined
        });
      });
    }

    // Process best practices from backend
    if (backendResponse.best_practices && Array.isArray(backendResponse.best_practices)) {
      backendResponse.best_practices.forEach((practice: string) => {
        bestPractices.push(practice);
      });
    }

    // Calculate overall score based on risk score from backend
    let overallScore = 100;
    if (backendResponse.risk_score) {
      const riskScore = parseInt(backendResponse.risk_score);
      overallScore = Math.max(0, 100 - (riskScore * 10));
    }

    // Add some local analysis for additional insights
    const localAnalysis = generateDetailedCodeAnalysis(originalCode);
    issues.push(...localAnalysis.issues);
    suggestions.push(...localAnalysis.suggestions);
    risks.push(...localAnalysis.risks);
    performance.push(...localAnalysis.performance);
    bestPractices.push(...localAnalysis.bestPractices);

    return {
      overallScore,
      issues,
      suggestions,
      risks,
      performance,
      bestPractices
    };
  };

  const copyToClipboard = async (text: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(messageId);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const renderCodeAnalysis = (analysis: CodeAnalysis) => {
    const getSeverityColor = (severity: string) => {
      switch (severity) {
        case 'critical': return 'text-red-500';
        case 'high': return 'text-orange-500';
        case 'medium': return 'text-yellow-500';
        case 'low': return 'text-blue-500';
        default: return 'text-gray-500';
      }
    };

    const getSeverityIcon = (severity: string) => {
      switch (severity) {
        case 'critical': return <AlertTriangle className="w-4 h-4" />;
        case 'high': return <AlertTriangle className="w-4 h-4" />;
        case 'medium': return <Eye className="w-4 h-4" />;
        case 'low': return <Eye className="w-4 h-4" />;
        default: return <Eye className="w-4 h-4" />;
      }
    };

    return (
      <div className="space-y-4">
        {/* Overall Score Card */}
        <div className="bg-gradient-to-r from-brand to-brand-accent rounded-lg p-4 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold">Code Quality Score</h3>
            <div className={`text-2xl font-bold ${
              analysis.overallScore >= 80 ? 'text-green-200' :
              analysis.overallScore >= 60 ? 'text-yellow-200' :
              'text-red-200'
            }`}>
              {analysis.overallScore}/100
            </div>
          </div>
          <div className="w-full bg-white bg-opacity-20 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-500 ${
                analysis.overallScore >= 80 ? 'bg-green-300' :
                analysis.overallScore >= 60 ? 'bg-yellow-300' :
                'bg-red-300'
              }`}
              style={{ width: `${analysis.overallScore}%` }}
            />
          </div>
        </div>

        {/* Summary Cards Grid */}
        <div className="grid grid-cols-3 gap-3">
          {/* Issues Card */}
          <div className="bg-neutral-100 border border-white border-opacity-10 rounded-lg p-3 text-center">
            <div className="text-red-500 font-semibold text-lg">{analysis.issues.length}</div>
            <div className="text-neutral-600 text-sm font-medium">Issues</div>
          </div>

          {/* Risks Card */}
          <div className="bg-neutral-100 border border-white border-opacity-10 rounded-lg p-3 text-center">
            <div className="text-orange-500 font-semibold text-lg">{analysis.risks.length}</div>
            <div className="text-neutral-600 text-sm font-medium">Risks</div>
          </div>

          {/* Performance Card */}
          <div className="bg-neutral-100 border border-white border-opacity-10 rounded-lg p-3 text-center">
            <div className="text-blue-500 font-semibold text-lg">{analysis.performance.length}</div>
            <div className="text-neutral-600 text-sm font-medium">Performance</div>
          </div>
        </div>

        {/* Collapsible Sections */}
        {analysis.issues.length > 0 && (
          <div className="bg-neutral-100 border border-white border-opacity-10 rounded-lg overflow-hidden">
            <div className="bg-neutral-200 px-4 py-3 border-b border-white border-opacity-10">
              <h3 className="text-lg font-semibold text-neutral-700 flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2 text-red-500" />
                Issues Found ({analysis.issues.length})
              </h3>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-64 overflow-y-auto">
                {analysis.issues.map((issue, index) => (
                  <div key={index} className="bg-neutral-50 border border-red-200 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        issue.severity === 'critical' ? 'bg-red-100 text-red-800' :
                        issue.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                        issue.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {issue.severity.toUpperCase()}
                      </span>
                      {getSeverityIcon(issue.severity)}
                    </div>
                    <p className="text-sm text-neutral-700 mb-2 font-medium">{issue.message}</p>
                    <p className="text-xs text-neutral-600">
                      <span className="font-medium">Fix:</span> {issue.suggestion}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {analysis.risks.length > 0 && (
          <div className="bg-neutral-100 border border-white border-opacity-10 rounded-lg overflow-hidden">
            <div className="bg-neutral-200 px-4 py-3 border-b border-white border-opacity-10">
              <h3 className="text-lg font-semibold text-neutral-700 flex items-center">
                <Shield className="w-5 h-5 mr-2 text-orange-500" />
                Security & Risks ({analysis.risks.length})
              </h3>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-64 overflow-y-auto">
                {analysis.risks.map((risk, index) => (
                  <div key={index} className="bg-neutral-50 border border-orange-200 rounded-lg p-3">
                    <div className="flex items-center mb-2">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        risk.level === 'critical' ? 'bg-red-100 text-red-800' :
                        risk.level === 'high' ? 'bg-orange-100 text-orange-800' :
                        risk.level === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {risk.level.toUpperCase()} RISK
                      </span>
                    </div>
                    <p className="text-sm text-neutral-700 mb-2 font-medium">{risk.description}</p>
                    <div className="space-y-1">
                      <p className="text-xs text-neutral-600">
                        <span className="font-medium">Impact:</span> {risk.impact}
                      </p>
                      <p className="text-xs text-neutral-600">
                        <span className="font-medium">Fix:</span> {risk.mitigation}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {analysis.performance.length > 0 && (
          <div className="bg-neutral-100 border border-white border-opacity-10 rounded-lg overflow-hidden">
            <div className="bg-neutral-200 px-4 py-3 border-b border-white border-opacity-10">
              <h3 className="text-lg font-semibold text-neutral-700 flex items-center">
                <Zap className="w-5 h-5 mr-2 text-blue-500" />
                Performance ({analysis.performance.length})
              </h3>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-64 overflow-y-auto">
                {analysis.performance.map((perf, index) => (
                  <div key={index} className="bg-neutral-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-sm font-medium text-neutral-700 mb-2">{perf.metric}</p>
                    <div className="space-y-1 mb-2">
                      <div className="text-xs">
                        <span className="text-neutral-600 font-medium">Current:</span>
                        <p className="text-neutral-700">{perf.current}</p>
                      </div>
                      <div className="text-xs">
                        <span className="text-neutral-600 font-medium">Improved:</span>
                        <p className="text-neutral-700">{perf.improved}</p>
                      </div>
                    </div>
                    <p className="text-xs text-neutral-600">
                      <span className="font-medium">Impact:</span> {perf.impact}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {analysis.suggestions.length > 0 && (
          <div className="bg-neutral-100 border border-white border-opacity-10 rounded-lg overflow-hidden">
            <div className="bg-neutral-200 px-4 py-3 border-b border-white border-opacity-10">
              <h3 className="text-lg font-semibold text-neutral-700">Improvement Suggestions ({analysis.suggestions.length})</h3>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-64 overflow-y-auto">
                {analysis.suggestions.map((suggestion, index) => (
                  <div key={index} className="bg-neutral-50 border border-green-200 rounded-lg p-3">
                    <div className="flex items-center mb-2">
                      <span className="text-xs px-2 py-1 bg-brand bg-opacity-20 text-brand rounded-full font-medium">
                        {suggestion.category}
                      </span>
                    </div>
                    <h4 className="font-medium text-neutral-700 mb-2">{suggestion.title}</h4>
                    <p className="text-sm text-neutral-600 mb-2">{suggestion.description}</p>
                    {suggestion.codeExample && (
                      <pre className="text-xs bg-neutral-200 p-2 rounded text-neutral-800 overflow-x-auto">
                        {suggestion.codeExample}
                      </pre>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {analysis.bestPractices.length > 0 && (
          <div className="bg-neutral-100 border border-white border-opacity-10 rounded-lg overflow-hidden">
            <div className="bg-neutral-200 px-4 py-3 border-b border-white border-opacity-10">
              <h3 className="text-lg font-semibold text-neutral-700">Best Practices ({analysis.bestPractices.length})</h3>
            </div>
            <div className="p-4 max-h-48 overflow-y-auto">
              <ul className="space-y-1">
                {analysis.bestPractices.map((practice, index) => (
                  <li key={index} className="text-sm text-neutral-600 flex items-start">
                    <span className="text-green-500 mr-2 mt-0.5">✓</span>
                    {practice}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen bg-neutral-0">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white border-opacity-10 bg-neutral-50">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="p-2 text-neutral-600 hover:text-brand transition-colors duration-200 rounded-lg hover:bg-white hover:bg-opacity-5"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center">
            <Code className="w-5 h-5 text-neutral-0" />
          </div>
          <h1 className="text-xl font-semibold text-neutral-700">AI Code Reviewer</h1>
        </div>
        <div className="text-sm text-neutral-500">
          Code Analysis & Review
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[90%] ${message.role === 'user' ? 'order-2' : 'order-1'}`}>
                <div className={`flex items-start space-x-3 ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  {/* Avatar */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.role === 'user' 
                      ? 'bg-brand text-neutral-0' 
                      : 'bg-neutral-200 text-neutral-600'
                  }`}>
                    {message.role === 'user' ? (
                      <User className="w-4 h-4" />
                    ) : (
                      <Code className="w-4 h-4" />
                    )}
                  </div>

                  {/* Message Content */}
                  <div className={`rounded-xl p-4 ${
                    message.role === 'user' 
                      ? 'chat-bubble-user' 
                      : 'chat-bubble-assistant'
                  }`}>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap mb-3">
                      {message.content}
                    </p>
                    
                    {/* Code Analysis */}
                    {message.codeAnalysis && renderCodeAnalysis(message.codeAnalysis)}
                    
                    {/* Message Actions */}
                    <div className={`flex items-center justify-between mt-3 ${
                      message.role === 'user' ? 'flex-row-reverse' : ''
                    }`}>
                      <span className="text-xs text-neutral-500">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      
                      {message.role === 'assistant' && (
                        <button
                          onClick={() => copyToClipboard(message.content, message.id)}
                          className="text-neutral-500 hover:text-brand transition-colors duration-200"
                        >
                          {copiedId === message.id ? (
                            <Check className="w-4 h-4" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing Indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="max-w-[80%]">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-neutral-200 text-neutral-600 flex items-center justify-center">
                  <Code className="w-4 h-4" />
                </div>
                <div className="chat-bubble-assistant p-4">
                  <div className="flex space-x-1">
                    <motion.div
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 1.4, repeat: Infinity }}
                      className="w-2 h-2 bg-neutral-500 rounded-full"
                    />
                    <motion.div
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 1.4, repeat: Infinity, delay: 0.2 }}
                      className="w-2 h-2 bg-neutral-500 rounded-full"
                    />
                    <motion.div
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 1.4, repeat: Infinity, delay: 0.4 }}
                      className="w-2 h-2 bg-neutral-500 rounded-full"
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {apiError && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="max-w-[80%]">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div className="chat-bubble-assistant p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-700">{apiError}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Container */}
      <div className="p-4 border-t border-white border-opacity-10 bg-neutral-50">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-end space-x-3">
            <div className="flex-1">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Paste your code here for review..."
                className="input-field w-full resize-none p-4 min-h-[56px] max-h-32"
                rows={1}
              />
            </div>
            <motion.button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isTyping}
              className="btn-primary p-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={!inputValue.trim() || isTyping ? {} : { scale: 1.05 }}
              whileTap={!inputValue.trim() || isTyping ? {} : { scale: 0.95 }}
            >
              <Send className="w-5 h-5" />
            </motion.button>
          </div>
          
          <p className="text-xs text-neutral-500 mt-2 text-center">
            AI Code Reviewer provides detailed analysis, suggestions, and risk assessment. Always review and test code changes before implementing.
          </p>
        </div>
      </div>
    </div>
  );
} 
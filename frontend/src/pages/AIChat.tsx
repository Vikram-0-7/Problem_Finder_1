import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, User, Send, Sparkles, MessageSquare } from 'lucide-react';
import { chatExamples } from '../data/dummyData';
import { generateId } from '../utils';
import type { ChatMessage } from '../types';
import { chatApi } from '../services/api';

/* ─── Mock AI responses ─── */
const aiResponses: Record<string, string> = {
  education:
    'Based on government data, India faces several critical education challenges:\n\n• **1.06 million teacher vacancies** in government schools (UDISE+ 2023-24)\n• **12.6% dropout rate** at the secondary level, disproportionately affecting SC/ST students\n• **11.4% single-teacher schools** in rural areas\n• Digital divide with limited access to online learning infrastructure\n\nKey reports: UDISE+ Report, AISHE Report, NEP 2020 Progress Report.',
  healthcare:
    'India\'s healthcare system faces significant challenges:\n\n• **22% PHCs operate without a doctor** (Rural Health Statistics 2023-24)\n• **35.5% of children under 5 are stunted** (NFHS-5)\n• Shortage of **specialist doctors at 30% of CHCs**\n• Mental health infrastructure severely lacking\n\nReferences: Rural Health Statistics, NFHS-5, National Health Profile 2024.',
  environment:
    'Environmental challenges identified from government data:\n\n• **Delhi AQI exceeds 400+** during winter months (CPCB 2024)\n• **1,186 groundwater blocks** classified as over-exploited (CGWB)\n• **1.67 million deaths annually** attributed to air pollution\n• Only 22% of waste scientifically processed in tier-2 cities\n\nKey sources: CPCB, CGWB Annual Report, SBM-Urban 2.0.',
  default:
    'Based on my analysis of government reports and datasets, I found several relevant problems related to your query. Here are the key findings:\n\n• Multiple government reports highlight systemic issues in this area\n• Data from official sources indicates growing concern among policy makers\n• Several states have reported increasing trends in this problem category\n• Policy interventions have been recommended but implementation varies\n\nWould you like me to provide more specific data on any particular aspect?',
};

function getAIResponse(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes('education') || lower.includes('school') || lower.includes('teacher')) return aiResponses.education;
  if (lower.includes('health') || lower.includes('hospital') || lower.includes('doctor')) return aiResponses.healthcare;
  if (lower.includes('environment') || lower.includes('pollution') || lower.includes('water') || lower.includes('air')) return aiResponses.environment;
  return aiResponses.default;
}

/* ─── Typing dots animation ─── */
function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-4 py-3">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-2 h-2 rounded-full bg-text-muted"
          animate={{ y: [0, -6, 0], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </div>
  );
}

export default function AIChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    document.title = 'AI Assistant — Government Problem Finder';
  }, []);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  const sendMessage = useCallback(
    (text: string) => {
      if (!text.trim() || isTyping) return;

      const userMessage: ChatMessage = {
        id: generateId(),
        role: 'user',
        content: text.trim(),
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setInput('');
      setIsTyping(true);

      // Call actual backend API
      chatApi.sendMessage(text.trim())
        .then((data) => {
          const response: ChatMessage = {
            id: generateId(),
            role: 'assistant',
            content: data.reply,
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, response]);
          setIsTyping(false);
        })
        .catch((err) => {
          console.warn("Backend chat failed, falling back to local simulation:", err);
          // Fallback to local simulation if backend API is not running or fails
          setTimeout(() => {
            const response: ChatMessage = {
              id: generateId(),
              role: 'assistant',
              content: getAIResponse(text),
              timestamp: new Date(),
            };
            setMessages((prev) => [...prev, response]);
            setIsTyping(false);
          }, 1000);
        });
    },
    [isTyping]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleExampleClick = (example: string) => {
    sendMessage(example);
  };

  return (
    <div className="min-h-screen pt-16 flex flex-col">
      {/* Header */}
      <motion.div
        className="border-b border-border px-4 py-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Bot className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-semibold">AI Assistant</h1>
            <p className="text-xs text-text-muted">Powered by Government Data Analysis</p>
          </div>
          <div className="ml-auto">
            <span className="flex items-center gap-1.5 text-xs text-green-500">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Online
            </span>
          </div>
        </div>
      </motion.div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Initial state: example prompts */}
          {messages.length === 0 && !isTyping && (
            <motion.div
              className="flex flex-col items-center justify-center py-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold mb-2">How can I help you?</h2>
              <p className="text-text-secondary mb-8 text-center max-w-md">
                Ask me about government problems, policies, or data insights from official reports.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl">
                {chatExamples.map((example, i) => (
                  <motion.div
                    key={example}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.08 }}
                  >
                    <button
                      onClick={() => handleExampleClick(example)}
                      className="w-full text-left p-4 rounded-xl border border-border bg-card hover:bg-card-hover hover:border-border-light transition-all group"
                    >
                      <div className="flex items-start gap-3">
                        <MessageSquare className="w-4 h-4 text-text-muted flex-shrink-0 mt-0.5 group-hover:text-primary transition-colors" />
                        <span className="text-sm text-text-secondary group-hover:text-text transition-colors">
                          {example}
                        </span>
                      </div>
                    </button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Messages */}
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.3 }}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start gap-3 max-w-[85%] ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  {/* Avatar */}
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      message.role === 'user'
                        ? 'bg-primary'
                        : 'bg-card border border-border'
                    }`}
                  >
                    {message.role === 'user' ? (
                      <User className="w-4 h-4 text-white" />
                    ) : (
                      <Bot className="w-4 h-4 text-primary" />
                    )}
                  </div>

                  {/* Message bubble */}
                  <div
                    className={`rounded-2xl px-4 py-3 ${
                      message.role === 'user'
                        ? 'bg-primary text-white rounded-tr-md'
                        : 'bg-card border border-border rounded-tl-md'
                    }`}
                  >
                    <div
                      className={`text-sm leading-relaxed whitespace-pre-line ${
                        message.role === 'assistant' ? 'text-text-secondary' : ''
                      }`}
                      dangerouslySetInnerHTML={{
                        __html: message.content
                          .replace(/\*\*(.*?)\*\*/g, '<strong class="text-text font-semibold">$1</strong>')
                          .replace(/\n/g, '<br/>')
                      }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing indicator */}
          {isTyping && (
            <motion.div
              className="flex items-start gap-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="w-8 h-8 rounded-lg bg-card border border-border flex items-center justify-center">
                <Bot className="w-4 h-4 text-primary" />
              </div>
              <div className="rounded-2xl rounded-tl-md bg-card border border-border">
                <TypingIndicator />
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <motion.div
        className="border-t border-border px-4 py-4 bg-bg/80 backdrop-blur-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto flex items-center gap-3">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about government problems..."
            className="flex-1 bg-card border border-border rounded-xl px-4 py-3 text-sm text-text placeholder-text-muted focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
            disabled={isTyping}
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="w-11 h-11 rounded-xl bg-primary hover:bg-primary-light disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
          >
            <Send className="w-4 h-4 text-white" />
          </button>
        </form>
        <p className="max-w-4xl mx-auto text-xs text-text-muted mt-2 text-center">
          AI responses are based on government data and may not reflect real-time information.
        </p>
      </motion.div>
    </div>
  );
}

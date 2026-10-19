import React, { useState } from 'react';
import { X, Send, Sparkles, CheckCircle2 } from 'lucide-react';

interface ComingSoonModalProps {
  topic: string;
  isOpen: boolean;
  onClose: () => void;
}

export const ComingSoonModal: React.FC<ComingSoonModalProps> = ({
  topic,
  isOpen,
  onClose,
}) => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  };

  const getTopicDescription = () => {
    switch (topic.toLowerCase()) {
      case 'about':
        return 'Dev Summit 2026 Cybertron Edition unites the global developer ecosystem. Full manifesto, theme insights, and schedule details are being finalized.';
      case 'events':
        return 'Discover deep technical tracks in AI Agents, Cloud Scale, Web Architectures, and Quantum Security. Track breakdowns are releasing soon.';
      case 'speakers':
        return 'Our world-class faculty of engineering leaders, founders, and core maintainers will be unveiled in upcoming announcements.';
      case 'register':
        return 'Ticket allocations are currently in pre-release. Join the priority waitlist to lock in early-bird access.';
      default:
        return 'This section will unlock shortly. Register below to receive priority dispatch notifications.';
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${topic} Coming Soon`}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-lg rounded-2xl bg-[#070d22] border border-cyan-400/40 p-6 sm:p-8 shadow-[0_0_50px_rgba(0,240,255,0.25)] text-center">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 font-mono text-xs uppercase tracking-widest mb-4">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>CYBERTRON TRANSMISSION</span>
        </div>

        <h3 className="font-heading text-2xl font-black text-white uppercase tracking-wider mb-2">
          {topic}
        </h3>

        <div className="font-tech text-sm font-bold text-[#ff4b26] uppercase tracking-widest mb-4">
          COMING SOON
        </div>

        <p className="text-sm text-slate-300 leading-relaxed mb-6">
          {getTopicDescription()}
        </p>

        {submitted ? (
          <div className="p-4 rounded-xl bg-cyan-950/60 border border-cyan-400 text-center text-xs text-cyan-200 space-y-1">
            <CheckCircle2 className="w-6 h-6 text-cyan-400 mx-auto" />
            <div className="font-bold text-white uppercase">Waitlist Confirmed</div>
            <p>We'll notify {email} as soon as this drops.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="developer@domain.com"
              className="flex-1 px-4 py-3 rounded-lg bg-black/80 border border-slate-700 text-white placeholder-slate-500 text-xs font-mono focus-visible:ring-2 focus-visible:ring-cyan-400 outline-none"
            />
            <button
              type="submit"
              className="cyber-clip px-5 py-3 bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 text-black font-heading font-black text-xs uppercase tracking-wider cursor-pointer"
            >
              Notify Me
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

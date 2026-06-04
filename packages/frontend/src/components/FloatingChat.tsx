import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send } from 'lucide-react';
import Link from 'next/link';

export default function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="mb-4 h-[500px] w-[350px] overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900"
          >
            <div className="flex items-center justify-between bg-slate-900 px-6 py-4 text-white">
              <div>
                <p className="text-sm font-semibold">Live Support</p>
                <p className="text-xs text-slate-400">Admin sedang online</p>
              </div>
              <button onClick={() => setIsOpen(false)} className="rounded-full p-1 hover:bg-white/10">
                <X size={20} />
              </button>
            </div>
            
            <div className="flex h-[380px] flex-col items-center justify-center p-8 text-center">
              <div className="rounded-full bg-slate-100 p-4 dark:bg-slate-800">
                <MessageSquare className="text-slate-400" size={32} />
              </div>
              <h3 className="mt-4 font-semibold text-slate-900 dark:text-white">Ada yang bisa kami bantu?</h3>
              <p className="mt-2 text-sm text-slate-500">Mulai percakapan dengan tim kami sekarang.</p>
              <Link 
                href="/chat"
                className="mt-6 rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-slate-200 dark:text-slate-900"
              >
                Buka Chat Fullscreen
              </Link>
            </div>

            <div className="border-t border-slate-100 p-4 dark:border-slate-800">
               <div className="flex gap-2">
                 <input 
                    disabled 
                    placeholder="Ketik di fullscreen..." 
                    className="w-full bg-transparent text-sm outline-none"
                 />
                 <Send size={18} className="text-slate-300" />
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-900 text-white shadow-xl transition-transform hover:scale-110 active:scale-95 dark:bg-slate-200 dark:text-slate-900"
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </button>
    </div>
  );
}
import { Logo } from "./Logo";
import { motion } from "framer-motion";

export function BrandFooter() {
  return (
    <footer className="w-full py-12 px-6 sm:px-10 border-t border-white/5 bg-black/40 backdrop-blur-xl">
      <div className="w-full flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex flex-col items-center md:items-start gap-2">
          <Logo size="sm" />
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mt-2">
            Master Your Money // Pocket Fund
          </p>
        </div>

        <div className="flex items-center gap-6">
          <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest cursor-pointer hover:text-white transition-colors">Security</span>
          <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest cursor-pointer hover:text-white transition-colors">Privacy</span>
          <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest cursor-pointer hover:text-white transition-colors">Terms</span>
        </div>

        <div className="text-center md:text-right">
          <p className="text-[10px] font-black text-white/10 uppercase tracking-[0.3em]">
            © 2026 POCKET FUND ACADEMY. ALL RIGHTS RESERVED.
          </p>
        </div>
      </div>
    </footer>
  );
}

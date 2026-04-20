import { motion } from "framer-motion";

interface LogoProps {
  className?: string;
  showText?: boolean;
  textColor?: string;
  size?: "sm" | "md" | "lg";
}

export function Logo({ className = "", showText = true, textColor = "text-white", size = "md" }: LogoProps) {
  const sizes = {
    sm: { dot: "w-4 h-4", glow: "w-8 h-8", text: "text-base" },
    md: { dot: "w-6 h-6", glow: "w-10 h-10", text: "text-xl" },
    lg: { dot: "w-10 h-10", glow: "w-16 h-16", text: "text-3xl" },
  };

  const currentSize = sizes[size];

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className={`relative flex items-center justify-center ${currentSize.glow}`}>
        {/* Glow effect */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 bg-primary/30 rounded-full blur-md"
        />
        {/* Border ring */}
        <div className="absolute inset-0 rounded-full border border-primary/20 bg-black/40 shadow-inner" />
        
        {/* Blue Dot */}
        <motion.div
          animate={{ scale: [0.95, 1.05, 0.95] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className={`${currentSize.dot} rounded-full bg-primary shadow-[0_0_12px_rgba(100,206,251,0.8)] z-10`}
        />
      </div>

      {showText && (
        <span className={`${currentSize.text} font-black tracking-tighter uppercase italic leading-none ${textColor}`}>
          Pocket Fund
        </span>
      )}
    </div>
  );
}

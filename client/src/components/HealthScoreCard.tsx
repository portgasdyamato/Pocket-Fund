import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Activity } from "lucide-react";

interface HealthScoreCardProps {
  score: number;
  message: string;
}

export default function HealthScoreCard({ score, message }: HealthScoreCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-primary";
    if (score >= 60) return "text-secondary";
    return "text-destructive";
  };

  const getGlowColor = (score: number) => {
    if (score >= 80) return "rgba(139, 92, 246, 0.4)"; // Primary
    if (score >= 60) return "rgba(6, 182, 212, 0.4)";  // Secondary
    return "rgba(239, 68, 68, 0.4)";      // Destructive
  };

  return (
    <Card className="glass-morphism border-white/5 p-8 h-full relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />
      
      <div className="flex flex-col items-center justify-center gap-6 relative z-10 h-full">
        <div className="relative w-44 h-44 flex items-center justify-center">
          {/* Circular Progress SVG */}
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
            {/* Background Circle */}
            <circle
              cx="80"
              cy="80"
              r="70"
              fill="none"
              stroke="rgba(255,255,255,0.05)"
              strokeWidth="10"
              strokeLinecap="round"
            />
            {/* Main Progress Circle */}
            <motion.circle
              cx="80"
              cy="80"
              r="70"
              fill="none"
              stroke="currentColor"
              strokeWidth="10"
              strokeLinecap="round"
              initial={{ strokeDasharray: "0 440" }}
              animate={{ strokeDasharray: `${(score / 100) * 440} 440` }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className={getScoreColor(score)}
              style={{
                filter: `drop-shadow(0 0 8px ${getGlowColor(score)})`
              }}
            />
          </svg>
          
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col items-center"
            >
              <div className="flex items-center gap-1 mb-[-4px]">
                <Activity className={`w-4 h-4 ${getScoreColor(score)}`} />
                <span className="text-xs font-black uppercase tracking-[0.2em] text-white/40">Vitality</span>
              </div>
              <span className={`text-6xl font-black tracking-tighter ${getScoreColor(score)}`}>
                {score}
              </span>
              <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest mt-[-2px]">
                Score Matrix
              </span>
            </motion.div>
          </div>
        </div>

        <div className="text-center max-w-[240px]">
          <h3 className="text-lg font-bold text-white mb-2">Financial Vitality</h3>
          <p className="text-sm text-white/50 leading-relaxed font-medium">
            {message}
          </p>
        </div>
      </div>
    </Card>
  );
}

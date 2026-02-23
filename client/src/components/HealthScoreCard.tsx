import { Card } from "@/components/ui/card";
import { motion, useAnimation } from "framer-motion";
import { Activity, ShieldCheck, Zap, TrendingUp, AlertCircle } from "lucide-react";
import { useEffect } from "react";

interface HealthScoreCardProps {
  score: number;
  message: string;
}

export default function HealthScoreCard({ score, message }: HealthScoreCardProps) {
  const controls = useAnimation();

  useEffect(() => {
    controls.start({
      opacity: 1,
      scale: 1,
      transition: { duration: 0.8, ease: "easeOut" }
    });
  }, [controls]);

  const getScoreInfo = (score: number) => {
    if (score >= 80) return { 
      color: "text-[#10b981]", 
      glow: "rgba(16, 185, 129, 0.5)", 
      label: "ELITE", 
      icon: ShieldCheck,
      gradient: "from-[#10b981] to-[#34d399]"
    };
    if (score >= 60) return { 
      color: "text-[#6366f1]", 
      glow: "rgba(99, 102, 241, 0.5)", 
      label: "STABLE", 
      icon: TrendingUp,
      gradient: "from-[#6366f1] to-[#818cf8]"
    };
    return { 
      color: "text-[#f43f5e]", 
      glow: "rgba(244, 63, 94, 0.5)", 
      label: "CRITICAL", 
      icon: AlertCircle,
      gradient: "from-[#f43f5e] to-[#fb7185]"
    };
  };

  const info = getScoreInfo(score);
  const StatusIcon = info.icon;

  return (
    <Card className="glass-morphism border-white/5 p-8 h-full relative overflow-hidden group min-h-[420px] flex flex-col justify-between">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className={`absolute -top-24 -right-24 w-64 h-64 bg-gradient-to-br ${info.gradient} opacity-5 blur-[100px] rounded-full`} />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] pointer-events-none" />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-8 h-full">
        {/* Header Area */}
        <div className="w-full flex justify-between items-start mb-2">
          <div className="flex flex-col">
            <span className="text-[10px] font-black tracking-[0.3em] text-white/30 uppercase">System Status</span>
            <div className={`flex items-center gap-2 mt-1 ${info.color}`}>
              <StatusIcon className="w-4 h-4" />
              <span className="text-xs font-bold tracking-widest">{info.label}</span>
            </div>
          </div>
          <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
            <Zap className={`w-5 h-5 ${info.color}`} />
          </div>
        </div>

        {/* Circular Matrix Progress */}
        <div className="relative w-56 h-56 flex items-center justify-center">
          {/* Animated Background Rings */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="w-full h-full border border-dashed border-white/5 rounded-full"
            />
            <motion.div 
              animate={{ rotate: -360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="absolute w-[80%] h-[80%] border border-dotted border-white/10 rounded-full"
            />
          </div>

          <svg className="w-full h-full transform -rotate-90 relative z-10" viewBox="0 0 240 240">
            <defs>
              <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={info.glow} />
                <stop offset="100%" stopColor="transparent" />
              </linearGradient>
            </defs>
            {/* Background Circle */}
            <circle
              cx="120"
              cy="120"
              r="95"
              fill="none"
              stroke="rgba(255,255,255,0.03)"
              strokeWidth="12"
              strokeLinecap="round"
            />
            {/* Main Progress Circle */}
            <motion.circle
              cx="120"
              cy="120"
              r="95"
              fill="none"
              stroke="currentColor"
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray="597"
              initial={{ strokeDashoffset: 597 }}
              animate={{ strokeDashoffset: 597 - (score / 100) * 597 }}
              transition={{ duration: 2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              className={info.color}
              style={{
                filter: `drop-shadow(0 0 20px ${info.glow})`
              }}
            />
            
            {/* Inner Decorative Dashes */}
            {[...Array(12)].map((_, i) => (
              <line
                key={i}
                x1="120"
                y1="35"
                x2="120"
                y2="45"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="2"
                transform={`rotate(${i * 30} 120 120)`}
              />
            ))}
          </svg>
          
          <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-col items-center"
            >
              <div className="flex items-center gap-1.5 mb-[-2px]">
                <Activity className={`w-3.5 h-3.5 ${info.color} opacity-60`} />
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">Vitality</span>
              </div>
              <div className="relative group">
                <span className={`text-7xl font-black tracking-tighter tabular-nums ${info.color} relative z-10`}>
                  {score}
                </span>
                <span className={`absolute inset-0 blur-2xl ${info.color} opacity-20 scale-110`}>
                  {score}
                </span>
              </div>
              <span className="text-[9px] font-black text-white/30 uppercase tracking-[0.5em] mt-1">
                Score Matrix
              </span>
            </motion.div>
          </div>
        </div>

        {/* Footer Text Area */}
        <div className="text-center w-full mt-auto">
          <h3 className="text-xl font-black text-white tracking-tight mb-3">Financial Vitality</h3>
          <div className="relative p-4 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-sm">
            <p className="text-sm text-white/50 leading-relaxed font-medium">
              {message}
            </p>
            {/* Subtle progress bar at bottom of message box */}
            <div className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-transparent via-primary/30 to-transparent w-full opacity-50" />
          </div>
        </div>
      </div>
    </Card>
  );
}

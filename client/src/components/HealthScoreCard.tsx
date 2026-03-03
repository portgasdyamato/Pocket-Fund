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
    <Card className="glass-morphism border-white/5 p-8 h-full relative group min-h-[420px] flex flex-col justify-between">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className={`absolute -top-24 -right-24 w-64 h-64 bg-gradient-to-br ${info.gradient} opacity-5 blur-[100px] rounded-full`} />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] pointer-events-none" />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-8 h-full">
        {/* Header Area */}
        <div className="w-full flex justify-between items-start mb-2">
          <div className="flex flex-col">
            <span className="text-[10px] font-black tracking-[0.3em] text-white/30 uppercase">Member Status</span>
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
        <div className="relative w-64 h-64 flex items-center justify-center overflow-visible">
          {/* Animated Background Rings */}
          <div className="absolute inset-0 flex items-center justify-center overflow-visible">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              className="w-full h-full border border-dashed border-white/5 rounded-full"
            />
            <motion.div 
              animate={{ rotate: -360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute w-[85%] h-[85%] border border-dotted border-white/10 rounded-full"
            />
            {/* Inner Glow Pulse */}
            <motion.div 
              animate={{ opacity: [0.05, 0.1, 0.05], scale: [0.95, 1.05, 0.95] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className={`absolute w-[60%] h-[60%] rounded-full blur-3xl ${info.color} opacity-10`}
            />
          </div>

          <svg className="w-full h-full transform -rotate-90 relative z-10 overflow-visible" viewBox="-40 -40 320 320">
            <defs>
              <linearGradient id="mainProgressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={info.glow} stopOpacity="0.2" />
                <stop offset="50%" stopColor={info.glow} stopOpacity="1" />
                <stop offset="100%" stopColor="white" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            
            {/* Background Track with glass effect */}
            <circle
              cx="120"
              cy="120"
              r="100"
              fill="none"
              stroke="rgba(255,255,255,0.03)"
              strokeWidth="14"
              strokeLinecap="round"
            />
            
            {/* Main Progress Circle with Gradient and Glow */}
            <motion.circle
              cx="120"
              cy="120"
              r="100"
              fill="none"
              stroke="url(#mainProgressGradient)"
              strokeWidth="14"
              strokeLinecap="round"
              strokeDasharray="628"
              initial={{ strokeDashoffset: 628 }}
              animate={{ strokeDashoffset: 628 - (score / 100) * 628 }}
              transition={{ duration: 2.5, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              style={{
                filter: `drop-shadow(0 0 12px ${info.glow})`
              }}
            />

            {/* Glowing Head Point */}
            <motion.circle
              cx="120"
              cy="20"
              r="4"
              fill="white"
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: 1,
                rotate: (score / 100) * 360 
              }}
              transition={{ duration: 2.5, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              transform-origin="120 120"
              style={{ filter: 'drop-shadow(0 0 8px white)' }}
            />
            
            {/* Precision Tick Marks */}
            {[...Array(60)].map((_, i) => {
              const rotate = i * 6;
              const isMajor = i % 5 === 0;
              return (
                <line
                  key={i}
                  x1="120"
                  y1={isMajor ? "28" : "32"}
                  x2="120"
                  y2="38"
                  stroke={isMajor ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.05)"}
                  strokeWidth={isMajor ? "2" : "1"}
                  transform={`rotate(${rotate} 120 120)`}
                />
              );
            })}
          </svg>
          
          <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, type: "spring", damping: 15 }}
              className="flex flex-col items-center justify-center -space-y-1"
            >
              <div className="flex items-center gap-1.5 mb-1">
                <Activity className={`w-3 h-3 ${info.color} opacity-80`} />
                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/40">Health</span>
              </div>
              
              <div className="relative flex items-center justify-center">
                <span className={`text-6xl font-black tracking-tighter tabular-nums ${info.color} relative z-10 drop-shadow-2xl`}>
                  {score}
                </span>
                <div className={`absolute inset-0 blur-3xl ${info.color} opacity-20 scale-125 rounded-full`} />
              </div>

              <span className="text-[8px] font-black text-white/30 uppercase tracking-[0.2em] mt-1">
                Financial Score
              </span>
            </motion.div>
          </div>
        </div>

        {/* Footer Text Area */}
        <div className="text-center w-full mt-auto">
          <h3 className="text-xl font-black text-white tracking-tight mb-3">Financial Health</h3>
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

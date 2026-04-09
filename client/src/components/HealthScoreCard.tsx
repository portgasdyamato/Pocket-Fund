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
    if (score >= 85) return { 
      color: "text-green-400", 
      glow: "rgba(34, 197, 94, 0.4)", 
      label: "EXCELLENT", 
      icon: ShieldCheck,
      hex: "#22c55e",
      tip: "Your financial health is top-tier. Your discipline is paying off!"
    };
    if (score >= 70) return { 
      color: "text-blue-400", 
      glow: "rgba(100, 206, 251, 0.4)", 
      label: "STABLE", 
      icon: TrendingUp,
      hex: "#64CEFB",
      tip: "You have a solid foundation. Keep hitting those goals."
    };
    if (score >= 50) return { 
      color: "text-blue-400", 
      glow: "rgba(96, 165, 250, 0.4)", 
      label: "IMPROVING", 
      icon: Activity,
      hex: "#60a5fa",
      tip: "You're on the right track. Consistency will raise your score."
    };
    return { 
      color: "text-red-400", 
      glow: "rgba(248, 113, 113, 0.4)", 
      label: "CRITICAL", 
      icon: AlertCircle,
      hex: "#f87171",
      tip: "Score is low. Try saving more or clearing your 'Ick' spending."
    };
  };

  const info = getScoreInfo(score);
  const StatusIcon = info.icon;
  const gradientId = `scoreGradient-${info.label}`;

  return (
    <Card className="ice-frost border-white/5 p-8 h-full relative group min-h-[420px] flex flex-col justify-between overflow-hidden">
      {/* Carbon Fibre Texture Overlay Only */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] pointer-events-none" />

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
          {/* Subtle Background Rings */}
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
          </div>

          <svg className="w-full h-full transform -rotate-90 relative z-10 overflow-visible" viewBox="-40 -40 320 320">
            {/* Background Track */}
            <circle
              cx="120"
              cy="120"
              r="100"
              fill="none"
              stroke="rgba(255,255,255,0.02)"
              strokeWidth="14"
              strokeLinecap="round"
            />
            
            {/* Main Progress Circle - Glow synchronized via motion to avoid redraw lag */}
            <motion.circle
              cx="120"
              cy="120"
              r="100"
              fill="none"
              strokeWidth="14"
              strokeLinecap="round"
              strokeDasharray="628"
              initial={{ strokeDashoffset: 628, stroke: info.hex }}
              animate={{ 
                strokeDashoffset: 628 - (score / 100) * 628,
                stroke: info.hex,
                filter: `drop-shadow(0 0 12px ${info.hex})`
              }}
              transition={{ duration: 2.5, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            />

            {/* Glowing Head Point - Unified Color */}
            <motion.circle
              cx="120"
              cy="20"
              r="6"
              initial={{ opacity: 0, fill: info.hex }}
              animate={{ 
                opacity: 1,
                rotate: (score / 100) * 360,
                fill: info.hex
              }}
              transition={{ duration: 2.5, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              transform-origin="120 120"
              style={{ filter: `drop-shadow(0 0 10px ${info.hex})` }}
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
                <span className={`text-6xl font-black tracking-tighter tabular-nums ${info.color} relative z-10 [text-shadow:_0_0_20px_rgba(255,255,255,0.2)]`}>
                  {score}
                </span>
                {/* Score Core Glow - Fully Synchronized using motion.div */}
                <motion.div 
                  className="absolute inset-0 blur-[60px] opacity-40 scale-150 rounded-full" 
                  animate={{ backgroundColor: info.hex }}
                  transition={{ duration: 2.5, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                />
              </div>

              <span className="text-[8px] font-black text-white/30 uppercase tracking-[0.2em] mt-1">
                Financial Score
              </span>
            </motion.div>
          </div>
        </div>

        {/* Footer Text Area */}
        <div className="text-center w-full mt-auto">
          <h3 className="text-xl font-black text-white tracking-tight mb-2 opacity-90"> Financial Health Analysis</h3>
          <div className="relative p-4 rounded-2xl bg-white/[0.03] border border-white/5 backdrop-blur-sm overflow-hidden min-h-[70px] flex items-center justify-center text-center">
             <p className="text-sm text-white/70 leading-relaxed font-medium">
               {message}
             </p>
            {/* Dynamic progress highlight at bottom of message box */}
            <div className={`absolute bottom-0 left-0 h-[3px] w-full transition-all duration-500`} style={{ background: info.hex, boxShadow: `0 0 15px ${info.hex}` }} />
          </div>
        </div>
      </div>
    </Card>
  );
}

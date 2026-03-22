import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Activity, ShieldCheck, Zap, TrendingUp, AlertCircle, Sparkles } from "lucide-react";

interface HealthScoreCardProps {
  score: number;
  message: string;
}

export default function HealthScoreCard({ score, message }: HealthScoreCardProps) {
  const getScoreInfo = (score: number) => {
    if (score >= 85) return { 
      color: "text-emerald-400", 
      label: "ELITE", 
      icon: ShieldCheck,
      hex: "#10b981",
      bg: "bg-emerald-400/10",
      border: "border-emerald-500/20"
    };
    if (score >= 70) return { 
      color: "text-blue-400", 
      label: "STABLE", 
      icon: TrendingUp,
      hex: "#3b82f6",
      bg: "bg-blue-400/10",
      border: "border-blue-500/20"
    };
    if (score >= 50) return { 
      color: "text-cyan-400", 
      label: "RISING", 
      icon: Activity,
      hex: "#06b6d4",
      bg: "bg-cyan-400/10",
      border: "border-cyan-500/20"
    };
    return { 
      color: "text-red-400", 
      label: "CRITICAL", 
      icon: AlertCircle,
      hex: "#f43f5e",
      bg: "bg-red-400/10",
      border: "border-red-500/20"
    };
  };

  const info = getScoreInfo(score);
  const StatusIcon = info.icon;

  return (
    <Card className="glass-card p-8 h-full relative group min-h-[420px] flex flex-col justify-between overflow-hidden border border-white/5">
      {/* Background Refraction */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-white/[0.02] blur-[100px] rounded-full -mr-40 -mt-40 group-hover:bg-white/[0.04] transition-colors duration-1000" />
      
      <div className="relative z-10 flex flex-col items-center gap-8 h-full">
        {/* Header Area */}
        <div className="w-full flex justify-between items-start">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold tracking-[0.3em] text-white/20 uppercase">Network Status</span>
            <div className={`flex items-center gap-2 mt-1 ${info.color}`}>
              <div className={`w-1.5 h-1.5 rounded-full ${info.hex.includes('10b981') ? 'bg-emerald-400' : 'bg-current'} animate-pulse`} />
              <span className="text-xs font-black tracking-widest uppercase">{info.label} MEMBER</span>
            </div>
          </div>
          <div className={`h-12 w-12 rounded-2xl ${info.bg} border ${info.border} flex items-center justify-center`}>
            <StatusIcon className={`w-6 h-6 ${info.color}`} />
          </div>
        </div>

        {/* Matrix Visualization */}
        <div className="relative w-72 h-72 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 40, repeat: Infinity, ease: "linear" }} className="w-full h-full border border-dashed border-white/5 rounded-full" />
            <motion.div animate={{ rotate: -360 }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }} className="absolute w-[80%] h-[80%] border border-dotted border-white/10 rounded-full" />
          </div>

          <svg className="w-full h-full transform -rotate-90 relative z-10 overflow-visible" viewBox="-20 -20 240 240">
            {/* Background Track */}
            <circle cx="100" cy="100" r="90" fill="none" stroke="white" strokeOpacity="0.03" strokeWidth="12" strokeLinecap="round" />
            
            {/* Health Meter */}
            <motion.circle
              cx="100" cy="100" r="90" fill="none" strokeWidth="12" strokeLinecap="round" strokeDasharray="565"
              initial={{ strokeDashoffset: 565, stroke: info.hex }}
              animate={{ 
                strokeDashoffset: 565 - (score / 100) * 565,
                stroke: info.hex,
              }}
              transition={{ duration: 2.5, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              style={{ filter: `drop-shadow(0 0 12px ${info.hex}44)` }}
            />
            
            {/* Axis Markers */}
            {[...Array(8)].map((_, i) => (
              <line key={i} x1="100" y1="10" x2="100" y2="22" stroke="white" strokeOpacity="0.1" strokeWidth="2" transform={`rotate(${i * 45} 100 100)`} />
            ))}
          </svg>
          
          <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="flex flex-col items-center justify-center">
              <div className="flex items-center gap-2 mb-1 opacity-40">
                <Sparkles className={`w-3 h-3 ${info.color}`} />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Health Score</span>
              </div>
              <div className="relative">
                <span className={`text-7xl font-black tracking-tighter tabular-nums ${info.color} [text-shadow:0_0_30px_rgba(255,255,255,0.1)]`}>
                  {score}
                </span>
                <motion.div className="absolute inset-0 blur-[60px] opacity-20" animate={{ backgroundColor: info.hex }} />
              </div>
              <span className="text-[9px] font-bold text-white/20 uppercase tracking-[0.3em] mt-2">Precision Metric</span>
            </motion.div>
          </div>
        </div>

        {/* Insights Area */}
        <div className="w-full mt-auto">
          <div className="p-5 rounded-3xl bg-white/[0.03] border border-white/5 backdrop-blur-md relative overflow-hidden group/box">
             <div className="relative z-10">
               <div className="flex items-center gap-2 mb-2">
                 <Zap className={`w-3.5 h-3.5 ${info.color}`} />
                 <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Financial AI Insight</span>
               </div>
               <p className="text-sm text-white/70 leading-relaxed font-medium">
                 {message}
               </p>
             </div>
             {/* Interaction Line */}
             <div className={`absolute bottom-0 left-0 h-[2px] transition-all duration-700 ease-out ${score >= 50 ? 'w-full' : 'w-1/2'}`} style={{ background: info.hex, boxShadow: `0 0 15px ${info.hex}` }} />
          </div>
        </div>
      </div>
    </Card>
  );
}


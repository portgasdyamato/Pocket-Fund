import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogOut, User, Mail, Shield, ShieldCheck, MapPin, Zap, Camera, Star, Hexagon, Trophy, Sparkles, ChevronRight, Lock, Activity, TrendingUp, Wallet, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import type { UserBadge, Badge } from "@shared/schema";

const item = { hidden: { opacity: 0, scale: 0.95 }, show: { opacity: 1, scale: 1 } };

export default function Profile() {
  const { user, logoutMutation } = useAuth();
  const { data: userBadges = [] } = useQuery<UserBadge[]>({ queryKey: ["/api/user/badges"] });
  const { data: allBadges = [] } = useQuery<Badge[]>({ queryKey: ["/api/badges"] });

  const badges = userBadges.map(ub => allBadges.find(b => b.id === ub.badgeId)).filter(Boolean);

  return (
    <div className="section-container py-20">
      <div className="flex flex-col gap-12">
        
        {/* Cinematic Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="px-4 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-[0.4em] animate-pulse">
                Identity Profile
              </div>
              <div className="h-[1px] w-20 bg-white/5" />
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-[-0.05em] leading-[0.8] mb-4 text-white uppercase">
              OPERATIONAL <br />
              <span className="text-gradient-blue">PROFILE.</span>
            </h1>
            <p className="text-white/30 text-lg font-medium tracking-tight max-w-xl">
              Centralized authorization and behavioral metrics for your financial identity.
            </p>
          </div>
          <div className="flex gap-4 w-full md:w-auto">
             <Button onClick={() => logoutMutation.mutate()} className="h-16 rounded-[24px] px-10 bg-rose-500/5 border border-rose-500/20 text-rose-500 font-black hover:bg-rose-500/10 flex items-center gap-4 text-xs uppercase tracking-widest click-scale">
                <LogOut className="w-5 h-5" /> De-Authorize Session
             </Button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
           
           {/* Primary Identity Card */}
           <div className="lg:col-span-4 flex flex-col gap-10">
              <motion.div variants={item} initial="hidden" animate="show" transition={{ duration: 0.5 }}>
                 <Card className="glass-frost p-12 relative overflow-hidden group shadow-2xl rounded-[56px] border-white/5">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 blur-[100px] rounded-full -mr-40 -mt-40 transition-transform duration-1000 group-hover:scale-125" />
                    <div className="relative z-10 flex flex-col items-center text-center">
                       <div className="relative mb-12 group cursor-pointer">
                          <div className="w-40 h-40 rounded-[48px] bg-gradient-to-br from-blue-600 to-indigo-600 p-[3px] shadow-2xl transition-all duration-700 group-hover:rotate-6">
                             <div className="w-full h-full rounded-[45px] bg-[#020205] flex items-center justify-center overflow-hidden border border-white/5 group-hover:border-white/20 transition-all">
                                <img src={user?.profileImageUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`} alt="Avatar" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                             </div>
                             <div className="absolute -bottom-2 -right-2 w-12 h-12 rounded-2xl bg-white text-black flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform border-4 border-[#020205]">
                                <Camera className="w-6 h-6" />
                             </div>
                          </div>
                          <div className="absolute inset-x-0 -bottom-16 opacity-0 group-hover:opacity-100 transition-opacity bg-white/5 backdrop-blur-3xl px-6 py-2 rounded-full border border-white/10 text-[10px] font-black uppercase tracking-widest">Update Essence</div>
                       </div>
                       
                       <div className="space-y-4">
                          <h3 className="text-4xl font-black tracking-tight text-white mb-2">{user?.firstName?.toUpperCase()} {user?.lastName?.toUpperCase()}</h3>
                          <p className="text-blue-500 font-bold tracking-[0.3em] uppercase text-[10px] mb-8">Level 42 Operator • Elite</p>
                          <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest shadow-xl">
                             <ShieldCheck className="w-4 h-4" />
                             Identity Verified 
                          </div>
                       </div>
                    </div>
                    
                    <div className="mt-16 space-y-6 relative z-10">
                       <div className="p-8 rounded-[40px] bg-white/[0.02] border border-white/5 group-hover:bg-white/[0.04] transition-all">
                          <div className="flex items-center justify-between mb-8">
                             <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">Experience Progress</p>
                             <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/40"><Hexagon className="w-6 h-6" /></div>
                          </div>
                          <div className="space-y-4">
                             <div className="flex justify-between items-baseline mb-2">
                                <span className="text-2xl font-black text-white tabular-nums">12,400 <span className="text-white/20 text-xs">/ 15,000 XP</span></span>
                                <span className="text-xs font-black text-blue-400 tracking-widest uppercase">82%</span>
                             </div>
                             <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden p-[2px]">
                                <motion.div initial={{ width: 0 }} animate={{ width: "82%" }} transition={{ duration: 2, ease: "expoOut" }} className="h-full bg-blue-600 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
                             </div>
                          </div>
                       </div>
                    </div>
                 </Card>
              </motion.div>
           </div>

           {/* Core Intel Modules */}
           <div className="lg:col-span-8 flex flex-col gap-10">
              
              {/* Detailed Intel List */}
              <motion.div variants={item} initial="hidden" animate="show" transition={{ delay: 0.1 }}>
                 <Card className="glass-frost p-12 border-white/5 rounded-[56px] shadow-2xl">
                    <h3 className="text-2xl font-black tracking-tight uppercase mb-12 flex items-center gap-5">
                       <Activity className="w-8 h-8 text-blue-500" />
                       Behavioral Metadata
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       {[
                         { icon: Mail, label: "COMMUNICATION NODE", value: user?.email, color: "text-blue-500" },
                         { icon: Shield, label: "SECURE IDENTITY", value: user?.id?.toString().slice(0, 8), color: "text-indigo-400" },
                         { icon: MapPin, label: "GEOSPACIAL ORIGIN", value: "US-EAST-01", color: "text-emerald-400" },
                         { icon: Zap, label: "LATENCY STATUS", value: "8ms SECURE", color: "text-amber-400" }
                       ].map((item, i) => (
                         <div key={i} className="p-8 rounded-[40px] bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] transition-all group flex flex-col justify-between">
                            <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mb-8">{item.label}</p>
                            <div className="flex items-center justify-between">
                               <div className="text-xl font-black text-white group-hover:text-blue-500 transition-colors uppercase tracking-tight truncate w-40">{item.value}</div>
                               <div className={`w-12 h-12 rounded-[20px] bg-white/5 flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform ${item.color}`}>
                                  <item.icon className="w-6 h-6" />
                               </div>
                            </div>
                         </div>
                       ))}
                    </div>
                 </Card>
              </motion.div>

              {/* Achievement Matrix */}
              <motion.div variants={item} initial="hidden" animate="show" transition={{ delay: 0.2 }}>
                 <Card className="glass-frost p-12 border-white/5 rounded-[56px] shadow-2xl">
                    <div className="flex items-center justify-between mb-12">
                       <h3 className="text-2xl font-black tracking-tight uppercase flex items-center gap-5">
                          <Trophy className="w-8 h-8 text-blue-500" />
                          Earned Matrix
                       </h3>
                       <Button variant="ghost" className="text-white/20 hover:text-white font-black text-[10px] tracking-widest uppercase">Registry View</Button>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
                       {badges.map((badge, i) => (
                         <div key={badge.id} className="flex flex-col items-center group cursor-pointer">
                            <div className="w-28 h-28 rounded-[38px] bg-white/[0.02] border border-white/5 flex items-center justify-center mb-6 group-hover:bg-blue-600/10 group-hover:border-blue-500/20 group-hover:scale-110 transition-all duration-700 shadow-xl group-hover:rotate-6">
                               <Sparkles className="w-10 h-10 text-blue-500 opacity-20 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] group-hover:text-white transition-colors">{badge.name}</span>
                         </div>
                       ))}
                       {badges.length === 0 && (
                         <div className="col-span-full py-20 text-center border-2 border-white/5 border-dashed rounded-[48px] opacity-20">
                            <p className="text-lg font-black italic uppercase tracking-widest text-white/30">Zero artifacts collected.</p>
                         </div>
                       )}
                    </div>
                 </Card>
              </motion.div>

              {/* Security Command */}
              <motion.div variants={item} initial="hidden" animate="show" transition={{ delay: 0.3 }}>
                 <Card className="glass-frost p-12 border-white/5 rounded-[56px] shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/5 blur-[80px] rounded-full -mr-32 -mt-32" />
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
                       <div className="flex items-center gap-8">
                          <div className="w-20 h-20 rounded-[32px] bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500 shadow-2xl group-hover:rotate-12 transition-all">
                             <Lock className="w-10 h-10" />
                          </div>
                          <div>
                             <h4 className="text-2xl font-black text-white/90 uppercase tracking-tight mb-2">Security Protocol X-1</h4>
                             <p className="text-white/30 font-medium tracking-tight">System-wide de-authorization and session termination.</p>
                          </div>
                       </div>
                       <Button onClick={() => logoutMutation.mutate()} className="h-16 rounded-[24px] px-12 bg-rose-500 hover:bg-rose-600 text-white font-black group-hover:scale-110 transition-transform shadow-2xl shadow-rose-500/20 border-none uppercase tracking-widest text-[10px]">
                          Terminate All
                       </Button>
                    </div>
                 </Card>
              </motion.div>
           </div>
        </div>
      </div>
    </div>
  );
}

import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend, AreaChart, Area
} from "recharts";
import { Activity, TrendingUp, Target, Wallet, PieChart as PieChartIcon, ArrowUpRight, Shield, Zap, BarChart3, TrendingDown, MoreHorizontal, MousePointer2 } from "lucide-react";
import type { Transaction, StashTransaction } from "@shared/schema";
import { motion, AnimatePresence } from "framer-motion";

const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

export default function Analytics() {
  const { data: transactions = [], isLoading: isLoadingTransactions } = useQuery<Transaction[]>({
    queryKey: ["/api/transactions"],
  });

  const { data: stashTransactions = [], isLoading: isLoadingStash } = useQuery<StashTransaction[]>({
    queryKey: ["/api/stash"],
  });

  // Calculate Tag Breakdown
  const tagBreakdown = transactions.reduce((acc: Record<string, number>, t) => {
    const tag = t.tag || 'Uncategorized';
    acc[tag] = (acc[tag] || 0) + Number(t.amount || 0);
    return acc;
  }, {});

  const TAG_COLORS: Record<string, string> = {
    'Need': '#3b82f6',       // Blue-500
    'Want': '#06b6d4',       // Cyan-500
    'Ick': '#f43f5e',        // Rose-500
    'Goal Claim': '#10b981',  // Emerald-500
    'Uncategorized': '#27272a' // Zinc-800
  };

  const tagData = Object.keys(tagBreakdown).map(name => ({
    name,
    value: tagBreakdown[name],
    fill: TAG_COLORS[name] || TAG_COLORS['Uncategorized']
  }));

  // Calculate Category Breakdown
  const categoryBreakdown = transactions.reduce((acc: Record<string, number>, t) => {
    const cat = t.category || 'Other';
    acc[cat] = (acc[cat] || 0) + Number(t.amount || 0);
    return acc;
  }, {});

  const categoryData = Object.keys(categoryBreakdown).map(name => ({
    name,
    value: categoryBreakdown[name]
  })).sort((a,b) => b.value - a.value).slice(0, 5);

  const totalSpent = transactions.reduce((sum, t) => sum + Number(t.amount || 0), 0);
  const totalStashed = stashTransactions.filter(t => t.type === 'stash').reduce((sum, t) => sum + Number(t.amount || 0), 0);
  
  const weeklyTrends = transactions.slice(-10).map((t, i) => ({
    name: i,
    amount: Number(t.amount || 0)
  }));

  return (
    <div className="section-container py-20">
      <div className="flex flex-col gap-12">
        
        {/* Cinematic Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="px-4 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-[0.4em] animate-pulse">
                High-Fidelity Intel
              </div>
              <div className="h-[1px] w-20 bg-white/5" />
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-[-0.05em] leading-[0.8] mb-4 text-white uppercase">
              ANALYTICS <br />
              <span className="text-gradient-blue">TERMINAL.</span>
            </h1>
            <p className="text-white/30 text-lg font-medium tracking-tight max-w-xl">
              Deconstructing your capital velocity with millisecond precision architecture.
            </p>
          </div>
          <div className="flex gap-6">
            <div className="glass-frost px-8 py-6 rounded-[32px] border-white/10 shadow-2xl">
              <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mb-2">Total Flux</p>
              <p className="text-3xl font-black text-white tabular-nums">₹{totalSpent.toLocaleString('en-IN')}</p>
            </div>
            <div className="glass-frost px-8 py-6 rounded-[32px] border-blue-500/20 shadow-2xl bg-blue-500/5">
              <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] mb-2">Preserved</p>
              <p className="text-3xl font-black text-blue-500 tabular-nums">₹{totalStashed.toLocaleString('en-IN')}</p>
            </div>
          </div>
        </motion.div>

        {/* Primary Intelligence Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Main Visualizer */}
          <div className="lg:col-span-8 space-y-10">
            <motion.div variants={item} initial="hidden" animate="show">
              <Card className="glass-frost p-10 h-[500px] border-white/5 overflow-hidden flex flex-col group">
                 <div className="flex items-center justify-between mb-12">
                   <div>
                     <h3 className="text-2xl font-black tracking-tight uppercase">Capital Trajectory</h3>
                     <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mt-1">Temporal Sequence Analysis</p>
                   </div>
                   <div className="flex gap-2">
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/5 hover:bg-white/10 cursor-pointer transition-all"><BarChart3 className="w-5 h-5 text-white/40" /></div>
                      <div className="w-10 h-10 rounded-xl bg-blue-500 text-white flex items-center justify-center border-none shadow-xl shadow-blue-500/20"><Activity className="w-5 h-5" /></div>
                   </div>
                 </div>
                 <div className="flex-1 w-full min-h-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={weeklyTrends}>
                        <defs>
                          <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="name" hide />
                        <YAxis hide domain={['auto', 'auto']} />
                        <RechartsTooltip 
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              return (
                                <div className="glass-frost border-white/10 px-6 py-4 rounded-2xl shadow-2xl">
                                  <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1.5">Value Captured</p>
                                  <p className="text-xl font-black text-blue-500 tabular-nums">₹{Number(payload[0].value).toLocaleString('en-IN')}</p>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Area type="monotone" dataKey="amount" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#areaGradient)" />
                      </AreaChart>
                    </ResponsiveContainer>
                 </div>
              </Card>
            </motion.div>

            {/* Tactical Heatmaps */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
               <motion.div variants={item} initial="hidden" animate="show" transition={{ delay: 0.1 }}>
                 <Card className="glass-frost p-10 h-[450px] flex flex-col border-white/5 group hover:border-white/10 transition-colors">
                    <h3 className="text-2xl font-black tracking-tight uppercase mb-12">Attribute Logic</h3>
                    <div className="flex-1 min-h-0">
                       <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie data={tagData} cx="50%" cy="50%" innerRadius={80} outerRadius={110} paddingAngle={8} dataKey="value">
                              {tagData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} stroke="rgba(255,255,255,0.05)" strokeWidth={4} />)}
                            </Pie>
                            <RechartsTooltip 
                              content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                  return (
                                    <div className="glass-frost border-white/10 px-6 py-4 rounded-2xl shadow-2xl">
                                      <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1.5">{payload[0].name}</p>
                                      <p className="text-xl font-black text-white tabular-nums">₹{Number(payload[0].value).toLocaleString('en-IN')}</p>
                                    </div>
                                  );
                                }
                                return null;
                              }}
                            />
                          </PieChart>
                       </ResponsiveContainer>
                    </div>
                    <div className="mt-8 flex flex-wrap gap-4 justify-center">
                       {tagData.map(t => (
                         <div key={t.name} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.02] border border-white/5">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: t.fill }} />
                            <span className="text-[10px] font-black text-white/50 uppercase tracking-widest">{t.name}</span>
                         </div>
                       ))}
                    </div>
                 </Card>
               </motion.div>

               <motion.div variants={item} initial="hidden" animate="show" transition={{ delay: 0.2 }}>
                 <Card className="glass-frost p-10 h-[450px] flex flex-col border-white/5">
                    <h3 className="text-2xl font-black tracking-tight uppercase mb-12">Sector Flux</h3>
                    <div className="flex-1 min-h-0">
                       <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={categoryData} layout="vertical">
                            <XAxis type="number" hide />
                            <YAxis dataKey="name" type="category" hide />
                            <Bar dataKey="value" fill="#3b82f6" radius={[0, 12, 12, 0]} barSize={24} />
                            <RechartsTooltip cursor={{ fill: 'transparent' }} content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                  return (
                                    <div className="glass-frost border-white/10 px-6 py-4 rounded-2xl shadow-2xl">
                                      <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1">{payload[0].payload.name}</p>
                                      <p className="text-xl font-black text-blue-400 tabular-nums">₹{Number(payload[0].value).toLocaleString('en-IN')}</p>
                                    </div>
                                  );
                                }
                                return null;
                              }} />
                          </BarChart>
                       </ResponsiveContainer>
                    </div>
                    <div className="mt-8 space-y-4">
                       {categoryData.map(c => (
                         <div key={c.name} className="flex items-center justify-between">
                            <span className="text-xs font-bold text-white/40 uppercase tracking-widest">{c.name}</span>
                            <span className="text-sm font-black text-white tabular-nums">₹{c.value.toLocaleString('en-IN')}</span>
                         </div>
                       ))}
                    </div>
                 </Card>
               </motion.div>
            </div>
          </div>

          {/* Precision Intel Sidebar */}
          <div className="lg:col-span-4 space-y-10">
             
             {/* Preservation Metrics */}
             <motion.div variants={item} initial="hidden" animate="show">
               <Card className="glass-frost p-10 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 blur-[80px] rounded-full -mr-24 -mt-24" />
                  <div className="relative z-10 flex items-center gap-6 mb-10">
                     <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-xl">
                        <Shield className="w-8 h-8" />
                     </div>
                     <div>
                        <h3 className="text-2xl font-black tracking-tight uppercase">Frost Security</h3>
                        <p className="text-[10px] font-black text-emerald-500/60 uppercase tracking-widest mt-1.5">Asset Isolation Matrix</p>
                     </div>
                  </div>
                  <div className="space-y-8 relative z-10">
                     <div>
                        <div className="flex justify-between items-center mb-4">
                           <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">Preservation Ratio</span>
                           <span className="text-xs font-black text-emerald-400 tabular-nums">{Math.round((totalStashed / (totalSpent + totalStashed)) * 100) || 0}%</span>
                        </div>
                        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                           <motion.div initial={{ width: 0 }} animate={{ width: `${(totalStashed / (totalSpent + totalStashed)) * 100 || 0}%` }} transition={{ duration: 2, ease: "circOut" }} className="h-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
                        </div>
                     </div>
                     <div className="p-6 rounded-[32px] bg-white/[0.01] border border-white/5 flex items-center justify-between">
                        <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">Integrity Score</p>
                        <p className="text-xl font-black text-white tabular-nums">98.4</p>
                     </div>
                  </div>
               </Card>
             </motion.div>

             {/* Recent Signal Log */}
             <motion.div variants={item} initial="hidden" animate="show" transition={{ delay: 0.3 }}>
               <Card className="glass-frost p-10 flex flex-col min-h-[500px]">
                  <h3 className="text-2xl font-black tracking-tight uppercase mb-10">Signal Registry</h3>
                  <div className="space-y-6 flex-1 overflow-y-auto pr-4 custom-scrollbar">
                     {transactions.slice(-8).reverse().map(t => (
                       <div key={t.id} className="flex items-center justify-between p-5 rounded-3xl bg-white/[0.01] border border-white/5 hover:bg-white/[0.06] transition-all group cursor-pointer shadow-lg">
                          <div className="flex items-center gap-5">
                             <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center border-white/10 group-hover:border-blue-500/30">
                                <Zap className="w-6 h-6 text-white/20 group-hover:text-blue-500 transition-colors" />
                             </div>
                             <div>
                                <p className="font-black text-sm text-white/80 group-hover:text-white transition-colors truncate w-32 uppercase tracking-tight">{t.description}</p>
                                <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em] mt-1.5">{t.category}</p>
                             </div>
                          </div>
                          <p className="font-black text-lg tabular-nums text-white">₹{Number(t.amount || 0).toLocaleString('en-IN')}</p>
                       </div>
                     ))}
                  </div>
               </Card>
             </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

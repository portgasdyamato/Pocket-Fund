import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend, AreaChart, Area
} from "recharts";
import { Activity, TrendingUp, Target, Wallet, PieChart as PieChartIcon, ArrowUpRight, Shield, Zap, BarChart3 } from "lucide-react";
import type { Transaction, StashTransaction } from "@shared/schema";
import { motion, AnimatePresence } from "framer-motion";

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
  }));

  // Calculate Monthly Trend
  const monthlySpending = transactions.reduce((acc: Record<string, number>, t) => {
    const month = new Date(t.date).toLocaleString('default', { month: 'short' });
    acc[month] = (acc[month] || 0) + Number(t.amount || 0);
    return acc;
  }, {});

  const barData = Object.keys(monthlySpending).map(name => ({
    name,
    amount: monthlySpending[name]
  }));

  const totalSpent = transactions.reduce((sum, t) => sum + Number(t.amount || 0), 0);
  const totalSaved = stashTransactions.reduce((sum, t) => {
    const amount = Number(t.amount || 0);
    return t.type === 'stash' ? sum + amount : sum - amount;
  }, 0);
  const savingsRate = (totalSpent + totalSaved) > 0 ? (Math.max(0, totalSaved) / (totalSpent + Math.max(0, totalSaved))) * 100 : 0;

  const hasData = transactions.length > 0;

  if (isLoadingTransactions || isLoadingStash) {
    return (
      <div className="min-h-screen bg-[#020205] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
           <div className="w-12 h-12 rounded-full border-2 border-blue-500/20 border-t-blue-500 animate-spin" />
           <p className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-500 animate-pulse">Synchronizing Data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020205] text-white selection:bg-blue-500/30 overflow-hidden relative">
      <div className="fixed inset-0 z-0 bg-mesh opacity-20 pointer-events-none" />

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12 md:py-20 space-y-24">
        
        {/* Terminal Header */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 300, damping: 25 }}>
          <div className="flex items-center gap-4 mb-8">
             <div className="w-12 h-12 rounded-[20px] bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shadow-lg shadow-blue-500/5">
                <PieChartIcon className="w-6 h-6 text-blue-400" />
             </div>
             <div>
                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-blue-500/60">INTELLIGENCE TERMINAL</span>
                <h1 className="text-4xl md:text-7xl font-black tracking-tighter mt-1">Operational Analytics</h1>
             </div>
          </div>
          <p className="text-white/30 font-medium text-lg md:text-xl tracking-tight max-w-3xl leading-relaxed">
             Real-time high-fidelity projection of resource vectors, capital preservation metrics, and systemic efficiency gradients.
          </p>
        </motion.div>

        {/* Core Matrix Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           {[
             { label: "OPERATIONAL OUTFLOW", value: `₹${totalSpent.toLocaleString('en-IN')}`, trend: "+4.2% VOD", icon: Zap, color: "text-blue-400", glow: "rgba(37,99,235,0.08)" },
             { label: "CAPITAL PRESERVATION", value: `₹${totalSaved.toLocaleString('en-IN')}`, trend: "+12.8% VOD", icon: Shield, color: "text-cyan-400", glow: "rgba(6,182,212,0.08)" },
             { label: "EFFICIENCY QUOTIENT", value: `${savingsRate.toFixed(1)}%`, trend: "STABLE", icon: Activity, color: "text-blue-500", glow: "rgba(59,130,246,0.08)" }
           ].map((stat, i) => (
              <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}>
                 <Card className="glass-card p-10 h-full relative overflow-hidden group border-white/5 hover:border-blue-500/20 transition-all">
                    <div className="absolute top-0 right-0 w-48 h-48 blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: stat.glow }} />
                    <div className="flex justify-between items-start mb-12">
                       <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">{stat.label}</p>
                       <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center">
                          <stat.icon className={`w-5 h-5 ${stat.color}`} />
                       </div>
                    </div>
                    <div className="flex items-end justify-between relative z-10">
                       <h3 className="text-4xl md:text-5xl font-black tracking-tight tabular-nums">{stat.value}</h3>
                       <div className="flex flex-col items-end">
                          <span className={`text-[9px] font-black ${stat.color} tracking-widest uppercase`}>{stat.trend}</span>
                          <div className="h-0.5 w-8 bg-blue-500/40 mt-2" />
                       </div>
                    </div>
                 </Card>
              </motion.div>
           ))}
        </div>

        {/* Visual Matrix Console */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          <Card className="glass-card p-12 h-full border-white/5 relative overflow-hidden">
             <div className="flex items-center justify-between mb-16 relative z-10">
                <div>
                   <h3 className="text-2xl font-black uppercase tracking-tight">Intent Distribution</h3>
                   <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mt-2">Allocation Matrix Profile</p>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-blue-500/5 border border-blue-500/10 flex items-center justify-center">
                   <Target className="w-7 h-7 text-blue-400" />
                </div>
             </div>
             
             {hasData ? (
               <div className="h-[400px] w-full mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                     <PieChart>
                        <Pie
                           data={tagData}
                           cx="50%"
                           cy="50%"
                           innerRadius={90}
                           outerRadius={130}
                           paddingAngle={10}
                           dataKey="value"
                           strokeWidth={0}
                        >
                           {tagData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.fill} style={{ filter: `drop-shadow(0 0 15px ${entry.fill}33)` }} />
                           ))}
                        </Pie>
                        <RechartsTooltip 
                           contentStyle={{ backgroundColor: 'rgba(10,10,15,0.8)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', backdropFilter: 'blur(12px)', color: '#fff' }}
                           itemStyle={{ color: '#fff', fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em' }}
                        />
                        <Legend verticalAlign="bottom" align="center" iconType="circle" />
                     </PieChart>
                  </ResponsiveContainer>
               </div>
             ) : <NoDataPlaceholder />}
          </Card>

          <Card className="glass-card p-12 h-full border-white/5">
             <div className="flex items-center justify-between mb-16">
                <div>
                   <h3 className="text-2xl font-black uppercase tracking-tight">Sector Segments</h3>
                   <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mt-2">Granular Expenditure Flow</p>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-cyan-500/5 border border-cyan-500/10 flex items-center justify-center">
                   <Wallet className="w-7 h-7 text-cyan-400" />
                </div>
             </div>
             
             {hasData ? (
               <div className="h-[400px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                     <BarChart data={categoryData}>
                        <XAxis dataKey="name" stroke="rgba(255,255,255,0.15)" fontSize={10} fontWeight={900} tickLine={false} axisLine={false} />
                        <YAxis hide />
                        <RechartsTooltip 
                           cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                           contentStyle={{ backgroundColor: 'rgba(10,10,15,0.8)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', backdropFilter: 'blur(12px)' }}
                        />
                        <Bar dataKey="value" fill="#3b82f6" radius={[12, 12, 0, 0]} barSize={56} style={{ filter: 'drop-shadow(0 0 20px rgba(59,130,246,0.3))' }} />
                     </BarChart>
                  </ResponsiveContainer>
               </div>
             ) : <NoDataPlaceholder />}
          </Card>

          <div className="lg:col-span-2">
             <Card className="glass-card p-12 h-full border-white/5 overflow-hidden">
                <div className="flex items-center justify-between mb-16">
                   <div>
                      <h3 className="text-3xl font-black uppercase tracking-tight">Expenditure Velocity</h3>
                      <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mt-2">6-Month Temporal Progression</p>
                   </div>
                   <div className="w-16 h-16 rounded-[24px] bg-emerald-500/5 border border-emerald-500/10 flex items-center justify-center shadow-xl">
                      <TrendingUp className="w-8 h-8 text-emerald-400" />
                   </div>
                </div>
                
                {hasData ? (
                  <div className="h-[500px] w-full mt-4">
                     <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={barData}>
                           <defs>
                              <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                                 <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25}/>
                                 <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                              </linearGradient>
                           </defs>
                           <CartesianGrid strokeDasharray="4 4" stroke="rgba(255,255,255,0.02)" vertical={false} />
                           <XAxis dataKey="name" stroke="rgba(255,255,255,0.2)" fontSize={10} fontWeight={900} tickLine={false} axisLine={false} tickMargin={20} />
                           <YAxis 
                              stroke="rgba(255,255,255,0.2)" fontSize={10} fontWeight={900} tickLine={false} axisLine={false}
                              tickFormatter={(value) => `₹${value.toLocaleString()}`}
                           />
                           <RechartsTooltip 
                              contentStyle={{ backgroundColor: 'rgba(10,10,15,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', backdropFilter: 'blur(20px)' }}
                           />
                           <Area type="monotone" dataKey="amount" stroke="#3b82f6" fillOpacity={1} fill="url(#colorAmount)" strokeWidth={5} style={{ filter: 'drop-shadow(0 0 25px rgba(59,130,246,0.3))' }} />
                        </AreaChart>
                     </ResponsiveContainer>
                  </div>
                ) : <NoDataPlaceholder />}
             </Card>
          </div>

        </div>
      </main>
    </div>
  );
}

function NoDataPlaceholder() {
  return (
    <div className="h-[350px] flex flex-col items-center justify-center opacity-20 group">
       <BarChart3 className="w-16 h-16 mb-6 group-hover:scale-110 transition-transform" />
       <p className="text-[10px] font-black uppercase tracking-[0.5em]">System Idle: Awaiting Parameters</p>
    </div>
  );
}



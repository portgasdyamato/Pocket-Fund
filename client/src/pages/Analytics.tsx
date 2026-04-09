import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend, AreaChart, Area
} from "recharts";
import { Activity, TrendingUp, TrendingDown, Target, Wallet, PieChart as PieChartIcon, ArrowUpRight, ArrowDownRight } from "lucide-react";
import type { Transaction, StashTransaction } from "@shared/schema";
import { motion } from "framer-motion";

const COLORS = ['#64CEFB', '#3b82f6', '#f43f5e', '#10b981', '#f59e0b'];

export default function Analytics() {
  const { data: transactions = [], isLoading: isLoadingTransactions } = useQuery<Transaction[]>({
    queryKey: ["/api/transactions"],
  });

  const { data: stashTransactions = [], isLoading: isLoadingStash } = useQuery<StashTransaction[]>({
    queryKey: ["/api/stash"],
  });

  // Calculate Tag Breakdown (Needs vs Wants vs Icks)
  const tagBreakdown = transactions.reduce((acc: any, t) => {
    const tag = t.tag || 'Uncategorized';
    acc[tag] = (acc[tag] || 0) + parseFloat(t.amount);
    return acc;
  }, {});

  const TAG_COLORS: Record<string, string> = {
    'Need': '#2563eb',       // Blue-600
    'Want': '#64CEFB',       // Brand Blue (Primary)
    'Ick': '#dc2626',        // Red-600
    'Goal Claim': '#16a34a',  // Green-600
    'Uncategorized': '#3f3f46' // Zinc-600
  };

  const tagData = Object.keys(tagBreakdown).map(name => ({
    name,
    value: tagBreakdown[name],
    fill: TAG_COLORS[name] || TAG_COLORS['Uncategorized']
  }));

  // Calculate Category Breakdown
  const categoryBreakdown = transactions.reduce((acc: any, t) => {
    const cat = t.category || 'Other';
    acc[cat] = (acc[cat] || 0) + parseFloat(t.amount);
    return acc;
  }, {});

  const categoryData = Object.keys(categoryBreakdown).map(name => ({
    name,
    value: categoryBreakdown[name]
  }));

  // Calculate Monthly Spending (last 6 months - simulated for now by date)
  const monthlySpending = transactions.reduce((acc: any, t) => {
    const month = new Date(t.date).toLocaleString('default', { month: 'short' });
    acc[month] = (acc[month] || 0) + parseFloat(t.amount);
    return acc;
  }, {});

  const barData = Object.keys(monthlySpending).map(name => ({
    name,
    amount: monthlySpending[name]
  }));

  const totalSpent = transactions.reduce((sum, t) => sum + parseFloat(t.amount || "0"), 0);
  const totalSaved = stashTransactions.reduce((sum, t) => {
    const amount = parseFloat(t.amount || "0");
    return t.type === 'stash' ? sum + amount : sum - amount;
  }, 0);
  const savingsRate = (totalSpent + totalSaved) > 0 ? (Math.max(0, totalSaved) / (totalSpent + Math.max(0, totalSaved))) * 100 : 0;

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  if (isLoadingTransactions || isLoadingStash) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <main className="container mx-auto px-6 py-12 max-w-7xl space-y-12">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col gap-2"
        >
          <div className="flex items-center gap-2">
            <PieChartIcon className="w-5 h-5 text-primary" />
            <span className="text-xs font-black uppercase tracking-[0.3em] text-white/30">Spending Insights</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tighter">Financial Analytics</h1>
          <p className="text-white/40 font-medium text-sm sm:text-base">Visualizing your spending habits and savings progress.</p>
        </motion.div>

        {/* Top Stats Row */}
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <motion.div variants={item}>
            <Card className="ice-frost p-5 sm:p-6 h-full relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-4">Total Expenses</p>
              <div className="flex items-end justify-between">
                <h3 className="text-3xl sm:text-4xl font-black">₹{totalSpent.toLocaleString('en-IN')}</h3>
                <div className="flex items-center gap-1 text-red-400 text-[10px] sm:text-xs font-bold mb-1">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  <span>+4.2%</span>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div variants={item}>
            <Card className="ice-frost border-white/5 p-6 h-full relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-4">Total Savings</p>
              <div className="flex items-end justify-between">
                <h3 className="text-4xl font-black">₹{totalSaved.toLocaleString('en-IN')}</h3>
                <div className="flex items-center gap-1 text-green-400 text-xs font-bold mb-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>+12.8%</span>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div variants={item}>
            <Card className="ice-frost border-white/5 p-6 h-full relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-4">Savings Rate</p>
              <div className="flex items-end justify-between">
                <h3 className="text-4xl font-black">{savingsRate.toFixed(1)}%</h3>
                <div className="flex items-center gap-1 text-blue-400 text-xs font-bold mb-1">
                  <Activity className="w-3.5 h-3.5" />
                  <span>HEALTHY</span>
                </div>
              </div>
            </Card>
          </motion.div>
        </motion.div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Spending Intent Breakdown (Needs/Wants/Icks) */}
          <motion.div variants={item} initial="hidden" animate="show" transition={{ delay: 0.3 }}>
            <Card className="ice-frost border-white/5 p-8 h-full flex flex-col">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-xl font-bold">Spending Intent</h3>
                  <p className="text-xs text-white/30 uppercase tracking-widest mt-1">Needs vs Wants vs Icks</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <Target className="w-5 h-5 text-primary" />
                </div>
              </div>
                <div className="h-[250px] sm:h-[300px] w-full mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={tagData}
                        cx="50%"
                        cy="50%"
                        innerRadius={window.innerWidth < 640 ? 50 : 60}
                        outerRadius={window.innerWidth < 640 ? 70 : 80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {tagData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <RechartsTooltip 
                        contentStyle={{ backgroundColor: '#000', border: '1px solid #ffffff10', borderRadius: '12px' }}
                        itemStyle={{ color: '#fff' }}
                      />
                      <Legend verticalAlign={window.innerWidth < 640 ? "bottom" : "middle"} align={window.innerWidth < 640 ? "center" : "right"} layout={window.innerWidth < 640 ? "horizontal" : "vertical"} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
            </Card>
          </motion.div>

          {/* Category Distribution */}
          <motion.div variants={item} initial="hidden" animate="show" transition={{ delay: 0.4 }}>
            <Card className="ice-frost border-white/5 p-8 h-full flex flex-col">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-xl font-bold">Category Distribution</h3>
                  <p className="text-xs text-white/30 uppercase tracking-widest mt-1">Where your money flows</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-accent" />
                </div>
              </div>
              <div className="flex-1 min-h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryData}>
                    <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis hide />
                    <RechartsTooltip 
                      cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                      contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Bar dataKey="value" fill="#64CEFB" radius={[6, 6, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </motion.div>

          {/* Spending Over Time */}
          <motion.div variants={item} className="lg:col-span-2" initial="hidden" animate="show" transition={{ delay: 0.5 }}>
            <Card className="ice-frost border-white/5 p-8 h-full">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-xl font-bold">Monthly Spending Trend</h3>
                  <p className="text-xs text-white/30 uppercase tracking-widest mt-1">Expenditure over the last 6 months</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <Activity className="w-5 h-5 text-green-400" />
                </div>
              </div>
                <div className="h-[250px] sm:h-[300px] w-full mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={barData}>
                      <defs>
                        <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#64CEFB" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#64CEFB" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                      <XAxis 
                        dataKey="name" 
                        stroke="#ffffff40" 
                        fontSize={10} 
                        tickLine={false} 
                        axisLine={false} 
                      />
                      <YAxis 
                        stroke="#ffffff40" 
                        fontSize={10} 
                        tickLine={false} 
                        axisLine={false}
                        tickFormatter={(value) => `₹${value}`}
                        hide={window.innerWidth < 640}
                      />
                      <RechartsTooltip 
                        contentStyle={{ backgroundColor: '#000', border: '1px solid #ffffff10', borderRadius: '12px' }}
                        itemStyle={{ color: '#fff' }}
                      />
                      <Area type="monotone" dataKey="amount" stroke="#64CEFB" fillOpacity={1} fill="url(#colorAmount)" strokeWidth={3} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
            </Card>
          </motion.div>

        </div>
      </main>
    </div>
  );
}

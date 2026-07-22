import React from 'react';
import { ShieldAlert, CreditCard, Network, Users } from 'lucide-react';
import { motion } from 'motion/react';

interface StatsProps {
  totalIncidents: number;
}

export default function DashboardStats({ totalIncidents }: StatsProps) {
  const stats = [
    {
      id: "stat-1",
      label: "Digital Arrest Intercepts",
      value: "148 Active",
      subtext: "Last 24 hours nationwide",
      change: "+28% Escalation",
      changeType: "danger",
      icon: ShieldAlert,
      color: "text-rose-400 bg-rose-500/10 border-rose-500/10",
      glowColor: "hover:shadow-rose-950/5 hover:border-rose-500/30"
    },
    {
      id: "stat-2",
      label: "FICN Counterfeits Intercepted",
      value: "₹82.4 Lakhs",
      subtext: "Rs 500 High-Denomination",
      change: "4,120 bills flagged",
      changeType: "neutral",
      icon: CreditCard,
      color: "text-amber-400 bg-amber-500/10 border-amber-500/10",
      glowColor: "hover:shadow-amber-950/5 hover:border-amber-500/30"
    },
    {
      id: "stat-3",
      label: "Mule Ring Accounts Frozen",
      value: "1,204 Nodes",
      subtext: "Across 18 banks layered",
      change: "₹18.6 Cr Recovered",
      changeType: "success",
      icon: Network,
      color: "text-blue-400 bg-blue-500/10 border-blue-500/10",
      glowColor: "hover:shadow-blue-950/5 hover:border-blue-500/30"
    },
    {
      id: "stat-4",
      label: "Citizen Assessments Active",
      value: "12,482 Logs",
      subtext: "Multilingual guidance",
      change: "98.4% Scam prevention",
      changeType: "success",
      icon: Users,
      color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/10",
      glowColor: "hover:shadow-emerald-950/5 hover:border-emerald-500/30"
    }
  ];

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 25 }
    }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 px-6 py-4 bg-transparent relative"
    >
      {stats.map((stat) => {
        const IconComponent = stat.icon;
        return (
          <motion.div 
            key={stat.id}
            id={stat.id}
            variants={cardVariants}
            whileHover={{ y: -4, scale: 1.015 }}
            transition={{ type: "spring", stiffness: 400, damping: 22 }}
            className={`bg-[#0a0f1d]/90 border border-slate-800 rounded-2xl p-5 shadow-lg flex items-start justify-between gap-4 group relative overflow-hidden transition-colors duration-300 ${stat.glowColor}`}
          >
            {/* Soft grid background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:0.8rem_0.8rem] opacity-30 pointer-events-none" />

            <div className="space-y-2 relative z-10">
              <span className="text-slate-400 font-sans text-[10.5px] font-bold uppercase tracking-wider block">
                {stat.label}
              </span>
              <div className="text-2xl font-bold text-slate-100 group-hover:text-white transition-colors duration-200">
                {stat.value}
              </div>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className={`text-[9.5px] font-mono font-bold px-2 py-0.5 rounded border tracking-wide uppercase ${
                  stat.changeType === 'danger' 
                    ? 'bg-rose-500/10 border-rose-500/20 text-rose-400 animate-pulse' 
                    : stat.changeType === 'success'
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                    : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}>
                  {stat.change}
                </span>
                <span className="text-[10px] text-slate-500 font-sans">
                  {stat.subtext}
                </span>
              </div>
            </div>

            <div className={`p-2.5 rounded-xl border ${stat.color} shrink-0 shadow-md group-hover:scale-105 transition-transform duration-300 relative z-10`}>
              <IconComponent className="w-4 h-4" />
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}

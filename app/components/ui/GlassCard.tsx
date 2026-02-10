"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  gradient?: string;
}

export const GlassCard = ({ children, className, gradient }: GlassCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn(
        "relative backdrop-blur-xl bg-white/70 border border-white/50 shadow-xl rounded-2xl overflow-hidden", // Light Mode defaults
        "dark:bg-slate-900/60 dark:border-white/10 dark:shadow-2xl", // Dark Mode defaults
        className
      )}
    >
      {gradient && (
        <div 
          className={`absolute inset-0 opacity-20 pointer-events-none bg-gradient-to-br ${gradient}`} 
        />
      )}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
};

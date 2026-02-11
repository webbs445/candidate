"use client";

import { motion } from "framer-motion";
import { InputHTMLAttributes, ReactNode } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: ReactNode;
}

export const AnimatedInput = ({ label, icon, className, ...props }: InputProps) => {
  return (
    <motion.div
      className="relative group"
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1 }}
    >
      <label className="block text-sm font-semibold text-slate-600 mb-1 ml-1 group-focus-within:text-blue-500 transition-colors">
        {label}
      </label>
      <div className="relative flex items-center">
        {icon && (
          <div className="absolute left-3 text-slate-400 group-hover:text-blue-500 group-focus-within:text-blue-500 transition-colors">
            {icon}
          </div>
        )}
        <input
          {...props}
          value={props.value ?? ""}
          className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 outline-none transition-all duration-300 focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-100/50 ${icon ? 'pl-10' : ''} ${className || ''}`}
        />
      </div>
    </motion.div>
  );
};

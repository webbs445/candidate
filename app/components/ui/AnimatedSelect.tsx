"use client";

import { motion } from "framer-motion";
import { SelectHTMLAttributes, ReactNode } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label: string;
    icon?: ReactNode;
    options: { value: string; label: string }[];
}

export const AnimatedSelect = ({ label, icon, options, className, ...props }: SelectProps) => {
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
                    <div className="absolute left-3 text-slate-400 group-hover:text-blue-500 group-focus-within:text-blue-500 transition-colors pointer-events-none">
                        {icon}
                    </div>
                )}
                <select
                    {...props}
                    className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 outline-none transition-all duration-300 focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-100/50 appearance-none ${icon ? 'pl-10' : ''} ${className || ''}`}
                >
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
                <div className="absolute right-3 pointer-events-none text-slate-400 group-hover:text-blue-500 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                </div>
            </div>
        </motion.div>
    );
};

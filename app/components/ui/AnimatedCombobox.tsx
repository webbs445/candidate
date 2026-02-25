"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect, ReactNode } from "react";
import { Search, ChevronDown } from "lucide-react";

interface ComboboxProps {
    label: string;
    icon?: ReactNode;
    options: string[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    required?: boolean;
}

export const AnimatedCombobox = ({
    label,
    icon,
    options,
    value,
    onChange,
    placeholder,
    required
}: ComboboxProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [filteredOptions, setFilteredOptions] = useState(options);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        onChange(newValue);

        const filtered = options.filter(opt =>
            opt.toLowerCase().includes(newValue.toLowerCase())
        );
        setFilteredOptions(filtered);
        setIsOpen(true);
    };

    const handleOptionSelect = (opt: string) => {
        onChange(opt);
        setIsOpen(false);
    };

    return (
        <motion.div
            ref={containerRef}
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
                    <div className="absolute left-3 text-slate-400 group-hover:text-blue-500 group-focus-within:text-blue-500 transition-colors pointer-events-none z-10">
                        {icon}
                    </div>
                )}
                <input
                    type="text"
                    value={value}
                    onChange={handleInputChange}
                    onFocus={() => setIsOpen(true)}
                    placeholder={placeholder}
                    required={required}
                    className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 outline-none transition-all duration-300 focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-100/50 ${icon ? 'pl-10' : ''}`}
                />
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className="absolute right-3 text-slate-400 hover:text-blue-500 transition-colors"
                >
                    <ChevronDown size={18} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                </button>
            </div>

            <AnimatePresence>
                {isOpen && (filteredOptions.length > 0 || value) && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute z-50 w-full mt-2 bg-white border border-slate-100 rounded-xl shadow-2xl overflow-hidden backdrop-blur-xl"
                    >
                        <ul className="max-h-60 overflow-y-auto py-2">
                            {filteredOptions.length > 0 ? (
                                filteredOptions.map((opt, idx) => (
                                    <li
                                        key={idx}
                                        onClick={() => handleOptionSelect(opt)}
                                        className="px-4 py-3 hover:bg-blue-50 cursor-pointer transition-colors flex items-center gap-3 text-slate-700 hover:text-blue-700"
                                    >
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                                        <span className="font-medium">{opt}</span>
                                    </li>
                                ))
                            ) : (
                                <li className="px-4 py-3 text-slate-400 text-sm italic">
                                    No exact match found. Typing "{value}"...
                                </li>
                            )}
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

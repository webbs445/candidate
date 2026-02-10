"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

interface RatingInputProps {
  score: number;
  onChange: (value: number) => void;
  max?: number;
}

export const RatingInput = ({ score, onChange, max = 5 }: RatingInputProps) => {
  return (
    <div className="flex gap-1 justify-end">
      {Array.from({ length: max }).map((_, i) => {
        const value = i + 1;
        const isActive = value <= score;
        
        return (
          <motion.button
            key={value}
            type="button"
            onClick={() => onChange(value)}
            whileHover={{ scale: 1.2, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            className={`p-1 transition-colors focus:outline-none`}
            title={`Rate ${value} out of ${max}`}
          >
            <Star 
              className={`w-6 h-6 ${isActive ? 'fill-yellow-400 text-yellow-400 drop-shadow-md' : 'fill-slate-100 text-slate-300'}`} 
            />
          </motion.button>
        );
      })}
    </div>
  );
};

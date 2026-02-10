"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Send, Upload, User, Briefcase, Calendar, CheckCircle, MessageSquare, Clock, Phone } from 'lucide-react';
import { GlassCard } from './ui/GlassCard';
import { AnimatedInput } from './ui/AnimatedInput';
import { RatingInput } from './ui/RatingInput';

const METRICS = [
  { id: 'language', label: 'Language', weight: 0.10, hint: 'Clarity & Fluency' },
  { id: 'communication', label: 'Communication Skill', weight: 0.25, hint: 'Expression & Confidence' },
  { id: 'business', label: 'Business Setup Knowledge', weight: 0.20, hint: 'Regulations & Market' },
  { id: 'attitude', label: 'Attitude', weight: 0.10, hint: 'Positivity & Adaptability' },
  { id: 'professionalism', label: 'Professionalism', weight: 0.15, hint: 'Behavior & Respect' },
  { id: 'logic', label: 'Logical Thinking', weight: 0.20, hint: 'Reasoning & Strategy' },
];

export default function EvaluationPage() {
  const [scores, setScores] = useState<Record<string, number>>({});
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [comments, setComments] = useState(""); 

  const weightedScorePercentage = (METRICS.reduce((acc, m) => acc + (scores[m.id] || 0) * m.weight, 0) / 5) * 100;

  const getImpression = (score: number) => {
    if (Object.keys(scores).length < 6) return "Pending All Scores";
    if (score >= 85) return "Strong Fit";
    if (score >= 70) return "Good Fit";
    if (score >= 55) return "Average";
    return "Below Expectations";
  };

  const currentImpression = getImpression(weightedScorePercentage);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    let cvBase64 = "";
    if (file) {
      const reader = new FileReader();
      cvBase64 = await new Promise((resolve) => {
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
        reader.readAsDataURL(file);
      });
    }

    const payload = {
      candidateName: formData.get('candidateName'),
      candidateMobile: formData.get('candidateMobile'),
      position: formData.get('position'),
      interviewer: formData.get('interviewer'),
      interviewDate: formData.get('interviewDate'),
      // NEW FIELDS ADDED HERE
      currentSalary: formData.get('currentSalary'),
      expectedSalary: formData.get('expectedSalary'),
      noticePeriod: formData.get('noticePeriod'),
      cvFile: cvBase64,
      cvFileName: file?.name || "No CV",
      ...scores, 
      weightedScore: weightedScorePercentage.toFixed(2) + "%",
      performanceImpression: currentImpression,
      comments: comments 
    };

    try {
      await fetch(process.env.NEXT_PUBLIC_GOOGLE_SHEET_URL!, {
        method: 'POST',
        mode: 'no-cors', 
        body: JSON.stringify(payload),
      });

      setTimeout(() => {
        window.location.reload(); 
      }, 1500);

    } catch (error) {
      console.error("Submission error:", error);
      alert("❌ Error saving to Google Sheet.");
    } finally {
      // Keep loading true until reload
    }
  };

  return (
    <main className="min-h-screen text-slate-800 font-sans selection:bg-blue-200 selection:text-blue-900 bg-slate-50 relative">
      
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-400/20 blur-3xl animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-purple-400/20 blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto py-12 px-4 md:px-6">
        
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 text-center">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/50 text-blue-600 text-xs font-bold uppercase tracking-wider backdrop-blur-sm mb-4">
            <Sparkles size={14} /> HR Evaluation Tool
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-2">Candidate Evaluation</h1>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-6">
            <form onSubmit={handleSubmit}>
              
              <GlassCard className="p-8 mb-6" gradient="from-blue-50 to-white">
                <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600"><User size={18} /></div>
                  <h2 className="text-xl font-bold text-slate-800">Candidate Information</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <AnimatedInput label="Candidate Name" name="candidateName" required placeholder="John Doe" icon={<User size={18} />} />
                  <AnimatedInput label="Mobile Number" name="candidateMobile" placeholder="+971 50 ..." icon={<Phone size={18} />} />
                  <AnimatedInput label="Position Applied For" name="position" required placeholder="Senior Frontend Dev" icon={<Briefcase size={18} />} />
                  <AnimatedInput label="Interviewer Name" name="interviewer" required placeholder="Your Name" icon={<CheckCircle size={18} />} />
                  <AnimatedInput label="Date of Interview" name="interviewDate" type="date" required icon={<Calendar size={18} />} />
                  
                  {/* ADDED FIELDS START */}
                  <AnimatedInput label="Current Salary" name="currentSalary" placeholder="e.g. 50,000" icon={<span className="text-[10px] font-bold group-hover:text-blue-500 transition-colors">AED</span>} />
                  <AnimatedInput label="Expected Salary" name="expectedSalary" placeholder="e.g. 65,000" icon={<span className="text-[10px] font-bold group-hover:text-blue-500 transition-colors">AED</span>} />
                  <AnimatedInput label="Notice Period" name="noticePeriod" placeholder="e.g. 30 Days" icon={<Clock size={18} />} />
                  {/* ADDED FIELDS END */}

                  <div className="md:col-span-1 flex flex-col justify-end">
                    <label className="block text-sm font-semibold text-slate-600 mb-2">Upload CV (PDF)</label>
                    <div className="relative group cursor-pointer">
                      <input type="file" accept=".pdf" required onChange={(e) => setFile(e.target.files?.[0] || null)} className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer" />
                      <div className="flex items-center justify-center gap-3 w-full p-4 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 hover:bg-white hover:border-blue-400 transition-all group-hover:shadow-md">
                        <Upload className="text-slate-400 group-hover:text-blue-500 transition-colors" size={24} />
                        <span className="text-slate-500 font-medium group-hover:text-slate-700 truncate max-w-[150px]">{file ? file.name : "Upload CV"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </GlassCard>

              {/* Assessment Section */}
              <GlassCard className="p-8 relative overflow-hidden mb-6">
                <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600"><Sparkles size={18} /></div>
                  <h2 className="text-xl font-bold text-slate-800">Competency Assessment</h2>
                </div>
                <div className="space-y-4">
                  {METRICS.map((m, idx) => (
                    <motion.div key={m.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 * idx }} className="group p-4 rounded-xl bg-slate-50/50 hover:bg-white border border-transparent hover:border-slate-100 transition-all hover:shadow-lg">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-slate-700">{m.label}</h3>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200 text-slate-600">{Math.round(m.weight * 100)}%</span>
                          </div>
                          <p className="text-xs text-slate-400 mt-1">{m.hint}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <RatingInput score={scores[m.id] || 0} onChange={(val) => setScores(prev => ({ ...prev, [m.id]: val }))} />
                          <span className="w-6 text-center text-lg font-bold text-slate-700">{scores[m.id] || 0}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </GlassCard>

              {/* Comments Section */}
              <GlassCard className="p-8 mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600"><MessageSquare size={18} /></div>
                  <h2 className="text-xl font-bold text-slate-800">Additional Comments</h2>
                </div>
                <textarea 
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder="Summarize candidate strengths or concerns..."
                  className="w-full h-32 p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none bg-slate-50/50"
                />
              </GlassCard>

              <motion.button 
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                type="submit" disabled={loading}
                className={`w-full py-4 rounded-xl font-bold text-white shadow-xl flex items-center justify-center gap-2 transition-all 
                  ${loading ? 'bg-blue-500 cursor-not-allowed' : 'bg-gradient-to-r from-slate-900 to-slate-800 hover:from-blue-600 hover:to-blue-500'}`}
              >
                {loading ? "Success! Syncing..." : <>Submit Evaluation <Send size={18} /></>}
              </motion.button>
            </form>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6 z-20">
              <GlassCard className="p-6 text-center" gradient="from-blue-50 via-white to-purple-50">
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Weighted Score</h3>
                <div className="relative inline-block">
                  <span className="text-6xl font-black text-slate-800 tracking-tighter">{weightedScorePercentage.toFixed(1)}</span>
                  <span className="text-2xl font-medium text-slate-400">%</span>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-100">
                   <div className="flex justify-between items-center text-sm mb-1">
                      <span className="text-slate-500">Progress</span>
                      <span className="font-bold text-slate-700">{Object.keys(scores).length} / {METRICS.length}</span>
                   </div>
                   <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full bg-blue-500 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${(Object.keys(scores).length / METRICS.length) * 100}%` }}
                        transition={{ duration: 0.5 }}
                      />
                   </div>
                </div>
              </GlassCard>

              <GlassCard className="p-6">
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Overall Impression</h3>
                 <AnimatePresence mode="wait">
                  <motion.div
                    key={currentImpression}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`p-4 rounded-xl text-center border-2 font-bold text-lg
                      ${currentImpression === 'Strong Fit' ? 'bg-green-50 border-green-200 text-green-700' : 
                        currentImpression === 'Good Fit' ? 'bg-blue-50 border-blue-200 text-blue-700' :
                        currentImpression === 'Average' ? 'bg-orange-50 border-orange-200 text-orange-700' :
                        currentImpression === 'Below Expectations' ? 'bg-red-50 border-red-200 text-red-700' :
                        'bg-slate-50 border-slate-200 text-slate-500'
                      }`}
                  >
                    {currentImpression}
                  </motion.div>
                </AnimatePresence>
                <div className="mt-4 text-xs text-slate-400 text-center">
                  Score &gt; 85% = Strong Fit <br/>
                  Score &gt; 70% = Good Fit <br/>
                  Score &gt; 50% = Average Fit<br/>
                  Score &lt; 50% = Low Fit
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}


// "use client";

// import React, { useState } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { Sparkles, Send, Upload, User, Briefcase, Calendar, CheckCircle, MessageSquare } from 'lucide-react';
// import { GlassCard } from './ui/GlassCard';
// import { AnimatedInput } from './ui/AnimatedInput';
// import { RatingInput } from './ui/RatingInput';

// const METRICS = [
//   { id: 'language', label: 'Language', weight: 0.10, hint: 'Clarity & Fluency' },
//   { id: 'communication', label: 'Communication Skill', weight: 0.25, hint: 'Expression & Confidence' },
//   { id: 'business', label: 'Business Setup Knowledge', weight: 0.20, hint: 'Regulations & Market' },
//   { id: 'attitude', label: 'Attitude', weight: 0.10, hint: 'Positivity & Adaptability' },
//   { id: 'professionalism', label: 'Professionalism', weight: 0.15, hint: 'Behavior & Respect' },
//   { id: 'logic', label: 'Logical Thinking', weight: 0.20, hint: 'Reasoning & Strategy' },
// ];

// export default function EvaluationPage() {
//   const [scores, setScores] = useState<Record<string, number>>({});
//   const [file, setFile] = useState<File | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [comments, setComments] = useState(""); 

//   const weightedScorePercentage = (METRICS.reduce((acc, m) => acc + (scores[m.id] || 0) * m.weight, 0) / 5) * 100;

//   const getImpression = (score: number) => {
//     if (Object.keys(scores).length < 6) return "Pending All Scores";
//     if (score >= 85) return "Strong Fit";
//     if (score >= 70) return "Good Fit";
//     if (score >= 55) return "Average";
//     return "Below Expectations";
//   };

//   const currentImpression = getImpression(weightedScorePercentage);

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setLoading(true);
//     const form = e.currentTarget;
//     const formData = new FormData(form);
    
//     let cvBase64 = "";
//     if (file) {
//       const reader = new FileReader();
//       cvBase64 = await new Promise((resolve) => {
//         reader.onload = () => resolve((reader.result as string).split(',')[1]);
//         reader.readAsDataURL(file);
//       });
//     }

//     const payload = {
//       candidateName: formData.get('candidateName'),
//       position: formData.get('position'),
//       interviewer: formData.get('interviewer'),
//       interviewDate: formData.get('interviewDate'),
//       cvFile: cvBase64,
//       cvFileName: file?.name || "No CV",
//       ...scores, 
//       weightedScore: weightedScorePercentage.toFixed(2) + "%",
//       performanceImpression: currentImpression,
//       comments: comments 
//     };

//     try {
//       await fetch('https://script.google.com/macros/s/AKfycbzBNiVmAOgnq1Z6kJTfb8TP0yLT_ZVKSt3KsVsE9jlcuzeXN_5jYwz-bSIEQwZUNHpH/exec', {
//         method: 'POST',
//         mode: 'no-cors', 
//         body: JSON.stringify(payload),
//       });

//       // ALERT REMOVED: We wait 1.5 seconds so the user sees the "Processing" state finish, then reload.
//       setTimeout(() => {
//         window.location.reload(); 
//       }, 1500);

//     } catch (error) {
//       console.error("Submission error:", error);
//       // Optional: replace this alert with a simple console error if you want NO popups at all
//       alert("❌ Error saving to Google Sheet.");
//     } finally {
//       // We don't set loading to false immediately on success 
//       // so the button stays in "Processing" until the page reloads
//     }
//   };

//   return (
//     <main className="min-h-screen text-slate-800 font-sans selection:bg-blue-200 selection:text-blue-900 overflow-x-hidden bg-slate-50 relative">
      
//       <div className="fixed inset-0 z-0 pointer-events-none">
//         <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-400/20 blur-3xl animate-pulse" />
//         <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-purple-400/20 blur-3xl animate-pulse delay-1000" />
//       </div>

//       <div className="relative z-10 max-w-5xl mx-auto py-12 px-4 md:px-6">
        
//         <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 text-center">
//           <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/50 text-blue-600 text-xs font-bold uppercase tracking-wider backdrop-blur-sm mb-4">
//             <Sparkles size={14} /> HR Evaluation Tool
//           </span>
//           <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-2">Candidate Evaluation</h1>
//         </motion.div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
//           <div className="lg:col-span-2 space-y-6">
//             <form onSubmit={handleSubmit}>
              
//               <GlassCard className="p-8 mb-6" gradient="from-blue-50 to-white">
//                 <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
//                   <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600"><User size={18} /></div>
//                   <h2 className="text-xl font-bold text-slate-800">Candidate Information</h2>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <AnimatedInput label="Candidate Name" name="candidateName" required placeholder="John Doe" icon={<User size={18} />} />
//                   <AnimatedInput label="Position Applied For" name="position" required placeholder="Senior Frontend Dev" icon={<Briefcase size={18} />} />
//                   <AnimatedInput label="Interviewer Name" name="interviewer" required placeholder="Your Name" icon={<CheckCircle size={18} />} />
//                   <AnimatedInput label="Date of Interview" name="interviewDate" type="date" required icon={<Calendar size={18} />} />
                  
//                   <div className="md:col-span-2">
//                     <label className="block text-sm font-semibold text-slate-600 mb-2">Upload CV (PDF)</label>
//                     <div className="relative group cursor-pointer">
//                       <input type="file" accept=".pdf" required onChange={(e) => setFile(e.target.files?.[0] || null)} className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer" />
//                       <div className="flex items-center justify-center gap-3 w-full p-4 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 hover:bg-white hover:border-blue-400 transition-all group-hover:shadow-md">
//                         <Upload className="text-slate-400 group-hover:text-blue-500 transition-colors" size={24} />
//                         <span className="text-slate-500 font-medium group-hover:text-slate-700">{file ? file.name : "Click to upload CV file"}</span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </GlassCard>

//               <GlassCard className="p-8 relative overflow-hidden mb-6">
//                 <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
//                   <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600"><Sparkles size={18} /></div>
//                   <h2 className="text-xl font-bold text-slate-800">Competency Assessment</h2>
//                 </div>
//                 <div className="space-y-4">
//                   {METRICS.map((m, idx) => (
//                     <motion.div key={m.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 * idx }} className="group p-4 rounded-xl bg-slate-50/50 hover:bg-white border border-transparent hover:border-slate-100 transition-all hover:shadow-lg">
//                       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//                         <div>
//                           <div className="flex items-center gap-2">
//                             <h3 className="font-bold text-slate-700">{m.label}</h3>
//                             <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200 text-slate-600">{Math.round(m.weight * 100)}%</span>
//                           </div>
//                           <p className="text-xs text-slate-400 mt-1">{m.hint}</p>
//                         </div>
//                         <div className="flex items-center gap-4">
//                           <RatingInput score={scores[m.id] || 0} onChange={(val) => setScores(prev => ({ ...prev, [m.id]: val }))} />
//                           <span className="w-6 text-center text-lg font-bold text-slate-700">{scores[m.id] || 0}</span>
//                         </div>
//                       </div>
//                     </motion.div>
//                   ))}
//                 </div>
//               </GlassCard>

//               <GlassCard className="p-8 mb-6">
//                 <div className="flex items-center gap-2 mb-4">
//                   <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600"><MessageSquare size={18} /></div>
//                   <h2 className="text-xl font-bold text-slate-800">Additional Comments</h2>
//                 </div>
//                 <textarea 
//                   value={comments}
//                   onChange={(e) => setComments(e.target.value)}
//                   placeholder="Summarize candidate strengths or concerns..."
//                   className="w-full h-32 p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none bg-slate-50/50"
//                 />
//               </GlassCard>

//               <motion.button 
//                 whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
//                 type="submit" disabled={loading}
//                 className={`w-full py-4 rounded-xl font-bold text-white shadow-xl flex items-center justify-center gap-2 transition-all 
//                   ${loading ? 'bg-blue-500 cursor-not-allowed' : 'bg-gradient-to-r from-slate-900 to-slate-800 hover:from-blue-600 hover:to-blue-500'}`}
//               >
//                 {loading ? "Success! Syncing..." : <>Submit Evaluation <Send size={18} /></>}
//               </motion.button>
//             </form>
//           </div>

//           <div className="lg:col-span-1">
//             <div className="sticky top-8 space-y-6">
              
//               <GlassCard className="p-6 text-center" gradient="from-blue-50 via-white to-purple-50">
//                 <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Weighted Score</h3>
//                 <div className="relative inline-block">
//                   <span className="text-6xl font-black text-slate-800 tracking-tighter">
//                     {weightedScorePercentage.toFixed(1)}
//                   </span>
//                   <span className="text-2xl font-medium text-slate-400">%</span>
//                 </div>
                
//                 <div className="mt-4 pt-4 border-t border-slate-100">
//                    <div className="flex justify-between items-center text-sm mb-1">
//                       <span className="text-slate-500">Progress</span>
//                       <span className="font-bold text-slate-700">{Object.keys(scores).length} / {METRICS.length}</span>
//                    </div>
//                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
//                       <motion.div 
//                         className="h-full bg-blue-500 rounded-full"
//                         initial={{ width: 0 }}
//                         animate={{ width: `${(Object.keys(scores).length / METRICS.length) * 100}%` }}
//                         transition={{ duration: 0.5 }}
//                       />
//                    </div>
//                 </div>
//               </GlassCard>

              // <GlassCard className="p-6">
              //   <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Overall Impression</h3>
              //    <AnimatePresence mode="wait">
              //     <motion.div
              //       key={currentImpression}
              //       initial={{ opacity: 0, y: 10 }}
              //       animate={{ opacity: 1, y: 0 }}
              //       exit={{ opacity: 0, y: -10 }}
              //       className={`p-4 rounded-xl text-center border-2 font-bold text-lg
              //         ${currentImpression === 'Strong Fit' ? 'bg-green-50 border-green-200 text-green-700' : 
              //           currentImpression === 'Good Fit' ? 'bg-blue-50 border-blue-200 text-blue-700' :
              //           currentImpression === 'Average' ? 'bg-orange-50 border-orange-200 text-orange-700' :
              //           currentImpression === 'Below Expectations' ? 'bg-red-50 border-red-200 text-red-700' :
              //           'bg-slate-50 border-slate-200 text-slate-500'
              //         }`}
              //     >
              //       {currentImpression}
              //     </motion.div>
              //   </AnimatePresence>
              //   <div className="mt-4 text-xs text-slate-400 text-center">
              //     Score &gt; 85% = Strong Fit <br/>
              //     Score &gt; 70% = Good Fit
              //   </div>
              // </GlassCard>
//             </div>
//           </div>

//         </div>
//       </div>
//     </main>
//   );
// }


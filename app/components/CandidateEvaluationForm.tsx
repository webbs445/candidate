"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Send, Upload, User, Briefcase, Calendar, CheckCircle, MessageSquare, Clock, Phone } from 'lucide-react';
import { GlassCard } from './ui/GlassCard';
import { AnimatedInput } from './ui/AnimatedInput';
import { AnimatedSelect } from './ui/AnimatedSelect';
import { RatingInput } from './ui/RatingInput';

const METRICS = [
  { id: 'language', label: 'Language', weight: 0.10, hint: 'Clarity & Fluency' },
  { id: 'communication', label: 'Communication Skill', weight: 0.25, hint: 'Expression & Confidence' },
  { id: 'business', label: 'Business Setup Knowledge', weight: 0.20, hint: 'Regulations & Market' },
  { id: 'attitude', label: 'Attitude', weight: 0.10, hint: 'Positivity & Adaptability' },
  { id: 'professionalism', label: 'Professionalism', weight: 0.15, hint: 'Behavior & Respect' },
  { id: 'logic', label: 'Logical Thinking', weight: 0.20, hint: 'Reasoning & Strategy' },
];

export default function CandidateEvaluationForm() {
  const [scores, setScores] = useState<Record<string, number>>({});
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [comments, setComments] = useState("");
  const [customNoticePeriod, setCustomNoticePeriod] = useState("");

  const [submitted, setSubmitted] = useState(false);

  const [candidateInfo, setCandidateInfo] = useState({
    name: "",
    mobile: "",
    position: "Business Consultant",
    interviewer: "Vipin Kumar",
    date: "",
    time: "",
    currentSalary: "",
    expectedSalary: "",
    noticePeriod: "30 days"
  });

  const weightedScorePercentage = (METRICS.reduce((acc, m) => acc + (scores[m.id] || 0) * m.weight, 0) / 5) * 100;

  const getImpression = (score: number) => {
    if (Object.keys(scores).length < 6) return "Pending All Scores";
    if (score >= 85) return "Strong Fit";
    if (score >= 70) return "Good Fit";
    if (score >= 55) return "Average Fit";
    return "Low Fit";
  };

  const currentImpression = getImpression(weightedScorePercentage);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget;


    const totalMetrics = METRICS.length;
    const scoredMetrics = Object.keys(scores).length;

    if (scoredMetrics < totalMetrics) {
      alert(`Please complete all ${totalMetrics} competency assessments before submitting.`);
      setLoading(false);
      return;
    }

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
      candidateName: candidateInfo.name,
      candidateMobile: candidateInfo.mobile,
      position: candidateInfo.position,
      interviewer: candidateInfo.interviewer,
      interviewDate: candidateInfo.date,
      interviewTime: candidateInfo.time,
      currentSalary: candidateInfo.currentSalary,
      expectedSalary: candidateInfo.expectedSalary,
      noticePeriod: candidateInfo.noticePeriod === 'Other' ? customNoticePeriod : candidateInfo.noticePeriod,
      cvFile: cvBase64,
      cvFileName: file?.name || "No CV",
      ...scores,
      weightedScore: weightedScorePercentage.toFixed(2) + "%",
      performanceImpression: currentImpression,
      comments: comments
    };

    console.log("Submitting Payload:", payload);

    try {
      await fetch(process.env.NEXT_PUBLIC_GOOGLE_SHEET_URL!, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify(payload),
      });

      // Show success state instead of reloading
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });

    } catch (error) {
      console.error("Submission error:", error);
      alert("❌ Error saving to Google Sheet.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setScores({});
    setFile(null);
    setComments("");
    setCustomNoticePeriod("");
    setCandidateInfo({
      name: "",
      mobile: "",
      position: "Business Consultant",
      interviewer: "Vipin Kumar",
      date: "",
      time: "",
      currentSalary: "",
      expectedSalary: "",
      noticePeriod: "30 days"
    });
    setSubmitted(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleWhatsAppInvite = () => {
    const { name, mobile, position, date, time } = candidateInfo;
    if (!mobile || !name) {
      alert("Please fill in candidate name and mobile number first.");
      return;
    }

    const formattedMobile = mobile.startsWith('+') ? mobile.replace(/\s+/g, '') : `+${mobile.replace(/\s+/g, '')}`;
    const message = `Hi ${name}

Thank you for attending the first round of interviews with us. We’re pleased to invite you for a second round of face to face interview for the ${position} role.

📅 Date: ${date}
⏰ Time: ${time}
📍 Link: https://share.google/CAX5a6oB5OS5skyAU

Kindly confirm your availability for the above schedule.`;

    const whatsappUrl = `https://wa.me/${formattedMobile.replace('+', '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  if (submitted) {
    return (
      <main className="min-h-screen text-slate-800 font-sans bg-slate-50 relative flex items-center justify-center p-4">
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-green-400/20 blur-3xl animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-blue-400/20 blur-3xl animate-pulse delay-1000" />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 w-full max-w-2xl"
        >
          <GlassCard className="p-12 text-center" gradient="from-green-50 to-blue-50">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center text-green-600 mx-auto mb-6 shadow-lg shadow-green-200"
            >
              <CheckCircle size={48} strokeWidth={3} />
            </motion.div>

            <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Evaluation Submitted!</h2>
            <p className="text-slate-500 mb-8">The candidate's data has been successfully saved to the system.</p>

            <div className="bg-white/60 rounded-2xl p-6 mb-8 border border-white/60 shadow-inner">
              <div className="flex flex-col md:flex-row justify-center items-center gap-8">
                <div className="text-center">
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Candidate</p>
                  <p className="text-xl font-bold text-slate-800">{candidateInfo.name}</p>
                  <p className="text-sm text-slate-500">{candidateInfo.position}</p>
                </div>

                <div className="h-12 w-px bg-slate-200 hidden md:block" />

                <div className="text-center">
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Score</p>
                  <div className="flex items-center gap-2 justify-center">
                    <span className="text-3xl font-black text-slate-800">{weightedScorePercentage.toFixed(1)}%</span>
                  </div>
                  <p className={`text-sm font-bold ${currentImpression === 'Strong Fit' ? 'text-green-600' :
                    currentImpression === 'Good Fit' ? 'text-blue-600' :
                      currentImpression === 'Average Fit' ? 'text-orange-600' : 'text-red-600'
                    }`}>{currentImpression}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 max-w-xs mx-auto">
              <button
                onClick={handleWhatsAppInvite}
                className="w-full py-3 rounded-xl font-bold text-white shadow-lg flex items-center justify-center gap-2 transition-all bg-[#25D366] hover:bg-[#20ba59]"
              >
                Send WhatsApp Invite <MessageSquare size={18} />
              </button>

              <button
                onClick={handleReset}
                className="w-full py-3 rounded-xl font-bold text-slate-700 bg-white border border-slate-200 shadow-sm hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center gap-2"
              >
                Evaluate Another Candidate <User size={18} />
              </button>
            </div>
          </GlassCard>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen text-slate-800 font-sans selection:bg-blue-200 selection:text-blue-900 bg-slate-50 relative">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-slate-400/20 blur-3xl animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-slate-400/20 blur-3xl animate-pulse delay-1000" />
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
                  <AnimatedInput label="Candidate Name" name="candidateName" required placeholder="John Doe" icon={<User size={18} />} value={candidateInfo.name} onChange={(e) => setCandidateInfo({ ...candidateInfo, name: e.target.value })} />
                  <AnimatedInput label="Mobile Number" name="candidateMobile" required placeholder="+971 50 ..." icon={<Phone size={18} />} value={candidateInfo.mobile} onChange={(e) => setCandidateInfo({ ...candidateInfo, mobile: e.target.value })} />

                  <AnimatedSelect
                    label="Position Applied For"
                    name="position"
                    required
                    icon={<Briefcase size={18} />}
                    value={candidateInfo.position}
                    onChange={(e) => setCandidateInfo({ ...candidateInfo, position: e.target.value })}
                    options={[
                      { value: 'Business Consultant', label: 'Business Consultant' },
                      { value: 'Sales Executive', label: 'Sales Executive' },
                      { value: 'Administrative Assistant', label: 'Administrative Assistant' }
                    ]}
                  />

                  <AnimatedSelect
                    label="Interviewer Name"
                    name="interviewer"
                    required
                    icon={<CheckCircle size={18} />}
                    value={candidateInfo.interviewer}
                    onChange={(e) => setCandidateInfo({ ...candidateInfo, interviewer: e.target.value })}
                    options={[
                      { value: 'Vipin Kumar', label: 'Vipin Kumar' },
                      { value: 'Bibin Basil', label: 'Bibin Basil' },
                      { value: 'Ann Maria', label: 'Ann Maria' },
                      { value: 'Essa', label: 'Essa' },
                      { value: 'Ahmed', label: 'Ahmed' }
                    ]}
                  />

                  <AnimatedInput label="Date of Interview" name="interviewDate" type="date" required icon={<Calendar size={18} />} value={candidateInfo.date} onChange={(e) => setCandidateInfo({ ...candidateInfo, date: e.target.value })} />
                  <AnimatedInput label="Time of Interview" name="interviewTime" type="time" required icon={<Clock size={18} />} value={candidateInfo.time} onChange={(e) => setCandidateInfo({ ...candidateInfo, time: e.target.value })} />

                  <AnimatedInput label="Current Salary" name="currentSalary" required placeholder="e.g. 50,000" icon={<span className="text-[10px] font-bold group-hover:text-blue-500 transition-colors">AED</span>} value={candidateInfo.currentSalary} onChange={(e) => setCandidateInfo({ ...candidateInfo, currentSalary: e.target.value })} />
                  <AnimatedInput label="Expected Salary" name="expectedSalary" required placeholder="e.g. 65,000" icon={<span className="text-[10px] font-bold group-hover:text-blue-500 transition-colors">AED</span>} value={candidateInfo.expectedSalary} onChange={(e) => setCandidateInfo({ ...candidateInfo, expectedSalary: e.target.value })} />

                  <div className="space-y-4">
                    <AnimatedSelect
                      label="Notice Period"
                      name="noticePeriod"
                      required
                      icon={<Clock size={18} />}
                      value={candidateInfo.noticePeriod}
                      onChange={(e) => setCandidateInfo({ ...candidateInfo, noticePeriod: e.target.value })}
                      options={[
                        { value: '15 days', label: '15 days' },
                        { value: '30 days', label: '30 days' },
                        { value: 'Other', label: 'Other (Specify below)' },
                        { value: 'Immediate', label: 'Immediate' }
                      ]}
                    />
                    <AnimatePresence>
                      {candidateInfo.noticePeriod === 'Other' && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                          <AnimatedInput
                            label="Specify Notice Period"
                            placeholder="e.g. 45 days"
                            required
                            value={customNoticePeriod}
                            onChange={(e) => setCustomNoticePeriod(e.target.value)}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

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
                  required
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
                          currentImpression === 'Average Fit' ? 'bg-orange-50 border-orange-200 text-orange-700' :
                            currentImpression === 'Low Fit' ? 'bg-red-50 border-red-200 text-red-700' :
                              'bg-slate-50 border-slate-200 text-slate-500'
                      }`}
                  >
                    {currentImpression}
                  </motion.div>
                </AnimatePresence>
                <div className="mt-4 text-xs text-slate-400 text-center">
                  Score &gt; 85% = Strong Fit <br />
                  Score &gt; 70% = Good Fit <br />
                  Score &gt; 50% = Average Fit<br />
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

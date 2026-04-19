import React, { useState, useEffect, FormEvent, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate
} from 'react-router-dom';
import Confetti from 'react-confetti';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
import { 
  Check, 
  PlayCircle, 
  Layers, 
  Briefcase, 
  Rocket, 
  Zap, 
  Film, 
  Palette, 
  Sparkles, 
  BookOpen, 
  MonitorPlay, 
  Folder, 
  Component, 
  ExternalLink,
  Plus,
  Minus,
  PenTool,
  MousePointer2,
  Brush,
  Star,
  Users,
  ChevronLeft,
  Smartphone,
  CreditCard,
  Building2,
  Wallet,
  Compass,
  Type,
  Pipette,
  FileCode,
  MonitorSmartphone,
  Video,
  Crosshair,
  Ruler,
  Activity,
  Image as ImageIcon,
  Dribbble,
  Camera,
  Box,
  ShoppingCart,
  Trophy,
  Coffee,
  Award,
  Target,
  X,
  BadgeCheck
} from "lucide-react";

// --- Data ---
const overviewData = [
  {
    icon: <Users className="w-6 h-6 text-violet-400" />,
    title: "Students & Professionals",
    desc: "স্কুল-কলেজ ও ইউনিভার্সিটিতে পড়ুয়া ছাত্রছাত্রী এবং যারা ক্যারিয়ার গড়তে আগ্রহী।"
  },
  {
    icon: <Briefcase className="w-6 h-6 text-violet-400" />,
    title: "Freelancers",
    desc: "চাকরি বা ব্যবসার পাশাপাশি যারা Graphic Design শিখে Extra ইনকাম করতে চান।"
  },
  {
    icon: <Rocket className="w-6 h-6 text-violet-400" />,
    title: "Career Seekers",
    desc: "যারা গ্রাফিক ডিজাইন শিখতে ইচ্ছুক এবং এই ইন্ডাস্ট্রিতে প্রফেশনাল ক্যারিয়ার গড়তে চান।"
  }
];

const outcomesData = [
  {
    icon: <Zap className="w-6 h-6 text-orange-400" />,
    title: "Modern AI Integration",
    desc: "Midjourney, Adobe Firefly, DALL·E এবং অন্যান্য AI টুলসের প্রফেশনাল ব্যবহার।"
  },
  {
    icon: <Palette className="w-6 h-6 text-blue-400" />,
    title: "Advanced PS & AI",
    desc: "Adobe Illustrator এবং Photoshop এর মাধ্যমে অ্যাডভান্সড ডিজাইন টেকনিক।"
  },
  {
    icon: <Sparkles className="w-6 h-6 text-pink-400" />,
    title: "Branding & Logo Design",
    desc: "AI-powered লোগো এবং ব্র্যান্ডিং ডিজাইন প্রসেস এবং রিয়েল-ওয়ার্ল্ড প্রোজেক্ট।"
  },
  {
    icon: <Rocket className="w-6 h-6 text-yellow-400" />,
    title: "Marketplace Strategy",
    desc: "Fiverr, Upwork, Behance এবং Dribbble-এ কাজ করার কার্যকরী কৌশল।"
  },
  {
    icon: <MonitorPlay className="w-6 h-6 text-green-400" />,
    title: "Modern Portfolio",
    desc: "ফ্রীল্যান্সিং এবং চাকরির জন্য একটি স্ট্রং এবং মডার্ন পোর্টফোলিও তৈরি করা।"
  },
  {
    icon: <Zap className="w-6 h-6 text-emerald-400" />,
    title: "Efficient AI Workflow",
    desc: "AI টুলস ব্যবহার করে প্রোডাক্টিভিটি বাড়ানো এবং স্মার্ট ডিজাইন স্কিল অর্জন।"
  }
];

const curriculumData = [
  {
    category: "Adobe Photoshop",
    items: [
      "প্রয়োজনীয় সকল টুল ও এর প্রয়োগ",
      "টাইপোগ্রাফি, ইমেজ এডিটিং ও ম্যানিপুলেশন",
      "ফটোশপ সংক্রান্ত বিভিন্ন প্রফেশনাল প্রোজেক্ট",
      "ডিজাইন জগতের সেরা সফটওয়্যার গুলোর গাইডলাইন"
    ]
  },
  {
    category: "Adobe Illustrator",
    items: [
      "প্রয়োজনীয় সকল টুল ও এর প্রয়োগ",
      "লোগো, ব্র্যান্ড ও স্টেশনারি ডিজাইন",
      "প্রিন্ট ডিজাইন ও ডিজিটাল কন্টেন্ট ডিজাইন",
      "বিভিন্ন প্র্যাক্টিক্যাল প্রোজেক্ট ও পোর্টফোলিও তৈরি"
    ]
  },
  {
    category: "Artificial Intelligence (AI)",
    items: [
      "AI ব্যবহার করে কিভাবে আইডিয়া বের করতে হয়",
      "আইডিয়াকে ডিজাইন রূপে রূপান্তর করার বিস্তারিত লেসন",
      "Midjourney, Firefly এবং DALL·E ইন্টিগ্রেশন"
    ]
  },
  {
    category: "Freelancing & Marketplace",
    items: [
      "মার্কেটপ্লেসে যথাযথভাবে অ্যাকাউন্ট খোলা ও গিগ তৈরি",
      "ক্লায়েন্ট কমিউনিকেশন ও বিডিং কৌশল",
      "মার্কেটপ্লেস থেকে ডলার ট্রান্সফার ও টাকা উত্তোলন"
    ]
  },
  {
    category: "Local Job Market & Career",
    items: [
      "বাংলাদেশি লোকাল কোম্পানিতে চাকরি সন্ধান",
      "প্রফেশনাল সিভি তৈরির প্রক্রিয়া ও গাইডলাইন",
      "ইন্টারভিউ সংক্রান্ত বিভিন্ন টেকনিক ও ৩টি স্পেশাল অ্যাসাইনমেন্ট"
    ]
  }
];

const bonusData = [
  {
    icon: <Folder className="w-6 h-6 text-yellow-400" />,
    title: "Practice Files",
    desc: "প্র্যাকটিসের জন্য project file, assets, demo materials যা editable sample files"
  },
  {
    icon: <Component className="w-6 h-6 text-emerald-400" />,
    title: "Preset / Template Ideas",
    desc: "Text Presets, Logo Animation Templates, Motion Graphics Templates এবং Liquid Glass Effect Templates"
  },
  {
    icon: <ExternalLink className="w-6 h-6 text-blue-400" />,
    title: "Freelance Direction",
    desc: "কীভাবে নিজের স্কিল সেলস করে ক্লায়েন্টের কাজ করার জন্য উপযুক্ত হবেন, পোর্টফোলিও বিল্ড করবেন ও প্রজেক্টের কাজ রেডি করবেন।"
  }
];

const faqs = [
  "এই course কি beginner-দের জন্য suitable?",
  "এই course শেষ করে কি client work-এর জন্য প্রস্তুত হওয়া যাবে?",
  "Mobile দিয়ে কি করা যাবে?",
  "Payment করার পরে কীভাবে join করব?"
];

// --- Components ---

function Accordion({ title, idx }: { title: string, idx: number, key?: number | string }) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.01 }}
      transition={{ delay: (idx % 10) * 0.05, duration: 0.3 }}
      className="bg-[#161a2b] border border-[#262c43] rounded-xl overflow-hidden mb-3 transition-colors hover:bg-[#1a1f33]"
    >
      <button 
        className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-semibold text-gray-200">{title}</span>
        {isOpen ? <Minus className="w-5 h-5 text-violet-400" /> : <Plus className="w-5 h-5 text-gray-400" />}
      </button>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="px-6 pb-5 text-gray-400 text-sm"
        >
          Details and answers will be published soon. Stay tuned!
        </motion.div>
      )}
    </motion.div>
  );
}

function SectionBadge({ text }: { text: string }) {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/10 mb-6">
      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]"></span>
      <span className="text-xs font-semibold text-gray-300">{text}</span>
    </div>
  );
}

function StarRating() {
  return (
    <div className="flex items-center gap-0.5 ml-auto bg-[#1a1f33] px-3 py-1.5 rounded-full border border-[#262c43]">
      {[1, 2, 3, 4].map((i) => (
        <Star key={i} className="w-3.5 h-3.5 fill-yellow-500 text-yellow-500" />
      ))}
      <div className="relative w-3.5 h-3.5">
        <Star className="w-3.5 h-3.5 text-gray-600 fill-gray-600" />
        <div className="absolute inset-0 overflow-hidden w-[90%]">
          <Star className="w-3.5 h-3.5 fill-yellow-500 text-yellow-500" />
        </div>
      </div>
      <span className="text-xs font-bold text-gray-200 ml-1">4.9/5</span>
    </div>
  );
}

function PaymentCard({ method, details }: any) {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0, rotateY: 90 }}
      animate={{ scale: 1, opacity: 1, rotateY: 0 }}
      exit={{ scale: 0.8, opacity: 0, rotateY: -90 }}
      transition={{ type: "spring", damping: 15, stiffness: 100 }}
      className="relative w-full h-52 rounded-2xl p-6 overflow-hidden flex flex-col justify-between shadow-2xl"
      style={{ background: `linear-gradient(135deg, ${method.color}, ${method.color}dd)` }}
    >
      <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
        {method.id === 'bkash' ? <Smartphone size={160} /> : <Wallet size={160} />}
      </div>
      
      <div className="flex justify-between items-start relative z-10">
        <div className="bg-white/20 p-2.5 rounded-xl backdrop-blur-md">
           {method.icon}
        </div>
        <div className="text-white font-black text-2xl tracking-tighter italic">{method.name}</div>
      </div>

      <div className="relative z-10">
        <div className="text-white/60 text-[10px] font-bold uppercase tracking-widest mb-1 shadow-sm">Account Number / Instructions</div>
        <div className="text-white font-mono text-xl md:text-2xl tracking-[0.15em] font-bold drop-shadow-md">
          {details}
        </div>
      </div>

      <div className="flex justify-between items-end relative z-10">
        <div className="flex flex-col">
          <div className="text-white/50 text-[8px] uppercase font-bold">Holder</div>
          <div className="text-white/90 text-sm font-bold tracking-wide">Bismahsoft Academy</div>
        </div>
        <div className="flex gap-1.5">
           <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/5">
              <Zap size={14} className="text-white" />
           </div>
           <div className="w-12 h-8 bg-white/20 rounded-lg backdrop-blur-md border border-white/10"></div>
        </div>
      </div>
    </motion.div>
  );
}

function EnrollmentPage() {
  const navigate = useNavigate();
  const [method, setMethod] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    transactionId: '',
    senderNumber: '',
    amount: '6000'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!method) return;
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'enrollments'), {
        ...formData,
        amount: parseFloat(formData.amount),
        paymentMethod: method,
        status: 'pending',
        courseName: 'Advanced Graphic Design with AI Tools',
        createdAt: serverTimestamp()
      });
      setSuccess(true);
      setTimeout(() => navigate('/'), 3000);
    } catch (error) {
      console.error("Enrollment error:", error);
      alert("Submission failed. Please check your data.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const paymentMethods = [
    { id: 'bkash', name: 'bKash', color: '#DE0066', icon: <Smartphone className="w-5 h-5"/>, number: '01819235331' },
    { id: 'nagad', name: 'Nagad', color: '#F7941D', icon: <Wallet className="w-5 h-5"/>, number: '01819235331' },
    { id: 'upay', name: 'Upay', color: '#00adef', icon: <CreditCard className="w-5 h-5"/>, number: '01819235331' },
    { id: 'bank', name: 'Bank', color: '#2c3e50', icon: <Building2 className="w-5 h-5"/>, number: 'Islami Bank 123-456' }
  ];

  return (
    <div className="min-h-screen bg-[#0d1017] text-white selection:bg-violet-500/30">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-gray-400 hover:text-white mb-10 transition-colors group">
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> Back to Course Landing
        </button>

        <div className="mb-12">
          <SectionBadge text="Secure Enrollment Gateway" />
          <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight drop-shadow-sm">Confirm Your Spot</h1>
          <p className="text-gray-400 text-lg max-w-2xl leading-relaxed">অ্যাডভান্সড গ্রাফিক ডিজাইন কোর্সের ব্যাচ ০২-এ আপনাকে স্বাগতম! নিচের ধাপগুলো অনুসরণ করে কুইক এনরোলমেন্ট সম্পন্ন করুন।</p>
        </div>

        {success ? (
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-[#121626] border border-emerald-500/30 p-16 rounded-[2.5rem] text-center shadow-3xl">
            <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_40px_rgba(16,185,129,0.2)]">
              <Check className="w-12 h-12 text-emerald-500" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4 italic">Congratulations!</h2>
            <p className="text-gray-400 text-lg">আপনার এনরোলমেন্ট ডাটাবেসে সফলভাবে জমা হয়েছে। <br /> আমরা ২৪ ঘণ্টার মধ্যে ভেরিফাই করে ইমেইল পাঠিয়ে দেব।</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-16 items-start">
            
            {/* Step 1: Payment Method */}
            <div className="space-y-10">
              <section>
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center font-bold text-violet-400">1</div>
                  <h2 className="text-2xl font-bold tracking-tight">Select Payment Method</h2>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  {paymentMethods.map((m) => (
                    <motion.button
                      key={m.id}
                      whileHover={{ scale: 1.03, y: -2 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setMethod(m.id)}
                      className={`relative p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-4 overflow-hidden group ${method === m.id ? 'border-violet-500 bg-violet-600/10' : 'border-[#262c43] bg-[#121626]'}`}
                    >
                      <div className={`p-3 rounded-xl transition-colors ${method === m.id ? 'bg-white/10' : 'bg-white/[0.03]'}`} style={{ color: m.color }}>{m.icon}</div>
                      <span className="font-bold tracking-wide">{m.name}</span>
                      {method === m.id && <motion.div layoutId="activeMethod" className="absolute top-2 right-2 w-2 h-2 rounded-full bg-violet-500 shadow-[0_0_8px_rgba(139,92,246,0.6)]" />}
                    </motion.button>
                  ))}
                </div>

                <div className="mt-8 h-60 flex flex-col justify-center">
                  <AnimatePresence mode="wait">
                    {method ? (
                      <PaymentCard 
                        key={method} 
                        method={paymentMethods.find(m => m.id === method)} 
                        details={paymentMethods.find(m => m.id === method)?.number || ""}
                      />
                    ) : (
                      <div className="bg-[#121626] border border-dashed border-[#262c43] h-52 rounded-2xl flex flex-col items-center justify-center text-gray-500 gap-3 grayscale opacity-40">
                        <CreditCard size={48} strokeWidth={1.5} />
                        <span className="text-sm font-medium">Select a payment method to see details</span>
                      </div>
                    )}
                  </AnimatePresence>
                </div>
              </section>

              {/* Questions Section */}
              <section className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 space-y-6">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Sparkles size={18} className="text-violet-400" /> Enrollment FAQ
                </h3>
                <div className="space-y-4">
                   {[
                     { q: "টাকা পাঠানোর পর কি করতে হবে?", a: "পেমেন্ট সফল হলে ট্রানজেকশন আইডি কপি করে পাশের ফর্মে সাবমিট করুন।" },
                     { q: "ভর্তি কনফার্মেশন কখন পাব?", a: "২৪ ঘণ্টার মধ্যে আপনার ইমেইল এবং ফোনে কনফার্মেশন যাবে।" }
                   ].map((faq, i) => (
                     <div key={i} className="space-y-1">
                        <div className="text-sm font-bold text-gray-200">{faq.q}</div>
                        <div className="text-xs text-gray-500 leading-relaxed">{faq.a}</div>
                     </div>
                   ))}
                </div>
              </section>
            </div>

            {/* Step 2: Form */}
            <div className="lg:sticky lg:top-28">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-10 h-10 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center font-bold text-violet-400">2</div>
                <h2 className="text-2xl font-bold tracking-tight">Student Information & Registration</h2>
              </div>

              {/* External Registration Link Section */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-blue-600/5 border border-blue-500/20 p-8 rounded-[2.5rem] mb-8 relative overflow-hidden group shadow-xl"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 blur-[60px] rounded-full pointer-events-none"></div>
                
                <p className="text-gray-300 text-sm leading-relaxed mb-6 relative z-10 font-medium">
                  আমাদের Bismahsoft Academy তে কোর্সে ভর্তির জন্য আগ্রহী শিক্ষার্থীদেরকে নিচে দেওয়া স্টুডেন্ট রেজিস্ট্রেশন লিংকে ক্লিক করে রেজিস্ট্রেশন সম্পন্ন করার জন্য অনুরোধ করা হচ্ছে।
                </p>
                
                <motion.a
                  href="https://tinyurl.com/bismahsoftadmission"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.02, backgroundColor: '#2563eb' }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-blue-600/90 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all shadow-[0_10px_25px_rgba(37,99,235,0.2)] relative z-10"
                >
                  <ExternalLink size={20} /> রেজিস্ট্রেশন সম্পন্ন করুন
                </motion.a>

                <div className="mt-6 flex flex-col gap-3 relative z-10">
                  <p className="text-[11px] text-gray-400 leading-relaxed italic">
                    সঠিক তথ্য দিয়ে রেজিস্ট্রেশন সম্পন্ন করলে যাচাই-বাছাই শেষে ইনশাআল্লাহ আপনাকে নির্ধারিত ব্যাচে অন্তর্ভুক্ত করা হবে।
                  </p>
                  <div className="h-[1px] bg-white/5 my-1"></div>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest flex items-center gap-2">
                     যেকোনো প্রয়োজনে আমাদের অফিসিয়াল হোয়াটসঅ্যাপ নম্বরে যোগাযোগ করতে পারেন। ধন্যবাদ।
                  </p>
                </div>
              </motion.div>

              <form onSubmit={handleSubmit} className="bg-[#121626] border border-[#262c43] p-8 md:p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-violet-600/5 blur-[60px] rounded-full pointer-events-none group-hover:bg-violet-600/10 transition-colors"></div>
                
                <div className="space-y-6 relative z-10">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Full Name</label>
                    <input required value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} className="w-full bg-[#0d1017] border border-[#262c43] px-5 py-4 rounded-2xl focus:border-violet-500 focus:ring-1 focus:ring-violet-500/50 outline-none transition-all placeholder:text-gray-700" placeholder="e.g. Abdullah Al Mamun" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Phone Number</label>
                      <input required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-[#0d1017] border border-[#262c43] px-5 py-4 rounded-2xl focus:border-violet-500 focus:ring-1 focus:ring-violet-500/50 outline-none transition-all placeholder:text-gray-700" placeholder="01XXX XXXXXX" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Email Address</label>
                      <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-[#0d1017] border border-[#262c43] px-5 py-4 rounded-2xl focus:border-violet-500 focus:ring-1 focus:ring-violet-500/50 outline-none transition-all placeholder:text-gray-700" placeholder="name@email.com" />
                    </div>
                  </div>

                  <div className="pt-4 space-y-6">
                    <div className="h-[1px] bg-gradient-to-r from-transparent via-[#262c43] to-transparent"></div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Transaction ID</label>
                      <input required value={formData.transactionId} onChange={e => setFormData({...formData, transactionId: e.target.value})} className="w-full bg-[#0d1017] border border-[#262c43] px-5 py-4 rounded-2xl font-mono focus:border-violet-500 focus:ring-1 focus:ring-violet-500/50 outline-none transition-all placeholder:text-gray-700 uppercase" placeholder="ABC123XYZ" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Sender Mobile Number</label>
                      <input required value={formData.senderNumber} onChange={e => setFormData({...formData, senderNumber: e.target.value})} className="w-full bg-[#0d1017] border border-[#262c43] px-5 py-4 rounded-2xl focus:border-violet-500 focus:ring-1 focus:ring-violet-500/50 outline-none transition-all placeholder:text-gray-700" placeholder="Your account number" />
                    </div>
                  </div>

                  <motion.button 
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    disabled={!method || isSubmitting}
                    className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-500 py-5 rounded-2xl font-bold text-lg disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed shadow-[0_10px_30px_rgba(139,92,246,0.3)] transition-all flex items-center justify-center gap-3 mt-4"
                  >
                    {isSubmitting ? <><Sparkles className="animate-spin w-5 h-5" /> Submitting...</> : 'কোর্স এনরোলমেন্ট রিকোয়েস্ট পাঠান'}
                  </motion.button>
                  <p className="text-[10px] text-center text-gray-500 uppercase font-black tracking-widest mt-4">Secure & Encrypted Submission</p>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// --- Additional Resources Data ---
const chromeExtensions = [
  { name: "Muzli", url: "https://chromewebstore.google.com/detail/muzli", icon: <Compass className="w-6 h-6" /> },
  { name: "WhatFont", url: "https://chromewebstore.google.com/detail/whatfont", icon: <Type className="w-6 h-6" /> },
  { name: "Color Picker", url: "https://chromewebstore.google.com/detail/color-picker", icon: <Pipette className="w-6 h-6" /> },
  { name: "SVG Export", url: "https://chromewebstore.google.com/detail/svg-export", icon: <FileCode className="w-6 h-6" /> },
  { name: "Responsive Viewer", url: "https://chromewebstore.google.com/detail/responsive-viewer", icon: <MonitorSmartphone className="w-6 h-6" /> },
  { name: "Loom", url: "https://chromewebstore.google.com/detail/loom", icon: <Video className="w-6 h-6" /> },
  { name: "Fonts Ninja", url: "https://chromewebstore.google.com/detail/fonts-ninja", icon: <Type className="w-6 h-6" /> },
  { name: "PerfectPixel", url: "https://chromewebstore.google.com/detail/perfectpixel", icon: <Crosshair className="w-6 h-6" /> },
  { name: "Page Ruler", url: "https://chromewebstore.google.com/detail/page-ruler", icon: <Ruler className="w-6 h-6" /> },
  { name: "Wappalyzer", url: "https://chromewebstore.google.com/detail/wappalyzer", icon: <Activity className="w-6 h-6" /> }
];

const designWebsites = [
  { name: "Freepik", url: "https://www.freepik.com", icon: <ImageIcon className="w-6 h-6" /> },
  { name: "Behance", url: "https://www.behance.net", icon: <Briefcase className="w-6 h-6" /> },
  { name: "Dribbble", url: "https://dribbble.com", icon: <Dribbble className="w-6 h-6" /> },
  { name: "Unsplash", url: "https://unsplash.com", icon: <Camera className="w-6 h-6" /> },
  { name: "Pixeden", url: "https://www.pixeden.com", icon: <Box className="w-6 h-6" /> },
  { name: "UI8", url: "https://ui8.net", icon: <Layers className="w-6 h-6" /> },
  { name: "Mobbin", url: "https://mobbin.com", icon: <Smartphone className="w-6 h-6" /> },
  { name: "Creative Market", url: "https://creativemarket.com", icon: <ShoppingCart className="w-6 h-6" /> },
  { name: "Awwwards", url: "https://www.awwwards.com", icon: <Trophy className="w-6 h-6" /> },
  { name: "GraphicBurger", url: "https://graphicburger.com", icon: <Coffee className="w-6 h-6" /> }
];

export function MainNavbar() {
  const navigate = useNavigate();
  return (
    <nav className="border-b border-[#262c43] bg-[#0d1017]/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <motion.div 
            whileHover={{ rotate: 180, scale: 1.1 }}
            transition={{ duration: 0.5 }}
            className="w-8 h-8 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500 flex items-center justify-center p-1.5"
          >
            <PenTool className="w-full h-full text-white" />
          </motion.div>
          <div className="font-bold text-lg tracking-tight">Bismahsoft Academy</div>
        </Link>
        <div className="hidden md:flex gap-8 text-sm font-semibold text-gray-200">
          <a href="/#overview" className="hover:text-white transition-colors">Overview</a>
          <a href="/#outcomes" className="hover:text-white transition-colors">কী শিখবেন</a>
          <a href="/#curriculum" className="hover:text-white transition-colors">Curriculum</a>
          <a href="/#requirements" className="hover:text-white transition-colors">Requirements</a>
          <a href="/#ebook" className="hover:text-white transition-colors text-fuchsia-400">Ebook</a>
          <a href="/#faq" className="hover:text-white transition-colors">FAQ</a>
        </div>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/enroll')}
          className="bg-gradient-to-r from-violet-600 to-fuchsia-500 hover:from-violet-500 hover:to-fuchsia-400 px-6 py-2 rounded-full text-sm font-semibold transition-all shadow-[0_0_15px_rgba(139,92,246,0.3)]"
        >
          এখুনি Join করুন
        </motion.button>
      </div>
    </nav>
  );
}

const islamicEbooks = [
  {
    title: "আল্লাহর প্রতি সুধারণা -ইমাম ইবনু আবিদ দুনইয়া",
    imgUrl: "https://www.image2url.com/r2/default/images/1776584776194-5efc7a00-29f1-44d3-893a-86027f89d40c.webp",
    pdfId: "1fyh2bs_ZreUjiyYcBGbgtbM8e3jZ2hHN",
    originalPrice: "300"
  },
  {
    title: "রাসূলুল্লাহ (সঃ) এর সকাল-সন্ধ্যার দু'আ ও যিকর",
    imgUrl: "https://www.image2url.com/r2/default/images/1776585610178-f1901858-b26f-40f1-9247-480c37b8be53.jpg",
    pdfId: "1_Uoaxqg2MJ1igbgQw99a2tGAymzCY4h4",
    originalPrice: "50"
  },
  {
    title: "মুমিনের_ক্যারিয়ার_ভাবনা",
    imgUrl: "https://www.image2url.com/r2/default/images/1776585579242-65e31148-4ebf-4243-8050-7cec27ecaced.webp",
    pdfId: "1K_qlXTlwnGQxufD5w3ntyy0tvWGs2Gos",
    originalPrice: "500"
  },
  {
    title: "ফুল হয়ে ফোটো -শাইখ আহমাদ মুসা জিবরিল (হাফি.) ও মোহাম্মাদ হোবলস",
    imgUrl: "https://www.image2url.com/r2/default/images/1776585536751-3b446f00-8083-4cd2-91ea-504ca3618b52.webp",
    pdfId: "1U4qhjkWMSiwhe9_hyq0Fghvn3kUildOr",
    originalPrice: "1050"
  },
  {
    title: "এবার_ভিন্ন_কিছু_হোক",
    imgUrl: "https://www.image2url.com/r2/default/images/1776585393309-b40d82d2-92c1-435d-acfd-6c9a9f731592.webp",
    pdfId: "1E5sW81zPG713ksSNwo7W8uTSiAtvovk4",
    originalPrice: "400"
  }
];

const assessmentQuestions = [
  "আমি সুন্দর ব্যাকগ্রাউন্ড বানাতে পারি।",
  "আমি লোগো বানানোর সময় খুব সহজেই আইডিয়া পেয়ে যাই।",
  "টাইপোগ্রাফি নিয়ে আমার কোনো ধরণের সমস্যা হয় না।",
  "আমি ডিজাইনের বেসিক সব গ্রামার আগে থেকেই জানি।",
  "আমার ডিজাইন প্রথমবারেই অ্যাপ্রুভ হয়ে যায়।",
  "ফন্ট নিয়ে আমি কখনও ঝামেলায় পড়িনি।",
  "আমি ফটোশপ ও ইলাস্ট্রেটর - উভয় সফটওয়্যারেই ডিজাইনের কাজ করতে পারি।",
  "আমি পোস্টার, ইনফোগ্রাফিক, ব্যানার, লোগোসহ সব ধরনের ডিজাইন করতে পারি।",
  "কালার কম্বিনেশন ঠিক করতে আমার কোনো সমস্যাই হয় না।",
  "আমি ডিজাইন ফ্রিল্যান্সার হিসেবে অনেকগুলো কাজ ইতিমধ্যে করেছি।"
];

function AssessmentPage() {
  const [step, setStep] = useState<'info' | 'questions' | 'result'>('info');
  const [name, setName] = useState('');
  const [designation, setDesignation] = useState('');
  const [answers, setAnswers] = useState<(boolean | null)[]>(Array(10).fill(null));
  
  // Confetti setup
  const [windowDimension, setWindowDimension] = useState({ width: window.innerWidth, height: window.innerHeight });

  const certificateRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const detectSize = () => {
      setWindowDimension({ width: window.innerWidth, height: window.innerHeight });
    }
    window.addEventListener('resize', detectSize);
    return () => window.removeEventListener('resize', detectSize);
  }, []);

  const handleAnswer = (index: number, answer: boolean) => {
    const newAnswers = [...answers];
    newAnswers[index] = answer;
    setAnswers(newAnswers);
  };

  const calculateScore = () => {
    return answers.filter(a => a === true).length * 10;
  };

  const score = calculateScore();
  const isPassed = score >= 80;

  const [isDownloading, setIsDownloading] = useState(false);

  const handleComplete = () => {
    setStep('result');
    if (score >= 80) {
      // Play cheering sound
      const audio = new Audio('https://www.myinstants.com/media/sounds/kids-cheering.mp3');
      audio.play().catch(() => {/* safe handling */});
    } else {
      // Play sad sound
      const audio = new Audio('https://www.myinstants.com/media/sounds/sad-trombone.mp3');
      audio.play().catch(() => {/* safe handling */});
    }
  };

  const generateCanvas = async () => {
    if (!certificateRef.current) return null;
    // Wait for all fonts (like the Alex Brush signature) to fully load before capturing
    await document.fonts.ready;
    return await html2canvas(certificateRef.current, { 
      scale: 2, 
      backgroundColor: '#121626', 
      useCORS: true, 
      allowTaint: true 
    });
  };

  const handleDownloadImage = async () => {
    if (isDownloading) return;
    try {
      setIsDownloading(true);
      const canvas = await generateCanvas();
      if (!canvas) return;
      
      const image = canvas.toDataURL("image/jpeg", 1.0);
      const link = document.createElement('a');
      link.href = image;
      link.download = `Bismahsoft-Assessment-${name.replace(/\s+/g, '-').toLowerCase()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch(err) {
      console.error("Failed to generate image", err);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (isDownloading) return;
    try {
      setIsDownloading(true);
      const canvas = await generateCanvas();
      if (!canvas) return;

      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });
      pdf.addImage(imgData, 'JPEG', 0, 0, canvas.width, canvas.height);
      pdf.save(`Bismahsoft-Assessment-${name.replace(/\s+/g, '-').toLowerCase()}.pdf`);
    } catch(err) {
      console.error("Failed to generate PDF", err);
    } finally {
      setIsDownloading(false);
    }
  };

  const allAnswered = answers.every(a => a !== null);

  return (
    <div className="min-h-screen bg-[#0d1017] text-white font-sans selection:bg-cyan-500/30 relative">
      {step === 'result' && isPassed && (
        <div className="fixed inset-0 z-50 pointer-events-none">
          <Confetti 
            width={windowDimension.width} 
            height={windowDimension.height}
            recycle={false}
            numberOfPieces={400}
            gravity={0.15}
          />
        </div>
      )}

      <MainNavbar />

      <div className="max-w-4xl mx-auto px-6 py-16 text-center">
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse"></span>
            <span className="text-sm font-semibold tracking-wide text-cyan-400">Skill Evaluation</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tighter uppercase italic">
            Advanced Graphic Design
          </h1>
          <h2 className="text-xl md:text-2xl font-bold text-gray-400 mb-2">With AI Tools</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 mx-auto rounded-full mt-6 mb-8"></div>
        </div>

        {step === 'info' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#121626] border border-[#262c43] rounded-[2rem] p-8 md:p-12 shadow-2xl relative max-w-2xl mx-auto text-left"
          >
            <h3 className="text-2xl font-bold text-white mb-6">Let's get to know you first</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-400 mb-2">Your Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#0d1017] border border-[#262c43] rounded-xl px-5 py-4 focus:ring-1 focus:ring-cyan-500 outline-none transition-all placeholder:text-gray-700 font-medium"
                  placeholder="e.g. Shakib"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-400 mb-2">What design field are you in?</label>
                <input 
                  type="text" 
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  className="w-full bg-[#0d1017] border border-[#262c43] rounded-xl px-5 py-4 focus:ring-1 focus:ring-cyan-500 outline-none transition-all placeholder:text-gray-700 font-medium"
                  placeholder="e.g. UX/UI Design, Print Media"
                />
              </div>
            </div>
            <div className="mt-8">
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={!name || !designation}
                onClick={() => setStep('questions')}
                className="w-full bg-gradient-to-r from-cyan-600 to-cyan-400 text-white py-4 rounded-xl font-bold text-lg disabled:opacity-50 transition-all shadow-[0_10px_30px_rgba(6,182,212,0.3)]"
              >
                Proceed to Questions
              </motion.button>
            </div>
          </motion.div>
        )}

        {step === 'questions' && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#121626] border border-[#262c43] rounded-[2rem] p-6 md:p-12 shadow-2xl relative text-left"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-600/5 rounded-full blur-[80px] pointer-events-none"></div>

            <div className="space-y-6 relative z-10">
              {assessmentQuestions.map((q, idx) => (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  key={idx} 
                  className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/5 transition-colors"
                >
                  <div className="flex items-center gap-2 shrink-0">
                     <button 
                       onClick={() => handleAnswer(idx, true)}
                       className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold transition-all border ${answers[idx] === true ? 'bg-green-600 text-white border-green-500 shadow-[0_0_15px_rgba(22,163,74,0.4)]' : 'bg-[#1a1f33] text-gray-400 border-[#262c43] hover:border-green-500 hover:text-green-500'}`}
                     >
                       হ্যাঁ
                     </button>
                     <button 
                       onClick={() => handleAnswer(idx, false)}
                       className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold transition-all border ${answers[idx] === false ? 'bg-red-600 text-white border-red-500 shadow-[0_0_15px_rgba(220,38,38,0.4)]' : 'bg-[#1a1f33] text-gray-400 border-[#262c43] hover:border-red-500 hover:text-red-500'}`}
                     >
                       না
                     </button>
                  </div>
                  <p className="text-gray-300 text-lg font-medium leading-relaxed">{q}</p>
                </motion.div>
              ))}
            </div>

            <div className="mt-12 text-center pt-8 border-t border-[#262c43]">
               <motion.button 
                  whileHover={allAnswered ? { scale: 1.05 } : {}}
                  whileTap={allAnswered ? { scale: 0.95 } : {}}
                  onClick={handleComplete}
                  disabled={!allAnswered}
                  className="bg-gradient-to-r from-cyan-600 to-blue-500 text-white px-10 py-4 rounded-full font-bold shadow-xl disabled:opacity-50 disabled:grayscale transition-all"
               >
                 Submit & See Results
               </motion.button>
            </div>
          </motion.div>
        )}

        {step === 'result' && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center"
          >
            {/* Visual Emotion feedback */}
            <div className="mb-8">
              {isPassed ? (
                <motion.div 
                  initial={{ scale: 0, rotate: -45 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", bounce: 0.5 }}
                  className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center border-4 border-green-500 text-5xl mx-auto shadow-[0_0_40px_rgba(34,197,94,0.4)]"
                >
                  🎉
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center border-4 border-red-500 text-5xl mx-auto shadow-[0_0_40px_rgba(239,68,68,0.4)]"
                >
                  🥺
                </motion.div>
              )}
            </div>

            {/* Assessment Certificate Block (Target for html2canvas) */}
            <div 
              ref={certificateRef}
              className="w-full max-w-4xl p-12 md:p-16 relative overflow-hidden shadow-2xl mb-10"
              style={{ backgroundColor: '#121626', borderRadius: '2.5rem', fontFamily: '"Hind Siliguri", sans-serif' }}
            >
              {/* Premium Inner Borders to simulate a real certificate frame */}
              <div className="absolute inset-4 border-4 border-amber-500/20 rounded-[2rem] pointer-events-none"></div>
              <div className="absolute inset-6 border border-amber-500/30 rounded-[1.5rem] pointer-events-none"></div>

              {/* html2canvas compatible gradient glow */}
              <div className="absolute -top-[20%] -right-[10%] w-[40rem] h-[40rem] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-600/10 via-transparent to-transparent pointer-events-none"></div>
              
              {/* Certificate Header */}
              <div className="text-center relative z-10 border-b border-amber-500/20 pb-10 mb-10">
                 <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg" style={{ background: 'linear-gradient(to right, #f59e0b, #facc15)' }}>
                      <Target className="text-[#121626] w-8 h-8" />
                    </div>
                 </div>
                 <h1 className="text-4xl md:text-5xl font-black mb-3 text-white uppercase tracking-widest font-serif">Certificate of Assessment</h1>
                 <p className="text-amber-400 font-bold tracking-[0.2em] uppercase text-sm">Bismahsoft Academy · Skill Evaluation</p>
              </div>

              {/* Recipient Details */}
              <div className="text-center relative z-10 mb-12 space-y-4">
                 <p className="text-gray-400 italic text-lg text-[#9ca3af]">This certifies that</p>
                 <h2 className="text-4xl font-black text-white capitalize">{name}</h2>
                 <p className="text-gray-300 font-medium tracking-wider uppercase text-sm">[{designation}]</p>
                 <p className="text-gray-400 italic text-lg text-[#9ca3af] mt-4">has successfully completed the Graphic Design Assessment</p>
              </div>

              {/* Score Block */}
              <div className="rounded-3xl p-8 text-center mb-12 flex flex-col items-center justify-center relative z-10 shadow-inner border border-amber-500/20" style={{ backgroundColor: '#0a0c12' }}>
                  <h4 className="text-xl font-medium mb-4 uppercase tracking-widest text-[#9ca3af]">Graphic Design Skill Level</h4>
                  <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-400" style={{ color: '#facc15' }}>
                    {score}%
                  </div>
                  <p className="text-[#6b7280] mt-2 font-medium">({score} / 100 Marks Obtained)</p>
              </div>
              
              {/* Footer / Signatures */}
              <div className="text-center border-t border-amber-500/20 pt-10 relative z-10 flex flex-col md:flex-row justify-between items-end px-4">
                  <div className="text-left mb-6 md:mb-0">
                     <p className="text-xs text-[#6b7280] uppercase tracking-widest mb-2 font-bold flex items-center gap-2">
                        Assessed & Verified By
                        <BadgeCheck className="text-blue-500 w-4 h-4" />
                     </p>
                     <div className="font-black text-2xl text-white tracking-tight">Bismahsoft Academy</div>
                     <p className="text-sm font-bold mt-1 mb-2" style={{ color: '#f59e0b' }}>Official Skill Evaluation</p>
                     <p className="text-xs text-[#9ca3af] font-medium tracking-wider">Date: {new Date().toLocaleDateString('en-GB')}</p>
                  </div>
                  <div className="text-right">
                    <div className="inline-block border-b border-amber-500/30 pb-2 mb-2 px-8">
                       {/* Professional Signature */}
                       <h5 className="text-5xl" style={{ color: '#fbbf24', fontFamily: "'Alex Brush', cursive", fontWeight: 400 }}>Shakibul Islam</h5>
                    </div>
                    <p className="text-sm font-bold text-gray-300 uppercase tracking-[0.1em] mt-1">সাকিবুল ইসলাম সাব্বির</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest mt-1" style={{ color: '#f59e0b' }}>Course Instructor</p>
                  </div>
              </div>
            </div>

            {/* Actions Menu */}
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <motion.button
                whileHover={!isDownloading ? { scale: 1.05 } : {}}
                whileTap={!isDownloading ? { scale: 0.95 } : {}}
                onClick={handleDownloadImage}
                disabled={isDownloading}
                className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-8 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all shadow-[0_10px_20px_rgba(0,0,0,0.3)] disabled:opacity-50"
              >
                <ImageIcon size={18} /> {isDownloading ? 'Processing...' : 'Download as JPG'}
              </motion.button>
              
              <motion.button
                whileHover={!isDownloading ? { scale: 1.05 } : {}}
                whileTap={!isDownloading ? { scale: 0.95 } : {}}
                onClick={handleDownloadPDF}
                disabled={isDownloading}
                className="bg-gradient-to-r from-cyan-600 to-blue-500 hover:from-cyan-500 hover:to-blue-400 text-white border-none px-8 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all shadow-[0_10px_20px_rgba(6,182,212,0.3)] disabled:opacity-50"
              >
                <FileCode size={18} /> {isDownloading ? 'Processing...' : 'Download as PDF'}
              </motion.button>

              <motion.button
                 onClick={() => {
                   setStep('info');
                   setAnswers(Array(10).fill(null));
                 }}
                 disabled={isDownloading}
                 className="text-gray-400 hover:text-white px-4 py-3 ml-2 text-sm font-bold uppercase tracking-widest transition-colors disabled:opacity-50"
              >
                 Retake Test
              </motion.button>
            </div>

          </motion.div>
        )}

      </div>
    </div>
  );
}

function LandingPage() {
  const navigate = useNavigate();
  // Legacy single boolean swapped to track the active book metadata or string ID
  const [activePreviewBook, setActivePreviewBook] = useState<{title: string, pdfId: string} | null>(null);
  const [activeFullReaderBook, setActiveFullReaderBook] = useState<{title: string, pdfId: string} | null>(null);
  const [isPrivacyActive, setIsPrivacyActive] = useState(false);

  // Advanced Security: Visibility and Focus Monitoring
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && (activeFullReaderBook || activePreviewBook)) {
        setIsPrivacyActive(true);
      }
    };

    const handleBlur = () => {
      if (activeFullReaderBook || activePreviewBook) {
        setIsPrivacyActive(true);
      }
    };

    const handleFocus = () => {
      setIsPrivacyActive(false);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Block Print (Ctrl/Cmd + P)
      if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
      }
      // Block Save (Ctrl/Cmd + S)
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
      }
      // Block PrintScreen (Commonly detected as 'PrintScreen' or 'Snapshot')
      if (e.key === 'PrintScreen' || e.key === 'Snapshot') {
        setIsPrivacyActive(true);
        setTimeout(() => setIsPrivacyActive(false), 2000);
      }
    };

    window.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeFullReaderBook, activePreviewBook]);

  // Function to prevent right-click on the viewer
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-screen bg-[#0d1017] text-white font-sans selection:bg-violet-500/30">
      {/* Navbar */}
      <MainNavbar />

      <main className="relative w-full flex flex-col items-center">
        {/* Glow Effects */}
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[150px] -translate-x-1/2 pointer-events-none"></div>
        <div className="absolute top-[20%] right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[150px] translate-x-1/3 pointer-events-none"></div>

        {/* Floating Graphic Theme Elements */}
        {/* ... (rest of main content) */}
        <motion.div 
          animate={{ x: [0, -15, 0], y: [0, 20, 0], rotate: [-10, 5, -10] }}
          transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
          className="absolute top-32 right-[8%] opacity-30 pointer-events-none hidden lg:block"
        >
          <PenTool size={100} className="text-fuchsia-500" />
        </motion.div>

        <motion.div 
          animate={{ x: [0, 20, 0], y: [0, -15, 0], rotate: [0, 15, 0] }}
          transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
          className="absolute top-80 right-[2%] opacity-20 pointer-events-none hidden lg:block"
        >
          <MousePointer2 size={80} className="text-violet-500" />
        </motion.div>

        <motion.div 
          animate={{ x: [0, 10, 0], y: [0, 15, 0], rotate: [10, -5, 10] }}
          transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }}
          className="absolute top-20 left-[5%] opacity-20 pointer-events-none hidden lg:block"
        >
          <Brush size={70} className="text-blue-500" />
        </motion.div>

        {/* HERO SECTION */}
        <section className="w-full max-w-7xl px-6 pt-20 pb-24 relative z-10">
          <div className="grid lg:grid-cols-[1.2fr_1fr] gap-12 lg:gap-8 items-center">
            
            <div className="flex flex-col items-start gap-6">
              <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <SectionBadge text="Batch 02 Enrollment Open" />
              </motion.div>
              
              <div className="space-y-6">
                <motion.h1 
                  initial={{ opacity: 0, x: -30 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="text-5xl md:text-6xl lg:text-[4.5rem] font-bold leading-[1.05] tracking-tight text-white drop-shadow-sm"
                >
                  Advanced <br /> 
                  Graphic Design with <br />
                  AI Tools Live <br />
                  Course
                </motion.h1>
                <div className="space-y-4">
                  <motion.p 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
                    className="text-violet-400 text-xl font-bold tracking-wide"
                  >
                    Level up your creativity. Master modern design.
                  </motion.p>
                  <motion.p 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                    className="text-gray-400 text-lg leading-relaxed max-w-xl"
                  >
                    Step into the future of design with this advanced course that combines the foundational principles of graphic design with the power of artificial intelligence. Ideal for modern creatives, this course is designed to make your workflow faster, smarter, and more professional.
                  </motion.p>
                </div>
              </div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                  className="flex flex-wrap items-center gap-4 mt-2"
                >
                  <motion.button 
                    whileHover={{ scale: 1.05 }} 
                    whileTap={{ scale: 0.95 }} 
                    onClick={() => navigate('/enroll')}
                    className="bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white px-8 py-3.5 rounded-full font-semibold shadow-[0_0_20px_rgba(139,92,246,0.4)]"
                  >
                    Join Now
                  </motion.button>
                  <motion.a 
                    href="#curriculum"
                    whileHover={{ scale: 1.05 }} 
                    whileTap={{ scale: 0.95 }} 
                    className="bg-white/[0.05] hover:bg-white/10 border border-[#262c43] text-white px-8 py-3.5 rounded-full font-semibold px-8 transition-all backdrop-blur-sm flex items-center justify-center cursor-pointer"
                  >
                    Curriculum দেখুন
                  </motion.a>
                </motion.div>

              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
                className="flex flex-wrap gap-3 pt-4"
              >
                {["Beginner to Advanced", "Live Course", "20+ Class", "Support Included"].map((tag, i) => (
                  <div key={i} className="px-4 py-2 rounded-full bg-[#161a2b] border border-[#262c43] text-sm text-gray-300 font-medium hover:bg-[#1a1f33] transition-colors cursor-default">
                    {tag}
                  </div>
                ))}
              </motion.div>
            </div>
            
            <div className="relative mx-auto w-full max-w-[460px] lg:ml-auto lg:mr-0 z-20">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }} 
                animate={{ opacity: 1, scale: 1 }} 
                transition={{ duration: 0.6 }}
                className="bg-[#121626]/80 backdrop-blur-xl border border-[#262c43] rounded-[2rem] p-4 shadow-2xl relative"
              >
                
                {/* Thumbnail Area */}
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="relative w-full aspect-[4/3] sm:aspect-video rounded-3xl overflow-hidden mb-5 bg-slate-800"
                >
                  <img 
                     src="https://www.image2url.com/r2/default/images/1776432293871-131e44b2-e90e-436f-8f16-49f59f824e49.png" 
                    alt="Course Preview" 
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0c10]/40 to-transparent flex flex-col justify-end p-6 pointer-events-none">
                    <div className="absolute top-4 right-4 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 w-max mb-2">
                       <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span> LIVE
                    </div>
                  </div>
                </motion.div>

                {/* Pricing Box */}
                <div className="bg-[#161a2b] border border-[#262c43] rounded-[1.5rem] p-6 lg:p-8">
                  <div className="flex flex-wrap items-center gap-4 mb-6">
                    <div className="flex flex-col">
                      <h2 className="text-4xl font-bold text-white tracking-tight">৳6,000</h2>
                      <StarRating />
                    </div>
                    <motion.div 
                       animate={{ scale: [1, 1.05, 1] }} 
                       transition={{ repeat: Infinity, duration: 2 }}
                       className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold rounded-full whitespace-nowrap h-max"
                    >
                      Limited Time Offer
                    </motion.div>
                  </div>

                  <ul className="space-y-4 mb-8 text-left">
                    {[
                      "নিশ্চিত লাইভ প্রজেক্টে অংশগ্রহণের সুযোগ",
                      "বাঙালি ক্লায়েন্টদের সাথে রিয়েল-টাইম কাজ",
                      "ভালো পারফর্মারদের জন্য নিশ্চিত জব সাপোর্ট",
                      "হ্যান্ডস-অন স্টেপ-বাই-স্টেপ প্র্যাক্টিক্যাল লার্নিং"
                    ].map((item, index) => (
                      <li key={index} className="flex items-start gap-3 text-sm text-gray-300">
                        <div className="mt-1 bg-emerald-500/20 rounded-full p-0.5 flex-shrink-0">
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        </div>
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="space-y-3">
                    <motion.button 
                      whileHover={{ scale: 1.02 }} 
                      whileTap={{ scale: 0.98 }} 
                      onClick={() => navigate('/enroll')}
                      className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white py-4 rounded-full font-semibold shadow-[0_0_15px_rgba(139,92,246,0.3)]"
                    >
                      Enroll & Pay Now
                    </motion.button>
                    <motion.a 
                      href="https://wa.me/8801819235331"
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.02 }} 
                      whileTap={{ scale: 0.98 }} 
                      className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white py-4 rounded-full font-bold flex justify-center items-center shadow-[0_0_20px_rgba(37,211,102,0.3)] text-base whitespace-nowrap"
                    >
                      নতুন ব্যাচে জয়েন করতে নক দিন
                    </motion.a>
                  </div>
                </div>
              </motion.div>
            </div>

          </div>
        </section>

        {/* DETAILS SECTIONS */}
        <div className="w-full bg-gradient-to-b from-[#0d1017] to-[#0a0c10] pb-24 space-y-32 z-10 px-6">
          
          {/* Section 1: Course Overview */}
          <section id="overview" className="w-full max-w-5xl mx-auto pt-16 scroll-mt-24">
            <SectionBadge text="Course Overview" />
            <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">এই কোর্সটি কাদের জন্য?</h2>
            <p className="text-gray-400 max-w-3xl leading-relaxed text-lg mb-12">
              আপনি যদি গ্রাফিক ডিজাইন ও AI টুলসের মাধ্যমে future skill, freelance service অথবা প্রফেশনাল ডিজাইন ক্যারিয়ার গড়তে চান - তাহলে এই course আপনার জন্য নিখুঁত পছন্দ।
            </p>
            
            <div className="grid md:grid-cols-3 gap-6">
              {overviewData.map((item, idx) => (
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  key={idx} 
                  className="bg-[#121626] border border-[#262c43] p-8 rounded-3xl cursor-default group"
                >
                  <div className="w-12 h-12 bg-gray-800/50 border border-gray-700/50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#1a1f33] transition-colors">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-100">{item.title}</h3>
                  <p className="text-gray-400 leading-relaxed text-sm">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Section 2: Learning Outcomes */}
          <section id="outcomes" className="w-full max-w-5xl mx-auto scroll-mt-24">
            <SectionBadge text="Learning Outcomes" />
            <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">এই কোর্সে আপনি কী কী শিখবেন</h2>
            <p className="text-gray-400 max-w-3xl leading-relaxed text-lg mb-12">
              শুধুমাত্র বেসিক ডিজাইন না - এখানে আপনি শিখবেন কিভাবে AI টুলস ব্যবহার করে স্মার্টলি এবং দ্রুত প্রফেশনাল আউটপুট তৈরি করতে হয়।
            </p>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {outcomesData.map((item, idx) => (
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  key={idx} 
                  className="bg-[#121626] border border-[#262c43] p-8 rounded-3xl cursor-default group"
                >
                  <div className="w-12 h-12 bg-gray-800/50 border border-gray-700/50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#1a1f33] transition-colors">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-100">{item.title}</h3>
                  <p className="text-gray-400 leading-relaxed text-sm">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Section 3: Course Curriculum */}
          <section id="curriculum" className="w-full max-w-4xl mx-auto scroll-mt-24">
             <SectionBadge text="Detailed Structure" />
             <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">Course Curriculum</h2>
             <p className="text-gray-400 max-w-3xl leading-relaxed text-lg mb-12">
               নিচের structure টি এমনভাবে সাজানো হয়েছে যেন একজন learner step-by-step editing ও design confidence build করতে পারে।
             </p>

             <div className="space-y-12">
               {curriculumData.map((category, idx) => (
                 <div key={idx}>
                   <h3 className="text-2xl font-bold text-gray-200 mb-6">{category.category}</h3>
                   <div>
                     {category.items.map((item, idxx) => (
                       <Accordion key={idxx} title={item} idx={idxx} />
                     ))}
                   </div>
                 </div>
               ))}
             </div>
          </section>

          {/* Section 4: Offer Value */}
          <section className="w-full max-w-5xl mx-auto pt-10">
            <SectionBadge text="Offer Value" />
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 tracking-tight">এই কোর্সের সাথে আপনি আর কী কী পাবেন</h2>
            <p className="text-gray-400 max-w-3xl leading-relaxed text-lg mb-12">
              Hands-on project-based learning এবং ইন্ডাস্ট্রি স্ট্যান্ডার্ড ট্রেনিং যা আপনাকে ডিজাইন মার্কেটে সবার থেকে আলাদা করে তুলবে।
            </p>
            
            <div className="grid md:grid-cols-3 gap-6">
              {bonusData.map((item, idx) => (
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  key={idx} 
                  className="bg-[#121626] border border-[#262c43] p-8 rounded-3xl cursor-default group"
                >
                  <div className="w-12 h-12 bg-gray-800/50 border border-gray-700/50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#1a1f33] transition-colors">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-100">{item.title}</h3>
                  <p className="text-gray-400 leading-relaxed text-sm">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Section 5: PC / Laptop Requirement */}
          <section id="requirements" className="w-full max-w-5xl mx-auto pt-10 scroll-mt-24">
            <SectionBadge text="System Requirement" />
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 tracking-tight">PC / Laptop Requirement</h2>
            <p className="text-gray-400 max-w-3xl leading-relaxed text-lg mb-12">
              কাজ করতে খুব high-end machine লাগবেই এমন না, তবে smooth experience-এর জন্য recommended setup helpful!
            </p>
            
            <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
              {/* Minimum */}
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                whileHover={{ scale: 1.02 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5 }}
                className="bg-[#121626] border border-[#262c43] p-8 rounded-[2rem]"
              >
                <h3 className="text-xl font-bold mb-6 text-gray-200">Minimum Setup</h3>
                <ul className="space-y-4">
                  {[
                    "যেকোনো সাধারণ Dual Core বা Core i3 প্রসেসর",
                    "4GB - 8GB RAM (৪ জিবি হলেও শেখা শুরু করা যাবে)",
                    "HDD ড্রাইভ (তবে অন্তত 128GB SSD থাকলে ভালো)",
                    "সাধারণ Integrated Graphics (আলাদা গ্রাফিক্স কার্ড লাগবে না)",
                    "Windows 10/11 বা macOS"
                  ].map((req, i) => (
                    <li key={i} className="flex p-4 bg-[#161a2b] border border-[#262c43] rounded-xl text-sm text-gray-300">
                      {req}
                    </li>
                  ))}
                </ul>
              </motion.div>

               {/* Recommended */}
               <motion.div 
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                whileHover={{ scale: 1.02 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5 }}
                className="bg-[#121626] border border-[#262c43] p-8 rounded-[2rem]"
              >
                <h3 className="text-xl font-bold mb-6 text-gray-200">Recommended Setup</h3>
                <ul className="space-y-4">
                  {[
                    "Intel Core i5 বা AMD Ryzen 5 (বা সমমানের)",
                    "8GB - 16GB RAM (স্মুথ কাজের জন্য)",
                    "256GB SSD (সফটওয়্যার দ্রুত ওপেন এবং কাজের জন্য)",
                    "Intel UHD বা Basic 2GB Graphics Card",
                    "Stable internet connection"
                  ].map((req, i) => (
                    <li key={i} className="flex p-4 bg-[#161a2b] border border-[#262c43] rounded-xl text-sm text-gray-300">
                      {req}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </section>

          {/* Section: Certificate (NEW) */}
          <section id="certificate" className="w-full max-w-5xl mx-auto pt-24 pb-10 scroll-mt-24">
            <div className="bg-gradient-to-br from-[#161a2b] to-[#0d1017] border border-amber-500/20 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden flex flex-col md:flex-row gap-10 items-center">
              
              {/* Background Glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-amber-500/5 rounded-full blur-[120px] pointer-events-none"></div>
              
              {/* Text Side */}
              <div className="w-full md:w-1/2 relative z-10">
                 <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 mb-6">
                    <Award className="w-4 h-4 text-amber-400" />
                    <span className="text-sm font-semibold tracking-wide text-amber-300">Professional Certificate</span>
                 </div>
                 <h2 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tighter">
                    Course <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">Completion</span>
                 </h2>
                 <p className="text-gray-300 text-lg leading-relaxed mb-6 font-medium border-l-4 border-amber-500/50 pl-4">
                    কোর্স শেষে পরীক্ষায় <span className="text-amber-400 font-bold">৮০% বা তার বেশি</span> নম্বর পাওয়া শিক্ষার্থীদেরকে Bismahsoft Academy-এর পক্ষ থেকে একটি প্রফেশনাল সার্টিফিকেট প্রদান করা হবে।
                 </p>
                 <motion.button 
                   whileHover={{ scale: 1.05 }} 
                   whileTap={{ scale: 0.95 }} 
                   onClick={() => navigate('/enroll')}
                   className="bg-amber-500 hover:bg-amber-400 text-[#0d1017] px-8 py-3.5 rounded-full font-bold shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-colors inline-block"
                 >
                   Enrol to Earn
                 </motion.button>
              </div>

              {/* Certificate Image Side */}
              <div className="w-full md:w-1/2 relative z-10 perspective-1000">
                 <motion.div
                   initial={{ opacity: 0, rotateY: 20, scale: 0.9 }}
                   whileInView={{ opacity: 1, rotateY: 0, scale: 1 }}
                   viewport={{ once: true }}
                   transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
                   whileHover={{ scale: 1.02, rotateY: -5, rotateX: 5 }}
                   className="relative group p-2 bg-gradient-to-br from-white/10 to-white/5 rounded-2xl border border-white/10 shadow-2xl"
                 >
                    {/* Shimmer Effect */}
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent -translate-x-[150%] skew-x-[-20deg]"
                      animate={{ translateX: ["-150%", "250%"] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", repeatDelay: 1 }}
                    />
                    
                    <img 
                      src="https://www.image2url.com/r2/default/images/1776453057628-f141fba1-8b00-4d89-a816-f1eb05e93928.jpg" 
                      alt="Bismahsoft Academy Certificate"
                      className="w-full h-auto rounded-xl object-cover shadow-inner"
                      referrerPolicy="no-referrer"
                    />
                 </motion.div>
                 
                 {/* Decorative float elements */}
                 <motion.div 
                   animate={{ y: [0, -10, 0] }} 
                   transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                   className="absolute -right-4 -top-8 w-16 h-16 bg-amber-500/20 backdrop-blur-xl rounded-full border border-amber-500/30 flex items-center justify-center shadow-lg"
                 >
                   <Star className="text-amber-400 w-8 h-8" />
                 </motion.div>
              </div>
            </div>
          </section>

          {/* Section: Designer Assessment Splash */}
          <section id="assessment-splash" className="w-full max-w-5xl mx-auto pt-10 pb-16 scroll-mt-24">
            <div className="bg-gradient-to-br from-[#161a2b] to-[#0d1017] border border-cyan-500/20 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden flex flex-col md:flex-row-reverse gap-10 items-center">
              
              {/* Background Glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none"></div>
              
              {/* Text Side */}
              <div className="w-full md:w-1/2 relative z-10 text-right">
                 <div className="inline-flex flex-row-reverse items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-6">
                    <Target className="w-4 h-4 text-cyan-400" />
                    <span className="text-sm font-semibold tracking-wide text-cyan-300">Designer Assessment</span>
                 </div>
                 <h2 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tighter w-full text-right">
                    Test Your <span className="text-transparent bg-clip-text bg-gradient-to-l from-cyan-400 to-blue-500">Skills</span>
                 </h2>
                 <p className="text-gray-300 text-lg leading-relaxed mb-6 font-medium border-r-4 border-cyan-500/50 pr-4 w-full text-right inline-block">
                    গ্রাফিক ডিজাইনে আপনি কতটা জানেন বা আপনার দক্ষতা কতটুকু, সেটি আপনি এখনই মাত্র ১০টি প্রশ্নের মাধ্যমে যাচাই করে দেখতে পারেন।
                 </p>
                 <motion.button 
                   whileHover={{ scale: 1.05 }} 
                   whileTap={{ scale: 0.95 }} 
                   onClick={() => navigate('/assessment')}
                   className="bg-cyan-500 hover:bg-cyan-400 text-[#0d1017] px-8 py-3.5 rounded-full font-bold shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-colors inline-block md:float-right"
                 >
                   Start Assessment
                 </motion.button>
              </div>

              {/* Assessment Image Side */}
              <div className="w-full md:w-1/2 relative z-10 perspective-1000">
                 <motion.div
                   initial={{ opacity: 0, rotateY: -20, scale: 0.9 }}
                   whileInView={{ opacity: 1, rotateY: 0, scale: 1 }}
                   viewport={{ once: true }}
                   transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
                   whileHover={{ scale: 1.02, rotateY: 5, rotateX: 5 }}
                   className="relative group p-2 bg-gradient-to-bl from-white/10 to-white/5 rounded-2xl border border-white/10 shadow-2xl"
                 >
                    {/* Shimmer Effect */}
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent -translate-x-[150%] skew-x-[20deg]"
                      animate={{ translateX: ["-150%", "250%"] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", repeatDelay: 1 }}
                    />
                    
                    <img 
                      src="https://www.image2url.com/r2/default/images/1776586976605-a4758b38-2fbb-4860-9c6e-19a65a7fa0a2.png" 
                      alt="Assessment Tracker"
                      className="w-full h-auto rounded-xl object-contain shadow-inner bg-[#fff]"
                      referrerPolicy="no-referrer"
                    />
                 </motion.div>
                 
                 {/* Decorative float elements */}
                 <motion.div 
                   animate={{ y: [0, -10, 0] }} 
                   transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                   className="absolute -left-4 -bottom-4 w-12 h-12 bg-cyan-500/20 backdrop-blur-xl rounded-full border border-cyan-500/30 flex items-center justify-center shadow-lg"
                 >
                   <Target className="text-cyan-400 w-6 h-6" />
                 </motion.div>
              </div>
            </div>
          </section>

          {/* Section: Ebook */}
          <section id="ebook" className="w-full max-w-5xl mx-auto pt-16 scroll-mt-24">
            <SectionBadge text="Premium Resources" />
            <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">Graphic Design E-Book</h2>
            <p className="text-gray-400 max-w-3xl leading-relaxed text-lg mb-12">
              আপনার শেখার গতি আরো বাড়াতে প্রিমিয়াম গ্রাফিক ডিজাইন ই-বুকটি সংগ্রহ করুন। ডিজাইন সেন্স, কালার থিওরি থেকে শুরু করে ক্লায়েন্ট হ্যাকিং—সবকিছুই পাবেন এতে। 
            </p>

            <div className="bg-[#121626] border border-[#262c43] rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden flex flex-col md:flex-row gap-10 items-center">
              <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-fuchsia-600/10 rounded-full blur-[100px] pointer-events-none"></div>
              
              {/* Ebook Cover Mockup */}
              <div className="w-full md:w-1/3 aspect-[3/4] relative z-10 perspective-1000">
                <motion.div 
                  whileHover={{ rotateY: 15, scale: 1.05 }}
                  animate={{ y: [0, -10, 0] }}
                  transition={{ 
                    y: { repeat: Infinity, duration: 4, ease: "easeInOut" },
                    scale: { type: "spring", stiffness: 100 },
                    rotateY: { type: "spring", stiffness: 100 }
                  }}
                  className="w-full h-full rounded-xl shadow-[0_20px_50px_rgba(139,92,246,0.3)] transform-style-3d cursor-pointer"
                >
                  <img 
                    src="https://www.image2url.com/r2/default/images/1776439718336-08f59206-0426-474e-b8d8-3ca2581d358d.jpg" 
                    alt="Ebook Cover" 
                    className="w-full h-full object-cover rounded-xl"
                  />
                </motion.div>
                <div className="absolute -bottom-6 w-full h-12 bg-black/50 blur-xl rounded-full"></div>
              </div>

              {/* Ebook Details */}
              <div className="w-full md:w-2/3 space-y-6 relative z-10">
                <div>
                   <h3 className="text-3xl font-bold text-white mb-2">The Ultimate Graphic Design Guide</h3>
                   <div className="flex items-center gap-3">
                     <span className="text-2xl font-bold text-gray-500 line-through">BDT 250</span>
                     <span className="text-4xl font-black text-emerald-400">FREE</span>
                     <span className="px-3 py-1 bg-red-500/20 text-red-400 text-xs font-bold uppercase tracking-wider rounded-md border border-red-500/30">Limited Time Offer</span>
                   </div>
                </div>
                
                <p className="text-gray-400 text-base leading-relaxed">
                  কোর্স ছাড়াও যারা সেলফ-স্টাডি করে ডিজাইনে প্রো হতে চান, তাদের জন্য তৈরি করা এই ই-বুক। এখানে রয়েছে রিয়েল লাইফ প্রজেক্টের ব্রেকডাউন এবং এক্সক্লুসিভ টিপস।
                </p>

                <ul className="space-y-3">
                  {[
                    "Color Theory & Typography Mastery",
                    "Client Communication & Branding Guidelines",
                    "AI Tool Prompts for Quick Generation"
                  ].map((feat, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-gray-300 font-medium">
                      <div className="w-5 h-5 rounded-full bg-fuchsia-500/20 flex items-center justify-center text-fuchsia-400">
                        <Check size={12} />
                      </div>
                      {feat}
                    </li>
                  ))}
                </ul>

                <div className="pt-4 flex flex-col sm:flex-row gap-4">
                  <motion.button 
                    whileHover={{ scale: 1.05 }} 
                    whileTap={{ scale: 0.95 }} 
                    onClick={() => setActiveFullReaderBook({title: "The Ultimate Graphic Design Guide", pdfId: "1EeI7kGc0NdzWszQn1Cd6nEagjEOLdChv"})}
                    className="flex-1 bg-gradient-to-r from-fuchsia-600 to-pink-500 text-white px-6 py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-[0_10px_30px_rgba(217,70,239,0.3)] transition-all"
                  >
                    <Wallet size={18} /> ফ্রীতে পড়ুন
                  </motion.button>

                  <motion.button 
                    whileHover={{ scale: 1.05 }} 
                    whileTap={{ scale: 0.95 }} 
                    onClick={() => setActivePreviewBook({title: "The Ultimate Graphic Design Guide", pdfId: "1EeI7kGc0NdzWszQn1Cd6nEagjEOLdChv"})}
                    className="flex-1 bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:from-[#20bd5a] hover:to-[#0f776a] border-none text-white px-6 py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-[0_10px_30px_rgba(37,211,102,0.3)] transition-all"
                  >
                    <BookOpen size={18} /> Read a little first
                  </motion.button>
                </div>
              </div>
            </div>
          </section>

          {/* Section: Islamic Ebooks (Self-Improvement Resources) */}
          <section id="islamic-ebooks" className="w-full max-w-5xl mx-auto pt-16 scroll-mt-24">
            <SectionBadge text="Self-Improvement Resources" />
            <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">Islamic eBooks Collection</h2>
            <p className="text-gray-400 max-w-3xl leading-relaxed text-lg mb-12">
              জীবন গড়ার নির্দেশিকা এবং অনুপ্রেরণামূলক ইসলামিক বইয়ের সংগ্রহ। সম্পূর্ণ ফ্রিতে পড়াশোনা করুন।
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {islamicEbooks.map((book, idx) => (
                <div key={idx} className="bg-[#121626] border border-[#262c43] rounded-[2rem] p-6 shadow-xl flex flex-col items-center text-center group hover:bg-[#161a2b] transition-colors relative overflow-hidden">
                  
                  {/* Internal Glow on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-fuchsia-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>

                  <div className="w-full aspect-[3/4] max-w-[200px] mb-6 relative perspective-1000 z-10">
                    <motion.div 
                      whileHover={{ rotateY: 10, scale: 1.05 }}
                      className="w-full h-full rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] transform-style-3d cursor-pointer"
                    >
                      <img 
                        src={book.imgUrl} 
                        alt={book.title} 
                        className="w-full h-full object-cover rounded-xl border border-white/5"
                        referrerPolicy="no-referrer"
                      />
                    </motion.div>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-3 min-h-[56px] flex items-center justify-center z-10">{book.title}</h3>
                  
                  <div className="flex justify-center items-center gap-2 mb-6 z-10">
                    <span className="text-sm font-bold text-gray-500 line-through">BDT {book.originalPrice}</span>
                    <span className="text-xl font-black text-emerald-400">FREE</span>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 w-full mt-auto z-10">
                    <motion.button 
                      whileHover={{ scale: 1.03 }} 
                      whileTap={{ scale: 0.97 }} 
                      onClick={() => setActiveFullReaderBook({ title: book.title, pdfId: book.pdfId })}
                      className="flex-[2] bg-gradient-to-r from-fuchsia-600 to-pink-500 text-white py-3 px-2 rounded-xl font-bold flex items-center justify-center gap-2 shadow-[0_5px_15px_rgba(217,70,239,0.3)] transition-all text-sm"
                    >
                      <Wallet size={16} /> Read Full
                    </motion.button>

                    <motion.button 
                      whileHover={{ scale: 1.03 }} 
                      whileTap={{ scale: 0.97 }} 
                      onClick={() => setActivePreviewBook({ title: book.title, pdfId: book.pdfId })}
                      className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-white py-3 px-2 rounded-xl font-bold flex items-center justify-center gap-2 transition-all text-sm"
                    >
                      Preview
                    </motion.button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section 6: FAQ */}
          <section id="faq" className="w-full max-w-4xl mx-auto pt-10 scroll-mt-24">
             <SectionBadge text="Common Questions" />
             <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">Frequently Asked Questions</h2>
             <p className="text-gray-400 max-w-3xl leading-relaxed text-lg mb-12">
               এই অংশটি hesitation কমায়, তাই conversion-এর জন্য খুবই important!
             </p>
             <div className="space-y-3">
                {faqs.map((faq, idx) => (
                  <Accordion key={idx} title={faq} idx={idx} />
                ))}
             </div>
          </section>

          {/* Section 7: Enrolment Open CTA */}
          <section className="w-full max-w-5xl mx-auto pt-16 pb-12">
             <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-gradient-to-b from-[#121626] to-[#0a0c10] border border-[#262c43] rounded-[2.5rem] p-10 lg:p-16 text-center flex flex-col items-center shadow-2xl relative overflow-hidden"
             >
                 {/* Internal Glow for CTA */}
                 <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[500px] h-[300px] bg-violet-600/10 blur-[100px] rounded-full pointer-events-none"></div>
                 
                 <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/10 mb-8 relative z-10">
                   <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)] animate-pulse"></span>
                   <span className="text-xs font-semibold text-gray-300">Enrollment Open Now</span>
                 </div>
                 
                 <p className="text-xl lg:text-2xl text-gray-200 leading-relaxed max-w-3xl font-medium mb-10 relative z-10">
                   আপনি যদি serious হয়ে স্কিল শিখতে চান এবং শুধু random tutorial না দেখে structured roadmap follow করতে চান — তাহলে এটি আপনার জন্য strong starting point হতে পারে!
                 </p>
                 
                 <div className="flex flex-wrap items-center justify-center gap-4 relative z-10">
                   <motion.button 
                     whileHover={{ scale: 1.05 }} 
                     whileTap={{ scale: 0.95 }} 
                     onClick={() => navigate('/enroll')}
                     className="bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white px-8 py-3.5 rounded-full font-semibold shadow-[0_0_20px_rgba(139,92,246,0.4)]"
                   >
                     Secure Your Seat
                   </motion.button>
                   <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="bg-transparent hover:bg-[#1a1f33] border border-[#262c43] text-white px-8 py-3.5 rounded-full font-semibold transition-colors">
                     Join করার আগে জিজ্ঞেস করুন
                   </motion.button>
                 </div>
             </motion.div>
          </section>

          {/* Section 8: Resources & Inspiration (NEW) */}
          <section id="resources" className="py-20 md:py-32 relative">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[800px] h-[500px] bg-violet-600/5 blur-[120px] rounded-full pointer-events-none"></div>
             
             <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="text-center mb-16 md:mb-24">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
                    <Sparkles className="w-4 h-4 text-violet-400" />
                    <span className="text-sm font-semibold tracking-wide text-gray-300">Designer's Toolkit</span>
                  </div>
                  <h2 className="text-3xl md:text-5xl font-black text-white mb-6 uppercase tracking-tighter">
                    Essential <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-500">Resources</span>
                  </h2>
                  <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                    A curated list of top Chrome extensions and design websites to supercharge your workflow and keep you inspired.
                  </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
                  {/* Chrome Extensions */}
                  <div>
                    <div className="flex items-center gap-3 mb-8">
                       <div className="w-10 h-10 rounded-xl bg-[#262c43] flex items-center justify-center border border-white/10">
                         <Component className="w-5 h-5 text-gray-300" />
                       </div>
                       <h3 className="text-2xl font-bold">10 Essential Extensions</h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {chromeExtensions.map((ext, index) => (
                        <motion.a 
                          key={index}
                          href={ext.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ scale: 1.03, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          className="group bg-[#121626] border border-[#262c43] hover:border-violet-500/50 p-4 rounded-2xl flex items-center gap-4 transition-colors relative overflow-hidden"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-violet-500/0 via-violet-500/0 to-violet-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                          <div className="w-12 h-12 rounded-xl bg-[#1a1f33] group-hover:bg-violet-500/20 text-gray-400 group-hover:text-violet-400 flex items-center justify-center transition-colors">
                            {ext.icon}
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-200 group-hover:text-white transition-colors">{ext.name}</h4>
                            <span className="text-xs text-violet-400 opacity-0 group-hover:opacity-100 transition-opacity absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1">
                              Get <ExternalLink size={12} />
                            </span>
                          </div>
                        </motion.a>
                      ))}
                    </div>
                  </div>

                  {/* Websites & Inspiration */}
                  <div>
                    <div className="flex items-center gap-3 mb-8">
                       <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-fuchsia-600/20 to-pink-500/20 flex items-center justify-center border border-fuchsia-500/30">
                         <Star className="w-5 h-5 text-fuchsia-400" />
                       </div>
                       <h3 className="text-2xl font-bold">Design Resources</h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {designWebsites.map((site, index) => (
                        <motion.a 
                          key={index}
                          href={site.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ scale: 1.03, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          className="group bg-[#121626] border border-[#262c43] hover:border-fuchsia-500/50 p-4 rounded-2xl flex items-center gap-4 transition-colors relative overflow-hidden"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-500/0 via-fuchsia-500/0 to-fuchsia-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                          <div className="w-12 h-12 rounded-xl bg-[#1a1f33] group-hover:bg-fuchsia-500/20 text-gray-400 group-hover:text-fuchsia-400 flex items-center justify-center transition-colors">
                            {site.icon}
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-200 group-hover:text-white transition-colors">{site.name}</h4>
                            <span className="text-xs text-fuchsia-400 opacity-0 group-hover:opacity-100 transition-opacity absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1">
                              Visit <ExternalLink size={12} />
                            </span>
                          </div>
                        </motion.a>
                      ))}
                    </div>
                  </div>
                </div>
             </div>
          </section>

        </div>
      </main>

      {/* Mobile Bottom Navigation (Android App Feel) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-[60] px-4 pb-6 pt-2 pointer-events-none">
        <div className="bg-[#121626]/90 backdrop-blur-xl border border-white/10 rounded-3xl flex items-center justify-around py-3 px-2 shadow-2xl pointer-events-auto">
          {[
            { id: "overview", icon: <Layers className="w-5 h-5" />, label: "Overview" },
            { id: "curriculum", icon: <BookOpen className="w-5 h-5" />, label: "Lessons" },
            { id: "faq", icon: <Component className="w-5 h-5" />, label: "Help" },
          ].map((nav) => (
            <motion.a 
              key={nav.id}
              href={`#${nav.id}`}
              whileTap={{ scale: 0.9 }}
              className="flex flex-col items-center gap-1 text-gray-400 hover:text-white transition-colors px-4"
            >
              {nav.icon}
              <span className="text-[10px] font-bold uppercase tracking-wider">{nav.label}</span>
            </motion.a>
          ))}
          <motion.a 
            href="https://wa.me/8801819235331"
            whileTap={{ scale: 0.9 }}
            className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#25D366] to-[#128C7E] flex items-center justify-center shadow-lg border border-white/20"
          >
            <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
          </motion.a>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#05060a] border-t border-[#262c43] py-16 text-center text-gray-400 text-sm">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center gap-4">
          <p className="text-gray-300">© 2026 Advanced Graphic Design Course - Bismahsoft Academy. All rights reserved.</p>
          <p className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
            <span>For web development service:</span>
            <a 
              href="https://bismahsoftbd.vercel.app/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-violet-400 hover:text-fuchsia-400 transition-colors underline underline-offset-4 font-medium"
            >
              Bismahsoft Ltd
            </a>
          </p>
        </div>
      </footer>

      {/* Ebook Preview Modal (Limited Pages) */}
      <AnimatePresence>
        {activePreviewBook && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActivePreviewBook(null)}
              className="absolute inset-0 bg-[#000000]/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#121626] border border-[#262c43] w-full max-w-5xl h-full max-h-[85vh] rounded-[2rem] shadow-2xl relative flex flex-col overflow-hidden z-10"
              onContextMenu={handleContextMenu}
            >
              <div className="flex items-center justify-between p-6 border-b border-[#262c43] bg-[#0d1017]">
                 <div>
                    <h3 className="font-bold text-white text-xl uppercase tracking-tighter italic">Preview: {activePreviewBook.title}</h3>
                    <p className="text-sm text-gray-400">Read first 5-6 pages (Table of Contents & Intro)</p>
                 </div>
                 <button 
                  onClick={() => setActivePreviewBook(null)}
                  className="w-10 h-10 bg-white/5 hover:bg-white/10 rounded-full flex items-center justify-center transition-colors"
                 >
                   <Minus className="w-5 h-5 text-gray-400 cursor-pointer rotate-45" />
                 </button>
              </div>
              
              <div className="flex-1 w-full bg-[#121626] relative overflow-hidden">
                 {/* Limited View Container */}
                 <div className="w-full h-full overflow-y-auto overflow-x-hidden relative">
                    <div className="w-full relative h-[4500px] overflow-hidden"> {/* Height restricted to ~6 pages */}
                       <iframe 
                         src={`https://drive.google.com/file/d/${activePreviewBook.pdfId}/preview`} 
                         className="absolute -top-[52px] left-0 w-full h-[calc(100%+52px)] border-none pointer-events-auto" 
                         allow="autoplay"
                         title="Ebook Preview"
                       ></iframe>
                       {/* Invisible Security Shields to block interaction with the toolbar area */}
                       <div className="absolute top-0 left-0 w-full h-12 z-50 bg-transparent pointer-events-auto"></div>
                       <div className="absolute top-0 right-0 w-16 h-full z-50 bg-transparent pointer-events-auto"></div>
                    </div>
                    {/* Visual Cut-off Message */}
                    <div className="sticky bottom-0 left-0 right-0 bg-gradient-to-t from-[#121626] via-[#121626] to-transparent py-20 px-8 text-center z-40 border-t border-white/5">
                        <h4 className="text-xl font-bold text-white mb-2 italic">Want to read more?</h4>
                        <p className="text-gray-400 text-sm mb-6">সংক্ষেপিত প্রিভিউ শেষ হয়েছে। সম্পূর্ণ বইটি পড়তে "ফ্রীতে পড়ুন" বাটনে ক্লিক করুন।</p>
                        <motion.button 
                          whileHover={{ scale: 1.05 }} 
                          whileTap={{ scale: 0.95 }} 
                          onClick={() => {
                            const book = activePreviewBook;
                            setActivePreviewBook(null);
                            setActiveFullReaderBook(book);
                          }}
                          className="bg-gradient-to-r from-fuchsia-600 to-pink-500 text-white px-8 py-3 rounded-full font-bold shadow-lg"
                        >
                          Unlock Full Screen View
                        </motion.button>
                    </div>
                 </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Ebook Full Reader (Free Access) */}
      <AnimatePresence>
        {activeFullReaderBook && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[200] bg-[#0d1017] flex flex-col overflow-hidden"
            onContextMenu={handleContextMenu}
          >
            {/* Reader Header */}
            <div className="h-16 md:h-20 bg-[#121626] border-b border-[#262c43] flex items-center justify-between px-6 z-50">
               <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setActiveFullReaderBook(null)}
                    className="p-2 hover:bg-white/5 rounded-xl transition-colors text-gray-400 hover:text-white"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <div>
                    <h3 className="font-bold text-white text-base md:text-lg leading-tight uppercase italic flex items-center gap-2">
                       <BookOpen size={18} className="text-fuchsia-400" /> {activeFullReaderBook.title}
                    </h3>
                    <p className="text-[10px] text-gray-500 font-bold tracking-[0.2em] uppercase">Bismahsoft Academy Premium</p>
                  </div>
               </div>
               <div className="flex items-center gap-3">
                  <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                     <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                     <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Free Access Granted</span>
                  </div>
                  <button 
                    onClick={() => setActiveFullReaderBook(null)}
                    className="w-10 h-10 bg-white/5 hover:bg-white/10 rounded-full flex items-center justify-center transition-colors"
                  >
                    <Minus className="w-5 h-5 text-gray-400 rotate-45" />
                  </button>
               </div>
            </div>

            {/* Reader Body */}
            <div className="flex-1 relative bg-[#05060a] overflow-hidden">
               {/* Shifted Iframe to hide original Drive toolbar (top ~52px) */}
               <iframe 
                 src={`https://drive.google.com/file/d/${activeFullReaderBook.pdfId}/preview`} 
                 className="absolute -top-[52px] left-0 w-full h-[calc(100%+52px)] border-none" 
                 allow="autoplay"
                 title="Full Ebook Viewer"
               ></iframe>

               {/* Invisible Security Shields: Completely transparent but blocks clicks to specific hidden UI areas */}
               <div className="absolute top-0 left-0 w-full h-16 z-[60] bg-transparent pointer-events-auto cursor-default"></div>
               <div className="absolute top-0 right-0 w-20 h-full z-[60] bg-transparent pointer-events-auto cursor-default"></div>
               
               {/* Privacy Curtain for Screenshot Protection */}
               <AnimatePresence>
                 {isPrivacyActive && (
                   <motion.div 
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     exit={{ opacity: 0 }}
                     className="absolute inset-0 z-[100] bg-black flex flex-col items-center justify-center p-8 text-center"
                   >
                     <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mb-6 border border-red-500/20">
                        <Minus className="w-8 h-8 text-red-500 rotate-45" />
                     </div>
                     <h4 className="text-2xl font-black text-white mb-2 uppercase italic tracking-tighter italic">Security Alert</h4>
                     <p className="text-gray-400 text-sm max-w-xs leading-relaxed">
                        প্রাইভেসি সুরক্ষায় স্ক্রিনশট বা অন্য কোনোভাবে কপি করা নিষিদ্ধ। <br />
                        <span className="text-violet-400 font-bold mt-2 inline-block italic">Please return focus to the website to continue reading.</span>
                     </p>
                   </motion.div>
                 )}
               </AnimatePresence>

               {/* Watermark Overlay: Optimized for visibility on all backgrounds */}
               <div className="absolute inset-0 pointer-events-none z-40 flex items-center justify-center select-none overflow-hidden opacity-[0.08]">
                  <div className="rotate-45 space-y-24">
                     {[1, 2, 3, 4, 5].map((row) => (
                       <div key={row} className="flex gap-24 whitespace-nowrap">
                          {[1, 2, 3].map((col) => (
                            <span key={col} className="text-[6vw] font-black text-violet-500 uppercase tracking-widest italic drop-shadow-sm">
                               BISMAHSOFT ACADEMY
                            </span>
                          ))}
                       </div>
                     ))}
                  </div>
               </div>
            </div>
            
            {/* Footer Status Bar */}
            <div className="h-10 bg-[#0d1017] border-t border-[#262c43] flex items-center justify-center px-6">
               <p className="text-[10px] text-gray-600 font-medium tracking-[0.1em] text-center">
                  © 2026 Bismahsoft Academy · No unauthorized distribution or downloads allowed.
               </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/enroll" element={<EnrollmentPage />} />
        <Route path="/assessment" element={<AssessmentPage />} />
      </Routes>
    </Router>
  );
}

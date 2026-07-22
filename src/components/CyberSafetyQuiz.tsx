import React, { useState } from 'react';
import { 
  Shield, 
  HelpCircle, 
  Award, 
  RefreshCw, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Sparkles, 
  BookOpen, 
  ChevronRight, 
  ShieldCheck, 
  Trophy, 
  Activity, 
  PhoneCall, 
  Share2 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Question {
  id: number;
  category: 'DIGITAL_ARREST' | 'PART_TIME_JOB' | 'PHISHING' | 'BANK_FRAUD' | 'UPI_SCAM';
  difficulty: 'MEDIUM' | 'HIGH' | 'CRITICAL';
  scenario: string;
  context: string;
  options: {
    text: string;
    isSafe: boolean;
    points: number;
    feedback: string;
  }[];
}

const quizQuestions: Question[] = [
  {
    id: 1,
    category: 'DIGITAL_ARREST',
    difficulty: 'CRITICAL',
    scenario: "You receive a call from an unknown number claiming to be a Customs Officer at Mumbai Airport. They claim a parcel containing narcotics (MDMA) was found under your Aadhaar number, and they must immediately transfer you to a Skype video call with CBI Inspectors for a 'Digital Arrest' statement in an isolated room.",
    context: "They sound highly authoritative, cite official-sounding penal codes, and threaten immediate 5-year imprisonment if you hang up or contact anyone.",
    options: [
      {
        text: "Cooperate fully, go to a quiet room, log into Skype, and follow all instructions to clear your name.",
        isSafe: false,
        points: 0,
        feedback: "🚨 UNSAFE ACTION! This is the classic signature of a Digital Arrest scam. Law enforcement agencies or government officers NEVER conduct arrests, record official statements, or issue judicial warrants over Skype/WhatsApp video calls. Cooperating puts you at risk of severe psychological coercion and financial theft."
      },
      {
        text: "Tell them you will cooperate but will only record statements at your nearest physical police station, hang up, and report the caller to Sanchar Saathi / Syp-helpline.",
        isSafe: true,
        points: 20,
        feedback: "🛡️ AEGIS DEFENSE ACTION! Perfect response. Any authentic officer will gladly agree to official procedures at a physical police station. Demanding physical protocol instantly disarms digital arrest impostors. Hanging up and reporting the number prevents further contact."
      },
      {
        text: "Panic and immediately transfer money to the 'safe clearance account' they mention to prove your innocence while on the phone.",
        isSafe: false,
        points: 0,
        feedback: "🚨 CRITICAL VULNERABILITY! Never transfer money under duress. Government agencies do not have 'verification accounts' or ask you to deposit money to prove innocence. Once transferred, retrieving funds is extremely difficult."
      }
    ]
  },
  {
    id: 2,
    category: 'PART_TIME_JOB',
    difficulty: 'HIGH',
    scenario: "A recruiter contacts you on WhatsApp from an international country code offering a flexible 'Youtube video liking job' that pays ₹150 for 3 simple likes. After you like the videos, they instantly pay you ₹150 via UPI. Then, they invite you to join a Telegram VIP channel for higher paying 'crypto investment task' commissions.",
    context: "They ask you to pay a ₹5,000 security deposit first to release your next task which pays ₹15,000.",
    options: [
      {
        text: "Accept the ₹150 trust payout, but immediately block the recruiter and exit/ignore any Telegram invitation requesting deposits.",
        isSafe: true,
        points: 20,
        feedback: "🛡️ AEGIS DEFENSE ACTION! Outstanding vigilance. Scammers intentionally send minor payouts to build trust. Recognizing the bait and cutting off contact before the 'deposit task' prevents major financial losses."
      },
      {
        text: "Pay the ₹5,000 deposit. They already proved they pay by transferring ₹150, so it is safe to proceed for larger gains.",
        isSafe: false,
        points: 0,
        feedback: "🚨 UNSAFE ACTION! This is a Part-time Job task scam. Once you pay the ₹5,000, they will show fake profits in a web panel but demand progressively larger deposits (₹20,000, ₹50,000) to 'unlock' and withdraw your money, eventually locking you out entirely."
      },
      {
        text: "Argue with them on the Telegram group, demanding they pay the ₹15,000 commission first without any deposit.",
        isSafe: false,
        points: 5,
        feedback: "⚠️ CAUTION! While you avoided paying, interacting with scammers in organized groups is risky. They may use social engineering, fake proof from other group members (who are bots or co-conspirators), or doxing to pressure you."
      }
    ]
  },
  {
    id: 3,
    category: 'PHISHING',
    difficulty: 'MEDIUM',
    scenario: "You receive an SMS from a standard 10-digit mobile number claiming to be 'IndiaPost'. It states: 'Your package has arrived at our sorting facility but cannot be delivered due to an incomplete address. Please update your house number within 24 hours at ind-post-verify-cargo.org to prevent return to sender.'",
    context: "The linked page looks identical to the official IndiaPost website and requests your address along with a minor delivery fee of ₹25.",
    options: [
      {
        text: "Click the link, enter your address, and enter your credit card details to pay the minor ₹25 fee to secure your parcel.",
        isSafe: false,
        points: 0,
        feedback: "🚨 UNSAFE ACTION! This is a phishing attack. The website is a forged duplicate. Entering your card details allows scammers to capture your card token and initiate massive fraudulent OTP requests, or install SMS redirect malware on your phone."
      },
      {
        text: "Ignore the SMS entirely and block the sender. If expecting a real package, manually check the tracking status on the official indiapost.gov.in portal.",
        isSafe: true,
        points: 20,
        feedback: "🛡️ AEGIS DEFENSE ACTION! Flawless defense. Official departments always send notifications via verified headers (e.g. IN-IPOST) and use official '.gov.in' or '.nic.in' domains. Checking the official portal directly keeps your data safe."
      },
      {
        text: "Reply to the SMS with your correct address to help them out.",
        isSafe: false,
        points: 5,
        feedback: "⚠️ CAUTION! Replying to spam SMS signals that your number is active, which will trigger an influx of targeted scam calls and extortion attempts."
      }
    ]
  },
  {
    id: 4,
    category: 'BANK_FRAUD',
    difficulty: 'HIGH',
    scenario: "A person claiming to be a Senior executive from your bank's technical support department calls you. They state that your mobile banking app will be deactivated in 30 minutes due to a security update. To complete the update, they request you to download a remote-assistance app like 'AnyDesk' or 'TeamViewer' and read them the 9-digit code.",
    context: "They tell you to keep the app open while they configure the updates on your device.",
    options: [
      {
        text: "Quickly download the remote app as instructed so you don't lose access to your bank account.",
        isSafe: false,
        points: 0,
        feedback: "🚨 UNSAFE ACTION! This is a remote-control scam. Sharing the AnyDesk or TeamViewer code allows the caller to fully control your phone, view your SMS OTPs, open your banking apps, and steal your money right in front of your eyes."
      },
      {
        text: "Decline, hang up, and call your bank's official customer support number listed on the physical bank card or official portal to verify.",
        isSafe: true,
        points: 20,
        feedback: "🛡️ AEGIS DEFENSE ACTION! Excellent. Banks NEVER ask you to install third-party screen-sharing apps or remote software. Cross-verifying using contact details from official printed cards prevents phone takeover."
      },
      {
        text: "Tell them the app is downloaded but read them a fake 9-digit code to waste their time.",
        isSafe: false,
        points: 10,
        feedback: "⚠️ CAUTION! Wasting the scammer's time can be satisfying, but staying on the line allows them to keep trying social engineering or capture other metadata. Hanging up instantly is the recommended safety practice."
      }
    ]
  },
  {
    id: 5,
    category: 'UPI_SCAM',
    difficulty: 'MEDIUM',
    scenario: "You put up an old bicycle for sale on OLX. A buyer contacts you immediately, expresses high interest, and claims they want to pay you the full ₹8,000 price instantly. They send you a UPI QR code screenshot on WhatsApp and instruct you to: 'Open PhonePe, scan this QR code, and enter your UPI PIN to claim the payment.'",
    context: "They tell you that scanning is a mandatory clearance step required for business accounts to transfer money.",
    options: [
      {
        text: "Scan the QR code and input your secure UPI PIN so the money is deposited into your account.",
        isSafe: false,
        points: 0,
        feedback: "🚨 UNSAFE ACTION! This is the 'Receive Money PIN' scam. Scanning a QR code and entering your UPI PIN always DEBITS money from your account. You NEVER need to scan a code or enter a PIN to receive payments. Doing so immediately steals ₹8,000 from you."
      },
      {
        text: "Refuse to scan, tell them you only accept cash or direct UPI transfers to your phone number, and block them.",
        isSafe: true,
        points: 20,
        feedback: "🛡️ AEGIS DEFENSE ACTION! Smart awareness. QR codes and UPI PIN entries are strictly for outgoing transfers. Refusing QR scanning and demanding physical cash or standard peer-to-peer phone number transfers blocks the theft."
      }
    ]
  }
];

export default function CyberSafetyQuiz() {
  const [started, setStarted] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [answersHistory, setAnswersHistory] = useState<{
    scenario: string;
    category: string;
    selectedText: string;
    wasCorrect: boolean;
    points: number;
    feedback: string;
  }[]>([]);

  const activeQuestion = quizQuestions[currentIdx];

  const handleStart = () => {
    setStarted(true);
    setCurrentIdx(0);
    setSelectedOpt(null);
    setSubmitted(false);
    setScore(0);
    setCompleted(false);
    setAnswersHistory([]);
  };

  const handleSubmitAnswer = () => {
    if (selectedOpt === null) return;
    setSubmitted(true);
    const option = activeQuestion.options[selectedOpt];
    const earnedPoints = option.points;
    setScore(prev => prev + earnedPoints);

    setAnswersHistory(prev => [
      ...prev,
      {
        scenario: activeQuestion.scenario,
        category: activeQuestion.category,
        selectedText: option.text,
        wasCorrect: option.isSafe,
        points: earnedPoints,
        feedback: option.feedback
      }
    ]);
  };

  const handleNext = () => {
    if (currentIdx < quizQuestions.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setSelectedOpt(null);
      setSubmitted(false);
    } else {
      setCompleted(true);
    }
  };

  const getSafetyRank = (finalScore: number) => {
    if (finalScore >= 90) return { title: "Aegis Cyber Marshal", desc: "You have master-level awareness of modern cyber scams. You are virtually immune to digital arrest and financial extortion!", color: "text-cyan-400 border-cyan-500 bg-cyan-950/20", icon: "🎖️" };
    if (finalScore >= 60) return { title: "Vigilant Cyber Guard", desc: "You possess good cyber awareness. You can spot standard phishing and job task frauds, but keep sharpening your shield!", color: "text-emerald-400 border-emerald-500 bg-emerald-950/20", icon: "🛡️" };
    return { title: "Vulnerable Citizen", desc: "Caution! You are highly vulnerable to authoritarian digital arrests and financial baits. Please read our Scam Prevention academy carefully!", color: "text-rose-400 border-rose-500 bg-rose-950/20", icon: "⚠️" };
  };

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'DIGITAL_ARREST': return '🚨 Digital Arrest Scam';
      case 'PART_TIME_JOB': return '💼 Youtube Job Task Scam';
      case 'PHISHING': return '🔗 SMS Delivery Phishing';
      case 'BANK_FRAUD': return '📞 Remote Screen Scam';
      case 'UPI_SCAM': return '💸 UPI QR Money Trap';
      default: return '⚠️ Cyber Threat';
    }
  };

  const rankInfo = getSafetyRank(score);

  return (
    <div className="flex-1 flex flex-col p-6 max-w-4xl mx-auto w-full">
      {/* Header Panel */}
      <div className="border-b border-blue-900/10 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 shrink-0 text-left">
        <div>
          <h2 className="text-md font-display font-bold text-slate-100 flex items-center gap-2 uppercase tracking-wide">
            <Sparkles className="w-5 h-5 text-cyan-400 animate-pulse" />
            Interactive Cyber Defense Arena
          </h2>
          <p className="text-xs text-slate-400 mt-1 font-sans">
            Test your survival readiness against realistic Indian social-engineering scams, evaluate your risk score, and earn official MHA-Aegis certification.
          </p>
        </div>
        <span className="text-[9px] font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 px-2 py-0.5 rounded font-extrabold uppercase tracking-widest self-start sm:self-auto">
          MHA TRAINING HUB
        </span>
      </div>

      <AnimatePresence mode="wait">
        {!started ? (
          /* Start Screen */
          <motion.div
            key="start-screen"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="glass rounded-2xl p-6 md:p-8 text-center border border-blue-900/20 bg-[#020509]/30 relative overflow-hidden glow-blue flex flex-col items-center justify-center space-y-6 min-h-[480px]"
          >
            {/* Cyber Grid Background */}
            <div className="absolute inset-0 bg-[radial-gradient(rgba(6,182,212,0.03)_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
            
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center relative animate-pulse">
                <Shield className="w-10 h-10 text-cyan-400" />
                <Trophy className="w-5 h-5 text-yellow-400 absolute bottom-1 right-1" />
              </div>
            </div>

            <div className="space-y-2 max-w-lg">
              <h3 className="text-lg font-display font-black text-white uppercase tracking-wider">Aegis Public Awareness Drill</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                Indian citizens are being targeted heavily by organized syndicates using fake police stations, Skype video interrogations, and fraudulent investment tasks. This tactical interactive simulator prepares you to respond correctly in critical moments.
              </p>
            </div>

            {/* Quick stats / drill info */}
            <div className="grid grid-cols-3 gap-4 max-w-md w-full bg-[#03060b] border border-slate-900 p-4 rounded-xl text-center">
              <div>
                <span className="text-[8.5px] text-slate-500 font-mono block">DRILL UNITS</span>
                <span className="text-xs font-mono font-black text-cyan-400 mt-0.5 block">5 SCENARIOS</span>
              </div>
              <div className="border-x border-slate-900">
                <span className="text-[8.5px] text-slate-500 font-mono block">PASSING SCORE</span>
                <span className="text-xs font-mono font-black text-emerald-400 mt-0.5 block">60% MIN</span>
              </div>
              <div>
                <span className="text-[8.5px] text-slate-500 font-mono block">CERTIFICATION</span>
                <span className="text-xs font-mono font-black text-amber-400 mt-0.5 block">AVAILABLE</span>
              </div>
            </div>

            <button
              onClick={handleStart}
              className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold font-mono text-xs px-6 py-3 rounded-xl flex items-center gap-2.5 shadow-lg shadow-cyan-950/30 cursor-pointer transition-all border border-cyan-400/30 uppercase tracking-widest active:scale-95"
            >
              <Trophy className="w-4 h-4 text-yellow-300" />
              <span>START DRILL SIMULATOR</span>
            </button>
          </motion.div>
        ) : completed ? (
          /* Results and Certificate Screen */
          <motion.div
            key="results-screen"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6 text-left"
          >
            {/* Score Summary Card */}
            <div className="glass rounded-2xl p-6 border border-blue-900/20 bg-[#020509]/30 relative glow-blue grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-4 flex flex-col items-center justify-center text-center p-4 bg-slate-950/60 border border-slate-900 rounded-xl">
                <span className="text-[10px] text-slate-500 font-mono uppercase tracking-widest font-black">DRILL SCORE</span>
                <div className="relative my-4 flex items-center justify-center">
                  <div className="w-24 h-24 rounded-full border-4 border-slate-900 flex flex-col items-center justify-center">
                    <span className="text-3xl font-display font-black text-white">{score}</span>
                    <span className="text-[9px] text-slate-500 font-mono uppercase">OUT OF 100</span>
                  </div>
                  {score >= 60 && (
                    <div className="absolute -top-1 -right-1 bg-yellow-500 text-slate-950 p-1.5 rounded-full border border-black animate-bounce shadow-lg">
                      <Trophy className="w-4 h-4 font-black" />
                    </div>
                  )}
                </div>
                <div className={`px-3 py-1 rounded-full border text-[9px] font-mono font-black uppercase tracking-wider ${rankInfo.color}`}>
                  {rankInfo.icon} {rankInfo.title}
                </div>
              </div>

              <div className="md:col-span-8 space-y-3">
                <h3 className="text-md font-display font-black text-white uppercase tracking-wider flex items-center gap-2">
                  <Activity className="w-4 h-4 text-cyan-400 shrink-0" />
                  Forensic Performance Assessment
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  {rankInfo.desc}
                </p>
                <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
                  Aegis system analytics recommends reviewing scam vectors where mistakes were made. Real-world fraud groups operate with sophisticated psychology and tech—stay sharp, and never act out of panic.
                </p>

                <div className="pt-2 flex flex-wrap gap-2">
                  <button
                    onClick={handleStart}
                    className="bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 font-mono text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 cursor-pointer transition-all uppercase tracking-wider"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Retry Awareness Drill
                  </button>
                  <a
                    href="tel:1930"
                    className="bg-blue-600/10 hover:bg-blue-600/20 text-cyan-400 border border-blue-500/20 font-mono text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 cursor-pointer transition-all uppercase tracking-wider"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    Helpline: Dial 1930
                  </a>
                </div>
              </div>
            </div>

            {/* --- AEGIS HIGH-FIDELITY OFFICIAL CERTIFICATE OF VIGILANCE --- */}
            {score >= 60 && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0, transition: { delay: 0.3 } }}
                className="bg-[#050b16] border border-cyan-500/35 rounded-2xl p-6 md:p-8 relative overflow-hidden shadow-2xl shadow-cyan-950/20 glow-cyan font-serif text-center space-y-6 text-[#F3F4F6]"
              >
                {/* Visual Security Engraving Pattern / Guilloché Border Overlay */}
                <div className="absolute inset-2 border border-dashed border-cyan-500/20 rounded-xl pointer-events-none" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.06)_0%,transparent_70%)] pointer-events-none" />
                <div className="absolute top-4 left-4 text-cyan-600/35 font-mono text-[8px] uppercase tracking-widest pointer-events-none">AEGIS DIGITAL ENCLAVE</div>
                <div className="absolute bottom-4 right-4 text-cyan-600/35 font-mono text-[8px] uppercase tracking-widest pointer-events-none">CERT_ID: MHA-AEG-{(Math.random()*100000).toFixed(0)}</div>

                {/* Top Logo / Stamp */}
                <div className="flex flex-col items-center space-y-1 relative z-10">
                  <div className="w-12 h-12 rounded-full border border-cyan-500/30 flex items-center justify-center bg-[#010307]">
                    <ShieldCheck className="w-6 h-6 text-cyan-400" />
                  </div>
                  <span className="font-mono text-[8px] text-cyan-500 font-extrabold uppercase tracking-widest">MINISTRY OF HOME AFFAIRS</span>
                  <span className="font-mono text-[7px] text-slate-500 font-bold uppercase tracking-wider">NATIONAL DIGITAL CORE ARCHIVE</span>
                </div>

                {/* Main Text */}
                <div className="space-y-4 max-w-xl mx-auto relative z-10">
                  <h4 className="text-sm font-sans font-black text-cyan-400 uppercase tracking-widest">CERTIFICATE OF COGNITIVE SAFETY</h4>
                  <p className="text-[11px] text-slate-400 italic">
                    This is to officially recognize that the verified terminal user has successfully undergone and passed the
                  </p>
                  <p className="text-md font-sans font-extrabold text-white uppercase tracking-wider">
                    AEGIS CYBER FRAUD AWARENESS & DRILL PROTOCOL
                  </p>
                  <p className="text-[11.5px] text-slate-400 leading-relaxed font-sans max-w-md mx-auto">
                    Demonstrating an exceptional passing score of <strong className="text-cyan-400">{score}%</strong> in detecting, reporting, and disrupting digital arrests, task-based investment frauds, and metameric ink counterfeit banknotes.
                  </p>
                </div>

                {/* Stamp & Signatures */}
                <div className="grid grid-cols-2 gap-6 max-w-sm mx-auto pt-4 relative z-10 font-sans text-left">
                  <div className="text-center space-y-1">
                    <div className="h-[0.5px] bg-slate-800 w-full mb-1" />
                    <span className="text-[8px] text-cyan-400/80 font-mono uppercase tracking-wider block font-bold">CYBER SECURITY CELL</span>
                    <span className="text-[7.5px] text-slate-500 font-mono uppercase block">AEGIS DISRUPT TASK FORCE</span>
                  </div>
                  <div className="text-center space-y-1">
                    <div className="h-[0.5px] bg-slate-800 w-full mb-1" />
                    <span className="text-[8px] text-cyan-400/80 font-mono uppercase tracking-wider block font-bold">AUTOMATED DECREE BY</span>
                    <span className="text-[7.5px] text-slate-500 font-mono uppercase block">SECURE ENCLAVE ALGORITHMS</span>
                  </div>
                </div>

                <div className="text-center pt-2 relative z-10">
                  <div className="inline-flex items-center gap-1.5 text-[8.5px] font-mono text-cyan-500 font-black tracking-widest bg-cyan-500/5 border border-cyan-500/25 px-3 py-1 rounded">
                    🛡️ STATUS: DIGITAL IMMUNITY APPROVED
                  </div>
                </div>
              </motion.div>
            )}

            {/* Answer breakdown checklist */}
            <div className="space-y-3.5">
              <span className="text-[10px] text-slate-500 font-mono font-black uppercase tracking-wider block border-b border-slate-900 pb-1.5">
                Detailed Drill Scenario Log
              </span>
              <div className="space-y-3">
                {answersHistory.map((item, i) => (
                  <div key={i} className="bg-[#020509]/95 border border-blue-950 p-4 rounded-xl flex items-start gap-3">
                    <div className="shrink-0 mt-0.5">
                      {item.wasCorrect ? (
                        <div className="p-1 bg-emerald-500/10 border border-emerald-500/25 rounded-lg">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        </div>
                      ) : (
                        <div className="p-1 bg-rose-500/10 border border-rose-500/25 rounded-lg">
                          <XCircle className="w-4 h-4 text-rose-400" />
                        </div>
                      )}
                    </div>
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-950 pb-1.5">
                        <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">{getCategoryLabel(item.category)}</span>
                        <span className={`text-[8px] px-1.5 py-0.5 rounded font-mono font-bold tracking-wider uppercase ${
                          item.wasCorrect ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}>
                          {item.points} Points Earned
                        </span>
                      </div>
                      <p className="text-[11.5px] text-slate-300 font-sans leading-relaxed">{item.scenario}</p>
                      <div className="bg-black/40 border border-slate-950 p-3 rounded-lg text-[10.5px] leading-relaxed text-slate-400 font-sans">
                        <strong className="text-slate-300 block mb-1">Your choice:</strong>
                        <span>{item.selectedText}</span>
                      </div>
                      <p className="text-[10.5px] text-slate-400 leading-relaxed font-sans pt-1">
                        {item.feedback}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ) : (
          /* Active Question Step */
          <motion.div
            key={`question-${activeQuestion.id}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-5 text-left"
          >
            {/* Question Card */}
            <div className="glass rounded-2xl p-5 border border-blue-900/30 bg-[#020509]/30 relative glow-blue space-y-4">
              {/* Top info and progress bar */}
              <div className="flex items-center justify-between border-b border-blue-900/10 pb-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-cyan-400 font-black">
                    SCENARIO {currentIdx + 1} OF {quizQuestions.length}
                  </span>
                  <span className="text-[9px] bg-slate-950 border border-slate-900 px-2 py-0.5 rounded text-slate-500 font-mono font-black">
                    {getCategoryLabel(activeQuestion.category)}
                  </span>
                </div>
                
                <span className={`text-[8.5px] font-mono px-2 py-0.5 rounded border uppercase font-extrabold tracking-widest ${
                  activeQuestion.difficulty === 'CRITICAL' 
                    ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' 
                    : activeQuestion.difficulty === 'HIGH'
                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                }`}>
                  {activeQuestion.difficulty} THREAT
                </span>
              </div>

              {/* Progress bar line */}
              <div className="w-full bg-slate-950/80 h-1 rounded-full overflow-hidden">
                <div 
                  className="bg-cyan-400 h-full transition-all duration-300"
                  style={{ width: `${((currentIdx) / quizQuestions.length) * 100}%` }}
                />
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-display font-black text-white uppercase tracking-wider leading-relaxed">
                  {activeQuestion.scenario}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed font-sans italic bg-black/20 p-3 rounded-xl border border-slate-900/40">
                  <strong>Context:</strong> {activeQuestion.context}
                </p>
              </div>
            </div>

            {/* Answer Choices list */}
            <div className="space-y-3">
              <span className="text-[9px] text-slate-500 font-mono font-black uppercase tracking-wider block">
                Determine Defensive Counter-Measure:
              </span>

              <div className="space-y-2.5">
                {activeQuestion.options.map((opt, i) => {
                  const isSelected = selectedOpt === i;
                  return (
                    <button
                      key={i}
                      disabled={submitted}
                      onClick={() => setSelectedOpt(i)}
                      className={`w-full text-left p-4 rounded-xl border transition-all duration-200 cursor-pointer text-xs leading-relaxed font-sans font-medium relative ${
                        isSelected
                          ? submitted
                            ? opt.isSafe 
                              ? 'bg-emerald-950/25 border-emerald-500/50 text-emerald-400 font-bold'
                              : 'bg-rose-950/25 border-rose-500/50 text-rose-400 font-bold'
                            : 'bg-cyan-950/30 border-cyan-500 text-cyan-300 font-bold glow-border-cyan'
                          : 'bg-[#020509]/60 border-slate-900 hover:border-slate-800 text-slate-300'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span className={`w-5 h-5 rounded-full border flex items-center justify-center font-mono text-[10px] shrink-0 ${
                          isSelected ? 'bg-cyan-500 text-slate-950 border-cyan-500' : 'bg-slate-950 text-slate-500 border-slate-900'
                        }`}>
                          {String.fromCharCode(65 + i)}
                        </span>
                        <div className="flex-1 pr-4">{opt.text}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Submit & Navigation Footer */}
            <div className="flex items-center justify-between border-t border-slate-900 pt-4 mt-2">
              <div className="flex items-center gap-1 text-[10px] font-mono text-slate-500 uppercase">
                <Shield className="w-3.5 h-3.5 text-cyan-600 animate-pulse" />
                <span>DRILL STATUS: ENGAGED</span>
              </div>

              {!submitted ? (
                <button
                  disabled={selectedOpt === null}
                  onClick={handleSubmitAnswer}
                  className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold font-mono text-xs px-5 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer transition-all uppercase tracking-wider border border-blue-500/20 shadow-md shadow-blue-950/20"
                >
                  <span>Submit Counter-Measure</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold font-mono text-xs px-5 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer transition-all uppercase tracking-wider border border-cyan-400/20 shadow-md shadow-cyan-950/20 animate-fade-in"
                >
                  <span>{currentIdx < quizQuestions.length - 1 ? 'Next Scenario' : 'View Core Evaluation'}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Instant educational feedback area */}
            <AnimatePresence>
              {submitted && selectedOpt !== null && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-2xl border flex gap-3.5 items-start font-sans shadow-lg ${
                    activeQuestion.options[selectedOpt].isSafe
                      ? 'bg-emerald-950/15 border-emerald-500/30 text-emerald-400'
                      : 'bg-rose-950/15 border-rose-500/30 text-rose-400'
                  }`}
                >
                  <div className="shrink-0 mt-0.5">
                    {activeQuestion.options[selectedOpt].isSafe ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-rose-400 animate-pulse" />
                    )}
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <strong className="text-xs uppercase tracking-wide block font-display">
                      {activeQuestion.options[selectedOpt].isSafe ? '✔️ DEPLOYMENT MATCH APPROVED' : '🚨 CRITICAL VIGILANCE MISMATCH'}
                    </strong>
                    <p className="text-[11.5px] leading-relaxed opacity-95">
                      {activeQuestion.options[selectedOpt].feedback}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

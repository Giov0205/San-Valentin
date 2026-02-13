import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { intervalToDuration, differenceInDays, type Duration } from 'date-fns';
import { Heart, Timer, Frown, Sparkles, Flower2, Stars } from 'lucide-react';

// --- IMPORTACIÓN DE FOTOS ---
// Revisa que los nombres coincidan EXACTAMENTE (mayúsculas/minúsculas)
import miFoto1 from './assets/fotos/foto1.jpg';
import miFoto2 from './assets/fotos/foto2.jpg';
import miFoto3 from './assets/fotos/foto3.jpg';
import miFoto4 from './assets/fotos/foto4.jpg';

// Fecha: 30 de Noviembre, 2025
const START_DATE = new Date(2025, 10, 30); 

const TimeCounter = () => {
  // CORRECCIÓN TS: Inicializamos con ceros para que las propiedades existan
  const [duration, setDuration] = useState<Duration>({
    years: 0, months: 0, days: 0, hours: 0, minutes: 0, seconds: 0
  });
  const [totalDays, setTotalDays] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setDuration(intervalToDuration({ start: START_DATE, end: now }));
      setTotalDays(differenceInDays(now, START_DATE));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const TimeBox = ({ val, label }: { val: number | undefined, label: string }) => (
    <div className="flex flex-col items-center p-2 sm:p-3 w-14 sm:w-16 border-r last:border-r-0 border-rose-200/50">
      <span className="font-bold text-lg sm:text-xl text-rose-800">{val || 0}</span>
      <span className="text-[8px] sm:text-[9px] text-rose-400 uppercase tracking-widest">{label}</span>
    </div>
  );

  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-wrap justify-center mt-6 bg-white/40 backdrop-blur-md rounded-xl border border-white/60 shadow-sm py-2 px-4 font-body">
        {duration.years ? <TimeBox val={duration.years} label="Años" /> : null}
        {duration.months ? <TimeBox val={duration.months} label="Meses" /> : null}
        <TimeBox val={duration.days} label="Días" />
        <TimeBox val={duration.hours} label="Hrs" />
        <TimeBox val={duration.minutes} label="Min" />
        <TimeBox val={duration.seconds} label="Seg" />
      </div>
      <div className="mt-4 text-rose-500 text-[9px] font-bold tracking-[0.3em] opacity-70 uppercase">
        ( {totalDays} Días de pura magia )
      </div>
    </div>
  );
};

export default function App() {
  const [stage, setStage] = useState<'asking' | 'growing' | 'bloomed'>('asking');
  const [noBtnPos, setNoBtnPos] = useState({ x: 0, y: 0 });

  // Efecto de audio (Opcional: asegúrate de tener el mp3 en /public)
  useEffect(() => {
    if (stage === 'growing') {
      const audio = new Audio('/love-song.mp3');
      audio.volume = 0.4;
      audio.play().catch(() => console.log("Interacción requerida para audio"));
    }
  }, [stage]);

  const handleYes = () => {
    setStage('growing');
    setTimeout(() => setStage('bloomed'), 3500);
  };

  const moveNoButton = () => {
    const x = Math.random() * 150 - 75;
    const y = Math.random() * 150 - 75;
    setNoBtnPos({ x, y });
  };

  const sakuraFlowers = useMemo(() => {
    const colors = ['#ffb7b2', '#ff9a9e', '#fad0c4', '#e11d48', '#ffffff'];
    return [...Array(100)].map(() => ({
        x: (Math.random() * 380 - 190),
        y: (Math.random() * 320 - 160),
        s: Math.random() * 1.2 + 0.4,
        r: Math.random() * 360,
        d: Math.random() * 1.5,
        c: colors[Math.floor(Math.random() * colors.length)]
    }));
  }, []);

  return (
    <div className="min-h-screen bg-[#fdfbf7] flex flex-col items-center justify-center overflow-hidden relative p-4">
      <AnimatePresence mode="wait">
        {stage === 'asking' && (
          <motion.div
            key="asking"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.8 } }}
            className="bg-white/90 backdrop-blur-xl p-8 sm:p-12 rounded-[40px] shadow-2xl text-center max-w-lg z-50 border border-white"
          >
            <Flower2 className="mx-auto mb-6 text-rose-400" size={48} />
            <h1 className="font-lovely text-6xl sm:text-7xl text-rose-900 mb-2">Paula Daniela</h1>
            <h2 className="font-body text-gray-600 mb-10 tracking-[0.2em] uppercase text-xs font-bold">¿Quieres ser mi San Valentín?</h2>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center h-20">
              <motion.button
                whileHover={{ scale: 1.1 }} onClick={handleYes}
                className="bg-rose-500 text-white px-10 py-4 rounded-full font-bold shadow-lg flex items-center gap-3 z-10"
              >
                <Heart size={18} fill="currentColor" /> SÍ, QUIERO
              </motion.button>
              <motion.button
                animate={{ x: noBtnPos.x, y: noBtnPos.y }}
                onMouseEnter={moveNoButton} onClick={moveNoButton}
                className="bg-gray-100 text-gray-400 px-10 py-4 rounded-full border border-gray-200 absolute sm:relative"
              >
                <Frown size={18} /> No
              </motion.button>
            </div>
          </motion.div>
        )}

        {stage !== 'asking' && (
          <motion.div 
            key="tree-stage"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.5 }}
            className="relative w-full h-full flex flex-col items-center justify-end pb-10"
          >
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: stage === 'bloomed' ? 1 : 0, y: stage === 'bloomed' ? 0 : 40 }}
              transition={{ duration: 1.2 }}
              className="absolute top-[8%] sm:top-[12%] z-40 text-center w-full max-w-2xl px-4 flex justify-center items-center"
            >
              <div className="relative bg-white/80 backdrop-blur-md p-6 sm:p-10 rounded-[40px] shadow-xl border border-white/60 z-20 w-full max-w-md">
                {/* 4 FOTOS POLAROID */}
                <motion.div animate={{ opacity: stage === 'bloomed' ? 1 : 0 }} className="absolute -top-16 -left-16 w-24 h-32 bg-white p-1.5 shadow-2xl rotate-[-12deg] hidden md:block overflow-hidden border border-gray-100">
                  <img src={miFoto1} className="w-full h-full object-cover sepia-[0.2]" alt="1" />
                </motion.div>
                <motion.div animate={{ opacity: stage === 'bloomed' ? 1 : 0 }} className="absolute -top-14 -right-16 w-24 h-32 bg-white p-1.5 shadow-2xl rotate-[14deg] hidden md:block overflow-hidden border border-gray-100">
                  <img src={miFoto2} className="w-full h-full object-cover sepia-[0.2]" alt="2" />
                </motion.div>
                <motion.div animate={{ opacity: stage === 'bloomed' ? 1 : 0 }} className="absolute -bottom-10 -left-20 w-24 h-32 bg-white p-1.5 shadow-2xl rotate-[-5deg] hidden md:block overflow-hidden border border-gray-100">
                  <img src={miFoto3} className="w-full h-full object-cover sepia-[0.2]" alt="3" />
                </motion.div>
                <motion.div animate={{ opacity: stage === 'bloomed' ? 1 : 0 }} className="absolute -bottom-8 -right-20 w-24 h-32 bg-white p-1.5 shadow-2xl rotate-[8deg] hidden md:block overflow-hidden border border-gray-100">
                  <img src={miFoto4} className="w-full h-full object-cover sepia-[0.2]" alt="4" />
                </motion.div>

                <Stars className="mx-auto mb-4 text-rose-500" size={32} />
                <h2 className="font-lovely text-5xl sm:text-6xl text-rose-900 mb-6 italic">Mi única elección</h2>
                <p className="font-body text-gray-700 text-base sm:text-lg italic font-light leading-relaxed">
                  "Te elegiría a ti; en <span className="text-rose-500 font-bold underline decoration-rose-200">cien vidas</span>, en cualquier realidad, te encontraría siempre."
                </p>
                <div className="my-6 flex items-center justify-center gap-4 opacity-40">
                  <div className="h-[1px] bg-rose-400 w-16"></div>
                  <Heart size={18} fill="#e11d48" className="animate-pulse text-rose-600" />
                  <div className="h-[1px] bg-rose-400 w-16"></div>
                </div>
                <TimeCounter />
              </div>
            </motion.div>

            <svg className="w-full max-w-4xl h-[80vh] sm:h-[85vh] overflow-visible z-10 px-4" viewBox="0 0 400 700">
               <motion.g stroke="#4a403a" strokeLinecap="round" fill="none">
                  <motion.path d="M200 700 C 180 600, 240 550, 210 450 C 190 380, 230 300, 200 200" strokeWidth="18" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 3.5, ease: "circOut" }} />
                  <motion.path d="M190 700 C 170 580, 220 530, 195 430" strokeWidth="10" opacity="0.4" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 3.5, ease: "circOut" }} />
                  <motion.path d="M210 450 C 160 450, 130 480, 90 420" strokeWidth="10" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.8, duration: 2.5, ease: "circOut" }} />
                  <motion.path d="M205 350 C 260 350, 300 380, 350 320" strokeWidth="9" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 1.2, duration: 2.5, ease: "circOut" }} />
              </motion.g>
              {stage === 'bloomed' && (
                <g transform="translate(200, 220)">
                  {sakuraFlowers.map((f, i) => (
                    <motion.path key={i} d="M0 0 C -8 -8, -15 -4, -15 4 C -15 12, 0 20, 0 28 C 0 20, 15 12, 15 4 C 15 -4, 8 -8, 0 0 Z"
                      fill={f.c} initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: f.s, opacity: 0.9, x: f.x, y: f.y, rotate: f.r }}
                      transition={{ delay: f.d, type: "spring", stiffness: 40, damping: 10 }}
                    />
                  ))}
                </g>
              )}
            </svg>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

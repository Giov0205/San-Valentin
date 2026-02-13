import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { intervalToDuration, differenceInDays, type Duration } from 'date-fns';
import { Heart, Frown, Flower2, Stars, Timer } from 'lucide-react';

// --- FOTOS (Solo 3 ahora) ---
import miFoto2 from './assets/fotos/foto2.jpg';
import miFoto3 from './assets/fotos/foto3.jpg';
import miFoto4 from './assets/fotos/foto4.jpg';

// --- FECHA (30 de Noviembre, 2025) ---
// El mes 10 representa Noviembre en JavaScript
const START_DATE = new Date(2025, 10, 30);

const TimeCounter = () => {
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
    <div className="flex flex-col items-center p-1.5 sm:p-3 w-12 sm:w-16 border-r last:border-r-0 border-rose-200/50 font-body">
      <span className="font-bold text-base sm:text-xl text-rose-800">{val || 0}</span>
      <span className="text-[7px] sm:text-[9px] text-rose-400 uppercase tracking-widest">{label}</span>
    </div>
  );

  return (
    <div className="flex flex-col items-center w-full font-body">
      <div className="flex flex-wrap justify-center mt-4 sm:mt-6 bg-white/40 backdrop-blur-md rounded-xl border border-white/60 shadow-sm py-2 px-2 sm:px-4">
        {duration.years ? <TimeBox val={duration.years} label="Años" /> : null}
        {duration.months ? <TimeBox val={duration.months} label="Meses" /> : null}
        <TimeBox val={duration.days} label="Días" />
        <TimeBox val={duration.hours} label="Hrs" />
        <TimeBox val={duration.minutes} label="Min" />
        <TimeBox val={duration.seconds} label="Seg" />
      </div>
      <div className="mt-3 text-rose-500 text-[8px] sm:text-[9px] font-bold tracking-[0.2em] opacity-70 uppercase">
        ( {totalDays} Días de coincidir )
      </div>
    </div>
  );
};

export default function App() {
  const [stage, setStage] = useState<'asking' | 'growing' | 'bloomed'>('asking');
  const [noBtnPos, setNoBtnPos] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);

  // --- LÓGICA DE AUDIO ---
  useEffect(() => {
    if (stage === 'growing') {
      const audio = new Audio('/love-song.mp3');
      audio.volume = 0.5;
      audio.play().catch(err => console.log("Audio bloqueado:", err));
    }
  }, [stage]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleYes = () => {
    setStage('growing');
    setTimeout(() => setStage('bloomed'), 3500);
  };

  const moveNoButton = () => {
    const maxDistance = isMobile ? 80 : 150;
    const x = Math.random() * maxDistance - maxDistance / 2;
    const y = Math.random() * maxDistance - maxDistance / 2;
    setNoBtnPos({ x, y });
  };

  const sakuraFlowers = useMemo(() => {
    const colors = ['#ffb7b2', '#ff9a9e', '#fad0c4', '#e11d48', '#ffffff'];
    return [...Array(100)].map(() => ({
      x: Math.random() * 380 - 190,
      y: Math.random() * 320 - 160,
      s: Math.random() * 1.2 + 0.4,
      r: Math.random() * 360,
      d: Math.random() * 1.5,
      c: colors[Math.floor(Math.random() * colors.length)]
    }));
  }, []);

  return (
    <div className="min-h-screen bg-[#fdfbf7] flex flex-col items-center justify-center overflow-x-hidden relative px-4 py-6 sm:p-4">
      
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-rose-200/20 rounded-full blur-sm"
            style={{ width: 15, height: 15, left: `${Math.random() * 100}%`, top: -50 }}
            animate={{ y: '110vh', rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {stage === 'asking' && (
          <motion.div
            key="asking"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="bg-white/90 backdrop-blur-xl p-6 sm:p-12 rounded-[30px] sm:rounded-[40px] shadow-2xl text-center w-full max-w-sm sm:max-w-lg z-50 border border-white"
          >
            <Flower2 className="mx-auto mb-4 text-rose-400" size={40} />
            <h1 className="font-lovely text-4xl sm:text-7xl text-rose-900 mb-2 font-bold leading-tight">Paula Daniela</h1>
            <h2 className="font-body text-gray-600 mb-8 uppercase text-[10px] sm:text-xs font-bold tracking-[0.15em]">
              ¿Quieres ser mi San Valentín?
            </h2>

            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleYes}
                className="bg-rose-500 text-white w-full sm:w-auto px-10 py-4 rounded-full font-bold shadow-lg flex items-center justify-center gap-3 transition-colors hover:bg-rose-600"
              >
                <Heart size={18} fill="currentColor" /> SÍ, QUIERO
              </motion.button>

              <motion.button
                animate={{ x: noBtnPos.x, y: noBtnPos.y }}
                onMouseEnter={moveNoButton}
                onClick={moveNoButton}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
                className="bg-gray-100 text-gray-400 w-full sm:w-auto px-10 py-4 rounded-full border border-gray-200 sm:absolute relative opacity-80 sm:opacity-100"
              >
                <Frown size={18} /> No
              </motion.button>
            </div>
          </motion.div>
        )}

        {stage !== 'asking' && (
          <motion.div
            key="tree-stage"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
            className="relative w-full h-full flex flex-col items-center justify-end"
          >
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: stage === 'bloomed' ? 1 : 0, y: stage === 'bloomed' ? 0 : 30 }}
              transition={{ duration: 1.2 }}
              className="absolute top-[6%] sm:top-[10%] w-full flex justify-center px-4 z-40"
            >
              <div className="relative bg-white/80 backdrop-blur-md p-6 sm:p-10 rounded-[30px] sm:rounded-[40px] shadow-xl border border-white/60 w-full max-w-sm sm:max-w-md">
                
                {/* Fotos - Reorganizadas sin la foto 1 */}
                <div className="absolute -top-12 -right-4 sm:-top-16 sm:-right-20 w-16 h-22 sm:w-28 sm:h-36 bg-white p-1 shadow-xl rotate-[12deg] overflow-hidden border border-gray-100">
                  <img src={miFoto2} className="w-full h-full object-cover sepia-[0.2]" alt="nosotros 2" />
                </div>
                <div className="absolute -bottom-8 -left-6 sm:-bottom-12 sm:-left-24 w-18 h-24 sm:w-30 sm:h-40 bg-white p-1 shadow-xl rotate-[-8deg] overflow-hidden border border-gray-100">
                  <img src={miFoto3} className="w-full h-full object-cover sepia-[0.2]" alt="nosotros 3" />
                </div>
                <div className="absolute -bottom-6 -right-6 sm:-bottom-10 sm:-right-24 w-16 h-22 sm:w-28 sm:h-36 bg-white p-1 shadow-xl rotate-[10deg] overflow-hidden border border-gray-100">
                  <img src={miFoto4} className="w-full h-full object-cover sepia-[0.2]" alt="nosotros 4" />
                </div>

                <Stars className="mx-auto mb-3 text-rose-500" size={24} />
                <h2 className="font-lovely text-4xl sm:text-6xl text-rose-900 mb-4 italic leading-tight text-center">Mi única elección</h2>

                <p className="font-body text-gray-700 text-sm sm:text-lg italic leading-relaxed text-center px-2">
                  "Te elegiría a ti; en <span className="text-rose-500 font-bold underline decoration-rose-200">cien vidas</span>, en cualquier realidad, te encontraría siempre."
                </p>

                <div className="my-4 flex items-center justify-center gap-3 opacity-40">
                  <div className="h-[1px] bg-rose-400 w-12 sm:w-16"></div>
                  <Heart size={16} fill="#e11d48" className="animate-pulse text-rose-600" />
                  <div className="h-[1px] bg-rose-400 w-12 sm:w-16"></div>
                </div>

                <div className="flex items-center justify-center gap-2 mb-2 text-rose-500">
                  <Timer size={14} />
                  <span className="font-body font-bold text-[10px] uppercase tracking-widest text-center">Nuestra historia</span>
                </div>
                
                <TimeCounter />
              </div>
            </motion.div>

            {/* Árbol Bonsái */}
            <svg className="w-full max-w-4xl h-[50vh] sm:h-[85vh] overflow-visible z-10 px-4 mb-4" viewBox="0 0 400 700">
              <motion.g stroke="#4a403a" strokeLinecap="round" fill="none">
                <motion.path
                  d="M200 700 C 180 600, 240 550, 210 450 C 190 380, 230 300, 200 200"
                  strokeWidth="16"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 3.5, ease: "circOut" }}
                />
                <motion.path
                  d="M190 700 C 170 580, 220 530, 195 430"
                  strokeWidth="8"
                  opacity="0.3"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 3.5, ease: "circOut" }}
                />
                <motion.path
                  d="M210 450 C 160 450, 130 480, 90 420"
                  strokeWidth="8"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 0.8, duration: 2.5 }}
                />
                <motion.path
                  d="M205 350 C 260 350, 300 380, 350 320"
                  strokeWidth="7"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 1.2, duration: 2.5 }}
                />
              </motion.g>

              {stage === 'bloomed' && (
                <g transform="translate(200, 220)">
                  {sakuraFlowers.map((f, i) => (
                    <motion.path
                      key={i}
                      d="M0 0 C -8 -8, -15 -4, -15 4 C -15 12, 0 20, 0 28 C 0 20, 15 12, 15 4 C 15 -4, 8 -8, 0 0 Z"
                      fill={f.c}
                      initial={{ scale: 0, opacity: 0 }}
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

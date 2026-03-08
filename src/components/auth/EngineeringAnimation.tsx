import { motion } from "framer-motion";

const EngineeringAnimation = () => {
  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      {/* Rotating outer ring */}
      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full border border-emerald-500/10"
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      >
        {[0, 60, 120, 180, 240, 300].map((deg) => (
          <motion.div
            key={deg}
            className="absolute w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-500/30"
            style={{
              top: '50%', left: '50%',
              transform: `rotate(${deg}deg) translateX(200px) translateY(-50%)`
            }}
            animate={{ opacity: [0.2, 0.8, 0.2] }}
            transition={{ duration: 3, repeat: Infinity, delay: deg / 360 * 3 }}
          />
        ))}
      </motion.div>

      {/* Inner ring */}
      <motion.div
        className="absolute w-[260px] h-[260px] rounded-full border border-emerald-500/5"
        animate={{ rotate: -360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        {[0, 90, 180, 270].map((deg) => (
          <motion.div
            key={deg}
            className="absolute w-2 h-2 rounded-full bg-emerald-400/30"
            style={{
              top: '50%', left: '50%',
              transform: `rotate(${deg}deg) translateX(130px) translateY(-50%)`
            }}
          />
        ))}
      </motion.div>

      {/* Center circuit pattern */}
      <div className="relative">
        <motion.div
          className="w-[120px] h-[120px] rounded-2xl auth-glass-green flex items-center justify-center"
          animate={{ boxShadow: ['0 0 30px rgba(16,185,129,0.1)', '0 0 60px rgba(16,185,129,0.2)', '0 0 30px rgba(16,185,129,0.1)'] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          <svg width="60" height="60" viewBox="0 0 60 60" fill="none" className="text-emerald-400/60">
            <path d="M30 5 L30 20 M30 40 L30 55 M5 30 L20 30 M40 30 L55 30" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="30" cy="30" r="8" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="30" cy="30" r="3" fill="currentColor" opacity="0.4" />
            <path d="M15 15 L22 22 M38 38 L45 45 M45 15 L38 22 M22 38 L15 45" stroke="currentColor" strokeWidth="1" opacity="0.4" />
          </svg>
        </motion.div>

        {/* Floating circuit lines */}
        {[
          { x: -80, y: -60, w: 40 },
          { x: 60, y: -40, w: 50 },
          { x: -60, y: 50, w: 35 },
          { x: 70, y: 60, w: 45 },
        ].map((line, i) => (
          <motion.div
            key={i}
            className="absolute h-[1px] bg-gradient-to-r from-emerald-500/20 to-transparent"
            style={{ left: `calc(50% + ${line.x}px)`, top: `calc(50% + ${line.y}px)`, width: line.w }}
            animate={{ opacity: [0, 0.6, 0], scaleX: [0.5, 1, 0.5] }}
            transition={{ duration: 3 + i, repeat: Infinity, delay: i * 0.8 }}
          />
        ))}
      </div>

      {/* Floating text labels */}
      {[
        { label: "GPIO", x: -140, y: -120 },
        { label: "PWM", x: 120, y: -100 },
        { label: "I²C", x: -130, y: 90 },
        { label: "SPI", x: 140, y: 110 },
        { label: "UART", x: -30, y: -160 },
        { label: "ADC", x: 50, y: 150 },
      ].map((item, i) => (
        <motion.span
          key={item.label}
          className="absolute text-[11px] font-mono text-emerald-500/20 tracking-wider"
          style={{ left: `calc(50% + ${item.x}px)`, top: `calc(50% + ${item.y}px)` }}
          animate={{ opacity: [0.1, 0.4, 0.1] }}
          transition={{ duration: 4, repeat: Infinity, delay: i * 0.7 }}
        >
          {item.label}
        </motion.span>
      ))}
    </div>
  );
};

export default EngineeringAnimation;

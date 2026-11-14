import React, { useState } from 'react';
import { sound } from '../lib/audio';

export type CeldiMood = 'happy' | 'thinking' | 'celebrating' | 'onFire' | 'sad';

interface CeldiProps {
  mood?: CeldiMood;
  size?: number;
  speechText?: string;
  showBubble?: boolean;
  interactive?: boolean;
  onClick?: () => void;
  className?: string;
}

const MOOD_THEMES = {
  happy: {
    stroke: '#21C26B',
    glow: 'rgba(33, 194, 107, 0.45)',
    bg: '#18221D',
    blush: 'rgba(33, 194, 107, 0.35)',
  },
  thinking: {
    stroke: '#38BDF8',
    glow: 'rgba(56, 189, 248, 0.45)',
    bg: '#15242C',
    blush: 'rgba(56, 189, 248, 0.3)',
  },
  celebrating: {
    stroke: '#7CFFB2',
    glow: 'rgba(124, 255, 178, 0.6)',
    bg: '#18271F',
    blush: 'rgba(255, 107, 158, 0.4)',
  },
  onFire: {
    stroke: '#22C55E',
    glow: 'rgba(34, 197, 94, 0.7)',
    bg: '#16281E',
    blush: 'rgba(255, 120, 70, 0.45)',
  },
  sad: {
    stroke: '#EF4444',
    glow: 'rgba(239, 68, 68, 0.45)',
    bg: '#251717',
    blush: 'transparent',
  },
};

export const CeldiMascot: React.FC<CeldiProps> = ({
  mood = 'happy',
  size = 120,
  speechText,
  showBubble = true,
  interactive = true,
  onClick,
  className = '',
}) => {
  const [isPoking, setIsPoking] = useState(false);
  const theme = MOOD_THEMES[mood] || MOOD_THEMES.happy;
  const isCelebrating = mood === 'celebrating' || mood === 'onFire';
  const isSad = mood === 'sad';
  const isThinking = mood === 'thinking';

  const handleClick = () => {
    if (!interactive) return;
    setIsPoking(true);
    sound.play('celdi_poke');
    if (onClick) onClick();
    setTimeout(() => setIsPoking(false), 650);
  };

  return (
    <div
      className={`celdi-mascot-container group relative inline-flex flex-col items-center justify-center select-none ${
        interactive ? 'cursor-pointer' : ''
      } ${isPoking ? 'celdi-poking' : ''} ${isCelebrating ? 'celdi-celebrating' : ''} ${className}`}
      onClick={handleClick}
      role={interactive ? 'button' : 'img'}
      aria-label={`Celdi mascot (${mood})`}
    >
      {/* Excel Speech Bubble (matching landing design with fx badge) */}
      {speechText && showBubble && (
        <div className="absolute -top-12 z-20 pointer-events-none transition-all duration-300 transform opacity-100 scale-100 -translate-y-1">
          <div className="relative bg-gv-surface-higher/95 backdrop-blur-md border border-gv-primary/40 text-gv-text px-3 py-1.5 rounded-xl text-xs font-mono shadow-xl whitespace-nowrap flex items-center gap-1.5">
            <span className="text-gv-primary font-bold">fx</span>
            <span className="font-medium text-[11px] md:text-xs">{speechText}</span>
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-gv-surface-higher border-b border-r border-gv-primary/40 transform rotate-45" />
          </div>
        </div>
      )}

      {/* SVG Mascot Body - Identical to Flutter App without pupils */}
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          viewBox="0 0 200 200"
          width={size}
          height={size}
          className="overflow-visible w-full h-full"
        >
          <defs>
            {/* Outer Glow Filter */}
            <filter id={`glow-${mood}`} x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            {/* OnFire Energy Gradient */}
            <linearGradient id="energyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#7CFFB2" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#21C26B" stopOpacity="0.3" />
            </linearGradient>
          </defs>

          {/* Dynamic Ground Shadow */}
          <ellipse
            cx="100"
            cy="184"
            rx="68"
            ry="8"
            className="celdi-shadow fill-black/55 blur-[2.5px]"
          />

          {/* Physical Body Group */}
          <g className="celdi-squash-group">
            {/* OnFire Energy Aura Spikes on top */}
            {mood === 'onFire' && (
              <path
                d="M 40,40 Q 60,10 80,35 Q 100,5 120,35 Q 140,10 160,40"
                fill="none"
                stroke="url(#energyGrad)"
                strokeWidth="4.5"
                strokeLinecap="round"
                className="animate-pulse"
              />
            )}

            {/* Main Cell Body (Rounded spreadsheet cell) */}
            <rect
              x="26"
              y="34"
              width="148"
              height="132"
              rx="18"
              ry="18"
              fill={theme.bg}
              stroke={theme.stroke}
              strokeWidth="9"
              strokeLinejoin="round"
              style={{ filter: `drop-shadow(0 0 12px ${theme.glow})` }}
            />

            {/* 3D Glass Specular Sheen Bar */}
            <rect
              x="34"
              y="42"
              width="132"
              height="24"
              rx="8"
              fill="white"
              fillOpacity="0.08"
            />

            {/* Error Glitch Crack line when sad / damaged */}
            {isSad && (
              <path
                d="M 120,44 L 110,60 L 124,75 L 115,92"
                fill="none"
                stroke="#EF4444"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

            {/* Floating Question Mark for Thinking Mood (like mobile app) */}
            {isThinking && (
              <text
                x="180"
                y="40"
                fill={theme.stroke}
                fontSize="28"
                fontFamily="system-ui, sans-serif"
                fontWeight="900"
                className="animate-pulse"
                style={{ filter: `drop-shadow(0 0 6px ${theme.glow})` }}
              >
                ?
              </text>
            )}

            {/* Cheeks Blush */}
            <ellipse cx="48" cy="118" rx="10" ry="5.5" fill={theme.blush} />
            <ellipse cx="152" cy="118" rx="10" ry="5.5" fill={theme.blush} />

            {/* Eyebrows */}
            {isThinking ? (
              /* Curved inquisitive left brow, flat furrowed right brow (mobile app match) */
              <>
                <path
                  d="M 60 74 Q 72 64 84 74"
                  stroke="#FFFFFF"
                  strokeWidth="4"
                  fill="none"
                  strokeLinecap="round"
                />
                <path
                  d="M 120 73 L 142 77"
                  stroke="#FFFFFF"
                  strokeWidth="4"
                  fill="none"
                  strokeLinecap="round"
                />
              </>
            ) : isSad ? (
              /* Sad angled eyebrows */
              <>
                <path
                  d="M 60 78 L 82 72"
                  stroke="#EF4444"
                  strokeWidth="4"
                  fill="none"
                  strokeLinecap="round"
                />
                <path
                  d="M 122 72 L 144 78"
                  stroke="#EF4444"
                  strokeWidth="4"
                  fill="none"
                  strokeLinecap="round"
                />
              </>
            ) : null}

            {/* Eyes - STRICTLY SOLID WHITE WITHOUT PUPILS (App match) */}
            <g className="celdi-blink-eye">
              {isCelebrating ? (
                /* Happy Arcs (^ ^) when celebrating */
                <>
                  <path
                    d="M 56 102 Q 68 84 80 102"
                    stroke="#FFFFFF"
                    strokeWidth="6"
                    fill="none"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 120 102 Q 132 84 144 102"
                    stroke="#FFFFFF"
                    strokeWidth="6"
                    fill="none"
                    strokeLinecap="round"
                  />
                </>
              ) : isThinking ? (
                /* Solid white eyes with NO pupils */
                <>
                  <ellipse cx="72" cy="95" rx="8" ry="12" fill="#FFFFFF" />
                  <ellipse cx="134" cy="95" rx="8" ry="12" fill="#FFFFFF" />
                </>
              ) : isSad ? (
                /* Solid white oval eyes with NO pupils */
                <>
                  <ellipse cx="68" cy="102" rx="8" ry="11" fill="#FFFFFF" />
                  <ellipse cx="132" cy="102" rx="8" ry="11" fill="#FFFFFF" />
                </>
              ) : (
                /* Normal mood: Solid white ovals, NO pupils (matching Flutter mobile app) */
                <>
                  <ellipse cx="68" cy="98" rx="8.5" ry="13.5" fill="#FFFFFF" />
                  <ellipse cx="132" cy="98" rx="8.5" ry="13.5" fill="#FFFFFF" />
                </>
              )}
            </g>

            {/* Mouth */}
            {isCelebrating ? (
              <path
                d="M 82 116 Q 100 144 118 116 Z"
                fill="#15803D"
                stroke="#FFFFFF"
                strokeWidth="4.5"
              />
            ) : isThinking ? (
              /* Cute small circular mouth "o" (matching Flutter mobile app screenshot) */
              <circle
                cx="100"
                cy="120"
                r="5"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="3.5"
              />
            ) : isSad ? (
              <path
                d="M 84 128 Q 100 114 116 128"
                stroke="#EF4444"
                strokeWidth="5.5"
                fill="none"
                strokeLinecap="round"
              />
            ) : (
              <path
                d="M 84 118 Q 100 134 116 118"
                stroke="#FFFFFF"
                strokeWidth="5.5"
                fill="none"
                strokeLinecap="round"
              />
            )}

            {/* Fill Handle Tail ("Colita" with inertial wag) */}
            <g className="celdi-tail">
              <rect
                x="166"
                y="158"
                width="22"
                height="22"
                rx="3.5"
                ry="3.5"
                fill={theme.stroke}
                style={{ filter: `drop-shadow(0 0 6px ${theme.glow})` }}
              />
            </g>
          </g>
        </svg>
      </div>
    </div>
  );
};

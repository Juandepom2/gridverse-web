import React, { useState } from 'react';
import { sound } from '../lib/audio';

export type CeldiMood = 'happy' | 'thinking' | 'celebrating' | 'sad' | 'onFire';

interface CeldiProps {
  mood?: CeldiMood;
  size?: number;
  speechText?: string;
  onClick?: () => void;
}

export const CeldiMascot: React.FC<CeldiProps> = ({
  mood = 'happy',
  size = 72,
  speechText,
  onClick,
}) => {
  const [isPoked, setIsPoked] = useState(false);

  const handleClick = () => {
    setIsPoked(true);
    sound.play('celdi_poke');
    if (onClick) onClick();
    setTimeout(() => setIsPoked(false), 400);
  };

  // Eyes and mouth styling based on mood
  const renderFace = () => {
    switch (mood) {
      case 'thinking':
        return (
          <>
            {/* Ojos curiosos mirando arriba */}
            <circle cx="36" cy="38" r="4.5" fill="#E6EFE9" />
            <circle cx="37" cy="36" r="2" fill="#0A0F0C" />
            <circle cx="64" cy="38" r="4.5" fill="#E6EFE9" />
            <circle cx="65" cy="36" r="2" fill="#0A0F0C" />
            {/* Boca pequeña pensativa */}
            <ellipse cx="50" cy="56" rx="4" ry="3" fill="#E6EFE9" />
          </>
        );
      case 'celebrating':
        return (
          <>
            {/* Ojos estrellados / cerrados felices ^ ^ */}
            <path d="M 30 40 Q 36 33 42 40" stroke="#E6EFE9" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M 58 40 Q 64 33 70 40" stroke="#E6EFE9" strokeWidth="3" fill="none" strokeLinecap="round" />
            {/* Sonrisa grande abierta */}
            <path d="M 38 52 Q 50 68 62 52 Z" fill="#21C26B" stroke="#E6EFE9" strokeWidth="2" />
          </>
        );
      case 'sad':
        return (
          <>
            {/* Ojos tristes caídos */}
            <circle cx="36" cy="40" r="4" fill="#E6EFE9" />
            <circle cx="64" cy="40" r="4" fill="#E6EFE9" />
            {/* Boca hacia abajo */}
            <path d="M 40 58 Q 50 50 60 58" stroke="#FF5D5D" strokeWidth="3" fill="none" strokeLinecap="round" />
          </>
        );
      case 'onFire':
        return (
          <>
            {/* Ojos determinados */}
            <circle cx="36" cy="38" r="4" fill="#FF8A3D" />
            <circle cx="64" cy="38" r="4" fill="#FF8A3D" />
            {/* Sonrisa audaz */}
            <path d="M 40 52 Q 50 62 60 52" stroke="#FF8A3D" strokeWidth="3" fill="none" strokeLinecap="round" />
          </>
        );
      case 'happy':
      default:
        return (
          <>
            {/* Ojos grandes amigables con brillo */}
            <circle cx="36" cy="40" r="5" fill="#E6EFE9" />
            <circle cx="38" cy="38" r="1.8" fill="#111915" />
            <circle cx="64" cy="40" r="5" fill="#E6EFE9" />
            <circle cx="66" cy="38" r="1.8" fill="#111915" />
            {/* Sonrisa alegre */}
            <path d="M 38 52 Q 50 64 62 52" stroke="#E6EFE9" strokeWidth="3" fill="none" strokeLinecap="round" />
            {/* Chapitas mejillas sonrosadas */}
            <circle cx="28" cy="48" r="3" fill="#21C26B" opacity="0.4" />
            <circle cx="72" cy="48" r="3" fill="#21C26B" opacity="0.4" />
          </>
        );
    }
  };

  return (
    <div className="flex items-center gap-3">
      {/* Celdi Mascot Icon */}
      <div
        onClick={handleClick}
        style={{ width: size, height: size }}
        className={`relative shrink-0 cursor-pointer select-none transition-transform duration-200 ${
          isPoked ? 'scale-90 rotate-6' : 'hover:scale-105 active:scale-95'
        }`}
        title="¡Haz clic en Celdi!"
      >
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
          {/* Sombra base */}
          <ellipse cx="50" cy="92" rx="36" ry="6" fill="#000000" opacity="0.4" />

          {/* Cuerpo principal tipo celda con bordes redondeados y gradiente */}
          <rect
            x="14"
            y="14"
            width="72"
            height="72"
            rx="16"
            fill="url(#celdiGrad)"
            stroke="#21C26B"
            strokeWidth="3.5"
          />

          {/* Líneas sutiles de cuadrícula de hoja de cálculo en la cabeza */}
          <line x1="14" y1="28" x2="86" y2="28" stroke="#243029" strokeWidth="1.5" strokeDasharray="3 3" />
          <line x1="50" y1="14" x2="50" y2="28" stroke="#243029" strokeWidth="1.5" />

          {/* Controlador de relleno de Excel (Fill handle en esquina inferior derecha) */}
          <rect
            x="80"
            y="80"
            width="9"
            height="9"
            fill="#7CFFB2"
            stroke="#13804A"
            strokeWidth="1.5"
            rx="2"
          />

          {/* Rostro y expresiones */}
          {renderFace()}

          <defs>
            <linearGradient id="celdiGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#182A20" />
              <stop offset="100%" stopColor="#111915" />
            </linearGradient>
          </defs>
        </svg>

        {mood === 'onFire' && (
          <span className="absolute -top-2 -right-1 text-base animate-bounce">🔥</span>
        )}
      </div>

      {/* Speech Bubble opcional */}
      {speechText && (
        <div className="relative bg-gv-surface-high border border-gv-border rounded-xl px-3.5 py-2 text-xs md:text-sm text-gv-text max-w-xs shadow-lg animate-fade-in">
          <div className="absolute top-1/2 -left-2 -translate-y-1/2 w-0 h-0 border-y-4 border-y-transparent border-r-8 border-r-gv-border" />
          <p className="font-medium leading-relaxed">{speechText}</p>
        </div>
      )}
    </div>
  );
};

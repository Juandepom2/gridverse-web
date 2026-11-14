import React, { useState } from 'react';
import { Check, Star, Bug, Dumbbell, Gift } from 'lucide-react';
import { LevelItem } from '../../data/mapData';
import { SupportedLocale } from '../../types';
import { sound } from '../../lib/audio';

interface LevelNodeProps {
  level: LevelItem;
  color: string;
  status: 'done' | 'current' | 'locked';
  stars: number;
  locale: SupportedLocale;
  onTap: () => void;
}

export const LevelNode: React.FC<LevelNodeProps> = ({
  level,
  color,
  status,
  stars,
  locale,
  onTap,
}) => {
  const [pressed, setPressed] = useState(false);
  const locked = status === 'locked';
  const isCurrent = status === 'current';
  const isBoss = level.type === 'boss';

  const size = isBoss ? 82 : 70;
  const depth = 6;

  // Colors based on status and level type
  const faceColor = locked ? '#202C26' : isBoss ? '#B18CFF' : color;
  const edgeColor = locked ? '#141D18' : '#0B4D2A';

  const handleClick = () => {
    if (locked) {
      sound.play('tap');
      return;
    }
    sound.play('tap');
    onTap();
  };

  const getStartText = () => {
    switch (locale) {
      case 'es':
        return 'EMPEZAR';
      case 'pt':
        return 'INICIAR';
      case 'fr':
        return 'COMMENCER';
      case 'de':
        return 'START';
      case 'ja':
        return 'スタート';
      default:
        return 'START';
    }
  };

  return (
    <div className="relative flex flex-col items-center select-none">
      {/* Current Level Pulsing Ring & Bouncing Bubble */}
      {isCurrent && (
        <>
          {/* Pulsing Aura */}
          <div
            className="absolute rounded-[26px] -inset-2.5 pointer-events-none animate-ping opacity-25"
            style={{ backgroundColor: color }}
          />

          {/* Bouncing "EMPEZAR" Speech Bubble */}
          <div
            onClick={handleClick}
            className="absolute -top-11 z-20 cursor-pointer animate-bounce flex flex-col items-center"
          >
            <div
              className="px-3 py-1 rounded-xl bg-gv-surface border-2 font-black text-[11px] tracking-wider uppercase shadow-xl"
              style={{ borderColor: color, color: color }}
            >
              {getStartText()}
            </div>
            {/* Bubble arrow down */}
            <div
              className="w-0 h-0 border-x-4 border-x-transparent border-t-4 -mt-[1px]"
              style={{ borderTopColor: color }}
            />
          </div>
        </>
      )}

      {/* 3D Tactile Cell Button */}
      <div
        style={{ width: size, height: size + depth }}
        className="relative cursor-pointer"
        onMouseDown={() => setPressed(true)}
        onMouseUp={() => setPressed(false)}
        onMouseLeave={() => setPressed(false)}
        onTouchStart={() => setPressed(true)}
        onTouchEnd={() => setPressed(false)}
        onClick={handleClick}
      >
        {/* 3D Bottom Edge (Shadow Bevel) */}
        <div
          style={{
            top: depth,
            height: size,
            backgroundColor: edgeColor,
            borderRadius: '18px',
          }}
          className="absolute inset-x-0 transition-all duration-75 shadow-lg"
        />

        {/* 3D Front Face Surface */}
        <div
          style={{
            top: pressed ? depth - 1 : 0,
            height: size,
            backgroundColor: faceColor,
            borderRadius: '18px',
          }}
          className={`absolute inset-x-0 transition-transform duration-75 flex items-center justify-center border ${
            locked
              ? 'border-gv-border text-gv-faint'
              : 'border-white/20 text-white shadow-inner'
          }`}
        >
          {/* Fill Handle (Excel signature dot in bottom right corner) */}
          {!locked && (
            <div className="absolute bottom-2 right-2 w-2 h-2 bg-black/45 rounded-[1px] border border-white/20" />
          )}

          {/* Top Left Ref Tag for special icon levels */}
          {(level.type === 'boss' || level.type === 'practice' || level.type === 'chest' || status === 'done') && (
            <span
              className={`absolute top-1.5 left-2 font-mono text-[9px] font-black ${
                locked ? 'text-gv-faint' : 'text-black/60'
              }`}
            >
              {level.ref}
            </span>
          )}

          {/* Central Icon or Text */}
          {status === 'done' ? (
            <Check className="w-8 h-8 stroke-[3.5] text-white" />
          ) : level.type === 'boss' ? (
            <Bug className="w-8 h-8 text-black/85" />
          ) : level.type === 'practice' ? (
            <Dumbbell className="w-7 h-7 text-white" />
          ) : level.type === 'chest' ? (
            <Gift className="w-7 h-7 text-white" />
          ) : (
            <span className="font-mono text-xl font-black tracking-tight text-white drop-shadow-sm">
              {level.ref}
            </span>
          )}
        </div>
      </div>

      {/* Stars row below node */}
      <div className="flex items-center gap-0.5 mt-1.5">
        {[1, 2, 3].map((s) => (
          <Star
            key={s}
            className={`w-3.5 h-3.5 ${
              stars >= s
                ? 'fill-gv-warning text-gv-warning'
                : 'text-gv-surface-higher fill-gv-surface-high'
            }`}
          />
        ))}
      </div>

      {/* Boss Error label if applicable */}
      {isBoss && (level.bossErrorByLocale?.[locale] || level.bossError) && (
        <span
          className={`font-mono text-[10px] font-bold mt-0.5 ${
            locked ? 'text-gv-faint' : 'text-gv-boss'
          }`}
        >
          {level.bossErrorByLocale?.[locale] || level.bossError}
        </span>
      )}
    </div>
  );
};

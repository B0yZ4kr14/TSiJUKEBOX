import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export type IllustrationType = 
  | 'connections'
  | 'data'
  | 'system'
  | 'appearance'
  | 'security'
  | 'integrations';

interface SettingsIllustrationProps {
  type: IllustrationType;
  animated?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap = {
  sm: { width: 120, height: 80 },
  md: { width: 180, height: 120 },
  lg: { width: 240, height: 160 }
};

export function SettingsIllustration({ 
  type, 
  animated = true, 
  size = 'md',
  className 
}: SettingsIllustrationProps) {
  const { width, height } = sizeMap[size];
  
  const pulseAnimation = animated ? {
    animate: { opacity: [0.5, 1, 0.5] },
    transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
  } : {};

  const floatAnimation = animated ? {
    animate: { y: [-2, 2, -2] },
    transition: { duration: 3, repeat: Infinity, ease: "easeInOut" }
  } : {};

  const dashAnimation = animated ? {
    animate: { strokeDashoffset: [0, -20] },
    transition: { duration: 1, repeat: Infinity, ease: "linear" }
  } : {};

  const rotateAnimation = animated ? {
    animate: { rotate: 360 },
    transition: { duration: 8, repeat: Infinity, ease: "linear" }
  } : {};

  const illustrations: Record<IllustrationType, JSX.Element> = {
    connections: (
      <svg viewBox="0 0 200 120" className="w-full h-full">
        {/* Server */}
        <motion.g {...floatAnimation}>
          <rect x="20" y="35" width="50" height="50" rx="6" fill="hsl(220 25% 12%)" stroke="hsl(185 100% 50%)" strokeWidth="2" />
          <motion.rect x="30" y="45" width="30" height="4" rx="2" fill="hsl(141 70% 50%)" {...pulseAnimation} />
          <motion.rect x="30" y="53" width="20" height="4" rx="2" fill="hsl(185 100% 50%)" {...pulseAnimation} style={{ animationDelay: '0.3s' }} />
          <rect x="30" y="61" width="25" height="4" rx="2" fill="hsl(45 100% 50%)" opacity="0.5" />
          <text x="45" y="78" fontSize="8" fill="hsl(185 100% 70%)" textAnchor="middle">SERVER</text>
        </motion.g>
        
        {/* Connection Line */}
        <motion.line 
          x1="75" y1="60" x2="125" y2="60" 
          stroke="hsl(185 100% 50%)" 
          strokeWidth="2" 
          strokeDasharray="8 4"
          {...dashAnimation}
        />
        
        {/* Data packets */}
        {animated && (
          <>
            <motion.circle
              r="4"
              fill="hsl(141 70% 50%)"
              animate={{ cx: [80, 120], opacity: [0, 1, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            />
            <motion.circle
              r="4"
              fill="hsl(45 100% 50%)"
              animate={{ cx: [120, 80], opacity: [0, 1, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear", delay: 0.75 }}
            />
          </>
        )}
        
        {/* Jukebox */}
        <motion.g {...floatAnimation} style={{ animationDelay: '0.5s' }}>
          <rect x="130" y="35" width="50" height="50" rx="6" fill="hsl(220 25% 12%)" stroke="hsl(45 100% 50%)" strokeWidth="2" />
          <circle cx="155" cy="55" r="15" fill="hsl(45 100% 50% / 0.2)" stroke="hsl(45 100% 50%)" strokeWidth="1.5" />
          <motion.circle cx="155" cy="55" r="8" fill="hsl(45 100% 50% / 0.3)" {...rotateAnimation}>
            <animateTransform attributeName="transform" type="rotate" from="0 155 55" to="360 155 55" dur="3s" repeatCount="indefinite" />
          </motion.circle>
          <circle cx="155" cy="55" r="3" fill="hsl(45 100% 60%)" />
          <text x="155" y="78" fontSize="8" fill="hsl(45 100% 70%)" textAnchor="middle">JUKEBOX</text>
        </motion.g>
      </svg>
    ),

    data: (
      <svg viewBox="0 0 200 120" className="w-full h-full">
        {/* Database cylinder */}
        <motion.g {...floatAnimation}>
          <ellipse cx="60" cy="30" rx="30" ry="10" fill="hsl(141 70% 30%)" stroke="hsl(141 70% 50%)" strokeWidth="2" />
          <rect x="30" y="30" width="60" height="50" fill="hsl(220 25% 12%)" stroke="hsl(141 70% 50%)" strokeWidth="2" />
          <ellipse cx="60" cy="80" rx="30" ry="10" fill="hsl(220 25% 12%)" stroke="hsl(141 70% 50%)" strokeWidth="2" />
          <ellipse cx="60" cy="30" rx="30" ry="10" fill="hsl(141 70% 20%)" />
          
          {/* Data rows */}
          <motion.rect x="38" y="40" width="44" height="3" rx="1" fill="hsl(185 100% 50%)" {...pulseAnimation} />
          <motion.rect x="38" y="48" width="35" height="3" rx="1" fill="hsl(185 100% 50%)" opacity="0.7" {...pulseAnimation} style={{ animationDelay: '0.2s' }} />
          <motion.rect x="38" y="56" width="40" height="3" rx="1" fill="hsl(185 100% 50%)" opacity="0.5" {...pulseAnimation} style={{ animationDelay: '0.4s' }} />
          <text x="60" y="100" fontSize="8" fill="hsl(141 70% 60%)" textAnchor="middle">DATABASE</text>
        </motion.g>
        
        {/* Arrow */}
        <motion.path 
          d="M 100 55 L 125 55 L 120 50 M 125 55 L 120 60" 
          stroke="hsl(45 100% 50%)" 
          strokeWidth="2" 
          fill="none"
          {...pulseAnimation}
        />
        
        {/* Backup box */}
        <motion.g {...floatAnimation} style={{ animationDelay: '0.3s' }}>
          <rect x="135" y="35" width="45" height="40" rx="4" fill="hsl(220 25% 12%)" stroke="hsl(45 100% 50%)" strokeWidth="2" />
          <path d="M 148 45 L 148 60 L 155 53 L 162 60 L 162 45 Z" fill="hsl(45 100% 50%)" />
          <motion.rect x="145" y="62" width="30" height="3" rx="1" fill="hsl(141 70% 50%)" animate={animated ? { scaleX: [0, 1] } : {}} transition={{ duration: 2, repeat: Infinity }} style={{ transformOrigin: 'left' }} />
          <text x="157" y="100" fontSize="8" fill="hsl(45 100% 60%)" textAnchor="middle">BACKUP</text>
        </motion.g>
      </svg>
    ),

    system: (
      <svg viewBox="0 0 200 120" className="w-full h-full">
        {/* Monitor */}
        <rect x="50" y="20" width="100" height="65" rx="4" fill="hsl(220 25% 12%)" stroke="hsl(185 100% 50%)" strokeWidth="2" />
        <rect x="55" y="25" width="90" height="50" rx="2" fill="hsl(220 25% 8%)" />
        
        {/* Screen content */}
        <motion.rect x="60" y="30" width="30" height="15" rx="2" fill="hsl(141 70% 40%)" {...pulseAnimation} />
        <motion.rect x="95" y="30" width="45" height="15" rx="2" fill="hsl(185 100% 40%)" {...pulseAnimation} style={{ animationDelay: '0.3s' }} />
        <rect x="60" y="50" width="80" height="3" rx="1" fill="hsl(45 100% 50%)" opacity="0.5" />
        <motion.rect x="60" y="57" width="60" height="3" rx="1" fill="hsl(45 100% 50%)" opacity="0.3" {...pulseAnimation} />
        <rect x="60" y="64" width="40" height="3" rx="1" fill="hsl(45 100% 50%)" opacity="0.2" />
        
        {/* Monitor stand */}
        <rect x="90" y="85" width="20" height="8" fill="hsl(220 25% 15%)" />
        <rect x="80" y="93" width="40" height="5" rx="2" fill="hsl(220 25% 18%)" />
        
        {/* Gear */}
        <motion.g {...rotateAnimation} style={{ transformOrigin: '170px 50px' }}>
          <circle cx="170" cy="50" r="18" fill="none" stroke="hsl(185 100% 50%)" strokeWidth="3" strokeDasharray="6 3" />
          <circle cx="170" cy="50" r="8" fill="hsl(185 100% 30%)" stroke="hsl(185 100% 50%)" strokeWidth="2" />
        </motion.g>
        
        <text x="100" y="110" fontSize="8" fill="hsl(185 100% 60%)" textAnchor="middle">SISTEMA</text>
      </svg>
    ),

    appearance: (
      <svg viewBox="0 0 200 120" className="w-full h-full">
        {/* Color palette */}
        <motion.g {...floatAnimation}>
          <ellipse cx="70" cy="60" rx="45" ry="40" fill="hsl(220 25% 12%)" stroke="hsl(320 80% 50%)" strokeWidth="2" />
          
          {/* Color dots */}
          <motion.circle cx="45" cy="45" r="12" fill="hsl(185 100% 50%)" {...pulseAnimation} />
          <motion.circle cx="70" cy="35" r="12" fill="hsl(141 70% 50%)" {...pulseAnimation} style={{ animationDelay: '0.2s' }} />
          <motion.circle cx="95" cy="45" r="12" fill="hsl(280 80% 50%)" {...pulseAnimation} style={{ animationDelay: '0.4s' }} />
          <motion.circle cx="55" cy="70" r="12" fill="hsl(45 100% 50%)" {...pulseAnimation} style={{ animationDelay: '0.6s' }} />
          <motion.circle cx="85" cy="70" r="12" fill="hsl(320 80% 50%)" {...pulseAnimation} style={{ animationDelay: '0.8s' }} />
          
          {/* Brush hole */}
          <circle cx="70" cy="90" r="6" fill="hsl(220 25% 8%)" />
        </motion.g>
        
        {/* Paintbrush */}
        <motion.g animate={animated ? { rotate: [-5, 5, -5] } : {}} transition={{ duration: 2, repeat: Infinity }} style={{ transformOrigin: '155px 90px' }}>
          <rect x="130" y="30" width="8" height="50" rx="2" fill="hsl(35 80% 40%)" />
          <rect x="128" y="20" width="12" height="15" rx="2" fill="hsl(220 25% 60%)" />
          <motion.rect x="128" y="15" width="12" height="8" rx="1" fill="hsl(185 100% 50%)" {...pulseAnimation} />
        </motion.g>
        
        <text x="100" y="110" fontSize="8" fill="hsl(320 80% 60%)" textAnchor="middle">APARÊNCIA</text>
      </svg>
    ),

    security: (
      <svg viewBox="0 0 200 120" className="w-full h-full">
        {/* Shield */}
        <motion.g {...floatAnimation}>
          <path 
            d="M 100 15 L 140 30 L 140 65 C 140 85 120 100 100 105 C 80 100 60 85 60 65 L 60 30 Z" 
            fill="hsl(220 25% 12%)" 
            stroke="hsl(45 100% 50%)" 
            strokeWidth="2"
          />
          <path 
            d="M 100 25 L 130 37 L 130 63 C 130 78 115 90 100 94 C 85 90 70 78 70 63 L 70 37 Z" 
            fill="hsl(45 100% 50% / 0.15)"
          />
          
          {/* Lock */}
          <motion.g {...pulseAnimation}>
            <rect x="88" y="55" width="24" height="20" rx="3" fill="hsl(45 100% 50%)" />
            <path d="M 93 55 L 93 48 C 93 42 100 38 107 42 L 107 55" fill="none" stroke="hsl(45 100% 60%)" strokeWidth="3" strokeLinecap="round" />
            <circle cx="100" cy="65" r="3" fill="hsl(220 25% 12%)" />
            <rect x="99" y="65" width="2" height="5" fill="hsl(220 25% 12%)" />
          </motion.g>
        </motion.g>
        
        {/* Users */}
        <motion.circle cx="35" cy="60" r="8" fill="hsl(185 100% 40%)" {...pulseAnimation} style={{ animationDelay: '0.2s' }} />
        <motion.circle cx="165" cy="60" r="8" fill="hsl(141 70% 40%)" {...pulseAnimation} style={{ animationDelay: '0.4s' }} />
        <motion.circle cx="35" cy="85" r="6" fill="hsl(280 80% 40%)" opacity="0.6" {...pulseAnimation} style={{ animationDelay: '0.6s' }} />
        <motion.circle cx="165" cy="85" r="6" fill="hsl(320 80% 40%)" opacity="0.6" {...pulseAnimation} style={{ animationDelay: '0.8s' }} />
        
        <text x="100" y="115" fontSize="8" fill="hsl(45 100% 60%)" textAnchor="middle">SEGURANÇA</text>
      </svg>
    ),

    integrations: (
      <svg viewBox="0 0 200 120" className="w-full h-full">
        {/* Spotify logo */}
        <motion.g {...floatAnimation}>
          <circle cx="55" cy="55" r="30" fill="hsl(141 70% 45%)" />
          <motion.path 
            d="M 40 45 Q 55 40 70 45" 
            fill="none" 
            stroke="hsl(220 25% 12%)" 
            strokeWidth="4" 
            strokeLinecap="round"
            {...pulseAnimation}
          />
          <motion.path 
            d="M 43 55 Q 55 51 67 55" 
            fill="none" 
            stroke="hsl(220 25% 12%)" 
            strokeWidth="4" 
            strokeLinecap="round"
            {...pulseAnimation}
            style={{ animationDelay: '0.2s' }}
          />
          <motion.path 
            d="M 46 65 Q 55 62 64 65" 
            fill="none" 
            stroke="hsl(220 25% 12%)" 
            strokeWidth="4" 
            strokeLinecap="round"
            {...pulseAnimation}
            style={{ animationDelay: '0.4s' }}
          />
          <text x="55" y="98" fontSize="8" fill="hsl(141 70% 60%)" textAnchor="middle">SPOTIFY</text>
        </motion.g>
        
        {/* Connection lines */}
        <motion.line x1="90" y1="55" x2="110" y2="55" stroke="hsl(185 100% 50%)" strokeWidth="2" strokeDasharray="4 2" {...dashAnimation} />
        
        {/* Weather cloud */}
        <motion.g {...floatAnimation} style={{ animationDelay: '0.5s' }}>
          <ellipse cx="145" cy="50" rx="25" ry="18" fill="hsl(185 100% 50%)" opacity="0.9" />
          <ellipse cx="135" cy="55" rx="15" ry="12" fill="hsl(185 100% 55%)" />
          <ellipse cx="155" cy="55" rx="18" ry="14" fill="hsl(185 100% 50%)" />
          
          {/* Sun behind cloud */}
          <motion.circle cx="160" cy="35" r="12" fill="hsl(45 100% 55%)" {...pulseAnimation} />
          <motion.g {...rotateAnimation} style={{ transformOrigin: '160px 35px' }}>
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
              <line 
                key={i}
                x1={160 + Math.cos(angle * Math.PI / 180) * 15}
                y1={35 + Math.sin(angle * Math.PI / 180) * 15}
                x2={160 + Math.cos(angle * Math.PI / 180) * 20}
                y2={35 + Math.sin(angle * Math.PI / 180) * 20}
                stroke="hsl(45 100% 55%)"
                strokeWidth="2"
                strokeLinecap="round"
              />
            ))}
          </motion.g>
          
          <text x="145" y="98" fontSize="8" fill="hsl(185 100% 60%)" textAnchor="middle">CLIMA</text>
        </motion.g>
      </svg>
    )
  };

  return (
    <div className={cn("flex items-center justify-center", className)} style={{ width, height }}>
      {illustrations[type]}
    </div>
  );
}

import { cn } from "@/lib/utils";

interface LogoGitHubProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showTagline?: boolean;
  showEnterprise?: boolean;
}

export function LogoGitHub({ 
  className, 
  size = "md",
  showTagline = true,
  showEnterprise = true
}: LogoGitHubProps) {
  const sizeClasses = {
    sm: {
      container: "p-4",
      tsi: "text-3xl",
      jukebox: "text-3xl",
      tagline: "text-[10px]",
      enterprise: "text-xs",
    },
    md: {
      container: "p-6",
      tsi: "text-4xl",
      jukebox: "text-4xl",
      tagline: "text-xs",
      enterprise: "text-sm",
    },
    lg: {
      container: "p-8",
      tsi: "text-5xl",
      jukebox: "text-5xl",
      tagline: "text-sm",
      enterprise: "text-base",
    },
    xl: {
      container: "p-10",
      tsi: "text-6xl",
      jukebox: "text-6xl",
      tagline: "text-base",
      enterprise: "text-lg",
    },
  };

  const styles = sizeClasses[size];

  return (
    <div 
      className={cn(
        "inline-flex flex-col items-center justify-center rounded-xl",
        "bg-gradient-to-br from-zinc-900 via-zinc-950 to-black",
        "border border-zinc-700/50",
        styles.container,
        className
      )}
    >
      {/* Main Logo */}
      <div className="flex items-baseline tracking-tight">
        {/* TSi - Silver/Platinum Neon */}
        <span 
          className={cn(
            "font-extrabold",
            styles.tsi,
            "logo-tsi-silver-neon"
          )}
        >
          TSi
        </span>
        
        {/* JUKEBOX - Cyan Neon */}
        <span 
          className={cn(
            "font-extrabold",
            styles.jukebox,
            "logo-jukebox-cyan-neon"
          )}
        >
          JUKEBOX
        </span>
      </div>

      {/* Enterprise Kiosk Music System Tagline */}
      {showTagline && (
        <span 
          className={cn(
            "font-medium tracking-[0.2em] uppercase mt-2",
            styles.tagline,
            "text-zinc-400"
          )}
        >
          Enterprise Kiosk Music System
        </span>
      )}

      {/* TSiJUKEBOX Enterprise */}
      {showEnterprise && (
        <div className="flex items-center gap-2 mt-3">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent w-12" />
          <span 
            className={cn(
              "font-bold tracking-wider",
              styles.enterprise,
              "logo-enterprise-gold-neon"
            )}
          >
            TSiJUKEBOX Enterprise
          </span>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent w-12" />
        </div>
      )}
    </div>
  );
}

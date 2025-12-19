import { useState, useCallback, useEffect, useRef } from 'react';

export interface SplashScreenConfig {
  /** Duração mínima do splash em ms (default: 2000) */
  minDuration?: number;
  /** Duração máxima do splash em ms (default: 10000) */
  maxDuration?: number;
  /** Esperar por recursos antes de completar */
  waitForResources?: boolean;
  /** Callback quando splash iniciar */
  onStart?: () => void;
  /** Callback quando splash completar */
  onComplete?: () => void;
  /** Armazenar estado no localStorage (não mostrar novamente) */
  persistSkip?: boolean;
  /** Chave do localStorage para persistSkip */
  storageKey?: string;
  /** Auto-iniciar o splash (default: true) */
  autoStart?: boolean;
}

export interface SplashScreenState {
  /** Se o splash screen está visível */
  isVisible: boolean;
  /** Progresso de 0 a 100 */
  progress: number;
  /** Se está na fase de saída (animação de exit) */
  isExiting: boolean;
  /** Se o splash foi pulado pelo usuário */
  wasSkipped: boolean;
  /** Se o splash já foi mostrado nesta sessão */
  hasBeenShown: boolean;
}

export interface UseSplashScreenReturn extends SplashScreenState {
  /** Pular o splash screen imediatamente */
  skip: () => void;
  /** Forçar completar o splash */
  complete: () => void;
  /** Definir progresso manualmente */
  setProgress: (value: number) => void;
  /** Incrementar progresso */
  incrementProgress: (amount: number) => void;
  /** Reiniciar o splash screen */
  restart: () => void;
  /** Marcar recurso como carregado */
  markResourceLoaded: (resourceId: string) => void;
  /** Recursos carregados */
  loadedResources: Set<string>;
}

const DEFAULT_CONFIG: Required<SplashScreenConfig> = {
  minDuration: 2000,
  maxDuration: 10000,
  waitForResources: false,
  onStart: () => {},
  onComplete: () => {},
  persistSkip: false,
  storageKey: 'tsijukebox_splash_shown',
  autoStart: true,
};

/**
 * Hook para gerenciar estado de loading da aplicação e transição automática
 * do splash screen para o conteúdo principal
 */
export function useSplashScreen(config?: SplashScreenConfig): UseSplashScreenReturn {
  const mergedConfig = { ...DEFAULT_CONFIG, ...config };
  
  // Verificar se deve pular baseado em persistência
  const shouldSkipFromStorage = mergedConfig.persistSkip && 
    typeof window !== 'undefined' && 
    localStorage.getItem(mergedConfig.storageKey) === 'true';

  const [state, setState] = useState<SplashScreenState>({
    isVisible: mergedConfig.autoStart && !shouldSkipFromStorage,
    progress: shouldSkipFromStorage ? 100 : 0,
    isExiting: false,
    wasSkipped: shouldSkipFromStorage,
    hasBeenShown: shouldSkipFromStorage,
  });

  const [loadedResources, setLoadedResources] = useState<Set<string>>(new Set());
  const startTimeRef = useRef<number>(Date.now());
  const hasStartedRef = useRef(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Handler para completar o splash
  const handleComplete = useCallback(() => {
    if (state.isExiting || !state.isVisible) return;
    
    setState((prev) => ({ ...prev, isExiting: true }));
    
    // Aguarda animação de saída
    setTimeout(() => {
      setState((prev) => ({ 
        ...prev, 
        isVisible: false, 
        progress: 100,
        hasBeenShown: true,
      }));
      
      if (mergedConfig.persistSkip) {
        try {
          localStorage.setItem(mergedConfig.storageKey, 'true');
        } catch {
          // Ignore storage errors
        }
      }
      
      mergedConfig.onComplete?.();
    }, 500);
  }, [state.isExiting, state.isVisible, mergedConfig]);

  // Auto-progress effect
  useEffect(() => {
    if (!state.isVisible || state.isExiting || shouldSkipFromStorage) return;

    if (!hasStartedRef.current) {
      hasStartedRef.current = true;
      startTimeRef.current = Date.now();
      mergedConfig.onStart?.();
    }

    intervalRef.current = setInterval(() => {
      setState((prev) => {
        if (prev.isExiting || !prev.isVisible) return prev;
        
        const elapsed = Date.now() - startTimeRef.current;
        const progressFromTime = Math.min(100, (elapsed / mergedConfig.minDuration) * 100);
        
        // Se waitForResources, progresso é limitado a 90% até recursos carregarem
        const maxProgress = mergedConfig.waitForResources ? 90 : 100;
        const newProgress = Math.min(progressFromTime, maxProgress);
        
        return { ...prev, progress: newProgress };
      });
    }, 50);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [state.isVisible, state.isExiting, shouldSkipFromStorage, mergedConfig]);

  // Auto-complete quando progresso atingir 100%
  useEffect(() => {
    if (state.progress >= 100 && !state.isExiting && state.isVisible) {
      handleComplete();
    }
  }, [state.progress, state.isExiting, state.isVisible, handleComplete]);

  // Timeout máximo
  useEffect(() => {
    if (!state.isVisible || shouldSkipFromStorage) return;
    
    const timeout = setTimeout(() => {
      if (state.isVisible && !state.isExiting) {
        handleComplete();
      }
    }, mergedConfig.maxDuration);

    return () => clearTimeout(timeout);
  }, [state.isVisible, state.isExiting, handleComplete, mergedConfig.maxDuration, shouldSkipFromStorage]);

  const skip = useCallback(() => {
    setState((prev) => ({ ...prev, wasSkipped: true }));
    handleComplete();
  }, [handleComplete]);

  const complete = useCallback(() => {
    setState((prev) => ({ ...prev, progress: 100 }));
  }, []);

  const setProgress = useCallback((value: number) => {
    setState((prev) => ({ ...prev, progress: Math.min(100, Math.max(0, value)) }));
  }, []);

  const incrementProgress = useCallback((amount: number) => {
    setState((prev) => ({ 
      ...prev, 
      progress: Math.min(100, Math.max(0, prev.progress + amount)) 
    }));
  }, []);

  const restart = useCallback(() => {
    if (mergedConfig.persistSkip) {
      try {
        localStorage.removeItem(mergedConfig.storageKey);
      } catch {
        // Ignore storage errors
      }
    }
    
    hasStartedRef.current = false;
    startTimeRef.current = Date.now();
    
    setState({
      isVisible: true,
      progress: 0,
      isExiting: false,
      wasSkipped: false,
      hasBeenShown: false,
    });
  }, [mergedConfig]);

  const markResourceLoaded = useCallback((resourceId: string) => {
    setLoadedResources((prev) => {
      const newSet = new Set(prev);
      newSet.add(resourceId);
      return newSet;
    });
    
    // Se waitForResources e este era o recurso esperado, permitir completar
    if (mergedConfig.waitForResources && state.progress >= 90) {
      setState((prev) => ({ ...prev, progress: 100 }));
    }
  }, [mergedConfig.waitForResources, state.progress]);

  return {
    ...state,
    skip,
    complete,
    setProgress,
    incrementProgress,
    restart,
    markResourceLoaded,
    loadedResources,
  };
}

export default useSplashScreen;

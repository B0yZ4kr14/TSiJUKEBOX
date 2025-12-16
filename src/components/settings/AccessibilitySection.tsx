import { useState, useEffect } from 'react';
import { Eye, Type, Zap, Monitor } from 'lucide-react';
import { SettingsSection } from './SettingsSection';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface AccessibilitySettings {
  highContrast: boolean;
  fontSize: number;
  reducedMotion: boolean;
}

const defaultAccessibility: AccessibilitySettings = {
  highContrast: false,
  fontSize: 100,
  reducedMotion: false,
};

const STORAGE_KEY = 'tsi_jukebox_accessibility';

export function AccessibilitySection() {
  const [settings, setSettings] = useState<AccessibilitySettings>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : defaultAccessibility;
    } catch {
      return defaultAccessibility;
    }
  });

  // Apply settings to document
  useEffect(() => {
    document.documentElement.setAttribute('data-high-contrast', String(settings.highContrast));
    document.documentElement.setAttribute('data-reduced-motion', String(settings.reducedMotion));
    document.documentElement.style.fontSize = `${settings.fontSize}%`;
    
    // Save to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  const updateSetting = <K extends keyof AccessibilitySettings>(
    key: K,
    value: AccessibilitySettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const resetToDefaults = () => {
    setSettings(defaultAccessibility);
    toast.success('Configurações de acessibilidade restauradas');
  };

  const instructions = {
    title: "👁️ O que são Configurações de Acessibilidade?",
    steps: [
      "Acessibilidade são ajustes que tornam o sistema mais fácil de usar para todos.",
      "Modo Alto Contraste: Aumenta a visibilidade usando cores mais fortes e fundos mais escuros.",
      "Tamanho da Fonte: Torna os textos maiores ou menores conforme sua necessidade.",
      "Reduzir Animações: Desliga movimentos e efeitos para quem prefere uma tela mais calma."
    ],
    tips: [
      "💡 O Modo Alto Contraste é ideal para ambientes muito iluminados",
      "💡 Aumente a fonte se você usa o Jukebox de longe",
      "💡 Reduza animações se você sente desconforto com movimentos na tela"
    ]
  };

  return (
    <SettingsSection
      icon={<Eye className="w-5 h-5 icon-neon-blue" />}
      title="Acessibilidade"
      description="Ajustes visuais para melhor experiência"
      instructions={instructions}
      delay={0.15}
    >
      <div className="space-y-6">
        {/* High Contrast Mode */}
        <div className="card-option-dark-3d rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Monitor className="w-5 h-5 icon-neon-blue" />
              <div>
                <Label className="text-kiosk-text font-medium">Modo Alto Contraste</Label>
                <p className="text-xs text-kiosk-text/70 mt-0.5">
                  Cores mais intensas e bordas mais visíveis
                </p>
              </div>
            </div>
            <Switch
              checked={settings.highContrast}
              onCheckedChange={(checked) => updateSetting('highContrast', checked)}
              variant="neon"
            />
          </div>
        </div>

        {/* Font Size */}
        <div className="card-option-dark-3d rounded-lg p-4 space-y-4">
          <div className="flex items-center gap-3">
            <Type className="w-5 h-5 icon-neon-blue" />
            <div className="flex-1">
              <Label className="text-kiosk-text font-medium">Tamanho da Fonte</Label>
              <p className="text-xs text-kiosk-text/70 mt-0.5">
                Ajuste o tamanho do texto: {settings.fontSize}%
              </p>
            </div>
            <span className="text-lg font-mono text-label-yellow min-w-[4rem] text-right">
              {settings.fontSize}%
            </span>
          </div>
          <Slider
            value={[settings.fontSize]}
            onValueChange={([value]) => updateSetting('fontSize', value)}
            min={80}
            max={150}
            step={5}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-kiosk-text/50">
            <span>Pequeno (80%)</span>
            <span>Normal (100%)</span>
            <span>Grande (150%)</span>
          </div>
        </div>

        {/* Reduced Motion */}
        <div className="card-option-dark-3d rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Zap className="w-5 h-5 icon-neon-blue" />
              <div>
                <Label className="text-kiosk-text font-medium">Reduzir Animações</Label>
                <p className="text-xs text-kiosk-text/70 mt-0.5">
                  Desativa movimentos e transições
                </p>
              </div>
            </div>
            <Switch
              checked={settings.reducedMotion}
              onCheckedChange={(checked) => updateSetting('reducedMotion', checked)}
              variant="neon"
            />
          </div>
        </div>

        {/* Reset Button */}
        <Button
          variant="outline"
          onClick={resetToDefaults}
          className="w-full button-outline-neon ripple-effect"
        >
          Restaurar Padrões
        </Button>
      </div>
    </SettingsSection>
  );
}

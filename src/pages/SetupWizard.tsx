import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  Music, 
  Palette, 
  Eye, 
  Cloud, 
  Sparkles,
  Volume2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { LogoBrand } from '@/components/ui/LogoBrand';
import { useSettings } from '@/contexts/SettingsContext';
import { toast } from 'sonner';

const SETUP_COMPLETE_KEY = 'tsi_jukebox_setup_complete';

type ThemeColor = 'blue' | 'green' | 'purple';

interface WizardStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const steps: WizardStep[] = [
  {
    id: 'welcome',
    title: 'Bem-vindo!',
    description: 'Vamos configurar seu TSi JUKEBOX',
    icon: <Music className="w-8 h-8" />,
  },
  {
    id: 'theme',
    title: 'Escolha seu Tema',
    description: 'Personalize as cores do sistema',
    icon: <Palette className="w-8 h-8" />,
  },
  {
    id: 'accessibility',
    title: 'Acessibilidade',
    description: 'Ajuste o tamanho e contraste',
    icon: <Eye className="w-8 h-8" />,
  },
  {
    id: 'connections',
    title: 'Conexões',
    description: 'Configure Spotify e Clima',
    icon: <Cloud className="w-8 h-8" />,
  },
  {
    id: 'complete',
    title: 'Tudo Pronto!',
    description: 'Configuração concluída',
    icon: <Sparkles className="w-8 h-8" />,
  },
];

export default function SetupWizard() {
  const navigate = useNavigate();
  const { theme, setTheme, weather, setWeatherConfig } = useSettings();
  const [currentStep, setCurrentStep] = useState(0);
  const [wizardData, setWizardData] = useState<{
    theme: ThemeColor;
    highContrast: boolean;
    fontSize: number;
    spotifyClientId: string;
    weatherApiKey: string;
    weatherCity: string;
  }>({
    theme: (theme as ThemeColor) || 'blue',
    highContrast: false,
    fontSize: 100,
    spotifyClientId: '',
    weatherApiKey: '',
    weatherCity: 'Montes Claros, MG',
  });

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      completeSetup();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (!isFirstStep) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const completeSetup = () => {
    // Apply theme
    setTheme(wizardData.theme as 'blue' | 'green' | 'purple');
    
    // Apply accessibility
    document.documentElement.setAttribute('data-high-contrast', String(wizardData.highContrast));
    document.documentElement.style.fontSize = `${wizardData.fontSize}%`;
    localStorage.setItem('tsi_jukebox_accessibility', JSON.stringify({
      highContrast: wizardData.highContrast,
      fontSize: wizardData.fontSize,
      reducedMotion: false,
    }));

    // Apply weather config if provided
    if (wizardData.weatherApiKey) {
      setWeatherConfig({
        apiKey: wizardData.weatherApiKey,
        city: wizardData.weatherCity,
        isEnabled: true,
      });
    }

    // Mark setup as complete
    localStorage.setItem(SETUP_COMPLETE_KEY, 'true');
    
    toast.success('Configuração concluída com sucesso!');
    navigate('/');
  };

  const skipSetup = () => {
    localStorage.setItem(SETUP_COMPLETE_KEY, 'true');
    navigate('/');
  };

  const renderStepContent = () => {
    switch (steps[currentStep].id) {
      case 'welcome':
        return (
          <div className="text-center space-y-6">
            <LogoBrand size="xl" showTagline animate centered />
            <div className="space-y-3 max-w-md mx-auto">
              <p className="text-lg text-kiosk-text">
                O TSi JUKEBOX é seu sistema de música inteligente.
              </p>
              <p className="text-kiosk-text/70">
                Nas próximas telas, vamos configurar o visual, acessibilidade e conexões
                para deixar tudo do seu jeito.
              </p>
            </div>
            <div className="flex items-center justify-center gap-4 pt-4">
              <Volume2 className="w-12 h-12 text-primary animate-pulse" />
            </div>
          </div>
        );

      case 'theme':
        return (
          <div className="space-y-6">
            <p className="text-center text-kiosk-text/70">
              Escolha a cor que mais combina com você:
            </p>
            <RadioGroup
              value={wizardData.theme}
              onValueChange={(value) => setWizardData(prev => ({ ...prev, theme: value as ThemeColor }))}
              className="grid grid-cols-3 gap-4"
            >
              {[
                { value: 'blue', label: 'Azul Neon', color: 'bg-cyan-500' },
                { value: 'green', label: 'Verde Tech', color: 'bg-green-500' },
                { value: 'purple', label: 'Roxo Vibrante', color: 'bg-purple-500' },
              ].map((option) => (
                <Label
                  key={option.value}
                  htmlFor={option.value}
                  className={`flex flex-col items-center gap-3 p-4 rounded-lg cursor-pointer transition-all border-2 ${
                    wizardData.theme === option.value
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <RadioGroupItem value={option.value} id={option.value} className="sr-only" />
                  <div className={`w-16 h-16 rounded-full ${option.color} shadow-lg`} />
                  <span className="text-sm font-medium text-kiosk-text">{option.label}</span>
                  {wizardData.theme === option.value && (
                    <Check className="w-5 h-5 text-primary" />
                  )}
                </Label>
              ))}
            </RadioGroup>
          </div>
        );

      case 'accessibility':
        return (
          <div className="space-y-6">
            <p className="text-center text-kiosk-text/70">
              Ajuste para sua melhor experiência visual:
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg card-option-dark-3d">
                <div>
                  <Label className="text-kiosk-text font-medium">Modo Alto Contraste</Label>
                  <p className="text-xs text-kiosk-text/70">Cores mais fortes e visíveis</p>
                </div>
                <Switch
                  checked={wizardData.highContrast}
                  onCheckedChange={(checked) => setWizardData(prev => ({ ...prev, highContrast: checked }))}
                />
              </div>

              <div className="p-4 rounded-lg card-option-dark-3d space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-kiosk-text font-medium">Tamanho da Fonte</Label>
                    <p className="text-xs text-kiosk-text/70">{wizardData.fontSize}%</p>
                  </div>
                  <span className="text-lg font-mono text-label-yellow">{wizardData.fontSize}%</span>
                </div>
                <Slider
                  value={[wizardData.fontSize]}
                  onValueChange={([value]) => setWizardData(prev => ({ ...prev, fontSize: value }))}
                  min={80}
                  max={150}
                  step={5}
                />
              </div>

              {/* Preview */}
              <div 
                className="p-4 rounded-lg border-2 border-border"
                style={{ fontSize: `${wizardData.fontSize}%` }}
              >
                <p className="font-bold">Prévia do Texto</p>
                <p className="text-sm text-kiosk-text/70">Este é o tamanho que os textos terão.</p>
              </div>
            </div>
          </div>
        );

      case 'connections':
        return (
          <div className="space-y-6">
            <p className="text-center text-kiosk-text/70">
              Configure suas conexões (opcional):
            </p>

            <div className="space-y-4">
              {/* Weather Config */}
              <div className="p-4 rounded-lg card-option-dark-3d space-y-3">
                <div className="flex items-center gap-2">
                  <Cloud className="w-5 h-5 icon-neon-blue" />
                  <Label className="text-label-yellow">Widget de Clima</Label>
                </div>
                <Input
                  placeholder="Chave API OpenWeatherMap (opcional)"
                  value={wizardData.weatherApiKey}
                  onChange={(e) => setWizardData(prev => ({ ...prev, weatherApiKey: e.target.value }))}
                  className="bg-background/50"
                />
                <Input
                  placeholder="Cidade (ex: São Paulo, BR)"
                  value={wizardData.weatherCity}
                  onChange={(e) => setWizardData(prev => ({ ...prev, weatherCity: e.target.value }))}
                  className="bg-background/50"
                />
                <p className="text-xs text-kiosk-text/50">
                  Obtenha sua chave gratuita em openweathermap.org
                </p>
              </div>

              <p className="text-xs text-center text-kiosk-text/50">
                Você pode configurar mais opções depois em Configurações.
              </p>
            </div>
          </div>
        );

      case 'complete':
        return (
          <div className="text-center space-y-6">
            <div className="w-24 h-24 mx-auto rounded-full bg-green-500/20 flex items-center justify-center">
              <Check className="w-12 h-12 text-green-500" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-kiosk-text">Configuração Concluída!</h3>
              <p className="text-kiosk-text/70">
                Seu TSi JUKEBOX está pronto para uso.
              </p>
            </div>
            <div className="p-4 rounded-lg card-option-dark-3d text-left space-y-2">
              <p className="text-sm text-label-yellow">Resumo:</p>
              <ul className="text-sm text-kiosk-text/70 space-y-1">
                <li>• Tema: {wizardData.theme === 'blue' ? 'Azul Neon' : wizardData.theme === 'green' ? 'Verde Tech' : 'Roxo Vibrante'}</li>
                <li>• Fonte: {wizardData.fontSize}%</li>
                <li>• Alto Contraste: {wizardData.highContrast ? 'Ativado' : 'Desativado'}</li>
                <li>• Clima: {wizardData.weatherApiKey ? 'Configurado' : 'Não configurado'}</li>
              </ul>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-kiosk-bg flex flex-col">
      {/* Progress Bar */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  index < currentStep
                    ? 'bg-primary text-primary-foreground'
                    : index === currentStep
                    ? 'bg-primary/20 text-primary border-2 border-primary'
                    : 'bg-kiosk-surface text-kiosk-text/50'
                }`}
              >
                {index < currentStep ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <span className="text-sm font-medium">{index + 1}</span>
                )}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-full h-1 mx-2 rounded ${
                    index < currentStep ? 'bg-primary' : 'bg-kiosk-surface'
                  }`}
                  style={{ width: '60px' }}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-lg"
          >
            {/* Step Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                {steps[currentStep].icon}
              </div>
              <h2 className="text-2xl font-bold text-kiosk-text">{steps[currentStep].title}</h2>
              <p className="text-kiosk-text/70">{steps[currentStep].description}</p>
            </div>

            {/* Step Content */}
            <div className="mb-8">
              {renderStepContent()}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="p-6 border-t border-border">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <Button
            variant="ghost"
            onClick={isFirstStep ? skipSetup : handlePrev}
            className="text-kiosk-text/70 hover:text-kiosk-text"
          >
            {isFirstStep ? (
              'Pular Configuração'
            ) : (
              <>
                <ChevronLeft className="w-4 h-4 mr-2" />
                Voltar
              </>
            )}
          </Button>

          <Button onClick={handleNext} className="button-primary-glow-3d">
            {isLastStep ? (
              <>
                Começar a Usar
                <Check className="w-4 h-4 ml-2" />
              </>
            ) : (
              <>
                Próximo
                <ChevronRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

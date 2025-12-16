import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Palette, Check, Sun, Moon, Eye, Zap } from 'lucide-react';
import { KioskLayout } from '@/components/layout/KioskLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { LogoBrand } from '@/components/ui/LogoBrand';
import { useSettings, ThemeColor } from '@/contexts/SettingsContext';
import { toast } from 'sonner';

const themes: { id: ThemeColor; name: string; description: string; color: string; gradient: string }[] = [
  { 
    id: 'blue', 
    name: 'Neon Azul',
    description: 'Tecnológico e moderno',
    color: 'hsl(195 100% 50%)',
    gradient: 'from-cyan-500 to-blue-600'
  },
  { 
    id: 'green', 
    name: 'Neon Verde',
    description: 'Vibrante e energético',
    color: 'hsl(145 100% 45%)',
    gradient: 'from-emerald-500 to-green-600'
  },
  { 
    id: 'purple', 
    name: 'Neon Roxo',
    description: 'Elegante e sofisticado',
    color: 'hsl(280 100% 60%)',
    gradient: 'from-purple-500 to-violet-600'
  },
];

export default function ThemePreview() {
  const navigate = useNavigate();
  const { theme, setTheme } = useSettings();
  const [previewTheme, setPreviewTheme] = useState<ThemeColor>(theme);
  const [previewHighContrast, setPreviewHighContrast] = useState(false);
  const [previewFontSize, setPreviewFontSize] = useState(100);

  const applyTheme = (newTheme: ThemeColor) => {
    document.documentElement.classList.add('theme-transitioning');
    setTheme(newTheme);
    setPreviewTheme(newTheme);
    setTimeout(() => {
      document.documentElement.classList.remove('theme-transitioning');
    }, 600);
    toast.success(`Tema "${themes.find(t => t.id === newTheme)?.name}" aplicado!`);
  };

  // Apply preview theme to document temporarily
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', previewTheme);
    return () => {
      document.documentElement.setAttribute('data-theme', theme);
    };
  }, [previewTheme]);

  const currentThemeData = themes.find(t => t.id === previewTheme)!;

  return (
    <KioskLayout>
      <motion.div
        className="min-h-screen bg-kiosk-background p-4 md:p-8 overflow-y-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {/* Logo */}
        <motion.div
          className="flex justify-center mb-6"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <LogoBrand size="md" animate />
        </motion.div>

        {/* Header */}
        <motion.header
          className="flex items-center gap-4 mb-8"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <Link to="/settings">
            <Button
              variant="ghost"
              size="icon"
              className="w-12 h-12 rounded-full bg-kiosk-surface hover:bg-kiosk-surface/80 button-3d"
            >
              <ArrowLeft className="w-6 h-6 text-kiosk-text" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gold-neon">Preview de Temas</h1>
            <p className="text-kiosk-text/75 text-sm">Visualize todas as cores e efeitos antes de aplicar</p>
          </div>
        </motion.header>

        <div className="max-w-6xl mx-auto space-y-8 pb-8">
          {/* Theme Selector */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-3 gap-4"
          >
            {themes.map((themeOption) => (
              <motion.button
                key={themeOption.id}
                onClick={() => setPreviewTheme(themeOption.id)}
                className={`
                  relative flex flex-col items-center justify-center gap-3 p-6 rounded-2xl
                  transition-all duration-300 ripple-effect
                  ${previewTheme === themeOption.id ? 'card-option-selected-3d' : 'card-option-dark-3d'}
                `}
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.98 }}
              >
                <div 
                  className={`w-16 h-16 rounded-full bg-gradient-to-br ${themeOption.gradient} shadow-2xl`}
                  style={{
                    boxShadow: previewTheme === themeOption.id 
                      ? `0 0 40px ${themeOption.color}, 0 0 80px ${themeOption.color}50`
                      : `0 0 20px ${themeOption.color}40`
                  }}
                />
                <div className="text-center">
                  <p className={`font-semibold ${previewTheme === themeOption.id ? 'text-label-yellow' : 'text-kiosk-text'}`}>
                    {themeOption.name}
                  </p>
                  <p className="text-xs text-kiosk-text/60 mt-1">{themeOption.description}</p>
                </div>
                {previewTheme === themeOption.id && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-3 right-3 w-6 h-6 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center"
                  >
                    <Check className="w-4 h-4 text-black" />
                  </motion.div>
                )}
              </motion.button>
            ))}
          </motion.div>

          {/* Component Showcase */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="card-admin-extreme-3d bg-kiosk-surface/90">
              <CardHeader>
                <CardTitle className="text-gold-neon flex items-center gap-2">
                  <Palette className="w-5 h-5 icon-neon-blue" />
                  Demonstração de Componentes - {currentThemeData.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Buttons Section */}
                <div className="space-y-4">
                  <h3 className="text-label-yellow font-medium">Botões</h3>
                  <div className="flex flex-wrap gap-3">
                    <Button className="button-primary-glow-3d ripple-effect">
                      Botão Primário
                    </Button>
                    <Button variant="outline" className="button-outline-neon ripple-effect">
                      Botão Outline
                    </Button>
                    <Button variant="outline" className="button-action-neon ripple-effect">
                      Botão Ação
                    </Button>
                    <Button variant="outline" className="button-destructive-neon ripple-effect">
                      Botão Destrutivo
                    </Button>
                  </div>
                </div>

                {/* Cards Section */}
                <div className="space-y-4">
                  <h3 className="text-label-yellow font-medium">Cards</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="card-option-dark-3d rounded-lg p-4">
                      <p className="text-kiosk-text font-medium">Card Normal</p>
                      <p className="text-xs text-kiosk-text/60 mt-1">Estado padrão</p>
                    </div>
                    <div className="card-option-selected-3d rounded-lg p-4">
                      <p className="text-kiosk-text font-medium">Card Selecionado</p>
                      <p className="text-xs text-kiosk-text/60 mt-1">Estado ativo</p>
                    </div>
                    <div className="card-neon-border rounded-lg p-4 bg-kiosk-surface">
                      <p className="text-kiosk-text font-medium">Card Neon</p>
                      <p className="text-xs text-kiosk-text/60 mt-1">Borda brilhante</p>
                    </div>
                  </div>
                </div>

                {/* Form Elements */}
                <div className="space-y-4">
                  <h3 className="text-label-yellow font-medium">Formulários</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-settings-label text-sm">Input de Texto</label>
                      <Input 
                        placeholder="Digite algo..." 
                        className="input-3d bg-kiosk-bg"
                      />
                    </div>
                    <div className="card-option-dark-3d rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-kiosk-text">Switch Neon</span>
                        <Switch variant="neon" defaultChecked />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Badges & Text */}
                <div className="space-y-4">
                  <h3 className="text-label-yellow font-medium">Badges e Textos</h3>
                  <div className="flex flex-wrap gap-3 items-center">
                    <Badge variant="default">Badge Padrão</Badge>
                    <Badge variant="secondary">Badge Secundário</Badge>
                    <Badge variant="outline" className="border-primary text-primary">Badge Outline</Badge>
                    <span className="text-gold-neon font-medium">Texto Dourado</span>
                    <span className="text-label-yellow">Label Amarelo</span>
                    <span className="text-label-orange">Label Laranja</span>
                  </div>
                </div>

                {/* Icons */}
                <div className="space-y-4">
                  <h3 className="text-label-yellow font-medium">Ícones com Glow</h3>
                  <div className="flex gap-6">
                    <div className="flex flex-col items-center gap-2">
                      <Sun className="w-8 h-8 icon-neon-blue" />
                      <span className="text-xs text-kiosk-text/60">Neon Blue</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <Moon className="w-8 h-8 icon-neon-blue-hover" />
                      <span className="text-xs text-kiosk-text/60">Hover Effect</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <Zap className="w-8 h-8 text-label-yellow" style={{ filter: 'drop-shadow(0 0 8px hsl(45 100% 50%))' }} />
                      <span className="text-xs text-kiosk-text/60">Yellow Glow</span>
                    </div>
                  </div>
                </div>

                {/* Progress/Slider */}
                <div className="space-y-4">
                  <h3 className="text-label-yellow font-medium">Controles Deslizantes</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-settings-label text-sm">Slider de Volume</label>
                      <Slider defaultValue={[70]} max={100} step={1} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Apply Button */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex gap-4"
          >
            <Button
              onClick={() => applyTheme(previewTheme)}
              disabled={previewTheme === theme}
              className="flex-1 button-primary-glow-3d ripple-effect h-14 text-lg"
            >
              <Check className="w-5 h-5 mr-2" />
              {previewTheme === theme ? 'Tema Atual' : `Aplicar Tema ${currentThemeData.name}`}
            </Button>
            <Link to="/settings" className="flex-shrink-0">
              <Button variant="outline" className="button-outline-neon h-14 px-8">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Voltar
              </Button>
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </KioskLayout>
  );
}

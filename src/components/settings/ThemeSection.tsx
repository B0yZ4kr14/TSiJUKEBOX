import { Palette, Check, Download, Upload, Eye } from 'lucide-react';
import { SettingsSection } from './SettingsSection';
import { useSettings, ThemeColor } from '@/contexts/SettingsContext';
import { useTranslation } from '@/hooks/useTranslation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

const themes: { id: ThemeColor; name: string; color: string; gradient: string }[] = [
  { 
    id: 'blue', 
    name: 'Neon Azul',
    color: 'hsl(195 100% 50%)',
    gradient: 'from-cyan-500 to-blue-600'
  },
  { 
    id: 'green', 
    name: 'Neon Verde',
    color: 'hsl(145 100% 45%)',
    gradient: 'from-emerald-500 to-green-600'
  },
  { 
    id: 'purple', 
    name: 'Neon Roxo',
    color: 'hsl(280 100% 60%)',
    gradient: 'from-purple-500 to-violet-600'
  },
];

interface ExportedSettings {
  version: string;
  exportDate: string;
  theme: ThemeColor;
  language: string;
  accessibility?: {
    highContrast: boolean;
    fontSize: number;
    reducedMotion: boolean;
  };
  weather?: {
    city: string;
    isEnabled: boolean;
  };
}

export function ThemeSection() {
  const { theme, setTheme, language, weather } = useSettings();
  const { t } = useTranslation();

  const handleThemeChange = (newTheme: ThemeColor) => {
    // Add transitioning class for smooth morphing
    document.documentElement.classList.add('theme-transitioning');
    
    setTheme(newTheme);
    
    // Remove class after transition completes
    setTimeout(() => {
      document.documentElement.classList.remove('theme-transitioning');
    }, 600);
  };

  const exportSettings = () => {
    try {
      // Gather all settings
      const accessibilityData = localStorage.getItem('tsi_jukebox_accessibility');
      const accessibility = accessibilityData ? JSON.parse(accessibilityData) : null;

      const exportData: ExportedSettings = {
        version: '1.0',
        exportDate: new Date().toISOString(),
        theme,
        language,
        ...(accessibility && { accessibility }),
        weather: {
          city: weather.city,
          isEnabled: weather.isEnabled,
        },
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `tsi-jukebox-settings-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success('Configurações exportadas com sucesso!');
    } catch (error) {
      toast.error('Erro ao exportar configurações');
    }
  };

  const importSettings = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      try {
        const text = await file.text();
        const data: ExportedSettings = JSON.parse(text);

        // Validate version
        if (!data.version || !data.theme) {
          throw new Error('Arquivo de configuração inválido');
        }

        // Apply theme with transition
        document.documentElement.classList.add('theme-transitioning');
        setTheme(data.theme);
        setTimeout(() => {
          document.documentElement.classList.remove('theme-transitioning');
        }, 600);

        // Apply accessibility settings if present
        if (data.accessibility) {
          localStorage.setItem('tsi_jukebox_accessibility', JSON.stringify(data.accessibility));
          document.documentElement.setAttribute('data-high-contrast', String(data.accessibility.highContrast));
          document.documentElement.setAttribute('data-reduced-motion', String(data.accessibility.reducedMotion));
          document.documentElement.style.fontSize = `${data.accessibility.fontSize}%`;
        }

        toast.success('Configurações importadas com sucesso! Recarregue a página para aplicar todas as mudanças.');
      } catch (error) {
        toast.error('Erro ao importar configurações. Verifique se o arquivo é válido.');
      }
    };

    input.click();
  };

  const instructions = {
    title: "🎨 O que são Temas de Cores?",
    steps: [
      "Os temas mudam a cor principal de todo o sistema do Jukebox.",
      "Neon Azul: Cor padrão, transmite tecnologia e modernidade.",
      "Neon Verde: Cor vibrante, ideal para ambientes descontraídos.",
      "Neon Roxo: Cor elegante, perfeito para ambientes sofisticados.",
      "Você pode exportar suas configurações para usar em outro Jukebox!"
    ],
    tips: [
      "💡 Clique em 'Preview Completo' para ver todas as cores antes de escolher",
      "💡 Use 'Exportar' para fazer backup das suas preferências",
      "💡 A transição entre temas é suave e animada"
    ]
  };

  return (
    <SettingsSection
      icon={<Palette className="w-5 h-5 icon-neon-blue" />}
      title="Tema de Cores"
      description="Personalize a aparência visual do sistema"
      instructions={instructions}
      delay={0.15}
    >
      <div className="space-y-4">
        {/* Theme Selection */}
        <div className="grid grid-cols-3 gap-3">
          {themes.map((themeOption) => (
            <motion.button
              key={themeOption.id}
              onClick={() => handleThemeChange(themeOption.id)}
              className={`
                relative flex flex-col items-center justify-center gap-2 p-4 rounded-xl
                transition-all duration-300 ripple-effect
                ${theme === themeOption.id ? 'card-option-selected-3d' : 'card-option-dark-3d'}
              `}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Color preview circle */}
              <div 
                className={`
                  w-10 h-10 rounded-full bg-gradient-to-br ${themeOption.gradient}
                  shadow-lg transition-all duration-300
                `}
                style={{
                  boxShadow: theme === themeOption.id 
                    ? `0 0 30px ${themeOption.color}, 0 0 60px ${themeOption.color}50`
                    : `0 0 15px ${themeOption.color}40`
                }}
              />
              
              {/* Label */}
              <span className={`text-xs font-medium ${theme === themeOption.id ? 'text-label-yellow' : 'text-kiosk-text/80'}`}>
                {themeOption.name}
              </span>

              {/* Selected indicator */}
              {theme === themeOption.id && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-2 right-2 w-5 h-5 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center"
                >
                  <Check className="w-3 h-3 text-black" />
                </motion.div>
              )}
            </motion.button>
          ))}
        </div>

        {/* Preview Link */}
        <Link to="/theme-preview">
          <Button
            variant="outline"
            className="w-full button-outline-neon ripple-effect"
          >
            <Eye className="w-4 h-4 mr-2" />
            Ver Preview Completo dos Temas
          </Button>
        </Link>

        {/* Export/Import Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            onClick={exportSettings}
            className="button-action-neon ripple-effect"
          >
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
          <Button
            variant="outline"
            onClick={importSettings}
            className="button-action-neon ripple-effect"
          >
            <Upload className="w-4 h-4 mr-2" />
            Importar
          </Button>
        </div>
      </div>
    </SettingsSection>
  );
}

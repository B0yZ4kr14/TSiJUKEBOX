import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  GripVertical, Cloud, Hand, Bookmark, Sparkles, 
  ArrowLeft, Copy, Check, Eye, EyeOff
} from 'lucide-react';
import { LogoBrand } from '@/components/ui/LogoBrand';
import { PageTitle } from '@/components/ui/PageTitle';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface WcagException {
  id: string;
  file: string;
  opacity: string;
  element: string;
  justification: string;
  hasHoverState: boolean;
  hoverColor?: string;
  category: 'decorative' | 'state-change' | 'disabled' | 'secondary';
}

const WCAG_EXCEPTIONS: WcagException[] = [
  {
    id: 'queue-grip',
    file: 'QueuePanel.tsx',
    opacity: '/20',
    element: 'GripVertical icon',
    justification: 'Ícone de drag-drop invisível por padrão, aparece no group-hover',
    hasHoverState: true,
    hoverColor: 'opacity-100',
    category: 'state-change',
  },
  {
    id: 'cloud-unconfigured',
    file: 'CloudConnectionSection.tsx',
    opacity: '/20',
    element: 'Cloud icon',
    justification: 'Ícone decorativo em estado não configurado',
    hasHoverState: false,
    category: 'decorative',
  },
  {
    id: 'gesture-demo',
    file: 'InteractiveTestMode.tsx',
    opacity: '/40',
    element: 'Hand gesture icons',
    justification: 'Demonstração visual de gestos, não é conteúdo crítico',
    hasHoverState: false,
    category: 'decorative',
  },
  {
    id: 'bookmark-inactive',
    file: 'WikiArticle.tsx',
    opacity: '/40',
    element: 'Bookmark icon',
    justification: 'Estado inativo com transição para yellow-500 no hover',
    hasHoverState: true,
    hoverColor: 'text-yellow-500',
    category: 'state-change',
  },
  {
    id: 'search-placeholder',
    file: 'SpotifySearch.tsx',
    opacity: '/40',
    element: 'Search placeholder text',
    justification: 'Placeholder decorativo com texto principal visível',
    hasHoverState: false,
    category: 'secondary',
  },
  {
    id: 'setup-wizard-step',
    file: 'SetupWizard.tsx',
    opacity: '/50',
    element: 'Step indicator',
    justification: 'Indicador secundário de etapa, step principal é visível',
    hasHoverState: false,
    category: 'secondary',
  },
  {
    id: 'clients-monitor-bg',
    file: 'ClientsMonitorDashboard.tsx',
    opacity: '/30',
    element: 'Background pattern',
    justification: 'Elemento decorativo de background sem informação',
    hasHoverState: false,
    category: 'decorative',
  },
  {
    id: 'spotify-panel-tab',
    file: 'SpotifyPanel.tsx',
    opacity: '/50',
    element: 'Inactive tab indicator',
    justification: 'Tab inativa com contraste reduzido, tab ativa visível',
    hasHoverState: true,
    hoverColor: 'text-kiosk-text/90',
    category: 'state-change',
  },
  {
    id: 'youtube-modal-hint',
    file: 'AddToPlaylistModal.tsx',
    opacity: '/50',
    element: 'Helper text',
    justification: 'Texto de ajuda secundário, ação principal clara',
    hasHoverState: false,
    category: 'secondary',
  },
];

const ExceptionDemo = ({ exception }: { exception: WcagException }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const renderIcon = () => {
    const baseClass = `w-8 h-8 transition-all duration-300`;
    const normalClass = `text-kiosk-text${exception.opacity}`;
    const hoverClass = isHovered && exception.hasHoverState 
      ? exception.hoverColor 
      : normalClass;
    
    switch (exception.id) {
      case 'queue-grip':
        return <GripVertical className={`${baseClass} ${hoverClass}`} />;
      case 'cloud-unconfigured':
        return <Cloud className={`${baseClass} ${hoverClass}`} />;
      case 'gesture-demo':
        return <Hand className={`${baseClass} ${hoverClass}`} />;
      case 'bookmark-inactive':
        return <Bookmark className={`${baseClass} ${hoverClass}`} />;
      default:
        return <Sparkles className={`${baseClass} ${hoverClass}`} />;
    }
  };

  const commentCode = `{/* WCAG Exception: ${exception.opacity} ${exception.element} - ${exception.justification} */}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(commentCode);
    setCopied(true);
    toast.success('Código copiado!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card 
      className="card-neon-border bg-kiosk-surface/50"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-gold-neon text-sm">{exception.file}</CardTitle>
          <Badge variant="outline" className="text-cyan-400 border-cyan-500/30">
            {exception.opacity}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          {/* Normal State */}
          <div className="flex flex-col items-center p-4 bg-kiosk-bg/50 rounded-lg flex-1">
            <span className="text-xs text-kiosk-text/85 mb-2 flex items-center gap-1">
              <EyeOff className="w-3 h-3" /> Normal
            </span>
            <div className={`text-kiosk-text${exception.opacity}`}>{renderIcon()}</div>
          </div>
          
          {/* Arrow */}
          {exception.hasHoverState && (
            <motion.div 
              animate={{ x: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 1 }}
              className="text-cyan-400 text-xl"
            >
              →
            </motion.div>
          )}
          
          {/* Hover State */}
          {exception.hasHoverState && (
            <div className="flex flex-col items-center p-4 bg-kiosk-bg/50 rounded-lg border border-cyan-500/30 flex-1">
              <span className="text-xs text-kiosk-text/85 mb-2 flex items-center gap-1">
                <Eye className="w-3 h-3" /> Hover
              </span>
              <div className={exception.hoverColor}>{renderIcon()}</div>
            </div>
          )}
        </div>
        
        <p className="text-sm text-kiosk-text/85">{exception.justification}</p>
        
        <div className="relative">
          <div className="p-2 bg-kiosk-bg rounded text-xs font-mono text-cyan-400/80 pr-10 overflow-x-auto">
            {commentCode}
          </div>
          <Button 
            size="icon" 
            variant="ghost" 
            className="absolute right-1 top-1 h-6 w-6"
            onClick={handleCopy}
          >
            {copied ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default function WcagExceptions() {
  const navigate = useNavigate();
  
  const categories = {
    'decorative': { label: 'Decorativos', description: 'Ícones puramente visuais sem informação crítica', color: 'text-purple-400' },
    'state-change': { label: 'Mudança de Estado', description: 'Elementos com hover/focus que aumentam contraste', color: 'text-cyan-400' },
    'disabled': { label: 'Desabilitados', description: 'Estados desabilitados intencionalmente dimmed', color: 'text-gray-400' },
    'secondary': { label: 'Secundários', description: 'Informação secundária com elemento principal visível', color: 'text-amber-400' },
  };

  const getCategoryCount = (category: string) => 
    WCAG_EXCEPTIONS.filter(e => e.category === category).length;

  return (
    <div className="min-h-screen bg-kiosk-bg p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate(-1)}
            className="text-kiosk-text/85 hover:text-kiosk-text"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <LogoBrand variant="metal" size="sm" />
        </div>
        
        <PageTitle 
          title="Exceções WCAG Documentadas"
          subtitle="Visualização interativa de todos os elementos com contraste reduzido intencional"
        />
        
        {/* Criteria Card */}
        <Card className="card-neon-border bg-kiosk-surface/30 my-8">
          <CardHeader>
            <CardTitle className="text-gold-neon">Critérios para Exceções Válidas</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(categories).map(([key, { label, description, color }]) => (
              <div key={key} className="flex items-start gap-3 p-3 bg-kiosk-bg/30 rounded-lg">
                <Badge variant="outline" className={`${color} border-current/30`}>
                  {getCategoryCount(key)}
                </Badge>
                <div>
                  <h4 className="text-kiosk-text/90 font-medium">{label}</h4>
                  <p className="text-sm text-kiosk-text/75">{description}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        
        {/* Tabs */}
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList className="bg-kiosk-surface/50 flex-wrap h-auto gap-1 p-1">
            <TabsTrigger value="all" className="data-[state=active]:bg-kiosk-primary/20">
              Todas ({WCAG_EXCEPTIONS.length})
            </TabsTrigger>
            {Object.entries(categories).map(([key, { label }]) => (
              <TabsTrigger 
                key={key} 
                value={key}
                className="data-[state=active]:bg-kiosk-primary/20"
              >
                {label} ({getCategoryCount(key)})
              </TabsTrigger>
            ))}
          </TabsList>
          
          <TabsContent value="all">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {WCAG_EXCEPTIONS.map(exception => (
                <ExceptionDemo key={exception.id} exception={exception} />
              ))}
            </div>
          </TabsContent>
          
          {Object.keys(categories).map(category => (
            <TabsContent key={category} value={category}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {WCAG_EXCEPTIONS.filter(e => e.category === category).map(exception => (
                  <ExceptionDemo key={exception.id} exception={exception} />
                ))}
              </div>
              {getCategoryCount(category) === 0 && (
                <div className="text-center py-12 text-kiosk-text/60">
                  Nenhuma exceção nesta categoria
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
        
        {/* Footer info */}
        <Card className="card-neon-border bg-kiosk-surface/30 mt-8">
          <CardContent className="p-4">
            <h3 className="text-gold-neon font-medium mb-2">Como Documentar uma Nova Exceção</h3>
            <ol className="text-sm text-kiosk-text/85 space-y-2 list-decimal list-inside">
              <li>Adicione um comentário WCAG na linha anterior ao elemento</li>
              <li>Inclua a opacidade, elemento e justificativa</li>
              <li>Execute <code className="bg-kiosk-bg px-1 rounded text-cyan-400">npm run wcag:validate</code> para verificar</li>
              <li>Atualize esta página com a nova exceção se necessário</li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

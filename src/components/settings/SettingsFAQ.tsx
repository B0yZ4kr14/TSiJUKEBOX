import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HelpCircle, 
  Search, 
  ChevronDown, 
  ChevronUp,
  Lightbulb,
  Plug,
  Database,
  Settings2,
  Palette,
  Shield,
  Globe
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { SettingsCategoryId } from '@/hooks/useSettingsStatus';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: SettingsCategoryId;
  tags: string[];
  tips?: string[];
}

const faqItems: FAQItem[] = [
  // Conexões
  {
    id: 'faq-backend-offline',
    question: 'O que significa "Backend não disponível"?',
    answer: 'Indica que o sistema não consegue se comunicar com o servidor de música. Isso pode acontecer se o servidor estiver desligado ou se a URL estiver incorreta. Você pode usar o Modo Demo para testar a interface sem um servidor.',
    category: 'connections',
    tags: ['backend', 'conexão', 'erro', 'offline'],
    tips: ['Verifique se o servidor está rodando', 'Confirme a URL da API nas configurações']
  },
  {
    id: 'faq-demo-mode',
    question: 'Quando devo usar o Modo Demo?',
    answer: 'O Modo Demo é ideal para testar a interface, fazer demonstrações ou quando você não tem acesso ao servidor real. Nesse modo, o sistema usa dados simulados para mostrar como tudo funciona.',
    category: 'connections',
    tags: ['demo', 'teste', 'simulação'],
    tips: ['Perfeito para aprender a usar o sistema', 'Não salva dados reais']
  },
  {
    id: 'faq-websocket-polling',
    question: 'Qual a diferença entre WebSocket e Polling?',
    answer: 'WebSocket mantém uma conexão constante com o servidor, permitindo atualizações instantâneas. Polling verifica periodicamente por mudanças. WebSocket é mais rápido, mas Polling pode ser mais estável em algumas redes.',
    category: 'connections',
    tags: ['websocket', 'polling', 'tempo real'],
    tips: ['Use WebSocket para melhor experiência', 'Polling é mais compatível com firewalls']
  },
  // Dados
  {
    id: 'faq-backup-frequency',
    question: 'Com que frequência devo fazer backup?',
    answer: 'Recomendamos backup diário automático para proteção ideal. Se você adiciona muitas músicas ou faz muitas alterações, considere backups mais frequentes. Mantenha pelo menos 3 cópias recentes.',
    category: 'data',
    tags: ['backup', 'frequência', 'proteção'],
    tips: ['Configure backup automático', 'Mantenha cópias em locais diferentes']
  },
  {
    id: 'faq-vacuum-database',
    question: 'O que faz o comando "Vacuum" no banco de dados?',
    answer: 'Vacuum reorganiza e compacta o banco de dados, recuperando espaço e melhorando a performance. É como uma "faxina" no banco de dados. Recomendamos executar mensalmente ou após excluir muitos dados.',
    category: 'data',
    tags: ['vacuum', 'otimização', 'database'],
    tips: ['Execute mensalmente', 'Pode demorar alguns minutos em bancos grandes']
  },
  {
    id: 'faq-cloud-backup',
    question: 'Preciso de backup na nuvem se já faço backup local?',
    answer: 'Backup na nuvem oferece proteção extra contra perda total (incêndio, roubo, falha de disco). É altamente recomendado ter ambos: local para recuperação rápida, nuvem para proteção contra desastres.',
    category: 'data',
    tags: ['cloud', 'nuvem', 'segurança'],
    tips: ['Google Drive e Dropbox oferecem planos gratuitos', 'Configure sincronização automática']
  },
  // Sistema
  {
    id: 'faq-grafana-prometheus',
    question: 'Para que servem o Grafana e Prometheus?',
    answer: 'Grafana mostra gráficos bonitos do desempenho do sistema (uso de CPU, memória, etc). Prometheus coleta essas métricas. São ferramentas para administradores monitorarem a saúde do sistema.',
    category: 'system',
    tags: ['grafana', 'prometheus', 'monitoramento'],
    tips: ['Grafana fica em http://localhost:3000', 'Prometheus em http://localhost:9090']
  },
  {
    id: 'faq-ntp-sync',
    question: 'Por que sincronizar o horário (NTP)?',
    answer: 'Horário correto é importante para logs, agendamentos de backup e exibição da data/hora na tela. O NTP sincroniza automaticamente com servidores de tempo da internet.',
    category: 'system',
    tags: ['ntp', 'horário', 'sincronização'],
    tips: ['Mantenha sempre ativado', 'Útil para correlacionar eventos nos logs']
  },
  // Aparência
  {
    id: 'faq-change-theme',
    question: 'Como mudar as cores do sistema?',
    answer: 'Vá em Configurações > Aparência > Tema de Cores. Você pode escolher entre temas pré-definidos (Azul, Verde, Roxo) ou criar temas personalizados com gradientes e cores específicas.',
    category: 'appearance',
    tags: ['tema', 'cores', 'personalização'],
    tips: ['Temas escuros são melhores para ambientes com pouca luz', 'Salve temas personalizados para usar depois']
  },
  {
    id: 'faq-high-contrast',
    question: 'Quando usar o modo Alto Contraste?',
    answer: 'O modo Alto Contraste aumenta a diferença entre cores, tornando o texto mais legível. Recomendado para pessoas com dificuldades visuais ou ambientes com muita luz externa.',
    category: 'appearance',
    tags: ['contraste', 'acessibilidade', 'visão'],
    tips: ['Combine com aumento de fonte se necessário', 'Pode ser ativado rapidamente nas configurações']
  },
  // Segurança
  {
    id: 'faq-default-credentials',
    question: 'Por que devo mudar as credenciais padrão?',
    answer: 'As credenciais padrão (tsi/connect) são conhecidas publicamente. Qualquer pessoa com acesso à rede poderia acessar seu sistema. Crie usuários personalizados com senhas fortes para maior segurança.',
    category: 'security',
    tags: ['senha', 'credenciais', 'segurança'],
    tips: ['Use senhas com letras, números e símbolos', 'Cada pessoa deve ter seu próprio usuário']
  },
  {
    id: 'faq-user-roles',
    question: 'Qual a diferença entre Admin, Usuário e Novato?',
    answer: 'Admin: acesso total, pode configurar tudo. Usuário: pode usar o sistema normalmente e fazer algumas alterações. Novato: acesso limitado, apenas para ouvir músicas sem poder alterar configurações.',
    category: 'security',
    tags: ['permissões', 'roles', 'acesso'],
    tips: ['Dê apenas as permissões necessárias', 'Admins devem ser pessoas de confiança']
  },
  // Integrações
  {
    id: 'faq-spotify-connect',
    question: 'Como conectar minha conta do Spotify?',
    answer: 'Primeiro, crie um aplicativo no Spotify Developer Dashboard. Copie o Client ID e Client Secret para as configurações. Depois, clique em "Conectar com Spotify" e autorize o acesso.',
    category: 'integrations',
    tags: ['spotify', 'conexão', 'música'],
    tips: ['Conta Premium oferece mais funcionalidades', 'O token expira - reconecte se necessário']
  },
  {
    id: 'faq-weather-api',
    question: 'Como configurar o widget de clima?',
    answer: 'Crie uma conta gratuita no OpenWeatherMap e obtenha uma API key. Cole a key nas configurações e informe sua cidade. O widget mostrará a previsão do tempo na tela inicial.',
    category: 'integrations',
    tags: ['clima', 'weather', 'api'],
    tips: ['API gratuita permite até 1000 consultas/dia', 'Formato da cidade: "São Paulo, BR"']
  },
  {
    id: 'faq-spotify-premium',
    question: 'Preciso de Spotify Premium?',
    answer: 'Spotify Premium é recomendado para controle total da reprodução (pausar, pular, volume). Com conta gratuita, algumas funcionalidades podem ser limitadas, mas você ainda pode ver sua biblioteca.',
    category: 'integrations',
    tags: ['spotify', 'premium', 'limitações'],
    tips: ['Teste com conta gratuita primeiro', 'Premium permite controle remoto completo']
  }
];

const categoryInfo: Record<SettingsCategoryId, { icon: typeof Plug; label: string; color: string }> = {
  dashboard: { icon: HelpCircle, label: 'Dashboard', color: 'text-gray-400' },
  connections: { icon: Plug, label: 'Conexões', color: 'text-cyan-400' },
  data: { icon: Database, label: 'Dados', color: 'text-green-400' },
  system: { icon: Settings2, label: 'Sistema', color: 'text-purple-400' },
  appearance: { icon: Palette, label: 'Aparência', color: 'text-pink-400' },
  security: { icon: Shield, label: 'Segurança', color: 'text-yellow-400' },
  integrations: { icon: Globe, label: 'Integrações', color: 'text-blue-400' }
};

interface SettingsFAQProps {
  filterCategory?: SettingsCategoryId;
}

export function SettingsFAQ({ filterCategory }: SettingsFAQProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<SettingsCategoryId | 'all'>(filterCategory || 'all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const categories: (SettingsCategoryId | 'all')[] = ['all', 'connections', 'data', 'system', 'appearance', 'security', 'integrations'];

  const filteredItems = faqItems.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <Card className="p-5 bg-kiosk-surface/50 border-cyan-500/30 card-option-neon">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-kiosk-text flex items-center gap-2">
          <HelpCircle className="w-5 h-5 icon-neon-blue" />
          Perguntas Frequentes
        </h3>
        <Badge variant="outline" className="border-cyan-500/30 text-cyan-400">
          {filteredItems.length} {filteredItems.length === 1 ? 'pergunta' : 'perguntas'}
        </Badge>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-kiosk-text/40" />
        <Input
          placeholder="Buscar no FAQ..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 bg-kiosk-background/50 border-kiosk-border text-kiosk-text"
        />
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-4">
        {categories.map((cat) => {
          const info = cat === 'all' ? null : categoryInfo[cat];
          const Icon = info?.icon || HelpCircle;
          
          return (
            <Button
              key={cat}
              variant="ghost"
              size="sm"
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                "h-8 px-3 text-xs transition-all",
                selectedCategory === cat
                  ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                  : "bg-kiosk-background/30 text-kiosk-text/60 hover:text-kiosk-text hover:bg-kiosk-background/50"
              )}
            >
              {cat === 'all' ? (
                'Todas'
              ) : (
                <>
                  <Icon className={cn("w-3 h-3 mr-1", info?.color)} />
                  {info?.label}
                </>
              )}
            </Button>
          );
        })}
      </div>

      {/* FAQ Items */}
      <div className="space-y-2">
        <AnimatePresence>
          {filteredItems.map((item) => {
            const catInfo = categoryInfo[item.category];
            const Icon = catInfo.icon;
            const isExpanded = expandedId === item.id;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                layout
              >
                <div
                  className={cn(
                    "rounded-lg border transition-all",
                    isExpanded 
                      ? "bg-kiosk-background/60 border-cyan-500/40" 
                      : "bg-kiosk-background/30 border-kiosk-border/50 hover:border-kiosk-border"
                  )}
                >
                  {/* Question Header */}
                  <button
                    onClick={() => toggleExpand(item.id)}
                    className="w-full flex items-center gap-3 p-3 text-left"
                  >
                    <Icon className={cn("w-4 h-4 flex-shrink-0", catInfo.color)} />
                    <span className="flex-1 text-sm text-kiosk-text font-medium">
                      {item.question}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-kiosk-text/50" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-kiosk-text/50" />
                    )}
                  </button>

                  {/* Answer */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="px-3 pb-3 pt-1 space-y-3">
                          <p className="text-sm text-kiosk-text/80 leading-relaxed pl-7">
                            {item.answer}
                          </p>
                          
                          {item.tips && item.tips.length > 0 && (
                            <div className="pl-7 space-y-1.5">
                              {item.tips.map((tip, index) => (
                                <div key={index} className="flex items-start gap-2">
                                  <Lightbulb className="w-3 h-3 text-yellow-400 flex-shrink-0 mt-0.5" />
                                  <span className="text-xs text-kiosk-text/60">{tip}</span>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Tags */}
                          <div className="pl-7 flex flex-wrap gap-1">
                            {item.tags.map((tag) => (
                              <Badge 
                                key={tag} 
                                variant="outline" 
                                className="text-[10px] px-1.5 py-0 border-kiosk-border/50 text-kiosk-text/50"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {filteredItems.length === 0 && (
          <div className="text-center py-8 text-kiosk-text/60">
            <HelpCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>Nenhuma pergunta encontrada</p>
            <p className="text-xs mt-1">Tente outros termos de busca</p>
          </div>
        )}
      </div>
    </Card>
  );
}

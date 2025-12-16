import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Search, 
  Book, 
  Settings, 
  Music, 
  Shield, 
  Database, 
  Cloud,
  Key,
  HelpCircle,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { LogoBrand } from '@/components/ui/LogoBrand';

interface HelpSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  items: HelpItem[];
}

interface HelpItem {
  id: string;
  question: string;
  answer: string;
  steps?: string[];
  tips?: string[];
}

const helpSections: HelpSection[] = [
  {
    id: 'getting-started',
    title: 'Primeiros Passos',
    icon: <Book className="w-5 h-5" />,
    items: [
      {
        id: 'what-is',
        question: 'O que é o TSi JUKEBOX?',
        answer: 'O TSi JUKEBOX é um sistema de música inteligente projetado para funcionar como um "jukebox digital". Ele permite reproduzir músicas, gerenciar playlists e conectar-se ao Spotify de forma fácil e intuitiva.',
        tips: ['O sistema foi pensado para uso em tela de toque', 'Funciona perfeitamente em modo kiosk (tela cheia)']
      },
      {
        id: 'navigation',
        question: 'Como navegar na interface?',
        answer: 'A interface é dividida em áreas principais: o player de música no centro, controles de reprodução na parte inferior, e um deck de comandos para funções administrativas.',
        steps: [
          'Use os botões grandes para controlar a música',
          'Deslize para os lados para trocar de faixa',
          'Toque no ícone de engrenagem para configurações',
          'Use o deck inferior para funções avançadas'
        ]
      },
      {
        id: 'first-setup',
        question: 'Como fazer a configuração inicial?',
        answer: 'Na primeira vez que abrir o sistema, um assistente de configuração irá guiá-lo pelos passos principais: escolha de tema, ajustes de acessibilidade e conexões.',
        tips: ['Você pode refazer a configuração a qualquer momento em /setup']
      }
    ]
  },
  {
    id: 'settings',
    title: 'Configurações',
    icon: <Settings className="w-5 h-5" />,
    items: [
      {
        id: 'theme',
        question: 'Como mudar o tema de cores?',
        answer: 'Acesse Configurações > Tema e escolha entre Azul Neon, Verde Tech ou Roxo Vibrante. A mudança é aplicada instantaneamente com uma transição suave.',
        steps: [
          'Abra o menu de Configurações',
          'Encontre a seção "Tema"',
          'Clique na cor desejada',
          'A mudança é automática!'
        ]
      },
      {
        id: 'accessibility',
        question: 'Como ajustar a acessibilidade?',
        answer: 'Em Configurações > Acessibilidade você pode ativar modo de alto contraste, aumentar o tamanho das fontes e reduzir animações para uma experiência mais confortável.',
        tips: [
          'Use o preview em tempo real para ver como ficará',
          'O modo alto contraste é ideal para ambientes muito iluminados',
          'Reduza animações se sentir desconforto com movimentos'
        ]
      },
      {
        id: 'backup',
        question: 'Como fazer backup dos dados?',
        answer: 'Backups protegem suas configurações e dados importantes. Você pode fazer backup completo (tudo) ou incremental (apenas mudanças).',
        steps: [
          'Acesse Configurações > Backup Local',
          'Clique em "Backup Completo" para a primeira vez',
          'Use "Backup Incremental" para atualizações diárias',
          'Os backups ficam listados abaixo para restauração'
        ],
        tips: ['Faça backup completo semanalmente', 'Backups incrementais são mais rápidos']
      }
    ]
  },
  {
    id: 'spotify',
    title: 'Spotify',
    icon: <Music className="w-5 h-5" />,
    items: [
      {
        id: 'connect-spotify',
        question: 'Como conectar minha conta Spotify?',
        answer: 'Para usar o Spotify, você precisa criar um app no Spotify Developer Dashboard e obter as credenciais Client ID e Client Secret.',
        steps: [
          'Acesse developer.spotify.com e faça login',
          'Crie um novo aplicativo',
          'Copie o Client ID e Client Secret',
          'Cole nas Configurações > Spotify do TSi JUKEBOX',
          'Clique em "Conectar com Spotify"'
        ],
        tips: ['A conexão é segura via OAuth', 'Suas credenciais ficam salvas localmente']
      },
      {
        id: 'spotify-controls',
        question: 'Como controlar a música?',
        answer: 'Use os botões centrais para Play/Pause, as setas para próxima/anterior, e o slider para volume. Você também pode usar gestos de deslizar.',
        tips: ['Deslize para direita = próxima música', 'Deslize para esquerda = música anterior']
      }
    ]
  },
  {
    id: 'database',
    title: 'Banco de Dados',
    icon: <Database className="w-5 h-5" />,
    items: [
      {
        id: 'what-is-db',
        question: 'O que é o banco de dados?',
        answer: 'O banco de dados é onde todas as suas configurações, histórico de músicas e preferências são guardados de forma segura. Pense nele como uma "caixa organizadora digital".',
      },
      {
        id: 'db-types',
        question: 'Quais tipos de banco são suportados?',
        answer: 'O TSi JUKEBOX suporta SQLite (local ou remoto) e Lovable Cloud. Para uso doméstico, SQLite local é suficiente. Para estabelecimentos, Lovable Cloud oferece backup automático.',
      },
      {
        id: 'db-maintenance',
        question: 'Como fazer manutenção do banco?',
        answer: 'Em Configurações > Banco de Dados você encontra ferramentas como Vacuum (otimização), Verificar Integridade, e Reindexar.',
        tips: ['Execute Vacuum mensalmente para melhor desempenho', 'Sempre faça backup antes de manutenções']
      }
    ]
  },
  {
    id: 'security',
    title: 'Segurança',
    icon: <Shield className="w-5 h-5" />,
    items: [
      {
        id: 'ssh-keys',
        question: 'O que são chaves SSH?',
        answer: 'Chaves SSH são como "senhas especiais" que permitem conexões seguras entre computadores. A chave privada é secreta (nunca compartilhe!), enquanto a pública pode ser compartilhada.',
        tips: [
          'Use o comando ssh-keygen -t ed25519 para criar novas chaves',
          'O tipo ed25519 é mais seguro e rápido que RSA',
          'Sempre proteja sua chave privada com senha'
        ]
      },
      {
        id: 'gpg-keys',
        question: 'Para que serve GPG?',
        answer: 'GPG serve para "assinar" e criptografar arquivos. No contexto do JUKEBOX, é usado para garantir que seus backups não foram alterados.',
      },
      {
        id: 'user-roles',
        question: 'Como funcionam os níveis de usuário?',
        answer: 'Existem três níveis: Newbie (apenas ouve música), User (pode modificar fila), e Admin (acesso total incluindo configurações).',
      }
    ]
  },
  {
    id: 'cloud',
    title: 'Nuvem e Backup',
    icon: <Cloud className="w-5 h-5" />,
    items: [
      {
        id: 'cloud-backup',
        question: 'Como configurar backup na nuvem?',
        answer: 'Em Configurações > Backup na Nuvem você pode conectar serviços como Google Drive, Dropbox, ou Amazon S3 para guardar cópias dos seus dados.',
        steps: [
          'Escolha o serviço de nuvem desejado',
          'Insira as credenciais de acesso',
          'Configure a frequência de sincronização',
          'Clique em "Sincronizar Agora" para testar'
        ]
      },
      {
        id: 'schedule-backup',
        question: 'Como agendar backups automáticos?',
        answer: 'Em Configurações > Agendamento de Backup você define quando os backups devem ocorrer automaticamente.',
        tips: ['Recomendamos backup diário às 3h da manhã', 'Mantenha pelo menos 7 backups anteriores']
      }
    ]
  }
];

export default function Help() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSection, setSelectedSection] = useState<string | null>(null);

  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return helpSections;

    const query = searchQuery.toLowerCase();
    return helpSections
      .map(section => ({
        ...section,
        items: section.items.filter(
          item =>
            item.question.toLowerCase().includes(query) ||
            item.answer.toLowerCase().includes(query)
        )
      }))
      .filter(section => section.items.length > 0);
  }, [searchQuery]);

  const selectedSectionData = selectedSection 
    ? helpSections.find(s => s.id === selectedSection)
    : null;

  return (
    <div className="min-h-screen bg-kiosk-bg">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="text-kiosk-text/70 hover:text-kiosk-text"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-3">
              <HelpCircle className="w-6 h-6 text-primary" />
              <h1 className="text-xl font-bold text-kiosk-text">Manual & FAQ</h1>
            </div>
          </div>
          <LogoBrand size="sm" />
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4">
        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-kiosk-text/50" />
          <Input
            placeholder="Buscar no manual..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-kiosk-surface border-border text-kiosk-text"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Index Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 space-y-2">
              <h2 className="text-sm font-semibold text-label-yellow mb-3">ÍNDICE</h2>
              {filteredSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setSelectedSection(section.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all text-left ${
                    selectedSection === section.id
                      ? 'bg-primary/20 text-primary'
                      : 'hover:bg-kiosk-surface text-kiosk-text/70 hover:text-kiosk-text'
                  }`}
                >
                  {section.icon}
                  <span className="flex-1 text-sm font-medium">{section.title}</span>
                  <span className="text-xs text-kiosk-text/50">{section.items.length}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-2">
            <ScrollArea className="h-[calc(100vh-200px)]">
              {selectedSectionData ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                      {selectedSectionData.icon}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-kiosk-text">{selectedSectionData.title}</h2>
                      <p className="text-sm text-kiosk-text/70">{selectedSectionData.items.length} artigos</p>
                    </div>
                  </div>

                  <Accordion type="single" collapsible className="space-y-2">
                    {selectedSectionData.items.map((item) => (
                      <AccordionItem
                        key={item.id}
                        value={item.id}
                        className="border border-border rounded-lg overflow-hidden bg-kiosk-surface/50"
                      >
                        <AccordionTrigger className="px-4 py-3 text-left text-kiosk-text hover:no-underline hover:bg-kiosk-surface/80">
                          <span className="font-medium">{item.question}</span>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pb-4">
                          <div className="space-y-4">
                            <p className="text-kiosk-text/80">{item.answer}</p>

                            {item.steps && (
                              <div className="space-y-2">
                                <p className="text-sm font-medium text-label-yellow">📋 Passo a passo:</p>
                                <ol className="list-decimal list-inside space-y-1 text-sm text-kiosk-text/70">
                                  {item.steps.map((step, i) => (
                                    <li key={i}>{step}</li>
                                  ))}
                                </ol>
                              </div>
                            )}

                            {item.tips && (
                              <div className="p-3 rounded-lg bg-primary/10 space-y-1">
                                <p className="text-sm font-medium text-primary">💡 Dicas:</p>
                                <ul className="text-sm text-kiosk-text/70 space-y-1">
                                  {item.tips.map((tip, i) => (
                                    <li key={i}>• {tip}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </motion.div>
              ) : (
                <div className="text-center py-12">
                  <HelpCircle className="w-16 h-16 mx-auto text-kiosk-text/30 mb-4" />
                  <p className="text-kiosk-text/70">Selecione uma seção no índice para ver o conteúdo</p>
                </div>
              )}
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  );
}

import { ReactNode } from 'react';

export interface WikiArticle {
  id: string;
  title: string;
  description: string;
  content: string;
  steps?: string[];
  tips?: string[];
  relatedArticles?: string[];
  illustration?: string;
}

export interface WikiSubSection {
  id: string;
  title: string;
  articles: WikiArticle[];
}

export interface WikiCategory {
  id: string;
  title: string;
  icon: string;
  description: string;
  subSections: WikiSubSection[];
}

export const wikiCategories: WikiCategory[] = [
  {
    id: 'playback',
    title: 'Reprodução de Música',
    icon: 'Music',
    description: 'Aprenda a controlar a reprodução de músicas no TSiJUKEBOX',
    subSections: [
      {
        id: 'basic-controls',
        title: 'Controles Básicos',
        articles: [
          {
            id: 'play-pause',
            title: 'Play/Pause',
            description: 'Como iniciar e pausar a reprodução de música',
            content: 'O botão Play/Pause é o controle central do player. Ele permite alternar entre reproduzir e pausar a música atual com um único toque ou pressionamento de tecla.',
            steps: [
              'Via tela de toque: Toque no botão grande central com o ícone de play (▶) ou pause (⏸)',
              'Via teclado: Pressione a Barra de Espaço',
              'O ícone muda automaticamente para refletir o estado atual'
            ],
            tips: [
              'O estado é sincronizado em tempo real com o Spotify',
              'Pausar não perde a posição da música'
            ],
            illustration: 'player',
            relatedArticles: ['next-previous', 'volume-control']
          },
          {
            id: 'next-previous',
            title: 'Próxima/Anterior',
            description: 'Navegação entre faixas da playlist',
            content: 'Os botões de navegação permitem avançar para a próxima música ou voltar para a anterior. O comportamento de "voltar" é inteligente e considera o tempo de reprodução.',
            steps: [
              'Próxima: Toque no botão ⏭ ou pressione Seta Direita (→)',
              'Anterior: Toque no botão ⏮ ou pressione Seta Esquerda (←)',
              'Gesto: Deslize para esquerda (próxima) ou direita (anterior)'
            ],
            tips: [
              'Nos primeiros 3s, "anterior" volta para a música anterior',
              'Após 3s, "anterior" reinicia a música atual'
            ],
            illustration: 'player',
            relatedArticles: ['play-pause', 'keyboard-navigation']
          },
          {
            id: 'volume-control',
            title: 'Controle de Volume',
            description: 'Ajuste o volume de reprodução',
            content: 'O volume pode ser ajustado de 0% a 100% em incrementos de 5%. O nível é persistido entre sessões.',
            steps: [
              'Slider: Arraste o controle deslizante de volume',
              'Teclado: Setas ↑/↓ ou teclas +/- para ajuste de 5%',
              'Toque longo: Segure no slider para ajuste contínuo'
            ],
            tips: [
              'Volume 0% silencia mas não para a música',
              'O volume é salvo automaticamente'
            ],
            illustration: 'volume',
            relatedArticles: ['play-pause']
          }
        ]
      },
      {
        id: 'queue',
        title: 'Fila de Reprodução',
        articles: [
          {
            id: 'view-queue',
            title: 'Visualizar Fila',
            description: 'Veja as próximas músicas que serão tocadas',
            content: 'A fila de reprodução mostra todas as músicas programadas para tocar. Você pode ver a ordem, informações das faixas e gerenciar a lista.',
            steps: [
              'Toque no ícone de lista/fila no player',
              'A fila aparece em um painel lateral',
              'Role para ver todas as músicas'
            ],
            tips: ['A fila sincroniza com o Spotify em tempo real'],
            illustration: 'queue'
          },
          {
            id: 'reorder-queue',
            title: 'Reordenar Fila',
            description: 'Arraste músicas para mudar a ordem',
            content: 'Você pode reorganizar a fila de reprodução arrastando as músicas para novas posições usando drag and drop.',
            steps: [
              'Abra a fila de reprodução',
              'Toque e segure em uma música',
              'Arraste para a nova posição',
              'Solte para confirmar'
            ],
            tips: ['A nova ordem é salva automaticamente no backend'],
            illustration: 'queue'
          },
          {
            id: 'add-to-queue',
            title: 'Adicionar à Fila',
            description: 'Adicione músicas do Spotify à fila',
            content: 'Você pode adicionar músicas à fila de reprodução a partir da biblioteca do Spotify, playlists ou resultados de busca.',
            steps: [
              'Navegue até a música desejada no Spotify Browser',
              'Toque no ícone + ou "Adicionar à fila"',
              'A música aparecerá no final da fila'
            ],
            illustration: 'spotify'
          },
          {
            id: 'remove-from-queue',
            title: 'Remover da Fila',
            description: 'Remova músicas indesejadas',
            content: 'Músicas podem ser removidas individualmente da fila, ou você pode limpar toda a fila de uma vez.',
            steps: [
              'Abra a fila de reprodução',
              'Toque no ícone X ao lado da música',
              'Confirme a remoção se solicitado'
            ],
            tips: ['Use "Limpar Fila" para remover todas de uma vez'],
            illustration: 'queue'
          },
          {
            id: 'clear-queue',
            title: 'Limpar Fila',
            description: 'Remova todas as músicas da fila',
            content: 'A função de limpar fila remove todas as músicas pendentes, mantendo apenas a música atual em reprodução.',
            steps: [
              'Abra a fila de reprodução',
              'Toque no botão "Limpar Fila"',
              'Confirme a ação'
            ],
            illustration: 'queue'
          }
        ]
      },
      {
        id: 'playback-modes',
        title: 'Modos de Reprodução',
        articles: [
          {
            id: 'shuffle',
            title: 'Shuffle (Aleatório)',
            description: 'Reproduza músicas em ordem aleatória',
            content: 'O modo shuffle embaralha a ordem das músicas na fila, proporcionando uma experiência de audição variada e surpreendente.',
            steps: [
              'Localize o ícone de shuffle (🔀) nos controles',
              'Toque para ativar/desativar',
              'O ícone fica destacado quando ativo'
            ],
            tips: [
              'Ativar shuffle reorganiza a fila atual',
              'Desativar restaura a ordem original'
            ],
            illustration: 'playback'
          },
          {
            id: 'repeat',
            title: 'Repeat (Repetir)',
            description: 'Configure a repetição de músicas',
            content: 'O modo repeat oferece três estados: desligado, repetir playlist, e repetir uma música.',
            steps: [
              'Localize o ícone de repeat (🔁) nos controles',
              'Toque para alternar entre os modos:',
              '• Desligado: sem repetição',
              '• Playlist: repete toda a fila',
              '• Uma música: repete a faixa atual'
            ],
            tips: ['O indicador "1" aparece no modo de repetir uma música'],
            illustration: 'playback'
          }
        ]
      }
    ]
  },
  {
    id: 'shortcuts',
    title: 'Atalhos e Gestos',
    icon: 'Keyboard',
    description: 'Domine os atalhos de teclado e gestos de toque',
    subSections: [
      {
        id: 'keyboard-shortcuts',
        title: 'Atalhos de Teclado',
        articles: [
          {
            id: 'keyboard-playback',
            title: 'Atalhos de Reprodução',
            description: 'Controle a música com o teclado',
            content: 'Os atalhos de teclado permitem controlar a reprodução sem tocar na tela, ideal para uso com teclados externos ou controles remotos.',
            steps: [
              'Espaço: Play/Pause - alterna o estado de reprodução',
              '→ Seta Direita: Próxima música',
              '← Seta Esquerda: Música anterior',
              '↑ Seta Cima ou +: Volume +5%',
              '↓ Seta Baixo ou -: Volume -5%'
            ],
            tips: [
              'Funciona em qualquer área do player',
              'Segure as teclas de volume para ajuste rápido'
            ],
            illustration: 'keyboard'
          },
          {
            id: 'keyboard-navigation',
            title: 'Navegação por Teclado',
            description: 'Use Tab e Enter para navegar',
            content: 'A interface suporta navegação completa por teclado para acessibilidade.',
            steps: [
              'Tab: Move o foco para o próximo elemento',
              'Shift+Tab: Move o foco para o elemento anterior',
              'Enter: Ativa o elemento com foco',
              'Escape: Fecha modais e menus'
            ],
            illustration: 'keyboard'
          }
        ]
      },
      {
        id: 'touch-gestures',
        title: 'Gestos de Toque',
        articles: [
          {
            id: 'swipe-gestures',
            title: 'Gestos de Deslizar',
            description: 'Deslize para controlar a música',
            content: 'Os gestos de deslizar (swipe) permitem navegação rápida entre músicas com movimento natural.',
            steps: [
              '← Deslizar para Esquerda: Próxima música',
              '→ Deslizar para Direita: Música anterior',
              'Distância mínima: 50 pixels',
              'Funciona sobre a área do player'
            ],
            tips: [
              'Gestos diagonais são ignorados',
              'Feedback visual confirma o reconhecimento'
            ],
            illustration: 'gesture'
          },
          {
            id: 'tap-gestures',
            title: 'Gestos de Toque',
            description: 'Toques simples e prolongados',
            content: 'Além de deslizar, o sistema responde a diferentes tipos de toque nos elementos da interface.',
            steps: [
              'Toque simples: Ativa botões e controles',
              'Toque duplo: Não utilizado (evita conflitos)',
              'Toque longo: Ativa modo de ajuste contínuo no volume'
            ],
            illustration: 'gesture'
          },
          {
            id: 'gesture-sensitivity',
            title: 'Sensibilidade de Gestos',
            description: 'Entenda como os gestos são reconhecidos',
            content: 'O sistema usa limiares específicos para distinguir gestos intencionais de movimentos acidentais.',
            steps: [
              'Distância mínima horizontal: 50px',
              'Movimento horizontal deve ser maior que vertical',
              'Velocidade não afeta o reconhecimento',
              'Use um único dedo para melhores resultados'
            ],
            tips: [
              'Películas grossas podem reduzir sensibilidade',
              'Limpe a tela se os gestos não responderem'
            ],
            illustration: 'gesture'
          }
        ]
      },
      {
        id: 'test-mode',
        title: 'Modo de Teste',
        articles: [
          {
            id: 'test-shortcuts',
            title: 'Testar Atalhos',
            description: 'Área interativa para testar atalhos',
            content: 'O modo de teste permite verificar se os atalhos de teclado estão funcionando corretamente no seu dispositivo.',
            steps: [
              'Acesse o Manual de Ajuda',
              'Clique em "Testar Atalhos"',
              'Pressione teclas e observe o feedback',
              'Verifique o histórico de eventos'
            ],
            illustration: 'keyboard'
          },
          {
            id: 'test-gestures',
            title: 'Testar Gestos',
            description: 'Área interativa para testar gestos',
            content: 'O modo de teste de gestos permite praticar e verificar se seus gestos estão sendo reconhecidos.',
            steps: [
              'Acesse o Manual de Ajuda',
              'Clique em "Testar Gestos"',
              'Deslize na área de teste',
              'Observe as métricas e feedback'
            ],
            illustration: 'gesture'
          }
        ]
      }
    ]
  },
  {
    id: 'customization',
    title: 'Personalização',
    icon: 'Palette',
    description: 'Customize a aparência e comportamento do sistema',
    subSections: [
      {
        id: 'themes',
        title: 'Temas Visuais',
        articles: [
          {
            id: 'solid-themes',
            title: 'Temas Sólidos',
            description: 'Temas com cores sólidas',
            content: 'Os temas sólidos oferecem uma aparência limpa com uma cor primária definida.',
            steps: [
              'Acesse Configurações > Aparência',
              'Escolha entre: Blue, Green, Purple, Orange, Pink',
              'O tema é aplicado instantaneamente'
            ],
            tips: ['Use Preview de Temas para ver todos antes de aplicar'],
            illustration: 'settings'
          },
          {
            id: 'gradient-themes',
            title: 'Temas com Gradiente',
            description: 'Temas com degradê de cores',
            content: 'Os temas com gradiente criam ambientes visuais mais dinâmicos com transições suaves entre cores.',
            steps: [
              'Acesse Configurações > Aparência',
              'Escolha: Aurora Boreal, Pôr do Sol, ou Oceano Profundo',
              'Observe o fundo com gradiente animado'
            ],
            illustration: 'settings'
          },
          {
            id: 'custom-themes',
            title: 'Criar Tema Personalizado',
            description: 'Crie seu próprio tema',
            content: 'Você pode criar temas completamente personalizados definindo cada cor individualmente.',
            steps: [
              'Acesse Configurações > Aparência',
              'Clique em "Personalizar"',
              'Ajuste: cor primária, fundo, superfície, texto',
              'Opcionalmente, ative gradiente e defina cores/ângulo',
              'Salve o tema com um nome'
            ],
            tips: ['Temas personalizados são salvos localmente'],
            illustration: 'settings'
          }
        ]
      },
      {
        id: 'accessibility',
        title: 'Acessibilidade',
        articles: [
          {
            id: 'high-contrast',
            title: 'Alto Contraste',
            description: 'Melhore a visibilidade',
            content: 'O modo de alto contraste aumenta a diferença entre elementos para melhor legibilidade.',
            steps: [
              'Acesse Configurações > Acessibilidade',
              'Ative "Alto Contraste"',
              'As cores serão ajustadas automaticamente'
            ],
            illustration: 'settings'
          },
          {
            id: 'font-size',
            title: 'Tamanho de Fonte',
            description: 'Ajuste o tamanho do texto',
            content: 'Você pode aumentar ou diminuir o tamanho de todas as fontes da interface.',
            steps: [
              'Acesse Configurações > Acessibilidade',
              'Ajuste o slider de "Tamanho de Fonte"',
              'Escolha entre: 12px, 14px, 16px, 18px, 20px'
            ],
            illustration: 'settings'
          },
          {
            id: 'reduced-motion',
            title: 'Reduzir Animações',
            description: 'Minimize movimentos na tela',
            content: 'Desativa ou reduz animações para usuários sensíveis a movimento.',
            steps: [
              'Acesse Configurações > Acessibilidade',
              'Ative "Reduzir Animações"',
              'Transições serão simplificadas ou removidas'
            ],
            illustration: 'settings'
          }
        ]
      },
      {
        id: 'language',
        title: 'Idioma',
        articles: [
          {
            id: 'change-language',
            title: 'Alterar Idioma',
            description: 'Mude o idioma da interface',
            content: 'O TSiJUKEBOX suporta múltiplos idiomas: Português, Inglês e Espanhol.',
            steps: [
              'Acesse Configurações > Idioma',
              'Selecione o idioma desejado',
              'A interface atualiza instantaneamente'
            ],
            tips: ['O idioma é salvo para sua próxima visita'],
            illustration: 'settings'
          }
        ]
      }
    ]
  },
  {
    id: 'integrations',
    title: 'Integrações',
    icon: 'Plug',
    description: 'Configure conexões com serviços externos',
    subSections: [
      {
        id: 'spotify',
        title: 'Spotify',
        articles: [
          {
            id: 'spotify-connect',
            title: 'Conectar ao Spotify',
            description: 'Configure a integração com Spotify',
            content: 'O TSiJUKEBOX usa o Spotify como fonte de música. A conexão requer credenciais OAuth.',
            steps: [
              'Acesse Configurações > Spotify',
              'Insira seu Client ID e Client Secret',
              'Clique em "Conectar"',
              'Autorize o acesso na janela do Spotify'
            ],
            tips: [
              'Obtenha credenciais em developer.spotify.com',
              'O token renova automaticamente'
            ],
            illustration: 'spotify'
          },
          {
            id: 'spotify-browse',
            title: 'Navegar Biblioteca',
            description: 'Explore sua biblioteca do Spotify',
            content: 'Após conectar, você pode navegar por playlists, álbuns, artistas e músicas salvas.',
            steps: [
              'Acesse o menu Spotify',
              'Navegue por: Playlists, Curtidas, Álbuns, Artistas',
              'Toque em qualquer item para ver detalhes',
              'Use a busca para encontrar músicas específicas'
            ],
            illustration: 'spotify'
          },
          {
            id: 'spotify-search',
            title: 'Buscar Músicas',
            description: 'Encontre qualquer música no Spotify',
            content: 'A busca permite encontrar músicas, álbuns e artistas em todo o catálogo do Spotify.',
            steps: [
              'Acesse Spotify > Buscar',
              'Digite o nome da música, artista ou álbum',
              'Os resultados aparecem em tempo real',
              'Toque para adicionar à fila ou reproduzir'
            ],
            illustration: 'spotify'
          },
          {
            id: 'spotify-playlists',
            title: 'Gerenciar Playlists',
            description: 'Crie e edite playlists',
            content: 'Você pode visualizar, criar e gerenciar suas playlists do Spotify diretamente no TSiJUKEBOX.',
            steps: [
              'Acesse Spotify > Playlists',
              'Visualize suas playlists existentes',
              'Crie novas playlists com o botão +',
              'Adicione músicas arrastando ou usando o menu'
            ],
            illustration: 'spotify'
          }
        ]
      },
      {
        id: 'backend',
        title: 'Backend FastAPI',
        articles: [
          {
            id: 'backend-connection',
            title: 'Conexão com Backend',
            description: 'Configure a conexão com o servidor',
            content: 'O TSiJUKEBOX se conecta a um backend FastAPI para controle de reprodução e persistência de dados.',
            steps: [
              'Acesse Configurações > Backend',
              'Verifique a URL do servidor',
              'O status de conexão é mostrado em tempo real',
              'Use WebSocket para menor latência ou Polling como fallback'
            ],
            illustration: 'settings'
          },
          {
            id: 'connection-modes',
            title: 'Modos de Conexão',
            description: 'WebSocket, Polling ou Demo',
            content: 'O sistema oferece três modos de comunicação com o backend.',
            steps: [
              'WebSocket: Conexão em tempo real, menor latência',
              'Polling: Consultas periódicas, mais compatível',
              'Demo: Dados simulados para testes sem backend'
            ],
            tips: ['WebSocket é recomendado quando disponível'],
            illustration: 'settings'
          }
        ]
      },
      {
        id: 'weather',
        title: 'Clima',
        articles: [
          {
            id: 'weather-setup',
            title: 'Configurar Widget de Clima',
            description: 'Configure a previsão do tempo',
            content: 'O widget de clima mostra condições atuais e previsão de 5 dias usando OpenWeatherMap.',
            steps: [
              'Acesse Configurações > Clima',
              'Insira sua API Key do OpenWeatherMap',
              'Configure a cidade/localização',
              'O widget aparecerá no player'
            ],
            tips: ['Obtenha uma API Key gratuita em openweathermap.org'],
            illustration: 'settings'
          }
        ]
      },
      {
        id: 'spicetify',
        title: 'Spicetify',
        articles: [
          {
            id: 'spicetify-overview',
            title: 'O que é Spicetify?',
            description: 'Entenda a integração com Spicetify',
            content: 'Spicetify é uma ferramenta de linha de comando que permite personalizar o cliente desktop do Spotify com temas, extensões e funcionalidades adicionais.',
            steps: [
              'Spicetify modifica o cliente Spotify desktop',
              'Permite aplicar temas visuais personalizados',
              'Adiciona extensões para funcionalidades extras',
              'Integra-se com o TSiJUKEBOX para controle local'
            ],
            tips: [
              'Requer Spotify desktop instalado',
              'Funciona apenas no sistema local (não remoto)',
              'Atualizações do Spotify podem exigir re-aplicação'
            ],
            illustration: 'settings',
            relatedArticles: ['spicetify-themes', 'spicetify-extensions']
          },
          {
            id: 'spicetify-themes',
            title: 'Aplicar Temas no Spicetify',
            description: 'Personalize a aparência do Spotify',
            content: 'Os temas do Spicetify modificam completamente a aparência visual do cliente Spotify desktop, incluindo cores, fontes e layout.',
            steps: [
              'Acesse Configurações > Integrações > Spicetify',
              'Verifique se Spicetify está instalado (status verde)',
              'Na seção "Temas Disponíveis", clique no tema desejado',
              'Aguarde a aplicação (pode levar alguns segundos)',
              'O Spotify reiniciará automaticamente com o novo tema'
            ],
            tips: [
              'O tema "Dribbblish" é um dos mais populares',
              'Faça backup antes de mudar temas',
              'Alguns temas têm variantes de cor'
            ],
            illustration: 'settings',
            relatedArticles: ['spicetify-overview', 'spicetify-extensions']
          },
          {
            id: 'spicetify-extensions',
            title: 'Gerenciar Extensões Spicetify',
            description: 'Adicione funcionalidades ao Spotify',
            content: 'As extensões do Spicetify adicionam novas funcionalidades ao cliente Spotify, como letras de músicas, controles adicionais e integrações.',
            steps: [
              'Acesse Configurações > Integrações > Spicetify',
              'Role até a seção "Extensões"',
              'Use o switch para ativar/desativar cada extensão',
              'As mudanças são aplicadas automaticamente',
              'O Spotify pode precisar reiniciar'
            ],
            tips: [
              'Extensões populares: Lyrics, Full App Display, Shuffle+',
              'Muitas extensões podem afetar performance',
              'Desative extensões que não usa'
            ],
            illustration: 'settings',
            relatedArticles: ['spicetify-overview', 'spicetify-themes']
          }
        ]
      },
      {
        id: 'youtube-music',
        title: 'YouTube Music',
        articles: [
          {
            id: 'ytm-connect',
            title: 'Conectar YouTube Music',
            description: 'Configure sua conta Google',
            content: 'O TSiJUKEBOX suporta YouTube Music como provedor de música alternativo ao Spotify, permitindo acessar sua biblioteca e playlists do YouTube Music.',
            steps: [
              'Acesse Configurações > Integrações > YouTube Music',
              'Clique em "Conectar com Google"',
              'Uma janela de autorização do Google abrirá',
              'Selecione sua conta Google e autorize o acesso',
              'Após autorização, você será redirecionado de volta',
              'Seu nome e foto aparecerão confirmando a conexão'
            ],
            tips: [
              'Use uma conta Google com YouTube Music Premium para melhor experiência',
              'A conexão usa OAuth seguro (suas credenciais não são armazenadas)',
              'Você pode desconectar a qualquer momento'
            ],
            illustration: 'settings',
            relatedArticles: ['ytm-library', 'ytm-playback']
          },
          {
            id: 'ytm-library',
            title: 'Navegar Biblioteca YouTube Music',
            description: 'Acesse suas playlists e músicas',
            content: 'Após conectar sua conta, você pode navegar por toda sua biblioteca do YouTube Music incluindo playlists, álbuns curtidos, artistas seguidos e histórico.',
            steps: [
              'No menu principal, acesse "YouTube Music"',
              'Navegue pelas abas: Playlists, Curtidas, Álbuns, Artistas',
              'Use a busca para encontrar músicas específicas',
              'Toque em uma playlist para ver as músicas',
              'Adicione músicas à fila de reprodução'
            ],
            tips: [
              'Playlists são sincronizadas em tempo real',
              'Músicas "Curtidas" aparecem na aba dedicada',
              'Histórico mostra suas reproduções recentes'
            ],
            illustration: 'settings',
            relatedArticles: ['ytm-connect', 'ytm-playback']
          },
          {
            id: 'ytm-playback',
            title: 'Reprodução com YouTube Music',
            description: 'Controle a reprodução de músicas',
            content: 'O TSiJUKEBOX integra controles de reprodução para YouTube Music, permitindo tocar, pausar, pular e controlar volume das músicas.',
            steps: [
              'Selecione uma música ou playlist no YouTube Music Browser',
              'Toque no botão Play para iniciar a reprodução',
              'Use os controles do player principal para pause/play/skip',
              'O volume é controlado pelo slider do player',
              'A fila de reprodução mostra as próximas músicas'
            ],
            tips: [
              'A qualidade de áudio depende da sua assinatura YouTube',
              'Reprodução continua em background',
              'Histórico é salvo automaticamente'
            ],
            illustration: 'player',
            relatedArticles: ['ytm-connect', 'ytm-library', 'google-oauth-setup']
          },
          {
            id: 'google-oauth-setup',
            title: 'Configurar Google Cloud Console',
            description: 'Guia completo para configurar OAuth do YouTube Music',
            content: 'Para usar o YouTube Music no TSiJUKEBOX, você precisa configurar um projeto no Google Cloud Console com as credenciais OAuth 2.0. Este guia passo a passo mostra como criar e configurar tudo.',
            steps: [
              '1. Acesse console.cloud.google.com e faça login com sua conta Google',
              '2. Clique em "Selecionar Projeto" e depois "Novo Projeto"',
              '3. Dê um nome ao projeto (ex: "TSiJUKEBOX") e clique em Criar',
              '4. No menu lateral, vá em "APIs e Serviços" > "Biblioteca"',
              '5. Pesquise por "YouTube Data API v3" e clique em Ativar',
              '6. Vá em "APIs e Serviços" > "Tela de Consentimento OAuth"',
              '7. Selecione "Externo" e preencha o nome do app e email de suporte',
              '8. Em "Escopos", adicione: youtube.readonly',
              '9. Vá em "APIs e Serviços" > "Credenciais"',
              '10. Clique em "Criar Credenciais" > "ID do cliente OAuth"',
              '11. Selecione "Aplicativo da Web"',
              '12. Em "Origens JavaScript autorizadas", adicione a URL do seu Jukebox',
              '13. Em "URIs de redirecionamento autorizados", adicione: https://[seu-dominio]/settings',
              '14. Copie o Client ID e Client Secret gerados',
              '15. Cole as credenciais em Configurações > Integrações > YouTube Music'
            ],
            tips: [
              'O Client ID é público, pode ser exposto no frontend',
              'O Client Secret deve ser mantido seguro (armazenado no backend)',
              'Para teste local, adicione http://localhost:8080 nas origens autorizadas',
              'A verificação do app Google pode levar alguns dias para produção',
              'Em modo de teste, apenas emails cadastrados podem usar o app'
            ],
            illustration: 'settings',
            relatedArticles: ['ytm-connect', 'ytm-library', 'ytm-playback']
          }
        ]
      },
      {
        id: 'multi-provider',
        title: 'Multi-Provedor',
        articles: [
          {
            id: 'provider-selection',
            title: 'Escolher Provedor Padrão',
            description: 'Configure o serviço de música principal',
            content: 'O TSiJUKEBOX suporta múltiplos provedores de música (Spotify, YouTube Music, Spicetify). Você pode escolher qual será o provedor padrão.',
            steps: [
              'Acesse Configurações > Integrações',
              'Na seção "Provedor Padrão", selecione o serviço',
              'Opções: Spotify, YouTube Music, ou Spicetify (local)',
              'O provedor selecionado será usado para reprodução',
              'Outros provedores continuam disponíveis para navegação'
            ],
            tips: [
              'Spotify oferece melhor integração de desktop',
              'YouTube Music é bom para vídeos musicais',
              'Spicetify funciona apenas localmente'
            ],
            illustration: 'settings',
            relatedArticles: ['provider-fallback', 'spotify-connect', 'ytm-connect']
          },
          {
            id: 'provider-fallback',
            title: 'Configurar Fallback Automático',
            description: 'Reprodução contínua sem interrupção',
            content: 'O sistema de fallback permite que a reprodução continue mesmo se o provedor principal falhar, mudando automaticamente para outro serviço.',
            steps: [
              'Acesse Configurações > Integrações',
              'Role até "Ordem de Fallback"',
              'Arraste para reordenar a prioridade dos provedores',
              'Ative "Fallback Automático" para mudança automática',
              'Configure tempo de timeout antes do fallback'
            ],
            tips: [
              'Ordem padrão: Spotify > YouTube Music > Spicetify',
              'Fallback é útil para conexões instáveis',
              'Desative se preferir controle manual'
            ],
            illustration: 'settings',
            relatedArticles: ['provider-selection']
          }
        ]
      }
    ]
  },
  {
    id: 'admin',
    title: 'Administração',
    icon: 'Shield',
    description: 'Gerencie o sistema, banco de dados e usuários',
    subSections: [
      {
        id: 'database',
        title: 'Banco de Dados',
        articles: [
          {
            id: 'database-info',
            title: 'Informações do Banco',
            description: 'Visualize status do SQLite',
            content: 'Você pode visualizar informações sobre o banco de dados SQLite usado pelo sistema.',
            steps: [
              'Acesse Configurações > Banco de Dados',
              'Visualize: caminho, tamanho, versão',
              'Veja estatísticas de uso'
            ],
            illustration: 'settings'
          },
          {
            id: 'database-maintenance',
            title: 'Manutenção',
            description: 'Otimize o banco de dados',
            content: 'Ferramentas de manutenção ajudam a manter o banco de dados saudável e performático.',
            steps: [
              'Vacuum: Compacta e otimiza o banco',
              'Integrity Check: Verifica integridade',
              'Reindex: Reconstrói índices',
              'Stats: Mostra estatísticas detalhadas'
            ],
            illustration: 'settings'
          }
        ]
      },
      {
        id: 'backup',
        title: 'Backup',
        articles: [
          {
            id: 'local-backup',
            title: 'Backup Local',
            description: 'Faça backup do banco de dados',
            content: 'Crie backups locais do banco de dados para proteção contra perda de dados.',
            steps: [
              'Acesse Configurações > Backup',
              'Clique em "Criar Backup"',
              'Escolha: Full (completo) ou Incremental',
              'O backup é salvo no servidor'
            ],
            illustration: 'settings'
          },
          {
            id: 'cloud-backup',
            title: 'Backup em Nuvem',
            description: 'Sincronize com serviços de nuvem',
            content: 'Configure sincronização automática com serviços de armazenamento em nuvem.',
            steps: [
              'Acesse Configurações > Backup > Nuvem',
              'Selecione o provedor: Google Drive, Dropbox, etc.',
              'Configure as credenciais',
              'Ative sincronização automática'
            ],
            illustration: 'settings'
          },
          {
            id: 'backup-schedule',
            title: 'Agendamento de Backup',
            description: 'Configure backups automáticos',
            content: 'Agende backups automáticos para garantir que seus dados estejam sempre protegidos.',
            steps: [
              'Acesse Configurações > Backup > Agendamento',
              'Ative o agendamento automático',
              'Defina a frequência: Diário, Semanal, Mensal',
              'Configure o horário de execução',
              'Defina a retenção (quantos manter)'
            ],
            illustration: 'settings'
          }
        ]
      },
      {
        id: 'users',
        title: 'Usuários',
        articles: [
          {
            id: 'user-roles',
            title: 'Níveis de Permissão',
            description: 'Entenda os papéis de usuário',
            content: 'O sistema possui três níveis de permissão para controlar o acesso.',
            steps: [
              'Newbie: Apenas ouve música, sem modificações',
              'User: Pode gerenciar fila e reprodução',
              'Admin: Acesso completo, incluindo configurações'
            ],
            illustration: 'settings'
          },
          {
            id: 'manage-users',
            title: 'Gerenciar Usuários',
            description: 'Adicione e remova usuários',
            content: 'Administradores podem criar, editar e remover usuários do sistema.',
            steps: [
              'Acesse Configurações > Usuários',
              'Visualize a lista de usuários',
              'Clique em + para adicionar novo usuário',
              'Defina nome, senha e nível de permissão',
              'Use os ícones de ação para editar ou remover'
            ],
            illustration: 'settings'
          }
        ]
      }
    ]
  },
  {
    id: 'command-deck',
    title: 'Command Deck',
    icon: 'Terminal',
    description: 'Controles de sistema e administração rápida',
    subSections: [
      {
        id: 'deck-overview',
        title: 'Visão Geral',
        articles: [
          {
            id: 'deck-intro',
            title: 'O que é o Command Deck?',
            description: 'Barra de controle do sistema',
            content: 'O Command Deck é uma barra de controle localizada na parte inferior da tela, fornecendo acesso rápido a funções administrativas do sistema.',
            steps: [
              'Localizado na parte inferior da tela',
              'Expandível verticalmente',
              'Contém botões de ação rápida',
              'Separado visualmente dos controles de música'
            ],
            illustration: 'player'
          }
        ]
      },
      {
        id: 'deck-buttons',
        title: 'Botões do Deck',
        articles: [
          {
            id: 'btn-dashboard',
            title: 'Dashboard',
            description: 'Acesse o painel Grafana',
            content: 'Abre o dashboard de monitoramento do sistema (Grafana) em uma nova janela.',
            steps: [
              'Clique no botão com ícone de gráfico',
              'Uma nova janela/aba abre com o Grafana',
              'URL padrão: http://localhost:3000'
            ],
            illustration: 'deck'
          },
          {
            id: 'btn-datasource',
            title: 'Datasource',
            description: 'Acesse o Prometheus',
            content: 'Abre a interface do Prometheus para visualizar métricas do sistema.',
            steps: [
              'Clique no botão com ícone de ECG',
              'Uma nova janela/aba abre com o Prometheus',
              'URL padrão: http://localhost:9090'
            ],
            illustration: 'deck'
          },
          {
            id: 'btn-reload',
            title: 'Reload',
            description: 'Reinicie serviços',
            content: 'Executa um soft restart dos serviços do sistema sem reiniciar o computador.',
            steps: [
              'Clique no botão RELOAD (âmbar)',
              'Os serviços serão reiniciados',
              'Aguarde a reconexão automática'
            ],
            tips: ['Útil após alterações de configuração'],
            illustration: 'deck'
          },
          {
            id: 'btn-setup',
            title: 'Setup',
            description: 'Acesse configurações',
            content: 'Abre a página de configurações do sistema.',
            steps: [
              'Clique no botão SETUP (branco)',
              'Você será redirecionado para /settings'
            ],
            illustration: 'deck'
          },
          {
            id: 'btn-reboot',
            title: 'Reboot',
            description: 'Reinicie o sistema',
            content: 'Executa um reinício completo do sistema operacional. Use com cautela.',
            steps: [
              'Clique no botão REBOOT (vermelho)',
              'Confirme a ação no diálogo',
              'O sistema será reiniciado completamente'
            ],
            tips: ['Esta ação interrompe toda reprodução de música'],
            illustration: 'deck'
          }
        ]
      }
    ]
  },
  {
    id: 'faq',
    title: 'FAQ - Problemas Comuns',
    icon: 'HelpCircle',
    description: 'Soluções para problemas frequentes',
    subSections: [
      {
        id: 'connection-issues',
        title: 'Problemas de Conexão',
        articles: [
          {
            id: 'faq-no-connection',
            title: 'Sistema não conecta ao servidor',
            description: 'O sistema mostra "Conectando..." eternamente',
            content: 'Este problema geralmente indica que o backend FastAPI não está acessível. Pode ser causado por servidor desligado, firewall, ou URL incorreta.',
            steps: [
              '1. Verifique se o servidor está ligado e rodando',
              '2. Confirme a URL do backend em Configurações',
              '3. Teste a URL diretamente no navegador',
              '4. Verifique se há firewall bloqueando a porta',
              '5. Tente reiniciar o serviço do backend',
              '6. Se usar HTTPS, verifique o certificado SSL'
            ],
            tips: [
              'URL padrão: http://localhost:8000/api',
              'Use modo Demo para testar sem backend'
            ]
          },
          {
            id: 'faq-websocket-disconnect',
            title: 'WebSocket desconecta frequentemente',
            description: 'A conexão cai repetidamente',
            content: 'Desconexões frequentes podem ser causadas por rede instável, proxy, ou timeout do servidor.',
            steps: [
              '1. Verifique a estabilidade da sua rede',
              '2. Se usar proxy, configure para suportar WebSocket',
              '3. Tente mudar para modo Polling em Configurações',
              '4. Verifique os logs do servidor para erros',
              '5. Aumente o timeout se configurável'
            ],
            tips: ['Polling é mais estável mas tem maior latência']
          },
          {
            id: 'faq-spotify-not-connecting',
            title: 'Spotify não conecta',
            description: 'Erro ao autorizar ou conectar ao Spotify',
            content: 'Problemas com OAuth do Spotify podem ter várias causas, desde credenciais incorretas até URLs de callback.',
            steps: [
              '1. Verifique se Client ID e Client Secret estão corretos',
              '2. Confirme que a URL de callback está configurada no Spotify Dashboard',
              '3. Verifique se o token não expirou',
              '4. Tente desconectar e reconectar',
              '5. Limpe os cookies e tente novamente'
            ],
            tips: ['Tokens renovam automaticamente se configurado corretamente']
          }
        ]
      },
      {
        id: 'audio-issues',
        title: 'Problemas de Áudio',
        articles: [
          {
            id: 'faq-no-sound',
            title: 'Não ouço nenhum som',
            description: 'A música está tocando mas sem áudio',
            content: 'Ausência de som com música tocando indica problema na cadeia de áudio: volume, saída, ou processo do Spotify.',
            steps: [
              '1. Verifique o volume no TSiJUKEBOX (não está em 0%?)',
              '2. Verifique o volume do sistema operacional',
              '3. Confirme que a saída de áudio correta está selecionada',
              '4. Verifique se os alto-falantes/fones estão conectados',
              '5. No terminal: verifique se o Spotify está rodando',
              '6. Teste o áudio com outro aplicativo'
            ],
            tips: [
              'Em modo Demo, nenhum áudio real é reproduzido',
              'O Spotify precisa estar instalado e rodando no sistema'
            ]
          },
          {
            id: 'faq-audio-delay',
            title: 'Há atraso no áudio',
            description: 'Os comandos demoram para fazer efeito',
            content: 'Latência entre comandos e resposta pode ser causada por rede, processamento, ou configuração do sistema.',
            steps: [
              '1. Use WebSocket em vez de Polling para menor latência',
              '2. Verifique a carga do processador do sistema',
              '3. Reduza o intervalo de polling se usando este modo',
              '4. Verifique a latência da rede com ping',
              '5. Reinicie os serviços se a latência aumentar com o tempo'
            ]
          },
          {
            id: 'faq-volume-not-changing',
            title: 'O volume não muda',
            description: 'Ajustes de volume não têm efeito',
            content: 'Se o volume do TSiJUKEBOX não afeta o áudio, pode haver desconexão entre o frontend e o controle de volume do sistema.',
            steps: [
              '1. Verifique se está em modo Demo (volume é simulado)',
              '2. Confirme que o backend está recebendo os comandos',
              '3. Verifique os logs do servidor para erros',
              '4. Teste o controle de volume via terminal (playerctl)',
              '5. Reinicie o serviço do player'
            ]
          }
        ]
      },
      {
        id: 'interface-issues',
        title: 'Problemas de Interface',
        articles: [
          {
            id: 'faq-blank-screen',
            title: 'Tela preta ou branca',
            description: 'A interface não carrega corretamente',
            content: 'Uma tela em branco geralmente indica erro de JavaScript ou falha no carregamento de recursos.',
            steps: [
              '1. Abra o console do navegador (F12) e verifique erros',
              '2. Limpe o cache do navegador e recarregue',
              '3. Verifique a conexão de rede',
              '4. Tente em modo anônimo/privado',
              '5. Desabilite extensões do navegador',
              '6. Verifique se os arquivos estáticos estão sendo servidos'
            ]
          },
          {
            id: 'faq-buttons-not-responding',
            title: 'Botões não respondem ao toque',
            description: 'Toques na tela não têm efeito',
            content: 'Botões não responsivos podem indicar problema de touch, overlay invisível, ou JavaScript travado.',
            steps: [
              '1. Verifique se há algum modal/overlay aberto',
              '2. Recarregue a página',
              '3. Verifique erros no console do navegador',
              '4. Teste com mouse para confirmar se é problema de touch',
              '5. Calibre a tela de toque se disponível',
              '6. Reinicie o navegador em modo kiosk'
            ]
          },
          {
            id: 'faq-album-art-missing',
            title: 'Capa do álbum não aparece',
            description: 'A imagem da capa não carrega',
            content: 'Capas de álbum que não carregam podem indicar problema de conexão com Spotify CDN ou CORS.',
            steps: [
              '1. Verifique a conexão com internet',
              '2. Confirme que URLs do Spotify CDN não estão bloqueadas',
              '3. Verifique se há erros de CORS no console',
              '4. Limpe o cache de imagens do navegador',
              '5. Em modo Demo, imagens são locais e sempre funcionam'
            ]
          },
          {
            id: 'faq-slow-animations',
            title: 'Animações lentas ou travando',
            description: 'A interface está lenta',
            content: 'Performance degradada pode ser causada por hardware limitado, muitos processos, ou renderização pesada.',
            steps: [
              '1. Ative "Reduzir Animações" em Acessibilidade',
              '2. Feche outras aplicações consumindo recursos',
              '3. Verifique a temperatura do processador',
              '4. Use um navegador mais leve se possível',
              '5. Reduza a resolução da tela se necessário'
            ],
            tips: ['Chromium em modo kiosk geralmente tem melhor performance']
          }
        ]
      },
      {
        id: 'config-issues',
        title: 'Problemas de Configuração',
        articles: [
          {
            id: 'faq-settings-not-saving',
            title: 'Configurações não salvam',
            description: 'Mudanças são perdidas ao recarregar',
            content: 'Configurações são salvas em localStorage. Se não persistem, pode haver problema de armazenamento ou modo privado.',
            steps: [
              '1. Verifique se não está em modo privado/anônimo',
              '2. Confirme que localStorage está habilitado no navegador',
              '3. Verifique se há espaço suficiente no localStorage',
              '4. Tente limpar o localStorage e reconfigurar',
              '5. Exporte configurações antes de limpar como backup'
            ]
          },
          {
            id: 'faq-theme-reset',
            title: 'Tema volta ao padrão',
            description: 'O tema personalizado não persiste',
            content: 'Temas customizados são salvos localmente. Se resetam, pode haver conflito ou falha no salvamento.',
            steps: [
              '1. Aplique o tema e verifique se foi salvo corretamente',
              '2. Não limpe dados do site/navegador',
              '3. Exporte o tema para backup',
              '4. Verifique se há erros no console ao salvar'
            ]
          },
          {
            id: 'faq-weather-error',
            title: 'Widget de clima mostra erro',
            description: 'O clima não carrega ou mostra erro',
            content: 'Erros no widget de clima geralmente são relacionados à API Key ou configuração de localização.',
            steps: [
              '1. Verifique se a API Key do OpenWeatherMap é válida',
              '2. Confirme que não excedeu o limite de requisições',
              '3. Verifique se o nome da cidade está correto',
              '4. Teste a API Key diretamente na documentação do OWM',
              '5. Verifique se há firewall bloqueando api.openweathermap.org'
            ],
            tips: ['API Keys gratuitas têm limite de 60 requisições/minuto']
          }
        ]
      }
    ]
  },
  // =============================================
  // SPICETIFY COMPLETO - 25+ artigos
  // =============================================
  {
    id: 'spicetify',
    title: 'Spicetify',
    icon: 'Palette',
    description: 'Guia completo de personalização do Spotify com Spicetify',
    subSections: [
      {
        id: 'spicetify-getting-started',
        title: 'Primeiros Passos',
        articles: [
          {
            id: 'spicetify-what-is',
            title: 'O que é Spicetify?',
            description: 'Introdução ao Spicetify e suas funcionalidades',
            content: 'Spicetify é uma ferramenta de linha de comando que permite personalizar completamente o cliente desktop do Spotify. Com ela, você pode aplicar temas, instalar extensões, adicionar snippets CSS e muito mais.',
            tips: [
              'Spicetify funciona apenas com o cliente desktop do Spotify',
              'Não funciona com Spotify Web Player',
              'É completamente gratuito e open source'
            ]
          },
          {
            id: 'spicetify-install-linux',
            title: 'Instalação no Linux/CachyOS',
            description: 'Como instalar o Spicetify em sistemas Linux',
            content: 'A instalação do Spicetify em Linux é simples e pode ser feita via script ou gerenciador de pacotes.',
            steps: [
              'Certifique-se que o Spotify está instalado',
              'Execute: curl -fsSL https://raw.githubusercontent.com/spicetify/spicetify-cli/master/install.sh | sh',
              'Adicione ao PATH: export PATH=$PATH:~/.spicetify',
              'Execute: spicetify backup apply',
              'Reinicie o Spotify'
            ],
            tips: [
              'No CachyOS, você pode usar: yay -S spicetify-cli',
              'Sempre faça backup antes de aplicar mudanças'
            ]
          },
          {
            id: 'spicetify-install-windows',
            title: 'Instalação no Windows',
            description: 'Como instalar o Spicetify no Windows',
            content: 'No Windows, a instalação pode ser feita via PowerShell com privilégios administrativos.',
            steps: [
              'Abra PowerShell como Administrador',
              'Execute: iwr -useb https://raw.githubusercontent.com/spicetify/spicetify-cli/master/install.ps1 | iex',
              'Execute: spicetify backup apply enable-devtools',
              'Reinicie o Spotify'
            ]
          },
          {
            id: 'spicetify-first-config',
            title: 'Primeira Configuração',
            description: 'Configuração inicial do Spicetify',
            content: 'Após a instalação, o Spicetify precisa ser configurado para reconhecer seu Spotify e aplicar as customizações.',
            steps: [
              'Execute: spicetify para criar o arquivo de configuração',
              'O config.ini será criado em ~/.config/spicetify',
              'Execute: spicetify backup para criar backup do Spotify original',
              'Execute: spicetify apply para aplicar as configurações'
            ]
          },
          {
            id: 'spicetify-update',
            title: 'Atualizar Spicetify',
            description: 'Como manter o Spicetify atualizado',
            content: 'É importante manter o Spicetify atualizado, especialmente após atualizações do Spotify.',
            steps: [
              'Execute: spicetify upgrade',
              'Após atualização do Spotify, execute: spicetify backup apply',
              'Se houver problemas, execute: spicetify restore backup apply'
            ],
            tips: ['O Spotify pode quebrar o Spicetify após atualizações automáticas']
          },
          {
            id: 'spicetify-uninstall',
            title: 'Remover Spicetify',
            description: 'Como remover completamente o Spicetify',
            content: 'Para remover o Spicetify e restaurar o Spotify original:',
            steps: [
              'Execute: spicetify restore',
              'Delete a pasta ~/.spicetify',
              'Delete a pasta ~/.config/spicetify',
              'Reinicie o Spotify'
            ]
          }
        ]
      },
      {
        id: 'spicetify-themes',
        title: 'Temas',
        articles: [
          {
            id: 'spicetify-apply-theme',
            title: 'Aplicar um Tema',
            description: 'Como aplicar temas no Spotify',
            content: 'Temas mudam completamente a aparência do Spotify, incluindo cores, fontes e layout.',
            steps: [
              'Baixe o tema desejado para ~/.config/spicetify/Themes/',
              'Edite config.ini: current_theme = NomeDoTema',
              'Execute: spicetify apply',
              'Reinicie o Spotify'
            ]
          },
          {
            id: 'spicetify-create-theme',
            title: 'Criar Tema Personalizado',
            description: 'Como criar seu próprio tema',
            content: 'Você pode criar temas customizados definindo cores e estilos CSS.',
            steps: [
              'Crie uma pasta em ~/.config/spicetify/Themes/MeuTema/',
              'Crie color.ini com as cores desejadas',
              'Crie user.css para estilos adicionais (opcional)',
              'Aplique: spicetify config current_theme MeuTema && spicetify apply'
            ],
            tips: ['Use o tema Sleek como base para começar']
          },
          {
            id: 'spicetify-theme-dribbblish',
            title: 'Tema Dribbblish',
            description: 'Um dos temas mais populares',
            content: 'Dribbblish é um tema moderno com visual limpo e várias opções de cores.',
            steps: [
              'Clone: git clone https://github.com/spicetify/spicetify-themes',
              'Copie Dribbblish para Themes/',
              'Configure: spicetify config current_theme Dribbblish color_scheme base',
              'Execute: spicetify apply'
            ]
          },
          {
            id: 'spicetify-theme-catppuccin',
            title: 'Tema Catppuccin',
            description: 'Tema com paleta de cores suaves',
            content: 'Catppuccin oferece 4 variantes: Latte, Frappé, Macchiato e Mocha.',
            steps: [
              'Baixe de github.com/catppuccin/spicetify',
              'Copie para ~/.config/spicetify/Themes/',
              'Configure: spicetify config current_theme catppuccin color_scheme mocha',
              'Execute: spicetify apply'
            ]
          },
          {
            id: 'spicetify-color-schemes',
            title: 'Esquemas de Cores',
            description: 'Como criar e aplicar esquemas de cores',
            content: 'Cada tema pode ter múltiplos esquemas de cores definidos no arquivo color.ini.',
            steps: [
              'Abra ~/.config/spicetify/Themes/NomeDoTema/color.ini',
              'Adicione uma nova seção [MeuEsquema]',
              'Defina as variáveis de cor',
              'Aplique: spicetify config color_scheme MeuEsquema && spicetify apply'
            ]
          }
        ]
      },
      {
        id: 'spicetify-extensions',
        title: 'Extensões',
        articles: [
          {
            id: 'spicetify-ext-install',
            title: 'Instalar Extensões',
            description: 'Como adicionar extensões ao Spotify',
            content: 'Extensões adicionam funcionalidades extras ao Spotify.',
            steps: [
              'Baixe o arquivo .js da extensão',
              'Copie para ~/.config/spicetify/Extensions/',
              'Execute: spicetify config extensions nome.js',
              'Execute: spicetify apply'
            ]
          },
          {
            id: 'spicetify-ext-shuffle-plus',
            title: 'Shuffle+ (Embaralhar Melhorado)',
            description: 'Algoritmo de shuffle mais inteligente',
            content: 'Shuffle+ melhora o algoritmo de embaralhamento do Spotify para evitar repetições e criar uma experiência mais variada.',
            tips: ['Evita tocar a mesma música em sequência', 'Distribui melhor artistas na fila']
          },
          {
            id: 'spicetify-ext-lyrics-plus',
            title: 'Lyrics+ (Letras Sincronizadas)',
            description: 'Letras sincronizadas em tempo real',
            content: 'Exibe letras sincronizadas durante a reprodução, buscando de múltiplas fontes.',
            tips: ['Sincroniza com a música em tempo real', 'Suporta múltiplos idiomas']
          },
          {
            id: 'spicetify-ext-keyboard',
            title: 'Keyboard Shortcut',
            description: 'Atalhos de teclado adicionais',
            content: 'Adiciona atalhos de teclado personalizáveis para controlar o Spotify.',
            tips: ['Configure atalhos globais', 'Funciona mesmo com janela minimizada']
          },
          {
            id: 'spicetify-ext-full-display',
            title: 'Full App Display',
            description: 'Modo de tela cheia aprimorado',
            content: 'Exibe a capa do álbum e informações da música em tela cheia.',
            tips: ['Ideal para uso em TVs', 'Mostra visualizações de áudio']
          }
        ]
      },
      {
        id: 'spicetify-snippets',
        title: 'Snippets CSS',
        articles: [
          {
            id: 'spicetify-snippets-what',
            title: 'O que são Snippets?',
            description: 'Introdução aos snippets CSS',
            content: 'Snippets são pequenos trechos de CSS que modificam elementos específicos da interface sem mudar o tema inteiro.',
            tips: ['Podem ser combinados com qualquer tema', 'Fácil de ativar/desativar']
          },
          {
            id: 'spicetify-snippets-add',
            title: 'Adicionar Snippet',
            description: 'Como adicionar snippets customizados',
            content: 'Snippets podem ser adicionados ao arquivo user.css do tema atual.',
            steps: [
              'Abra ~/.config/spicetify/Themes/NomeDoTema/user.css',
              'Adicione o código CSS do snippet',
              'Execute: spicetify apply',
              'Reinicie o Spotify'
            ]
          },
          {
            id: 'spicetify-snippets-roundedui',
            title: 'Snippet Rounded UI',
            description: 'Adiciona bordas arredondadas',
            content: 'Este snippet arredonda os cantos de todos os elementos da interface para um visual mais suave.',
            tips: ['Combina bem com temas modernos']
          },
          {
            id: 'spicetify-snippets-hideads',
            title: 'Snippet Hide Ads',
            description: 'Remove elementos promocionais',
            content: 'Oculta banners e elementos promocionais da interface (não bloqueia ads de áudio).',
            tips: ['Não bloqueia anúncios de áudio', 'Apenas visual']
          }
        ]
      },
      {
        id: 'spicetify-marketplace',
        title: 'Marketplace',
        articles: [
          {
            id: 'spicetify-marketplace-setup',
            title: 'Habilitar Marketplace',
            description: 'Como ativar o Marketplace do Spicetify',
            content: 'O Marketplace permite instalar temas, extensões e snippets diretamente do Spotify.',
            steps: [
              'Execute: spicetify config custom_apps marketplace',
              'Execute: spicetify apply',
              'Acesse pelo menu lateral do Spotify',
              'Explore e instale com um clique'
            ]
          },
          {
            id: 'spicetify-marketplace-browse',
            title: 'Navegar Marketplace',
            description: 'Como explorar o Marketplace',
            content: 'O Marketplace organiza itens em categorias: Extensions, Themes, Apps e Snippets.',
            tips: ['Use filtros para encontrar itens', 'Veja avaliações da comunidade']
          },
          {
            id: 'spicetify-marketplace-install',
            title: 'Instalar do Marketplace',
            description: 'Como instalar itens do Marketplace',
            content: 'Instalação simplificada com um clique.',
            steps: [
              'Encontre o item desejado',
              'Clique em Install',
              'Aguarde o download e aplicação automática',
              'Algumas instalações requerem reiniciar o Spotify'
            ]
          }
        ]
      },
      {
        id: 'spicetify-troubleshooting',
        title: 'Solução de Problemas',
        articles: [
          {
            id: 'spicetify-after-update',
            title: 'Após Atualização do Spotify',
            description: 'O que fazer quando o Spotify atualiza',
            content: 'Atualizações do Spotify podem quebrar customizações do Spicetify.',
            steps: [
              'Execute: spicetify backup apply',
              'Se não funcionar: spicetify restore backup apply',
              'Atualize o Spicetify: spicetify upgrade',
              'Reaplique as configurações'
            ]
          },
          {
            id: 'spicetify-not-working',
            title: 'Spicetify Não Funciona',
            description: 'Diagnóstico de problemas gerais',
            content: 'Passos para resolver problemas comuns do Spicetify.',
            steps: [
              'Verifique se o caminho do Spotify está correto em config.ini',
              'Execute: spicetify restore para restaurar backup',
              'Reconfigure: spicetify backup apply enable-devtools',
              'Verifique permissões da pasta do Spotify'
            ]
          },
          {
            id: 'spicetify-theme-broken',
            title: 'Tema Não Aplica',
            description: 'Quando o tema não funciona',
            content: 'Problemas com temas geralmente são causados por arquivos incorretos ou incompatibilidade.',
            steps: [
              'Verifique se a pasta do tema está em Themes/',
              'Confirme que color.ini existe e está válido',
              'Tente com um tema diferente para testar',
              'Verifique logs: spicetify -v apply'
            ]
          },
          {
            id: 'spicetify-reset',
            title: 'Resetar Spicetify',
            description: 'Como fazer reset completo',
            content: 'Para um reset completo e recomeçar do zero:',
            steps: [
              'Execute: spicetify restore',
              'Delete ~/.config/spicetify',
              'Reinstale o Spotify (opcional mas recomendado)',
              'Reinstale o Spicetify',
              'Configure novamente do início'
            ]
          }
        ]
      }
    ]
  },
  // =============================================
  // STORJ CLOUD STORAGE - 15+ artigos
  // =============================================
  {
    id: 'storj-cloud',
    title: 'Storj Cloud Storage',
    icon: 'Satellite',
    description: 'Armazenamento descentralizado para backups e arquivos',
    subSections: [
      {
        id: 'storj-getting-started',
        title: 'Primeiros Passos',
        articles: [
          {
            id: 'storj-what-is',
            title: 'O que é Storj?',
            description: 'Introdução ao Storj DCS',
            content: 'Storj é uma plataforma de armazenamento em nuvem descentralizada que oferece segurança, privacidade e custos reduzidos comparado a soluções tradicionais.',
            tips: [
              'Dados são criptografados end-to-end',
              'Distribuídos em milhares de nós globalmente',
              'Compatível com protocolo S3'
            ]
          },
          {
            id: 'storj-create-account',
            title: 'Criar Conta Storj',
            description: 'Como criar uma conta no Storj',
            content: 'O registro no Storj é gratuito e oferece créditos iniciais para teste.',
            steps: [
              'Acesse storj.io/signup',
              'Preencha email e senha',
              'Confirme o email',
              'Complete a verificação',
              'Receba créditos gratuitos iniciais'
            ]
          },
          {
            id: 'storj-pricing',
            title: 'Preços e Planos',
            description: 'Entenda os custos do Storj',
            content: 'Storj usa modelo pay-as-you-go com preços competitivos.',
            tips: [
              'Armazenamento: $4/TB/mês',
              'Download: $7/TB',
              'Upload e operações: grátis',
              'Sem taxas de egress para transferências entre regiões'
            ]
          },
          {
            id: 'storj-security',
            title: 'Segurança e Criptografia',
            description: 'Como o Storj protege seus dados',
            content: 'Storj oferece criptografia de ponta a ponta com chaves que você controla.',
            tips: [
              'Criptografia AES-256-GCM',
              'Chaves nunca são compartilhadas com Storj',
              'Dados são fragmentados e distribuídos',
              'Redundância de 80 peças em 29 nós mínimo'
            ]
          }
        ]
      },
      {
        id: 'storj-access-grants',
        title: 'Access Grants',
        articles: [
          {
            id: 'storj-create-grant',
            title: 'Criar Access Grant',
            description: 'Como gerar um Access Grant',
            content: 'Access Grants são credenciais que permitem acesso aos seus buckets e objetos.',
            steps: [
              'Acesse o console do Storj',
              'Vá em Access > Create Access',
              'Escolha tipo: Full Access ou Restricted',
              'Defina nome e permissões',
              'Copie e guarde o Access Grant gerado'
            ],
            tips: ['Access Grants são mostrados apenas uma vez', 'Guarde em local seguro']
          },
          {
            id: 'storj-grant-permissions',
            title: 'Permissões de Access Grant',
            description: 'Tipos de permissões disponíveis',
            content: 'Access Grants podem ter permissões granulares para diferentes operações.',
            tips: [
              'Read: listar e baixar objetos',
              'Write: fazer upload de objetos',
              'Delete: remover objetos',
              'List: listar conteúdo de buckets'
            ]
          },
          {
            id: 'storj-s3-credentials',
            title: 'Credenciais S3',
            description: 'Usar Storj via protocolo S3',
            content: 'Storj é compatível com S3, permitindo usar ferramentas existentes.',
            steps: [
              'Vá em Access > Create S3 Credentials',
              'Gere Access Key e Secret Key',
              'Use endpoint: gateway.storjshare.io',
              'Configure em seu cliente S3 favorito'
            ]
          }
        ]
      },
      {
        id: 'storj-backup-tsijukebox',
        title: 'Backup no TSiJUKEBOX',
        articles: [
          {
            id: 'storj-configure-backup',
            title: 'Configurar Backup Storj',
            description: 'Como configurar backup para Storj no TSiJUKEBOX',
            content: 'O TSiJUKEBOX suporta backup automático para Storj usando Access Grant.',
            steps: [
              'Acesse Configurações > Cloud Backup',
              'Selecione Storj como provedor',
              'Cole seu Access Grant',
              'Defina o bucket de destino',
              'Salve e teste a conexão'
            ]
          },
          {
            id: 'storj-manual-backup',
            title: 'Backup Manual',
            description: 'Como executar backup manual',
            content: 'Backups manuais podem ser executados a qualquer momento.',
            steps: [
              'Acesse Configurações > Backup',
              'Na aba Cloud, clique em "Backup Agora"',
              'Aguarde o upload completar',
              'Verifique o status na lista de backups'
            ]
          },
          {
            id: 'storj-scheduled-backup',
            title: 'Backup Agendado',
            description: 'Configurar backups automáticos',
            content: 'Configure backups automáticos em horários específicos.',
            steps: [
              'Acesse Configurações > Backup > Agendamento',
              'Ative "Backup Automático"',
              'Escolha frequência: Diário, Semanal, Mensal',
              'Defina horário de execução',
              'Configure retenção de backups antigos'
            ]
          },
          {
            id: 'storj-restore-backup',
            title: 'Restaurar Backup',
            description: 'Como restaurar dados do Storj',
            content: 'Restaure backups armazenados no Storj para recuperar dados.',
            steps: [
              'Acesse Configurações > Cloud Backup',
              'Liste backups disponíveis',
              'Selecione o backup desejado',
              'Clique em "Restaurar"',
              'Aguarde o download e aplicação'
            ],
            tips: ['Restauração substitui dados atuais', 'Faça backup local antes de restaurar']
          }
        ]
      },
      {
        id: 'storj-advanced',
        title: 'Recursos Avançados',
        articles: [
          {
            id: 'storj-versioning',
            title: 'Versionamento de Arquivos',
            description: 'Manter múltiplas versões de objetos',
            content: 'O versionamento permite manter histórico de alterações em seus arquivos.',
            tips: [
              'Ative por bucket nas configurações',
              'Cada versão é cobrada separadamente',
              'Útil para recuperação de dados'
            ]
          },
          {
            id: 'storj-object-lock',
            title: 'Object Lock (Proteção)',
            description: 'Proteger objetos contra exclusão',
            content: 'Object Lock impede que objetos sejam deletados ou modificados por um período.',
            tips: [
              'Ideal para compliance e auditoria',
              'Modo Governance: admins podem remover',
              'Modo Compliance: ninguém pode remover'
            ]
          },
          {
            id: 'storj-regions',
            title: 'Regiões Disponíveis',
            description: 'Escolher região para seus dados',
            content: 'Storj oferece múltiplas regiões para otimizar latência e compliance.',
            tips: [
              'US1: América do Norte',
              'EU1: Europa',
              'AP1: Ásia-Pacífico',
              'Dados podem ser globais por padrão'
            ]
          }
        ]
      }
    ]
  },
  // =============================================
  // MÚSICA LOCAL - 10+ artigos
  // =============================================
  {
    id: 'local-music',
    title: 'Música Local',
    icon: 'HardDrive',
    description: 'Gerencie arquivos MP3 locais e sincronize entre instâncias',
    subSections: [
      {
        id: 'local-music-upload',
        title: 'Upload e Gerenciamento',
        articles: [
          {
            id: 'local-upload-files',
            title: 'Fazer Upload de Músicas',
            description: 'Como adicionar músicas MP3 ao sistema',
            content: 'O sistema de música local permite fazer upload de arquivos MP3 para reprodução offline.',
            steps: [
              'Acesse Configurações > Integrações > Música Local',
              'Vá na aba "Upload"',
              'Arraste arquivos MP3 ou clique para selecionar',
              'Aguarde o upload e processamento',
              'Músicas aparecem na aba "Biblioteca"'
            ],
            tips: [
              'Formatos suportados: MP3, M4A, FLAC, OGG',
              'Metadados ID3 são extraídos automaticamente'
            ]
          },
          {
            id: 'local-delete-files',
            title: 'Excluir Arquivos',
            description: 'Como remover músicas do sistema',
            content: 'Músicas podem ser removidas individualmente ou em lote.',
            steps: [
              'Acesse a aba "Biblioteca"',
              'Selecione as músicas desejadas',
              'Clique em "Excluir Selecionados"',
              'Confirme a exclusão'
            ],
            tips: ['Exclusão remove de todos os usuários sincronizados']
          },
          {
            id: 'local-supported-formats',
            title: 'Formatos Suportados',
            description: 'Tipos de arquivo de áudio aceitos',
            content: 'O sistema suporta os principais formatos de áudio digital.',
            tips: [
              'MP3: formato mais comum, boa compatibilidade',
              'M4A/AAC: melhor qualidade em tamanhos menores',
              'FLAC: sem perdas, arquivos maiores',
              'OGG: formato livre, boa compressão'
            ]
          }
        ]
      },
      {
        id: 'local-music-sync',
        title: 'Sincronização',
        articles: [
          {
            id: 'local-sync-all-users',
            title: 'Sincronizar para Todos os Usuários',
            description: 'Distribuir músicas para todos os usuários do sistema',
            content: 'A sincronização copia músicas para /home/$user/Music/ de todos os usuários cadastrados.',
            steps: [
              'Acesse a aba "Sincronização"',
              'Selecione as músicas a sincronizar',
              'Clique em "Sincronizar Todos"',
              'Aguarde a cópia para cada usuário'
            ],
            tips: [
              'Requer permissões root',
              'Sincronização via rsync para eficiência'
            ]
          },
          {
            id: 'local-sync-single-user',
            title: 'Sincronizar para Usuário Específico',
            description: 'Sincronizar músicas para um usuário específico',
            content: 'Você pode sincronizar músicas seletivamente para usuários específicos.',
            steps: [
              'Acesse a aba "Sincronização"',
              'Selecione o usuário na lista',
              'Escolha as músicas',
              'Clique em "Sincronizar"'
            ]
          },
          {
            id: 'local-sync-status',
            title: 'Status de Sincronização',
            description: 'Monitorar progresso de sincronização',
            content: 'O sistema mostra o status em tempo real das sincronizações em andamento.',
            tips: [
              'Verde: sincronizado com sucesso',
              'Amarelo: sincronização em andamento',
              'Vermelho: erro na sincronização'
            ]
          }
        ]
      },
      {
        id: 'local-music-replication',
        title: 'Replicação Multi-Instância',
        articles: [
          {
            id: 'local-register-instance',
            title: 'Registrar Outra Instância',
            description: 'Como adicionar outras instâncias TSiJUKEBOX',
            content: 'Registre outras instalações do TSiJUKEBOX para replicar músicas entre elas.',
            steps: [
              'Acesse a aba "Instâncias"',
              'Clique em "Registrar Nova"',
              'Informe URL e nome da instância',
              'Teste a conexão',
              'Salve o registro'
            ]
          },
          {
            id: 'local-replicate-library',
            title: 'Replicar Biblioteca',
            description: 'Copiar músicas para outras instâncias',
            content: 'Replique toda sua biblioteca ou músicas selecionadas para outras instâncias TSiJUKEBOX.',
            steps: [
              'Selecione músicas na biblioteca',
              'Escolha instâncias de destino',
              'Clique em "Replicar"',
              'Aguarde a transferência'
            ],
            tips: [
              'Transferência via SSH/rsync',
              'Compressão durante transferência'
            ]
          },
          {
            id: 'local-bulk-operations',
            title: 'Operações em Lote',
            description: 'Gerenciar múltiplas músicas simultaneamente',
            content: 'Execute operações em várias músicas de uma vez.',
            tips: [
              'Selecione múltiplas músicas com Ctrl+Click',
              'Use Shift+Click para selecionar intervalo',
              'Ações disponíveis: excluir, sincronizar, replicar, criar playlist'
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'technical-docs',
    title: 'Documentação Técnica',
    icon: 'FileCode',
    description: 'Guias para desenvolvedores, referência de API e práticas de segurança',
    subSections: [
      {
        id: 'quickstart',
        title: 'Início Rápido',
        articles: [
          {
            id: 'doc-getting-started',
            title: 'Guia de Início Rápido',
            description: 'Primeira instalação do TSiJUKEBOX em 5 minutos',
            content: 'Este guia ajuda você a instalar e configurar o TSiJUKEBOX rapidamente. Siga os passos abaixo para ter o sistema funcionando em minutos.',
            steps: [
              'Clone o repositório: git clone https://github.com/seu-usuario/tsijukebox.git',
              'Entre na pasta: cd tsijukebox',
              'Instale dependências: npm install',
              'Configure o arquivo .env com suas credenciais',
              'Inicie o servidor de desenvolvimento: npm run dev',
              'Acesse http://localhost:5173 no navegador'
            ],
            tips: [
              'Use Node.js 18+ para melhor compatibilidade',
              'O Bun também é suportado como alternativa ao npm',
              'Configure o Supabase antes de usar recursos de autenticação'
            ],
            relatedArticles: ['doc-installation', 'doc-configuration']
          },
          {
            id: 'doc-installation',
            title: 'Instalação Completa',
            description: 'Todas as opções de instalação: bare metal, Docker, script Python',
            content: 'O TSiJUKEBOX oferece múltiplas opções de instalação para atender diferentes necessidades de deployment. Escolha a opção que melhor se adapta ao seu ambiente.',
            steps: [
              'Bare Metal: Clone o repositório e execute npm install && npm run build',
              'Docker: Use docker-compose up para iniciar todos os serviços',
              'Script Python: Execute python scripts/installer/main.py --full para instalação automatizada',
              'Cloud: Conecte-se ao Lovable Cloud para deployment automático'
            ],
            tips: [
              'Use Docker para ambientes de produção isolados',
              'O script Python instala automaticamente Grafana, Prometheus, Nginx e mais',
              'Para Arch Linux, o instalador usa pacman e AUR helpers'
            ],
            relatedArticles: ['doc-getting-started', 'doc-configuration']
          }
        ]
      },
      {
        id: 'developer',
        title: 'Para Desenvolvedores',
        articles: [
          {
            id: 'doc-dev-guide',
            title: 'Guia do Desenvolvedor',
            description: 'Arquitetura do projeto, padrões de código e contribuição',
            content: 'O TSiJUKEBOX segue uma arquitetura modular baseada em React + TypeScript. Os componentes são organizados por domínio, e hooks encapsulam a lógica de negócios.',
            steps: [
              'Estrutura: src/components (UI), src/hooks (lógica), src/pages (rotas), src/lib (utilitários)',
              'Estilo: Use Tailwind CSS com tokens semânticos do design system',
              'Estado: Prefer hooks customizados e React Query para dados remotos',
              'Testes: Execute npm run test para rodar Vitest',
              'Linting: npm run lint para verificar padrões de código'
            ],
            tips: [
              'Componentes devem ser pequenos e focados (< 200 linhas)',
              'Extraia lógica complexa para hooks customizados',
              'Use TypeScript strict mode para máxima segurança de tipos',
              'Documente props de componentes com JSDoc'
            ],
            relatedArticles: ['doc-api-reference', 'doc-hooks-architecture']
          },
          {
            id: 'doc-api-reference',
            title: 'Referência de API',
            description: 'Documentação completa de hooks, endpoints e tipos',
            content: 'Esta referência documenta todas as APIs públicas do TSiJUKEBOX, incluindo hooks React, funções utilitárias, tipos TypeScript e endpoints de backend.',
            steps: [
              'Hooks de Autenticação: useLocalAuth, useSupabaseAuth, useAuthConfig',
              'Hooks de Player: usePlayer, usePlaybackControls, useVolume, useLyrics',
              'Hooks de Spotify: useSpotifyPlayer, useSpotifyLibrary, useSpotifySearch',
              'Hooks de YouTube: useYouTubeMusicPlayer, useYouTubeMusicLibrary',
              'Hooks de Sistema: useWeather, useNetworkStatus, useWebSocketStatus'
            ],
            tips: [
              'Hooks são organizados por domínio em src/hooks/',
              'Importe hooks do arquivo index: import { usePlayer } from "@/hooks"',
              'Consulte os arquivos .test.ts para exemplos de uso'
            ],
            relatedArticles: ['doc-hooks-architecture', 'doc-dev-guide']
          },
          {
            id: 'doc-hooks-architecture',
            title: 'Arquitetura de Hooks',
            description: 'Organização e padrões de hooks React',
            content: 'Os hooks do TSiJUKEBOX seguem uma arquitetura em camadas que separa preocupações e facilita testes e manutenção.',
            steps: [
              'Camada Auth: Gerencia autenticação local e Supabase',
              'Camada Common: Hooks utilitários reutilizáveis (useDebounce, useMobile)',
              'Camada Player: Controle de reprodução e fila de músicas',
              'Camada Spotify/YouTube: Integração com APIs de streaming',
              'Camada System: Monitoramento, rede, WebSocket, clima'
            ],
            tips: [
              'Use useCallback para funções passadas como props',
              'Evite efeitos colaterais em renders - use useEffect',
              'Testes unitários em __tests__/ ao lado de cada hook',
              'Mocks disponíveis em src/test/mocks/'
            ],
            relatedArticles: ['doc-api-reference', 'doc-dev-guide']
          },
          {
            id: 'doc-backend-endpoints',
            title: 'Endpoints de Backend',
            description: 'Edge Functions e APIs do servidor',
            content: 'O backend do TSiJUKEBOX é implementado como Edge Functions Supabase, oferecendo escalabilidade automática e baixa latência.',
            steps: [
              'spotify-auth: Autenticação OAuth com Spotify',
              'youtube-music-auth: Autenticação com YouTube Music',
              'lyrics-search: Busca de letras sincronizadas',
              'github-repo: Informações do repositório'
            ],
            tips: [
              'Edge Functions são deployadas automaticamente',
              'Use secrets para API keys (nunca hardcode)',
              'Logs disponíveis em supabase/functions/'
            ],
            relatedArticles: ['doc-api-reference', 'doc-security']
          }
        ]
      },
      {
        id: 'configuration',
        title: 'Configuração',
        articles: [
          {
            id: 'doc-configuration',
            title: 'Configurações Avançadas',
            description: 'Todas as opções de configuração do sistema',
            content: 'O TSiJUKEBOX oferece configurações extensivas para personalizar comportamento, aparência e integrações do sistema.',
            steps: [
              'Variáveis de Ambiente: Configure em .env (VITE_SUPABASE_URL, etc.)',
              'Temas: Use ThemeCustomizer ou edite index.css para cores personalizadas',
              'Integrações: Configure Spotify, YouTube Music, NTP, Weather API',
              'Backup: Configure schedule e destinos (local, cloud, SSH)',
              'Acessibilidade: Alto contraste, tamanho de fonte, animações reduzidas'
            ],
            tips: [
              'Variáveis VITE_ são expostas no client-side',
              'Use secrets do Supabase para credenciais sensíveis',
              'Configurações são persistidas no localStorage por padrão'
            ],
            relatedArticles: ['doc-troubleshooting', 'doc-security']
          },
          {
            id: 'doc-troubleshooting',
            title: 'Solução de Problemas',
            description: 'Problemas comuns e como resolvê-los',
            content: 'Este guia ajuda a diagnosticar e resolver os problemas mais comuns encontrados ao usar o TSiJUKEBOX.',
            steps: [
              'Erro de conexão Spotify: Verifique credenciais OAuth e callback URL',
              'Música não toca: Verifique se há dispositivo Spotify ativo',
              'Sincronização falha: Verifique conexão de rede e WebSocket',
              'Letras não aparecem: Verifique cache de letras e API de lyrics',
              'Tema não aplica: Limpe cache do navegador e recarregue'
            ],
            tips: [
              'Abra DevTools (F12) para ver erros no console',
              'Verifique logs de rede para falhas de API',
              'Limpar localStorage pode resolver muitos problemas',
              'Use modo incógnito para descartar extensões conflitantes'
            ],
            relatedArticles: ['doc-configuration', 'doc-security']
          }
        ]
      },
      {
        id: 'security',
        title: 'Segurança',
        articles: [
          {
            id: 'doc-security',
            title: 'Guia de Segurança',
            description: 'Práticas de segurança, autenticação e RLS',
            content: 'A segurança do TSiJUKEBOX é implementada em múltiplas camadas: autenticação de usuários, Row Level Security (RLS) no banco de dados, e validação de entrada.',
            steps: [
              'Autenticação: Use Supabase Auth ou sistema local com bcrypt',
              'RLS: Todas as tabelas têm políticas que restringem acesso por user_id',
              'CORS: Edge Functions validam origem das requisições',
              'Secrets: API keys são armazenadas em variáveis de ambiente seguras',
              'Validação: Zod valida todas as entradas de usuário'
            ],
            tips: [
              'Nunca exponha chaves de API no código frontend',
              'Use HTTPS em produção',
              'Revise RLS policies após criar novas tabelas',
              'Habilite 2FA quando possível'
            ],
            relatedArticles: ['doc-configuration', 'doc-dev-guide']
          },
          {
            id: 'doc-accessibility',
            title: 'Guia de Acessibilidade',
            description: 'Conformidade WCAG e práticas inclusivas',
            content: 'O TSiJUKEBOX segue as diretrizes WCAG 2.1 AA para garantir que todos os usuários possam usar o sistema.',
            steps: [
              'Navegação por teclado: Tab, Enter, Escape funcionam em toda a UI',
              'Leitores de tela: ARIA labels em todos os elementos interativos',
              'Contraste: Modo alto contraste disponível em configurações',
              'Animações: Opção para reduzir movimento para usuários sensíveis',
              'Fontes: Tamanho ajustável de 12px a 20px'
            ],
            tips: [
              'Use axe-core para auditar acessibilidade',
              'Teste com leitores de tela reais (NVDA, VoiceOver)',
              'Mantenha ratio de contraste mínimo de 4.5:1',
              'Evite informação apenas por cor'
            ],
            relatedArticles: ['doc-security', 'doc-dev-guide']
          }
        ]
      },
      {
        id: 'reference',
        title: 'Referência',
        articles: [
          {
            id: 'doc-changelog',
            title: 'Histórico de Versões',
            description: 'Changelog completo do projeto',
            content: 'Histórico de todas as versões do TSiJUKEBOX com features, correções e breaking changes.',
            steps: [
              'v4.0.0 Enterprise: Brand Guidelines, Analytics Dashboard, Instalador Python avançado',
              'v3.5.0: PWA offline, Wiki expandida, Métricas de instalação',
              'v3.0.0: YouTube Music integration, NTP sync, Weather widget',
              'v2.0.0: Spotify Connect, Queue management, Themes',
              'v1.0.0: Release inicial com player básico'
            ],
            tips: [
              'Consulte CHANGELOG.md para detalhes completos',
              'Breaking changes são marcados com ⚠️',
              'Migrations são fornecidas para upgrades'
            ],
            relatedArticles: ['doc-glossary', 'doc-getting-started']
          },
          {
            id: 'doc-glossary',
            title: 'Glossário',
            description: 'Termos técnicos explicados para todos os níveis',
            content: 'Definições dos termos técnicos usados na documentação e interface do TSiJUKEBOX.',
            steps: [
              'RLS (Row Level Security): Políticas de banco que restringem acesso por usuário',
              'Edge Function: Função serverless executada em CDN próximo ao usuário',
              'OAuth: Protocolo de autorização usado por Spotify e YouTube',
              'PWA (Progressive Web App): App web que funciona offline e pode ser instalado',
              'WebSocket: Conexão bidirecional para dados em tempo real',
              'Spicetify: Ferramenta para customizar cliente Spotify desktop'
            ],
            tips: [
              'Consulte MDN Web Docs para termos web genéricos',
              'Supabase Docs para termos específicos do banco',
              'Spotify Developer Docs para termos da API de streaming'
            ],
            relatedArticles: ['doc-changelog', 'doc-dev-guide']
          },
          {
            id: 'doc-credits',
            title: 'Créditos e Licenças',
            description: 'Atribuições de bibliotecas e assets',
            content: 'O TSiJUKEBOX usa várias bibliotecas open source e assets. Esta seção lista todas as atribuições necessárias.',
            tips: [
              'React (MIT License)',
              'Tailwind CSS (MIT License)',
              'Framer Motion (MIT License)',
              'Lucide Icons (ISC License)',
              'Supabase (Apache 2.0)',
              'shadcn/ui (MIT License)'
            ],
            relatedArticles: ['doc-glossary', 'doc-dev-guide']
          }
        ]
      }
    ]
  }
];

// Helper function to get all articles flattened
export function getAllArticles(): WikiArticle[] {
  const articles: WikiArticle[] = [];
  wikiCategories.forEach(category => {
    category.subSections.forEach(subSection => {
      articles.push(...subSection.articles);
    });
  });
  return articles;
}

// Helper function to find article by ID
export function findArticleById(id: string): WikiArticle | undefined {
  for (const category of wikiCategories) {
    for (const subSection of category.subSections) {
      const article = subSection.articles.find(a => a.id === id);
      if (article) return article;
    }
  }
  return undefined;
}

// Helper function to get breadcrumb path
export function getArticlePath(articleId: string): { category: WikiCategory; subSection: WikiSubSection; article: WikiArticle } | null {
  for (const category of wikiCategories) {
    for (const subSection of category.subSections) {
      const article = subSection.articles.find(a => a.id === articleId);
      if (article) {
        return { category, subSection, article };
      }
    }
  }
  return null;
}

// Get total article count
export function getTotalArticleCount(): number {
  return getAllArticles().length;
}

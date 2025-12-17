import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronDown, FolderOpen, FolderClosed, Minus } from 'lucide-react';
import { 
  Music, 
  Keyboard, 
  Palette, 
  Plug, 
  Shield, 
  Terminal, 
  HelpCircle 
} from 'lucide-react';
import { wikiCategories, WikiCategory, WikiSubSection } from './wikiData';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Toggle } from '@/components/ui/toggle';
import { cn } from '@/lib/utils';

interface WikiNavigationProps {
  selectedArticle: string | null;
  onSelectArticle: (articleId: string) => void;
  onSelectCategory: (categoryId: string) => void;
  selectedCategory: string | null;
}

const iconMap: Record<string, React.ReactNode> = {
  'Music': <Music className="w-4 h-4" />,
  'Keyboard': <Keyboard className="w-4 h-4" />,
  'Palette': <Palette className="w-4 h-4" />,
  'Plug': <Plug className="w-4 h-4" />,
  'Shield': <Shield className="w-4 h-4" />,
  'Terminal': <Terminal className="w-4 h-4" />,
  'HelpCircle': <HelpCircle className="w-4 h-4" />,
};

// Count total articles in a category
function getCategoryArticleCount(category: WikiCategory): number {
  return category.subSections.reduce((acc, sub) => acc + sub.articles.length, 0);
}

// Get total article count
function getTotalArticleCount(): number {
  return wikiCategories.reduce((acc, cat) => acc + getCategoryArticleCount(cat), 0);
}

export function WikiNavigation({ 
  selectedArticle, 
  onSelectArticle, 
  onSelectCategory,
  selectedCategory 
}: WikiNavigationProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(selectedCategory ? [selectedCategory] : [])
  );
  const [expandedSubSections, setExpandedSubSections] = useState<Set<string>>(new Set());
  const [showTreeLines, setShowTreeLines] = useState(true);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const navRef = useRef<HTMLDivElement>(null);

  // Build flat list for keyboard navigation
  const flatItems = useCallback(() => {
    const items: { type: 'category' | 'subsection' | 'article'; id: string; categoryId?: string; subSectionId?: string }[] = [];
    
    wikiCategories.forEach(category => {
      items.push({ type: 'category', id: category.id });
      if (expandedCategories.has(category.id)) {
        category.subSections.forEach(subSection => {
          items.push({ type: 'subsection', id: subSection.id, categoryId: category.id });
          if (expandedSubSections.has(subSection.id)) {
            subSection.articles.forEach(article => {
              items.push({ type: 'article', id: article.id, categoryId: category.id, subSectionId: subSection.id });
            });
          }
        });
      }
    });
    
    return items;
  }, [expandedCategories, expandedSubSections]);

  // Expand all categories and subsections
  const expandAll = () => {
    const allCategories = new Set(wikiCategories.map(c => c.id));
    const allSubSections = new Set(wikiCategories.flatMap(c => c.subSections.map(s => s.id)));
    setExpandedCategories(allCategories);
    setExpandedSubSections(allSubSections);
  };

  // Collapse all
  const collapseAll = () => {
    setExpandedCategories(new Set());
    setExpandedSubSections(new Set());
  };

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(categoryId)) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
      }
      return next;
    });
    onSelectCategory(categoryId);
  };

  const toggleSubSection = (subSectionId: string) => {
    setExpandedSubSections(prev => {
      const next = new Set(prev);
      if (next.has(subSectionId)) {
        next.delete(subSectionId);
      } else {
        next.add(subSectionId);
      }
      return next;
    });
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!navRef.current?.contains(document.activeElement)) return;
      
      const items = flatItems();
      
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setFocusedIndex(prev => Math.min(prev + 1, items.length - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setFocusedIndex(prev => Math.max(prev - 1, 0));
          break;
        case 'ArrowRight':
          e.preventDefault();
          if (focusedIndex >= 0 && items[focusedIndex]) {
            const item = items[focusedIndex];
            if (item.type === 'category' && !expandedCategories.has(item.id)) {
              toggleCategory(item.id);
            } else if (item.type === 'subsection' && !expandedSubSections.has(item.id)) {
              toggleSubSection(item.id);
            }
          }
          break;
        case 'ArrowLeft':
          e.preventDefault();
          if (focusedIndex >= 0 && items[focusedIndex]) {
            const item = items[focusedIndex];
            if (item.type === 'category' && expandedCategories.has(item.id)) {
              toggleCategory(item.id);
            } else if (item.type === 'subsection' && expandedSubSections.has(item.id)) {
              toggleSubSection(item.id);
            }
          }
          break;
        case 'Enter':
          e.preventDefault();
          if (focusedIndex >= 0 && items[focusedIndex]) {
            const item = items[focusedIndex];
            if (item.type === 'article') {
              onSelectArticle(item.id);
            } else if (item.type === 'category') {
              toggleCategory(item.id);
            } else if (item.type === 'subsection') {
              toggleSubSection(item.id);
            }
          }
          break;
        case 'Home':
          e.preventDefault();
          setFocusedIndex(0);
          break;
        case 'End':
          e.preventDefault();
          setFocusedIndex(items.length - 1);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [focusedIndex, flatItems, expandedCategories, expandedSubSections]);

  const totalArticles = getTotalArticleCount();

  return (
    <div ref={navRef} tabIndex={0} className="outline-none">
      {/* Control Bar */}
      <div className="p-3 mb-3 rounded-lg bg-kiosk-surface/50 border border-cyan-500/20">
        <div className="flex items-center gap-2 mb-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={expandAll}
            className="h-7 text-xs hover:bg-primary/10"
          >
            <FolderOpen className="w-3 h-3 mr-1" />
            Expandir
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={collapseAll}
            className="h-7 text-xs hover:bg-primary/10"
          >
            <FolderClosed className="w-3 h-3 mr-1" />
            Recolher
          </Button>
          <div className="ml-auto">
            <Toggle
              pressed={showTreeLines}
              onPressedChange={setShowTreeLines}
              size="sm"
              className="h-7 text-xs data-[state=on]:bg-primary/20"
            >
              <Minus className="w-3 h-3 mr-1" />
              Linhas
            </Toggle>
          </div>
        </div>
        <div className="text-xs text-kiosk-text/50">
          {totalArticles} artigos • {wikiCategories.length} categorias
        </div>
      </div>

      <ScrollArea className="h-[calc(100vh-280px)]">
        <nav className="space-y-1 pr-4">
          {wikiCategories.map((category, catIndex) => {
            const isLastCategory = catIndex === wikiCategories.length - 1;
            const categoryArticleCount = getCategoryArticleCount(category);
            
            return (
              <div key={category.id} className="relative">
                {/* Category */}
                <button
                  onClick={() => toggleCategory(category.id)}
                  className={cn(
                    "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-all",
                    "hover:bg-primary/10 border border-transparent",
                    expandedCategories.has(category.id) && "bg-kiosk-surface/50 border-primary/20",
                    selectedCategory === category.id && "bg-primary/20 text-primary border-primary/40"
                  )}
                >
                  {expandedCategories.has(category.id) ? (
                    <ChevronDown className="w-4 h-4 shrink-0 text-primary" />
                  ) : (
                    <ChevronRight className="w-4 h-4 shrink-0" />
                  )}
                  <span className="icon-neon-blue">{iconMap[category.icon]}</span>
                  <span className="text-sm font-medium truncate flex-1">{category.title}</span>
                  <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-5 border-cyan-500/30 text-cyan-400">
                    {categoryArticleCount}
                  </Badge>
                </button>

                {/* SubSections */}
                <AnimatePresence>
                  {expandedCategories.has(category.id) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className={cn("ml-4 relative", showTreeLines && "tree-container")}>
                        {/* Tree line for category */}
                        {showTreeLines && (
                          <div 
                            className="absolute left-2 top-0 bottom-4 w-px bg-gradient-to-b from-cyan-500/40 to-cyan-500/10"
                            style={{ height: 'calc(100% - 16px)' }}
                          />
                        )}
                        
                        {category.subSections.map((subSection, subIndex) => {
                          const isLastSubSection = subIndex === category.subSections.length - 1;
                          
                          return (
                            <div key={subSection.id} className="relative">
                              {/* Tree branch connector */}
                              {showTreeLines && (
                                <div className="absolute left-2 top-4 w-3 h-px bg-cyan-500/30" />
                              )}
                              
                              {/* SubSection Button */}
                              <button
                                onClick={() => toggleSubSection(subSection.id)}
                                className={cn(
                                  "w-full flex items-center gap-2 py-1.5 rounded text-left",
                                  "hover:bg-kiosk-surface/50 text-kiosk-text/70 hover:text-kiosk-text",
                                  showTreeLines ? "pl-6 pr-2" : "px-3"
                                )}
                              >
                                {expandedSubSections.has(subSection.id) ? (
                                  <ChevronDown className="w-3 h-3 shrink-0 text-primary/70" />
                                ) : (
                                  <ChevronRight className="w-3 h-3 shrink-0" />
                                )}
                                <span className="text-xs font-medium truncate flex-1">{subSection.title}</span>
                                <Badge variant="outline" className="text-[9px] px-1 py-0 h-4 border-kiosk-border text-kiosk-text/50">
                                  {subSection.articles.length}
                                </Badge>
                              </button>

                              {/* Articles */}
                              <AnimatePresence>
                                {expandedSubSections.has(subSection.id) && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.15 }}
                                    className="overflow-hidden"
                                  >
                                    <div className={cn("relative", showTreeLines && "ml-4")}>
                                      {/* Tree line for subsection */}
                                      {showTreeLines && (
                                        <div 
                                          className="absolute left-2 top-0 w-px bg-gradient-to-b from-cyan-500/20 to-transparent"
                                          style={{ height: 'calc(100% - 12px)' }}
                                        />
                                      )}
                                      
                                      {subSection.articles.map((article, artIndex) => {
                                        const isLastArticle = artIndex === subSection.articles.length - 1;
                                        
                                        return (
                                          <div key={article.id} className="relative">
                                            {/* Article tree branch */}
                                            {showTreeLines && (
                                              <div className="absolute left-2 top-3 w-2 h-px bg-cyan-500/20" />
                                            )}
                                            
                                            <button
                                              onClick={() => onSelectArticle(article.id)}
                                              className={cn(
                                                "w-full flex items-center gap-2 py-1 rounded text-left text-xs transition-all",
                                                showTreeLines ? "pl-5 pr-2" : "px-3",
                                                selectedArticle === article.id
                                                  ? "bg-primary/20 text-primary"
                                                  : "hover:bg-kiosk-surface/30 text-kiosk-text/60 hover:text-kiosk-text"
                                              )}
                                            >
                                              <span className={cn(
                                                "w-1.5 h-1.5 rounded-full shrink-0 transition-colors",
                                                selectedArticle === article.id 
                                                  ? "bg-primary shadow-[0_0_6px_hsl(var(--primary))]" 
                                                  : "bg-current opacity-50"
                                              )} />
                                              <span className="truncate">{article.title}</span>
                                            </button>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </nav>
      </ScrollArea>
    </div>
  );
}

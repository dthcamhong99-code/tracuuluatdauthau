import { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { Search, ChevronRight, Gavel, BookOpen, AlertCircle, Info, Menu, X, ArrowLeft, Filter, ChevronDown, Scale, ScrollText, Snowflake } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { DOCUMENTS, allLawArticles } from './data/lawData';
import { nghiDinh214Data, allNd214Articles } from './data/nd214';
import { Chapter, Article, DocumentData } from './types';

function DocumentPane({
  docData,
  allArticles,
  selectedIds,
  expandedArticleId,
  searchQuery,
  onSelect,
  onToggleArticle,
  onClearSearch,
  isSidebarOpen
}: {
  docData: DocumentData;
  allArticles: Article[];
  selectedIds: string[];
  expandedArticleId: string | null;
  searchQuery: string;
  onSelect: (ids: string | string[], articleId?: string) => void;
  onToggleArticle: (id: string) => void;
  onClearSearch: () => void;
  isSidebarOpen: boolean;
}) {
  const isLuat = docData.id === 'luat';
  const contentRef = useRef<HTMLDivElement>(null);

  const filteredArticles = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    return allArticles.filter(art => 
      art.title.toLowerCase().includes(query) || 
      art.content.toLowerCase().includes(query)
    );
  }, [allArticles, searchQuery]);

  const currentArticles = useMemo(() => {
    if (selectedIds.length === 0) return allArticles;
    
    const list: Article[] = [];
    selectedIds.forEach(id => {
      const chapter = docData.chapters.find(ch => ch.id === id);
      if (chapter) {
        if (chapter.articles) list.push(...chapter.articles);
        if (chapter.sections) {
          chapter.sections.forEach(s => list.push(...(s.articles || [])));
        }
      } else {
        // Check sections
        for (const ch of docData.chapters) {
          const section = ch.sections?.find(s => s.id === id);
          if (section && section.articles) {
            list.push(...section.articles);
            break;
          }
        }
      }
    });

    // Remove duplicates if any (though IDs should be unique)
    return Array.from(new Set(list.map(a => a.id)))
      .map(id => list.find(a => a.id === id)!);
  }, [selectedIds, docData, allArticles]);

  const handleToggle = (id: string) => {
    onToggleArticle(id);
    if (expandedArticleId !== id) {
      // Use requestAnimationFrame for slightly faster execution than setTimeout(0)
      requestAnimationFrame(() => {
        const articleElement = document.getElementById(`${docData.id}-art-${id}`);
        if (articleElement) {
          const firstMatch = articleElement.querySelector('mark');
          if (firstMatch) {
            firstMatch.scrollIntoView({ behavior: 'auto', block: 'center' });
          } else {
            articleElement.scrollIntoView({ behavior: 'auto', block: 'start' });
          }
        }
      });
    }
  };

  const highlightMatch = (text: string, query: string) => {
    if (!query.trim()) return text;
    const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
    return (
      <>
        {parts.map((part, i) => 
          part.toLowerCase() === query.toLowerCase() 
            ? <mark key={i} className="bg-amber-400/40 text-ink-900 border-b-2 border-amber-500 px-0.5 rounded-sm font-black shadow-[0_0_15px_rgba(251,191,36,0.3)]">{part}</mark> 
            : part
        )}
      </>
    );
  };

  return (
    <div ref={contentRef} className="flex-1 overflow-y-auto p-4 lg:px-6 lg:pt-0 lg:pb-12 scroll-smooth h-full bg-transparent flex justify-center">
      <div className={`w-full max-w-4xl h-full pt-0 pb-20 mt-4 flex flex-col transition-all duration-500 ease-in-out`}>
        <div className="w-full">
        {searchQuery.trim() ? (
          /* Search Results */
          <div className="space-y-0">
            {filteredArticles.length > 0 ? (
              <div className="space-y-0">
                {filteredArticles.map(art => {
                  // Find where this article belongs
                  let parentId = "";
                  docData.chapters.forEach(ch => {
                    if (ch.articles?.find(a => a.id === art.id)) parentId = ch.id;
                    ch.sections?.forEach(s => {
                      if (s.articles.find(a => a.id === art.id)) parentId = s.id;
                    });
                  });

                  return (
                    <div
                      key={art.id}
                      id={`${docData.id}-art-${art.id}`}
                      className="bg-white rounded-xl border border-ink-900/5 shadow-sm hover:shadow-md transition-all duration-300 overflow-visible mb-4 last:mb-0 scroll-mt-20"
                    >
                      <button 
                        onClick={() => handleToggle(art.id)}
                        className={`w-full text-left p-3 lg:p-4 flex items-center justify-between gap-4 transition-colors rounded-xl ${expandedArticleId === art.id ? 'bg-deep-yellow text-white sticky top-0 z-20 shadow-xl before:content-[""] before:absolute before:inset-x-0 before:bottom-full before:h-24 before:bg-slate-900' : 'hover:bg-cream-50'}`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`font-bold px-2 py-0.5 border rounded-md transition-all shrink-0 whitespace-nowrap ${expandedArticleId === art.id ? 'border-amber-200/50 bg-amber-500/20 text-white' : 'border-slate-200 text-ink-800'} text-xs lg:text-sm tracking-tight`}>
                            Điều {art.id.split('D')[1]}
                          </div>
                          <h2 className={`font-bold text-xs lg:text-sm tracking-tight ${expandedArticleId === art.id ? 'text-white' : 'text-ink-900'} leading-snug line-clamp-2`}>
                            {highlightMatch(art.title.split('.')[1]?.trim() || art.title, searchQuery)}
                          </h2>
                        </div>
                        <ChevronDown size={20} className={`transition-transform duration-300 shrink-0 ${expandedArticleId === art.id ? 'rotate-180 text-white' : 'text-slate-300'}`} />
                      </button>

                      {expandedArticleId === art.id ? (
                        <div className="overflow-hidden">
                          <div className="px-5 lg:px-6 pb-6 pt-3 border-t border-ink-900/5">
                            <div className="pr-2">
                              <p className="text-ink-800 leading-relaxed text-[12px] lg:text-[13px] whitespace-pre-wrap font-sans selection:bg-deep-yellow/30 text-justify">
                                {highlightMatch(art.content, searchQuery)}
                              </p>
                            </div>
                            <div className="mt-4 pt-4 border-t border-ink-900/5 flex items-center justify-between">
                              <div className="flex items-center gap-2 text-deep-yellow-dark/60 text-[9px] font-black uppercase tracking-[0.2em]">
                                <Info size={12} />
                                TRÍCH {docData.title.toUpperCase()}
                              </div>
                              <button 
                                onClick={() => { onSelect(parentId, art.id); onClearSearch(); }}
                                className="text-amber-700 hover:text-amber-900 text-[10px] font-bold underline decoration-dotted underline-offset-4"
                              >
                                Xem trong chương mục gốc
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="px-5 lg:px-8 pb-6 pt-0">
                           <div className="text-slate-500 text-xs leading-relaxed line-clamp-2 italic border-l-2 border-slate-100 pl-4 py-1 text-justify">
                              {(() => {
                                const content = art.content;
                                const query = searchQuery.toLowerCase();
                                const index = content.toLowerCase().indexOf(query);
                                if (index === -1) return highlightMatch(content.substring(0, 250) + (content.length > 250 ? '...' : ''), searchQuery);
                                const start = Math.max(0, index - 80);
                                const end = Math.min(content.length, index + 150);
                                let snippet = content.substring(start, end);
                                if (start > 0) snippet = '...' + snippet;
                                if (end < content.length) snippet = snippet + '...';
                                return highlightMatch(snippet, searchQuery);
                              })()}
                           </div>
                           <button 
                             onClick={() => handleToggle(art.id)}
                             className="mt-3 text-[10px] font-bold text-deep-yellow-dark flex items-center gap-1 hover:gap-2 transition-all uppercase tracking-widest"
                           >
                             Xem toàn bộ nội dung <ChevronRight size={12} />
                           </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                  <Search size={32} />
                </div>
                <h3 className="text-lg font-bold text-slate-800">Không tìm thấy kết quả</h3>
                <p className="text-slate-500 mt-1">Hãy thử từ khóa khác.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-0">
            {currentArticles.length > 0 ? (
              <div className="space-y-0">
                {currentArticles.map((art) => (
                  <div key={art.id} id={`${docData.id}-art-${art.id}`} className="scroll-mt-20 bg-white rounded-xl border border-ink-900/5 shadow-sm hover:shadow-md transition-all duration-300 overflow-visible mb-4 last:mb-0">
                    <button 
                      onClick={() => onToggleArticle(art.id)}
                      className={`w-full text-left p-2.5 lg:py-3 lg:px-4 flex items-center justify-between gap-3 transition-colors rounded-xl ${expandedArticleId === art.id ? 'bg-deep-yellow sticky top-0 z-20 shadow-xl' : 'hover:bg-cream-50'}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`font-bold px-2 py-0.5 border rounded-md transition-all shrink-0 whitespace-nowrap ${expandedArticleId === art.id ? 'border-amber-200/50 bg-amber-500/20 text-white' : 'border-slate-200 text-ink-800'} text-xs lg:text-sm tracking-tight`}>
                          Điều {art.id.split('D')[1]}
                        </div>
                        <h2 className={`font-bold text-xs lg:text-sm tracking-tight ${expandedArticleId === art.id ? 'text-white' : 'text-ink-900'} line-clamp-2 leading-snug`}>
                          {art.title.split('.')[1]?.trim() || art.title}
                        </h2>
                      </div>
                      <ChevronDown size={18} className={`transition-transform duration-300 shrink-0 ${expandedArticleId === art.id ? 'rotate-180 text-white' : 'text-slate-400'}`} />
                    </button>

                    <AnimatePresence>
                      {expandedArticleId === art.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 lg:px-5 pb-5 pt-3 border-t border-ink-900/5">
                            <div className="pr-2">
                              <p className="text-ink-800 leading-relaxed text-[12px] lg:text-[13px] whitespace-pre-wrap font-sans selection:bg-deep-yellow/30 text-justify">
                                {art.content}
                              </p>
                            </div>
                            <div className="mt-6 pt-5 border-t border-ink-900/5 flex items-center justify-between">
                              <div className="flex items-center gap-2 text-deep-yellow-dark/60 text-[9px] font-black uppercase tracking-[0.2em]">
                                <Info size={14} />
                                TRÍCH {docData.title.toUpperCase()}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <h3 className="text-lg font-bold text-slate-400">Không có dữ liệu điều luật</h3>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  </div>
);
}

export default function App() {
  const [selectedLuatIds, setSelectedLuatIds] = useState<string[]>([]);
  const [expandedLuatArticleId, setExpandedLuatArticleId] = useState<string | null>(null);

  const [selectedNdIds, setSelectedNdIds] = useState<string[]>([]);
  const [expandedNdArticleId, setExpandedNdArticleId] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchQueryLuat, setSearchQueryLuat] = useState("");
  const [searchQueryNd, setSearchQueryNd] = useState("");

  const effectiveLuatSearch = searchQueryLuat.trim() || searchQuery.trim();
  const effectiveNdSearch = searchQueryNd.trim() || searchQuery.trim();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [showLegalBasis, setShowLegalBasis] = useState(false);

  // Chapters with expanded sections in sidebar
  const [expandedSidebarChapters, setExpandedSidebarChapters] = useState<string[]>([]);

  // Document sections expansion in sidebar
  const [isLuatSidebarExpanded, setIsLuatSidebarExpanded] = useState(false);
  const [isNdSidebarExpanded, setIsNdSidebarExpanded] = useState(false);

  // Sidebar Resizing
  const [sidebarWidth, setSidebarWidth] = useState(260);
  const [isResizing, setIsResizing] = useState(false);

  const startResizing = useCallback(() => {
    setIsResizing(true);
  }, []);

  const stopResizing = useCallback(() => {
    setIsResizing(false);
  }, []);

  const resize = useCallback((mouseMoveEvent: MouseEvent) => {
    if (isResizing) {
      const newWidth = mouseMoveEvent.clientX;
      if (newWidth >= 220 && newWidth <= 500) {
        setSidebarWidth(newWidth);
      }
    }
  }, [isResizing]);

  useEffect(() => {
    if (isResizing) {
      window.addEventListener("mousemove", resize as any);
      window.addEventListener("mouseup", stopResizing);
    } else {
      window.removeEventListener("mousemove", resize as any);
      window.removeEventListener("mouseup", stopResizing);
    }
    return () => {
      window.removeEventListener("mousemove", resize as any);
      window.removeEventListener("mouseup", stopResizing);
    };
  }, [isResizing, resize, stopResizing]);

  const toggleSidebarChapter = (e: any, chapterId: string) => {
    e.stopPropagation();
    setExpandedSidebarChapters(prev => 
      prev.includes(chapterId) 
        ? prev.filter(id => id !== chapterId)
        : [...prev, chapterId]
    );
  };

  const handleSelectLuat = (id: string | string[], articleId?: string) => {
    if (Array.isArray(id)) {
      setSelectedLuatIds(id);
    } else {
      setSelectedLuatIds(prev => 
        prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
      );
    }
    
    if (!effectiveLuatSearch) {
      setExpandedLuatArticleId(null);
    }
    if (articleId) {
      setExpandedLuatArticleId(articleId);
      setTimeout(() => {
        const el = document.getElementById(`article-${articleId}`);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 150);
    }
    if (window.innerWidth < 1024 && !Array.isArray(id)) setIsSidebarOpen(false);
  };

  const handleSelectNd = (id: string | string[], articleId?: string) => {
    if (Array.isArray(id)) {
      setSelectedNdIds(id);
    } else {
      setSelectedNdIds(prev => 
        prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
      );
    }

    if (!effectiveNdSearch) {
      setExpandedNdArticleId(null);
    }
    if (articleId) {
      setExpandedNdArticleId(articleId);
      setTimeout(() => {
        const el = document.getElementById(`article-${articleId}`);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 150);
    }
    if (window.innerWidth < 1024 && !Array.isArray(id)) setIsSidebarOpen(false);
  };

  return (
    <div className={`flex h-screen bg-slate-200/60 font-sans text-ink-900 overflow-hidden ${isResizing ? 'select-none cursor-col-resize' : ''}`} id="app-container">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ marginLeft: isSidebarOpen ? 0 : -sidebarWidth }}
        transition={{ duration: isResizing ? 0 : 0.3, ease: 'easeInOut' }}
        style={{ width: sidebarWidth }}
        className={`fixed lg:relative z-50 h-full bg-cream-100 border-r border-ink-900/5 flex flex-col shadow-2xl lg:shadow-none shrink-0 overflow-visible`}
        id="sidebar"
      >
        {/* Resize Handle */}
        <div 
          onMouseDown={startResizing}
          className={`absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-deep-yellow/30 active:bg-deep-yellow/50 transition-colors z-50 hidden lg:block ${isResizing ? 'bg-deep-yellow/50' : ''}`}
        />

        <div className="p-6 border-b border-ink-900/5 flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <div className="relative w-12 h-12 flex items-center justify-center shrink-0 group">
              <div className="absolute inset-0 rounded-full border-2 border-red-900/20 scale-[1.18] pointer-events-none" />
              <div className="absolute inset-0 rounded-full border border-amber-500/30 scale-110 pointer-events-none" />
              
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden relative border border-slate-200 shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-[85%] h-[85%] drop-shadow-sm">
                  {/* Outer Gold Rings */}
                  <g fill="none" stroke="#D4AF37" strokeLinecap="round" strokeLinejoin="round">
                    {/* Top Gold Swirl */}
                    <path d="M 12 55 C 5 25 35 5 65 10 C 85 13 100 28 95 48" strokeWidth="4" />
                    <path d="M 12 55 C 20 45 35 48 35 48" strokeWidth="2.5" />
                    {/* Bottom Gold Swirl */}
                    <path d="M 88 45 C 95 75 65 95 35 90 C 15 87 0 72 5 52" strokeWidth="4" />
                    <path d="M 88 45 C 80 55 65 52 65 52" strokeWidth="2.5" />
                  </g>
                  
                  {/* The Scales */}
                  <g stroke="#0F2C41" strokeLinejoin="round">
                    {/* Scale Bar */}
                    <path d="M 14 36 Q 50 28 86 36" fill="none" strokeWidth="3.5" strokeLinecap="round" />
                    <circle cx="14" cy="36" r="1.5" fill="#0F2C41" stroke="none" />
                    <circle cx="86" cy="36" r="1.5" fill="#0F2C41" stroke="none" />
                    
                    {/* Left Scale Bowl */}
                    <line x1="14" y1="36" x2="4" y2="65" strokeWidth="1.5" />
                    <line x1="14" y1="36" x2="24" y2="65" strokeWidth="1.5" />
                    <path d="M 2 65 Q 14 76 26 65 Z" fill="#0F2C41" strokeWidth="1" />
                    
                    {/* Right Scale Bowl */}
                    <line x1="86" y1="36" x2="76" y2="65" strokeWidth="1.5" />
                    <line x1="86" y1="36" x2="96" y2="65" strokeWidth="1.5" />
                    <path d="M 74 65 Q 86 76 98 65 Z" fill="#0F2C41" strokeWidth="1" />
                  </g>

                  {/* The Fist */}
                  <g fill="#0F2C41">
                    {/* Arm Base */}
                    <path d="M 43 100 L 45 65 L 55 65 L 57 100 Z" />
                    {/* Hand Core */}
                    <path d="M 45 65 L 39 50 L 39 30 L 61 30 L 61 50 L 55 65 Z" />
                    
                    {/* Knuckles/Fingers */}
                    <rect x="39" y="24" width="22" height="7" rx="3.5" />
                    <rect x="37" y="32" width="25" height="7" rx="3.5" />
                    <rect x="38" y="40" width="22" height="7" rx="3.5" />
                    <rect x="40" y="48" width="18" height="7" rx="3.5" />
                    
                    {/* Thumb */}
                    <path d="M 36 57 L 46 38 A 3.5 3.5 0 0 1 52 42 L 42 61 Z" />
                  </g>
                </svg>
              </div>
            </div>
            
            <h1 className="font-bold text-xl leading-none text-ink-900 tracking-tight flex-1">Luật đấu thầu</h1>
            
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 hover:bg-ink-900/5 rounded-full shrink-0">
              <X size={20} />
            </button>
          </div>
          
          <p className="text-[11px] text-ink-800/50 font-medium italic tracking-wide pl-1">
            Hệ thống hỗ trợ tra cứu nhanh
          </p>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-6 scrollbar-thin">
          <div className="space-y-1">
            <button
              onClick={() => setShowLegalBasis(!showLegalBasis)}
              className={`w-full flex items-center justify-between p-3.5 rounded-2xl transition-all group ${
                showLegalBasis 
                  ? 'bg-white text-ink-900 shadow-xl shadow-ink-900/5 ring-1 ring-ink-900/5' 
                  : 'bg-white/50 border border-ink-900/5 hover:bg-white hover:shadow-md text-ink-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg transition-colors bg-cream-100 text-deep-yellow-dark`}>
                  <Scale size={18} />
                </div>
                <span className={`font-bold transition-all ${showLegalBasis ? 'text-base' : 'text-sm'}`}>Pháp lý</span>
              </div>
              <ChevronDown size={18} className={`transition-transform duration-300 ${showLegalBasis ? 'rotate-180 text-slate-400' : 'text-slate-300'}`} />
            </button>
            <AnimatePresence>
              {showLegalBasis && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="p-5 space-y-4 bg-white rounded-2xl mt-1 border border-ink-900/5 shadow-sm">
                    <p className="text-[10px] text-ink-800/60 font-medium leading-relaxed italic">
                      VBHN số 74/VBHN-VPQH hợp nhất các Luật:
                    </p>
                    <ul className="space-y-4">
                      {[
                        "Luật Đấu thầu số 22/2023/QH15",
                        "Luật số 57/2024/QH15",
                        "Luật số 90/2025/QH15",
                        "Luật An ninh mạng số 116/2025/QH15",
                        "Luật Công nghệ cao số 133/2025/QH15",
                        "Luật Phục hồi, phá sản số 142/2025/QH15"
                      ].map((law, idx) => (
                        <li key={idx} className="flex gap-3 items-start">
                          <div className="mt-2 w-1.5 h-1.5 rounded-full bg-deep-yellow shrink-0" />
                          <span className="text-xs text-ink-900 font-medium leading-snug italic">
                            {law}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="h-px bg-ink-900/5 mx-2 my-2" />

          {/* Luật Đấu Thầu Section */}
          <div className="space-y-1">
            <button
              onClick={() => setIsLuatSidebarExpanded(!isLuatSidebarExpanded)}
              className={`w-full flex items-center justify-between p-3.5 rounded-2xl transition-all group ${
                isLuatSidebarExpanded 
                  ? 'bg-white text-ink-900 shadow-xl shadow-ink-900/5 ring-1 ring-ink-900/5' 
                  : 'bg-white/50 border border-ink-900/5 hover:bg-white hover:shadow-md text-ink-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg transition-colors bg-cream-100 text-deep-yellow-dark`}>
                  <Gavel size={18} />
                </div>
                <span className={`font-bold transition-all ${isLuatSidebarExpanded ? 'text-base' : 'text-sm'}`}>Luật Đấu Thầu</span>
              </div>
              <ChevronDown size={18} className={`transition-transform duration-300 ${isLuatSidebarExpanded ? 'rotate-180 text-slate-400' : 'text-slate-300'}`} />
            </button>

            <AnimatePresence>
              {(isLuatSidebarExpanded || effectiveLuatSearch) && (
                <motion.div
                  initial={effectiveLuatSearch ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="pl-2 pr-0 pt-2 pb-1">
                    {DOCUMENTS.filter(d => d.id === 'luat').map((doc) => {
                      const filteredChapters = effectiveLuatSearch 
                        ? doc.chapters.filter(ch => 
                            ch.title.toLowerCase().includes(effectiveLuatSearch.toLowerCase()) || 
                            (ch.sections?.some(s => s.title.toLowerCase().includes(effectiveLuatSearch.toLowerCase()))) ||
                            (ch.articles?.some(a => a.title.toLowerCase().includes(effectiveLuatSearch.toLowerCase()) || a.content.toLowerCase().includes(effectiveLuatSearch.toLowerCase()))) ||
                            (ch.sections?.some(s => s.articles.some(a => a.title.toLowerCase().includes(effectiveLuatSearch.toLowerCase()) || a.content.toLowerCase().includes(effectiveLuatSearch.toLowerCase()))))
                          )
                        : doc.chapters;

                      return (
                        <div key={doc.id} className="space-y-1">
                          <button
                            onClick={() => {
                              const allIds = doc.chapters.map(ch => ch.id);
                              const isAll = allIds.every(id => selectedLuatIds.includes(id));
                              handleSelectLuat(isAll ? [] : allIds);
                            }}
                            className="w-full text-left px-4 py-2 rounded-xl text-[11px] font-black tracking-widest text-deep-yellow-dark hover:bg-deep-yellow/5 mb-1 flex items-center gap-2"
                          >
                            <Filter size={11} />
                            {doc.chapters.every(ch => selectedLuatIds.includes(ch.id)) ? "Bỏ chọn tất cả" : "Chọn tất cả chương"}
                          </button>

                          {filteredChapters.map((chapter) => {
                            const isSelected = selectedLuatIds.includes(chapter.id);
                            const isExpanded = expandedSidebarChapters.includes(chapter.id);
                            const hasSections = chapter.sections && chapter.sections.length > 0;

                            return (
                              <div key={chapter.id} className="mb-2">
                                <button
                                  onClick={() => handleSelectLuat(chapter.id)}
                                  className={`w-full text-left px-2 py-2.5 rounded-xl text-xs transition-all duration-300 flex items-center gap-2 group relative ${
                                    isSelected && !effectiveLuatSearch
                                      ? 'bg-deep-yellow text-white font-bold shadow-lg shadow-deep-yellow/20'
                                      : 'text-ink-800 hover:bg-ink-900/5 font-semibold'
                                  }`}
                                >
                                  <div 
                                     className="p-1 rounded-md shrink-0 transition-colors"
                                     onClick={hasSections ? (e) => toggleSidebarChapter(e, chapter.id) : undefined}
                                  >
                                    <ChevronRight 
                                      size={12} 
                                      className={`transition-transform duration-300 ${isSelected ? 'text-white' : 'text-slate-400'} ${isExpanded ? 'rotate-90' : ''} ${!hasSections ? 'opacity-0' : ''}`} 
                                    />
                                  </div>
                                  <span className="text-xs tracking-tight leading-snug whitespace-normal break-words py-0.5">{chapter.title.split(':')[0] || chapter.title}</span>
                                </button>
                                
                                <AnimatePresence>
                                  {hasSections && isExpanded && (
                                    <motion.div
                                      initial={{ height: 0, opacity: 0 }}
                                      animate={{ height: 'auto', opacity: 1 }}
                                      exit={{ height: 0, opacity: 0 }}
                                      className="bg-ink-900/5 mx-2 rounded-xl overflow-hidden mt-1"
                                    >
                                      <div className="px-2 py-1.5 space-y-0.5">
                                        {chapter.sections!.map((section) => {
                                          const isSectionSelected = selectedLuatIds.includes(section.id);
                                          return (
                                            <button
                                              key={section.id}
                                              onClick={() => handleSelectLuat(section.id)}
                                              className={`w-full text-left px-3 py-2 rounded-lg text-[10px] transition-all duration-200 block font-medium whitespace-normal break-words ${
                                                isSectionSelected && !effectiveLuatSearch
                                                  ? 'text-deep-yellow-dark font-black bg-white shadow-sm'
                                                  : 'text-ink-800/60 hover:text-ink-900 hover:bg-white/50'
                                              }`}
                                            >
                                              {section.title}
                                            </button>
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
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Nghị định 214 Section */}
          <div className="space-y-1">
            <button
              onClick={() => setIsNdSidebarExpanded(!isNdSidebarExpanded)}
              className={`w-full flex items-center justify-between p-3.5 rounded-2xl transition-all group ${
                isNdSidebarExpanded 
                  ? 'bg-white text-ink-900 shadow-xl shadow-ink-900/5 ring-1 ring-ink-900/5' 
                  : 'bg-white/50 border border-ink-900/5 hover:bg-white hover:shadow-md text-ink-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg transition-colors bg-cream-100 text-deep-yellow-dark`}>
                  <ScrollText size={18} />
                </div>
                <span className={`font-bold transition-all ${isNdSidebarExpanded ? 'text-base' : 'text-sm'}`}>Nghị định 214</span>
              </div>
              <ChevronDown size={18} className={`transition-transform duration-300 ${isNdSidebarExpanded ? 'rotate-180 text-slate-400' : 'text-slate-300'}`} />
            </button>

            <AnimatePresence>
              {(isNdSidebarExpanded || effectiveNdSearch) && (
                <motion.div
                  initial={effectiveNdSearch ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="pl-2 pr-0 pt-2 pb-10">
                    {(() => {
                      const allNdChapters = nghiDinh214Data.chapters.map(ch => ch.id);
                      const isAllNdSelected = allNdChapters.length > 0 && allNdChapters.every(id => selectedNdIds.includes(id));

                      const filteredNdChapters = effectiveNdSearch 
                        ? nghiDinh214Data.chapters.filter(ch => 
                            ch.title.toLowerCase().includes(effectiveNdSearch.toLowerCase()) || 
                            (ch.articles?.some(a => a.title.toLowerCase().includes(effectiveNdSearch.toLowerCase()) || a.content.toLowerCase().includes(effectiveNdSearch.toLowerCase())))
                          )
                        : nghiDinh214Data.chapters;

                      return (
                        <div className="space-y-1">
                          <button
                            onClick={() => handleSelectNd(isAllNdSelected ? [] : allNdChapters)}
                            className="w-full text-left px-4 py-2 rounded-xl text-[11px] font-black tracking-widest text-deep-yellow-dark hover:bg-deep-yellow/5 mb-1 flex items-center gap-2"
                          >
                            <Filter size={11} />
                            {isAllNdSelected ? "Bỏ chọn tất cả" : "Chọn tất cả chương"}
                          </button>

                          {filteredNdChapters.map((chapter) => {
                            const isSelected = selectedNdIds.includes(chapter.id);
                            
                            return (
                              <div key={chapter.id} className="mb-2">
                                <button
                                  onClick={() => handleSelectNd(chapter.id)}
                                  className={`w-full text-left px-2 py-2.5 rounded-xl text-xs transition-all duration-300 flex items-center gap-2 group relative ${
                                    isSelected && !effectiveNdSearch
                                      ? 'bg-deep-yellow text-white font-bold shadow-lg shadow-deep-yellow/20'
                                      : 'text-ink-800 hover:bg-ink-900/5 font-semibold'
                                  }`}
                                >
                                  <div className="p-1 rounded-md shrink-0">
                                    <ChevronRight size={12} className={`transition-transform opacity-0`} />
                                  </div>
                                  <span className="text-xs tracking-tight leading-snug whitespace-normal break-words py-0.5">{chapter.title}</span>
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      );
                    })()}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </nav>

        <div className="p-6 border-t border-ink-900/5 mt-auto">
          <button 
            onClick={() => setShowDisclaimer(true)}
            className="w-full flex items-center justify-center gap-2 py-4 px-4 bg-white border border-ink-900/5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-ink-800 hover:bg-cream-50 transition-all shadow-sm hover:shadow-md"
          >
            <AlertCircle size={14} />
            Miễn trừ
          </button>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Subtle background texture/overlay */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/rice-paper-2.png')] opacity-20 pointer-events-none" />

        <header 
          className="shrink-0 bg-cream-100 backdrop-blur-xl border-b border-ink-900/5 p-4 lg:py-4 lg:px-6 flex items-center gap-4 lg:gap-6 z-30 relative overflow-hidden"
        >
          {/* Decorative Snowflakes */}
          <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
            {[...Array(24)].map((_, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0.1, scale: 0.5 }}
                animate={{ 
                  opacity: [0.1, 0.3, 0.1],
                  scale: [1, 1.2, 1],
                  y: [0, 10, 0]
                }}
                transition={{
                  duration: Math.random() * 5 + 5,
                  repeat: Infinity,
                  ease: "linear",
                  delay: Math.random() * 5
                }}
                className="absolute text-deep-yellow/20 blur-[0.5px]"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  transform: `rotate(${Math.random() * 360}deg)`,
                }}
              >
                <Snowflake size={Math.random() * 15 + 10} strokeWidth={1.5} />
              </motion.div>
            ))}
          </div>
          
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-3 bg-white border border-ink-900/5 shadow-sm hover:shadow-md hover:bg-cream-50 rounded-2xl shrink-0 transition-all z-20 text-ink-900"
          >
            <Menu size={24} />
          </button>

          <div className={`flex-1 relative flex gap-3 z-10 transition-all duration-500 w-full max-w-4xl`}>
            <div className="relative flex-1 group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-deep-yellow transition-colors" size={18} />
              <input
                type="text"
                placeholder='Tìm kiếm chương, điều, nội dung...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-6 py-2.5 bg-white border border-ink-900/10 rounded-2xl focus:outline-none focus:ring-4 focus:ring-deep-yellow/10 focus:border-deep-yellow/50 transition-all text-sm shadow-sm text-ink-900 font-medium placeholder:text-slate-400"
              />
            </div>
            {searchQuery && (
               <button 
                 onClick={() => setSearchQuery("")}
                 className="bg-deep-yellow hover:bg-deep-yellow-hover px-4 py-2 rounded-xl font-bold text-xs text-white transition-all flex items-center gap-1.5 shrink-0 shadow-md shadow-deep-yellow/20"
               >
                 <ArrowLeft size={14} />
                 Xóa tìm kiếm
               </button>
            )}
          </div>
        </header>

        {/* Dual Panes */}
        <div className={`flex-1 flex overflow-hidden z-10 gap-0 lg:gap-4 px-0 pb-0 ${isSidebarOpen ? 'lg:px-4 lg:pb-4' : 'lg:px-8 lg:pb-8'} transition-all duration-500 ease-in-out flex-col lg:flex-row relative mx-auto w-full max-w-[1920px]`}>
           
           {/* Left Pane: Luật đấu thầu */}
           <div className="flex-1 h-full relative lg:rounded-2xl overflow-hidden flex flex-col min-h-[50vh] lg:min-h-0 lg:border lg:border-white/10 lg:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] bg-slate-900">
             <div className="bg-slate-800/90 backdrop-blur py-3 px-4 lg:px-6 border-b border-white/5 font-bold text-white flex items-center justify-between gap-4 z-20">
                 <div className="flex items-center gap-2 shrink-0">
                   <BookOpen size={18} className="text-amber-400" />
                   <span className="hidden sm:inline">Luật Đấu Thầu</span>
                 </div>
                 {/*  Search bar here */}
                 <div className="relative flex-1 max-w-sm group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-amber-400 transition-colors" size={14} />
                    <input
                      type="text"
                      placeholder='Tìm trong Luật...'
                      value={searchQueryLuat}
                      onChange={(e) => setSearchQueryLuat(e.target.value)}
                      className="w-full pl-9 pr-8 py-1.5 bg-slate-900/50 border border-white/10 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500/50 transition-all text-xs shadow-sm text-white font-normal placeholder:text-slate-500"
                    />
                    {searchQueryLuat && (
                       <button onClick={() => setSearchQueryLuat("")} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors">
                         <X size={14} />
                       </button>
                    )}
                 </div>
             </div>
             <div className="flex-1 overflow-hidden relative">
               <DocumentPane 
                  docData={DOCUMENTS[0]} 
                  allArticles={allLawArticles} 
                  selectedIds={selectedLuatIds}
                  expandedArticleId={expandedLuatArticleId}
                  searchQuery={effectiveLuatSearch}
                  onSelect={handleSelectLuat}
                  onToggleArticle={(id) => setExpandedLuatArticleId(prev => prev === id ? null : id)}
                  onClearSearch={() => {
                    setSearchQueryLuat("");
                    setSearchQuery("");
                  }}
                  isSidebarOpen={isSidebarOpen}
               />
             </div>
           </div>

           {/* Right Pane: Nghị định 214 */}
           <div className="flex-1 h-full relative lg:rounded-2xl overflow-hidden flex flex-col min-h-[50vh] lg:min-h-0 bg-slate-900 lg:border lg:border-white/10 lg:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)]">
             <div className="bg-slate-800/90 backdrop-blur py-3 px-4 lg:px-6 border-b border-white/5 font-bold text-white flex items-center justify-between gap-4 z-20">
                 <div className="flex items-center gap-2 shrink-0">
                   <ScrollText size={18} className="text-amber-400" />
                   <span className="hidden sm:inline">Nghị định 214</span>
                 </div>
                 {/*  Search bar here */}
                 <div className="relative flex-1 max-w-sm group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-amber-400 transition-colors" size={14} />
                    <input
                      type="text"
                      placeholder='Tìm trong Nghị định...'
                      value={searchQueryNd}
                      onChange={(e) => setSearchQueryNd(e.target.value)}
                      className="w-full pl-9 pr-8 py-1.5 bg-slate-900/50 border border-white/10 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500/50 transition-all text-xs shadow-sm text-white font-normal placeholder:text-slate-500"
                    />
                    {searchQueryNd && (
                       <button onClick={() => setSearchQueryNd("")} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors">
                         <X size={14} />
                       </button>
                    )}
                 </div>
             </div>
             <div className="flex-1 overflow-hidden relative">
               <DocumentPane 
                  docData={nghiDinh214Data} 
                  allArticles={allNd214Articles} 
                  selectedIds={selectedNdIds}
                  expandedArticleId={expandedNdArticleId}
                  searchQuery={effectiveNdSearch}
                  onSelect={handleSelectNd}
                  onToggleArticle={(id) => setExpandedNdArticleId(prev => prev === id ? null : id)}
                  onClearSearch={() => {
                    setSearchQueryNd("");
                    setSearchQuery("");
                  }}
                  isSidebarOpen={isSidebarOpen}
               />
             </div>
           </div>

        </div>
      </div>

      {/* Disclaimer Modal */}
      <AnimatePresence>
        {showDisclaimer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDisclaimer(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
            >
              <button 
                onClick={() => setShowDisclaimer(false)}
                className="absolute right-6 top-6 text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 p-2 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
              <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mb-6">
                <AlertCircle size={32} />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-3 tracking-tight">Miễn trừ</h2>
              <p className="text-slate-600 leading-relaxed text-sm">
                Ứng dụng này được tạo ra nhằm mục đích tham khảo và tra cứu nhanh, chúng tôi không chịu trách nhiệm về độ chính xác tuyệt đối của văn bản. Vui lòng đối chiếu với các văn bản quy phạm pháp luật chính thức được ban hành bởi cơ quan nhà nước có thẩm quyền trước khi áp dụng vào thực tế.
              </p>
              <button 
                onClick={() => setShowDisclaimer(false)}
                className="mt-8 w-full bg-slate-900 text-white rounded-xl py-3.5 font-bold hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20"
              >
                Tôi đã hiểu
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

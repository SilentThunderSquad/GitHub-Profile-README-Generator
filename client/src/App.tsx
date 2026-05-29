import { Sidebar } from './components/Sidebar';
import { Editor } from './components/Editor';
import { Preview } from './components/Preview';
import { Sun, Moon, Search, Zap } from 'lucide-react';
import { useEffect, useState, useCallback, useRef } from 'react';
import { supabase } from './lib/supabase';
import { useStore } from './store';
import { useLocation, useNavigate } from 'react-router-dom';
import { DocsPage } from './components/DocsPage.tsx';
//check backend
// import { checkBackendHealth } from './services/healthService';

// ─── Constants ───
const SIDEBAR_DEFAULT = 260;
const SIDEBAR_MIN = 180;
const SIDEBAR_MAX = 400;

const PREVIEW_DEFAULT = 400;
const PREVIEW_MIN = 300;
const PREVIEW_MAX = 600;

const CANVAS_MIN = 200; // Minimum canvas width so it never collapses
const FEEDBACK_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSe7L-L5YYcat9iTIk5u9K4CgRhJ9xx-sL9vxy_a5vZBXIq7aA/viewform?usp=publish-editor';

// GitHub Octocat SVG as a reusable component
function GitHubIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
    </svg>
  );
}

// ─── Resizer Handle Component ───
function ResizeHandle({
  onMouseDown,
  isActive,
  onDoubleClick,
}: {
  onMouseDown: (e: React.MouseEvent) => void;
  isActive: boolean;
  onDoubleClick: () => void;
}) {
  return (
    <div
      className="resizer-handle"
      onMouseDown={onMouseDown}
      onDoubleClick={onDoubleClick}
      style={{
        width: '6px',
        cursor: 'col-resize',
        position: 'relative',
        flexShrink: 0,
        zIndex: 5,
      }}
    >
      {/* Visual line */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: isActive ? '3px' : '1px',
          backgroundColor: isActive ? '#58a6ff' : '#30363d',
          transition: isActive ? 'none' : 'width 0.15s, background-color 0.15s',
        }}
      />
      {/* Wider hover target */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: '-4px',
          right: '-4px',
        }}
      />
      <style>{`
        .resizer-handle:hover > div:first-child {
          width: 3px !important;
          background-color: ${isActive ? '#58a6ff' : '#8b949e'} !important;
        }
        .dark .resizer-handle > div:first-child {
          background-color: ${isActive ? '#58a6ff' : '#30363d'};
        }
      `}</style>
    </div>
  );
}

function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark'); 
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState<any>(null);
  const [generateNotification, setGenerateNotification] = useState(false);
  const previewPanelRef = useRef<HTMLDivElement>(null);
  const getMarkdown = useStore(state => state.getMarkdown);
  // ─── Resizable Panel State ───
  const [sidebarWidth, setSidebarWidth] = useState(SIDEBAR_DEFAULT);
  const [previewWidth, setPreviewWidth] = useState(PREVIEW_DEFAULT);
  const [activeResizer, setActiveResizer] = useState<'sidebar' | 'preview' | null>(null);
  const dragRef = useRef<{ startX: number; startWidth: number } | null>(null);
  const containerRef = useRef<HTMLElement>(null);
  const location = useLocation();
  const isDocsRoute = location.pathname === '/docs';
  const navigate = useNavigate();
  // check backend
  //  useEffect(() => {
  //   checkBackendHealth()
  //     .then((data) => console.log(data))
  //     .catch((err) => console.error(err));
  // }, []);

  // return <div>Frontend Connected</div>;

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);
  // Login-Button
  const loginWithGitHub = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: import.meta.env.VITE_FRONTEND_URL,
      },
    });
  };

  const logout = async () => {
    await supabase.auth.signOut();

    setUser(null);

    navigate('/');
  };
  const toggleTheme = () => {
    setTheme(t => t === 'light' ? 'dark' : 'light');

  };
  const openFeedbackForm = useCallback(() => {
    window.open(FEEDBACK_FORM_URL, '_blank');
  }, []);

  const goToDocs = useCallback(() => {
    navigate('/docs');
  }, [navigate]);

  const goToBuilder = useCallback(() => {
    navigate('/');
  }, [navigate]);

  // Session Management
  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        setUser(session.user);

        const username =
          session.user.user_metadata?.user_name;

        if (username && !isDocsRoute) {
          navigate(`/u/${username}`);
        }
      }
    };

    getSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          setUser(session.user);

          const username =
            session.user.user_metadata?.user_name;

          if (username && !isDocsRoute) {
            navigate(`/u/${username}`);
          }
        } else {
          setUser(null);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };

  }, [isDocsRoute, navigate]);


  // ─── Resize Logic ───
  const clampSidebar = useCallback((width: number, containerWidth: number) => {
    const maxAllowed = containerWidth - previewWidth - CANVAS_MIN - 12; // 12 = 2 resizer handles
    return Math.max(SIDEBAR_MIN, Math.min(width, SIDEBAR_MAX, maxAllowed));
  }, [previewWidth]);

  const clampPreview = useCallback((width: number, containerWidth: number) => {
    const maxAllowed = containerWidth - sidebarWidth - CANVAS_MIN - 12;
    return Math.max(PREVIEW_MIN, Math.min(width, PREVIEW_MAX, maxAllowed));
  }, [sidebarWidth]);

  const handleMouseDown = useCallback((panel: 'sidebar' | 'preview', e: React.MouseEvent) => {
    e.preventDefault();
    setActiveResizer(panel);
    dragRef.current = {
      startX: e.clientX,
      startWidth: panel === 'sidebar' ? sidebarWidth : previewWidth,
    };
  }, [sidebarWidth, previewWidth]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!activeResizer || !dragRef.current || !containerRef.current) return;

    const containerWidth = containerRef.current.offsetWidth;
    const delta = e.clientX - dragRef.current.startX;

    if (activeResizer === 'sidebar') {
      const newWidth = dragRef.current.startWidth + delta;
      setSidebarWidth(clampSidebar(newWidth, containerWidth));
    } else {
      // Preview: dragging right makes it smaller, left makes bigger
      const newWidth = dragRef.current.startWidth - delta;
      setPreviewWidth(clampPreview(newWidth, containerWidth));
    }
  }, [activeResizer, clampSidebar, clampPreview]);

  const handleMouseUp = useCallback(() => {
    setActiveResizer(null);
    dragRef.current = null;
  }, []);

  // Attach/detach global listeners during drag
  useEffect(() => {
    if (activeResizer) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      // Prevent text selection while dragging
      document.body.style.userSelect = 'none';
      document.body.style.cursor = 'col-resize';
    } else {
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    };
  }, [activeResizer, handleMouseMove, handleMouseUp]);

  // Double-click to reset defaults
  const resetSidebar = useCallback(() => setSidebarWidth(SIDEBAR_DEFAULT), []);
  const resetPreview = useCallback(() => setPreviewWidth(PREVIEW_DEFAULT), []);

  // Handle Generate README button click
  const handleGenerateReadme = useCallback(() => {
    // Trigger notification
    setGenerateNotification(true);
    setTimeout(() => setGenerateNotification(false), 3000);

    // Scroll preview into view
    if (previewPanelRef.current) {
      previewPanelRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // Log for debugging
    const markdown = getMarkdown();
    console.log('[README Generated]', {
      length: markdown.length,
      preview: markdown.substring(0, 100) + '...',
    });
  }, [getMarkdown]);

  return isDocsRoute ? (
    <DocsPage
      theme={theme}
      onBackToBuilder={goToBuilder}
      onToggleTheme={toggleTheme}
      onOpenFeedback={openFeedbackForm}
    />
  ) : (
    <div className="flex flex-col h-screen overflow-hidden bg-background text-foreground font-sans">
      {/* ─── Navigation Bar ─── */}
      <header className="h-14 border-b border-gray-300 dark:border-[#30363d] bg-white dark:bg-[#010409] flex items-center justify-between px-5 shrink-0 z-10">
        {/* Left: GitHub icon + App name */}
        <div className="flex items-center gap-3">
          <a href="/" className="text-black dark:text-white hover:opacity-80 transition-opacity" aria-label="Home">
            <GitHubIcon className="w-8 h-8" />
          </a>
          <span className="text-black dark:text-white font-semibold text-[15px] tracking-tight">README Builder</span>
        </div>

        {/* Center: Search bar */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
          <div className="relative w-full group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 dark:text-[#8b949e] group-focus-within:text-blue-500 dark:group-focus-within:text-[#58a6ff] transition-colors" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search blocks..."
              className="w-full h-[30px] bg-white dark:bg-[#0d1117] border border-gray-300 dark:border-[#30363d] rounded-md pl-9 pr-3 text-[13px] text-black dark:text-[#c9d1d9] placeholder-gray-500 dark:placeholder-[#8b949e] outline-none focus:border-blue-500 dark:focus:border-[#58a6ff] focus:ring-1 focus:ring-blue-500/40 dark:focus:ring-[#58a6ff]/40 transition-all"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-0.5">
              <kbd className="hidden sm:inline-flex h-[18px] items-center gap-0.5 rounded border border-gray-300 dark:border-[#30363d] bg-gray-100 dark:bg-[#161b22] px-1.5 text-[10px] font-mono text-gray-600 dark:text-[#8b949e]">⌘K</kbd>
            </div>
          </div>
        </div>

        {/* Right: Theme toggle + Sign in + Generate */}
        <div className="flex items-center gap-3">
          {/* Unsaved changes indicator */}
          <div className="hidden lg:flex items-center gap-1.5 text-[11px] text-gray-600 dark:text-[#8b949e] mr-1">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></div>
            Unsaved changes
          </div>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="relative w-[52px] h-[26px] rounded-full bg-gray-200 dark:bg-[#21262d] border border-gray-300 dark:border-[#30363d] flex items-center transition-colors hover:border-gray-500 dark:hover:border-[#8b949e] group"
            aria-label="Toggle theme"
          >
            <div
              className={`absolute top-[2px] w-[20px] h-[20px] rounded-full bg-gray-700 dark:bg-[#c9d1d9] shadow-sm transition-all duration-300 flex items-center justify-center ${theme === 'dark' ? 'left-[2px]' : 'left-[28px]'
                }`}
            >
              {theme === 'dark' ? (
                <Moon className="w-3 h-3 text-[#0d1117]" />
              ) : (
                <Sun className="w-3 h-3 text-white" />
              )}
            </div>
            <Sun className={`absolute right-[6px] w-3 h-3 transition-opacity ${theme === 'dark' ? 'text-gray-500 dark:text-[#8b949e] opacity-50' : 'opacity-0'}`} />
            <Moon className={`absolute left-[6px] w-3 h-3 transition-opacity ${theme === 'light' ? 'text-gray-500 dark:text-[#8b949e] opacity-50' : 'opacity-0'}`} />
          </button>

          {/* Divider */}
          <div className="relative group">
            {user ? (
              <>
                {/* Username */}
                <div className="flex items-center gap-2 cursor-pointer">
                  <img
                    src={user.user_metadata?.avatar_url}
                    alt="avatar"
                    className="w-7 h-7 rounded-full"
                  />
                  <span className="text-[13px] font-medium text-gray-900 dark:text-[#c9d1d9] hover:text-black dark:hover:text-white transition-colors">
                    {user.user_metadata?.user_name}
                  </span>
                </div>

                {/* Hover Dropdown */}
                <div className="absolute right-0 top-7 hidden group-hover:flex items-center bg-white dark:bg-[#161b22] border border-gray-300 dark:border-[#30363d] rounded-md shadow-lg overflow-hidden z-50">
                  <button
                    onClick={logout}
                    className="flex items-center gap-2 px-3 py-2 text-[13px] text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-[#21262d] transition-colors whitespace-nowrap"
                  >
                    {/* Exit Icon */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="w-4 h-4"
                    >
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                      <polyline points="16 17 21 12 16 7" />
                      <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                    Sign out
                  </button>
                </div>
              </>
            ) : (
              <button
                onClick={loginWithGitHub}
                className="flex items-center gap-2 h-[30px] px-3.5 bg-gray-200 dark:bg-[#21262d] border border-gray-300 dark:border-[#30363d] rounded-md text-[13px] font-medium text-black dark:text-[#c9d1d9] hover:bg-gray-300 dark:hover:bg-[#30363d] hover:border-gray-400 dark:hover:border-[#8b949e] transition-all whitespace-nowrap"
              >
                <GitHubIcon className="w-4 h-4" />
                Sign in with GitHub
              </button>
            )}
          </div>

          {/* Generate README button */}
          <button
            onClick={handleGenerateReadme}
            className="flex items-center gap-2 h-[30px] px-4 bg-[#238636] border border-[rgba(240,246,252,0.1)] rounded-md text-[13px] font-semibold text-white hover:bg-[#2ea043] active:scale-95 transition-all whitespace-nowrap shadow-[0_0_12px_rgba(35,134,54,0.3)]"
          >
            <Zap className="w-4 h-4 fill-current" />
            Generate README
          </button>
        </div>
      </header>

      {/* ─── Main Content: 3-Panel Resizable Layout ─── */}
      <main ref={containerRef} className="flex-1 flex overflow-hidden" style={{ position: 'relative' }}>
        {/* Panel 1: Sidebar */}
        <div style={{ width: sidebarWidth, flexShrink: 0 }} className="h-full overflow-hidden">
          <Sidebar searchQuery={searchQuery} />
        </div>

        {/* Resizer 1: Sidebar ↔ Canvas */}
        <ResizeHandle
          onMouseDown={(e) => handleMouseDown('sidebar', e)}
          isActive={activeResizer === 'sidebar'}
          onDoubleClick={resetSidebar}
        />

        {/* Panel 2: Canvas (Editor) — fills remaining space */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <Editor />
        </div>

        {/* Resizer 2: Canvas ↔ Preview */}
        <ResizeHandle
          onMouseDown={(e) => handleMouseDown('preview', e)}
          isActive={activeResizer === 'preview'}
          onDoubleClick={resetPreview}
        />

        {/* Panel 3: Preview */}
        <div ref={previewPanelRef} style={{ width: previewWidth, flexShrink: 0 }} className="h-full overflow-hidden">
          <Preview user = {user}/>
        </div>

        {/* Overlay during drag to prevent iframe/content interference */}
        {activeResizer && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 50,
              cursor: 'col-resize',
            }}
          />
        )}
      </main>

      {/* Bottom status bar */}
      <footer className="h-7 bg-white dark:bg-[#010409] border-t border-gray-300 dark:border-[#30363d] flex items-center justify-between px-4 text-[11px] text-gray-600 dark:text-[#8b949e] shrink-0">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-[#3fb950]"></div>
            Auto-saved to local cache
          </span>
          <span className="hidden sm:inline text-[10px] opacity-60">just now</span>
          <span className="text-gray-300 dark:text-[#30363d]">•</span>
          <span className="text-[10px] opacity-60">Your data is safe until you generate or clear</span>
        </div>
        <div className="flex items-center gap-4">
          <a href="https://github.com/" className="flex items-center gap-1 hover:text-blue-500 dark:hover:text-[#58a6ff] transition-colors">
            <GitHubIcon className="w-3 h-3"/> GitHub
          </a>
          <span className="text-gray-300 dark:text-[#30363d]">|</span>
          <button type="button" onClick={goToDocs} className="hover:text-blue-500 dark:hover:text-[#58a6ff] transition-colors">
            📄 Docs
          </button>
          <span className="text-gray-300 dark:text-[#30363d]">|</span>
          <button type="button" onClick={openFeedbackForm} className="hover:text-blue-500 dark:hover:text-[#58a6ff] transition-colors">
            💬 Feedback
          </button>
          <span className="text-gray-300 dark:text-[#30363d] hidden sm:inline">|</span>
          <span className="hidden sm:flex items-center gap-2">
            <span className="opacity-60">⚙</span>
            <span className="opacity-60">🔔</span>
          </span>
        </div>
      </footer>

      {/* Generate README Notification */}
      {generateNotification && (
        <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="bg-[#238636] text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 font-semibold text-sm">
            <Zap className="w-5 h-5" />
            README generated! Check the preview panel →
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

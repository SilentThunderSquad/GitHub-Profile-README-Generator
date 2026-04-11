import { Sidebar } from './components/Sidebar';
import { Editor } from './components/Editor';
import { Preview } from './components/Preview';
import { Sun, Moon, Search, Zap } from 'lucide-react';
import { useEffect, useState, useCallback, useRef } from 'react';

// ─── Constants ───
const SIDEBAR_DEFAULT = 260;
const SIDEBAR_MIN = 180;
const SIDEBAR_MAX = 400;

const PREVIEW_DEFAULT = 400;
const PREVIEW_MIN = 300;
const PREVIEW_MAX = 600;

const CANVAS_MIN = 200; // Minimum canvas width so it never collapses

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
      `}</style>
    </div>
  );
}

function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [searchQuery, setSearchQuery] = useState('');

  // ─── Resizable Panel State ───
  const [sidebarWidth, setSidebarWidth] = useState(SIDEBAR_DEFAULT);
  const [previewWidth, setPreviewWidth] = useState(PREVIEW_DEFAULT);
  const [activeResizer, setActiveResizer] = useState<'sidebar' | 'preview' | null>(null);
  const dragRef = useRef<{ startX: number; startWidth: number } | null>(null);
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(t => t === 'light' ? 'dark' : 'light');
  };

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

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background text-foreground font-sans">
      {/* ─── Navigation Bar ─── */}
      <header className="h-14 border-b border-[#30363d] bg-[#010409] flex items-center justify-between px-5 shrink-0 z-10">
        {/* Left: GitHub icon + App name */}
        <div className="flex items-center gap-3">
          <a href="/" className="text-white hover:opacity-80 transition-opacity" aria-label="Home">
            <GitHubIcon className="w-8 h-8" />
          </a>
          <span className="text-white font-semibold text-[15px] tracking-tight">README Builder</span>
        </div>

        {/* Center: Search bar */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
          <div className="relative w-full group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8b949e] group-focus-within:text-[#58a6ff] transition-colors" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search blocks..."
              className="w-full h-[30px] bg-[#0d1117] border border-[#30363d] rounded-md pl-9 pr-3 text-[13px] text-[#c9d1d9] placeholder-[#8b949e] outline-none focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff]/40 transition-all"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-0.5">
              <kbd className="hidden sm:inline-flex h-[18px] items-center gap-0.5 rounded border border-[#30363d] bg-[#161b22] px-1.5 text-[10px] font-mono text-[#8b949e]">⌘K</kbd>
            </div>
          </div>
        </div>

        {/* Right: Theme toggle + Sign in + Generate */}
        <div className="flex items-center gap-3">
          {/* Unsaved changes indicator */}
          <div className="hidden lg:flex items-center gap-1.5 text-[11px] text-[#8b949e] mr-1">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></div>
            Unsaved changes
          </div>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="relative w-[52px] h-[26px] rounded-full bg-[#21262d] border border-[#30363d] flex items-center transition-colors hover:border-[#8b949e] group"
            aria-label="Toggle theme"
          >
            <div
              className={`absolute top-[2px] w-[20px] h-[20px] rounded-full bg-[#c9d1d9] shadow-sm transition-all duration-300 flex items-center justify-center ${
                theme === 'dark' ? 'left-[2px]' : 'left-[28px]'
              }`}
            >
              {theme === 'dark' ? (
                <Moon className="w-3 h-3 text-[#0d1117]" />
              ) : (
                <Sun className="w-3 h-3 text-[#0d1117]" />
              )}
            </div>
            <Sun className={`absolute right-[6px] w-3 h-3 transition-opacity ${theme === 'dark' ? 'text-[#8b949e] opacity-50' : 'opacity-0'}`} />
            <Moon className={`absolute left-[6px] w-3 h-3 transition-opacity ${theme === 'light' ? 'text-[#8b949e] opacity-50' : 'opacity-0'}`} />
          </button>

          {/* Divider */}
          <div className="w-px h-5 bg-[#30363d]"></div>

          {/* Sign in with GitHub button */}
          <button
            className="flex items-center gap-2 h-[30px] px-3.5 bg-[#21262d] border border-[#30363d] rounded-md text-[13px] font-medium text-[#c9d1d9] hover:bg-[#30363d] hover:border-[#8b949e] transition-all whitespace-nowrap"
          >
            <GitHubIcon className="w-4 h-4" />
            Sign in with GitHub
          </button>

          {/* Generate README button */}
          <button
            className="flex items-center gap-2 h-[30px] px-4 bg-[#238636] border border-[rgba(240,246,252,0.1)] rounded-md text-[13px] font-semibold text-white hover:bg-[#2ea043] transition-all whitespace-nowrap shadow-[0_0_12px_rgba(35,134,54,0.3)]"
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
        <div style={{ width: previewWidth, flexShrink: 0 }} className="h-full overflow-hidden">
          <Preview />
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
      <footer className="h-7 bg-[#010409] border-t border-[#30363d] flex items-center justify-between px-4 text-[11px] text-[#8b949e] shrink-0">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-[#3fb950]"></div>
            Auto-saved to local cache
          </span>
          <span className="hidden sm:inline text-[10px] opacity-60">just now</span>
          <span className="text-[#30363d]">•</span>
          <span className="text-[10px] opacity-60">Your data is safe until you generate or clear</span>
        </div>
        <div className="flex items-center gap-4">
          <a href="#" className="flex items-center gap-1 hover:text-[#58a6ff] transition-colors">
            <GitHubIcon className="w-3 h-3" /> GitHub
          </a>
          <span className="text-[#30363d]">|</span>
          <a href="#" className="hover:text-[#58a6ff] transition-colors">📄 Docs</a>
          <span className="text-[#30363d]">|</span>
          <a href="#" className="hover:text-[#58a6ff] transition-colors">💬 Feedback</a>
          <span className="text-[#30363d] hidden sm:inline">|</span>
          <span className="hidden sm:flex items-center gap-2">
            <span className="opacity-60">⚙</span>
            <span className="opacity-60">🔔</span>
          </span>
        </div>
      </footer>
    </div>
  );
}

export default App;

import { Sidebar } from './components/Sidebar';
import { Editor } from './components/Editor';
import { Preview } from './components/Preview';
import { FileText, Sun, Moon } from 'lucide-react';
import { useEffect, useState } from 'react';

function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

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

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background text-foreground font-sans">
      <header className="h-14 border-b border-border bg-card flex items-center justify-between px-6 shrink-0 z-10">
        <div className="flex items-center gap-2 font-semibold text-lg">
          <FileText className="w-5 h-5" />
          README Builder
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={toggleTheme} 
            className="p-2 rounded-full hover:bg-muted transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <a 
            href="#" 
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            GitHub
          </a>
        </div>
      </header>
      
      <main className="flex-1 flex overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex min-w-0">
          <div className="w-1/2 flex flex-col border-r border-border">
            <Editor />
          </div>
          <div className="w-1/2 flex flex-col">
            <Preview />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;

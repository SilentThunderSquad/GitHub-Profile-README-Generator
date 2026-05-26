import ReactMarkdown from 'react-markdown';
import { useStore } from '../store';
import { Copy, Download, Code, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';

export function Preview() {
  const getMarkdown = useStore(state => state.getMarkdown);
  const markdown = getMarkdown();
  const [viewMode, setViewMode] = useState<'preview' | 'raw'>('preview');
  const [bottomTab, setBottomTab] = useState<'markdown' | 'html'>('markdown');
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadFile = () => {
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'README.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-white dark:bg-[#0d1117] relative overflow-hidden">
      
      {/* Top Preview Section */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-300 dark:border-[#30363d] shrink-0">
          <div>
            <div className="flex items-center gap-3">
               <h2 className="text-[11px] font-bold tracking-widest text-black dark:text-white uppercase">Preview</h2>
               <div className="flex items-center gap-1.5 text-[10px] text-[#3fb950] font-medium tracking-wide">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#3fb950]"></div>
                  LIVE
                </div>
             </div>
             <p className="text-[12px] text-gray-600 dark:text-[#8b949e] mt-1">How it will look on GitHub</p>
          </div>
          <button 
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 dark:bg-[#21262d] border border-gray-300 dark:border-[#30363d] rounded text-[11px] text-gray-900 dark:text-[#c9d1d9] hover:bg-gray-200 dark:hover:bg-[#30363d] hover:text-black dark:hover:text-white transition-colors font-medium"
            onClick={() => setViewMode(viewMode === 'preview' ? 'raw' : 'preview')}
          >
            <Code className="w-3.5 h-3.5" />
            Raw
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto rounded-lg border border-gray-300 dark:border-[#30363d] bg-white dark:bg-[#0d1117] overflow-hidden mb-8 shadow-sm">
             <div className="px-4 py-3 border-b border-gray-300 dark:border-[#30363d] bg-gray-100 dark:bg-[#161b22] text-xs font-mono text-gray-600 dark:text-[#8b949e]">
               your-username / README.md
              </div>
            <div className="p-8">
              {viewMode === 'preview' ? (
                <div className="prose prose-zinc dark:prose-invert max-w-none 
                   prose-h1:border-b prose-h1:border-gray-300 dark:prose-h1:border-[#30363d] prose-h1:pb-2 prose-h1:text-black dark:prose-h1:text-white
                   prose-h2:border-b prose-h2:border-gray-300 dark:prose-h2:border-[#30363d] prose-h2:pb-2 prose-h2:text-black dark:prose-h2:text-white
                   prose-a:text-blue-600 dark:prose-a:text-[#58a6ff] prose-a:no-underline hover:prose-a:underline
                   prose-code:bg-gray-100 dark:prose-code:bg-[#161b22] prose-code:text-gray-900 dark:prose-code:text-[#c9d1d9] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:before:content-none prose-code:after:content-none">
                   <ReactMarkdown>{markdown}</ReactMarkdown>
                 </div>
              ) : (
                <pre className="text-sm font-mono text-gray-900 dark:text-[#c9d1d9] whitespace-pre-wrap word-break">
                   {markdown}
                 </pre>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Code Section */}
      <div className="h-[300px] flex flex-col border-t border-gray-300 dark:border-[#30363d] bg-white dark:bg-[#0d1117] shrink-0">
         <div className="flex justify-between items-center px-4 py-2 border-b border-gray-300 dark:border-[#30363d] bg-gray-100 dark:bg-[#161b22]">
           <div className="flex items-center gap-6 text-[10px] font-bold tracking-widest text-gray-600 dark:text-[#8b949e]">
              <span 
                className={`cursor-pointer ${bottomTab === 'markdown' ? 'text-black dark:text-white' : 'hover:text-black dark:hover:text-white'}`}
                onClick={() => setBottomTab('markdown')}
              >MARKDOWN</span>
              <span 
                className={`cursor-pointer ${bottomTab === 'html' ? 'text-black dark:text-white' : 'hover:text-black dark:hover:text-white'}`}
                onClick={() => setBottomTab('html')}
              >HTML</span>
            </div>
            <button 
              className="flex items-center gap-1.5 px-2 py-1 hover:bg-gray-200 dark:hover:bg-[#30363d] rounded text-[11px] text-gray-900 dark:text-[#c9d1d9] transition-colors font-medium"
              onClick={copyToClipboard}
            >
              {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-[#3fb950]" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'COPIED' : 'COPY'}
            </button>
         </div>
         <div className="flex-1 overflow-y-auto p-4 bg-white dark:bg-[#0d1117]">
             <pre className="text-[13px] font-mono leading-relaxed text-gray-900 dark:text-[#c9d1d9] whitespace-pre-wrap">
               {markdown}
             </pre>
         </div>
         <div className="flex items-center gap-3 p-4 border-t border-gray-300 dark:border-[#30363d] bg-white dark:bg-[#0d1117] shrink-0">
             <Button variant="outline" size="sm" onClick={copyToClipboard} className="bg-transparent border-gray-300 dark:border-[#30363d] hover:bg-gray-100 dark:hover:bg-[#21262d] text-black dark:text-white gap-2 text-xs h-9 px-4">
                <Copy className="w-3.5 h-3.5" />
                Copy
             </Button>
             <Button variant="outline" size="sm" onClick={downloadFile} className="bg-transparent border-gray-300 dark:border-[#30363d] hover:bg-gray-100 dark:hover:bg-[#21262d] text-black dark:text-white gap-2 text-xs h-9 px-4">
                <Download className="w-3.5 h-3.5" />
                Download
             </Button>
             <Button size="sm" className="bg-[#238636] hover:bg-[#2ea043] text-white gap-2 text-xs h-9 px-5 font-semibold ml-auto border border-[rgba(240,246,252,0.1)]">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                  <polyline points="13 2 13 9 20 9"></polyline>
                </svg>
                Save to Supabase
             </Button>
         </div>
      </div>

    </div>
  );
}

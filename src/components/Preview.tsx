import ReactMarkdown from 'react-markdown';
import { useStore } from '../store';
import { Button } from './ui/button';
import { Copy, Download, Code, Eye } from 'lucide-react';
import { useState } from 'react';

export function Preview() {
  const getMarkdown = useStore(state => state.getMarkdown);
  const markdown = getMarkdown();
  const [viewMode, setViewMode] = useState<'preview' | 'raw'>('preview');

  const copyToClipboard = () => {
    navigator.clipboard.writeText(markdown);
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
    <div className="flex-1 flex flex-col h-full bg-background border-l border-border relative overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-border bg-card">
        <div className="flex gap-2">
          <Button 
            variant={viewMode === 'preview' ? 'default' : 'outline'} 
            size="sm" 
            onClick={() => setViewMode('preview')}
          >
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <Button 
            variant={viewMode === 'raw' ? 'default' : 'outline'} 
            size="sm" 
            onClick={() => setViewMode('raw')}
          >
            <Code className="w-4 h-4 mr-2" />
            Raw
          </Button>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={copyToClipboard}>
            <Copy className="w-4 h-4 mr-2" />
            Copy
          </Button>
          <Button variant="default" size="sm" onClick={downloadFile}>
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-8 bg-zinc-50 dark:bg-zinc-950">
        <div className="max-w-4xl mx-auto bg-white dark:bg-[#0d1117] border border-border rounded-lg shadow-sm overflow-hidden min-h-full">
          {viewMode === 'preview' ? (
            <div className="prose prose-zinc dark:prose-invert max-w-none p-8 github-markdown-body">
              <ReactMarkdown>{markdown}</ReactMarkdown>
            </div>
          ) : (
            <pre className="p-8 text-sm font-mono overflow-x-auto text-zinc-800 dark:text-zinc-300">
              {markdown}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
}

import type { BlockType } from "../store";
import { useStore } from "../store";
import { Button } from "./ui/button";
import { 
  Heading1, 
  AlignLeft, 
  Code2, 
  Briefcase, 
  BarChart, 
  Mail, 
  Type 
} from "lucide-react";

export function Sidebar() {
  const addBlock = useStore(state => state.addBlock);

  const blockTypes: { type: BlockType; label: string; icon: React.ReactNode }[] = [
    { type: 'header', label: 'Header', icon: <Heading1 className="w-4 h-4" /> },
    { type: 'about', label: 'About', icon: <AlignLeft className="w-4 h-4" /> },
    { type: 'skills', label: 'Skills', icon: <Code2 className="w-4 h-4" /> },
    { type: 'projects', label: 'Projects', icon: <Briefcase className="w-4 h-4" /> },
    { type: 'github-stats', label: 'GitHub Stats', icon: <BarChart className="w-4 h-4" /> },
    { type: 'contact', label: 'Contact', icon: <Mail className="w-4 h-4" /> },
    { type: 'custom', label: 'Custom Section', icon: <Type className="w-4 h-4" /> },
  ];

  return (
    <aside className="w-64 border-r border-border bg-card flex flex-col h-full overflow-y-auto hidden md:flex">
      <div className="p-4 border-b border-border">
        <h2 className="font-semibold text-lg">Blocks</h2>
        <p className="text-xs text-muted-foreground mt-1">Click to add a section</p>
      </div>
      <div className="flex-1 p-4 space-y-2">
        {blockTypes.map(({ type, label, icon }) => (
          <Button
            key={type}
            variant="outline"
            className="w-full justify-start text-left gap-3 relative group"
            onClick={() => addBlock(type)}
          >
            {icon}
            {label}
            <span className="absolute right-3 opacity-0 group-hover:opacity-100 text-xs">+</span >
          </Button>
        ))}
      </div>
      <div className="p-4 border-t border-border mt-auto">
        <Button variant="destructive" className="w-full" onClick={() => useStore.getState().clearBlocks()}>
          Clear All
        </Button>
      </div>
    </aside>
  );
}

import type { BlockType } from "../store";
import { useStore } from "../store";
import { 
  Type, 
  Image as ImageIcon, 
  BarChart2, 
  Grid, 
  Shield, 
  Code, 
  Link2, 
  Table, 
  Quote, 
  GripVertical
} from "lucide-react";

interface SidebarProps {
  searchQuery?: string;
}

export function Sidebar({ searchQuery = '' }: SidebarProps) {
  const addBlock = useStore(state => state.addBlock);

  // Expanded block types matching screenshot
  type CustomBlockType = BlockType | 'image' | 'contributions' | 'badges' | 'code' | 'links' | 'table' | 'quote';
  
  const blockTypes: { type: CustomBlockType; title: string; subtitle: string; icon: React.ReactNode }[] = [
    { type: 'custom', title: 'Text', subtitle: 'Add titles, descriptions, or any text', icon: <Type className="w-4 h-4 text-gray-300" /> },
    { type: 'image', title: 'Image', subtitle: 'Add images from URL', icon: <ImageIcon className="w-4 h-4 text-gray-300" /> },
    { type: 'github-stats', title: 'GitHub Stats', subtitle: 'Show your GitHub statistics', icon: <BarChart2 className="w-4 h-4 text-gray-300" /> },
    { type: 'contributions', title: 'Contributions', subtitle: 'GitHub contribution graph', icon: <Grid className="w-4 h-4 text-gray-300" /> },
    { type: 'badges', title: 'Badges', subtitle: 'Add shields.io badges', icon: <Shield className="w-4 h-4 text-gray-300" /> },
    { type: 'code', title: 'Code Block', subtitle: 'Add code snippets', icon: <Code className="w-4 h-4 text-gray-300" /> },
    { type: 'links', title: 'Links', subtitle: 'Add social or custom links', icon: <Link2 className="w-4 h-4 text-gray-300" /> },
    { type: 'table', title: 'Table', subtitle: 'Add a table', icon: <Table className="w-4 h-4 text-gray-300" /> },
    { type: 'quote', title: 'Quote', subtitle: 'Add a quote', icon: <Quote className="w-4 h-4 text-gray-300" /> },
  ];

  // Filter blocks by search query
  const filteredBlocks = searchQuery.trim()
    ? blockTypes.filter(b => 
        b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : blockTypes;

  return (
    <aside className="w-full bg-[#0d1117] flex flex-col h-full overflow-y-auto font-sans">
      <div className="p-5 border-b-0 pb-3">
        <h2 className="text-[11px] font-bold tracking-widest text-[#8b949e] uppercase">Blocks</h2>
        <p className="text-[12px] text-[#8b949e] mt-1">Drag and drop to build your README</p>
      </div>
      <div className="px-3 pb-4 space-y-1">
        {filteredBlocks.map(({ type, title, subtitle, icon }) => (
          <div
            key={type}
            onClick={() => addBlock(type === 'image' || type === 'contributions' || type === 'badges' || type === 'code' || type === 'links' || type === 'table' || type === 'quote' ? 'custom' : type as BlockType)}
            className="flex items-start gap-3 p-3 rounded-md hover:bg-[#161b22] border border-transparent hover:border-[#30363d] cursor-pointer group transition-colors"
          >
            <div className="mt-0.5">{icon}</div>
            <div className="flex-1">
              <div className="text-[13px] font-medium text-[#c9d1d9]">{title}</div>
              <div className="text-[11px] text-[#8b949e] mt-0.5">{subtitle}</div>
            </div>
            <GripVertical className="w-4 h-4 text-[#8b949e] opacity-40 group-hover:opacity-100" />
          </div>
        ))}
        {filteredBlocks.length === 0 && searchQuery.trim() && (
          <div className="text-center py-8 text-[#8b949e] text-xs">
            No blocks match "{searchQuery}"
          </div>
        )}
      </div>

      <div className="p-5 border-t border-[#30363d] mt-auto">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[11px] font-bold tracking-widest text-[#8b949e] uppercase">Templates</h2>
          <span className="text-[11px] text-[#58a6ff] cursor-pointer hover:underline">See All</span>
        </div>
        <p className="text-[12px] text-[#8b949e] mb-3">Use a pre-built template</p>
        <div className="grid grid-cols-3 gap-2">
          <div className="flex flex-col items-center gap-1.5 cursor-pointer group">
            <div className="w-full aspect-video bg-[#161b22] border border-[#30363d] rounded-md group-hover:border-[#58a6ff] transition-colors p-1">
               <div className="w-full h-full bg-[#0d1117] rounded-sm flex flex-col gap-1 p-1">
                 <div className="w-1/2 h-1 bg-[#30363d] rounded-full"></div>
                 <div className="w-3/4 h-1 bg-[#30363d] rounded-full"></div>
               </div>
            </div>
            <span className="text-[10px] text-[#8b949e] group-hover:text-white">Minimal</span>
          </div>
          <div className="flex flex-col items-center gap-1.5 cursor-pointer group">
            <div className="w-full aspect-video bg-[#161b22] border border-[#30363d] rounded-md group-hover:border-[#58a6ff] transition-colors p-1">
               <div className="w-full h-full bg-[#0d1117] rounded-sm flex flex-col gap-1 p-1 items-center justify-center">
                 <div className="w-3 h-3 rounded-full bg-[#30363d]"></div>
               </div>
            </div>
            <span className="text-[10px] text-[#8b949e] group-hover:text-white">Developer</span>
          </div>
          <div className="flex flex-col items-center gap-1.5 cursor-pointer group">
            <div className="w-full aspect-video bg-[#161b22] border border-[#30363d] rounded-md group-hover:border-[#58a6ff] transition-colors p-1">
               <div className="w-full h-full bg-[#0d1117] rounded-sm flex gap-1 p-1">
                 <div className="w-1/2 h-full bg-[#30363d] rounded-sm"></div>
                 <div className="w-1/2 h-full bg-[#30363d] rounded-sm"></div>
               </div>
            </div>
            <span className="text-[10px] text-[#8b949e] group-hover:text-white">Portfolio</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

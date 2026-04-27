import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Block } from '../store';
import { useStore } from '../store';
import { GripVertical, Trash2, Edit2, Plus, Copy, Menu } from 'lucide-react';

import { BlockRenderer } from './BlockRenderer';
import { useState } from 'react';

export function SortableBlock({ block }: { block: Block }) {
  const removeBlock = useStore(state => state.removeBlock);
  const [editing, setEditing] = useState(true);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    position: 'relative' as const,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className={`group flex flex-col overflow-hidden border border-[#30363d] rounded-lg bg-[#0d1117] transition-all ${isDragging ? 'shadow-xl opacity-75 ring-1 ring-[#58a6ff]' : 'shadow-sm'}`}
    >
      <div className="flex justify-between items-center bg-[#161b22] px-3 py-2 border-b border-[#30363d]">
        <div className="flex items-center gap-2">
           <Menu className="w-3.5 h-3.5 text-[#8b949e]" />
           <span className="font-bold text-[10px] uppercase tracking-wider text-white">
             {block.type.replace('-', ' ')}
           </span>
        </div>
        <div className="flex items-center gap-1.5 opacity-60 hover:opacity-100 transition-opacity">
          <div 
            {...attributes} 
            {...listeners}
            className="w-6 h-6 flex items-center justify-center rounded cursor-grab active:cursor-grabbing hover:bg-[#30363d] transition-colors"
          >
            <GripVertical className="text-[#8b949e] w-3.5 h-3.5" />
          </div>
          <button className="w-6 h-6 flex items-center justify-center rounded hover:bg-[#30363d] text-[#8b949e] transition-colors">
             <Plus className="w-3.5 h-3.5" />
          </button>
          <button 
             onClick={() => setEditing(!editing)}
             className={`h-6 px-2 flex items-center justify-center rounded transition-colors text-[10px] font-medium gap-1.5 ${editing ? 'bg-white text-black hover:bg-gray-200' : 'hover:bg-[#30363d] text-[#8b949e]'}`}
          >
             <Edit2 className="w-3 h-3" /> Edit
          </button>
          <button className="w-6 h-6 flex items-center justify-center rounded hover:bg-[#30363d] text-[#8b949e] transition-colors">
             <Copy className="w-3.5 h-3.5" />
          </button>
          <button 
            className="w-6 h-6 flex items-center justify-center rounded hover:bg-red-900/50 text-red-500 hover:text-red-400 transition-colors"
            onClick={() => removeBlock(block.id)}
          >
             <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
      <div className="p-4 bg-[#0d1117]">
        {editing ? (
           <BlockRenderer block={block} />
        ) : (
           <div className="text-sm text-gray-400">Preview mode (Click Edit to change)</div>
        )}
      </div>
    </div>
  );
}

import { useStore } from '../store';
import { SortableBlock } from './SortableBlock';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Trash2, Download } from 'lucide-react';
import { Button } from './ui/button';

export function Editor() {
  const blocks = useStore(state => state.blocks);
  const reorderBlocks = useStore(state => state.reorderBlocks);
  const clearBlocks = useStore(state => state.clearBlocks);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = blocks.findIndex(b => b.id === active.id);
      const newIndex = blocks.findIndex(b => b.id === over.id);
      reorderBlocks(oldIndex, newIndex);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#0d1117] p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6 shrink-0">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-[11px] font-bold tracking-widest text-white uppercase">Editor</h2>
            <span className="text-[10px] bg-[#1f6feb]/10 text-[#58a6ff] px-2 py-0.5 rounded-full font-medium">
              {blocks.length} blocks
            </span>
          </div>
          <p className="text-[12px] text-[#8b949e] mt-1">Reorder, edit, and customize your blocks</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={clearBlocks} className="h-8 text-xs bg-transparent border-[#30363d] text-white hover:bg-[#21262d]">
            <Trash2 className="w-3.5 h-3.5 mr-1.5" />
            Clear All
          </Button>
          <Button variant="outline" size="sm" className="h-8 text-xs bg-transparent border-[#30363d] text-white hover:bg-[#21262d]">
            <Download className="w-3.5 h-3.5 mr-1.5" />
            Import
          </Button>
        </div>
      </div>

      <div className="flex-1 space-y-4 pb-20">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={blocks.map(b => b.id)} strategy={verticalListSortingStrategy}>
            {blocks.map(block => (
              <SortableBlock key={block.id} block={block} />
            ))}
          </SortableContext>
        </DndContext>

        {blocks.length === 0 && (
          <div className="text-center p-16 border border-dashed border-[#30363d] rounded-lg text-[#8b949e] bg-[#0d1117] flex flex-col items-center justify-center min-h-[200px]">
            <svg className="w-8 h-8 mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
            </svg>
            <p className="text-xs">Drag blocks here or from the sidebar</p>
          </div>
        )}

        {blocks.length > 0 && (
          <div className="w-full h-24 border border-dashed border-[#30363d] rounded-lg flex flex-col items-center justify-center text-[#8b949e]">
            <svg className="w-5 h-5 mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 15l-2 5L9 9l11 4-5 2z" />
            </svg>
            <span className="text-xs">Drag blocks here or from the sidebar</span>
          </div>
        )}
      </div>
    </div>
  );
}

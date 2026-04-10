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

export function Editor() {
  const blocks = useStore(state => state.blocks);
  const reorderBlocks = useStore(state => state.reorderBlocks);

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
    <div className="flex-1 overflow-y-auto bg-muted/20 p-8 h-full shadow-inner">
      <div className="max-w-3xl mx-auto space-y-6 pb-20">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={blocks.map(b => b.id)} strategy={verticalListSortingStrategy}>
            {blocks.map(block => (
              <SortableBlock key={block.id} block={block} />
            ))}
          </SortableContext>
        </DndContext>
        
        {blocks.length === 0 && (
          <div className="text-center p-16 border-2 border-dashed border-border rounded-xl text-muted-foreground bg-card/50">
            <h3 className="text-lg font-medium text-foreground mb-2">Your README is empty</h3>
            <p>Click a block from the sidebar to get started</p>
          </div>
        )}
      </div>
    </div>
  );
}

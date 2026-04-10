import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Block } from '../store';
import { useStore } from '../store';
import { Card } from './ui/card';
import { GripVertical, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { BlockRenderer } from './BlockRenderer';

export function SortableBlock({ block }: { block: Block }) {
  const removeBlock = useStore(state => state.removeBlock);
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
    <Card 
      ref={setNodeRef} 
      style={style} 
      className={`group flex overflow-hidden border-border bg-card transition-shadow ${isDragging ? 'shadow-xl opacity-75 ring-1 ring-ring' : 'shadow-sm hover:shadow-md'}`}
    >
      <div 
        {...attributes} 
        {...listeners}
        className="w-10 bg-muted flex items-center justify-center cursor-grab active:cursor-grabbing border-r border-border hover:bg-muted/80 transition-colors"
      >
        <GripVertical className="text-muted-foreground w-5 h-5 opacity-50 group-hover:opacity-100" />
      </div>
      <div className="flex-1 p-4 flex flex-col gap-4">
        <div className="flex justify-between items-center border-b border-border pb-2">
          <span className="font-medium text-xs uppercase tracking-wider text-muted-foreground">
            {block.type.replace('-', ' ')}
          </span>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => removeBlock(block.id)}
          >
             <Trash2 className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex-1">
          <BlockRenderer block={block} />
        </div>
      </div>
    </Card>
  );
}

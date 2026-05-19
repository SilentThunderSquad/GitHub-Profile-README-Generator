import type { Block } from '../store';
import { useStore } from '../store';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { RichTextEditor } from './RichTextEditor';

export function BlockRenderer({ block }: { block: Block }) {
  const updateBlock = useStore(state => state.updateBlock);

  const update = (key: string, value: any) => {
    updateBlock(block.id, { [key]: value });
  };

  switch (block.type) {
    case 'header':
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Greeting</Label>
              <Input value={block.data.greeting} onChange={(e) => update('greeting', e.target.value)} placeholder="Hi 👋, I'm" />
            </div>
            <div className="space-y-2">
              <Label>Name</Label>
              <Input value={block.data.name} onChange={(e) => update('name', e.target.value)} placeholder="Your Name" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Tagline</Label>
            <Input value={block.data.tagline} onChange={(e) => update('tagline', e.target.value)} placeholder="Full-stack Developer" />
          </div>
        </div>
      );
    case 'about':
      return (
        <div className="space-y-2">
          <Label>About You</Label>
          <RichTextEditor value={block.data.content} onChange={(value) => update('content', value)} />
        </div>
      );
    case 'skills':
      return (
        <div className="space-y-2">
          <Label>Skills (Comma separated)</Label>
          <Input 
            value={block.data.skills.join(', ')} 
            onChange={(e) => update('skills', e.target.value.split(',').map(s => s.trim()).filter(Boolean))} 
            placeholder="React, TypeScript, Node.js" 
          />
        </div>
      );
    case 'projects':
      // Simplified for now, just edit the first project or allow raw json
      return (
        <div className="space-y-4">
          {block.data.projects.map((proj: any, idx: number) => (
            <div key={idx} className="border border-border p-3 rounded-md space-y-3 bg-muted/20">
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Title</Label>
                <Input value={proj.title} onChange={(e) => {
                  const newProjs = [...block.data.projects];
                  newProjs[idx].title = e.target.value;
                  update('projects', newProjs);
                }} />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Description</Label>
                <Input value={proj.description} onChange={(e) => {
                  const newProjs = [...block.data.projects];
                  newProjs[idx].description = e.target.value;
                  update('projects', newProjs);
                }} />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Link</Label>
                <Input value={proj.link} onChange={(e) => {
                  const newProjs = [...block.data.projects];
                  newProjs[idx].link = e.target.value;
                  update('projects', newProjs);
                }} />
              </div>
            </div>
          ))}
        </div>
      );
    case 'github-stats':
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>GitHub Username</Label>
              <Input value={block.data.username} onChange={(e) => update('username', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Theme</Label>
              <Input value={block.data.theme} onChange={(e) => update('theme', e.target.value)} />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Switch checked={block.data.showIcons} onCheckedChange={(checked) => update('showIcons', checked)} />
            <Label>Show Icons</Label>
          </div>
        </div>
      );
    case 'contact':
      return (
        <div className="space-y-4 grid grid-cols-2 gap-4">
          <div className="space-y-2 col-span-2 md:col-span-1 mt-4">
            <Label>Email</Label>
            <Input value={block.data.email} onChange={(e) => update('email', e.target.value)} />
          </div>
          <div className="space-y-2 col-span-2 md:col-span-1">
            <Label>Twitter (X) Username</Label>
            <Input value={block.data.twitter} onChange={(e) => update('twitter', e.target.value)} />
          </div>
          <div className="space-y-2 col-span-2 md:col-span-1">
            <Label>LinkedIn Username</Label>
            <Input value={block.data.linkedin} onChange={(e) => update('linkedin', e.target.value)} />
          </div>
        </div>
      );
    case 'custom':
      return (
        <div className="space-y-2">
          <Label>Custom Content (Markdown)</Label>
          <RichTextEditor value={block.data.content} onChange={(value) => update('content', value)} />
        </div>
      );
    default:
      return <div>Unknown Block Type</div>;
  }
}

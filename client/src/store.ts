import { create } from 'zustand';
import { generateMarkdown } from './generator';

export type BlockType = 'header' | 'about' | 'skills' | 'projects' | 'github-stats' | 'contact' | 'custom';

export interface Block {
  id: string;
  type: BlockType;
  data: any;
}

interface AppStore {
  blocks: Block[];
  addBlock: (type: BlockType) => void;
  updateBlock: (id: string, data: any) => void;
  removeBlock: (id: string) => void;
  reorderBlocks: (startIndex: number, endIndex: number) => void;
  clearBlocks: () => void;
  getMarkdown: () => string;
}

export const defaultData: Record<BlockType, any> = {
  header: { name: 'Alex', tagline: 'Full-stack Developer & Open Source Enthusiast', greeting: 'Hi 👋, I\'m' },
  about: { content: 'I am a software engineer passionate about building accessible web applications and contributing to the open-source ecosystem.' },
  skills: { skills: ['JavaScript', 'TypeScript', 'React', 'Node.js'] },
  projects: { projects: [{ title: 'Awesome Project', description: 'A cool open source project', link: 'https://github.com/alex/awesome' }] },
  'github-stats': { username: 'torvalds', theme: 'radical', showIcons: true },
  contact: { email: 'hello@example.com', twitter: 'example', linkedin: 'example' },
  custom: { content: '## Custom Section\n\nAdd your custom markdown here.' }
};

export const useStore = create<AppStore>((set, get) => ({
  blocks: [
    { id: '1', type: 'header', data: { ...defaultData['header'] } },
    { id: '2', type: 'about', data: { ...defaultData['about'] } },
    { id: '3', type: 'github-stats', data: { ...defaultData['github-stats'] } }
  ],
  addBlock: (type) => {
    set((state) => ({
      blocks: [...state.blocks, { id: crypto.randomUUID(), type, data: { ...defaultData[type] } }]
    }))
  },
  updateBlock: (id, data) => {
    set((state) => ({
      blocks: state.blocks.map(b => b.id === id ? { ...b, data: { ...b.data, ...data } } : b)
    }))
  },
  removeBlock: (id) => {
    set((state) => ({
      blocks: state.blocks.filter(b => b.id !== id)
    }))
  },
  reorderBlocks: (startIndex, endIndex) => {
    set((state) => {
      const result = Array.from(state.blocks);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return { blocks: result };
    });
  },
  clearBlocks: () => {
    set({ blocks: [] });
  },
  getMarkdown: () => {
    return generateMarkdown(get().blocks);
  }
}));

import type { Block } from "./store";

const badgeMap: Record<string, string> = {
  "React": "react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB",
  "TypeScript": "typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white",
  "Node.js": "node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white",
  "Python": "python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54",
  "JavaScript": "javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E",
  "Go": "go-%2300ADD8.svg?style=for-the-badge&logo=go&logoColor=white",
  "Rust": "rust-%23000000.svg?style=for-the-badge&logo=rust&logoColor=white",
  "HTML5": "html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white",
  "CSS3": "css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white",
  "TailwindCSS": "tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white",
};

export function generateMarkdown(blocks: Block[]): string {
  return blocks.map(block => {
    switch (block.type) {
      case 'header':
        return `# ${block.data.greeting} ${block.data.name}\n\n### ${block.data.tagline}`;
      case 'about':
        return `## 🚀 About Me\n\n${block.data.content}`;
      case 'skills':
        const badges = block.data.skills.map((s: string) => {
          const mapped = badgeMap[s];
          if (mapped) return `![${s}](https://img.shields.io/badge/${mapped})`;
          return `![${s}](https://img.shields.io/badge/${encodeURIComponent(s)}-%23000000.svg?style=for-the-badge&logo=${encodeURIComponent(s.toLowerCase())}&logoColor=white)`;
        }).join(' ');
        return `## 🛠 Tech Stack\n\n${badges}`;
      case 'projects':
        const projectsStr = block.data.projects.map((p: any) => `- [**${p.title}**](${p.link}) - ${p.description}`).join('\n');
        return `## 💻 Projects\n\n${projectsStr}`;
      case 'github-stats':
        return `## 📊 GitHub Stats\n\n<p align="center">\n  <img src="https://github-readme-stats.vercel.app/api?username=${block.data.username}&show_icons=${block.data.showIcons}&theme=${block.data.theme}" alt="${block.data.username}'s GitHub stats" />\n</p>`;
      case 'contact':
        let links = [];
        if (block.data.email) links.push(`[Email](mailto:${block.data.email})`);
        if (block.data.twitter) links.push(`[Twitter](https://twitter.com/${block.data.twitter})`);
        if (block.data.linkedin) links.push(`[LinkedIn](https://linkedin.com/in/${block.data.linkedin})`);
        return `## 📫 Contact\n\n${links.join(' • ')}`;
      case 'custom':
        return block.data.content;
      default:
        return '';
    }
  }).join('\n\n---\n\n');
}

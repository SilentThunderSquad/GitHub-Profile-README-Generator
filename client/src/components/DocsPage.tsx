import { useEffect } from 'react';
import type { ReactNode } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Blocks,
  BookOpen,
  CircleHelp,
  Code2,
  Database,
  Download,
  ExternalLink,
  FileCode2,
  LayoutGrid,
  Layers3,
  MessageSquare,
  Moon,
  PanelLeft,
  PlayCircle,
  Rocket,
  Send,
  ShieldCheck,
  Sparkles,
  Sun,
  Upload,
  Users,
} from 'lucide-react';

type Theme = 'light' | 'dark';

interface DocsPageProps {
  theme: Theme;
  onBackToBuilder: () => void;
  onToggleTheme: () => void;
  onOpenFeedback: () => void;
}

function GitHubMark({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
    </svg>
  );
}

const navigation = [
  { id: 'introduction', label: 'Introduction' },
  { id: 'features', label: 'Features' },
  { id: 'getting-started', label: 'Getting Started' },
  { id: 'github-login', label: 'GitHub Login' },
  { id: 'building-readme', label: 'Building README' },
  { id: 'generate-readme', label: 'Generate README' },
  { id: 'export-readme', label: 'Export README' },
  { id: 'clone-templates', label: 'Clone Community Templates' },
  { id: 'publish-readme', label: 'Publish README' },
  { id: 'faq', label: 'FAQ' },
] as const;

const featureCards = [
  {
    icon: GitHubMark,
    title: 'GitHub-native identity',
    description: 'OAuth login and profile-aware metadata keep the experience aligned with the account you already use on GitHub.',
  },
  {
    icon: PlayCircle,
    title: 'Live builder feedback',
    description: 'The editor and preview stay in sync so every block edit is immediately visible before export.',
  },
  {
    icon: PanelLeft,
    title: 'Resizable workspace',
    description: 'Sidebar, editor, and preview panels can be resized to match the way you like to work.',
  },
  {
    icon: Sparkles,
    title: 'Theme-aware polish',
    description: 'Dark and light modes share the same visual language, from cards and borders to code blocks and scrollbars.',
  },
  {
    icon: Blocks,
    title: 'Block-based composition',
    description: 'Build a README from reusable blocks, then reorder or customize them without leaving the editor.',
  },
  {
    icon: Database,
    title: 'Export and persistence',
    description: 'Copy, download, and save generated README output through the existing readme workflow.',
  },
] as const;

const faqItems = [
  {
    question: 'Do I need to sign in with GitHub?',
    answer: 'Yes. GitHub login keeps the session flow and user metadata aligned with the existing builder experience.',
  },
  {
    question: 'Does the preview update live?',
    answer: 'Yes. The preview panel reflects block edits as you work, so the generated README stays easy to validate.',
  },
  {
    question: 'Can I switch between light and dark mode?',
    answer: 'Yes. The documentation page uses the same theme state as the main builder, so the styling stays consistent.',
  },
] as const;

function SectionHeading({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <div className="space-y-3">
      <div className="inline-flex items-center gap-2 rounded-full border border-[#d0d7de] bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#57606a] shadow-sm dark:border-[#30363d] dark:bg-[#161b22] dark:text-[#8b949e]">
        {eyebrow}
      </div>
      <h2 className="text-2xl font-semibold tracking-tight text-[#1f2328] dark:text-white sm:text-3xl">
        {title}
      </h2>
      <p className="max-w-3xl text-sm leading-6 text-[#57606a] dark:text-[#8b949e] sm:text-base">
        {description}
      </p>
    </div>
  );
}

function DocsSection({
  id,
  eyebrow,
  title,
  description,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className="scroll-mt-28 rounded-3xl border border-[#d0d7de] bg-white p-6 shadow-[0_1px_0_rgba(27,31,36,0.04)] dark:border-[#30363d] dark:bg-[#0d1117] sm:p-8"
    >
      <SectionHeading eyebrow={eyebrow} title={title} description={description} />
      <div className="mt-6">{children}</div>
    </section>
  );
}

function CodeBlock({ children }: { children: ReactNode }) {
  return (
    <pre className="overflow-x-auto rounded-2xl border border-[#d0d7de] bg-[#f6f8fa] p-4 text-[13px] leading-6 text-[#24292f] shadow-inner dark:border-[#30363d] dark:bg-[#161b22] dark:text-[#c9d1d9]">
      <code className="font-mono">{children}</code>
    </pre>
  );
}

export function DocsPage({ theme, onBackToBuilder, onToggleTheme, onOpenFeedback }: DocsPageProps) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="min-h-screen bg-[#f6f8fa] text-[#1f2328] dark:bg-[#0d1117] dark:text-[#c9d1d9]">
      <header className="sticky top-0 z-40 border-b border-[#d0d7de] bg-white/90 backdrop-blur-xl dark:border-[#30363d] dark:bg-[#0d1117]/90">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={onBackToBuilder}
            className="inline-flex items-center gap-2 rounded-md border border-[#d0d7de] bg-white px-3 py-2 text-sm font-medium text-[#24292f] shadow-sm transition-colors hover:bg-[#f6f8fa] dark:border-[#30363d] dark:bg-[#161b22] dark:text-[#c9d1d9] dark:hover:bg-[#21262d]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Builder
          </button>

          <div className="hidden items-center gap-2 rounded-full border border-[#d0d7de] bg-[#f6f8fa] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#57606a] dark:border-[#30363d] dark:bg-[#161b22] dark:text-[#8b949e] md:flex">
            <BookOpen className="h-3.5 w-3.5" />
            Official Documentation
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onOpenFeedback}
              className="inline-flex items-center gap-2 rounded-md border border-[#d0d7de] bg-white px-3 py-2 text-sm font-medium text-[#24292f] shadow-sm transition-colors hover:bg-[#f6f8fa] dark:border-[#30363d] dark:bg-[#161b22] dark:text-[#c9d1d9] dark:hover:bg-[#21262d]"
            >
              <MessageSquare className="h-4 w-4" />
              Feedback
            </button>
            <button
              type="button"
              onClick={onToggleTheme}
              className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-[#d0d7de] bg-white text-[#24292f] shadow-sm transition-colors hover:bg-[#f6f8fa] dark:border-[#30363d] dark:bg-[#161b22] dark:text-[#c9d1d9] dark:hover:bg-[#21262d]"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="hidden lg:block">
            <div className="sticky top-24 rounded-3xl border border-[#d0d7de] bg-white p-5 shadow-[0_1px_0_rgba(27,31,36,0.04)] dark:border-[#30363d] dark:bg-[#0d1117]">
              <div className="space-y-2 border-b border-[#d0d7de] pb-4 dark:border-[#30363d]">
                <div className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#57606a] dark:text-[#8b949e]">
                  <Layers3 className="h-3.5 w-3.5" />
                  On This Page
                </div>
                <p className="text-sm leading-6 text-[#57606a] dark:text-[#8b949e]">
                  Jump through the official flow for the current README generator implementation.
                </p>
              </div>

              <nav className="mt-4 space-y-1">
                {navigation.map(item => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className="flex items-center justify-between rounded-xl px-3 py-2 text-sm text-[#57606a] transition-colors hover:bg-[#f6f8fa] hover:text-[#24292f] dark:text-[#8b949e] dark:hover:bg-[#161b22] dark:hover:text-white"
                  >
                    <span>{item.label}</span>
                    <ArrowRight className="h-3.5 w-3.5 opacity-50" />
                  </a>
                ))}
              </nav>

              <div className="mt-5 rounded-2xl border border-[#d0d7de] bg-[#f6f8fa] p-4 dark:border-[#30363d] dark:bg-[#161b22]">
                <div className="flex items-center gap-2 text-sm font-semibold text-[#24292f] dark:text-white">
                  <ExternalLink className="h-4 w-4 text-[#57606a] dark:text-[#8b949e]" />
                  Need a quick route?
                </div>
                <p className="mt-2 text-sm leading-6 text-[#57606a] dark:text-[#8b949e]">
                  Use the app to generate, preview, export, and save the README without leaving the builder.
                </p>
              </div>
            </div>
          </aside>

          <div className="space-y-8">
            <div className="rounded-[28px] border border-[#d0d7de] bg-white p-6 shadow-[0_1px_0_rgba(27,31,36,0.04)] dark:border-[#30363d] dark:bg-[#0d1117] sm:p-8 lg:p-10">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-2 rounded-full border border-[#d0d7de] bg-[#f6f8fa] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#57606a] dark:border-[#30363d] dark:bg-[#161b22] dark:text-[#8b949e]">
                  <GitHubMark className="h-3.5 w-3.5" />
                  Official GitHub README Generator Documentation
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-[#d0d7de] bg-[#f6f8fa] px-3 py-1 text-[11px] font-semibold text-[#57606a] dark:border-[#30363d] dark:bg-[#161b22] dark:text-[#8b949e]">
                  <ShieldCheck className="h-3.5 w-3.5 text-[#3fb950]" />
                  Theme aware
                </span>
              </div>

              <div className="mt-6 max-w-4xl space-y-5">
                <h1 className="text-4xl font-semibold tracking-tight text-[#1f2328] dark:text-white sm:text-5xl">
                  Build polished GitHub profile READMEs with a documentation experience that feels native to GitHub.
                </h1>
                <p className="max-w-3xl text-base leading-7 text-[#57606a] dark:text-[#8b949e] sm:text-lg">
                  This guide mirrors the product itself: block-based composition, live preview, export-ready markdown, and a visual treatment tuned for both GitHub-style dark mode and light mode.
                </p>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-[#d0d7de] bg-[#f6f8fa] p-4 dark:border-[#30363d] dark:bg-[#161b22]">
                  <div className="flex items-center gap-2 text-sm font-semibold text-[#24292f] dark:text-white">
                    <PlayCircle className="h-4 w-4 text-[#3fb950]" />
                    Live workflow
                  </div>
                  <p className="mt-2 text-sm leading-6 text-[#57606a] dark:text-[#8b949e]">Build, preview, and validate the README in one pass.</p>
                </div>
                <div className="rounded-2xl border border-[#d0d7de] bg-[#f6f8fa] p-4 dark:border-[#30363d] dark:bg-[#161b22]">
                  <div className="flex items-center gap-2 text-sm font-semibold text-[#24292f] dark:text-white">
                    <Code2 className="h-4 w-4 text-[#0969da] dark:text-[#58a6ff]" />
                    GitHub-styled output
                  </div>
                  <p className="mt-2 text-sm leading-6 text-[#57606a] dark:text-[#8b949e]">Code blocks, borders, and spacing stay consistent with the GitHub visual language.</p>
                </div>
                <div className="rounded-2xl border border-[#d0d7de] bg-[#f6f8fa] p-4 dark:border-[#30363d] dark:bg-[#161b22]">
                  <div className="flex items-center gap-2 text-sm font-semibold text-[#24292f] dark:text-white">
                    <Upload className="h-4 w-4 text-[#3fb950]" />
                    Export ready
                  </div>
                  <p className="mt-2 text-sm leading-6 text-[#57606a] dark:text-[#8b949e]">Copy, download, save, and reuse generated markdown without leaving the app.</p>
                </div>
              </div>
            </div>

            <div className="lg:hidden">
              <div className="overflow-x-auto rounded-2xl border border-[#d0d7de] bg-white p-3 dark:border-[#30363d] dark:bg-[#0d1117]">
                <div className="flex min-w-max gap-2">
                  {navigation.map(item => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      className="rounded-full border border-[#d0d7de] bg-[#f6f8fa] px-3 py-2 text-xs font-medium text-[#57606a] transition-colors hover:bg-white hover:text-[#24292f] dark:border-[#30363d] dark:bg-[#161b22] dark:text-[#8b949e] dark:hover:text-white"
                    >
                      {item.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <DocsSection
              id="introduction"
              eyebrow="Introduction"
              title="A documentation page that matches the product"
              description="The documentation experience keeps the same GitHub-inspired palette, spacing, and visual hierarchy used throughout the builder so the page feels like part of the same product, not a separate marketing site."
            >
              <div className="grid gap-4 lg:grid-cols-3">
                <div className="rounded-2xl border border-[#d0d7de] bg-[#f6f8fa] p-4 dark:border-[#30363d] dark:bg-[#161b22]">
                  <div className="text-sm font-semibold text-[#24292f] dark:text-white">What it is</div>
                  <p className="mt-2 text-sm leading-6 text-[#57606a] dark:text-[#8b949e]">A GitHub-style README generator with a live, block-driven workflow.</p>
                </div>
                <div className="rounded-2xl border border-[#d0d7de] bg-[#f6f8fa] p-4 dark:border-[#30363d] dark:bg-[#161b22]">
                  <div className="text-sm font-semibold text-[#24292f] dark:text-white">Who it is for</div>
                  <p className="mt-2 text-sm leading-6 text-[#57606a] dark:text-[#8b949e]">Developers who want a profile README that looks polished and is fast to iterate on.</p>
                </div>
                <div className="rounded-2xl border border-[#d0d7de] bg-[#f6f8fa] p-4 dark:border-[#30363d] dark:bg-[#161b22]">
                  <div className="text-sm font-semibold text-[#24292f] dark:text-white">Where to start</div>
                  <p className="mt-2 text-sm leading-6 text-[#57606a] dark:text-[#8b949e]">Sign in, add blocks, preview the result, then export or save the README.</p>
                </div>
              </div>
            </DocsSection>

            <DocsSection
              id="features"
              eyebrow="Features"
              title="Everything the current builder already does well"
              description="These cards summarize the experience already implemented in the app shell and the README generation flow."
            >
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {featureCards.map(({ icon: Icon, title, description }) => (
                  <div key={title} className="rounded-2xl border border-[#d0d7de] bg-[#f6f8fa] p-4 dark:border-[#30363d] dark:bg-[#161b22]">
                    <div className="flex items-center gap-3">
                      <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#d0d7de] bg-white text-[#24292f] dark:border-[#30363d] dark:bg-[#0d1117] dark:text-white">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="text-sm font-semibold text-[#24292f] dark:text-white">{title}</div>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-[#57606a] dark:text-[#8b949e]">{description}</p>
                  </div>
                ))}
              </div>
            </DocsSection>

            <DocsSection
              id="getting-started"
              eyebrow="Getting Started"
              title="From sign-in to README output in a few steps"
              description="The current flow is intentionally lightweight: authenticate, arrange blocks, then use the preview and export actions already built into the app."
            >
              <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,380px)]">
                <ol className="space-y-4">
                  {[
                    'Sign in with GitHub so the app can read your profile metadata and keep the session active.',
                    'Use the sidebar to add blocks, then drag them into the editor and reorder them as needed.',
                    'Inspect the preview panel to confirm the README renders the way you want it to on GitHub.',
                    'Export, copy, or save the finished README using the actions already exposed in the preview panel.',
                  ].map((step, index) => (
                    <li key={step} className="flex gap-4 rounded-2xl border border-[#d0d7de] bg-[#f6f8fa] p-4 dark:border-[#30363d] dark:bg-[#161b22]">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#d0d7de] bg-white text-sm font-semibold text-[#24292f] dark:border-[#30363d] dark:bg-[#0d1117] dark:text-white">
                        {index + 1}
                      </div>
                      <p className="text-sm leading-6 text-[#57606a] dark:text-[#c9d1d9]">{step}</p>
                    </li>
                  ))}
                </ol>

                <CodeBlock>{`# Quick start

1. Sign in with GitHub
2. Add blocks from the sidebar
3. Reorder and customize in the editor
4. Preview, export, and save`}</CodeBlock>
              </div>
            </DocsSection>

            <DocsSection
              id="github-login"
              eyebrow="GitHub Login"
              title="OAuth stays the first step in the flow"
              description="The existing login behavior is preserved. The documentation simply explains how the authenticated session supports profile-aware content and downstream README actions."
            >
              <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
                <div className="rounded-2xl border border-[#d0d7de] bg-[#f6f8fa] p-4 dark:border-[#30363d] dark:bg-[#161b22]">
                  <div className="flex items-center gap-2 text-sm font-semibold text-[#24292f] dark:text-white">
                    <GitHubMark className="h-4 w-4" />
                    Why it matters
                  </div>
                  <p className="mt-2 text-sm leading-6 text-[#57606a] dark:text-[#8b949e]">
                    The current session model uses GitHub OAuth so the app can show the right user metadata and keep the builder aligned with your profile.
                  </p>
                </div>
                <div className="rounded-2xl border border-[#d0d7de] bg-[#f6f8fa] p-4 dark:border-[#30363d] dark:bg-[#161b22]">
                  <div className="flex items-center gap-2 text-sm font-semibold text-[#24292f] dark:text-white">
                    <ShieldCheck className="h-4 w-4 text-[#3fb950]" />
                    Session-safe
                  </div>
                  <p className="mt-2 text-sm leading-6 text-[#57606a] dark:text-[#8b949e]">
                    Login, session restoration, and sign-out remain handled by the existing auth flow.
                  </p>
                </div>
              </div>
            </DocsSection>

            <DocsSection
              id="building-readme"
              eyebrow="Building README"
              title="Compose your README with blocks"
              description="The sidebar provides reusable blocks and the editor turns them into a structured README draft that stays easy to reorder and customize."
            >
              <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,380px)]">
                <div className="space-y-4">
                  <div className="rounded-2xl border border-[#d0d7de] bg-[#f6f8fa] p-4 dark:border-[#30363d] dark:bg-[#161b22]">
                    <div className="flex items-center gap-2 text-sm font-semibold text-[#24292f] dark:text-white">
                      <Blocks className="h-4 w-4 text-[#0969da] dark:text-[#58a6ff]" />
                      Sidebar blocks
                    </div>
                    <p className="mt-2 text-sm leading-6 text-[#57606a] dark:text-[#8b949e]">
                      Add text, stats, badges, links, tables, quotes, and other README sections from the existing block library.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-[#d0d7de] bg-[#f6f8fa] p-4 dark:border-[#30363d] dark:bg-[#161b22]">
                    <div className="flex items-center gap-2 text-sm font-semibold text-[#24292f] dark:text-white">
                      <LayoutGrid className="h-4 w-4 text-[#3fb950]" />
                      Editor controls
                    </div>
                    <p className="mt-2 text-sm leading-6 text-[#57606a] dark:text-[#8b949e]">
                      Reorder the blocks, clear the canvas, or refine each block’s configuration without leaving the builder.
                    </p>
                  </div>
                </div>
                <CodeBlock>{`# README structure

## About me
## GitHub stats
## Contributions
## Contact links

Use the sidebar to add and reorder each section.`}</CodeBlock>
              </div>
            </DocsSection>

            <DocsSection
              id="generate-readme"
              eyebrow="Generate README"
              title="Use the existing generate action to validate the result"
              description="The generate button is still the fast path for previewing the README output. The notification and preview scroll behavior remain in place so the workflow feels immediate."
            >
              <div className="grid gap-4 lg:grid-cols-3">
                <div className="rounded-2xl border border-[#d0d7de] bg-[#f6f8fa] p-4 dark:border-[#30363d] dark:bg-[#161b22]">
                  <div className="flex items-center gap-2 text-sm font-semibold text-[#24292f] dark:text-white">
                    <Rocket className="h-4 w-4 text-[#3fb950]" />
                    One-click generate
                  </div>
                  <p className="mt-2 text-sm leading-6 text-[#57606a] dark:text-[#8b949e]">Trigger the current README generation flow from the header action.</p>
                </div>
                <div className="rounded-2xl border border-[#d0d7de] bg-[#f6f8fa] p-4 dark:border-[#30363d] dark:bg-[#161b22]">
                  <div className="flex items-center gap-2 text-sm font-semibold text-[#24292f] dark:text-white">
                    <Send className="h-4 w-4 text-[#0969da] dark:text-[#58a6ff]" />
                    Smooth handoff
                  </div>
                  <p className="mt-2 text-sm leading-6 text-[#57606a] dark:text-[#8b949e]">The preview panel is brought into view so you can validate the output immediately.</p>
                </div>
                <div className="rounded-2xl border border-[#d0d7de] bg-[#f6f8fa] p-4 dark:border-[#30363d] dark:bg-[#161b22]">
                  <div className="flex items-center gap-2 text-sm font-semibold text-[#24292f] dark:text-white">
                    <FileCode2 className="h-4 w-4 text-[#8b949e]" />
                    Markdown first
                  </div>
                  <p className="mt-2 text-sm leading-6 text-[#57606a] dark:text-[#8b949e]">The generator still outputs clean markdown that can be copied or saved as-is.</p>
                </div>
              </div>
            </DocsSection>

            <DocsSection
              id="export-readme"
              eyebrow="Export README"
              title="Copy, download, or save the final markdown"
              description="The preview panel already exposes the export path, so the documentation simply explains how each action fits into the existing flow."
            >
              <div className="grid gap-4 lg:grid-cols-3">
                <div className="rounded-2xl border border-[#d0d7de] bg-[#f6f8fa] p-4 dark:border-[#30363d] dark:bg-[#161b22]">
                  <div className="flex items-center gap-2 text-sm font-semibold text-[#24292f] dark:text-white">
                    <Download className="h-4 w-4 text-[#0969da] dark:text-[#58a6ff]" />
                    Download markdown
                  </div>
                  <p className="mt-2 text-sm leading-6 text-[#57606a] dark:text-[#8b949e]">Export the README into a local markdown file for direct use on GitHub.</p>
                </div>
                <div className="rounded-2xl border border-[#d0d7de] bg-[#f6f8fa] p-4 dark:border-[#30363d] dark:bg-[#161b22]">
                  <div className="flex items-center gap-2 text-sm font-semibold text-[#24292f] dark:text-white">
                    <Code2 className="h-4 w-4 text-[#3fb950]" />
                    Copy to clipboard
                  </div>
                  <p className="mt-2 text-sm leading-6 text-[#57606a] dark:text-[#8b949e]">Paste the result directly into your profile README or repository file.</p>
                </div>
                <div className="rounded-2xl border border-[#d0d7de] bg-[#f6f8fa] p-4 dark:border-[#30363d] dark:bg-[#161b22]">
                  <div className="flex items-center gap-2 text-sm font-semibold text-[#24292f] dark:text-white">
                    <Database className="h-4 w-4 text-[#8b949e]" />
                    Save to Supabase
                  </div>
                  <p className="mt-2 text-sm leading-6 text-[#57606a] dark:text-[#8b949e]">Persist the README through the current storage workflow for later reuse.</p>
                </div>
              </div>
            </DocsSection>

            <DocsSection
              id="clone-templates"
              eyebrow="Clone Community Templates"
              title="Start from a template and adapt it to your profile"
              description="The template area in the sidebar is positioned to encourage reuse while still keeping the editor hands-on and customizable."
            >
              <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
                <div className="rounded-2xl border border-[#d0d7de] bg-[#f6f8fa] p-4 dark:border-[#30363d] dark:bg-[#161b22]">
                  <div className="flex items-center gap-2 text-sm font-semibold text-[#24292f] dark:text-white">
                    <Users className="h-4 w-4 text-[#3fb950]" />
                    Community pattern
                  </div>
                  <p className="mt-2 text-sm leading-6 text-[#57606a] dark:text-[#8b949e]">
                    Use a template as the starting point, then replace the content with your own stats, links, badges, and sections.
                  </p>
                </div>
                <CodeBlock>{`Template workflow

1. Choose a template
2. Clone it into the editor
3. Replace placeholder content
4. Preview and export`}</CodeBlock>
              </div>
            </DocsSection>

            <DocsSection
              id="publish-readme"
              eyebrow="Publish README"
              title="Save the README and prepare it for sharing"
              description="Publishing in this product means using the existing save and export flow so the result can be shared, revisited, or pushed into your GitHub profile workflow later."
            >
              <div className="grid gap-4 lg:grid-cols-2">
                <div className="rounded-2xl border border-[#d0d7de] bg-[#f6f8fa] p-4 dark:border-[#30363d] dark:bg-[#161b22]">
                  <div className="flex items-center gap-2 text-sm font-semibold text-[#24292f] dark:text-white">
                    <Upload className="h-4 w-4 text-[#0969da] dark:text-[#58a6ff]" />
                    Save first, publish next
                  </div>
                  <p className="mt-2 text-sm leading-6 text-[#57606a] dark:text-[#8b949e]">
                    Save the generated README so you have a durable draft before you share or reuse it.
                  </p>
                </div>
                <div className="rounded-2xl border border-[#d0d7de] bg-[#f6f8fa] p-4 dark:border-[#30363d] dark:bg-[#161b22]">
                  <div className="flex items-center gap-2 text-sm font-semibold text-[#24292f] dark:text-white">
                    <ExternalLink className="h-4 w-4 text-[#3fb950]" />
                    Ready for handoff
                  </div>
                  <p className="mt-2 text-sm leading-6 text-[#57606a] dark:text-[#8b949e]">
                    Exported markdown can be copied directly into GitHub or shared with collaborators.
                  </p>
                </div>
              </div>
            </DocsSection>

            <DocsSection
              id="faq"
              eyebrow="FAQ"
              title="Common questions about the current workflow"
              description="A few quick answers to the questions that matter most when you’re using the builder or reading the docs for the first time."
            >
              <div className="space-y-3">
                {faqItems.map(item => (
                  <details
                    key={item.question}
                    className="group rounded-2xl border border-[#d0d7de] bg-[#f6f8fa] p-4 open:bg-white dark:border-[#30363d] dark:bg-[#161b22] dark:open:bg-[#0d1117]"
                  >
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-[#24292f] dark:text-white [&::-webkit-details-marker]:hidden">
                      <span>{item.question}</span>
                      <CircleHelp className="h-4 w-4 shrink-0 text-[#57606a] transition-transform group-open:rotate-180 dark:text-[#8b949e]" />
                    </summary>
                    <p className="mt-3 text-sm leading-6 text-[#57606a] dark:text-[#8b949e]">{item.answer}</p>
                  </details>
                ))}
              </div>
            </DocsSection>
          </div>
        </div>
      </main>
    </div>
  );
}
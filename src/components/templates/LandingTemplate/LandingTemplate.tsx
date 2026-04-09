import { LandingHeader, PopularReposGrid, RepoInputBar, ThemeToggle } from "@/components/organisms";

interface LandingTemplateProps {
  error: string | null;
  onSubmit: (value: string) => void;
  onRepoSelect: (owner: string, repo: string) => void;
}

export function LandingTemplate({ error, onSubmit, onRepoSelect }: LandingTemplateProps) {
  return (
    <div className="min-h-screen flex flex-col bg-base-100 overflow-x-hidden">
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>
      <div className="flex flex-col flex-1 relative">
        {/* Hero ambient glow */}
        <div
          className="absolute top-0 left-0 right-0 h-96 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 100% at 50% 0%, color-mix(in srgb, var(--color-primary) 18%, transparent), transparent 70%)",
          }}
        />
        <LandingHeader />
        <main className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 pb-12 w-full">
          <RepoInputBar error={error} onSubmit={onSubmit} />
          <PopularReposGrid onSelect={onRepoSelect} />
        </main>
        <footer className="mt-auto p-6 text-center text-base-content/40 text-sm border-t border-base-300">
          <p>No backend. No tracking. All music happens in your browser.</p>
          <div className="flex items-center justify-center gap-3 mt-2">
            <a
              href="https://github.com/YogliB/gitquest"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
            >
              github repository
            </a>
            <span>·</span>
            <span>MIT License</span>
          </div>
        </footer>
      </div>
    </div>
  );
}

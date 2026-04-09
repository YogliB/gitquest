export function LandingHeader() {
  return (
    <header className="pt-16 pb-8 text-center relative z-10">
      <div className="flex flex-col items-center gap-4">
        <div
          className="text-7xl select-none leading-none"
          aria-hidden="true"
          style={{ filter: "drop-shadow(0 0 20px var(--color-primary))" }}
        >
          ♪
        </div>
        <h1
          className="text-5xl font-bold tracking-tight bg-clip-text text-transparent"
          style={{
            backgroundImage:
              "linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)",
          }}
        >
          GitSound
        </h1>
        <p className="text-base-content/60 text-lg max-w-sm leading-snug">
          Turn any GitHub repository's commit history into generative music
        </p>
      </div>
    </header>
  );
}

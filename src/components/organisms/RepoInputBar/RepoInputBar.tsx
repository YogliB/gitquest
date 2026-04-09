import { useState } from "react";

interface RepoInputBarProps {
  error: string | null;
  onSubmit: (value: string) => void;
  defaultValue?: string;
}

export function RepoInputBar({ error, onSubmit, defaultValue = "" }: RepoInputBarProps) {
  const [value, setValue] = useState(defaultValue);

  const handleSubmit = () => {
    if (value.trim()) onSubmit(value.trim());
  };

  return (
    <section className="flex flex-col gap-3 mb-10">
      <div>
        <h2 className="text-xl font-semibold text-base-content">Listen to a Repository</h2>
        <p className="text-base-content/50 text-sm mt-0.5">
          Enter a GitHub URL or choose a popular repo below
        </p>
      </div>
      <div className="join w-full shadow-sm">
        <span className="join-item flex items-center px-3 bg-base-200 border border-base-300 text-base-content/50 text-sm select-none border-r-0">
          github.com/
        </span>
        <input
          className="join-item input input-bordered flex-1 focus:outline-none focus:border-primary text-sm"
          type="text"
          placeholder="facebook/react"
          autoComplete="off"
          spellCheck={false}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSubmit();
          }}
        />
        <button
          className="join-item btn btn-primary"
          onClick={handleSubmit}
          disabled={!value.trim()}
        >
          <span className="hidden sm:inline">Generate Music</span>
          <span className="sm:hidden">▶ Listen</span>
        </button>
      </div>
      {error && (
        <div className="alert alert-error py-2 text-sm">
          <span>{error}</span>
        </div>
      )}
    </section>
  );
}

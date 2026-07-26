"use client";

export default function ErrorPage({
  error: _error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-4 text-center">
      <div className="flex size-20 items-center justify-center rounded-full border-2 border-dashed border-red-500/30 text-4xl text-red-500/50">
        💀
      </div>
      <h1 className="text-2xl font-bold text-foreground">Algo deu errado</h1>
      <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
        O ringue inteiro sentiu isso. Tenta de novo.
      </p>
      <button
        onClick={() => reset()}
        className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
      >
        Tentar novamente
      </button>
    </div>
  );
}

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-4 text-center">
      <div className="flex size-20 items-center justify-center rounded-full border-2 border-dashed border-muted-foreground/30 text-4xl text-muted-foreground/50">
        👊
      </div>
      <h1 className="text-4xl font-bold text-foreground">404</h1>
      <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
        Essa luta não existe. Ou já terminou.
      </p>
      <Link
        href="/swipe"
        className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
      >
        Voltar ao ringue
      </Link>
    </div>
  );
}

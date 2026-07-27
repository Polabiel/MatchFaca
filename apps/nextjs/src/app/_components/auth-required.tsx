interface AuthRequiredProps {
  icon: string;
  title: string;
  description: string;
}

export function AuthRequired({ icon, title, description }: AuthRequiredProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
      <div className="flex size-20 items-center justify-center rounded-full border-2 border-dashed border-muted-foreground/30 text-4xl text-muted-foreground/50">
        {icon}
      </div>
      <h2 className="text-xl font-bold text-foreground">{title}</h2>
      <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
    </div>
  );
}

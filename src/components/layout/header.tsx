export function Header({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <header className="mb-8">
      <h1 className="text-2xl font-bold tracking-tight text-white">{title}</h1>
      {description && (
        <p className="mt-1 text-sm text-zinc-400">{description}</p>
      )}
    </header>
  );
}

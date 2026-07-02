/** Lightweight static placeholder shown while the R3F hero chunk loads, so first paint isn't blank. */
export default function HeroFallback() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div
        className="h-56 w-56 animate-pulse rounded-full opacity-60 blur-2xl sm:h-72 sm:w-72"
        style={{
          background:
            "radial-gradient(circle, var(--color-violet-accent) 0%, var(--color-blue-accent) 55%, transparent 75%)",
        }}
      />
    </div>
  );
}

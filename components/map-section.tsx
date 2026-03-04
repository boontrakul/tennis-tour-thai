export function MapSection() {
  return (
    <section
      id="map"
      className="border-b border-black/5 bg-gradient-to-t from-emerald-500/5 via-background to-background"
    >
      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">
              See all courts on an interactive map
            </h2>
            <p className="mt-2 text-sm text-foreground/70">
              Filter by surface, lighting, indoor/outdoor, and more. Sync with
              your favorite navigation app in one tap.
            </p>
          </div>
          <p className="text-[11px] text-foreground/60">
            Demo preview · Replace with your own map integration
          </p>
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl border border-black/5 bg-[radial-gradient(circle_at_20%_0%,rgba(16,185,129,0.25),transparent_55%),radial-gradient(circle_at_80%_100%,rgba(16,185,129,0.2),transparent_45%)] shadow-sm">
          <div className="flex h-64 items-center justify-center text-xs text-foreground/70">
            Map placeholder – plug in Google Maps, Mapbox, or your preferred
            provider here.
          </div>
        </div>
      </div>
    </section>
  );
}


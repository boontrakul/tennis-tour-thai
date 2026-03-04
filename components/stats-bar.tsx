const stats = [
  { label: "Courts listed", value: "120+" },
  { label: "Cities covered", value: "18" },
  { label: "Avg. rating", value: "4.8★" },
];

export function StatsBar() {
  return (
    <section
      id="pricing"
      className="border-b border-black/5 bg-background/60 backdrop-blur"
    >
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-4 py-5">
        <p className="text-xs font-medium text-foreground/70">
          Trusted by local clubs, coaches, and weekend warriors.
        </p>
        <dl className="flex flex-wrap gap-6 text-xs">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col">
              <dt className="text-foreground/60">{stat.label}</dt>
              <dd className="text-sm font-semibold">{stat.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}


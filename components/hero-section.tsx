import Image from "next/image";

export function HeroSection() {
  return (
    <section className="relative min-h-[80vh] border-b border-black/10">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?q=80&w=2000&auto=format&fit=crop"
          alt="Tennis court at sunset"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto flex min-h-[80vh] max-w-5xl flex-col items-center justify-center px-4 text-center text-white">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">
          Tennis made simple
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight md:text-5xl lg:text-6xl">
          Find and book tennis courts
          <br className="hidden md:block" />
          <span className="block text-emerald-300 md:text-white">
            across Thailand in seconds.
          </span>
        </h1>
        <p className="mt-5 max-w-xl text-sm leading-relaxed text-white/80 md:text-base">
          Discover nearby courts, see live availability, and lock in your next
          hitting session without calls, chats, or guesswork.
        </p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <a
            href="#courts"
            className="rounded-full bg-emerald-500 px-6 py-2.5 text-xs font-semibold text-white shadow-lg shadow-emerald-500/30 transition hover:bg-emerald-400"
          >
            Explore courts near me
          </a>
          <a
            href="#map"
            className="rounded-full border border-white/30 bg-white/5 px-5 py-2.5 text-xs font-semibold text-white/90 backdrop-blur-sm transition hover:bg-white/10"
          >
            View map
          </a>
        </div>
        <p className="mt-4 text-[11px] text-white/70">
          No membership required · Free to browse · Cancel anytime
        </p>
      </div>
    </section>
  );
}


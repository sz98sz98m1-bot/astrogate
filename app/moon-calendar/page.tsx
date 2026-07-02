import MoonPhaseCalendar from "@/components/tools/MoonPhaseCalendar";

export default function MoonCalendarPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <h1 className="text-glow-gold text-center text-3xl font-black text-white sm:text-4xl">
        تقويم القمر
      </h1>
      <p className="mx-auto mt-3 max-w-lg text-center text-sm leading-6 text-white/60">
        أطوار القمر خلال الشهر، مع تحديد أيام المحاق والبدر والتربيعين بدقة فلكية.
      </p>
      <div className="mt-8">
        <MoonPhaseCalendar />
      </div>
    </div>
  );
}

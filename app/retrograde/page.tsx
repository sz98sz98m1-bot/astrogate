import RetrogradeTracker from "@/components/tools/RetrogradeTracker";

export default function RetrogradePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-glow-gold text-center text-3xl font-black text-white sm:text-4xl">
        الكواكب الراجعة
      </h1>
      <p className="mx-auto mt-3 max-w-lg text-center text-sm leading-6 text-white/60">
        تتبّع حالة الرجوع الظاهري لكل كوكب حاليًا، وأقرب موعد لتغيّر اتجاه حركته.
      </p>
      <div className="mt-8">
        <RetrogradeTracker />
      </div>
    </div>
  );
}

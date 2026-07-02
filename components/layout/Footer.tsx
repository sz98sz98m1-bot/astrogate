export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-space-950/60 py-6 text-center text-xs text-white/50 backdrop-blur-xl">
      <p className="mx-auto max-w-5xl px-4">
        بوابة الفلك — محتوى تنجيمي لأغراض الترفيه والتثقيف فقط وليس بديلاً عن أي استشارة
        متخصصة. بيانات المواقع الجغرافية مقدَّمة عبر{" "}
        <a
          href="https://www.openstreetmap.org/copyright"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white/60 underline hover:text-gold"
        >
          © مساهمو OpenStreetMap
        </a>
        .
      </p>
    </footer>
  );
}

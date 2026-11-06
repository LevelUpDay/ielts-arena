export default function ComingSoon({ title, emoji }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <span className="text-5xl">{emoji}</span>
      <h1 className="mt-4 text-xl font-bold">{title}</h1>
      <p className="mt-2 max-w-sm text-sm text-black/50 dark:text-white/50">
        Bu bo'lim hali tayyorlanmoqda. Tez kunda shu yerda mashqlar paydo bo'ladi.
      </p>
      <span className="badge mt-4 bg-brand-50 text-brand-700 dark:bg-white/10 dark:text-brand-200">Soon</span>
    </div>
  );
}

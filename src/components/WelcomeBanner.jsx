export default function WelcomeBanner({ user }) {
  const initial = user?.full_name?.charAt(0)?.toUpperCase() || '?';

  return (
    <div className="flex items-center gap-4 px-8 pt-8 pb-2">
      <div className="w-12 h-12 rounded-full bg-panel border border-panelBorder flex items-center justify-center font-display font-semibold text-lg">
        {initial}
      </div>
      <h1 className="font-display font-semibold text-2xl tracking-tight">
        Здраво, {user?.full_name || 'инвеститор'}
      </h1>
    </div>
  );
}
export function EmptyState({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-gray-400">
      <div className="w-12 h-12 mb-3 opacity-40">{icon}</div>
      <p className="text-sm font-medium">{label}</p>
    </div>
  );
}

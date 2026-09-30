export interface StatCard {
  label: string;
  value: number;
  bgColor: string;
  textColor: string;
  icon: React.ReactNode;
}

export function StatsCards({
  cards,
  loading,
}: {
  cards: StatCard[];
  loading: boolean;
}) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4 flex items-center gap-4"
          >
            <div className="w-10 h-10 rounded-xl bg-gray-200 animate-pulse flex-shrink-0" />
            <div className="space-y-2 flex-1">
              <div className="h-6 w-12 bg-gray-200 rounded animate-pulse" />
              <div className="h-3 w-20 bg-gray-100 rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      {cards.map((card) => (
        <div
          key={card.label}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4 flex items-center gap-4"
        >
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${card.bgColor}`}
          >
            <span className={card.textColor}>{card.icon}</span>
          </div>
          <div>
            <p className="text-2xl font-bold text-primary leading-tight">
              {card.value}
            </p>
            <p className="text-xs text-gray-500 font-medium">{card.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

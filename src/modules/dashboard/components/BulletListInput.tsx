// Editable list of one-line text items with add/remove (e.g. job
// responsibilities, course features). Always keeps at least one row.
export function BulletListInput({
  label,
  items,
  onChange,
  placeholder,
  addLabel,
}: {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
  placeholder: string;
  addLabel: string;
}) {
  const update = (idx: number, value: string) =>
    onChange(items.map((item, i) => (i === idx ? value : item)));
  const remove = (idx: number) => onChange(items.filter((_, i) => i !== idx));
  const add = () => onChange([...items, ""]);

  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
        {label}
      </label>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              type="text"
              value={item}
              onChange={(e) => update(i, e.target.value)}
              placeholder={`${placeholder} ${i + 1}`}
              className="flex-1 px-3.5 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition"
            />
            {items.length > 1 && (
              <button
                type="button"
                onClick={() => remove(i)}
                aria-label={`Remove ${placeholder.toLowerCase()} ${i + 1}`}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-red-400 hover:bg-red-50 transition flex-shrink-0"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={add}
          className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary/80 transition mt-1"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4v16m8-8H4"
            />
          </svg>
          {addLabel}
        </button>
      </div>
    </div>
  );
}

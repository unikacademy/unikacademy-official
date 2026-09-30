export function SkeletonRows({ cols, rows = 7 }: { cols: number; rows?: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <tr key={i}>
          {Array.from({ length: cols }).map((_, j) => (
            <td key={j} className="px-5 py-4">
              <div
                className={`h-4 rounded-full bg-gray-200 animate-pulse ${
                  j === 0
                    ? "w-28"
                    : j === cols - 1
                      ? "w-16"
                      : "w-full max-w-[120px]"
                }`}
              />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

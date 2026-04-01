type Primitive = string | number | boolean | null | undefined;
type DebugValue = Primitive | Record<string, unknown> | unknown[];

type DebugEntry = {
  label: string;
  value: unknown;
};

type DebugData = DebugValue | Record<string, unknown> | DebugEntry[];

interface DebugDisplayProps {
  title?: string;
  data: DebugData;
  enabled?: boolean;
  className?: string;
}

const isEntryArray = (value: DebugData): value is DebugEntry[] => {
  if (!Array.isArray(value)) return false;
  return value.every((item) => (
    typeof item === 'object'
    && item !== null
    && 'label' in item
    && 'value' in item
  ));
};

const formatValue = (value: unknown): string => {
  if (typeof value === 'string') return value;
  if (
    typeof value === 'number'
    || typeof value === 'boolean'
    || value === null
    || value === undefined
  ) {
    return String(value);
  }

  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
};

const normalizeEntries = (data: DebugData): DebugEntry[] => {
  if (isEntryArray(data)) return data;

  if (typeof data === 'string' || typeof data === 'number' || typeof data === 'boolean' || data === null || data === undefined) {
    return [{ label: 'message', value: data }];
  }

  if (Array.isArray(data)) {
    return [{ label: 'data', value: data }];
  }

  return Object.entries(data).map(([label, value]) => ({ label, value }));
};

export function DebugDisplay({
  title = 'Debug',
  data,
  enabled = import.meta.env.VITE_APP_DEBUG === "true",
  className = '',
}: DebugDisplayProps) {
  if (!enabled) return null;

  const entries = normalizeEntries(data);

  return (
    <div className={`text-xs rounded-md border border-dashed border-gray-300 dark:border-gray-600 p-2 text-gray-600 dark:text-gray-300 space-y-2 ${className}`.trim()}>
      <div className="font-medium">{title}</div>
      <div className="space-y-1">
        {entries.map((entry) => {
          const rendered = formatValue(entry.value);
          const isComplex = typeof entry.value === 'object' && entry.value !== null;

          return (
            <div key={entry.label} className="leading-relaxed">
              <span className="font-medium">{entry.label}:</span>{' '}
              {isComplex ? (
                <pre className="mt-1 whitespace-pre-wrap wrap-break-word text-[11px]">{rendered}</pre>
              ) : (
                <span>{rendered}</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

import Link from 'next/link';

export interface HashtagChipItem {
  tag: string;
  count?: number;
}

interface HashtagChipsProps {
  tags: HashtagChipItem[];
  showCount?: boolean;
  onSelect?: (tag: string) => void;
  className?: string;
  gapClassName?: string;
}

const formatDisplayLabel = (tag: string): string => {
  if (!tag) return '';
  return tag.startsWith('#') ? tag : `#${tag}`;
};

const buildDecksHref = (tag: string): string => {
  const normalized = tag.replace(/^#+/, '').trim();
  if (!normalized) return '/decks';
  const search = new URLSearchParams({ tag: normalized }).toString();
  return `/decks?${search}`;
};

export const HashtagChips = ({
  tags,
  showCount = false,
  onSelect,
  className = '',
  gapClassName = 'gap-2',
}: HashtagChipsProps) => {
  if (!tags.length) return null;

  return (
    <div className={`flex flex-wrap ${gapClassName} ${className}`.trim()}>
      {tags.map((item) => {
        const label = formatDisplayLabel(item.tag);

        if (onSelect) {
          return (
            <button
              key={item.tag}
              type="button"
              onClick={() => onSelect(item.tag)}
              className="group flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm font-medium text-slate-800 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
            >
              <span>{label}</span>
              {showCount && item.count !== undefined && (
                <span className="rounded-full bg-white px-2 py-0.5 text-xs font-semibold text-blue-700 group-hover:bg-blue-700 group-hover:text-white">
                  {item.count}
                </span>
              )}
            </button>
          );
        }

        const href = buildDecksHref(item.tag);

        return (
          <Link
            key={item.tag}
            href={href}
            className="group flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm font-medium text-slate-800 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
          >
            <span>{label}</span>
            {showCount && item.count !== undefined && (
              <span className="rounded-full bg-white px-2 py-0.5 text-xs font-semibold text-blue-700 group-hover:bg-blue-700 group-hover:text-white">
                {item.count}
              </span>
            )}
          </Link>
        );
      })}
    </div>
  );
};

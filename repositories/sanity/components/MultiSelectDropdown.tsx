'use client';

import { useState, useRef, useEffect } from 'react';
import { set, unset } from 'sanity';
import type { ArrayOfPrimitivesInputProps } from 'sanity';

/**
 * Sanity Studio 用カスタム入力: ドロップダウン複数選択
 */
export function MultiSelectDropdown(props: ArrayOfPrimitivesInputProps) {
  const { value = [], onChange, schemaType, readOnly } = props;
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const options: { title: string; value: string }[] =
    (schemaType.options as { list?: { title: string; value: string }[] })
      ?.list ?? [];

  const selected = value as string[];

  const toggle = (v: string) => {
    if (readOnly) return;
    const next = selected.includes(v)
      ? selected.filter((s) => s !== v)
      : [...selected, v];
    onChange(next.length === 0 ? unset() : set(next));
  };

  // 外側クリックで閉じる
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={ref} style={{ position: 'relative', fontFamily: 'inherit' }}>
      {/* トリガーボタン */}
      <button
        type="button"
        disabled={readOnly}
        onClick={() => !readOnly && setOpen((prev) => !prev)}
        style={{
          width: '100%',
          padding: '8px 12px',
          border: '1px solid var(--card-border-color, #ccc)',
          borderRadius: 4,
          background: readOnly ? 'var(--card-muted-bg, #f5f5f5)' : 'var(--card-bg-color, #fff)',
          color: readOnly ? 'var(--card-muted-fg, #999)' : 'inherit',
          textAlign: 'left',
          cursor: readOnly ? 'not-allowed' : 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          opacity: readOnly ? 0.6 : 1,
        }}
      >
        <span>
          {selected.length === 0
            ? '選択してください'
            : selected.join('・')}
        </span>
        <span style={{ marginLeft: 8 }}>{open ? '▲' : '▼'}</span>
      </button>

      {/* ドロップダウンリスト */}
      {open && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            zIndex: 100,
            border: '1px solid var(--card-border-color, #ccc)',
            borderRadius: 4,
            background: 'var(--card-bg-color, #fff)',
            maxHeight: 260,
            overflowY: 'auto',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          }}
        >
          {options.map((opt) => {
            const isSelected = selected.includes(opt.value);
            return (
              <div
                key={opt.value}
                onClick={() => toggle(opt.value)}
                style={{
                  padding: '8px 12px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  background: isSelected
                    ? 'var(--card-selected-bg, rgba(99,102,241,0.12))'
                    : 'transparent',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background =
                    'var(--card-hover-bg, rgba(0,0,0,0.06))';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = isSelected
                    ? 'var(--card-selected-bg, rgba(99,102,241,0.12))'
                    : 'transparent';
                }}
              >
                <span
                  style={{
                    width: 16,
                    height: 16,
                    border: '1px solid var(--card-border-color, #aaa)',
                    borderRadius: 3,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: isSelected
                      ? 'var(--blue-500, #6366f1)'
                      : 'transparent',
                    color: '#fff',
                    fontSize: 11,
                    flexShrink: 0,
                  }}
                >
                  {isSelected ? '✓' : ''}
                </span>
                {opt.title}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

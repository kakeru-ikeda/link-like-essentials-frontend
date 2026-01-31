'use client';

import { Dropdown, DropdownOption } from '@/components/common/Dropdown';

interface SortControlsProps<TSortBy extends string, TOrder extends string> {
  sortBy: TSortBy;
  order: TOrder;
  onSortByChange: (value: TSortBy) => void;
  onOrderChange: (value: TOrder) => void;
  sortByOptions: DropdownOption<TSortBy>[];
  orderOptions: DropdownOption<TOrder>[];
  sortByClassName?: string;
  orderClassName?: string;
}

/**
 * 汎用ソートコントロールコンポーネント
 * カード、デッキなど様々なソート対象に対応
 */
export function SortControls<
  TSortBy extends string = string,
  TOrder extends string = string,
>({
  sortBy,
  order,
  onSortByChange,
  onOrderChange,
  sortByOptions,
  orderOptions,
  sortByClassName = 'w-30 sm:w-40',
  orderClassName = 'w-24 sm:w-24',
}: SortControlsProps<TSortBy, TOrder>) {
  return (
    <div className="flex items-center gap-1.5 w-full sm:w-auto">
      <Dropdown
        value={sortBy}
        onChange={(value) => onSortByChange(value as TSortBy)}
        options={sortByOptions}
        className={`${sortByClassName} [&>button]:!h-8 sm:[&>button]:!h-10 [&>button]:!py-1 [&>button]:!text-xs sm:[&>button]:!text-sm`}
      />
      <Dropdown
        value={order}
        onChange={(value) => onOrderChange(value as TOrder)}
        options={orderOptions}
        className={`${orderClassName} [&>button]:!h-8 sm:[&>button]:!h-10 [&>button]:!py-1 [&>button]:!text-xs sm:[&>button]:!text-sm`}
      />
    </div>
  );
}

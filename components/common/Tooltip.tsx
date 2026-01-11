'use client';

import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

// Tooltip表示位置の定数
const TOOLTIP_OFFSET = 8; // トリガー要素からの距離
const SCREEN_PADDING = 8; // 画面端からの余白
const ARROW_MIN_OFFSET = 12; // 矢印の最小オフセット（角から離す）
const Z_INDEX = 9999; // ツールチップのz-index

interface TooltipProps {
  content: string | React.ReactNode;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
  tooltipClassName?: string;
  hideArrow?: boolean;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'top',
  className = '',
  tooltipClassName = '',
  hideArrow = false,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const [actualPosition, setActualPosition] = useState(position);
  const [arrowOffset, setArrowOffset] = useState({ top: '50%', left: '50%' });
  const [mounted, setMounted] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isVisible || !triggerRef.current || !tooltipRef.current) return;

    const updatePosition = () => {
      if (!triggerRef.current || !tooltipRef.current) return;

      const triggerRect = triggerRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();

      // 位置計算
      const calculatePosition = (pos: 'top' | 'bottom' | 'left' | 'right') => {
        const { top, left, right, bottom, width, height } = triggerRect;
        const { width: tooltipWidth, height: tooltipHeight } = tooltipRect;

        const positions = {
          top: {
            top: top - tooltipHeight - TOOLTIP_OFFSET,
            left: left + (width - tooltipWidth) / 2,
          },
          bottom: {
            top: bottom + TOOLTIP_OFFSET,
            left: left + (width - tooltipWidth) / 2,
          },
          left: {
            top: top + (height - tooltipHeight) / 2,
            left: left - tooltipWidth - TOOLTIP_OFFSET,
          },
          right: {
            top: top + (height - tooltipHeight) / 2,
            left: right + TOOLTIP_OFFSET,
          },
        };

        return positions[pos];
      };

      // 画面外判定（どの方向が画面外か）
      const getOutOfBoundsDirections = (pos: { top: number; left: number }) => {
        const { innerWidth, innerHeight } = window;
        const { width: tooltipWidth, height: tooltipHeight } = tooltipRect;

        return {
          top: pos.top < SCREEN_PADDING,
          bottom: pos.top + tooltipHeight > innerHeight - SCREEN_PADDING,
          left: pos.left < SCREEN_PADDING,
          right: pos.left + tooltipWidth > innerWidth - SCREEN_PADDING,
        };
      };

      // フォールバック位置を優先順位順に試行
      const tryPositions = (
        preferred: 'top' | 'bottom' | 'left' | 'right'
      ): {
        pos: 'top' | 'bottom' | 'left' | 'right';
        coords: { top: number; left: number };
      } => {
        // まず指定された位置を試す
        let finalPos = preferred;
        let coords = calculatePosition(finalPos);
        let bounds = getOutOfBoundsDirections(coords);

        // 指定された位置の主軸が画面外かチェック
        const isMainAxisOutOfBounds =
          (preferred === 'left' && bounds.left) ||
          (preferred === 'right' && bounds.right) ||
          (preferred === 'top' && bounds.top) ||
          (preferred === 'bottom' && bounds.bottom);

        // 主軸が画面内なら、垂直/水平位置は後で調整するのでそのまま返す
        if (!isMainAxisOutOfBounds) {
          return { pos: finalPos, coords };
        }

        // フォールバック順序（反対方向 → 他の方向）
        const fallbackOrder: Record<
          string,
          ('top' | 'bottom' | 'left' | 'right')[]
        > = {
          left: ['right', 'top', 'bottom'],
          right: ['left', 'top', 'bottom'],
          top: ['bottom', 'right', 'left'],
          bottom: ['top', 'right', 'left'],
        };

        // フォールバック位置を順に試す
        for (const fallbackPos of fallbackOrder[preferred]) {
          finalPos = fallbackPos;
          coords = calculatePosition(fallbackPos);
          bounds = getOutOfBoundsDirections(coords);

          const isFallbackMainAxisOut =
            (fallbackPos === 'left' && bounds.left) ||
            (fallbackPos === 'right' && bounds.right) ||
            (fallbackPos === 'top' && bounds.top) ||
            (fallbackPos === 'bottom' && bounds.bottom);

          if (!isFallbackMainAxisOut) {
            break;
          }
        }

        return { pos: finalPos, coords };
      };

      // 最適な位置を決定
      const { pos: finalPosition, coords } = tryPositions(position);
      let { top, left } = coords;

      // 最終的な微調整（画面内に収める）
      const adjustedTop = Math.max(
        SCREEN_PADDING,
        Math.min(top, window.innerHeight - tooltipRect.height - SCREEN_PADDING)
      );
      const adjustedLeft = Math.max(
        SCREEN_PADDING,
        Math.min(left, window.innerWidth - tooltipRect.width - SCREEN_PADDING)
      );

      // 矢印のオフセットを計算（トリガー要素の中心を指すように）
      const triggerCenterX = triggerRect.left + triggerRect.width / 2;
      const triggerCenterY = triggerRect.top + triggerRect.height / 2;

      let arrowTop = '50%';
      let arrowLeft = '50%';

      if (finalPosition === 'top' || finalPosition === 'bottom') {
        // 上下配置の場合、矢印の左右位置を調整
        const relativeX = triggerCenterX - adjustedLeft;
        const clampedX = Math.max(
          ARROW_MIN_OFFSET,
          Math.min(relativeX, tooltipRect.width - ARROW_MIN_OFFSET)
        );
        arrowLeft = `${clampedX}px`;
      } else if (finalPosition === 'left' || finalPosition === 'right') {
        // 左右配置の場合、矢印の上下位置を調整
        const relativeY = triggerCenterY - adjustedTop;
        const clampedY = Math.max(
          ARROW_MIN_OFFSET,
          Math.min(relativeY, tooltipRect.height - ARROW_MIN_OFFSET)
        );
        arrowTop = `${clampedY}px`;
      }

      setActualPosition(finalPosition);
      setTooltipPosition({ top: adjustedTop, left: adjustedLeft });
      setArrowOffset({ top: arrowTop, left: arrowLeft });
    };

    updatePosition();
    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);

    const resizeObserver =
      typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(() => updatePosition())
        : undefined;

    if (resizeObserver && tooltipRef.current) {
      resizeObserver.observe(tooltipRef.current);
    }

    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
      resizeObserver?.disconnect();
    };
  }, [isVisible, position]);

  const tooltipContent =
    isVisible && mounted ? (
      <div
        ref={tooltipRef}
        role="tooltip"
        className={
          tooltipClassName ||
          'fixed px-3 py-2 text-sm text-white bg-gray-900 rounded-md shadow-lg max-w-xs pointer-events-none'
        }
        style={{
          top: `${tooltipPosition.top}px`,
          left: `${tooltipPosition.left}px`,
          zIndex: Z_INDEX,
        }}
      >
        {content}
        {/* 矢印 */}
        {!hideArrow && (
          <div
            className={`absolute w-2 h-2 bg-gray-900 ${
              actualPosition === 'top'
                ? 'bottom-[-4px]'
                : actualPosition === 'bottom'
                  ? 'top-[-4px]'
                  : actualPosition === 'left'
                    ? 'right-[-4px]'
                    : 'left-[-4px]'
            }`}
            style={{
              top:
                actualPosition === 'left' || actualPosition === 'right'
                  ? arrowOffset.top
                  : undefined,
              left:
                actualPosition === 'top' || actualPosition === 'bottom'
                  ? arrowOffset.left
                  : undefined,
              transform:
                actualPosition === 'top' || actualPosition === 'bottom'
                  ? 'translateX(-50%) rotate(45deg)'
                  : 'translateY(-50%) rotate(45deg)',
            }}
          />
        )}
      </div>
    ) : null;

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onFocus={() => setIsVisible(true)}
        onBlur={() => setIsVisible(false)}
        tabIndex={0}
        className={`inline-block ${className}`}
      >
        {children}
      </div>

      {mounted &&
        typeof document !== 'undefined' &&
        createPortal(tooltipContent, document.body)}
    </>
  );
};

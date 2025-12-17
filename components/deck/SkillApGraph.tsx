'use client';

import React from 'react';
import { Deck } from '@/models/Deck';
import { FavoriteMode } from '@/models/enums';

interface SkillApGraphProps {
  deck: Deck | null;
}

interface ApData {
  ap: number;
  favoriteMode: string;
}

/**
 * スキルAPの値を数値に変換する関数
 * 例: "3" -> 3, "8+" -> 8, "10+" -> 10
 */
const parseApValue = (ap: string | undefined): number | null => {
  if (!ap) return null;
  const match = ap.match(/\d+/);
  return match ? parseInt(match[0], 10) : null;
};

/**
 * カードのスキルAPと好感度モードを抽出する関数
 */
const extractSkillApData = (deck: Deck | null): ApData[] => {
  if (!deck) return [];

  const apDataList: ApData[] = [];

  deck.slots.forEach((slot) => {
    if (!slot.card?.detail) return;

    const { skill, favoriteMode } = slot.card.detail;
    const favMode = favoriteMode || FavoriteMode.NONE;

    // スキルAPを追加
    if (skill?.ap) {
      const apValue = parseApValue(skill.ap);
      if (apValue !== null && apValue >= 0) {
        // 10以上は10+にまとめる
        const normalizedAp = apValue >= 10 ? 10 : apValue;
        apDataList.push({ ap: normalizedAp, favoriteMode: favMode });
      }
    }
  });

  return apDataList;
};

/**
 * APデータをX軸（0-10）でグループ化し、各好感度モードの件数を集計
 */
const groupByApValue = (apDataList: ApData[]): Record<number, Record<string, number>> => {
  const grouped: Record<number, Record<string, number>> = {};

  // 0-10までの軸を初期化
  for (let i = 0; i <= 10; i++) {
    grouped[i] = {
      [FavoriteMode.HAPPY]: 0,
      [FavoriteMode.MELLOW]: 0,
      [FavoriteMode.NEUTRAL]: 0,
      [FavoriteMode.NONE]: 0,
    };
  }

  // データをグループ化
  apDataList.forEach(({ ap, favoriteMode }) => {
    if (!grouped[ap][favoriteMode]) {
      grouped[ap][favoriteMode] = 0;
    }
    grouped[ap][favoriteMode]++;
  });

  return grouped;
};

/**
 * 好感度モードに応じた色を返す関数
 */
const getFavoriteModeColor = (mode: string): string => {
  switch (mode) {
    case FavoriteMode.HAPPY:
      return 'bg-pink-400';
    case FavoriteMode.MELLOW:
      return 'bg-blue-400';
    case FavoriteMode.NEUTRAL:
      return 'bg-gray-100 border border-gray-300';
    case FavoriteMode.NONE:
      return 'bg-gray-200';
    default:
      return 'bg-gray-200';
  }
};

export const SkillApGraph: React.FC<SkillApGraphProps> = ({ deck }) => {
  const apDataList = extractSkillApData(deck);
  const groupedData = groupByApValue(apDataList);

  // 最大件数を取得（グラフの高さの基準）
  const maxCount = Math.max(
    ...Object.values(groupedData).map((modes) =>
      Object.values(modes).reduce((sum, count) => sum + count, 0)
    ),
    1 // 最低1にして0除算を防ぐ
  );

  return (
    <div className="border border-gray-200 rounded-lg p-4">

      {/* グラフエリア */}
      <div className="flex items-end justify-between gap-1 h-20 border-b border-gray-300 bg-gray-50">
        {Object.entries(groupedData).map(([ap, modes]) => {
          const happyCount = modes[FavoriteMode.HAPPY] || 0;
          const mellowCount = modes[FavoriteMode.MELLOW] || 0;
          const neutralCount = modes[FavoriteMode.NEUTRAL] || 0;
          const totalCount = happyCount + mellowCount + neutralCount;
          const heightPercentage = totalCount > 0 ? (totalCount / maxCount) * 100 : 0;
          
          // X軸ラベル（10は10+と表示）
          const label = ap === '10' ? '10+' : ap;

          return (
            <div key={ap} className="flex flex-col items-center flex-1 h-full">
              {/* 件数表示 */}
              {totalCount > 0 && (
                <div className="text-xs font-semibold text-gray-700 mb-1">
                  {totalCount}
                </div>
              )}
              
              {/* 積み上げ棒グラフ */}
              <div className="w-full flex flex-col justify-end items-stretch flex-1">
                {totalCount > 0 ? (
                  <div
                    className="w-full flex flex-col-reverse"
                    style={{ height: `${heightPercentage}%`, minHeight: '4px' }}
                  >
                    {/* ハッピー（下） */}
                    {happyCount > 0 && (
                      <div
                        className="bg-pink-400 w-full"
                        style={{
                          flex: happyCount,
                        }}
                        title={`ハッピー: ${happyCount}`}
                      />
                    )}
                    {/* メロウ（中央） */}
                    {mellowCount > 0 && (
                      <div
                        className="bg-blue-400 w-full"
                        style={{
                          flex: mellowCount,
                        }}
                        title={`メロウ: ${mellowCount}`}
                      />
                    )}
                    {/* ニュートラル（上） */}
                    {neutralCount > 0 && (
                      <div
                        className="bg-white border border-gray-300 w-full"
                        style={{
                          flex: neutralCount,
                        }}
                        title={`ニュートラル: ${neutralCount}`}
                      />
                    )}
                  </div>
                ) : null}
              </div>
              
              {/* X軸ラベル */}
              <div className="text-xs text-gray-500 mt-1">{label}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

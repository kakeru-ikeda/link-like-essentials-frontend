/**
 * ParticipationResolver
 *
 * 楽曲のcategoryとsingersから実際の参加メンバーを解決するサービス
 * 移植元: link-like-scraper/src/domain/services/ParticipationResolver.ts
 */

const CHARACTERS = [
  '日野下花帆',
  '村野さやか',
  '乙宗梢',
  '夕霧綴理',
  '大沢瑠璃乃',
  '藤島慈',
  '徒町小鈴',
  '百生吟子',
  '安養寺姫芽',
  '桂城泉',
  'セラス',
] as const;

const UNIT_MEMBERS: Record<string, string[]> = {
  'かほめぐ♡じぇらーと': ['日野下花帆', '藤島慈'],
  蓮ノ休日: ['村野さやか', '乙宗梢'],
  るりのとゆかいなつづりたち: ['大沢瑠璃乃', '夕霧綴理'],
  'Ruri＆To': ['大沢瑠璃乃', '村野さやか', '徒町小鈴', 'セラス'],
  'PRINCEε>ε>': ['安養寺姫芽', '日野下花帆', '百生吟子', '桂城泉'],
};

const UNIT_MEMBERS_BY_CATEGORY: Record<string, Record<string, string[]>> = {
  '103期': {
    蓮ノ空: ['日野下花帆', '村野さやか', '乙宗梢', '夕霧綴理', '大沢瑠璃乃', '藤島慈'],
    スリーズブーケ: ['日野下花帆', '乙宗梢'],
    DOLLCHESTRA: ['村野さやか', '夕霧綴理'],
    'みらくらぱーく！': ['大沢瑠璃乃', '藤島慈'],
  },
  '104期': {
    蓮ノ空: [
      '日野下花帆', '村野さやか', '乙宗梢', '夕霧綴理', '大沢瑠璃乃',
      '藤島慈', '百生吟子', '徒町小鈴', '安養寺姫芽',
    ],
    スリーズブーケ: ['日野下花帆', '乙宗梢', '百生吟子'],
    DOLLCHESTRA: ['村野さやか', '夕霧綴理', '徒町小鈴'],
    'みらくらぱーく！': ['大沢瑠璃乃', '藤島慈', '安養寺姫芽'],
  },
  '105期': {
    蓮ノ空: [
      '日野下花帆', '村野さやか', '大沢瑠璃乃', '百生吟子',
      '徒町小鈴', '安養寺姫芽', '桂城泉', 'セラス',
    ],
    スリーズブーケ: ['日野下花帆', '百生吟子'],
    DOLLCHESTRA: ['村野さやか', '徒町小鈴'],
    'みらくらぱーく！': ['大沢瑠璃乃', '安養寺姫芽'],
    'Edel Note': ['桂城泉', 'セラス'],
  },
  '105期BGP': {
    蓮ノ空: [
      '日野下花帆', '村野さやか', '乙宗梢', '夕霧綴理', '大沢瑠璃乃',
      '藤島慈', '百生吟子', '徒町小鈴', '安養寺姫芽', '桂城泉', 'セラス',
    ],
  },
};

export class ParticipationResolver {
  static resolve(category: string, singers: string): string {
    if (this.containsCharacter(singers)) {
      return singers;
    }

    if (UNIT_MEMBERS[singers]) {
      return UNIT_MEMBERS[singers].join(',');
    }

    if (UNIT_MEMBERS_BY_CATEGORY[category]) {
      const categoryUnits = UNIT_MEMBERS_BY_CATEGORY[category];
      if (categoryUnits[singers]) {
        return categoryUnits[singers].join(',');
      }
    }

    console.warn(
      `[ParticipationResolver] No match found for category="${category}", singers="${singers}". Returning singers as-is.`
    );
    return singers;
  }

  static toArray(participations: string): string[] {
    if (!participations) return [];
    return participations.split(',').map((name) => name.trim());
  }

  private static containsCharacter(singers: string): boolean {
    return CHARACTERS.some((char) => singers.includes(char));
  }
}

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
  '102期生': ['乙宗梢', '夕霧綴理', '藤島慈'],
  '103期生': ['日野下花帆', '村野さやか', '乙宗梢', '夕霧綴理', '大沢瑠璃乃', '藤島慈'],
  '104期生': ['日野下花帆', '村野さやか', '乙宗梢', '夕霧綴理', '大沢瑠璃乃', '藤島慈', '百生吟子', '徒町小鈴', '安養寺姫芽'],
  '105期生': ['日野下花帆', '村野さやか', '大沢瑠璃乃', '百生吟子', '徒町小鈴', '安養寺姫芽', '桂城泉', 'セラス'],
};

const UNIT_MEMBERS_BY_CATEGORY: Record<string, Record<string, string[]>> = {
  '102期': {
    蓮ノ空: ['乙宗梢', '夕霧綴理', '藤島慈'],
    スリーズブーケ: ['乙宗梢'],
    DOLLCHESTRA: ['夕霧綴理'],
    'みらくらぱーく！': ['藤島慈'],
  },
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
  '105期ft.梢': {
    スリーズブーケ: ['日野下花帆', '百生吟子', '乙宗梢'],
  },
  '105期ft.綴理': {
    DOLLCHESTRA: ['村野さやか', '徒町小鈴', '夕霧綴理'],
  },
  '105期ft.慈': {
    'みらくらぱーく！': ['大沢瑠璃乃', '安養寺姫芽', '藤島慈'],
  },
};

export class ParticipationResolver {
  static resolve(category: string, singers: string): string {
    if (this.containsCharacter(singers)) {
      return singers;
    }

    // カンマ区切りの複数ユニット（例: "102期生,103期生"）を各々解決してマージ
    if (singers.includes(',')) {
      const parts = singers.split(',').map((s) => s.trim());
      const allMembers = new Set<string>();
      let allResolved = true;
      for (const part of parts) {
        const resolved = this.resolveSingle(category, part);
        if (resolved === null) {
          allResolved = false;
          break;
        }
        resolved.forEach((m) => allMembers.add(m));
      }
      if (allResolved && allMembers.size > 0) {
        return [...allMembers].join(',');
      }
    }

    const single = this.resolveSingle(category, singers);
    if (single !== null) {
      return single.join(',');
    }

    console.warn(
      `[ParticipationResolver] No match found for category="${category}", singers="${singers}". Returning singers as-is.`
    );
    return singers;
  }

  private static resolveSingle(category: string, singers: string): string[] | null {
    if (UNIT_MEMBERS[singers]) {
      return UNIT_MEMBERS[singers];
    }
    if (UNIT_MEMBERS_BY_CATEGORY[category]?.[singers]) {
      return UNIT_MEMBERS_BY_CATEGORY[category][singers];
    }
    return null;
  }

  static toArray(participations: string): string[] {
    if (!participations) return [];
    return participations.split(',').map((name) => name.trim());
  }

  private static containsCharacter(singers: string): boolean {
    return CHARACTERS.some((char) => singers.includes(char));
  }
}

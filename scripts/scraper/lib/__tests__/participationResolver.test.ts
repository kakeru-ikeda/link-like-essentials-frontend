import { describe, it, expect } from 'vitest';
import { ParticipationResolver } from '../participationResolver';

describe('ParticipationResolver', () => {
  describe('resolve()', () => {
    describe('キャラクター名が直接含まれる場合', () => {
      it('単一キャラ名をそのまま返す', () => {
        expect(ParticipationResolver.resolve('103期', '日野下花帆')).toBe('日野下花帆');
      });

      it('複数キャラ名をそのまま返す', () => {
        expect(ParticipationResolver.resolve('104期', '日野下花帆,乙宗梢')).toBe('日野下花帆,乙宗梢');
      });

      it('セラスを含む場合そのまま返す', () => {
        expect(ParticipationResolver.resolve('105期', 'セラス,桂城泉')).toBe('セラス,桂城泉');
      });
    });

    describe('期に依存しないユニット名', () => {
      it('かほめぐ♡じぇらーと → 花帆+慈', () => {
        const result = ParticipationResolver.resolve('103期', 'かほめぐ♡じぇらーと');
        expect(result).toBe('日野下花帆,藤島慈');
      });

      it('蓮ノ休日 → さやか+梢', () => {
        const result = ParticipationResolver.resolve('104期', '蓮ノ休日');
        expect(result).toBe('村野さやか,乙宗梢');
      });

      it('るりのとゆかいなつづりたち → 瑠璃乃+綴理', () => {
        const result = ParticipationResolver.resolve('105期', 'るりのとゆかいなつづりたち');
        expect(result).toBe('大沢瑠璃乃,夕霧綴理');
      });

      it('Ruri＆To → 瑠璃乃+さやか+小鈴+セラス', () => {
        const result = ParticipationResolver.resolve('105期', 'Ruri＆To');
        expect(result).toBe('大沢瑠璃乃,村野さやか,徒町小鈴,セラス');
      });

      it('PRINCEε>ε> → 姫芽+花帆+吟子+泉', () => {
        const result = ParticipationResolver.resolve('105期', 'PRINCEε>ε>');
        expect(result).toBe('安養寺姫芽,日野下花帆,百生吟子,桂城泉');
      });
    });

    describe('103期ユニット', () => {
      it('蓮ノ空(103期) → 6人', () => {
        const result = ParticipationResolver.resolve('103期', '蓮ノ空');
        const members = result.split(',');
        expect(members).toHaveLength(6);
        expect(members).toContain('日野下花帆');
        expect(members).toContain('藤島慈');
        expect(members).not.toContain('百生吟子'); // 104期以降
      });

      it('スリーズブーケ(103期) → 花帆+梢', () => {
        expect(ParticipationResolver.resolve('103期', 'スリーズブーケ')).toBe('日野下花帆,乙宗梢');
      });

      it('DOLLCHESTRA(103期) → さやか+綴理', () => {
        expect(ParticipationResolver.resolve('103期', 'DOLLCHESTRA')).toBe('村野さやか,夕霧綴理');
      });

      it('みらくらぱーく！(103期) → 瑠璃乃+慈', () => {
        expect(ParticipationResolver.resolve('103期', 'みらくらぱーく！')).toBe('大沢瑠璃乃,藤島慈');
      });
    });

    describe('104期ユニット', () => {
      it('スリーズブーケ(104期) → 花帆+梢+吟子', () => {
        expect(ParticipationResolver.resolve('104期', 'スリーズブーケ')).toBe('日野下花帆,乙宗梢,百生吟子');
      });

      it('DOLLCHESTRA(104期) → さやか+綴理+小鈴', () => {
        expect(ParticipationResolver.resolve('104期', 'DOLLCHESTRA')).toBe('村野さやか,夕霧綴理,徒町小鈴');
      });

      it('みらくらぱーく！(104期) → 瑠璃乃+慈+姫芽', () => {
        expect(ParticipationResolver.resolve('104期', 'みらくらぱーく！')).toBe('大沢瑠璃乃,藤島慈,安養寺姫芽');
      });
    });

    describe('105期ユニット', () => {
      it('蓮ノ空(105期) → 8人（梢・綴理・慈なし）', () => {
        const result = ParticipationResolver.resolve('105期', '蓮ノ空');
        const members = result.split(',');
        expect(members).toHaveLength(8);
        expect(members).not.toContain('乙宗梢');
        expect(members).not.toContain('夕霧綴理');
        expect(members).toContain('桂城泉');
        expect(members).toContain('セラス');
      });

      it('Edel Note(105期) → 泉+セラス', () => {
        expect(ParticipationResolver.resolve('105期', 'Edel Note')).toBe('桂城泉,セラス');
      });
    });

    describe('105期BGP', () => {
      it('蓮ノ空(105期BGP) → 11人', () => {
        const result = ParticipationResolver.resolve('105期BGP', '蓮ノ空');
        const members = result.split(',');
        expect(members).toHaveLength(11);
        expect(members).toContain('乙宗梢');
        expect(members).toContain('セラス');
      });
    });

    describe('マッチしない場合', () => {
      it('未知のユニット名をそのまま返す', () => {
        const result = ParticipationResolver.resolve('103期', '未知のユニット');
        expect(result).toBe('未知のユニット');
      });
    });
  });

  describe('toArray()', () => {
    it('カンマ区切り文字列を配列に変換', () => {
      expect(ParticipationResolver.toArray('日野下花帆,村野さやか,乙宗梢')).toEqual([
        '日野下花帆',
        '村野さやか',
        '乙宗梢',
      ]);
    });

    it('前後スペースをトリム', () => {
      expect(ParticipationResolver.toArray('日野下花帆, 村野さやか')).toEqual([
        '日野下花帆',
        '村野さやか',
      ]);
    });

    it('空文字列で空配列', () => {
      expect(ParticipationResolver.toArray('')).toEqual([]);
    });
  });
});

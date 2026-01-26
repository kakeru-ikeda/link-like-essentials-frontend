import { PublishedDeck } from '@/models/domain/PublishedDeck';
import { PublishedDeckCard } from './PublishedDeckCard';

interface PublishedDeckListProps {
  decks: PublishedDeck[];
  onHashtagSelect?: (tag: string) => void;
}

export const PublishedDeckList: React.FC<PublishedDeckListProps> = ({
  decks,
  onHashtagSelect,
}) => {
  if (decks.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-slate-200 bg-white p-8 text-center text-slate-600">
        公開デッキがまだありません。
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {decks.map((deck) => (
        <PublishedDeckCard
          key={deck.id}
          deck={deck}
          onHashtagSelect={onHashtagSelect}
        />
      ))}
    </div>
  );
};

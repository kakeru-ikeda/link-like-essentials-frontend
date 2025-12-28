'use client';

interface ExportHeaderProps {
  deckName?: string;
  date?: Date;
}

export const ExportHeader: React.FC<ExportHeaderProps> = ({ 
  deckName = 'デッキ', 
  date = new Date() 
}) => {
  const formattedDate = date.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="mb-6 border-b-2 border-slate-300 pb-4">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-semibold text-slate-700">
          {deckName}
        </h1>
        <p className="text-xl text-slate-500">
          {formattedDate}
        </p>
      </div>
    </div>
  );
};

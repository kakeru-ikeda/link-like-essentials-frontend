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
      <h1 className="text-5xl font-bold text-slate-800 mb-2">
        りんく！らいく！デッキビルダー
      </h1>
      <div className="flex items-center justify-between mt-8">
        <h2 className="text-4xl font-semibold text-slate-700">
          {deckName}
        </h2>
        <p className="text-xl text-slate-500">
          {formattedDate}
        </p>
      </div>
    </div>
  );
};

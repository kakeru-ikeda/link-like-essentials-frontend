'use client';

interface ExportFooterProps {
  generatedAt?: Date;
}

export const ExportFooter: React.FC<ExportFooterProps> = ({ 
  generatedAt = new Date() 
}) => {
  const formattedDateTime = generatedAt.toLocaleString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="mt-6 pt-4 border-t-2 border-slate-300 text-center">
      <p className="text-xs text-slate-400">
        © 2025 Link-Like Essentials - Deck Builder
      </p>
    </div>
  );
};

'use client';

import { ExportHeader } from './ExportHeader';
import { ExportFooter } from './ExportFooter';
import { ExportDeckBuilder } from './ExportDeckBuilder';
import { ExportDashboard } from './ExportDashboard';
import { useDeck } from '@/hooks/useDeck';

interface DeckExportViewProps {
  showLimitBreak?: boolean;
}

export const DeckExportView: React.FC<DeckExportViewProps> = ({ showLimitBreak = true }) => {
  const { deck } = useDeck();
  
  return (
    <div 
      className="bg-gradient-to-br from-slate-50 to-slate-100 p-8"
      style={{ 
        letterSpacing: '0',
        lineHeight: '1.5',
      }}
    >
      <ExportHeader deckName={deck?.name} />
      
      <div className="mb-8 bg-white rounded-lg shadow-lg p-6">
        <ExportDeckBuilder showLimitBreak={showLimitBreak} />
      </div>
      
      <div className="bg-white rounded-lg shadow-lg p-6">
        <ExportDashboard />
      </div>
      
      <ExportFooter />
    </div>
  );
};

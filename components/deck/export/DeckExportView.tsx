'use client';

import { ExportHeader } from './ExportHeader';
import { ExportFooter } from './ExportFooter';
import { ExportDeckBuilder } from './ExportDeckBuilder';
import { ExportDashboard } from './ExportDashboard';
import { useDeck } from '@/hooks/useDeck';

const EXPORT_VIEW_WIDTH = 1700;

interface DeckExportViewProps {
  captureRef?: React.Ref<HTMLDivElement>;
  builderCaptureRef?: React.Ref<HTMLDivElement>;
}

export const DeckExportView: React.FC<DeckExportViewProps> = ({ captureRef, builderCaptureRef }) => {
  const { deck } = useDeck();
  
  return (
    <div 
      className="bg-gradient-to-br from-slate-50 to-slate-100 p-8 flex flex-col gap-8 flex-none"
      ref={captureRef}
      style={{ 
        letterSpacing: '0',
        lineHeight: '1.5',
        width: `${EXPORT_VIEW_WIDTH}px`,
        minWidth: `${EXPORT_VIEW_WIDTH}px`,
        maxWidth: `${EXPORT_VIEW_WIDTH}px`,
      }}
    >
      <ExportHeader deckName={deck?.name} />
      
      <div className="mb-8 bg-white rounded-lg shadow-lg p-6">
        <ExportDeckBuilder captureRef={builderCaptureRef} />
      </div>
      
      <div className="bg-white rounded-lg shadow-lg p-6">
        <ExportDashboard />
      </div>
      
      <ExportFooter />
    </div>
  );
};

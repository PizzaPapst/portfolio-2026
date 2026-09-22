import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Close } from '@carbon/icons-react';
import IconButton from './IconButton';

/**
 * Carousel Komponente
 * 
 * Zeigt eine Bildgalerie mit:
 * - 100% Breite
 * - Pfeilbuttons (Vor / Zurück)
 * - Zentrierter Leiste unter dem Bild mit Zähler und Label-Text
 * - Lupe bei Hover (cursor-zoom-in) und Klick für Vollbildansicht (Lightbox)
 * - Tastatur-Navigation (Pfeiltasten & ESC)
 * 
 * @param {Object} props
 * @param {string[]} props.images - Array mit Bild-URLs
 * @param {string[]|string} [props.altTexts] - Alt-Texte der Bilder
 * @param {string[]|string} [props.labels] - Label-Texte der Bilder
 */
export default function Carousel({ images = [], altTexts = [], labels = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Vorheriges Bild
  const handlePrev = useCallback(() => {
    if (images.length <= 1) return;
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  // Nächstes Bild
  const handleNext = useCallback(() => {
    if (images.length <= 1) return;
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  // Scroll-Lock für den Body während der Vollbildansicht
  useEffect(() => {
    if (!isLightboxOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isLightboxOpen]);

  // Tastatursteuerung für Pfeiltasten & Escape (auch im Vollbild)
  useEffect(() => {
    if (!images || images.length === 0) return;

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'Escape' && isLightboxOpen) {
        setIsLightboxOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, images, handlePrev, handleNext]);

  // Wenn keine Bilder vorhanden sind, nichts rendern
  if (!images || images.length === 0) {
    return null;
  }

  // Hilfsfunktion zum flexiblen Auflösen von Arrays, Objekten oder JSON-Strings
  const parseList = (val) => {
    if (!val) return [];
    if (Array.isArray(val)) return val;
    if (typeof val === 'object') {
      if (Array.isArray(val.labels)) return val.labels;
      if (Array.isArray(val.texts)) return val.texts;
      if (Array.isArray(val.items)) return val.items;
      return Object.values(val);
    }
    if (typeof val === 'string') {
      const trimmed = val.trim();
      if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
        try {
          const parsed = JSON.parse(trimmed);
          return parseList(parsed);
        } catch {
          // Fallback als normaler String
        }
      }
    }
    return val;
  };

  // Hilfsfunktion für den passenden Label-Text
  const getLabel = (index) => {
    const list = parseList(labels);
    if (Array.isArray(list) && list[index]) return list[index];
    if (typeof list === 'string' && list) return list;

    const altList = parseList(altTexts);
    if (Array.isArray(altList) && altList[index]) return altList[index];
    if (typeof altList === 'string' && altList) return altList;
    return '';
  };

  // Hilfsfunktion für den passenden Alt-Text
  const getAlt = (index) => {
    const altList = parseList(altTexts);
    if (Array.isArray(altList) && altList[index]) return altList[index];
    if (typeof altList === 'string' && altList) return altList;

    const list = parseList(labels);
    if (Array.isArray(list) && list[index]) return list[index];
    if (typeof list === 'string' && list) return list;
    return `Bild ${index + 1}`;
  };

  return (
    <div className="w-full flex flex-col items-center select-none">
      {/* Hauptbereich des Carousels (100% Breite) */}
      <div className="relative w-full flex items-center justify-center bg-background-subtle/50 overflow-hidden group">
        {/* Bild mit Lupen-Cursor bei Hover */}
        <img
          src={images[currentIndex]}
          alt={getAlt(currentIndex)}
          onClick={() => setIsLightboxOpen(true)}
          className="w-full max-h-[640px] object-contain cursor-zoom-in"
        />

        {/* Pfeilbutton: Zurück (nur wenn mehr als 1 Bild vorhanden ist) */}
        {images.length > 1 && (
          <IconButton
            size="large"
            variant="secondary"
            onClick={handlePrev}
            aria-label="Vorheriges Bild"
            className="absolute left-4 top-1/2 -translate-y-1/2 shadow-md"
          >
            <ChevronLeft />
          </IconButton>
        )}

        {/* Pfeilbutton: Weiter (nur wenn mehr als 1 Bild vorhanden ist) */}
        {images.length > 1 && (
          <IconButton
            size="large"
            variant="secondary"
            onClick={handleNext}
            aria-label="Nächstes Bild"
            className="absolute right-4 top-1/2 -translate-y-1/2 shadow-md"
          >
            <ChevronRight />
          </IconButton>
        )}
      </div>

      {/* Leiste unter dem Bild: Bildzähler links, Label mittig zentriert */}
      {(images.length > 1 || getLabel(currentIndex)) && (
        <div className="relative w-full flex items-center justify-center mt-3 text-small min-h-[24px]">
          {images.length > 1 && (
            <span className="absolute left-0 font-medium text-text-subtle tracking-wider select-none shrink-0">
              {String(currentIndex + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
            </span>
          )}
          {getLabel(currentIndex) && (
            <span className="font-medium text-text-default text-center px-16 truncate max-w-[80%]">
              {getLabel(currentIndex)}
            </span>
          )}
        </div>
      )}

      {/* Vollbild-Modal (Lightbox - Option 1: Helle Galerie) */}
      {isLightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setIsLightboxOpen(false)}
          className="fixed inset-0 z-50 flex flex-col bg-background-default/95 backdrop-blur-md transition-all duration-200"
        >
          {/* Header: Zähler links, Label exakt mittig, Schließen rechts */}
          <header
            onClick={(e) => e.stopPropagation()}
            className="relative flex items-center justify-between px-6 py-4 border-b border-accent-subtle shrink-0 min-h-[72px]"
          >
            {/* Links: Zähler */}
            <div className="flex items-center shrink-0 z-10">
              {images.length > 1 && (
                <span className="text-small font-medium text-text-subtle tracking-wider">
                  {String(currentIndex + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
                </span>
              )}
            </div>

            {/* Mitte: Exakt zentriertes Label */}
            {(getLabel(currentIndex) || getAlt(currentIndex)) && (
              <div className="absolute inset-x-0 flex items-center justify-center pointer-events-none px-24 sm:px-36">
                <span className="text-small font-medium text-text-default truncate pointer-events-auto">
                  {getLabel(currentIndex) || getAlt(currentIndex)}
                </span>
              </div>
            )}

            {/* Rechts: ESC & Schließen-Button */}
            <div className="flex items-center gap-3 shrink-0 z-10 ml-auto">
              <span className="text-small text-text-subtle select-none tracking-wider hidden sm:inline-block">
                ESC
              </span>
              <IconButton
                size="large"
                variant="secondary"
                onClick={() => setIsLightboxOpen(false)}
                aria-label="Vollbildansicht schließen"
                className="shadow-sm"
              >
                <Close />
              </IconButton>
            </div>
          </header>

          {/* Zentraler Bild-Bereich */}
          <div
            onClick={() => setIsLightboxOpen(false)}
            className="flex-1 relative flex items-center justify-center p-4 sm:p-10 min-h-0 overflow-hidden"
          >
            {/* Pfeilbutton: Zurück */}
            {images.length > 1 && (
              <IconButton
                size="large"
                variant="secondary"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrev();
                }}
                aria-label="Vorheriges Bild"
                className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 shadow-lg z-10"
              >
                <ChevronLeft />
              </IconButton>
            )}

            {/* Bild */}
            <img
              src={images[currentIndex]}
              alt={getAlt(currentIndex)}
              onClick={(e) => {
                e.stopPropagation();
                setIsLightboxOpen(false);
              }}
              className="max-w-full max-h-[82vh] object-contain cursor-zoom-out select-none shadow-2xl border border-accent-subtle bg-background-default"
            />

            {/* Pfeilbutton: Weiter */}
            {images.length > 1 && (
              <IconButton
                size="large"
                variant="secondary"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                aria-label="Nächstes Bild"
                className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 shadow-lg z-10"
              >
                <ChevronRight />
              </IconButton>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

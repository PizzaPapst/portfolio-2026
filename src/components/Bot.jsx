import { useState, useRef, useEffect } from 'react';
import { Close } from '@carbon/icons-react';
import TextArea from './TextArea';
import IconButton from './IconButton';
import { sendMessage } from '../services/bot';

/**
 * Bot Komponente mit Chunk-Navigation
 * 
 * Zeigt Konversations-Chunks (1 Frage + 1 Antwort) mit Scroll-Snap.
 * Der neueste Chunk steht immer ganz oben (Index 0).
 * Die Rechteck-Indikatoren liegen in einem fest reservierten Bereich rechts.
 * 
 * @param {Object} props
 * @param {() => void} [props.onClose] - Callback zum Schließen des Bots
 */
export default function Bot({ onClose }) {
  const [input, setInput] = useState('');
  const [chunks, setChunks] = useState([]);
  const [activeChunkIndex, setActiveChunkIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const scrollContainerRef = useRef(null);
  const activeChunkIndexRef = useRef(activeChunkIndex);
  const chunksRef = useRef(chunks);
  const isWheelingRef = useRef(false);

  useEffect(() => {
    activeChunkIndexRef.current = activeChunkIndex;
    chunksRef.current = chunks;
  }, [activeChunkIndex, chunks]);

  // Scrollt pixelgenau zum gewünschten Chunk
  const scrollToChunk = (index) => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    container.scrollTo({
      top: index * container.clientHeight,
      behavior: 'smooth',
    });
    setActiveChunkIndex(index);
  };

  // Erkennt beim manuellen Scrollen (Mausrad/Trackpad), welcher Chunk aktiv ist
  const handleScroll = (e) => {
    const container = e.currentTarget;
    if (container.clientHeight === 0) return;
    const newIndex = Math.round(container.scrollTop / container.clientHeight);
    if (newIndex !== activeChunkIndex && newIndex >= 0 && newIndex < chunks.length) {
      setActiveChunkIndex(newIndex);
    }
  };

  // Erlaubt das Scrollen zwischen Chunks über das Mausrad auf dem gesamten Container
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const onWheel = (e) => {
      let target = e.target;
      let canScrollTarget = false;

      // Prüfen, ob der Cursor über einem Element liegt, das selbst scrollbaren Text hat (z. B. lange Antwort)
      while (target && target !== container) {
        const hasOverflow = target.scrollHeight > target.clientHeight + 2;
        const style = window.getComputedStyle(target);
        const isScrollable = style.overflowY === 'auto' || style.overflowY === 'scroll';

        if (hasOverflow && isScrollable) {
          const isScrollingDown = e.deltaY > 0;
          const isAtBottom = Math.ceil(target.scrollTop + target.clientHeight) >= target.scrollHeight - 2;
          const isAtTop = target.scrollTop <= 2;

          // Nur wenn das Element in die gewünschte Richtung noch scrollen kann:
          if ((isScrollingDown && !isAtBottom) || (!isScrollingDown && !isAtTop)) {
            canScrollTarget = true;
            break;
          }
        }
        target = target.parentElement;
      }

      // Wenn das innere Textelement selbst noch Platz zum Scrollen hat, lassen wir es normal scrollen
      if (canScrollTarget) return;

      // Ansonsten: Chunk-Wechsel auf dem gesamten Container ausführen
      if (Math.abs(e.deltaY) > 15) {
        if (isWheelingRef.current) {
          e.preventDefault();
          return;
        }

        const currentIndex = activeChunkIndexRef.current;
        const totalChunks = chunksRef.current.length;

        if (e.deltaY > 0 && currentIndex < totalChunks - 1) {
          e.preventDefault();
          isWheelingRef.current = true;
          scrollToChunk(currentIndex + 1);
          setTimeout(() => {
            isWheelingRef.current = false;
          }, 350);
        } else if (e.deltaY < 0 && currentIndex > 0) {
          e.preventDefault();
          isWheelingRef.current = true;
          scrollToChunk(currentIndex - 1);
          setTimeout(() => {
            isWheelingRef.current = false;
          }, 350);
        }
      }
    };

    container.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      container.removeEventListener('wheel', onWheel);
    };
  }, [chunks.length]);

  const handleSend = async () => {
    const textToSend = input.trim();
    if (!textToSend || isLoading) return;

    const chunkId = Date.now();
    const newChunk = {
      id: chunkId,
      question: textToSend,
      answer: '',
      isLoading: true,
    };

    // 1. Neuesten Chunk ganz oben (Index 0) einfügen
    setChunks((prev) => [newChunk, ...prev]);
    setActiveChunkIndex(0);
    setInput('');
    setIsLoading(true);

    // 2. Sofort nach ganz oben auf den soeben erstellten Chunk springen
    setTimeout(() => {
      scrollToChunk(0);
    }, 20);

    try {
      // 3. Bot-API aufrufen
      const response = await sendMessage(textToSend);

      const botText =
        typeof response === 'string'
          ? response
          : response?.output ||
          response?.message ||
          response?.response ||
          response?.text ||
          (response ? JSON.stringify(response) : 'Keine Antwort erhalten.');

      // 4. Antwort in den entsprechenden Chunk einpflegen
      setChunks((prev) =>
        prev.map((chunk) =>
          chunk.id === chunkId
            ? { ...chunk, answer: botText, isLoading: false }
            : chunk
        )
      );
    } catch (error) {
      console.error(error);
      setChunks((prev) =>
        prev.map((chunk) =>
          chunk.id === chunkId
            ? {
              ...chunk,
              answer: 'Entschuldigung, beim Verbindungsaufbau ist ein Fehler aufgetreten.',
              isLoading: false,
            }
            : chunk
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col bg-background-default border border-accent-subtle w-full max-w-[680px] shadow-2xl transition-all">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-accent-subtle">
        <h2 className="text-h4 font-bold text-headline-default">Maik-Bot</h2>
        <IconButton
          size="small"
          variant="tertiary"
          onClick={onClose}
          aria-label="Dialog schließen"
        >
          <Close />
        </IconButton>
      </header>

      {/* Hauptbereich */}
      <div className="p-6 flex flex-col gap-6">
        {/* Eingabefeld */}
        <TextArea
          value={input}
          onChange={setInput}
          onSubmit={handleSend}
          placeholder="Ask about my design process..."
          disabled={isLoading}
          autoFocus
          aria-label="Nachricht an Maik-Bot eingeben"
        />

        {/* Chunks-Bereich mit fest reserviertem Platz rechts für die Indikatoren */}
        {chunks.length > 0 && (
          <div className="relative pr-7">
            {/* Scroll-Container für Chunks mit CSS Scroll-Snap */}
            <div
              ref={scrollContainerRef}
              onScroll={handleScroll}
              className="h-[340px] overflow-y-auto snap-y snap-mandatory flex flex-col [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            >
              {chunks.map((chunk) => (
                <div
                  key={chunk.id}
                  className="h-[340px] shrink-0 snap-start snap-always flex flex-col gap-3 pb-2"
                >
                  {/* Frage des Nutzers: begrenzt auf max-h-[96px], damit immer genug Raum für die Antwort bleibt */}
                  <div className="bg-background-subtle p-4 text-body text-text-default shrink-0 max-h-[96px] overflow-y-auto [scrollbar-width:thin] [scrollbar-color:var(--color-accent)_transparent]">
                    {chunk.question}
                  </div>

                  {/* Antwort des Bots: füllt den gesamten restlichen Bereich und scrollt bei Bedarf */}
                  <div className="flex-1 min-h-0 flex flex-col pt-1">
                    <div className="overflow-y-auto flex-1 pr-2 text-body leading-body text-text-default whitespace-pre-wrap [scrollbar-width:thin] [scrollbar-color:var(--color-accent)_transparent]">
                      {chunk.isLoading ? (
                        <div className="text-small text-text-subtle italic flex items-center gap-2">
                          <span className="inline-block w-2 h-2 rounded-full bg-accent animate-pulse" />
                          Maik-Bot antwortet...
                        </div>
                      ) : (
                        chunk.answer
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Vertikaler Indikator (Rechtecke) außerhalb des Textes im reservierten rechten Bereich */}
            <nav
              aria-label="Chunk Navigation"
              className="absolute right-0 top-3 flex flex-col items-center gap-1.5 select-none shrink-0"
            >
              {chunks.map((_, idx) => {
                const isActive = activeChunkIndex === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => scrollToChunk(idx)}
                    aria-label={`Gehe zu Chunk ${idx + 1}`}
                    aria-current={isActive ? 'step' : undefined}
                    className={`w-3 h-3 transition-colors cursor-pointer ${isActive
                      ? 'bg-headline-default border border-headline-default'
                      : 'border border-accent-purple/60 hover:border-headline-default bg-transparent'
                      }`}
                  />
                );
              })}
            </nav>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="px-6 py-4 border-t border-accent-subtle flex items-center justify-between">
        <span className="text-small text-text-default select-none tracking-wider">ESC</span>
      </footer>
    </div>
  );
}

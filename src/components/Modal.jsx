import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

const FOCUSABLE_SELECTORS =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Modal / Overlay Komponente
 * 
 * Dient als modale Basis (Backdrop + Container) für Dialoge, SideSheets, BottomSheets etc.
 * Verhindert das Verlassen des Modals per Tabulator (Focus Trap) und stellt den Fokus beim Schließen wieder her.
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Gibt an, ob das Modal sichtbar ist
 * @param {() => void} props.onClose - Callback beim Schließen (Klick auf Backdrop oder Esc)
 * @param {React.ReactNode} props.children - Der Inhalt (Dialog, Sheet, etc.)
 * @param {boolean} [props.closeOnBackdropClick=true] - Ob Klick auf den Hintergrund schließt
 * @param {boolean} [props.closeOnEsc=true] - Ob die Escape-Taste schließt
 * @param {'center' | 'right' | 'bottom' | 'custom'} [props.position='center'] - Ausrichtung des Inhalts
 * @param {string} [props.className] - Zusätzliche Klassen für das Backdrop-Element
 * @param {string} [props.containerClassName] - Zusätzliche Klassen für den Inhalts-Wrapper
 */
export default function Modal({
  isOpen,
  onClose,
  children,
  closeOnBackdropClick = true,
  closeOnEsc = true,
  position = 'center',
  className = '',
  containerClassName = '',
  ...props
}) {
  const contentRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    // 1. Vorheriges fokussiertes Element merken (zur Wiederherstellung beim Schließen)
    const previousActiveElement = document.activeElement;

    // 2. Scroll-Lock für den Body
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // 3. Initialen Fokus setzen (bevorzugt Textareas, Inputs oder [autofocus], sonst erstes fokussierbares Element)
    const focusTimeout = setTimeout(() => {
      if (!contentRef.current) return;
      const primaryFocusEl = contentRef.current.querySelector(
        '[autofocus], [data-autofocus], textarea:not([disabled]), input:not([disabled])'
      );
      if (primaryFocusEl) {
        primaryFocusEl.focus();
        return;
      }

      const focusable = contentRef.current.querySelectorAll(FOCUSABLE_SELECTORS);
      if (focusable && focusable.length > 0) {
        focusable[0].focus();
      }
    }, 60);

    // 4. Focus Trap & Escape-Key Listener
    const handleKeyDown = (e) => {
      if (closeOnEsc && e.key === 'Escape') {
        onClose?.();
        return;
      }

      if (e.key === 'Tab' && contentRef.current) {
        const focusable = Array.from(
          contentRef.current.querySelectorAll(FOCUSABLE_SELECTORS)
        ).filter((el) => el.offsetParent !== null); // nur sichtbare Elemente

        if (focusable.length === 0) {
          e.preventDefault();
          return;
        }

        const firstElement = focusable[0];
        const lastElement = focusable[focusable.length - 1];

        // Falls der Fokus aus Versehen außerhalb des Modals gelangt ist
        if (!contentRef.current.contains(document.activeElement)) {
          e.preventDefault();
          firstElement.focus();
          return;
        }

        if (e.shiftKey) {
          // Shift + Tab: wenn auf erstem Element -> springe zum letzten
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          // Tab: wenn auf letztem Element -> springe zum ersten
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(focusTimeout);
      document.body.style.overflow = originalOverflow;
      document.removeEventListener('keydown', handleKeyDown);

      // Fokus an das auslösende Element zurückgeben
      if (previousActiveElement && typeof previousActiveElement.focus === 'function') {
        previousActiveElement.focus();
      }
    };
  }, [isOpen, onClose, closeOnEsc]);

  if (!isOpen) return null;

  // Ausrichtung des Inhalts (Center für Dialog, Right für SideSheet, Bottom für BottomSheet)
  const positionClasses = {
    center: 'items-center justify-center p-4',
    right: 'items-stretch justify-end',
    bottom: 'items-end justify-center',
    custom: '',
  };

  const selectedPosition = positionClasses[position] ?? positionClasses.center;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      onClick={closeOnBackdropClick ? onClose : undefined}
      className={`fixed inset-0 z-50 flex bg-black/5 backdrop-blur-[4px] transition-all ${selectedPosition} ${className}`.trim()}
      {...props}
    >
      {/* Verhindert, dass Klicks im Inhalt das Backdrop-Schließen auslösen */}
      <div
        ref={contentRef}
        onClick={(e) => e.stopPropagation()}
        className={containerClassName}
      >
        {children}
      </div>
    </div>,
    document.body
  );
}

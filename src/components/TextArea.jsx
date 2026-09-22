import { useRef, useEffect } from 'react';
import { SendAlt } from '@carbon/icons-react';

/**
 * TextArea Komponente mit integriertem Send-Button
 * 
 * @param {Object} props
 * @param {string} props.value - Der aktuelle Textwert
 * @param {(val: string) => void} props.onChange - Event-Handler bei Textänderung
 * @param {() => void} [props.onSubmit] - Event-Handler beim Absenden (Klick auf Icon oder Enter)
 * @param {string} [props.placeholder] - Platzhaltertext
 * @param {boolean} [props.disabled] - Deaktiviert das Eingabefeld
 * @param {string} [props.className] - Optionale zusätzliche Tailwind-Klassen
 */
export default function TextArea({
  value,
  onChange,
  onSubmit,
  placeholder = 'Frag nach meinem Designprozess...',
  disabled = false,
  className = '',
  autoFocus = false,
  ...props
}) {
  const textareaRef = useRef(null);

  // Fokus direkt auf die Textarea setzen bei autoFocus
  useEffect(() => {
    if (autoFocus && textareaRef.current) {
      const timer = setTimeout(() => {
        textareaRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [autoFocus]);

  // Auto-Resize der Texthöhe (maximal 90px) & Scrollbalken erst ab 90px
  useEffect(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = 'auto';
      const newHeight = Math.min(el.scrollHeight, 90);
      el.style.height = `${newHeight}px`;
      el.style.overflowY = el.scrollHeight > 90 ? 'auto' : 'hidden';
    }
  }, [value]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (value.trim() && onSubmit) {
        onSubmit();
      }
    }
  };

  return (
    <div
      className={`relative flex items-center border border-accent bg-background-default transition-colors focus-within:shadow-[inset_0_-1px_0_0_var(--color-accent)] ${className}`.trim()}
    >
      <textarea
        ref={textareaRef}
        rows={1}
        value={value}
        disabled={disabled}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        data-autofocus={autoFocus ? true : undefined}
        className="w-full resize-none py-4 pl-4 pr-12 text-body leading-body text-text-default placeholder:text-text-subtle bg-transparent outline-none overflow-hidden hover:bg-accent/5 active:bg-accent/10"
        {...props}
      />
      <button
        type="button"
        disabled={disabled || !value.trim()}
        onClick={onSubmit}
        aria-label="Nachricht senden"
        className="absolute right-3.5 p-1 text-text-default hover:text-headline-default disabled:text-text-subtle disabled:cursor-not-allowed cursor-pointer transition-colors"
      >
        <SendAlt size="24" />
      </button>
    </div>
  );
}

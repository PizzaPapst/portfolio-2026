/**
 * IconButton Komponente
 * 
 * Ein quadratischer Button speziell für Icons in drei Größen (small, medium, large)
 * und drei visuellen Varianten (primary, secondary, tertiary/ghost).
 * Das Icon wird als Child übergeben und besitzt immer eine feste Größe von 20px.
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Das Icon (z. B. aus @carbon/icons-react oder beliebiges SVG/Element)
 * @param {'small' | 'medium' | 'large'} [props.size='medium'] - Größe des Buttons (Padding 4px, 8px oder 12px)
 * @param {'primary' | 'secondary' | 'tertiary' | 'ghost' | 'outline'} [props.variant='primary'] - Visueller Stil
 * @param {() => void} [props.onClick] - Klick-Handler
 * @param {boolean} [props.disabled=false] - Deaktiviert den Button
 * @param {'button' | 'submit' | 'reset'} [props.type='button'] - HTML Button-Typ
 * @param {string} [props.ariaLabel] - Barrierefreie Beschriftung (aria-label)
 * @param {string} [props.className] - Optionale zusätzliche Tailwind-Klassen
 */
export default function IconButton({
  children,
  size = 'medium',
  variant = 'primary',
  onClick,
  disabled = false,
  type = 'button',
  ariaLabel,
  'aria-label': ariaLabelProp,
  className = '',
  ...props
}) {
  // Padding & Abmessungen:
  // small:  4px Padding (p-1)   -> Gesamtgröße 28x28px bei 20px Icon
  // medium: 8px Padding (p-2)   -> Gesamtgröße 36x36px bei 20px Icon
  // large:  12px Padding (p-3)  -> Gesamtgröße 44x44px bei 20px Icon
  const sizeClasses = {
    small: 'w-7 h-7 p-1',
    medium: 'w-9 h-9 p-2',
    meidum: 'w-9 h-9 p-2', // Fallback für Tippfehler
    large: 'w-11 h-11 p-3',
  };

  // Visuelle Varianten und Hover-Zustände (orientiert an Primary- & SecondaryButton)
  const variantClasses = {
    primary:
      'bg-primary border-2 border-primary text-text-inverted hover:opacity-90 active:opacity-100',
    secondary:
      'border-2 border-primary text-primary bg-background-default hover:bg-background-elevated active:bg-background-subtle',
    outline:
      'border-2 border-primary text-primary bg-background-default hover:bg-background-elevated active:bg-background-subtle',
    tertiary:
      'border-2 border-transparent text-primary bg-transparent hover:bg-primary/5 active:bg-primary/10',
    ghost:
      'border-2 border-transparent text-primary bg-transparent hover:bg-primary/5 active:bg-primary/10',
  };

  const selectedSize = sizeClasses[size] || sizeClasses.medium;
  const selectedVariant = variantClasses[variant] || variantClasses.primary;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabelProp || ariaLabel}
      className={`inline-flex items-center justify-center shrink-0 cursor-pointer transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed ${selectedSize} ${selectedVariant} ${className}`.trim()}
      {...props}
    >
      <span className="inline-flex items-center justify-center w-5 h-5 shrink-0 [&>svg]:w-5 [&>svg]:h-5 [&>svg]:shrink-0 pointer-events-none">
        {children}
      </span>
    </button>
  );
}

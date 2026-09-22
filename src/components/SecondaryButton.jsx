/**
 * SecondaryButton Komponente (Outline Button)
 *
 * @param {Object} props
 * @param {string} [props.label] - Der Text des Buttons
 * @param {React.ReactNode} [props.children] - Alternativ als Kind-Element
 * @param {() => void} [props.onClick] - Klick-Handler
 * @param {React.ReactNode} [props.icon] - Optionales Icon
 * @param {string} [props.className] - Optionale zusätzliche Tailwind-Klassen
 * @param {'button' | 'submit' | 'reset'} [props.type] - HTML Button-Type
 */
export default function SecondaryButton({
  label,
  children,
  onClick,
  icon = null,
  className = '',
  type = 'button',
  ...props
}) {
  const content = children ?? label;

  return (
    <button
      type={type}
      onClick={onClick}
      className={`group inline-flex items-center justify-center h-14 gap-2 px-6 border-2 border-primary text-primary bg-transparent text-base font-medium whitespace-nowrap cursor-pointer transition-all duration-200 ease-out hover:bg-primary/5 active:bg-primary/10 ${className}`.trim()}
      {...props}
    >
      <span className="underline decoration-1 decoration-transparent underline-offset-8 group-hover:decoration-current group-hover:underline-offset-4 transition-all duration-200 ease-out">
        {content}
      </span>
      {icon && <span className="inline-flex items-center">{icon}</span>}
    </button>
  );
}

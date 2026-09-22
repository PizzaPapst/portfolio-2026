/**
 * PrimaryButton Komponente
 * 
 * @param {Object} props
 * @param {string} [props.label] - Der Text des Buttons
 * @param {React.ReactNode} [props.children] - Alternativ als Kind-Element
 * @param {() => void} [props.onClick] - Klick-Handler
 * @param {string} [props.href] - Optionale URL oder mailto-Link (rendert automatisch als <a>)
 * @param {React.ElementType} [props.as] - Beliebiges HTML-Element oder React-Komponente
 * @param {React.ReactNode} [props.icon] - Optionales Icon (als React Node)
 * @param {string} [props.className] - Optionale zusätzliche Tailwind-Klassen
 * @param {'button' | 'submit' | 'reset'} [props.type] - HTML Button-Type
 */
export default function PrimaryButton({
  label,
  children,
  onClick,
  href,
  as,
  icon = null,
  className = '',
  type = 'button',
  ...props
}) {
  const content = children ?? label;
  const Component = as || (href ? 'a' : 'button');

  return (
    <Component
      type={Component === 'button' ? type : undefined}
      href={href}
      onClick={onClick}
      className={`group inline-flex items-center justify-center h-14 gap-2 px-6 bg-primary text-text-inverted text-base font-medium whitespace-nowrap transition-all duration-200 ease-out hover:opacity-90 active:opacity-100 cursor-pointer ${className}`.trim()}
      {...props}
    >
      {icon && <span className="inline-flex items-center">{icon}</span>}
      <span className="underline decoration-transparent underline-offset-8 group-hover:decoration-current group-hover:underline-offset-4 transition-all duration-200 ease-out">
        {content}
      </span>
    </Component>
  );
}

import { Link as RouterLink } from 'react-router-dom';

/**
 * Link Komponente (Grundgerüst)
 *
 * Leitet flexibel zu internen Routen (via React Router) oder
 * externen URLs (via standard <a> Tag) weiter.
 *
 * @param {Object} props
 * @param {string} props.to - Ziel-Pfad oder URL (z. B. "/about", "https://github.com", "mailto:...")
 * @param {string} [props.href] - Alternative zu `to`
 * @param {React.ReactNode} [props.children] - Link-Text oder Elemente
 * @param {string} [props.label] - Optionaler Fallback-Text, falls kein `children` übergeben wird
 * @param {React.ReactNode} [props.icon] - Optionales Icon auf der linken Seite
 * @param {string} [props.className] - Deine Tailwind- / CSS-Klassen zum Stylen
 * @param {string} [props.target] - Optionales Target (z. B. "_blank")
 * @param {string} [props.rel] - Optionales rel-Attribut
 * @param {string|boolean} [props.download] - Download-Attribut für Dateidownloads
 */
export default function Link({
  to,
  href,
  children,
  label,
  icon = null,
  className = '',
  target,
  rel,
  download,
  ...props
}) {
  const destination = to || href || '#';
  const content = children ?? label;

  // Prüft, ob es sich um einen externen Link oder ein Protokoll handelt
  const isExternal =
    typeof destination === 'string' &&
    (destination.startsWith('http://') ||
      destination.startsWith('https://') ||
      destination.startsWith('//') ||
      destination.startsWith('mailto:') ||
      destination.startsWith('tel:') ||
      Boolean(download));

  // Grundlegendes Styling - mit Icon als group flex, sonst inline text-underline
  const baseStyles = icon
    ? `group inline-flex items-center gap-2.5 cursor-pointer text-primary transition-all duration-200`
    : `cursor-pointer text-primary underline decoration-transparent underline-offset-8 hover:decoration-current hover:underline-offset-4 transition-all duration-200`;

  const combinedClassName = `${baseStyles} ${className}`.trim();

  const renderedContent = icon ? (
    <>
      <span className="inline-flex items-center shrink-0" aria-hidden="true">
        {icon}
      </span>
      <span className="underline decoration-transparent underline-offset-8 group-hover:decoration-current group-hover:underline-offset-4 transition-all duration-200">
        {content}
      </span>
    </>
  ) : (
    content
  );

  if (isExternal) {
    return (
      <a
        href={destination}
        className={combinedClassName}
        target={download ? undefined : (target ?? '_blank')}
        rel={rel ?? 'noopener noreferrer'}
        download={download}
        {...props}
      >
        {renderedContent}
      </a>
    );
  }

  return (
    <RouterLink
      to={destination}
      className={combinedClassName}
      target={target}
      rel={rel}
      download={download}
      {...props}
    >
      {renderedContent}
    </RouterLink>
  );
}

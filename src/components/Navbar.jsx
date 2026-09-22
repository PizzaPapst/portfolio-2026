import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import PrimaryButton from './PrimaryButton';

/**
 * Hilfskomponente für Navigations-Links mit vordefinierten Tailwind-Klassen.
 * Behandelt automatisch aktive und inaktive Zustände.
 */
export function NavItem({ to, children, className = '', ...props }) {
  const baseStyles = 'group relative inline-flex items-center h-14 text-base font-medium px-4 cursor-pointer';
  const inactiveStyles = 'text-text-subtle hover:text-text-default transition-colors duration-200 ease-out';
  const activeStyles = 'text-primary';

  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `${baseStyles} ${isActive ? activeStyles : inactiveStyles} ${className}`.trim()
      }
      {...props}
    >
      {({ isActive }) => (
        <>
          <span className="inline-grid items-center text-center">
            {/* Reserviert unsichtbar die Breite des fettgedruckten Textes */}
            <span className="col-start-1 row-start-1 font-semibold invisible select-none pointer-events-none" aria-hidden="true">
              {children}
            </span>
            {/* Sichtbarer Text: kein Breiten-Sprung mehr */}
            <span
              className={`col-start-1 row-start-1 ${isActive ? 'font-semibold' : 'font-medium'
                }`}
            >
              {children}
            </span>
          </span>

          {/* Aktiver Unterstrich (4px): Erscheint/verschwindet beim Switch instant ohne Animation */}
          {isActive && (
            <span className="absolute bottom-0 left-0 right-0 h-1 bg-primary" />
          )}

          {/* Hover-Unterstrich (2px): Nur bei inaktiven Links aktiv mit sanfter Hover-Animation */}
          {!isActive && (
            <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary opacity-0 translate-y-0.5 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 ease-out pointer-events-none" />
          )}
        </>
      )}
    </NavLink>
  );
}

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${isScrolled
          ? 'bg-background-default/90 backdrop-blur-md border-b border-background-elevated'
          : 'bg-background-default/80 backdrop-blur-sm border-b border-transparent'
        }`}
    >
      <nav className="px-8 py-4 flex justify-center">
        <div className="max-w-[1000px] flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <NavItem to="/" end>
              Home
            </NavItem>
            <NavItem to="/about">
              About me
            </NavItem>
            {/* <NavItem to="/case-study/example">
            Case Study
          </NavItem> */}
          </div>

          <PrimaryButton
            href="mailto:maik.bartels2@gmail.com"
            label="Get in Touch"
          />
        </div>
      </nav>
    </header>
  );
}

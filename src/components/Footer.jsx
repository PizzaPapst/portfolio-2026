import Link from './Link';

/**
 * Footer Komponente (Grundgerüst)
 *
 * Struktur:
 * - Spalte 1: Name, Jobbeschreibung & Copyright
 * - Spalte 2: Kontakt (E-Mail, LinkedIn)
 * - Spalte 3: Barrierefreiheit (Erklärung zur Barrierefreiheit)
 */
export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-text-inverted px-8 py-[100px] flex justify-center">
      <div className="max-w-[1000px] w-full flex flex-col gap-16">
        <div className="flex flex-col md:flex-row justify-between gap-12">

          {/* Persönliche Infos */}
          <div className="flex flex-col gap-2 flex-1">
            <h2 className="text-h3 font-bold text-text-inverted ">
              Maik Bartels
            </h2>
            <p className="text-text-inverted-subtle">
              UX Designer & Frontend Developer aus Hamburg
            </p>
          </div>

          {/* Kontakt Spalte */}
          <div className="flex flex-col gap-3">
            <h3 className="text-h4 font-semibold text-text-inverted">
              Kontakt
            </h3>
            <div className="flex flex-col">
              <Link
                to="mailto:maik.bartels2@gmail.com"
                target="_self"
                className="text-text-inverted-subtle hover:text-text-inverted py-2"
              >
                maik.bartels2@gmail.com
              </Link>
              <Link
                to="https://www.linkedin.com"
                className="text-text-inverted-subtle hover:text-text-inverted py-2"
              >
                LinkedIn
              </Link>
            </div>
          </div>

          {/* Barrierefreiheit Spalte
          <div className="flex flex-col gap-3">
            <h3 className="text-h4 font-semibold text-text-inverted">
              Barrierefreiheit
            </h3>
            <div className="flex flex-col gap-2">
              <Link
                to="/barrierefreiheit"
                className="text-text-inverted-subtle hover:text-text-inverted py-2"
              >
                Erklärung zur Barrierefreiheit
              </Link>
            </div>
          </div> */}

        </div>

        <p className="text-text-inverted-subtle text-small">
          © {currentYear} Maik Bartels. Alle Rechte vorbehalten.
        </p>
      </div>
    </footer>
  );
}

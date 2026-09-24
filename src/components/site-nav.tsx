import { Link } from "@tanstack/react-router";
import { User, Home, Store, Dices, Sparkles } from "lucide-react";
import { PickupMenu } from "@/components/pickup-menu";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useI18n } from "@/lib/i18n";
import grapesLogo from "@/assets/grapes-logo.png.asset.json";



function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2 group">
      <img
        src={grapesLogo.url}
        alt="Grapes logo"
        className="h-9 w-9 shrink-0 rounded-full object-contain"
      />
      <span className="font-display text-2xl leading-none tracking-tight">
        Grapes
      </span>
    </Link>
  );
}

export function SiteNav() {
  const { t } = useI18n();
  const linkClass =
    "text-sm text-foreground/70 hover:text-foreground transition-colors";
  const activeClass = "text-foreground font-medium";
  return (
    <header className="hairline sticky top-0 z-40 bg-background/85 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between">
        <Logo />
        <nav className="hidden md:flex items-center gap-8">
          <Link to="/shops" className={linkClass} activeProps={{ className: activeClass }}>
            {t("nav.shops")}
          </Link>
          <Link to="/games" className={linkClass} activeProps={{ className: activeClass }}>
            {t("nav.games")}
          </Link>
          <Link to="/sommelier" className={linkClass} activeProps={{ className: activeClass }}>
            {t("nav.sommelier")}
          </Link>
          <Link to="/profile" className={linkClass} activeProps={{ className: activeClass }}>
            {t("nav.profile")}
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <Link
            to="/shops"
            className="hidden sm:inline-flex items-center rounded-full bg-primary px-4 py-2 text-xs font-medium text-primary-foreground hover:opacity-90 transition-opacity mr-1"
          >
            {t("nav.findBottle")}
          </Link>
          <LanguageSwitcher />
          <PickupMenu />
          <Link
            to="/profile"
            aria-label={t("nav.profile")}
            className="grid h-9 w-9 place-items-center rounded-full border border-border hover:bg-secondary transition-colors"
          >
            <User className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </header>
  );
}

const TABS = [
  { to: "/", key: "nav.home", icon: Home },
  { to: "/shops", key: "nav.shops", icon: Store },
  { to: "/sommelier", key: "nav.sommelier", icon: Sparkles },
  { to: "/games", key: "nav.gamesShort", icon: Dices },
  { to: "/profile", key: "nav.profile", icon: User },
] as const;

export function MobileTabBar() {
  const { t } = useI18n();
  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 backdrop-blur md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="grid grid-cols-5">
        {TABS.map(({ to, key, icon: Icon }) => (
          <li key={to}>
            <Link
              to={to}
              activeOptions={{ exact: to === "/" }}
              activeProps={{ className: "text-primary" }}
              className="flex flex-col items-center gap-1 px-1 py-2.5 text-[10px] font-medium text-muted-foreground transition-colors"
            >
              <Icon className="h-5 w-5" strokeWidth={1.75} />
              <span className="truncate">{t(key)}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}



export function SiteFooter() {
  const { t } = useI18n();
  return (
    <footer className="border-t border-border mt-16 md:mt-24">
      <div className="container-page py-12 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="font-display text-2xl">Grapes</div>
          <p className="mt-3 text-sm text-muted-foreground max-w-sm">
            {t("footer.tagline")}
          </p>
          <div className="mt-5 flex items-center gap-3">
            <a
              href="https://www.linkedin.com/"
              target="_blank"
              rel="noreferrer noopener"
              aria-label="Grapes on LinkedIn"
              className="grid h-9 w-9 place-items-center rounded-full border border-border hover:bg-secondary transition-colors"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
                <path d="M4.98 3.5a2.5 2.5 0 11.02 5.001A2.5 2.5 0 014.98 3.5zM3 9h4v12H3zM10 9h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V21H18.6v-5.4c0-1.29-.02-2.95-1.8-2.95-1.8 0-2.08 1.4-2.08 2.85V21H10z" />
              </svg>
            </a>
            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noreferrer noopener"
              aria-label="Grapes on Instagram"
              className="grid h-9 w-9 place-items-center rounded-full border border-border hover:bg-secondary transition-colors"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
              </svg>
            </a>
          </div>
        </div>
        <div>
          <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {t("footer.explore")}
          </div>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link to="/shops" className="hover:text-primary">{t("nav.shops")}</Link></li>
            <li><Link to="/games" className="hover:text-primary">{t("nav.games")}</Link></li>
            <li><Link to="/sommelier" className="hover:text-primary">{t("nav.sommelier")}</Link></li>
          </ul>
        </div>
        <div>
          <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {t("footer.company")}
          </div>
          <ul className="mt-3 space-y-2 text-sm">
            <li><a className="hover:text-primary" href="#">{t("footer.careers")}</a></li>
            <li><a className="hover:text-primary" href="mailto:hello@grapeswine.app">{t("footer.contact")}</a></li>
          </ul>
          <div className="mt-6 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {t("footer.legal")}
          </div>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link to="/terms" className="hover:text-primary">{t("footer.terms")}</Link></li>
            <li><Link to="/privacy" className="hover:text-primary">{t("footer.privacy")}</Link></li>
            <li><Link to="/cookies" className="hover:text-primary">{t("footer.cookies")}</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="container-page py-5 text-xs text-muted-foreground flex flex-wrap items-center justify-between gap-3">
          <div>© {new Date().getFullYear()} Grapes · Made in Lisbon</div>
          <div>{t("footer.age")}</div>
        </div>
      </div>
    </footer>
  );
}

import { Globe } from "lucide-react";
import { LANGS, useI18n, type Lang } from "@/lib/i18n";

export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const { lang, setLang, t } = useI18n();
  return (
    <label
      className={`hover-lift relative inline-flex items-center gap-1.5 rounded-full border border-border bg-background/70 px-2.5 py-1.5 text-xs font-medium backdrop-blur transition hover:bg-secondary ${className}`}
    >
      <Globe className="h-3.5 w-3.5 text-primary" aria-hidden />
      <span className="sr-only">{t("nav.language")}</span>
      <select
        aria-label={t("nav.language")}
        value={lang}
        onChange={(e) => setLang(e.target.value as Lang)}
        className="cursor-pointer appearance-none bg-transparent pr-1 text-xs font-semibold uppercase outline-none"
      >
        {LANGS.map((l) => (
          <option key={l.code} value={l.code}>
            {l.code.toUpperCase()}
          </option>
        ))}
      </select>
    </label>
  );
}

export default LanguageSwitcher;

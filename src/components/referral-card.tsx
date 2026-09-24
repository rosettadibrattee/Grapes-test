import { useEffect, useMemo, useState } from "react";
import { Check, Copy, Gift, Sparkles, Truck, Users } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useUser } from "@/lib/user-session";

const CODE_KEY = "grapes.referral.code.v1";

function makeCode(seed?: string) {
  const base = (seed ?? "").replace(/[^a-zA-Z]/g, "").slice(0, 4).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `${base || "VINHO"}${rand}`;
}

export function ReferralCard({ compact = false }: { compact?: boolean }) {
  const { t } = useI18n();
  const { user } = useUser();
  const [code, setCode] = useState("GRAPES10");
  const [origin, setOrigin] = useState("https://grapeswine.app");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setOrigin(window.location.origin);
    try {
      const stored = localStorage.getItem(CODE_KEY);
      if (stored) {
        setCode(stored);
      } else {
        const next = makeCode(user?.name);
        localStorage.setItem(CODE_KEY, next);
        setCode(next);
      }
    } catch {
      setCode(makeCode(user?.name));
    }
  }, [user?.name]);

  const link = useMemo(() => `${origin}/?ref=${code}`, [origin, code]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(link);
    } catch {}
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const whatsapp = `https://wa.me/?text=${encodeURIComponent(`${t("referral.message")} ${link}`)}`;

  return (
    <div className="tech-card sheen overflow-hidden p-6 md:p-8">
      {/* Free-delivery hero banner */}
      <div className="flex flex-col items-center gap-4 rounded-3xl bg-primary px-5 py-6 text-center text-white sm:flex-row sm:text-left">
        <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-white/15">
          <Truck className="h-7 w-7" />
        </span>
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider">
            <Sparkles className="h-3 w-3" /> {t("referral.badge")}
          </div>
          <h2
            className={`mt-2 font-display leading-tight tracking-tight ${
              compact ? "text-2xl" : "text-3xl md:text-4xl"
            }`}
          >
            {t("referral.hero")}
          </h2>
          <p className="mt-1.5 text-sm text-white/80">{t("referral.heroSub")}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-8 md:grid-cols-[1fr_1.05fr] md:items-center">
        <div>
          <ul className="space-y-2.5 text-sm">
            {[
              { icon: Truck, text: t("referral.benefitYou") },
              { icon: Gift, text: t("referral.benefitFriend") },
              { icon: Users, text: t("referral.benefitBoth") },
            ].map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-start gap-2.5">
                <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                  <Icon className="h-3.5 w-3.5" />
                </span>
                <span className="text-foreground/80">{text}</span>
              </li>
            ))}
          </ul>
          <div className="mt-5 flex items-center gap-2 text-xs text-muted-foreground">
            <Users className="h-3.5 w-3.5" /> 0 {t("referral.invited")}
          </div>
        </div>

        <div className="glass-panel rounded-3xl p-5">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            {t("referral.yourCode")}
          </div>
          <div className="mt-2 rounded-2xl border border-dashed border-primary/20 bg-primary/5 px-4 py-3 text-center font-mono text-2xl font-bold tracking-[0.2em] text-primary">
            {code}
          </div>

          <div className="mt-4 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            {t("referral.yourLink")}
          </div>
          <div className="mt-2 flex items-center gap-2 rounded-xl border border-border bg-background/80 px-3 py-2">
            <span className="min-w-0 flex-1 truncate text-xs text-muted-foreground">{link}</span>
            <button
              type="button"
              onClick={copy}
              aria-label={t("referral.copy")}
              className="shrink-0 rounded-lg p-1.5 text-primary transition hover:bg-primary/10"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>

          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            <button
              type="button"
              onClick={copy}
              className="hover-lift inline-flex items-center justify-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? t("referral.copied") : t("referral.copy")}
            </button>
            <a
              href={whatsapp}
              target="_blank"
              rel="noreferrer noopener"
              className="hover-lift inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
                <path d="M12.05 0C5.5 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413A11.815 11.815 0 0012.05 0Zm0 21.785h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884a9.82 9.82 0 016.988 2.898 9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884Z" />
              </svg>
              {t("referral.share")}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReferralCard;

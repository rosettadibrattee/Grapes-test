import { useEffect, useState } from "react";
import { Check, Copy, Gift, X } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const CODE_KEY = "grapes.referral.code.v1";
const DISMISS_KEY = "grapes.referral.banner.dismissed.v1";

export function ReferralBanner() {
  const { t } = useI18n();
  const [hidden, setHidden] = useState(true);
  const [link, setLink] = useState("https://grapeswine.app");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      const code = localStorage.getItem(CODE_KEY) ?? "GRAPES10";
      setLink(`${window.location.origin}/?ref=${code}`);
      setHidden(localStorage.getItem(DISMISS_KEY) === "1");
    } catch {
      setHidden(false);
    }
  }, []);

  const dismiss = () => {
    setHidden(true);
    try {
      localStorage.setItem(DISMISS_KEY, "1");
    } catch {}
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(link);
    } catch {}
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (hidden) return null;

  return (
    <>
      {/* Desktop: horizontal high-contrast banner at the top */}
      <div className="hidden bg-primary text-primary-foreground md:block">
        <div className="container-page grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 py-2.5">
          <div className="flex min-w-0 items-center gap-3">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-white/15">
              <Gift className="h-4 w-4" />
            </span>
            <p className="min-w-0 truncate text-sm font-semibold">
              {t("referral.hero")}{" "}
              <span className="font-normal text-white/75">{t("referral.heroSub")}</span>
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={copy}
              className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-semibold text-primary transition hover:opacity-90"
            >
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? t("referral.copied") : t("referral.copy")}
            </button>
            <button
              type="button"
              onClick={dismiss}
              aria-label="Close"
              className="rounded-full p-1.5 text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile: sticky banner right above the tab bar */}
      <div className="fixed inset-x-2 bottom-[76px] z-40 md:hidden">
        <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-2xl bg-primary px-3 py-2.5 text-white shadow-lg">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/15">
            <Gift className="h-4.5 w-4.5" />
          </span>
          <div className="min-w-0">
            <div className="truncate text-[13px] font-semibold leading-tight">
              {t("referral.hero")}
            </div>
            <button
              type="button"
              onClick={copy}
              className="mt-1.5 inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[11px] font-bold text-primary"
            >
              {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              {copied ? t("referral.copied") : t("referral.copy")}
            </button>
          </div>
          <button
            type="button"
            onClick={dismiss}
            aria-label="Close"
            className="shrink-0 self-start rounded-full p-1 text-white/70"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </>
  );
}

export default ReferralBanner;

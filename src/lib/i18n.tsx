import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Lang = "pt" | "en" | "it";

export const LANGS: { code: Lang; label: string; flag: string }[] = [
  { code: "pt", label: "Português", flag: "🇵🇹" },
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "it", label: "Italiano", flag: "🇮🇹" },
];

const STORAGE_KEY = "grapes.lang.v1";

type Dict = Record<string, string>;

const en: Dict = {
  "nav.shops": "Shops",
  "nav.games": "Wine Games",
  "nav.sommelier": "AI Sommelier",
  "nav.profile": "Profile",
  "nav.findBottle": "Find a bottle",
  "nav.home": "Home",
  "nav.gamesShort": "Games",
  "nav.language": "Language",
  "footer.tagline":
    "The AI wine app. Find and reserve the bottle you actually want, across +50 wine, spirits and liquor stores in Lisbon.",
  "footer.explore": "Explore",
  "footer.company": "Company",
  "footer.legal": "Legal",
  "footer.careers": "Careers",
  "footer.contact": "Contact Us",
  "footer.terms": "Terms & Conditions",
  "footer.privacy": "Privacy Policy",
  "footer.cookies": "Cookie Policy & Legal Disclaimers",
  "footer.age": "Must be 21+ to purchase or reserve alcohol. Drink responsibly.",
  "referral.badge": "Early members only",
  "referral.title": "Grapes Referral",
  "referral.subtitle":
    "Invite a friend to Grapes Lisbon. They get €10 off their first reserved bottle — you get €10 in credit as soon as it's delivered.",
  "referral.yourCode": "Your invite code",
  "referral.yourLink": "Your invite link",
  "referral.copy": "Copy link",
  "referral.copied": "Link copied",
  "referral.share": "Share on WhatsApp",
  "referral.benefitYou": "Free delivery on your next order for every friend who joins.",
  "referral.benefitFriend": "Your friend gets free delivery on their first order.",
  "referral.benefitBoth": "Founding-member badge after 3 successful invites.",
  "referral.invited": "friends invited",
  "referral.message":
    "I'm using Grapes to find and reserve wine in Lisbon — use my link and we both get €10:",
  "whatsapp.support": "Chat with support",
  "whatsapp.floating": "Contact us on WhatsApp",
  "whatsapp.order":
    "Hi Grapes! I placed an order and I'd like to know when my bottle will be ready.",
  "checkout.title": "Checkout",
  "checkout.subtitle": "Pay now and we deliver your bottles to your door.",
  "checkout.cart": "Your cart",
  "checkout.empty": "Your cart is empty. Reserve a bottle to get started.",
  "checkout.browse": "Browse shops",
  "checkout.subtotal": "Subtotal",
  "checkout.serviceFee": "Service fee",
  "checkout.total": "Total",
  "checkout.card": "Card details",
  "checkout.cardNumber": "Card number",
  "checkout.expiry": "Expiry",
  "checkout.cvc": "CVC",
  "checkout.name": "Name on card",
  "checkout.email": "Email for receipt",
  "checkout.pay": "Pay with Stripe",
  "checkout.paying": "Processing…",
  "checkout.secured": "Payments secured by Stripe. Test interface — no card is charged.",
  "checkout.success": "Payment confirmed",
  "checkout.successBody": "Your bottles are paid for and on their way to your address.",
  "checkout.qty": "Qty",
  "referral.hero": "Share Grapes with a friend and get Free Delivery!",
  "referral.heroSub": "Every friend who orders unlocks free home delivery on your next bottles.",
  "checkout.shipping": "Delivery address",
  "checkout.fullName": "Full name",
  "checkout.address": "Street and number",
  "checkout.city": "City",
  "checkout.zip": "Postal code",
  "checkout.phone": "Phone for the courier",
  "checkout.notes": "Delivery notes (optional)",
  "checkout.deliveryFee": "Delivery",
  "checkout.delivery": "Home delivery in 60–90 min",
};

const pt: Dict = {
  "nav.shops": "Lojas",
  "nav.games": "Jogos de Vinho",
  "nav.sommelier": "Sommelier IA",
  "nav.profile": "Perfil",
  "nav.findBottle": "Encontrar garrafa",
  "nav.home": "Início",
  "nav.gamesShort": "Jogos",
  "nav.language": "Idioma",
  "footer.tagline":
    "A app de vinho com IA. Encontra e reserva a garrafa que queres mesmo, em +50 lojas de vinho e bebidas em Lisboa.",
  "footer.explore": "Explorar",
  "footer.company": "Empresa",
  "footer.legal": "Legal",
  "footer.careers": "Carreiras",
  "footer.contact": "Contacta-nos",
  "footer.terms": "Termos e Condições",
  "footer.privacy": "Política de Privacidade",
  "footer.cookies": "Política de Cookies e Avisos Legais",
  "footer.age": "É necessário ter 18+ para comprar ou reservar álcool. Bebe com moderação.",
  "referral.badge": "Só para os primeiros membros",
  "referral.title": "Grapes Referral",
  "referral.subtitle":
    "Convida um amigo para a Grapes Lisboa. Ele recebe 10 € na primeira garrafa reservada — tu recebes 10 € em crédito assim que ele levantar.",
  "referral.yourCode": "O teu código de convite",
  "referral.yourLink": "O teu link de convite",
  "referral.copy": "Copiar link",
  "referral.copied": "Link copiado",
  "referral.share": "Partilhar no WhatsApp",
  "referral.benefitYou": "Entrega grátis na tua próxima encomenda por cada amigo que adere.",
  "referral.benefitFriend": "O teu amigo recebe entrega grátis na primeira encomenda.",
  "referral.benefitBoth": "Badge de membro fundador após 3 convites bem-sucedidos.",
  "referral.invited": "amigos convidados",
  "referral.message":
    "Estou a usar a Grapes para encontrar e reservar vinho em Lisboa — usa o meu link e ganhamos 10 € cada:",
  "whatsapp.support": "Falar com o apoio",
  "whatsapp.floating": "Fala connosco no WhatsApp",
  "whatsapp.order":
    "Olá Grapes! Fiz uma encomenda e queria saber quando a minha garrafa estará pronta.",
  "checkout.title": "Pagamento",
  "checkout.subtitle": "Paga já e entregamos as tuas garrafas em casa.",
  "checkout.cart": "O teu carrinho",
  "checkout.empty": "O teu carrinho está vazio. Reserva uma garrafa para começar.",
  "checkout.browse": "Ver lojas",
  "checkout.subtotal": "Subtotal",
  "checkout.serviceFee": "Taxa de serviço",
  "checkout.total": "Total",
  "checkout.card": "Dados do cartão",
  "checkout.cardNumber": "Número do cartão",
  "checkout.expiry": "Validade",
  "checkout.cvc": "CVC",
  "checkout.name": "Nome no cartão",
  "checkout.email": "Email para o recibo",
  "checkout.pay": "Pagar com Stripe",
  "checkout.paying": "A processar…",
  "checkout.secured": "Pagamentos protegidos pela Stripe. Interface de teste — nenhum cartão é cobrado.",
  "checkout.success": "Pagamento confirmado",
  "checkout.successBody": "As tuas garrafas estão pagas e a caminho da tua morada.",
  "checkout.qty": "Qtd",
  "referral.hero": "Partilha a Grapes com um amigo e recebe Entrega Grátis!",
  "referral.heroSub": "Cada amigo que encomenda desbloqueia entrega grátis em casa nas tuas próximas garrafas.",
  "checkout.shipping": "Morada de entrega",
  "checkout.fullName": "Nome completo",
  "checkout.address": "Rua e número",
  "checkout.city": "Cidade",
  "checkout.zip": "Código postal",
  "checkout.phone": "Telefone para o estafeta",
  "checkout.notes": "Notas de entrega (opcional)",
  "checkout.deliveryFee": "Entrega",
  "checkout.delivery": "Entrega ao domicílio em 60–90 min",
};

const it: Dict = {
  "nav.shops": "Negozi",
  "nav.games": "Giochi di Vino",
  "nav.sommelier": "Sommelier AI",
  "nav.profile": "Profilo",
  "nav.findBottle": "Trova una bottiglia",
  "nav.home": "Home",
  "nav.gamesShort": "Giochi",
  "nav.language": "Lingua",
  "footer.tagline":
    "L'app del vino con AI. Trova e prenota la bottiglia che vuoi davvero, in +50 enoteche e negozi di Lisbona.",
  "footer.explore": "Esplora",
  "footer.company": "Azienda",
  "footer.legal": "Legale",
  "footer.careers": "Lavora con noi",
  "footer.contact": "Contattaci",
  "footer.terms": "Termini e Condizioni",
  "footer.privacy": "Informativa Privacy",
  "footer.cookies": "Cookie Policy e Avvisi Legali",
  "footer.age": "Vietato ai minori di 18 anni. Bevi responsabilmente.",
  "referral.badge": "Solo per i primi utenti",
  "referral.title": "Grapes Referral",
  "referral.subtitle":
    "Invita un amico su Grapes Lisbona. Lui riceve 10 € sulla prima bottiglia prenotata — tu 10 € di credito appena viene consegnata.",
  "referral.yourCode": "Il tuo codice invito",
  "referral.yourLink": "Il tuo link invito",
  "referral.copy": "Copia link",
  "referral.copied": "Link copiato",
  "referral.share": "Condividi su WhatsApp",
  "referral.benefitYou": "Spedizione gratuita sul tuo prossimo ordine per ogni amico che si iscrive.",
  "referral.benefitFriend": "Il tuo amico riceve la consegna gratuita sul primo ordine.",
  "referral.benefitBoth": "Badge founding member dopo 3 inviti andati a buon fine.",
  "referral.invited": "amici invitati",
  "referral.message":
    "Sto usando Grapes per trovare e prenotare vino a Lisbona — usa il mio link e prendiamo 10 € entrambi:",
  "whatsapp.support": "Scrivi al supporto",
  "whatsapp.floating": "Contattaci su WhatsApp",
  "whatsapp.order":
    "Ciao Grapes! Ho fatto un ordine e vorrei sapere quando arriverà la mia bottiglia.",
  "checkout.title": "Pagamento",
  "checkout.subtitle": "Paga ora e consegniamo le bottiglie a casa tua.",
  "checkout.cart": "Il tuo carrello",
  "checkout.empty": "Il carrello è vuoto. Prenota una bottiglia per iniziare.",
  "checkout.browse": "Vedi i negozi",
  "checkout.subtotal": "Subtotale",
  "checkout.serviceFee": "Costo di servizio",
  "checkout.total": "Totale",
  "checkout.card": "Dati della carta",
  "checkout.cardNumber": "Numero carta",
  "checkout.expiry": "Scadenza",
  "checkout.cvc": "CVC",
  "checkout.name": "Nome sulla carta",
  "checkout.email": "Email per la ricevuta",
  "checkout.pay": "Paga con Stripe",
  "checkout.paying": "Elaborazione…",
  "checkout.secured": "Pagamenti protetti da Stripe. Interfaccia di test — nessun addebito.",
  "checkout.success": "Pagamento confermato",
  "checkout.successBody": "Le tue bottiglie sono pagate e in viaggio verso il tuo indirizzo.",
  "checkout.qty": "Qtà",
  "referral.hero": "Condividi Grapes con un amico e ottieni la Spedizione Gratuita!",
  "referral.heroSub": "Ogni amico che ordina ti sblocca la consegna a domicilio gratuita sulle prossime bottiglie.",
  "checkout.shipping": "Indirizzo di spedizione",
  "checkout.fullName": "Nome e cognome",
  "checkout.address": "Via e numero civico",
  "checkout.city": "Città",
  "checkout.zip": "CAP",
  "checkout.phone": "Telefono per il corriere",
  "checkout.notes": "Note di consegna (opzionale)",
  "checkout.deliveryFee": "Consegna",
  "checkout.delivery": "Consegna a domicilio in 60–90 min",
};

const DICTS: Record<Lang, Dict> = { pt, en, it };

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (key: string) => string };

const I18nContext = createContext<Ctx | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("pt");

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as Lang | null;
      if (stored && stored in DICTS) {
        setLangState(stored);
        return;
      }
      const nav = navigator.language?.slice(0, 2);
      if (nav === "pt" || nav === "it" || nav === "en") setLangState(nav);
    } catch {}
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem(STORAGE_KEY, l);
    } catch {}
  }, []);

  const t = useCallback((key: string) => DICTS[lang][key] ?? en[key] ?? key, [lang]);

  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

const FALLBACK_CTX: Ctx = {
  lang: "pt",
  setLang: () => {},
  t: (key: string) => pt[key] ?? en[key] ?? key,
};

export function useI18n() {
  const ctx = useContext(I18nContext);
  // Fall back to the default dictionary instead of crashing the page when a
  // component renders outside the provider (e.g. during hot reloads).
  return ctx ?? FALLBACK_CTX;
}

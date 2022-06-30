export type Language = "en" | "es" | "fr";

export const fallbackLang = "en";

export function getTranslations<
  RequestedTranslations extends keyof Translations
>(lang: Language, requestedTranslations: Array<RequestedTranslations>) {
  let results: Record<RequestedTranslations, string> = {} as any;

  for (let translation of requestedTranslations) {
    results[translation] = translations[translation][lang];
  }

  return results;
}

type Translations = typeof translations;

export type PickTranslations<TranslationKeys extends keyof Translations> =
  Record<TranslationKeys, string>;

const global = {
  "Switch between light and dark mode": {
    en: "Switch between light and dark mode",
    es: "Cambiar entre modo claro y oscuro",
    fr: "Basculer entre les modes clair et sombre",
  },
};

const home = {
  "Start trading": {
    en: "Start trading",
    es: "Comienza a negociar",
    fr: "Commencer à négocier",
  },
  "Home page": {
    en: "Home page",
    es: "Página de inicio",
    fr: "Page d'accueil",
  },
  "As more assets become tokenized": {
    en: "As more assets become tokenized, public blockchains provide the opportunity to establish a new financial stack that is more efficient, transparent, and equitable than any system in the past. Let us create a tokenized world where value can flow freely",
    es: "A medida que se tokenizan más activos, las cadenas de bloques públicas brindan la oportunidad de establecer una nueva pila financiera que es más eficiente, transparente y equitativa que cualquier sistema en el pasado. Creemos un mundo tokenizado donde el valor pueda fluir libremente",
    fr: "Au fur et à mesure que de plus en plus d'actifs deviennent tokenisés, les blockchains publiques offrent la possibilité d'établir une nouvelle pile financière qui est plus efficace, transparente et équitable que n'importe quel système dans le passé. Créons un monde symbolisé où la valeur peut circuler librement",
  },
};

const swap = {
  Sell: {
    en: "Sell",
    es: "Vender",
    fr: "Vendre",
  },
  Buy: {
    en: "Buy",
    es: "Comprar",
    fr: "Acheter",
  },
  "Sell Amount": {
    en: "Sell Amount",
    es: "Cantidad de venta",
    fr: "Montant de la vente",
  },
  "Buy Amount": {
    en: "Buy Amount",
    es: "Cantidad de compra",
    fr: "Montant de l'achat",
  },
  "Place Order": {
    en: "Place Order",
    es: "Realizar Pedido",
    fr: "Passer la commande",
  },
  "Connect Wallet": {
    en: "Connect Wallet",
    es: "Conectar billetera",
    fr: "Connecter portefeuille",
  },
  Processing: {
    en: "Processing",
    es: "Procesando",
    fr: "Traitement",
  },
  "Fetching best price": {
    en: "Fetching best price",
    es: "Obteniendo el mejor precio",
    fr: "Obtenir le meilleur prix",
  },
  "Switch trading direction": {
    en: "Switch trading direction",
    es: "Cambiar las direcciones comerciales",
    fr: "Changer de direction commerciale",
  },
  "soon, my fren": {
    en: "soon, my fren",
    es: "bientôt, mon ami",
    fr: "pronto, mi amiga",
  },
};

const translations = { ...global, ...home, ...swap };

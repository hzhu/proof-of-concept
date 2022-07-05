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

  "Connect Wallet": {
    en: "Connect Wallet",
    es: "Conectar billetera",
    fr: "Connecter portefeuille",
  },
};

const home = {
  Hello: {
    en: "Hello 👋 welcome! Let us create a tokenized world where value can flow freely",
    es: "Hola 👋 bienvenido! Creemos un mundo tokenizado donde el valor pueda fluir libremente",
    fr: "Bonjour 👋 bienvenue ! Créons un monde symbolisé où la valeur peut circuler librement",
  },
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
  "Processing": {
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
  disclosure: {
    en: "⚠️ WARNING ⚠️ THIS IS A PROOF OF CONCEPT. ONLY TRADE SMALL AMOUNTS ON POLYGON.",
    es: "⚠️ ADVERTENCIA ⚠️ ESTA ES UNA PRUEBA DE CONCEPTO. SÓLO COMERCIE PEQUEÑAS CANTIDADES EN POLYGON.",
    fr: "⚠️ ATTENTION ⚠️ CECI EST UNE PREUVE DE CONCEPT. COMMERCEZ UNIQUEMENT DE PETITES QUANTITÉS SUR POLYGONE."
  }
};

const translations = { ...global, ...home, ...swap };

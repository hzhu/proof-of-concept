export type Language = "en" | "es" | "fr" | "ko";

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
    ko: "밝은 모드와 어두운 모드 간 전환"
  },

  "Connect Wallet": {
    en: "Connect Wallet",
    es: "Conectar billetera",
    fr: "Connecter portefeuille",
    ko: "지갑 연결"
  },
};

const home = {
  Hello: {
    en: "Hello 👋 welcome! Let us create a tokenized world where value can flow freely",
    es: "Hola 👋 bienvenido! Creemos un mundo tokenizado donde el valor pueda fluir libremente",
    fr: "Bonjour 👋 bienvenue ! Créons un monde symbolisé où la valeur peut circuler librement",
    ko: "안녕하세요 👋 환영합니다! 가치가 자유롭게 흐르는 토큰화된 세상을 만들자"
  },
  "Start trading": {
    en: "Start trading",
    es: "Comienza a negociar",
    fr: "Commencer à négocier",    
    ko: "거래 시작"
  },
  "Home page": {
    en: "Home page",
    es: "Página de inicio",
    fr: "Page d'accueil",
    ko: "홈페이지"
  },
  "Discover tokens": {
    en: "Discover tokens",
    es: "Descubre fichas",
    fr: "Découvrir les jetons",
    ko: "토큰 발견"
  },
  "As more assets become tokenized": {
    en: "As more assets become tokenized, public blockchains provide the opportunity to establish a new financial stack that is more efficient, transparent, and equitable than any system in the past. Let us create a tokenized world where value can flow freely",
    es: "A medida que se tokenizan más activos, las cadenas de bloques públicas brindan la oportunidad de establecer una nueva pila financiera que es más eficiente, transparente y equitativa que cualquier sistema en el pasado. Creemos un mundo tokenizado donde el valor pueda fluir libremente",
    fr: "Au fur et à mesure que de plus en plus d'actifs deviennent tokenisés, les blockchains publiques offrent la possibilité d'établir une nouvelle pile financière qui est plus efficace, transparente et équitable que n'importe quel système dans le passé. Créons un monde symbolisé où la valeur peut circuler librement",
    ko: "더 많은 자산이 토큰화됨에 따라 퍼블릭 블록체인은 과거의 어떤 시스템보다 더 효율적이고 투명하며 공평한 새로운 금융 스택을 구축할 수 있는 기회를 제공합니다. 가치가 자유롭게 흐르는 토큰화된 세상을 만들자"
  },
};

const swap = {
  Sell: {
    en: "Sell",
    es: "Vender",
    fr: "Vendre",
    ko: "팔다"
  },
  Buy: {
    en: "Buy",
    es: "Comprar",
    fr: "Acheter",
    ko: "구입하다"
  },
  "Sell Amount": {
    en: "Sell Amount",
    es: "Cantidad de venta",
    fr: "Montant de la vente",
    ko: "판매 금액"
  },
  "Buy Amount": {
    en: "Buy Amount",
    es: "Cantidad de compra",
    fr: "Montant de l'achat",
    ko: "구매 금액"
  },
  "Place Order": {
    en: "Place Order",
    es: "Realizar Pedido",
    fr: "Passer la commande",
    ko: "주문하기"
  },
  "Processing": {
    en: "Processing",
    es: "Procesando",
    fr: "Traitement",
    ko: "처리"
  },
  "Fetching best price": {
    en: "Fetching best price",
    es: "Obteniendo el mejor precio",
    fr: "Obtenir le meilleur prix",
    ko: "최고의 가격 얻기"
  },
  "Switch trading direction": {
    en: "Switch trading direction",
    es: "Cambiar las direcciones comerciales",
    fr: "Changer de direction commerciale",
    ko: "거래 방향 전환"
  },
  disclosure: {
    en: "⚠️ WARNING ⚠️ THIS IS A PROOF OF CONCEPT. ONLY TRADE SMALL AMOUNTS ON POLYGON.",
    es: "⚠️ ADVERTENCIA ⚠️ ESTA ES UNA PRUEBA DE CONCEPTO. SÓLO COMERCIE PEQUEÑAS CANTIDADES EN POLYGON.",
    fr: "⚠️ ATTENTION ⚠️ CECI EST UNE PREUVE DE CONCEPT. COMMERCEZ UNIQUEMENT DE PETITES QUANTITÉS SUR POLYGONE.",
    ko: "⚠️ 경고 ⚠️ 이것은 개념 증명입니다. 소액 거래만 가능"
  }
};

const search = {
  "Search": {
    en: "Search",
    es: "Búsqueda",
    fr: "Chercher",
    ko: "검색"
  },
  "Search for coins": {
    en: "Search for coins",
    es: "Buscar monedas",
    fr: "Rechercher des pièces",
    ko: "동전 검색"
  }
}

const translations = { ...global, ...home, ...swap, ...search };

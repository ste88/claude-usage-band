export type Lang = 'en' | 'de' | 'fr' | 'it' | 'es' | 'pt' | 'nl' | 'pl'

export type Messages = {
  name: string
  five_hour: string
  seven_day: string
  spend_limit: string
  day: string
  session: string
  usageToast: (label: string, pct: number) => string
  themeCurrent: (name: string) => string
  themeChange: string
  themeUnknown: (name: string) => string
  themeSet: (name: string) => string
  hintState: (state: string) => string
  hintChange: string
  hintTight: (label: string, pct: number) => string
  langCurrent: (name: string) => string
  langChange: string
  langUnknown: (code: string) => string
  langSet: (name: string) => string
  iconsState: (name: string) => string
  iconsChange: string
  iconsUnknown: (name: string) => string
  iconsSet: (name: string) => string
  runoutState: (value: string) => string
  runoutChange: string
  runoutUnknown: (value: string) => string
  runoutSet: (value: string) => string
}

const CHANGE_LANG = '/usage-band lang <code|auto>'

export const MESSAGES: Record<Lang, Messages> = {
  en: {
    name: 'English',
    five_hour: '5h',
    seven_day: '7d',
    spend_limit: 'spend',
    day: 'd',
    session: 'session',
    usageToast: (l, p) => `${l} usage at ${p}%`,
    themeCurrent: n => `Current theme: ${n}`,
    themeChange: 'Change with /usage-band <name>',
    themeUnknown: n => `Unknown theme: ${n}`,
    themeSet: n => `Bar theme: ${n}`,
    hintState: s => `Model hint: ${s}`,
    hintChange: 'Change with /usage-band hint on|off',
    hintTight: (l, p) => `${l} at ${p}% and ahead of the clock: consider a lighter model`,
    langCurrent: n => `Language: ${n}`,
    langChange: `Change with ${CHANGE_LANG}`,
    langUnknown: c => `Unknown language: ${c}`,
    langSet: n => `Language: ${n}`,
    iconsState: n => `Icon set: ${n}`,
    iconsChange: 'Change with /usage-band icons emoji|beer|fuel|weather|animals',
    iconsUnknown: n => `Unknown icon set: ${n}`,
    iconsSet: n => `Icon set: ${n}`,
    runoutState: v => `Runout estimate: ${v}`,
    runoutChange: 'Change with /usage-band runout always|off|0-100',
    runoutUnknown: v => `Unknown runout setting: ${v}`,
    runoutSet: v => `Runout estimate: ${v}`,
  },
  de: {
    name: 'Deutsch',
    five_hour: '5h',
    seven_day: '7T',
    spend_limit: 'Ausgaben',
    day: 'T',
    session: 'Sitzung',
    usageToast: (l, p) => `${l}-Nutzung bei ${p}%`,
    themeCurrent: n => `Aktuelles Design: ${n}`,
    themeChange: 'Ändern mit /usage-band <Name>',
    themeUnknown: n => `Unbekanntes Design: ${n}`,
    themeSet: n => `Design der Leiste: ${n}`,
    hintState: s => `Modellhinweis: ${s}`,
    hintChange: 'Ändern mit /usage-band hint on|off',
    hintTight: (l, p) => `${l} bei ${p}% und dem Zeitplan voraus: ein leichteres Modell erwägen`,
    langCurrent: n => `Sprache: ${n}`,
    langChange: `Ändern mit ${CHANGE_LANG}`,
    langUnknown: c => `Unbekannte Sprache: ${c}`,
    langSet: n => `Sprache: ${n}`,
    iconsState: n => `Symbolsatz: ${n}`,
    iconsChange: 'Ändern mit /usage-band icons emoji|beer|fuel|weather|animals',
    iconsUnknown: n => `Unbekannter Symbolsatz: ${n}`,
    iconsSet: n => `Symbolsatz: ${n}`,
    runoutState: v => `Laufzeit-Schätzung: ${v}`,
    runoutChange: 'Ändern mit /usage-band runout always|off|0-100',
    runoutUnknown: v => `Unbekannte Einstellung für die Laufzeit-Schätzung: ${v}`,
    runoutSet: v => `Laufzeit-Schätzung: ${v}`,
  },
  fr: {
    name: 'Français',
    five_hour: '5h',
    seven_day: '7j',
    spend_limit: 'dépenses',
    day: 'j',
    session: 'session',
    usageToast: (l, p) => `Utilisation ${l} à ${p} %`,
    themeCurrent: n => `Thème actuel : ${n}`,
    themeChange: 'Changer avec /usage-band <nom>',
    themeUnknown: n => `Thème inconnu : ${n}`,
    themeSet: n => `Thème de la barre : ${n}`,
    hintState: s => `Suggestion de modèle : ${s}`,
    hintChange: 'Changer avec /usage-band hint on|off',
    hintTight: (l, p) => `${l} à ${p} % et en avance sur le rythme : envisagez un modèle plus léger`,
    langCurrent: n => `Langue : ${n}`,
    langChange: `Changer avec ${CHANGE_LANG}`,
    langUnknown: c => `Langue inconnue : ${c}`,
    langSet: n => `Langue : ${n}`,
    iconsState: n => `Jeu d'icônes : ${n}`,
    iconsChange: 'Changer avec /usage-band icons emoji|beer|fuel|weather|animals',
    iconsUnknown: n => `Jeu d'icônes inconnu : ${n}`,
    iconsSet: n => `Jeu d'icônes : ${n}`,
    runoutState: v => `Estimation d'épuisement : ${v}`,
    runoutChange: 'Changer avec /usage-band runout always|off|0-100',
    runoutUnknown: v => `Réglage d'épuisement inconnu : ${v}`,
    runoutSet: v => `Estimation d'épuisement : ${v}`,
  },
  it: {
    name: 'Italiano',
    five_hour: '5h',
    seven_day: '7g',
    spend_limit: 'spesa',
    day: 'g',
    session: 'sessione',
    usageToast: (l, p) => `Utilizzo ${l} al ${p}%`,
    themeCurrent: n => `Tema attuale: ${n}`,
    themeChange: 'Cambia con /usage-band <nome>',
    themeUnknown: n => `Tema sconosciuto: ${n}`,
    themeSet: n => `Tema della barra: ${n}`,
    hintState: s => `Suggerimento modello: ${s}`,
    hintChange: 'Cambia con /usage-band hint on|off',
    hintTight: (l, p) => `${l} al ${p}% e in anticipo: valuta un modello più leggero`,
    langCurrent: n => `Lingua: ${n}`,
    langChange: `Cambia con ${CHANGE_LANG}`,
    langUnknown: c => `Lingua sconosciuta: ${c}`,
    langSet: n => `Lingua: ${n}`,
    iconsState: n => `Set di icone: ${n}`,
    iconsChange: 'Cambia con /usage-band icons emoji|beer|fuel|weather|animals',
    iconsUnknown: n => `Set di icone sconosciuto: ${n}`,
    iconsSet: n => `Set di icone: ${n}`,
    runoutState: v => `Stima esaurimento: ${v}`,
    runoutChange: 'Cambia con /usage-band runout always|off|0-100',
    runoutUnknown: v => `Impostazione della stima di esaurimento sconosciuta: ${v}`,
    runoutSet: v => `Stima esaurimento: ${v}`,
  },
  es: {
    name: 'Español',
    five_hour: '5h',
    seven_day: '7d',
    spend_limit: 'gasto',
    day: 'd',
    session: 'sesión',
    usageToast: (l, p) => `Uso de ${l} al ${p}%`,
    themeCurrent: n => `Tema actual: ${n}`,
    themeChange: 'Cambia con /usage-band <nombre>',
    themeUnknown: n => `Tema desconocido: ${n}`,
    themeSet: n => `Tema de la barra: ${n}`,
    hintState: s => `Sugerencia de modelo: ${s}`,
    hintChange: 'Cambia con /usage-band hint on|off',
    hintTight: (l, p) => `${l} al ${p}% y por delante del ritmo: considera un modelo más ligero`,
    langCurrent: n => `Idioma: ${n}`,
    langChange: `Cambia con ${CHANGE_LANG}`,
    langUnknown: c => `Idioma desconocido: ${c}`,
    langSet: n => `Idioma: ${n}`,
    iconsState: n => `Conjunto de iconos: ${n}`,
    iconsChange: 'Cambia con /usage-band icons emoji|beer|fuel|weather|animals',
    iconsUnknown: n => `Conjunto de iconos desconocido: ${n}`,
    iconsSet: n => `Conjunto de iconos: ${n}`,
    runoutState: v => `Estimación de agotamiento: ${v}`,
    runoutChange: 'Cambia con /usage-band runout always|off|0-100',
    runoutUnknown: v => `Ajuste de agotamiento desconocido: ${v}`,
    runoutSet: v => `Estimación de agotamiento: ${v}`,
  },
  pt: {
    name: 'Português',
    five_hour: '5h',
    seven_day: '7d',
    spend_limit: 'gasto',
    day: 'd',
    session: 'sessão',
    usageToast: (l, p) => `Uso de ${l} em ${p}%`,
    themeCurrent: n => `Tema atual: ${n}`,
    themeChange: 'Altere com /usage-band <nome>',
    themeUnknown: n => `Tema desconhecido: ${n}`,
    themeSet: n => `Tema da barra: ${n}`,
    hintState: s => `Sugestão de modelo: ${s}`,
    hintChange: 'Altere com /usage-band hint on|off',
    hintTight: (l, p) => `${l} em ${p}% e adiantado em relação ao ritmo: considere um modelo mais leve`,
    langCurrent: n => `Idioma: ${n}`,
    langChange: `Altere com ${CHANGE_LANG}`,
    langUnknown: c => `Idioma desconhecido: ${c}`,
    langSet: n => `Idioma: ${n}`,
    iconsState: n => `Conjunto de ícones: ${n}`,
    iconsChange: 'Altere com /usage-band icons emoji|beer|fuel|weather|animals',
    iconsUnknown: n => `Conjunto de ícones desconhecido: ${n}`,
    iconsSet: n => `Conjunto de ícones: ${n}`,
    runoutState: v => `Estimativa de esgotamento: ${v}`,
    runoutChange: 'Altere com /usage-band runout always|off|0-100',
    runoutUnknown: v => `Ajuste de esgotamento desconhecido: ${v}`,
    runoutSet: v => `Estimativa de esgotamento: ${v}`,
  },
  nl: {
    name: 'Nederlands',
    five_hour: '5h',
    seven_day: '7d',
    spend_limit: 'uitgaven',
    day: 'd',
    session: 'sessie',
    usageToast: (l, p) => `${l}-gebruik op ${p}%`,
    themeCurrent: n => `Huidig thema: ${n}`,
    themeChange: 'Wijzig met /usage-band <naam>',
    themeUnknown: n => `Onbekend thema: ${n}`,
    themeSet: n => `Thema van de balk: ${n}`,
    hintState: s => `Modelsuggestie: ${s}`,
    hintChange: 'Wijzig met /usage-band hint on|off',
    hintTight: (l, p) => `${l} op ${p}% en voor op schema: overweeg een lichter model`,
    langCurrent: n => `Taal: ${n}`,
    langChange: `Wijzig met ${CHANGE_LANG}`,
    langUnknown: c => `Onbekende taal: ${c}`,
    langSet: n => `Taal: ${n}`,
    iconsState: n => `Iconenset: ${n}`,
    iconsChange: 'Wijzig met /usage-band icons emoji|beer|fuel|weather|animals',
    iconsUnknown: n => `Onbekende iconenset: ${n}`,
    iconsSet: n => `Iconenset: ${n}`,
    runoutState: v => `Schatting van uitputting: ${v}`,
    runoutChange: 'Wijzig met /usage-band runout always|off|0-100',
    runoutUnknown: v => `Onbekende instelling voor uitputting: ${v}`,
    runoutSet: v => `Schatting van uitputting: ${v}`,
  },
  pl: {
    name: 'Polski',
    five_hour: '5h',
    seven_day: '7d',
    spend_limit: 'wydatki',
    day: 'd',
    session: 'sesja',
    usageToast: (l, p) => `Zużycie ${l}: ${p}%`,
    themeCurrent: n => `Bieżący motyw: ${n}`,
    themeChange: 'Zmień poleceniem /usage-band <nazwa>',
    themeUnknown: n => `Nieznany motyw: ${n}`,
    themeSet: n => `Motyw paska: ${n}`,
    hintState: s => `Podpowiedź modelu: ${s}`,
    hintChange: 'Zmień poleceniem /usage-band hint on|off',
    hintTight: (l, p) => `${l}: ${p}% i przed harmonogramem: rozważ lżejszy model`,
    langCurrent: n => `Język: ${n}`,
    langChange: `Zmień poleceniem ${CHANGE_LANG}`,
    langUnknown: c => `Nieznany język: ${c}`,
    langSet: n => `Język: ${n}`,
    iconsState: n => `Zestaw ikon: ${n}`,
    iconsChange: 'Zmień poleceniem /usage-band icons emoji|beer|fuel|weather|animals',
    iconsUnknown: n => `Nieznany zestaw ikon: ${n}`,
    iconsSet: n => `Zestaw ikon: ${n}`,
    runoutState: v => `Szacunek wyczerpania: ${v}`,
    runoutChange: 'Zmień poleceniem /usage-band runout always|off|0-100',
    runoutUnknown: v => `Nieznane ustawienie szacunku wyczerpania: ${v}`,
    runoutSet: v => `Szacunek wyczerpania: ${v}`,
  },
}

export const LANGS = Object.keys(MESSAGES) as Lang[]

export const isLang = (value: unknown): value is Lang =>
  typeof value === 'string' && Object.hasOwn(MESSAGES, value)

// The system language when the plugin has a translation for it, else English.
export const detectLang = (): Lang => {
  try {
    const base = new Intl.DateTimeFormat().resolvedOptions().locale.slice(0, 2).toLowerCase()
    return isLang(base) ? base : 'en'
  } catch {
    return 'en'
  }
}

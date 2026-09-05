import type { Montant } from '@/types'

/* Espace insécable U+00A0, écrite en échappement pour rester lisible en revue.
   U+202F (espace fine) serait plus juste typographiquement, mais Inter ne la rend pas. */
const SEPARATEUR = '\u00A0'

/** `1284500` → `1 284 500` */
export function formaterNombre(valeur: number, decimales = 0): string {
  return valeur
    .toFixed(decimales)
    .replace('.', ',')
    .replace(/\B(?=(\d{3})+(?!\d))/g, SEPARATEUR)
}

/** `{ valeur: 1284500, devise: 'HTG' }` → `1 284 500 HTG` */
export function formaterMontant(montant: Montant, decimales = 0): string {
  return `${formaterNombre(montant.valeur, decimales)}${SEPARATEUR}${montant.devise}`
}

/** `2026-08-28` → `28 août 2026` */
export function formaterDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00`)
  if (Number.isNaN(d.getTime())) return iso
  return new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }).format(d)
}

/** `2026-08-28` → `28 août` — pour les listes où l'année est implicite */
export function formaterDateCourte(iso: string): string {
  const d = new Date(`${iso}T00:00:00`)
  if (Number.isNaN(d.getTime())) return iso
  return new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short' }).format(d)
}

/** Préfixe une variation d'une flèche : `12` → `↑ 12%`, `-0.8` → `↓ 0,8` */
export function formaterVariation(valeur: number, suffixe = '%'): string {
  const fleche = valeur >= 0 ? '↑' : '↓'
  return `${fleche} ${formaterNombre(Math.abs(valeur), Number.isInteger(valeur) ? 0 : 1)}${suffixe}`
}

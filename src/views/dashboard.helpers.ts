export { ETAPE_LABEL, TYPE_DOSSIER_LABEL } from '@/types'

/** « Nadège Saint-Fleur » → « Nadège » */
export function utilisateurPrenom(nomComplet: string): string {
  return nomComplet.split(' ')[0] ?? nomComplet
}

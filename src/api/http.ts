/**
 * Couche d'accès aux données.
 *
 * Tant que `VITE_API_BASE_URL` est vide, l'application sert les données de
 * démonstration de `src/api/mock`. Dès que le backend est en ligne, il suffit
 * de renseigner la variable dans `.env` : aucun composant ni store ne change,
 * ils appellent tous `request()` sans savoir d'où viennent les données.
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

/** `true` tant qu'aucun backend n'est configuré. */
export const EN_MODE_DEMO = BASE_URL.trim() === ''

export class ApiError extends Error {
  constructor(
    message: string,
    readonly statut: number,
    readonly corps?: unknown,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

/** Latence simulée, pour que les états de chargement soient réellement visibles. */
const LATENCE_DEMO_MS = 260

function attendre(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/** Résolveurs de démonstration, enregistrés par `src/api/mock/index.ts`. */
type Resolveur = (params?: Record<string, unknown>) => unknown
const resolveursDemo = new Map<string, Resolveur>()

export function enregistrerDemo(chemin: string, resolveur: Resolveur): void {
  resolveursDemo.set(chemin, resolveur)
}

export interface OptionsRequete {
  methode?: 'GET' | 'POST' | 'PATCH' | 'DELETE'
  params?: Record<string, unknown>
  corps?: unknown
  signal?: AbortSignal
}

/**
 * Appelle le backend, ou son substitut de démonstration.
 *
 * @param chemin Chemin de l'endpoint, sans l'URL de base : `/dossiers`.
 */
export async function request<T>(chemin: string, options: OptionsRequete = {}): Promise<T> {
  const { methode = 'GET', params, corps, signal } = options

  if (EN_MODE_DEMO) {
    await attendre(LATENCE_DEMO_MS)
    if (signal?.aborted) throw new ApiError('Requête annulée', 0)

    const resolveur = resolveursDemo.get(`${methode} ${chemin}`) ?? resolveursDemo.get(chemin)
    if (!resolveur) {
      throw new ApiError(
        `Aucune donnée de démonstration pour ${methode} ${chemin}. ` +
          `Ajoutez un résolveur dans src/api/mock/index.ts.`,
        404,
      )
    }
    return resolveur(params) as T
  }

  const url = new URL(chemin.replace(/^\//, ''), BASE_URL.endsWith('/') ? BASE_URL : `${BASE_URL}/`)
  if (params) {
    for (const [cle, valeur] of Object.entries(params)) {
      if (valeur !== undefined && valeur !== null && valeur !== '') {
        url.searchParams.set(cle, String(valeur))
      }
    }
  }

  const reponse = await fetch(url, {
    method: methode,
    signal,
    headers: { Accept: 'application/json', ...(corps ? { 'Content-Type': 'application/json' } : {}) },
    body: corps ? JSON.stringify(corps) : undefined,
  })

  if (!reponse.ok) {
    let details: unknown
    try { details = await reponse.json() } catch { /* réponse sans corps JSON */ }
    throw new ApiError(`${methode} ${chemin} — ${reponse.status}`, reponse.status, details)
  }

  if (reponse.status === 204) return undefined as T
  return (await reponse.json()) as T
}

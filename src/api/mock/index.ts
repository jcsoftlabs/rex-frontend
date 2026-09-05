/**
 * Branche les données de démonstration sur la couche `request()`.
 *
 * Chaque entrée décrit un endpoint que le backend devra exposer avec la même
 * forme de réponse. Ce fichier est le cahier des charges de l'API, et il
 * disparaîtra du chemin d'exécution dès que `VITE_API_BASE_URL` sera renseignée.
 */

import { enregistrerDemo } from '../http'
import {
  clients, dashboard, devis, dossiers, factures, paiements, prospects, utilisateurCourant,
} from './donnees'

function filtrer<T extends Record<string, any>>(
  liste: T[],
  params: Record<string, unknown> | undefined,
  champsTexte: (keyof T)[],
): T[] {
  if (!params) return liste
  let resultat = liste

  const recherche = String(params.recherche ?? '').trim().toLowerCase()
  if (recherche) {
    resultat = resultat.filter((item) =>
      champsTexte.some((champ) => String(item[champ] ?? '').toLowerCase().includes(recherche)),
    )
  }
  for (const champ of ['statut', 'type', 'etapeCourante'] as const) {
    const valeur = params[champ]
    if (valeur) resultat = resultat.filter((item) => item[champ] === valeur)
  }
  return resultat
}

enregistrerDemo('/moi', () => utilisateurCourant)
enregistrerDemo('/dashboard', () => dashboard)

enregistrerDemo('/dossiers', (params) => {
  const items = filtrer(dossiers, params, ['reference', 'clientNom'])
  return { items, total: items.length, page: 1, parPage: items.length }
})
enregistrerDemo('/dossiers/:id', (params) => {
  const dossier = dossiers.find((d) => d.id === params?.id || d.reference === params?.id)
  if (!dossier) throw new Error(`Dossier introuvable : ${String(params?.id)}`)
  return dossier
})

enregistrerDemo('/clients', (params) => {
  const items = filtrer(clients, params, ['nom', 'contact', 'email'])
  return { items, total: items.length, page: 1, parPage: items.length }
})
enregistrerDemo('/clients/:id', (params) => {
  const client = clients.find((c) => c.id === params?.id)
  if (!client) throw new Error(`Client introuvable : ${String(params?.id)}`)
  return client
})

enregistrerDemo('/factures', (params) => {
  const items = filtrer(factures, params, ['reference', 'clientNom'])
  return { items, total: items.length, page: 1, parPage: items.length }
})
enregistrerDemo('/devis', (params) => {
  const items = filtrer(devis, params, ['reference', 'clientNom'])
  return { items, total: items.length, page: 1, parPage: items.length }
})
enregistrerDemo('/paiements', () => ({
  items: paiements, total: paiements.length, page: 1, parPage: paiements.length,
}))
enregistrerDemo('/prospects', () => ({
  items: prospects, total: prospects.length, page: 1, parPage: prospects.length,
}))

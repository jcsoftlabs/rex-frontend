/**
 * Points d'entrée typés de l'API.
 *
 * Les stores et les composants n'appellent jamais `request()` directement :
 * ils passent par ces fonctions, qui portent les types de retour attendus.
 */

import { request } from '../http'
import type {
  Client, Dashboard, Devis, Dossier, Facture, Paginated, Paiement, Prospect, Utilisateur,
} from '@/types'

export interface FiltresListe {
  /** Champs libres : le backend ignore ceux qu'il ne connaît pas. */
  [cle: string]: unknown
  recherche?: string
  statut?: string
  type?: string
  etapeCourante?: string
  page?: number
}

export const api = {
  moi: () => request<Utilisateur>('/moi'),

  dashboard: () => request<Dashboard>('/dashboard'),

  dossiers: (filtres?: FiltresListe) =>
    request<Paginated<Dossier>>('/dossiers', { params: filtres }),
  dossier: (id: string) =>
    request<Dossier>('/dossiers/:id', { params: { id } }),

  clients: (filtres?: FiltresListe) =>
    request<Paginated<Client>>('/clients', { params: filtres }),
  client: (id: string) =>
    request<Client>('/clients/:id', { params: { id } }),

  factures: (filtres?: FiltresListe) =>
    request<Paginated<Facture>>('/factures', { params: filtres }),
  devis: (filtres?: FiltresListe) =>
    request<Paginated<Devis>>('/devis', { params: filtres }),
  paiements: () => request<Paginated<Paiement>>('/paiements'),
  prospects: () => request<Paginated<Prospect>>('/prospects'),
}

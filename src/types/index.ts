/**
 * Modèle métier de la plateforme Rex.
 *
 * Ces types sont le contrat attendu du backend. Quand l'API réelle arrivera,
 * c'est ici qu'on ajuste — et TypeScript signalera aussitôt tous les endroits
 * de l'application qui ne correspondent plus.
 */

/* ------------------------------------------------------------------ */
/* Communs                                                             */
/* ------------------------------------------------------------------ */

/** Identifiant opaque renvoyé par le backend. */
export type Id = string

/** Rex facture en gourdes et en dollars : le montant porte toujours sa devise. */
export type Devise = 'HTG' | 'USD'

export interface Montant {
  valeur: number
  devise: Devise
}

/** Date ISO 8601 (`2026-09-05`). Le formatage est fait à l'affichage. */
export type DateISO = string

export interface Paginated<T> {
  items: T[]
  total: number
  page: number
  parPage: number
}

/* ------------------------------------------------------------------ */
/* Dossiers de dédouanement                                            */
/* ------------------------------------------------------------------ */

/**
 * Les six étapes du parcours de dédouanement, dans l'ordre.
 * L'ordre du tableau fait foi : la progression d'un dossier s'en déduit.
 */
export const ETAPES = [
  'arrivee',
  'declaration',
  'inspection',
  'paiement_droits',
  'mainlevee',
  'livraison',
] as const

export type Etape = (typeof ETAPES)[number]

export const ETAPE_LABEL: Record<Etape, string> = {
  arrivee: 'Arrivée',
  declaration: 'Déclaration',
  inspection: 'Inspection',
  paiement_droits: 'Paiement des droits',
  mainlevee: 'Mainlevée',
  livraison: 'Livraison',
}

export type StatutDossier = 'en_cours' | 'en_retard' | 'prioritaire' | 'pret' | 'cloture'

export const STATUT_LABEL: Record<StatutDossier, string> = {
  en_cours: 'En cours',
  en_retard: 'En retard',
  prioritaire: 'Prioritaire',
  pret: 'Prêt',
  cloture: 'Clôturé',
}

export type TypeDossier = 'importation' | 'exportation' | 'transit' | 'franchise'

export const TYPE_DOSSIER_LABEL: Record<TypeDossier, string> = {
  importation: 'Importation',
  exportation: 'Exportation',
  transit: 'Transit',
  franchise: 'Franchise',
}

/** Une étape franchie (ou non) dans la vie d'un dossier. */
export interface EtapeDossier {
  etape: Etape
  /** Renseignée dès que l'étape est franchie ; `null` tant qu'elle est à venir. */
  dateFranchie: DateISO | null
  note?: string
}

export interface Marchandise {
  designation: string
  quantite: number
  unite: string
  /** Code du Système harmonisé, si déjà déterminé. */
  codeSH?: string
  poidsKg?: number
  valeur: Montant
}

export type StatutDocument = 'fourni' | 'manquant' | 'a_verifier'

export interface DocumentDossier {
  id: Id
  nom: string
  statut: StatutDocument
  /** Un dossier ne peut pas être déclaré tant qu'un document requis manque. */
  requis: boolean
  deposeLe?: DateISO
}

export interface Dossier {
  id: Id
  /** Référence lisible affichée partout : `RX-2609-014`. */
  reference: string
  clientId: Id
  clientNom: string
  type: TypeDossier
  statut: StatutDossier
  etapeCourante: Etape
  etapes: EtapeDossier[]
  marchandises: Marchandise[]
  documents: DocumentDossier[]
  valeurCIF: Montant
  droitsEstimes: Montant
  honoraires: Montant
  /** Débours avancés par Rex pour le compte du client, à refacturer. */
  debours: Montant
  dateArrivee: DateISO
  /** Jours écoulés dans l'étape courante — sert au repérage des blocages. */
  joursDansEtape: number
  transporteur?: string
  numeroBL?: string
}

/* ------------------------------------------------------------------ */
/* Clients et prospects                                                */
/* ------------------------------------------------------------------ */

export interface Client {
  id: Id
  nom: string
  /** Numéro d'identification fiscale. */
  nif?: string
  patente?: string
  contact: string
  email: string
  telephone: string
  adresse?: string
  /** Total avancé par Rex et pas encore remboursé, tous dossiers confondus. */
  soldeDebours: Montant
  dossiersActifs: number
  clientDepuis: DateISO
}

export type StatutProspect = 'nouveau' | 'devis_envoye' | 'relance' | 'gagne' | 'perdu'

export interface Prospect {
  id: Id
  nom: string
  contact: string
  email: string
  origine: string
  statut: StatutProspect
  derniereRelance?: DateISO
  nombreRelances: number
}

/* ------------------------------------------------------------------ */
/* Devis, factures, paiements                                          */
/* ------------------------------------------------------------------ */

export type StatutDevis = 'brouillon' | 'envoye' | 'accepte' | 'refuse' | 'expire'

export interface LigneDocument {
  designation: string
  quantite: number
  prixUnitaire: Montant
  /** Un débours est avancé pour le client ; il n'entre pas dans le CA de Rex. */
  estDebours: boolean
}

export interface Devis {
  id: Id
  reference: string
  clientId: Id
  clientNom: string
  statut: StatutDevis
  lignes: LigneDocument[]
  total: Montant
  emisLe: DateISO
  valableJusquau: DateISO
  nombreRelances: number
}

export type StatutFacture = 'brouillon' | 'emise' | 'payee' | 'partielle' | 'echue' | 'annulee'

export const STATUT_FACTURE_LABEL: Record<StatutFacture, string> = {
  brouillon: 'Brouillon',
  emise: 'Émise',
  payee: 'Payée',
  partielle: 'Partiellement payée',
  echue: 'Échue',
  annulee: 'Annulée',
}

export interface Facture {
  id: Id
  reference: string
  clientId: Id
  clientNom: string
  dossierId?: Id
  dossierReference?: string
  statut: StatutFacture
  lignes: LigneDocument[]
  /** Prestation de Rex — c'est la part qui constitue son chiffre d'affaires. */
  honoraires: Montant
  /** Sommes avancées et refacturées à l'identique. */
  debours: Montant
  total: Montant
  montantPaye: Montant
  emiseLe: DateISO
  echeanceLe: DateISO
  /** Positif si l'échéance est dépassée, 0 sinon. */
  joursRetard: number
}

export type MoyenPaiement = 'virement' | 'cheque' | 'especes' | 'mobile'

export interface Paiement {
  id: Id
  factureId: Id
  factureReference: string
  clientNom: string
  montant: Montant
  moyen: MoyenPaiement
  recuLe: DateISO
  reference?: string
}

/* ------------------------------------------------------------------ */
/* Tableau de bord                                                     */
/* ------------------------------------------------------------------ */

/** Volume observé sur une étape du parcours, pour le graphique de flux. */
export interface FluxEtape {
  etape: Etape
  /** Dossiers ayant franchi cette étape sur la période. */
  passes: number
  /** Dossiers actuellement arrêtés à cette étape. */
  enAttente: number
  /** Parmi ceux en attente, combien dépassent le délai cible. */
  enRetard: number
  delaiMoyenJours: number
}

export interface PointCA {
  periode: string
  honoraires: number
  debours: number
}

export interface TrancheCreance {
  libelle: string
  montant: Montant
  /** Part du total dû, en pourcentage. */
  part: number
}

export type NiveauAlerte = 'critique' | 'attention' | 'info' | 'succes'

export interface Alerte {
  id: Id
  niveau: NiveauAlerte
  titre: string
  detail: string
  /** Formulé pour l'affichage : « 20 min », « 12 j ». */
  depuis: string
  lien?: string
}

export interface StatsDashboard {
  dossiersEnCours: number
  dossiersEnCoursVariation: number
  deboursNonRembourses: Montant
  deboursDossiersConcernes: number
  facturesImpayees: number
  montantImpaye: Montant
  delaiMoyenJours: number
  delaiMoyenVariation: number
  chiffreAffaires: Montant
  chiffreAffairesVariation: number
  honorairesPeriode: Montant
}

export interface Dashboard {
  stats: StatsDashboard
  flux: FluxEtape[]
  chiffreAffaires: PointCA[]
  creances: TrancheCreance[]
  repartitionTypes: { type: TypeDossier; part: number }[]
  alertes: Alerte[]
  dossiersActifs: Dossier[]
  /** Dossier mis en avant dans le panneau latéral. */
  dossierEnAvant: Dossier | null
}

/* ------------------------------------------------------------------ */
/* Utilisateurs                                                        */
/* ------------------------------------------------------------------ */

export type Role = 'direction' | 'declarant' | 'comptable' | 'agent'

export const ROLE_LABEL: Record<Role, string> = {
  direction: 'Direction',
  declarant: 'Déclarant',
  comptable: 'Comptable',
  agent: 'Agent',
}

export interface Utilisateur {
  id: Id
  nom: string
  email: string
  role: Role
  initiales: string
}

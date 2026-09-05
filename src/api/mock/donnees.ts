/**
 * Données de démonstration.
 *
 * Entièrement fictives : noms de clients, références, montants. Elles servent à
 * développer et valider les écrans avant l'arrivée du backend, et disparaîtront
 * dès que `VITE_API_BASE_URL` sera renseignée.
 */

import type {
  Alerte, Client, Dashboard, Devis, Dossier, Facture, Paiement, Prospect, Utilisateur,
} from '@/types'

const htg = (valeur: number) => ({ valeur, devise: 'HTG' as const })
const usd = (valeur: number) => ({ valeur, devise: 'USD' as const })

export const utilisateurCourant: Utilisateur = {
  id: 'u1',
  nom: 'Nadège Saint-Fleur',
  email: 'nadege@rex.ht',
  role: 'direction',
  initiales: 'NS',
}

export const clients: Client[] = [
  { id: 'c1', nom: 'Groupe Bélizaire', nif: '003-456-789-0', patente: 'PT-2024-118', contact: 'Marc Bélizaire', email: 'contact@belizaire.ht', telephone: '+509 3701 4422', adresse: 'Route de Delmas 33, Port-au-Prince', soldeDebours: htg(486000), dossiersActifs: 3, clientDepuis: '2023-04-12' },
  { id: 'c2', nom: 'Delva Import SA', nif: '003-221-905-4', patente: 'PT-2023-042', contact: 'Sherline Delva', email: 'admin@delvaimport.ht', telephone: '+509 3644 1180', adresse: 'Rue Capois 14, Port-au-Prince', soldeDebours: htg(312500), dossiersActifs: 2, clientDepuis: '2022-11-03' },
  { id: 'c3', nom: 'Pharma Caraïbes', nif: '003-778-114-2', patente: 'PT-2025-006', contact: 'Dr. Yves Moïse', email: 'logistique@pharmacaraibes.ht', telephone: '+509 2812 5590', adresse: 'Boulevard Toussaint, Cap-Haïtien', soldeDebours: htg(204000), dossiersActifs: 2, clientDepuis: '2024-02-19' },
  { id: 'c4', nom: 'Ets Jean-Louis', nif: '003-119-620-7', patente: 'PT-2022-233', contact: 'Ricardo Jean-Louis', email: 'rjl@etsjeanlouis.ht', telephone: '+509 3955 7014', adresse: 'Carrefour, Ouest', soldeDebours: htg(182000), dossiersActifs: 1, clientDepuis: '2021-07-30' },
  { id: 'c5', nom: 'Sogebank Services', nif: '003-900-455-1', patente: 'PT-2024-501', contact: 'Farah Pierre', email: 'achats@sogebankservices.ht', telephone: '+509 2229 3300', adresse: 'Delmas 30, Port-au-Prince', soldeDebours: htg(100000), dossiersActifs: 1, clientDepuis: '2023-09-08' },
]

/** Construit la liste des six étapes, les `franchies` premières étant validées. */
function etapes(franchies: number, dates: (string | null)[]) {
  const ordre = ['arrivee', 'declaration', 'inspection', 'paiement_droits', 'mainlevee', 'livraison'] as const
  return ordre.map((etape, i) => ({
    etape,
    dateFranchie: i < franchies ? (dates[i] ?? null) : null,
  }))
}

export const dossiers: Dossier[] = [
  {
    id: 'd1', reference: 'RX-2609-014', clientId: 'c1', clientNom: 'Groupe Bélizaire',
    type: 'importation', statut: 'en_retard', etapeCourante: 'inspection',
    etapes: etapes(2, ['2026-08-28', '2026-08-30']),
    marchandises: [{ designation: 'Riz blanc long grain', quantite: 2, unite: 'conteneur 40\'', codeSH: '1006.30', poidsKg: 48000, valeur: usd(82400) }],
    documents: [
      { id: 'doc1', nom: 'Facture commerciale', statut: 'manquant', requis: true },
      { id: 'doc2', nom: 'Packing list', statut: 'fourni', requis: true, deposeLe: '2026-08-28' },
      { id: 'doc3', nom: 'Connaissement (BL)', statut: 'fourni', requis: true, deposeLe: '2026-08-28' },
      { id: 'doc4', nom: 'NIF & patente', statut: 'fourni', requis: true, deposeLe: '2026-08-28' },
    ],
    valeurCIF: usd(82400), droitsEstimes: htg(1236000), honoraires: usd(4250), debours: htg(486000),
    dateArrivee: '2026-08-28', joursDansEtape: 3, transporteur: 'CMA CGM', numeroBL: 'CMAU-4471902',
  },
  {
    id: 'd2', reference: 'RX-2609-011', clientId: 'c2', clientNom: 'Delva Import SA',
    type: 'importation', statut: 'en_cours', etapeCourante: 'paiement_droits',
    etapes: etapes(3, ['2026-08-30', '2026-09-01', '2026-09-03']),
    marchandises: [{ designation: 'Pièces automobiles', quantite: 1, unite: 'conteneur 20\'', codeSH: '8708.99', poidsKg: 12400, valeur: usd(34800) }],
    documents: [
      { id: 'doc5', nom: 'Facture commerciale', statut: 'fourni', requis: true, deposeLe: '2026-08-30' },
      { id: 'doc6', nom: 'Packing list', statut: 'fourni', requis: true, deposeLe: '2026-08-30' },
      { id: 'doc7', nom: 'Connaissement (BL)', statut: 'fourni', requis: true, deposeLe: '2026-08-30' },
    ],
    valeurCIF: usd(34800), droitsEstimes: htg(412500), honoraires: usd(1890), debours: htg(312500),
    dateArrivee: '2026-08-30', joursDansEtape: 2, transporteur: 'Maersk', numeroBL: 'MAEU-8830117',
  },
  {
    id: 'd3', reference: 'RX-2609-009', clientId: 'c3', clientNom: 'Pharma Caraïbes',
    type: 'importation', statut: 'en_cours', etapeCourante: 'declaration',
    etapes: etapes(1, ['2026-09-02']),
    marchandises: [{ designation: 'Produits pharmaceutiques', quantite: 320, unite: 'carton', codeSH: '3004.90', poidsKg: 4100, valeur: usd(61200) }],
    documents: [
      { id: 'doc8', nom: 'Facture commerciale', statut: 'fourni', requis: true, deposeLe: '2026-09-02' },
      { id: 'doc9', nom: 'Autorisation MSPP', statut: 'a_verifier', requis: true, deposeLe: '2026-09-03' },
      { id: 'doc10', nom: 'Packing list', statut: 'fourni', requis: true, deposeLe: '2026-09-02' },
    ],
    valeurCIF: usd(61200), droitsEstimes: htg(688000), honoraires: usd(3120), debours: htg(204000),
    dateArrivee: '2026-09-02', joursDansEtape: 1, transporteur: 'Seaboard Marine', numeroBL: 'SEAU-2210554',
  },
  {
    id: 'd4', reference: 'RX-2609-007', clientId: 'c4', clientNom: 'Ets Jean-Louis',
    type: 'importation', statut: 'prioritaire', etapeCourante: 'mainlevee',
    etapes: etapes(4, ['2026-08-24', '2026-08-26', '2026-08-29', '2026-09-01']),
    marchandises: [{ designation: 'Matériaux de construction', quantite: 3, unite: 'conteneur 40\'', codeSH: '6810.11', poidsKg: 66000, valeur: usd(51900) }],
    documents: [
      { id: 'doc11', nom: 'Facture commerciale', statut: 'fourni', requis: true, deposeLe: '2026-08-24' },
      { id: 'doc12', nom: 'Packing list', statut: 'fourni', requis: true, deposeLe: '2026-08-24' },
      { id: 'doc13', nom: 'Certificat d\'origine', statut: 'fourni', requis: false, deposeLe: '2026-08-25' },
    ],
    valeurCIF: usd(51900), droitsEstimes: htg(742000), honoraires: usd(2470), debours: htg(182000),
    dateArrivee: '2026-08-24', joursDansEtape: 5, transporteur: 'CMA CGM', numeroBL: 'CMAU-4468831',
  },
  {
    id: 'd5', reference: 'RX-2609-004', clientId: 'c5', clientNom: 'Sogebank Services',
    type: 'franchise', statut: 'pret', etapeCourante: 'livraison',
    etapes: etapes(5, ['2026-08-20', '2026-08-22', '2026-08-25', '2026-08-28', '2026-09-04']),
    marchandises: [{ designation: 'Équipement informatique', quantite: 84, unite: 'unité', codeSH: '8471.30', poidsKg: 980, valeur: usd(28400) }],
    documents: [
      { id: 'doc14', nom: 'Facture commerciale', statut: 'fourni', requis: true, deposeLe: '2026-08-20' },
      { id: 'doc15', nom: 'Franchise douanière', statut: 'fourni', requis: true, deposeLe: '2026-08-21' },
    ],
    valeurCIF: usd(28400), droitsEstimes: htg(0), honoraires: usd(980), debours: htg(100000),
    dateArrivee: '2026-08-20', joursDansEtape: 1, transporteur: 'Amerijet', numeroBL: 'AJT-771290',
  },
]

export const factures: Facture[] = [
  { id: 'f1', reference: 'FA-2609-032', clientId: 'c2', clientNom: 'Delva Import SA', dossierId: 'd2', dossierReference: 'RX-2609-011', statut: 'echue', lignes: [], honoraires: htg(74000), debours: htg(112000), total: htg(186000), montantPaye: htg(0), emiseLe: '2026-08-12', echeanceLe: '2026-08-24', joursRetard: 12 },
  { id: 'f2', reference: 'FA-2609-031', clientId: 'c1', clientNom: 'Groupe Bélizaire', dossierId: 'd1', dossierReference: 'RX-2609-014', statut: 'emise', lignes: [], honoraires: htg(96000), debours: htg(0), total: htg(96000), montantPaye: htg(0), emiseLe: '2026-08-30', echeanceLe: '2026-09-14', joursRetard: 0 },
  { id: 'f3', reference: 'FA-2609-029', clientId: 'c3', clientNom: 'Pharma Caraïbes', statut: 'partielle', lignes: [], honoraires: htg(58000), debours: htg(34000), total: htg(92000), montantPaye: htg(50000), emiseLe: '2026-08-05', echeanceLe: '2026-08-20', joursRetard: 16 },
  { id: 'f4', reference: 'FA-2609-026', clientId: 'c4', clientNom: 'Ets Jean-Louis', statut: 'echue', lignes: [], honoraires: htg(22000), debours: htg(12000), total: htg(34000), montantPaye: htg(0), emiseLe: '2026-07-02', echeanceLe: '2026-07-17', joursRetard: 50 },
  { id: 'f5', reference: 'FA-2609-018', clientId: 'c5', clientNom: 'Sogebank Services', statut: 'payee', lignes: [], honoraires: htg(41000), debours: htg(19000), total: htg(60000), montantPaye: htg(60000), emiseLe: '2026-08-18', echeanceLe: '2026-09-02', joursRetard: 0 },
  { id: 'f6', reference: 'FA-2608-014', clientId: 'c1', clientNom: 'Groupe Bélizaire', statut: 'echue', lignes: [], honoraires: htg(12000), debours: htg(6000), total: htg(18000), montantPaye: htg(0), emiseLe: '2026-05-28', echeanceLe: '2026-06-12', joursRetard: 85 },
  { id: 'f7', reference: 'FA-2609-034', clientId: 'c3', clientNom: 'Pharma Caraïbes', statut: 'emise', lignes: [], honoraires: htg(44000), debours: htg(28000), total: htg(72000), montantPaye: htg(0), emiseLe: '2026-09-03', echeanceLe: '2026-09-18', joursRetard: 0 },
]

export const devis: Devis[] = [
  { id: 'dv1', reference: 'DV-2609-018', clientId: 'c3', clientNom: 'Pharma Caraïbes', statut: 'envoye', lignes: [], total: htg(148000), emisLe: '2026-08-28', valableJusquau: '2026-09-27', nombreRelances: 2 },
  { id: 'dv2', reference: 'DV-2609-017', clientId: 'c1', clientNom: 'Groupe Bélizaire', statut: 'accepte', lignes: [], total: htg(320000), emisLe: '2026-08-26', valableJusquau: '2026-09-25', nombreRelances: 0 },
  { id: 'dv3', reference: 'DV-2609-015', clientId: 'c2', clientNom: 'Delva Import SA', statut: 'envoye', lignes: [], total: htg(96000), emisLe: '2026-09-01', valableJusquau: '2026-10-01', nombreRelances: 1 },
  { id: 'dv4', reference: 'DV-2608-011', clientId: 'c4', clientNom: 'Ets Jean-Louis', statut: 'expire', lignes: [], total: htg(64000), emisLe: '2026-07-14', valableJusquau: '2026-08-13', nombreRelances: 3 },
]

export const paiements: Paiement[] = [
  { id: 'p1', factureId: 'f5', factureReference: 'FA-2609-018', clientNom: 'Sogebank Services', montant: htg(60000), moyen: 'virement', recuLe: '2026-08-29', reference: 'VIR-88213' },
  { id: 'p2', factureId: 'f3', factureReference: 'FA-2609-029', clientNom: 'Pharma Caraïbes', montant: htg(50000), moyen: 'cheque', recuLe: '2026-08-22', reference: 'CHQ-004512' },
  { id: 'p3', factureId: 'f1', factureReference: 'FA-2609-030', clientNom: 'Groupe Bélizaire', montant: htg(120000), moyen: 'virement', recuLe: '2026-08-15', reference: 'VIR-87904' },
  { id: 'p4', factureId: 'f2', factureReference: 'FA-2608-027', clientNom: 'Delva Import SA', montant: htg(88000), moyen: 'mobile', recuLe: '2026-08-08', reference: 'MON-33188' },
]

export const prospects: Prospect[] = [
  { id: 'pr1', nom: 'Caribbean Foods SA', contact: 'Judith Alcé', email: 'j.alce@caribfoods.ht', origine: 'Recommandation', statut: 'devis_envoye', derniereRelance: '2026-09-01', nombreRelances: 1 },
  { id: 'pr2', nom: 'Métal Plus', contact: 'Wilner Joseph', email: 'contact@metalplus.ht', origine: 'Site web', statut: 'nouveau', nombreRelances: 0 },
  { id: 'pr3', nom: 'Agro Nord', contact: 'Rose-Laure Cadet', email: 'rl.cadet@agronord.ht', origine: 'Salon logistique', statut: 'relance', derniereRelance: '2026-08-27', nombreRelances: 2 },
]

const alertes: Alerte[] = [
  { id: 'a1', niveau: 'critique', titre: 'Document manquant', detail: 'RX-2609-014 · Facture commerciale', depuis: '20 min', lien: '/dossiers/d1' },
  { id: 'a2', niveau: 'attention', titre: 'Facture échue', detail: 'FA-2609-032 · Delva Import · 186 000 HTG', depuis: '12 j', lien: '/factures' },
  { id: 'a3', niveau: 'info', titre: 'Droits à payer aujourd\'hui', detail: 'RX-2609-011 · 412 500 HTG', depuis: '2 h', lien: '/dossiers/d2' },
  { id: 'a4', niveau: 'succes', titre: 'Devis sans réponse', detail: 'DV-2609-018 · Pharma Caraïbes · relancé 2×', depuis: '4 j', lien: '/devis' },
]

export const dashboard: Dashboard = {
  stats: {
    dossiersEnCours: 24,
    dossiersEnCoursVariation: 9,
    deboursNonRembourses: htg(1284500),
    deboursDossiersConcernes: 9,
    facturesImpayees: 7,
    montantImpaye: htg(412000),
    delaiMoyenJours: 6.2,
    delaiMoyenVariation: -0.8,
    chiffreAffaires: usd(18450),
    chiffreAffairesVariation: 12,
    honorairesPeriode: usd(11200),
  },
  flux: [
    { etape: 'arrivee', passes: 62, enAttente: 6, enRetard: 1, delaiMoyenJours: 1.2 },
    { etape: 'declaration', passes: 58, enAttente: 5, enRetard: 2, delaiMoyenJours: 1.8 },
    { etape: 'inspection', passes: 51, enAttente: 4, enRetard: 2, delaiMoyenJours: 2.4 },
    { etape: 'paiement_droits', passes: 44, enAttente: 4, enRetard: 1, delaiMoyenJours: 1.5 },
    { etape: 'mainlevee', passes: 39, enAttente: 3, enRetard: 0, delaiMoyenJours: 0.9 },
    { etape: 'livraison', passes: 35, enAttente: 2, enRetard: 0, delaiMoyenJours: 1.1 },
  ],
  chiffreAffaires: [
    { periode: 'Avr', honoraires: 7200, debours: 4100 },
    { periode: 'Mai', honoraires: 7900, debours: 4600 },
    { periode: 'Juin', honoraires: 8400, debours: 5200 },
    { periode: 'Juil', honoraires: 9100, debours: 5800 },
    { periode: 'Août', honoraires: 9800, debours: 6650 },
    { periode: 'Sept', honoraires: 11200, debours: 7250 },
  ],
  creances: [
    { libelle: '0 – 30 jours', montant: htg(268000), part: 65 },
    { libelle: '31 – 60 jours', montant: htg(92000), part: 22 },
    { libelle: '61 – 90 jours', montant: htg(34000), part: 8 },
    { libelle: 'Plus de 90 jours', montant: htg(18000), part: 5 },
  ],
  repartitionTypes: [
    { type: 'importation', part: 52 },
    { type: 'exportation', part: 21 },
    { type: 'transit', part: 15 },
    { type: 'franchise', part: 12 },
  ],
  alertes,
  dossiersActifs: dossiers,
  dossierEnAvant: dossiers[0],
}

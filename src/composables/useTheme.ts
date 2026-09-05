import { readonly, ref } from 'vue'

export type Theme = 'light' | 'dark'

const CLE_STOCKAGE = 'rex-theme'

function lireStockage(): Theme | null {
  try {
    const valeur = localStorage.getItem(CLE_STOCKAGE)
    return valeur === 'light' || valeur === 'dark' ? valeur : null
  } catch {
    // Navigation privée ou stockage bloqué : on retombe sur la préférence système.
    return null
  }
}

/** `index.html` a déjà posé l'attribut avant le premier rendu ; on le relit. */
const theme = ref<Theme>(
  (document.documentElement.getAttribute('data-theme') as Theme | null) ?? 'dark',
)

function appliquer(valeur: Theme): void {
  theme.value = valeur
  document.documentElement.setAttribute('data-theme', valeur)
}

export function basculerTheme(): void {
  const suivant: Theme = theme.value === 'light' ? 'dark' : 'light'
  appliquer(suivant)
  try {
    localStorage.setItem(CLE_STOCKAGE, suivant)
  } catch {
    // Le choix ne sera pas retenu d'une visite à l'autre, mais l'application fonctionne.
  }
}

/* Tant que l'utilisateur n'a rien choisi explicitement, on suit le système. */
if (window.matchMedia) {
  const mq = window.matchMedia('(prefers-color-scheme: light)')
  const surChangement = (e: MediaQueryListEvent) => {
    if (lireStockage()) return
    appliquer(e.matches ? 'light' : 'dark')
  }
  mq.addEventListener?.('change', surChangement)
}

export function useTheme() {
  return { theme: readonly(theme), basculerTheme }
}

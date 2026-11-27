import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// base relative : le dossier dist/ fonctionne à la racine d'un domaine
// comme dans un sous-dossier (GitHub Pages, hébergement mutualisé…).
export default defineConfig({
  base: './',
  plugins: [react()],
  define: {
    // Année du pied de page, figée à la compilation : le HTML prérendu et le
    // navigateur affichent la même valeur (sinon React signale un écart).
    __BUILD_YEAR__: JSON.stringify(new Date().getFullYear()),
  },
})

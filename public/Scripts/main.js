// Este es el punto de entrada principal para Vite
import { userManager } from './config.js'
import './Index.js'
import './ProductsPage.js'
import './movementsPage.js'
import './reportsPage.js'

// Hacer disponible globalmente para HTML
window.userManager = userManager

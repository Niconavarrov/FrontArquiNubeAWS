// ============================================
// CONFIGURACIÓN DE API GATEWAY
// ============================================
// Cambia esta URL por la URL de tu API Gateway en AWS

export const API_BASE_URL = 'https://tg4ha3pxcd.execute-api.us-east-1.amazonaws.com/dev';

export const ENDPOINTS = {
    PRODUCTS: `${API_BASE_URL}/products`,
    PRODUCTS_SEARCH: `${API_BASE_URL}/products/search`,
    MOVEMENTS: `${API_BASE_URL}/movements`,
    REPORTS: `${API_BASE_URL}/reports`,
};


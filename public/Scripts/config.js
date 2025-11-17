import { UserManager } from 'oidc-client-ts';

// ============================================
// CONFIGURACIÓN DE COGNITO CON OIDC - CLIENT SECRET
// ============================================

// Obtener la URL base de la aplicación (funciona tanto en localhost como en S3)
// Como es un sitio estático, siempre usamos window.location
const getBaseUrl = () => {
    if (typeof window === 'undefined' || !window.location) {
        throw new Error('window.location no está disponible. Este código debe ejecutarse en el navegador.');
    }
    return `${window.location.protocol}//${window.location.host}`;
};

const BASE_URL = getBaseUrl();

const cognitoAuthConfig = {
    authority: "https://cognito-idp.us-east-1.amazonaws.com/us-east-1_rNAarCaQI",
    client_id: "6gh6mi02h02dgli3adr2va12ev",
    client_secret: "1e3f3v5ujislchi1asgcfnbqtvoovhdf3d2ir513jhdsbl2e0ocj", // Tu client secret
    redirect_uri: `${BASE_URL}/callback.html`,
    response_type: "code",
    scope: "openid", // ✅ Solo openid para evitar invalid_scope
    post_logout_redirect_uri: `${BASE_URL}/`,
    
    // ✅ Desactivar PKCE ya que usamos client_secret
    usePkce: false,
    
    // ✅ Configuración adicional para client_secret
    automaticSilentRenew: false,
    validateSubOnSilentRenew: false,
    includeIdTokenInSilentRenew: false,
    filterProtocolClaims: true,
    loadUserInfo: false,
    
    // ✅ Configuración de metadatos explícita
    metadata: {
        issuer: "https://cognito-idp.us-east-1.amazonaws.com/us-east-1_rNAarCaQI",
        authorization_endpoint: "https://us-east-1rnaarcaqi.auth.us-east-1.amazoncognito.com/oauth2/authorize",
        token_endpoint: "https://us-east-1rnaarcaqi.auth.us-east-1.amazoncognito.com/oauth2/token",
        userinfo_endpoint: "https://us-east-1rnaarcaqi.auth.us-east-1.amazoncognito.com/oauth2/userInfo",
        jwks_uri: "https://cognito-idp.us-east-1.amazonaws.com/us-east-1_rNAarCaQI/.well-known/jwks.json",
        revocation_endpoint: "https://us-east-1rnaarcaqi.auth.us-east-1.amazoncognito.com/oauth2/revoke",
        end_session_endpoint: "https://us-east-1rnaarcaqi.auth.us-east-1.amazoncognito.com/logout"
    }
};

// Crear instancia de UserManager
export const userManager = new UserManager(cognitoAuthConfig);


/**
 * Función para hacer logout local solamente (más confiable)
 */
export async function signOutRedirect() {
    try {
        console.log('🔄 Cerrando sesión localmente...');
        
        // Limpiar COMPLETAMENTE todo el localStorage y sessionStorage
        localStorage.clear();
        sessionStorage.clear();
        
        console.log('✅ Sesión local limpiada completamente');
        
        // Recargar la página para volver al login
        window.location.href = `${window.location.protocol}//${window.location.host}/`;
        
    } catch (error) {
        console.error("Error al cerrar sesión:", error);
        // Fallback: limpiar y recargar de todos modos
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = `${window.location.protocol}//${window.location.host}/`;
    }
}

/**
 * Función para limpiar estado antes de nuevo login
 */
export async function clearStateBeforeLogin() {
    try {
        // Limpiar cualquier estado residual de OIDC
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && (key.startsWith('oidc.') || key.includes('state') || key.includes('nonce'))) {
                keysToRemove.push(key);
            }
        }
        keysToRemove.forEach(key => localStorage.removeItem(key));
        
        console.log('🧹 Estado OIDC limpiado antes de login');
    } catch (error) {
        console.warn('Error al limpiar estado OIDC:', error);
    }
}

/**
 * Obtener el usuario actual del storage
 */
export async function getCurrentUser() {
    try {
        const user = await userManager.getUser();
        return user;
    } catch (error) {
        console.error("Error al obtener usuario:", error);
        return null;
    }
}

/**
 * Obtener el ID Token
 */
export async function getIdToken() {
    try {
        const user = await userManager.getUser();
        return user?.id_token;
    } catch (error) {
        console.error("Error al obtener ID Token:", error);
        return null;
    }
}

/**
 * Obtener el Access Token
 */
export async function getAccessToken() {
    try {
        const user = await userManager.getUser();
        return user?.access_token;
    } catch (error) {
        console.error("Error al obtener Access Token:", error);
        return null;
    }
}

export default cognitoAuthConfig;


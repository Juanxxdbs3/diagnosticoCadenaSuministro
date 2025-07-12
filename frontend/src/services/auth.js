import api from '../api/axios';

// Obtener usuario del localStorage
export const getCurrentUser = () => {
  try {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error('Error parsing user from localStorage:', error);
    return null;
  }
};

// Obtener token del localStorage
export const getToken = () => {
  return localStorage.getItem('token');
};

// Verificar si el usuario está autenticado
export const isAuthenticated = () => {
  const token = getToken();
  const user = getCurrentUser();
  return !!(token && user);
};

// ⚡ NUEVA: Verificar si el token es válido en el servidor
export const verifyToken = async () => {
  try {
    const response = await api.get('/auth/verify');
    return response.data;
  } catch (error) {
    console.error('Token verification failed:', error);
    // Si el token no es válido, limpiar localStorage
    logout();
    return false;
  }
};

// Verificar si el usuario tiene un rol específico
export const hasRole = (role) => {
  const user = getCurrentUser();
  return user?.rol === role;
};

// Verificar si el usuario tiene alguno de los roles permitidos
export const hasAnyRole = (roles) => {
  const user = getCurrentUser();
  return roles.includes(user?.rol);
};

// Logout - limpiar localStorage
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  // Opcional: redireccionar
  window.location.href = '/login';
};

// ⚡ NUEVA: Logout completo (también notificar al servidor)
export const logoutComplete = async () => {
  try {
    await api.post('/auth/logout');
  } catch (error) {
    console.error('Error during server logout:', error);
  } finally {
    // Limpiar localStorage siempre
    logout();
  }
};

// Login - guardar datos en localStorage
export const saveAuthData = (token, user) => {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
};

// ⚡ NUEVA: Obtener perfil actual del servidor
export const fetchProfile = async () => {
  try {
    const response = await api.get('/auth/profile');
    return response.data;
  } catch (error) {
    console.error('Error fetching profile:', error);
    throw error;
  }
};

// Obtener estadísticas según el rol del usuario
export const getStatsEndpoint = () => {
  const user = getCurrentUser();
  
  if (!user) return null;
  
  // Si es empresa, usar endpoint específico
  if (user.rol === 'empresa') {
    return `/stats/empresa/${user.id}`;
  }
  
  // Si es admin o evaluador, usar endpoint global
  if (user.rol === 'admin' || user.rol === 'evaluador') {
    return '/stats/global';
  }
  
  return null;
};

export default {
  getCurrentUser,
  getToken,
  isAuthenticated,
  verifyToken,         // ⚡ NUEVO
  hasRole,
  hasAnyRole,
  logout,
  logoutComplete,      // ⚡ NUEVO
  saveAuthData,
  fetchProfile,        // ⚡ NUEVO
  getStatsEndpoint
};
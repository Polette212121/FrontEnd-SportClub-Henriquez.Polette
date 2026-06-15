/* ============================================
   DASHBOARD COACH - LÓGICA CON API
   ============================================ */

const API_URL = 'http://localhost:3000/api';

document.addEventListener('DOMContentLoaded', async function() {
    // Proteger ruta
    await protectRoute('coach');
    
    // Cargar datos
    loadSessionInfo();
    setupMenuNavigation();
});

// ============================================
// PROTEGER RUTA
// ============================================
async function protectRoute(requiredRole) {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    
    if (!token || !user) {
        window.location.href = 'login.html';
        return false;
    }
    
    if (user.role !== requiredRole) {
        alert('Acceso denegado. Solo coaches.');
        window.location.href = 'login.html';
        return false;
    }
    
    return true;
}

// ============================================
// CARGAR INFORMACIÓN DE SESIÓN
// ============================================
function loadSessionInfo() {
    const user = JSON.parse(localStorage.getItem('user'));
    const userDisplay = document.getElementById('userDisplay');
    
    if (userDisplay && user) {
        userDisplay.textContent = `👤 ${user.fullName} (${user.email})`;
    }
}

// ============================================
// CONFIGURAR NAVEGACIÓN
// ============================================
function setupMenuNavigation() {
    const menuLinks = document.querySelectorAll('.menu-link');
    const sections = document.querySelectorAll('.dashboard-section');
    
    menuLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const sectionId = this.getAttribute('href').substring(1);
            
            menuLinks.forEach(l => l.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));
            
            this.classList.add('active');
            const section = document.getElementById(sectionId);
            if (section) section.classList.add('active');
        });
    });
}
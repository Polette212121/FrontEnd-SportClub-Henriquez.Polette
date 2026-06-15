/* ============================================
   DASHBOARD USUARIO - LÓGICA CON API
   ============================================ */

const API_URL = 'http://localhost:3000/api';

document.addEventListener('DOMContentLoaded', async function() {
    // Proteger ruta
    await protectRoute('user');
    
    // Cargar datos
    loadSessionInfo();
    loadUserProfile();
    setupMenuNavigation();
    setupProfileForm();
    setupPasswordForm();
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
        alert('Acceso denegado. Solo usuarios.');
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
// CARGAR PERFIL DE USUARIO
// ============================================
async function loadUserProfile() {
    const token = localStorage.getItem('token');
    
    try {
        const response = await fetch(`${API_URL}/auth/me`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) throw new Error('Error al cargar perfil');
        
        const data = await response.json();
        const user = data.data || data;
        
        // Llenar el formulario
        document.getElementById('fullName').value = user.fullName || '';
        document.getElementById('userEmail').value = user.email || '';
        document.getElementById('dateOfBirth').value = user.dateOfBirth ? user.dateOfBirth.split('T')[0] : '';
        document.getElementById('userRole').textContent = user.role.toUpperCase();
        document.getElementById('registrationDate').textContent = formatDate(user.createdAt);
        
        // Actualizar información visual
        updateUserInfo(user);
    } catch (error) {
        console.error('Error:', error);
    }
}

// ============================================
// ACTUALIZAR INFORMACIÓN VISUAL
// ============================================
function updateUserInfo(user) {
    const roleElement = document.getElementById('userRole');
    if (roleElement) {
        roleElement.className = 'badge ' + getRoleBadge(user.role);
    }
}

// ============================================
// OBTENER CLASE BADGE
// ============================================
function getRoleBadge(role) {
    const badges = {
        'admin': 'bg-danger',
        'coach': 'bg-primary',
        'user': 'bg-success'
    };
    return badges[role] || 'bg-success';
}

// ============================================
// FORMATEAR FECHA
// ============================================
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit', year: 'numeric' });
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

// ============================================
// CONFIGURAR FORMULARIO DE PERFIL
// ============================================
function setupProfileForm() {
    const editBtn = document.getElementById('editProfileBtn');
    const saveBtn = document.getElementById('saveProfileBtn');
    const cancelBtn = document.getElementById('cancelProfileBtn');
    const profileInputs = document.querySelectorAll('#profileForm input:not([disabled])');
    
    if (editBtn) {
        editBtn.addEventListener('click', () => {
            profileInputs.forEach(input => input.disabled = false);
            document.getElementById('editProfileBtn').style.display = 'none';
            document.getElementById('profileFormActions').style.display = 'block';
        });
    }
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            profileInputs.forEach(input => input.disabled = true);
            document.getElementById('editProfileBtn').style.display = 'block';
            document.getElementById('profileFormActions').style.display = 'none';
            loadUserProfile();
        });
    }
    
    if (saveBtn) {
        saveBtn.addEventListener('click', saveProfile);
    }
}

// ============================================
// GUARDAR PERFIL
// ============================================
async function saveProfile() {
    const token = localStorage.getItem('token');
    const fullName = document.getElementById('fullName').value.trim();
    const dateOfBirth = document.getElementById('dateOfBirth').value;
    
    if (!fullName) {
        alert('El nombre es obligatorio');
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/auth/me`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                fullName,
                dateOfBirth: dateOfBirth || null
            })
        });
        
        if (!response.ok) throw new Error('Error al guardar');
        
        const data = await response.json();
        
        // Actualizar localStorage
        let user = JSON.parse(localStorage.getItem('user'));
        user.fullName = fullName;
        localStorage.setItem('user', JSON.stringify(user));
        
        alert('✓ Perfil actualizado correctamente');
        
        // Restaurar estado
        document.querySelectorAll('#profileForm input:not([disabled])').forEach(input => input.disabled = true);
        document.getElementById('editProfileBtn').style.display = 'block';
        document.getElementById('profileFormActions').style.display = 'none';
        loadSessionInfo();
    } catch (error) {
        console.error('Error:', error);
        alert('Error al guardar cambios');
    }
}

// ============================================
// CONFIGURAR FORMULARIO DE CONTRASEÑA
// ============================================
function setupPasswordForm() {
    const passwordForm = document.getElementById('passwordForm');
    
    if (passwordForm) {
        passwordForm.addEventListener('submit', changePassword);
    }
}

// ============================================
// CAMBIAR CONTRASEÑA
// ============================================
async function changePassword(e) {
    e.preventDefault();
    
    const token = localStorage.getItem('token');
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // Validar
    if (!currentPassword || !newPassword || !confirmPassword) {
        alert('Todos los campos son obligatorios');
        return;
    }
    
    if (newPassword.length < 8) {
        alert('La nueva contraseña debe tener mínimo 8 caracteres');
        return;
    }
    
    if (newPassword !== confirmPassword) {
        alert('Las contraseñas no coinciden');
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/auth/me/password`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                currentPassword,
                newPassword
            })
        });
        
        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message || 'Error al cambiar contraseña');
        }
        
        alert('✓ Contraseña actualizada correctamente');
        document.getElementById('passwordForm').reset();
    } catch (error) {
        console.error('Error:', error);
        alert(error.message || 'Error al cambiar contraseña');
    }
}
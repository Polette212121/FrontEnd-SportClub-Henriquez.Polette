/* ============================================
   DASHBOARD ADMIN - LÓGICA CON API
   ============================================ */

const API_URL = 'http://localhost:3000/api';

document.addEventListener('DOMContentLoaded', async function() {
    // Proteger ruta
    await protectRoute('admin');
    
    // Cargar datos iniciales
    loadSessionInfo();
    loadUsers();
    setupMenuNavigation();
    setupFormHandlers();
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
        alert('Acceso denegado. Solo ' + requiredRole + 's.');
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
// CARGAR LISTA DE USUARIOS
// ============================================
async function loadUsers() {
    const token = localStorage.getItem('token');
    const usersTableBody = document.getElementById('usersTableBody');
    const totalUsers = document.getElementById('totalUsers');
    
    try {
        const response = await fetch(`${API_URL}/users`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) throw new Error('Error al cargar usuarios');
        
        const data = await response.json();
        const users = data.data || [];
        
        if (totalUsers) totalUsers.textContent = users.length;
        
        if (usersTableBody) {
            if (users.length === 0) {
                usersTableBody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: #999;">No hay usuarios registrados</td></tr>';
            } else {
                usersTableBody.innerHTML = users.map(user => `
                    <tr>
                        <td>#${user.id}</td>
                        <td>${user.fullName}</td>
                        <td>${user.email}</td>
                        <td><span class="badge ${getRoleBadge(user.role)}">${user.role}</span></td>
                        <td>${formatDate(user.createdAt)}</td>
                        <td>
                            <button class="btn btn-secondary btn-small" onclick="editUser('${user.id}')" title="Editar">✏️</button>
                            <button class="btn btn-danger btn-small" onclick="deleteUser('${user.id}')" title="Eliminar">🗑️</button>
                        </td>
                    </tr>
                `).join('');
            }
        }
    } catch (error) {
        console.error('Error:', error);
        if (usersTableBody) {
            usersTableBody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: #e74c3c;">Error al cargar usuarios</td></tr>';
        }
    }
}

// ============================================
// OBTENER CLASE BADGE SEGÚN ROL
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
// EDITAR USUARIO
// ============================================
function editUser(userId) {
    alert('Función de edición en desarrollo para usuario: ' + userId);
}

// ============================================
// ELIMINAR USUARIO
// ============================================
async function deleteUser(userId) {
    if (!confirm('¿Estás seguro de eliminar este usuario?')) return;
    
    const token = localStorage.getItem('token');
    
    try {
        const response = await fetch(`${API_URL}/users/${userId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.ok) {
            alert('Usuario eliminado correctamente');
            loadUsers();
        } else {
            alert('Error al eliminar usuario');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error de conexión');
    }
}

// ============================================
// CONFIGURAR NAVEGACIÓN DEL MENÚ
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
// MANEJO DE FORMULARIOS
// ============================================
function setupFormHandlers() {
    const newUserBtn = document.getElementById('newUserBtn');
    const userForm = document.getElementById('userForm');
    const cancelBtn = document.getElementById('cancelBtn');
    
    if (newUserBtn) {
        newUserBtn.addEventListener('click', () => {
            if (userForm) userForm.style.display = userForm.style.display === 'none' ? 'block' : 'none';
        });
    }
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            if (userForm) userForm.style.display = 'none';
            if (document.getElementById('createUserForm')) document.getElementById('createUserForm').reset();
        });
    }
}
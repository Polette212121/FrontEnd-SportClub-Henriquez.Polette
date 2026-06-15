/* js/dashboard-admin.js */

// Datos de CLASES (para el sistema completo)
const CLASES_SISTEMA = [
    { nombre: 'Crossfit', capacidad: 20, inscritos: 15 },
    { nombre: 'Yoga', capacidad: 15, inscritos: 12 },
    { nombre: 'Natación', capacidad: 25, inscritos: 20 },
    { nombre: 'Funcional', capacidad: 18, inscritos: 14 },
    { nombre: 'Boxing', capacidad: 16, inscritos: 10 }
];

// Verificar sesión al cargar
window.addEventListener('load', function() {
    const usuario = verificarSesion();
    
    if (usuario && usuario.rol === 'admin') {
        cargarDashboardAdmin(usuario);
    } else if (!usuario) {
        window.location.href = '../pages/login.html';
    } else {
        alert('No tienes acceso a esta página');
        window.location.href = '../index.html';
    }
});

// Cerrar sesión
document.getElementById('cerrarSesion').addEventListener('click', function(e) {
    e.preventDefault();
    if (confirm('¿Estás seguro que quieres cerrar sesión?')) {
        cerrarSesion();
    }
});

// BOTONES DE CONFIGURACIÓN
document.getElementById('crearUsuario').addEventListener('click', function() {
    alert('📝 Formulario para crear nuevo usuario (próximamente)');
});

document.getElementById('editarSistema').addEventListener('click', function() {
    alert('✏️ Editor del sistema (próximamente)');
});

document.getElementById('configuracion').addEventListener('click', function() {
    alert('⚙️ Configuración avanzada (próximamente)');
});

// Cargar todos los datos del dashboard
function cargarDashboardAdmin(usuario) {
    const usuariosAdmin = obtenerTodosUsuariosAdmin();
    
    // 1. TARJETAS ESTADÍSTICAS
    const totalUsuarios = usuariosAdmin.length;
    const totalCoaches = usuariosAdmin.filter(u => u.rol === 'coach').length;
    const totalClases = CLASES_SISTEMA.length;
    
    document.getElementById('totalUsuarios').textContent = totalUsuarios;
    document.getElementById('totalCoaches').textContent = totalCoaches;
    document.getElementById('totalClases').textContent = totalClases;
    
    // 2. LLENAR TABLA DE USUARIOS
    llenarUsuariosAdmin(usuariosAdmin);
    
    // 3. LLENAR REPORTES
    llenarReportes();
    
    // 4. LLENAR CLASES
    llenarClasesAdmin();
}

// Función para obtener usuarios con RUT
function obtenerTodosUsuariosAdmin() {
    const usuarios = obtenerTodosUsuarios();
    return usuarios.map((usuario, index) => ({
        ...usuario,
        rut: `${20000000 + index}-K`
    }));
}

// Función para llenar TABLA DE USUARIOS (mínimo 5 registros)
function llenarUsuariosAdmin(usuarios) {
    const tbody = document.getElementById('usuariosTabla');
    tbody.innerHTML = '';
    
    if (usuarios.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; color: #999;">No hay usuarios registrados</td></tr>';
        return;
    }
    
    usuarios.forEach(usuario => {
        const tr = document.createElement('tr');
        const estadoClass = usuario.activo ? 'activo' : 'inactivo';
        const estadoText = usuario.activo ? '✓ Activo' : '✗ Inactivo';
        
        tr.innerHTML = `
            <td>${usuario.rut}</td>
            <td><strong>${usuario.nombre}</strong></td>
            <td><span class="rol-badge ${usuario.rol}">${usuario.rol}</span></td>
            <td><span class="estado-badge ${estadoClass}">${estadoText}</span></td>
            <td>${usuario.fechaRegistro}</td>
            <td><button class="btn btn-small btn-secondary" onclick="editarUsuario('${usuario.email}')">Editar</button></td>
        `;
        tbody.appendChild(tr);
    });
}

// Función para llenar REPORTES
function llenarReportes() {
    // CLASES MÁS SOLICITADAS
    const listaPop = document.getElementById('clasesPopulares');
    listaPop.innerHTML = '';
    
    const clasesOrdenadas = [...CLASES_SISTEMA].sort((a, b) => b.inscritos - a.inscritos);
    
    clasesOrdenadas.forEach(clase => {
        const li = document.createElement('li');
        const porcentaje = Math.round((clase.inscritos / clase.capacidad) * 100);
        li.innerHTML = `
            <strong>${clase.nombre}</strong>
            <span class="reporte-stat-inline">${clase.inscritos}/${clase.capacidad} (${porcentaje}%)</span>
        `;
        listaPop.appendChild(li);
    });
    
    // USUARIOS ACTIVOS (simulado)
    document.getElementById('usuariosActivos').textContent = Math.floor(Math.random() * 20) + 10;
    
    // RESERVAS DEL DÍA (simulado)
    document.getElementById('reservasHoy').textContent = Math.floor(Math.random() * 30) + 15;
}

// Función para llenar CLASES
function llenarClasesAdmin() {
    const grid = document.getElementById('clasesAdminGrid');
    grid.innerHTML = '';
    
    CLASES_SISTEMA.forEach(clase => {
        const porcentaje = Math.round((clase.inscritos / clase.capacidad) * 100);
        const card = document.createElement('div');
        card.className = 'clase-admin-card';
        card.innerHTML = `
            <div class="clase-admin-header">
                <h3>${clase.nombre}</h3>
                <span class="clase-capacidad">${clase.inscritos}/${clase.capacidad}</span>
            </div>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${porcentaje}%"></div>
            </div>
            <div class="clase-admin-footer">
                <span>${porcentaje}% ocupado</span>
                <button class="btn btn-small btn-secondary" onclick="administrarClase('${clase.nombre}')">Administrar</button>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Funciones auxiliares
function editarUsuario(email) {
    alert(`Editando usuario: ${email}`);
}

function administrarClase(nombreClase) {
    alert(`Administrando clase: ${nombreClase}`);
}

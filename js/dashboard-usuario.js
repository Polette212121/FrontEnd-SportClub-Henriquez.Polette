/* js/dashboard-usuario.js */

// Datos de RESERVAS (mínimo 5)
const RESERVAS_USUARIO = [
    { clase: 'Crossfit', dia: 'Lunes', hora: '19:00', coach: 'Carlos', id: 1 },
    { clase: 'Yoga', dia: 'Martes', hora: '18:00', coach: 'María', id: 2 },
    { clase: 'Natación', dia: 'Miércoles', hora: '20:00', coach: 'Jorge', id: 3 },
    { clase: 'Funcional', dia: 'Jueves', hora: '19:00', coach: 'Carlos', id: 4 },
    { clase: 'Boxing', dia: 'Viernes', hora: '17:00', coach: 'Luis', id: 5 }
];

// Datos de CLASES DISPONIBLES (mínimo 3)
const CLASES_DISPONIBLES = [
    { 
        nombre: 'Crossfit', 
        descripcion: 'Entrenamiento funcional intenso con movimientos variados y dinámicos', 
        icono: '💪',
        accion: 'Reservar'
    },
    { 
        nombre: 'Yoga', 
        descripcion: 'Flexibilidad, equilibrio y meditación para el bienestar integral', 
        icono: '🧘',
        accion: 'Inscribirse'
    },
    { 
        nombre: 'Natación', 
        descripcion: 'Cardio y resistencia en agua, ideal para articulaciones', 
        icono: '🏊',
        accion: 'Ver más'
    },
    { 
        nombre: 'Pilates', 
        descripcion: 'Fortalecimiento del core y mejora de postura corporal', 
        icono: '🤸',
        accion: 'Reservar'
    },
    { 
        nombre: 'Boxing', 
        descripcion: 'Boxeo para liberar estrés y mejorar coordinación', 
        icono: '🥊',
        accion: 'Ver más'
    }
];

// Verificar sesión al cargar
window.addEventListener('load', function() {
    const usuario = verificarSesion();
    
    if (usuario && usuario.rol === 'usuario') {
        cargarDashboardUsuario(usuario);
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

// Cargar todos los datos del dashboard
function cargarDashboardUsuario(usuario) {
    // 1. BIENVENIDA
    const primerNombre = usuario.nombre.split(' ')[0];
    document.getElementById('nombreUsuario').textContent = primerNombre;
    document.getElementById('mensajeMoti').textContent = `Continúa entrenando para alcanzar tus metas, ${primerNombre}.`;
    
    // 2. PERFIL RÁPIDO
    document.getElementById('perfilNombre').textContent = usuario.nombre;
    document.getElementById('perfilEmail').textContent = usuario.email;
    document.getElementById('perfilDeporte').textContent = usuario.deporte || 'No especificado';
    document.getElementById('perfilFecha').textContent = usuario.fechaRegistro;
    
    // 3. LLENAR RESERVAS
    llenarReservas();
    
    // 4. LLENAR CLASES DISPONIBLES
    llenarClases();
}

// Función para llenar TABLA DE RESERVAS
function llenarReservas() {
    const tbody = document.getElementById('reservasTabla');
    tbody.innerHTML = '';
    
    if (RESERVAS_USUARIO.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; color: #999;">No tienes reservas</td></tr>';
        return;
    }
    
    RESERVAS_USUARIO.forEach((reserva, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>${reserva.clase}</strong></td>
            <td>${reserva.dia}</td>
            <td>${reserva.hora}</td>
            <td>${reserva.coach}</td>
            <td><button class="btn btn-small btn-secondary" onclick="cancelarReserva(${index})">Cancelar</button></td>
        `;
        tbody.appendChild(tr);
    });
}

// Función para llenar CARDS DE CLASES DISPONIBLES
function llenarClases() {
    const grid = document.getElementById('clasesGrid');
    grid.innerHTML = '';
    
    CLASES_DISPONIBLES.forEach(clase => {
        const card = document.createElement('div');
        card.className = 'clase-card';
        card.innerHTML = `
            <div class="clase-icon">${clase.icono}</div>
            <h3>${clase.nombre}</h3>
            <p>${clase.descripcion}</p>
            <button class="btn btn-small btn-primary" onclick="reservarClase('${clase.nombre}')">${clase.accion}</button>
        `;
        grid.appendChild(card);
    });
}

// Función para cancelar reserva
function cancelarReserva(index) {
    if (confirm('¿Estás seguro de que deseas cancelar esta reserva?')) {
        RESERVAS_USUARIO.splice(index, 1);
        llenarReservas();
        alert('✓ Reserva cancelada exitosamente');
    }
}

// Función para reservar clase
function reservarClase(nombreClase) {
    alert(`✓ Te has inscrito a la clase de ${nombreClase}`);
}

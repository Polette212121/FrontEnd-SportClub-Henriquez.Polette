/* js/dashboard-coach.js */

// Datos de ALUMNOS (mínimo 5)
const ALUMNOS_COACH = [
    { nombre: 'Javier García', correo: 'javier@gmail.com', clase: 'Crossfit', estado: 'activo' },
    { nombre: 'María López', correo: 'maria@gmail.com', clase: 'Crossfit', estado: 'activo' },
    { nombre: 'Carlos Morales', correo: 'carlos@gmail.com', clase: 'Funcional', estado: 'activo' },
    { nombre: 'Ana Rodríguez', correo: 'ana@gmail.com', clase: 'Yoga', estado: 'activo' },
    { nombre: 'Pedro Sánchez', correo: 'pedro@gmail.com', clase: 'Crossfit', estado: 'inactivo' }
];

// Datos de CLASES DEL COACH (mínimo 3)
const CLASES_COACH = [
    { nombre: 'Crossfit', dia: 'Lunes', hora: '19:00', alumnos: 12 },
    { nombre: 'Funcional', dia: 'Miércoles', hora: '18:00', alumnos: 8 },
    { nombre: 'Crossfit', dia: 'Viernes', hora: '17:00', alumnos: 15 }
];

// Datos de HORARIOS SEMANALES (mínimo 5)
const HORARIOS_SEMANALES = [
    { nombre: 'Crossfit', dia: 'Lunes', hora: '19:00', alumnos: 12 },
    { nombre: 'Funcional', dia: 'Martes', hora: '18:30', alumnos: 10 },
    { nombre: 'Crossfit', dia: 'Miércoles', hora: '20:00', alumnos: 14 },
    { nombre: 'Yoga', dia: 'Jueves', hora: '17:00', alumnos: 8 },
    { nombre: 'Crossfit', dia: 'Viernes', hora: '19:00', alumnos: 16 }
];

// Verificar sesión al cargar
window.addEventListener('load', function() {
    const usuario = verificarSesion();
    
    if (usuario && usuario.rol === 'coach') {
        cargarDashboardCoach(usuario);
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
function cargarDashboardCoach(usuario) {
    // 1. PANEL RESUMEN - Estadísticas
    document.getElementById('totalAlumnos').textContent = ALUMNOS_COACH.length;
    document.getElementById('clasesActivas').textContent = CLASES_COACH.length;
    document.getElementById('horasSem').textContent = '6h';
    
    // 2. LLENAR TABLA DE ALUMNOS
    llenarAlumnos();
    
    // 3. LLENAR CARDS DE CLASES
    llenarClasesCoach();
    
    // 4. LLENAR TABLA DE HORARIOS
    llenarHorarios();
}

// Función para llenar TABLA DE ALUMNOS
function llenarAlumnos() {
    const tbody = document.getElementById('alumnosTabla');
    tbody.innerHTML = '';
    
    ALUMNOS_COACH.forEach(alumno => {
        const tr = document.createElement('tr');
        const estadoClass = alumno.estado === 'activo' ? 'activo' : 'inactivo';
        const estadoText = alumno.estado === 'activo' ? '✓ Activo' : '✗ Inactivo';
        
        tr.innerHTML = `
            <td><strong>${alumno.nombre}</strong></td>
            <td>${alumno.correo}</td>
            <td>${alumno.clase}</td>
            <td><span class="estado-badge ${estadoClass}">${estadoText}</span></td>
        `;
        tbody.appendChild(tr);
    });
}

// Función para llenar CARDS DE CLASES
function llenarClasesCoach() {
    const grid = document.getElementById('clasesCoachGrid');
    grid.innerHTML = '';
    
    const clasesUnicas = [...new Set(CLASES_COACH.map(c => c.nombre))];
    
    clasesUnicas.forEach(nombreClase => {
        const clase = CLASES_COACH.find(c => c.nombre === nombreClase);
        const card = document.createElement('div');
        card.className = 'clase-coach-card';
        card.innerHTML = `
            <div class="clase-header">
                <h3>${clase.nombre}</h3>
                <span class="clase-alumnos">${clase.alumnos} alumnos</span>
            </div>
            <div class="clase-details">
                <p><strong>Próxima clase:</strong> ${clase.dia}</p>
                <p><strong>Hora:</strong> ${clase.hora}</p>
                <button class="btn btn-small btn-primary" onclick="verDetalles('${clase.nombre}')">Ver Detalles</button>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Función para llenar TABLA DE HORARIOS
function llenarHorarios() {
    const tbody = document.getElementById('horariosTabla');
    tbody.innerHTML = '';
    
    HORARIOS_SEMANALES.forEach(horario => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>${horario.nombre}</strong></td>
            <td>${horario.dia}</td>
            <td>${horario.hora}</td>
            <td><span class="badge">${horario.alumnos}</span></td>
        `;
        tbody.appendChild(tr);
    });
}

// Función para ver detalles
function verDetalles(nombreClase) {
    alert(`Detalles de ${nombreClase}`);
}

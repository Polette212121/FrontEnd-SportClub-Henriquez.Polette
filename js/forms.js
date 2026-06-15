/* ============================================
   MANEJO DE FORMULARIOS CON API Y VALIDACIONES REALES
   ============================================ */

const API_URL = 'http://localhost:3000/api';

// ============================================
// LOGIN FORM - CON CONSUMO DE API
// ============================================
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const emailError = document.getElementById('emailError');
        const passwordError = document.getElementById('passwordError');
        const submitBtn = loginForm.querySelector('button[type="submit"]');
        let isValid = true;
        
        // Limpiar errores previos
        emailError.textContent = '';
        passwordError.textContent = '';
        
        // VALIDAR EMAIL (OBLIGATORIO)
        if (!email) {
            emailError.textContent = 'El correo es obligatorio *';
            isValid = false;
        } else if (!isValidEmail(email)) {
            emailError.textContent = 'Correo inválido (ej: usuario@correo.com)';
            isValid = false;
        }
        
        // VALIDAR CONTRASEÑA (OBLIGATORIO)
        if (!password) {
            passwordError.textContent = 'La contraseña es obligatoria *';
            isValid = false;
        } else if (password.length < 8) {
            passwordError.textContent = 'La contraseña debe tener al menos 8 caracteres';
            isValid = false;
        }
        
        if (!isValid) {
            return;
        }
        
        // Deshabilitar botón durante envío
        submitBtn.disabled = true;
        submitBtn.textContent = 'Ingresando...';
        
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });
            
            const data = await response.json();
            
            if (response.ok && data.token) {
                // Guardar token y datos de sesión
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                
                // Redirigir según rol
                const role = data.user.role;
                if (role === 'admin') {
                    window.location.href = 'dashboard-admin.html';
                } else if (role === 'coach') {
                    window.location.href = 'dashboard-coach.html';
                } else {
                    window.location.href = 'dashboard-usuario.html';
                }
            } else {
                passwordError.textContent = data.message || 'Correo o contraseña incorrectos';
            }
        } catch (error) {
            console.error('Error:', error);
            passwordError.textContent = 'Error de conexión. Intenta de nuevo.';
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Ingresar';
        }
    });
}

// ============================================
// REGISTRO FORM - CON CONSUMO DE API
// ============================================
const registroForm = document.getElementById('registroForm');
if (registroForm) {
    registroForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const nombre = document.getElementById('nombre').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const dateOfBirth = document.getElementById('dateOfBirth')?.value || null;
        
        const nombreError = document.getElementById('nombreError');
        const emailError = document.getElementById('emailError');
        const passwordError = document.getElementById('passwordError');
        const confirmPasswordError = document.getElementById('confirmPasswordError');
        const successMessage = document.getElementById('successMessage');
        const submitBtn = registroForm.querySelector('button[type="submit"]');
        
        let isValid = true;
        
        // Limpiar mensajes previos
        nombreError.textContent = '';
        emailError.textContent = '';
        passwordError.textContent = '';
        confirmPasswordError.textContent = '';
        successMessage.classList.remove('show');
        
        // VALIDAR NOMBRE (OBLIGATORIO)
        if (!nombre) {
            nombreError.textContent = 'El nombre es obligatorio *';
            isValid = false;
        } else if (nombre.length < 3) {
            nombreError.textContent = 'El nombre debe tener al menos 3 caracteres';
            isValid = false;
        }
        
        // VALIDAR EMAIL (OBLIGATORIO)
        if (!email) {
            emailError.textContent = 'El correo es obligatorio *';
            isValid = false;
        } else if (!isValidEmail(email)) {
            emailError.textContent = 'Correo inválido (ej: usuario@correo.com)';
            isValid = false;
        }
        
        // VALIDAR CONTRASEÑA (OBLIGATORIO - Mínimo 8 caracteres)
        if (!password) {
            passwordError.textContent = 'La contraseña es obligatoria *';
            isValid = false;
        } else if (password.length < 8) {
            passwordError.textContent = 'La contraseña debe tener mínimo 8 caracteres';
            isValid = false;
        }
        
        // VALIDAR CONFIRMACIÓN (OBLIGATORIO)
        if (!confirmPassword) {
            confirmPasswordError.textContent = 'Debe confirmar la contraseña *';
            isValid = false;
        } else if (password !== confirmPassword) {
            confirmPasswordError.textContent = 'Las contraseñas no coinciden';
            isValid = false;
        }
        
        if (!isValid) {
            return;
        }
        
        // Deshabilitar botón
        submitBtn.disabled = true;
        submitBtn.textContent = 'Registrando...';
        
        try {
            const response = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    fullName: nombre,
                    email,
                    password,
                    dateOfBirth
                })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                successMessage.textContent = '✓ Usuario registrado correctamente. Redirigiendo a login...';
                successMessage.classList.add('show');
                registroForm.reset();
                
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 2000);
            } else {
                emailError.textContent = data.message || 'Error en el registro';
            }
        } catch (error) {
            console.error('Error:', error);
            emailError.textContent = 'Error de conexión. Intenta de nuevo.';
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Registrarse';
        }
    });
}

// ============================================
// RECUPERAR CONTRASEÑA FORM
// ============================================
const recuperarForm = document.getElementById('recuperarForm');
if (recuperarForm) {
    recuperarForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value.trim();
        const emailError = document.getElementById('emailError');
        const successMessage = document.getElementById('successMessage');
        let isValid = true;
        
        // Limpiar mensajes previos
        emailError.textContent = '';
        successMessage.classList.remove('show');
        
        // VALIDAR EMAIL (OBLIGATORIO)
        if (!email) {
            emailError.textContent = 'El correo es obligatorio *';
            isValid = false;
        } else if (!isValidEmail(email)) {
            emailError.textContent = 'Correo inválido';
            isValid = false;
        }
        
        if (!isValid) {
            return;
        }
        
        try {
            const response = await fetch(`${API_URL}/auth/password-reset`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            });
            
            if (response.ok) {
                successMessage.textContent = `✓ Se ha enviado un enlace de recuperación a: ${email}`;
                successMessage.classList.add('show');
                recuperarForm.reset();
            } else {
                const data = await response.json();
                emailError.textContent = data.message || 'Error en la recuperación';
            }
        } catch (error) {
            console.error('Error:', error);
            emailError.textContent = 'Error de conexión. Intenta de nuevo.';
        }
    });
}

// ============================================
// HELPER: Validar email
// ============================================
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// ============================================
// PROTECCIÓN DE RUTAS - Verificar sesión
// ============================================
function checkSession() {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    
    // Si no hay token y estamos en un dashboard, redirigir a login
    if (!token || !user) {
        const currentPage = window.location.pathname;
        if (currentPage.includes('dashboard')) {
            window.location.href = 'login.html';
        }
    }
    
    return { token, user };
}

// Ejecutar verificación al cargar
document.addEventListener('DOMContentLoaded', function() {
    checkSession();
});

// ============================================
// LOGOUT
// ============================================
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '../pages/login.html';
}

window.logout = logout;
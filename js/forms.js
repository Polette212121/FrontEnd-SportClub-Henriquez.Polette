/* ============================================
   MANEJO DE FORMULARIOS
   ============================================ */

// Login Form
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async function(e) {  // -- Se agrega async ára poder usar await y esperar la respuesta del servidor 
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const emailError = document.getElementById('emailError');
        const passwordError = document.getElementById('passwordError');
        let isValid = true;
        
        // Clear previous errors
        emailError.textContent = '';
        passwordError.textContent = '';
        
        // Validate email
        if (!email) {
            emailError.textContent = 'El correo es requerido';
            isValid = false;
        } else if (!isValidEmail(email)) {
            emailError.textContent = 'Correo inválido';
            isValid = false;
        }
        
        // Validate password
        if (!password) {
            passwordError.textContent = 'La contraseña es requerida';
            isValid = false;
        } else if (password.length < 6) {
            passwordError.textContent = 'La contraseña debe tener al menos 6 caracteres';
            isValid = false;
        }
        
        if (isValid) {
            // Redirect to dashboard
            window.location.href = 'dashboard-usuario.html';
        }
    });
}

// Registro Form
const registroForm = document.getElementById('registroForm');
if (registroForm) {
    registroForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const nombre = document.getElementById('nombre').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const successMessage = document.getElementById('successMessage');
        const nombreError = document.getElementById('nombreError');
        const emailError = document.getElementById('emailError');
        const passwordError = document.getElementById('passwordError');
        const confirmPasswordError = document.getElementById('confirmPasswordError');
        
        let isValid = true;
        
        // Clear previous messages
        nombreError.textContent = '';
        emailError.textContent = '';
        passwordError.textContent = '';
        confirmPasswordError.textContent = '';
        successMessage.classList.remove('show');
        
        // Validate nombre
        if (!nombre) {
            nombreError.textContent = 'El nombre es requerido';
            isValid = false;
        } else if (nombre.length < 3) {
            nombreError.textContent = 'El nombre debe tener al menos 3 caracteres';
            isValid = false;
        }
        
        // Validate email
        if (!email) {
            emailError.textContent = 'El correo es requerido';
            isValid = false;
        } else if (!isValidEmail(email)) {
            emailError.textContent = 'Correo inválido';
            isValid = false;
        }
        
        // Validate password
        if (!password) {
            passwordError.textContent = 'La contraseña es requerida';
            isValid = false;
        } else if (password.length < 6) {
            passwordError.textContent = 'La contraseña debe tener al menos 6 caracteres';
            isValid = false;
        }
        
        // Validate confirm password
        if (!confirmPassword) {
            confirmPasswordError.textContent = 'Debe confirmar la contraseña';
            isValid = false;
        } else if (password !== confirmPassword) {
            confirmPasswordError.textContent = 'Las contraseñas no coinciden';
            isValid = false;
        }
        
        if (isValid) {
            // Show success message
            successMessage.textContent = '✓ Usuario registrado correctamente. Redirigiendo...';
            successMessage.classList.add('show');
            
            // Redirect after 2 seconds
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        }
    });
}

// Password Recovery Form
const recuperarForm = document.getElementById('recuperarForm');
if (recuperarForm) {
    recuperarForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const emailError = document.getElementById('emailError');
        const successMessage = document.getElementById('successMessage');
        let isValid = true;
        
        // Clear previous messages
        emailError.textContent = '';
        successMessage.classList.remove('show');
        
        // Validate email
        if (!email) {
            emailError.textContent = 'El correo es requerido';
            isValid = false;
        } else if (!isValidEmail(email)) {
            emailError.textContent = 'Correo inválido';
            isValid = false;
        }
        
        if (isValid) {
            // Show success message
            successMessage.textContent = '✓ Se ha enviado un enlace de recuperación al correo ingresado.';
            successMessage.classList.add('show');
            
            // Clear form
            recuperarForm.reset();
        }
    });
}

// Email validation helper
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

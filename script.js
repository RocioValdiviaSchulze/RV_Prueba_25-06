const form = document.getElementById("miFormulario");
const txtUser = document.getElementById("nombre");
const txtEmail = document.getElementById("email");
const txtPass = document.getElementById("password");
const txtConfPass = document.getElementById("confirm_password");
const btnSubmit = document.getElementById("boton");

let userOk = false, emailOk = false, passOK = false, confPassOk = false;

txtUser.addEventListener("input", () => {
    const valor = txtUser.value.trim();
    let tienesSsimbolos = false;
    if (valor === "") {
        userOk = false;
        marcarEstado("grupo-usuario", "info-user", false, "El nombre no puede estar vacío");
        return;
    }
    for (let i = 0; i < valor.length; i++) {
        const codigoAscii = valor.charCodeAt(i);
        const esNumero = (codigoAscii >= 48 && codigoAscii <= 57);
        const esMayuscula = (codigoAscii >= 65 && codigoAscii <= 90);
        const esMinuscula = (codigoAscii >= 97 && codigoAscii <= 122);

        if (!esNumero && !esMayuscula && !esMinuscula) {
            tienesSsimbolos = true;
            break;
        }
    }

    if (valor.length >= 6 && !tienesSsimbolos) {
        userOk = true;
        marcarEstado("grupo-usuario", "info-user", true, "Nombre valido.");
    } else {
        userOk = false;
        marcarEstado("grupo-usuario", "info-user", false, "Minimo 6 caracteres y sin espacios vacios o simbolos.")
    }
});

txtEmail.addEventListener("input", () => {
    const valor = txtEmail.value.trim();

    if (valor === "") {
        emailOk = false;
        marcarEstado("grupo-email", "info-email", false, "El correo no puede estar vacío");
        return;
    }

    const formatoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor);

    if (formatoValido) {
        emailOk = true;
        marcarEstado("grupo-email", "info-email", true, "Correo válido.");
    } else {
        emailOk = false;
        marcarEstado("grupo-email", "info-email", false, "Introduce un formato de correo válido.");
    }
});

txtPass.addEventListener("input", () => {
    const valor = txtPass.value;

    if (valor === "") {
        passOk = false;
        marcarEstado("grupo-pass", "info-pass", false, "La contraseña no puede etar vacia.");
        return;
    }

    let tieneMayuscula = false;
    let tieneMinuscula = false;
    let tieneNumero = false;

    for (let i = 0; i < valor.length; i++) {
        const ascii = valor.charCodeAt(i);
        if (ascii >= 65 && ascii <= 90) tieneMayuscula = true;
        if (ascii >= 97 && ascii <= 122) tieneMinuscula = true;
        if (ascii >= 48 && ascii <= 57) tieneNumero = true;
    }

    if (valor.length >= 8 && tieneMayuscula && tieneMinuscula && tieneNumero) {
        passOk = true;
        marcarEstado("grupo-pass", "info-pass", true, "Contraseña gud.");
    } else {
        passOk = false;
        marcarEstado("grupo-pass", "info-pass", false, "Minimo 8 caracteres con mayusculas, minusculas y numero.");
    }

    if (txtConfPass.value.length > 0) {
        evaluarConfirmacion();
    }
});

function evaluarConfirmacion() {
    const contraOriginal = txtPass.value;
    const contraConfirmacion = txtConfPass.value;

    if (contraConfirmacion === "") {
        confPassOk = false;
        marcarEstado("grupo-confPass", "info-confPass", false, "Debe confirmar la contraseña");
        return;
    }

    if (contraConfirmacion === contraOriginal) {
        confOk = true;
        marcarEstado("grupo-confPass", "info-confPass", true, "Las contraseñas coinciden");
    } else {
        confOk = false;
        marcarEstado("grupo-confPass", "info-confPass", false, "Las contraseñas no coinciden");
    }
}

txtConfPass.addEventListener("input", evaluarConfirmacion);

function marcarEstado(groupId, infoId, esValido, mensaje) {
    const grupo = document.getElementById(groupId);
    const info = document.getElementById(infoId);
    
    if (info) info.textContent = mensaje;

    if (grupo) {
        if (esValido) {
            grupo.className = "campo valido";
            if (info) info.className = "msg exito-text";
        } else {
            grupo.className = "campo invalido"; 
            if (info) info.className = "msg error-text";
        }
    }

    btnSubmit.disabled = !(userOk && emailOk && passOk && confPassOk);
}

form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!(userOk && emailOk && passOk && confPassOk)) {
        alert("Arregle los errores del formulario antes de enviar.");
        return;
    }

    const datosParaEnviar = {
        nombre: txtUser.value,
        email: txtEmail.value,
        password: txtPass.value,
        confirm_password: txtConfPass.value
    };

    //No sabia de q otra forma hacerlo asi q lo puse noma :p
    fetch('http://localhost:3000/enviar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(datosParaEnviar)
    })
    .then(response => {
        if (response.ok) {
            alert('Formulario enviado correctamente');
            
            const msgExito = document.getElementById("confirmationMessage");
            if (msgExito) {
                msgExito.textContent = "Datos guardados correctamente en la DB";
                msgExito.style.display = "block";
            }
            
            form.reset();
            document.querySelectorAll('.campo').forEach(c => c.className = "campo");

            userOk = false; 
            emailOk = false; 
            passOk = false; 
            confPassOk = false;
            btnSubmit.disabled = true;

        } else {
            alert('Error en el servidor al procesar el formulario.');
        }
    })
    .catch(error => {
        console.error('Error al enviar los datos: ', error);
        alert('No se pudo conectar con el servidor. Asegúrate de tener corriendo Node.js.');
    });
});
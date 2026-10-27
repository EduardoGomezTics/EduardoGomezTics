// main.js - inicio del portafolio
console.log('Portafolio cargado');

// Año dinámico en el footer
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

document.addEventListener('DOMContentLoaded', () => {
    const historialList = document.getElementById('historial-list');
    const message = document.getElementById('message');
    
    function cargarHistorial() {
        const historial = JSON.parse(localStorage.getItem('reporteHistory')) || [];
        historialList.innerHTML = '';
        
        if (historial.length === 0) {
            message.innerText = "No hay reportes guardados en el historial.";
            message.style.display = 'block';
        } else {
            message.style.display = 'none';
            historial.forEach(reporte => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <span>${reporte.fecha} - ${reporte.tipo} - ${reporte.reporteData.nombreCofre}</span>
                    <div>
                        <button onclick="verReporte(${reporte.id})">Ver</button>
                        <button class="delete-btn" onclick="eliminarReporte(${reporte.id})">Eliminar</button>
                    </div>
                `;
                historialList.appendChild(li);
            });
        }
    }

    window.verReporte = (id) => {
        const historial = JSON.parse(localStorage.getItem('reporteHistory'));
        const reporteSeleccionado = historial.find(reporte => reporte.id === id);
        if (reporteSeleccionado) {
            localStorage.setItem('currentReport', JSON.stringify(reporteSeleccionado));
            window.open('reporte.html', '_blank');
        } else {
            alert("El reporte no fue encontrado.");
        }
    };

    window.eliminarReporte = (id) => {
        let historial = JSON.parse(localStorage.getItem('reporteHistory'));
        historial = historial.filter(reporte => reporte.id !== id);
        localStorage.setItem('reporteHistory', JSON.stringify(historial));
        cargarHistorial(); // Recarga la lista para mostrar el cambio
        alert("Reporte eliminado.");
    };

    window.toggleMode = () => {
        const body = document.body;
        const modeBtn = document.getElementById('mode-btn');
        if (body.classList.contains('pc-mode')) {
            body.classList.remove('pc-mode');
            body.classList.add('phone-mode');
            modeBtn.innerText = 'Cambiar a Modo PC';
        } else {
            body.classList.remove('phone-mode');
            body.classList.add('pc-mode');
            modeBtn.innerText = 'Cambiar a Modo Teléfono';
        }
    };

    cargarHistorial();
});
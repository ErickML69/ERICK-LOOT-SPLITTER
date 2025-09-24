document.addEventListener('DOMContentLoaded', () => {
    const reporte = JSON.parse(localStorage.getItem('currentReport'));

    if (!reporte) {
        alert("No se encontraron datos de reporte. Vuelve a la página principal y calcula el botín.");
        window.location.href = 'index.html';
        return;
    }

    const reporteInteractivoDiv = document.getElementById('reporte-interactivo');
    const tipoDeCofreP = document.getElementById('tipo-de-cofre');
    tipoDeCofreP.innerText = `Tipo: ${reporte.tipo}`;
    
    function generarReporteHTML() {
        let htmlContent = `
            <h3>Cofre: ${reporte.reporteData.nombreCofre}</h3>
            <p><strong>Fecha:</strong> ${reporte.fecha}</p>
            <p><strong>Total de Loot:</strong> ${reporte.reporteData.totalDineroOriginal.toLocaleString('es-ES')} objetos y ${reporte.reporteData.totalSilverOriginal.toLocaleString('es-ES')} silver.</p>
            <hr style="border-color: #e0ac46;">
            <h4>Reparto por Jugador:</h4>
            <ul>
        `;

        reporte.participantes.forEach((p, index) => {
            const checked = p.pagado ? 'checked' : '';
            htmlContent += `
                <li>
                    <span><strong>${p.nombre}:</strong> ${p.botin.dinero.toLocaleString('es-ES')} objetos y ${p.botin.silver.toLocaleString('es-ES')} silver.</span>
                    <div class="checkbox-pagado">
                        <input type="checkbox" id="pagado-reporte-${index}" onchange="marcarPagadoEnReporte(${index})" ${checked}>
                        <label for="pagado-reporte-${index}"></label>
                    </div>
                </li>
            `;
        });

        htmlContent += `</ul>`;
        
        htmlContent += `
            <hr style="border-color: #e0ac46;">
            <h4>Sobrante:</h4>
            <p><strong>Loot en objetos:</strong> <span style="color: #dc3545;">${reporte.reporteData.dineroSobrante}</span></p>
            <p><strong>Loot en silver:</strong> <span style="color: #dc3545;">${reporte.reporteData.silverSobrante}</span></p>
        `;

        reporteInteractivoDiv.innerHTML = htmlContent;
    }
    
    window.marcarPagadoEnReporte = (index) => {
        reporte.participantes[index].pagado = !reporte.participantes[index].pagado;
        localStorage.setItem('currentReport', JSON.stringify(reporte));
    };

    window.copiarReporte = () => {
        let reporteTexto = `--- REPORTE DE BOTÍN ---\n`;
        reporteTexto += `Tipo: ${reporte.tipo}\n`;
        reporteTexto += `Cofre: ${reporte.reporteData.nombreCofre}\n`;
        reporteTexto += `Fecha: ${reporte.fecha}\n`;
        reporteTexto += `Total de Loot: ${reporte.reporteData.totalDineroOriginal.toLocaleString('es-ES')} objetos y ${reporte.reporteData.totalSilverOriginal.toLocaleString('es-ES')} silver.\n\n`;

        reporteTexto += `--- REPARTO POR JUGADOR ---\n`;
        reporte.participantes.forEach(p => {
            const estadoPago = p.pagado ? 'Pagado ✅' : 'No pagado ❌';
            reporteTexto += `${p.nombre}:\n`;
            reporteTexto += `  Objetos: ${p.botin.dinero.toLocaleString('es-ES')}\n`;
            reporteTexto += `  Silver: ${p.botin.silver.toLocaleString('es-ES')}\n`;
            reporteTexto += `  Estado: ${estadoPago}\n\n`;
        });

        reporteTexto += `--- SOBRANTE ---\n`;
        reporteTexto += `Loot en objetos: ${reporte.reporteData.dineroSobrante}\n`;
        reporteTexto += `Loot en silver: ${reporte.reporteData.silverSobrante}\n`;
        reporteTexto += `-------------------------\n`;

        navigator.clipboard.writeText(reporteTexto).then(() => {
            alert("✅ Reporte copiado al portapapeles. ¡Ya puedes pegarlo!");
        }).catch(err => {
            console.error('Error al copiar el reporte: ', err);
            alert("❌ Hubo un error al copiar el reporte. Por favor, inténtalo de nuevo.");
        });
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
    
    generarReporteHTML();
});
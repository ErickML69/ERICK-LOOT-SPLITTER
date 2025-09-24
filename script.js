let participantes = [];
let contadorEntradas = 1;

let todosLosJugadores = JSON.parse(localStorage.getItem('todosLosJugadores')) || [];

document.addEventListener('DOMContentLoaded', () => {
    if (window.innerWidth <= 768) {
        document.body.classList.remove('pc-mode');
        document.body.classList.add('phone-mode');
        document.getElementById('mode-icon').innerText = '💻';
    }
    setInterval(actualizarRelojUTC, 1000);
});

function actualizarRelojUTC() {
    const ahora = new Date();
    const horas = ahora.getUTCHours().toString().padStart(2, '0');
    const minutos = ahora.getUTCMinutes().toString().padStart(2, '0');
    const segundos = ahora.getUTCSeconds().toString().padStart(2, '0');
    document.getElementById('utc-clock').innerText = `UTC: ${horas}:${minutos}:${segundos}`;
}

document.getElementById('nombreParticipante').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        agregarParticipante();
    }
});

function agregarParticipante() {
    const input = document.getElementById('nombreParticipante');
    const nombre = input.value.trim();
    if (nombre) {
        participantes.push({
            nombre: nombre,
            entradas: { entrada1: true, entrada2: false, entrada3: false, entrada4: false },
            pagado: false
        });
        actualizarListaParticipantes();
        
        if (!todosLosJugadores.includes(nombre)) {
            todosLosJugadores.push(nombre);
            localStorage.setItem('todosLosJugadores', JSON.stringify(todosLosJugadores));
            actualizarDatalist();
        }
        
        input.value = '';
        generarReporteCompleto();
    }
}

function actualizarListaParticipantes() {
    const lista = document.getElementById('listaParticipantes');
    lista.innerHTML = '';
    
    participantes.forEach((participante, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${index + 1}. ${participante.nombre}</span>
            <div class="checkbox-group">
                <input type="checkbox" id="entrada1-${index}" onclick="actualizarEntradas(${index}, 'entrada1', this.checked); generarReporteCompleto()" ${participante.entradas.entrada1 ? 'checked' : ''}>
                <label for="entrada1-${index}">Entrada 1</label>
                <input type="checkbox" id="entrada2-${index}" onclick="actualizarEntradas(${index}, 'entrada2', this.checked); generarReporteCompleto()" ${participante.entradas.entrada2 ? 'checked' : ''}>
                <label for="entrada2-${index}">Entrada 2</label>
                <input type="checkbox" id="entrada3-${index}" onclick="actualizarEntradas(${index}, 'entrada3', this.checked); generarReporteCompleto()" ${participante.entradas.entrada3 ? 'checked' : ''}>
                <label for="entrada3-${index}">Entrada 3</label>
                <input type="checkbox" id="entrada4-${index}" onclick="actualizarEntradas(${index}, 'entrada4', this.checked); generarReporteCompleto()" ${participante.entradas.entrada4 ? 'checked' : ''}>
                <label for="entrada4-${index}">Entrada 4</label>
                <button class="eliminar-btn" onclick="eliminarParticipante(${index})">X</button>
            </div>
        `;
        lista.appendChild(li);
    });
}

function actualizarDatalist() {
    const datalist = document.getElementById('lista-jugadores');
    datalist.innerHTML = '';
    todosLosJugadores.forEach(jugador => {
        const option = document.createElement('option');
        option.value = jugador;
        datalist.appendChild(option);
    });
}
actualizarDatalist();

function actualizarEntradas(index, entrada, estado) {
    participantes[index].entradas[entrada] = estado;
}

function eliminarParticipante(index) {
    participantes.splice(index, 1);
    actualizarListaParticipantes();
    generarReporteCompleto();
}

function añadirOtraEntrada() {
    if (contadorEntradas >= 4) {
        alert("El límite de 4 entradas ha sido alcanzado.");
        return;
    }
    contadorEntradas++;
    const container = document.getElementById('entradasContainer');
    const nuevaEntradaHTML = `
        <div id="entrada-${contadorEntradas}">
            <div class="entrada-header">
                <h3>Entrada ${contadorEntradas}</h3>
                <button class="eliminar-btn" onclick="eliminarEntrada(${contadorEntradas})">X</button>
            </div>
            <div class="input-group">
                <div>
                    <label for="dineroEntrada${contadorEntradas}">Loot Objetos:</label>
                    <input type="text" id="dineroEntrada${contadorEntradas}" value="0" oninput="formatearNumero(this); generarReporteCompleto()">
                </div>
                <div>
                    <label for="silverEntrada${contadorEntradas}">Loot Silver:</label>
                    <input type="text" id="silverEntrada${contadorEntradas}" value="0" oninput="formatearNumero(this); generarReporteCompleto()">
                </div>
            </div>
        </div>
    `;
    container.insertAdjacentHTML('beforeend', nuevaEntradaHTML);
    generarReporteCompleto();
}

function eliminarEntrada(numeroEntrada) {
    if (numeroEntrada === 1) {
        alert("No se puede eliminar la primera entrada. Puedes cambiar sus valores a 0.");
        return;
    }
    const entradaDiv = document.getElementById(`entrada-${numeroEntrada}`);
    if (entradaDiv) {
        entradaDiv.remove();
    }
    generarReporteCompleto();
}

function resetearTodo() {
    document.getElementById('nombreParticipante').value = '';
    document.getElementById('nombreCofre').value = '';
    
    document.getElementById('dineroEntrada1').value = 0;
    document.getElementById('silverEntrada1').value = 0;
    
    const entradasExtras = document.querySelectorAll('#entradasContainer > div[id^="entrada-"]');
    entradasExtras.forEach(div => {
        if (div.id !== 'entrada-1') {
            div.remove();
        }
    });

    participantes = [];
    contadorEntradas = 1;
    
    document.getElementById('listaParticipantes').innerHTML = '';
    document.getElementById('resultados').innerHTML = '<h3>Resultados</h3><p>Ingresa los datos para ver el resultado en tiempo real.</p>';
}

function formatearNumero(input) {
    const valorSinFormato = input.value.replace(/[^\d]/g, '');
    const numero = Number(valorSinFormato) || 0;
    input.value = numero.toLocaleString('es-ES');
}

function limpiarFormato(valor) {
    return Number(valor.replace(/[^\d]/g, '')) || 0;
}

function generarReporteCompleto() {
    if (participantes.length === 0) {
        document.getElementById('resultados').innerHTML = '<h3>Resultados</h3><p>Agrega al menos un participante para ver el reparto.</p>';
        return;
    }

    const dineroInputs = document.querySelectorAll('input[id^="dineroEntrada"]');
    const silverInputs = document.querySelectorAll('input[id^="silverEntrada"]');
    
    let totalDineroOriginal = Array.from(dineroInputs).reduce((sum, input) => sum + limpiarFormato(input.value), 0);
    let totalSilverOriginal = Array.from(silverInputs).reduce((sum, input) => sum + limpiarFormato(input.value), 0);
    
    const botinPorParticipante = {};
    participantes.forEach(p => {
        botinPorParticipante[p.nombre] = { dinero: 0, silver: 0 };
    });
    
    const entradas = document.querySelectorAll('#entradasContainer > div[id^="entrada-"]');
    entradas.forEach(entradaDiv => {
        const idEntrada = entradaDiv.id.split('-')[1];
        const dineroInput = document.getElementById(`dineroEntrada${idEntrada}`);
        const silverInput = document.getElementById(`silverEntrada${idEntrada}`);

        const lootDinero = limpiarFormato(dineroInput.value);
        const lootSilver = limpiarFormato(silverInput.value);
        
        const participantesEnEstaEntrada = participantes.filter(p => p.entradas[`entrada${idEntrada}`]);
        
        if (participantesEnEstaEntrada.length > 0) {
            const parteDinero = Math.floor(lootDinero / participantesEnEstaEntrada.length);
            const parteSilver = Math.floor(lootSilver / participantesEnEstaEntrada.length);
            
            participantesEnEstaEntrada.forEach(p => {
                botinPorParticipante[p.nombre].dinero += parteDinero;
                botinPorParticipante[p.nombre].silver += parteSilver;
            });
        }
    });

    const resultadosDiv = document.getElementById('resultados');
    let resultadosHTML = '<h3>Resultados</h3><ul>';
    let totalRepartidoDinero = 0;
    let totalRepartidoSilver = 0;

    for (const nombre in botinPorParticipante) {
        resultadosHTML += `<li>${nombre}: ${botinPorParticipante[nombre].dinero.toLocaleString('es-ES')} objetos y ${botinPorParticipante[nombre].silver.toLocaleString('es-ES')} silver.</li>`;
        totalRepartidoDinero += botinPorParticipante[nombre].dinero;
        totalRepartidoSilver += botinPorParticipante[nombre].silver;
    }

    const dineroSobrante = totalDineroOriginal - totalRepartidoDinero;
    const silverSobrante = totalSilverOriginal - totalRepartidoSilver;

    resultadosHTML += `</ul>
        <h4>Sobrante:</h4>
        <p>Objetos: <span style="color: #dc3545;">${dineroSobrante.toLocaleString('es-ES')}</span></p>
        <p>Silver: <span style="color: #dc3545;">${silverSobrante.toLocaleString('es-ES')}</span></p>
    `;
    resultadosDiv.innerHTML = resultadosHTML;
}

function guardarReporte() {
    if (participantes.length === 0) {
        alert("Por favor, agrega al menos un participante.");
        return;
    }

    const dineroInputs = document.querySelectorAll('input[id^="dineroEntrada"]');
    const silverInputs = document.querySelectorAll('input[id^="silverEntrada"]');
    
    let totalDineroOriginal = Array.from(dineroInputs).reduce((sum, input) => sum + limpiarFormato(input.value), 0);
    let totalSilverOriginal = Array.from(silverInputs).reduce((sum, input) => sum + limpiarFormato(input.value), 0);
    
    if (totalDineroOriginal === 0 && totalSilverOriginal === 0) {
        alert("Por favor, ingresa el botín en al menos una entrada.");
        return;
    }

    const botinPorParticipante = {};
    participantes.forEach(p => {
        botinPorParticipante[p.nombre] = { dinero: 0, silver: 0 };
    });
    
    let totalDineroRepartido = 0;
    let totalSilverRepartido = 0;

    const entradas = document.querySelectorAll('#entradasContainer > div[id^="entrada-"]');
    entradas.forEach(entradaDiv => {
        const idEntrada = entradaDiv.id.split('-')[1];
        const dineroInput = document.getElementById(`dineroEntrada${idEntrada}`);
        const silverInput = document.getElementById(`silverEntrada${idEntrada}`);

        const lootDinero = limpiarFormato(dineroInput.value);
        const lootSilver = limpiarFormato(silverInput.value);
        
        const participantesEnEstaEntrada = participantes.filter(p => p.entradas[`entrada${idEntrada}`]);
        
        if (participantesEnEstaEntrada.length > 0) {
            const parteDinero = Math.floor(lootDinero / participantesEnEstaEntrada.length);
            const parteSilver = Math.floor(lootSilver / participantesEnEstaEntrada.length);
            
            participantesEnEstaEntrada.forEach(p => {
                botinPorParticipante[p.nombre].dinero += parteDinero;
                botinPorParticipante[p.nombre].silver += parteSilver;
            });
            totalDineroRepartido += parteDinero * participantesEnEstaEntrada.length;
            totalSilverRepartido += parteSilver * participantesEnEstaEntrada.length;
        }
    });
    
    const dineroSobrante = totalDineroOriginal - totalDineroRepartido;
    const silverSobrante = totalSilverOriginal - totalSilverRepartido;

    participantes.forEach(p => {
        p.botin = botinPorParticipante[p.nombre];
    });

    const tipoCofre = document.querySelector('input[name="tipoCofre"]:checked').value;

    const reporteFinal = {
        id: Date.now(),
        fecha: new Date().toLocaleString('es-ES'),
        tipo: tipoCofre,
        participantes: participantes,
        reporteData: {
            nombreCofre: document.getElementById('nombreCofre').value || 'Sin nombre',
            totalDineroOriginal: totalDineroOriginal,
            totalSilverOriginal: totalSilverOriginal,
            dineroSobrante: dineroSobrante,
            silverSobrante: silverSobrante
        }
    };

    localStorage.setItem('currentReport', JSON.stringify(reporteFinal));
    
    let historial = JSON.parse(localStorage.getItem('reporteHistory')) || [];
    historial.unshift(reporteFinal); 
    localStorage.setItem('reporteHistory', JSON.stringify(historial));

    window.open('reporte.html', '_blank');
}

function toggleMode() {
    const body = document.body;
    const modeIcon = document.getElementById('mode-icon');
    if (body.classList.contains('pc-mode')) {
        body.classList.remove('pc-mode');
        body.classList.add('phone-mode');
        modeIcon.innerText = '💻';
    } else {
        body.classList.remove('phone-mode');
        body.classList.add('pc-mode');
        modeIcon.innerText = '📱';
    }
}
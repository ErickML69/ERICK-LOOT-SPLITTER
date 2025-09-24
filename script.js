let participantes = [];

function agregarParticipante() {
    const input = document.getElementById('nombreParticipante');
    const nombre = input.value.trim();
    if (nombre) {
        participantes.push(nombre);
        const lista = document.getElementById('listaParticipantes');
        const nuevoParticipante = document.createElement('li');
        nuevoParticipante.textContent = nombre;
        lista.appendChild(nuevoParticipante);
        input.value = '';
    }
}

function calcularBotin() {
    const totalParticipantes = participantes.length;
    if (totalParticipantes === 0) {
        alert("Por favor, agrega al menos un participante.");
        return;
    }

    const dinero = parseInt(document.getElementById('totalDinero').value);
    const silver = parseInt(document.getElementById('totalSilver').value);

    // Usa Math.floor() para obtener solo el valor entero
    const dineroPorPersona = Math.floor(dinero / totalParticipantes);
    const silverPorPersona = Math.floor(silver / totalParticipantes);
    
    // Aquí calculamos el "restante" para un reparto más justo.
    const dineroRestante = dinero % totalParticipantes;
    const silverRestante = silver % totalParticipantes;

    const resultadosDiv = document.getElementById('resultados');
    resultadosDiv.innerHTML = ''; // Limpiar resultados anteriores

    let resultadoHTML = `
        <h3>A cada uno le toca:</h3>
        <p><strong>Dinero:</strong> ${dineroPorPersona}</p>
        <p><strong>Silver:</strong> ${silverPorPersona}</p>
        <hr>
        <h4>Distribución detallada:</h4>
        <ul>
    `;

    participantes.forEach(nombre => {
        resultadoHTML += `<li><strong>${nombre}:</strong> ${dineroPorPersona} dinero y ${silverPorPersona} silver.</li>`;
    });

    resultadoHTML += `</ul>`;
    
    // Agregamos la información del restante al final
    resultadoHTML += `
        <h4>Sobrante:</h4>
        <p><strong>Dinero sobrante:</strong> ${dineroRestante}</p>
        <p><strong>Silver sobrante:</strong> ${silverRestante}</p>
    `;

    resultadosDiv.innerHTML = resultadoHTML;
}
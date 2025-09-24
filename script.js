let participantes = [];

function agregarParticipante() {
    const input = document.getElementById('nombreParticipante');
    const nombre = input.value.trim();
    if (nombre) {
        participantes.push(nombre);
        actualizarListaParticipantes();
        input.value = '';
    }
}

function actualizarListaParticipantes() {
    const lista = document.getElementById('listaParticipantes');
    lista.innerHTML = ''; // Limpiar la lista antes de volver a renderizar
    
    participantes.forEach((nombre, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <div>
                <input type="checkbox" onclick="marcarDistribuido(this)">
                <span>${nombre}</span>
            </div>
            <button class="eliminar-btn" onclick="eliminarParticipante(${index})">X</button>
        `;
        lista.appendChild(li);
    });
}

function eliminarParticipante(index) {
    participantes.splice(index, 1);
    actualizarListaParticipantes();
}

function marcarDistribuido(checkbox) {
    const li = checkbox.parentNode.parentNode;
    if (checkbox.checked) {
        li.classList.add('distribuido');
    } else {
        li.classList.remove('distribuido');
    }
}

function resetearTodo() {
    // Resetear los campos de entrada
    document.getElementById('nombreParticipante').value = '';
    document.getElementById('totalDinero').value = 0;
    document.getElementById('totalSilver').value = 0;

    // Resetear la lista de participantes y el array
    participantes = [];
    document.getElementById('listaParticipantes').innerHTML = '';

    // Resetear los checkboxes de fotos
    document.getElementById('foto1').checked = false;
    document.getElementById('foto2').checked = false;
    document.getElementById('foto3').checked = false;

    // Limpiar los resultados
    document.getElementById('resultados').innerHTML = '';
}

function calcularBotin() {
    const totalParticipantes = participantes.length;
    if (totalParticipantes === 0) {
        alert("Por favor, agrega al menos un participante.");
        return;
    }

    const dinero = parseInt(document.getElementById('totalDinero').value);
    const silver = parseInt(document.getElementById('totalSilver').value);

    const dineroPorPersona = Math.floor(dinero / totalParticipantes);
    const silverPorPersona = Math.floor(silver / totalParticipantes);
    
    const dineroRestante = dinero % totalParticipantes;
    const silverRestante = silver % totalParticipantes;

    const resultadosDiv = document.getElementById('resultados');
    resultadosDiv.innerHTML = ''; 

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
    
    resultadoHTML += `
        <h4>Sobrante:</h4>
        <p><strong>Dinero sobrante:</strong> ${dineroRestante}</p>
        <p><strong>Silver sobrante:</strong> ${silverRestante}</p>
    `;

    resultadosDiv.innerHTML = resultadoHTML;
}
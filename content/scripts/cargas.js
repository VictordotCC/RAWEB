APIURL = 'http://127.0.0.1:5000/';

async function cargarProyectos() {
    console.log('Cargando Proyectos')
    const url = APIURL + 'proyectos';
    await fetch(url)
        .then(response => response.json())
        .then(data => {
            let proyectos = JSON.parse(data);

            let tbody = document.getElementById('proyectosTBody');

            if (proyectos.length == 0) {
                let tr = document.createElement('tr');
                tr.innerHTML = `<td colspan="5" class="text-center" style="color: #6c757d;">No hay Proyectos Creados</td>`;
                tbody.appendChild(tr);
                return;
            }
            
            proyectos.forEach(proyecto => {
                let tr = document.createElement('tr');
                let activo = proyecto.estado ? 'Activo' : 'Inactivo';
                console.log(proyecto._id.$oid);
                tr.innerHTML = `
                    <td>${proyecto.nombreProyecto}</td>
                    <td>${proyecto.fechaCreacion}</td>
                    <td>${activo} <button type="button" class="btn-primary btn-sm" onclick="cargarGM('${proyecto._id.$oid}')">Calcular</button></td>
                    <td>${proyecto.descripcionProyecto}</td>
                    <td><button type="button" class="btn btn-link" onclick="verMapa();">Ver</button></td>`;
                tbody.appendChild(tr);
            });
        })
        .catch(error => {
            alert(`Ha ocurrido un Error en la Carga : ${error}`);
        });
}

async function cargarGM(id_proyecto) {
    console.log('Generando Mapa');
    idFormData = new FormData();
    idFormData.append('id_proyecto', id_proyecto);
    await fetch(APIURL + 'gm', {
        method: 'POST',
        body: idFormData
    }).then(response => response.json())
        .catch(error => {
            alert(`Ha ocurrido un Error en la Creación : ${error}`);
            success = false;
            return;
        });
}
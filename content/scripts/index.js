APIURL = 'http://127.0.0.1:5000/';

function load(page,section) {
    loadPageSection(page, section, assignToTarget);
    function assignToTarget (source) {
        container = document.getElementById('cuerpo');
        container.replaceChildren();
        document.getElementById('cuerpo').appendChild(source)
    }
};

function verMapa() {
    //TODO: HIDE API KEY
    mapboxgl.accessToken = 'pk.eyJ1IjoidmljdG9yY2M4OCIsImEiOiJja3lhdnl1NzQwOWc5MnBta3A2cjZscThqIn0.M8o_N_BSN_MpTlGAhgGgvA';

    //show console
    document.getElementById('console').classList.remove('d-none');
    document.getElementById('console').classList.add('d-block');
    //document.getElementById('filters-right').classList.remove('d-none');
    //document.getElementById('filters-right').classList.add('d-block');
    document.getElementById('sliderbar').classList.remove('d-none');
    document.getElementById('sliderbar').classList.add('d-block');

    //create map
    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/satellite-streets-v11',
        center: [-72.52, -37.42],
        zoom: 11
    });
    //TODO: add sources with loop
    map.on('load', () => {
        
        map.loadImage('./content/img/output2.png', (error, image) => {
            if (error) throw error;
            map.addImage('tower-cell', image, {sdf: true});

            map.addSource('points', {
                type: 'geojson',
                data: './content/source/geojson4.geojson'
            });
            map.addSource('points2', {
                'type': 'geojson',
                'data': './content/source/geojson3.geojson'
            });
    
            //TODO: add layers with loop
            map.addLayer({
                'id': '1',
                'type': 'symbol',
                'source': 'points',
                'layout': {
                    'icon-image': 'tower-cell',
                    'icon-size': 1.5,
                    'icon-allow-overlap': true
                },
                'paint': {
                    'icon-color': ['get', 'marker-color'],
                }
            });
            map.addLayer({
                'id': '2',
                'type': 'circle',
                'source': 'points2',
                
                'layout': {
                'visibility': 'none',
                },
                'paint': {
                'circle-color': ['get', 'marker-color'],
                'circle-opacity': 0.8,
                'circle-radius': 16
                }
            
            });

            map.addLayer({
                'id': '2-values',
                'type': 'symbol',
                'source': 'points2',
                'layout': {
                    'text-field': ['get', 'value'],
                    'text-font': ['Arial Unicode MS Bold'],
                    'text-size': 12,
                    'icon-allow-overlap': true,
                },
                'paint': {
                    'text-color': '#fff'
                }
            });
            
            document.getElementById('slider').addEventListener('input', (e) => {
                const popup = document.getElementsByClassName('mapboxgl-popup');
                if (popup[0])
                    popup[0].remove();

                const value = parseInt(e.target.value);
                const date = document.getElementById('active-date');
                //TODO: update layers visibility with loop
                if (value == 1) {
                    map.setLayoutProperty('1', 'visibility', 'visible');
                    map.setLayoutProperty('2', 'visibility', 'none');
                    date.innerHTML = `0${value}`;
                } else {
                    map.setLayoutProperty('1', 'visibility', 'none');
                    map.setLayoutProperty('2', 'visibility', 'visible');
                    date.innerHTML = `0${value}`;
                }
            });
        });
        
    });

    map.on('click', ['1','2'], (e) => {

        const coordinates = e.features[0].geometry.coordinates.slice();
        // Ensure that if the map is zoomed out such that multiple
        // copies of the feature are visible, the popup appears
        // over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            }
        new mapboxgl.Popup()
            .setLngLat(coordinates)
            .setHTML(`<p style="background-color: ${(e.features[0].properties['marker-color'])}">Nivel de Ruido: ${(e.features[0].properties.value)}</p>`)
            .addTo(map);
        
            
    });
    map.on('mouseenter', ['1','2'], () => {
        map.getCanvas().style.cursor = 'pointer';
        });
         
        // Change it back to a pointer when it leaves.
        map.on('mouseleave', ['1','2'], () => {
        map.getCanvas().style.cursor = '';
        });
}

document.addEventListener('DOMContentLoaded', function() {
    navlinks = document.querySelectorAll('.nav-link');

    navlinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            navlinks.forEach(function(link) {
                link.classList.remove('current');
                link.classList.add('notselected');
            });
            e.target.classList.add('current');
            e.target.classList.remove('notselected');
            load(e.target.getAttribute('data-page'), '#contenido');

        });
    });

    document.getElementById('guardarProyecto').addEventListener('click', async function(e) {
        //POST to API
        e.preventDefault();
        var form = document.getElementById('nuevoProyectoForm');
        var formData = new FormData(form);

        var url = APIURL + 'proyectos';
        console.log(url);
        await fetch(url, {
            method: 'POST',
            body: formData
        }).then(response => response.json())
            .then(data => {
                alert("Proyecto Creado Correctamente");
                console.log(data);
                const container = document.getElementById('modalNuevoProyecto');
                const modal = bootstrap.Modal.getInstance(container);
                modal.hide();
            })
            .catch(error => {
                alert(`Ha ocurrido un Error en la Creación : ${error}`);
            });
    });
                                           
});






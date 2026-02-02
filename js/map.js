// js/map.js

// 1. World Bounds
var bounds = L.latLngBounds(L.latLng(-90, -180), L.latLng(90, 180));

// 2. Map Init
var map = L.map('map', {
    center: [20.5937, 78.9629],
    zoom: 4,
    minZoom: 3,
    maxBounds: bounds,
    maxBoundsViscosity: 1.0,
    worldCopyJump: false,
    zoomControl: false
}).setView([20.5937, 78.9629], 4);

// Add zoom control to bottom-left
L.control.zoom({
    position: 'bottomleft'
}).addTo(map);

window.map = map;

// 3. TILE LAYERS (Choose one)
// OPTION A: Current Voyager
/* L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; CARTO',
    noWrap: true,
    bounds: bounds
}).addTo(map); */

// OPTION B: Satellite View
L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri',
    noWrap: true
}).addTo(map);

L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}{r}.png', {
    pane: 'markerPane',
    opacity: 0.9,
    pointerEvents: 'none'
}).addTo(map);

var saffronIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

var currentLang = 'en';

fetch('data/entries.json')
    .then(res => res.json())
    .then(data => {
        var allMarkers = [];

        data.entries.forEach(item => {
            const lat = item.location.point.lat;
            const lng = item.location.point.lon;
            allMarkers.push([lat, lng]);

            var marker = L.marker([lat, lng], {icon: saffronIcon}).addTo(map);

            marker.on('click', function() {
                // Layout logic
                if (!document.body.classList.contains('sidebar-open')) {
                    document.body.classList.add('sidebar-open');
                    document.getElementById('sidebar').classList.add('active');
                    setTimeout(() => {
                        map.invalidateSize();
                        map.panTo(marker.getLatLng(), { animate: true });
                    }, 360);
                }

                // Call the function from timeline.js
                updateRuler(item.date);

                // UI & Fetch logic
                const title = item.content.title_i18n[currentLang] || item.content.title_i18n['en'];
                const subtitle = item.content.subtitle_i18n[currentLang] || item.content.subtitle_i18n['en'];
                document.getElementById('sidebar-title').innerText = title;
                document.getElementById('sidebar-subtitle').innerText = subtitle;
                
                // Convert date to DD-MM-YYYY format
                const [year, month, day] = item.date.split('-');
                const formattedDate = `${day}-${month}-${year}`;
                document.getElementById('sidebar-date').innerText = formattedDate + " | " + item.location.display_name;
                
                // Handle image gallery items
                if (item.content.image_path) {
                    const imageCaption = item.content.caption_i18n[currentLang] || item.content.caption_i18n['en'];
                    let galleryHTML = `<img src="${item.content.image_path}" style="width: 60%; max-width: 300px; height: auto; border-radius: 6px; margin-bottom: 20px;">`;
                    if (imageCaption) {
                        galleryHTML += `<p style="font-size: 0.9em; color: #666; font-style: italic; margin-top: 10px;">${imageCaption}</p>`;
                    }
                    if (item.source) {
                        galleryHTML += `<hr style="margin-top:40px; border:0; border-top:1px solid #ddd;">
                                        <div style="font-size: 0.85em; color: #666; font-style: italic;">
                                        Source: ${item.source.work}${item.source.volume ? ', Vol ' + item.source.volume : ''}${item.source.page ? ', p. ' + item.source.page : ''}${item.source.accession_id ? '<br>Accession: ' + item.source.accession_id : ''}
                                        </div>`;
                    }
                    document.getElementById('sidebar-body').innerHTML = galleryHTML;
                    document.getElementById('sidebar').scrollTop = 0;
                }
                // Handle text/lecture items
                else if (item.content.text_path) {
                    document.getElementById('sidebar-body').innerHTML = "<em>Loading article...</em>";
                    const finalPath = item.content.text_path.replace('{lang}', currentLang);
                    fetch(finalPath)
                        .then(res => res.text())
                        .then(text => {
                            let content = text.replace(/\n/g, '<br><br>');
                            if (item.source) {
                                content += `<hr style="margin-top:40px; border:0; border-top:1px solid #ddd;">
                                            <div style="font-size: 0.85em; color: #666; font-style: italic;">
                                            Source: ${item.source.work}, Vol ${item.source.volume}, ${item.source.quote_range || 'p. ' + item.source.page}
                                            </div>`;
                            }
                            document.getElementById('sidebar-body').innerHTML = content;
                            document.getElementById('sidebar').scrollTop = 0;
                        });
                }
            });
        });

        if (allMarkers.length > 0) map.fitBounds(allMarkers, {padding: [50, 50]});
    });

// Close sidebar listener
map.on('click', function() {
    if (document.body.classList.contains('sidebar-open')) {
        if (typeof closeSidebar === "function") {
            closeSidebar();
        } else {
            document.body.classList.remove('sidebar-open');
            document.getElementById('sidebar').classList.remove('active');
            setTimeout(() => { map.invalidateSize(); }, 360);
        }
    }
});
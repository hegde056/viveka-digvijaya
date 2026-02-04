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

// Store all markers globally for highlighting
window.allMarkers = {};
window.currentHighlightedMarker = null;

var currentLang = 'en';

// Load chapters index and then load all chapter files
fetch('data/chapters.json')
    .then(res => res.json())
    .then(index => {
        // Fetch all chapter files
        const chapterPromises = index.chapters.map(chapterPath => 
            fetch(chapterPath).then(res => res.json())
        );
        
        return Promise.all(chapterPromises);
    })
    .then(chapters => {
        // Initialize UI system with all chapters
        if (window.vivekaUI) {
            window.vivekaUI.init(chapters);
        }
        
        var allMarkers = [];
        
        // Process each chapter with its color
        chapters.forEach((chapter) => {
            const chapterColor = chapter.color || 'orange';
            
            // Create colored icon for this chapter
            const coloredIcon = new L.Icon({
                iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${chapterColor}.png`,
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
            });
            
            // Create highlighted version (larger)
            const highlightedIcon = new L.Icon({
                iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${chapterColor}.png`,
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                iconSize: [35, 57],
                iconAnchor: [17, 57],
                popupAnchor: [1, -47],
                shadowSize: [57, 57]
            });
            
            // Add entries from this chapter
            (chapter.entries || []).forEach(item => {
                const lat = item.location.point.lat;
                const lng = item.location.point.lon;
                allMarkers.push([lat, lng]);

                var marker = L.marker([lat, lng], {icon: coloredIcon}).addTo(map);
                
                // Store marker reference with its icons
                window.allMarkers[item.slug] = {
                    marker: marker,
                    normalIcon: coloredIcon,
                    highlightIcon: highlightedIcon
                };

                marker.on('click', function() {
                    // Use the UI system to display the entry
                    if (window.vivekaUI) {
                        window.vivekaUI.setSlug(item.slug);
                    }
                });
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
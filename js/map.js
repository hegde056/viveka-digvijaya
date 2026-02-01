// 1. Define the limits of the world (Latitude -90 to 90, Longitude -180 to 180)
var corner1 = L.latLng(-90, -180);
var corner2 = L.latLng(90, 180);
var bounds = L.latLngBounds(corner1, corner2);

// 2. Initialize the map with wrapping disabled
var map = L.map('map', {
    center: [20.5937, 78.9629],
    zoom: 4,
    maxBounds: bounds,            // Stops the user from dragging outside the world
    maxBoundsViscosity: 1.0,      // Makes the edges "hard" (the map won't bounce back)
    worldCopyJump: false          // Disables the infinite horizontal wrap
}).setView([20.5937, 78.9629], 4);

window.map = map;

// 3. Update your Tile Layer to also stop wrapping
L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; CARTO',
    maxZoom: 19,
    noWrap: true,                 // This stops the images themselves from repeating
    bounds: bounds                // Forces tiles to stay within world limits
}).addTo(map);

var saffronIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

fetch('data/locations.json')
    .then(res => res.json())
    .then(data => {
        var allMarkers = [];

        data.forEach(point => {
            allMarkers.push([point.lat, point.lng]);
            var marker = L.marker([point.lat, point.lng], {icon: saffronIcon}).addTo(map);

            marker.on('click', function() {
                const isAlreadyOpen = document.body.classList.contains('sidebar-open');

                if (!isAlreadyOpen) {
                    // FIRST CLICK: Shift the layout
                    document.body.classList.add('sidebar-open');
                    document.getElementById('sidebar').classList.add('active');

                    // Resize and center just this once
                    setTimeout(() => {
                        map.invalidateSize();
                        map.panTo(marker.getLatLng(), { animate: true });
                    }, 360);
                } else {
                    // SUBSEQUENT CLICKS: 
                    // We do NOTHING to the map. No panTo, no jumping.
                    // The map stays exactly where it is.
                }
                // Move the ruler indicator
                updateRuler(point.date);
                // ALWAYS update the content
                document.getElementById('sidebar-title').innerText = point.title;
                document.getElementById('sidebar-date').innerText = point.date + " | " + point.location;
                document.getElementById('sidebar-body').innerHTML = "<em>Loading article...</em>";
                
                fetch(`data/articles/${point.filename}`)
                    .then(res => res.text())
                    .then(text => {
                        document.getElementById('sidebar-body').innerHTML = text.replace(/\n/g, '<br><br>');
                        // Optional: Reset scroll position to top of article
                        document.getElementById('sidebar').scrollTop = 0;
                    })
                    .catch(err => {
                        document.getElementById('sidebar-body').innerHTML = "Error loading article.";
                    });
            });
        });

        if (allMarkers.length > 0) map.fitBounds(allMarkers, {padding: [50, 50]});
    });

// Close sidebar when clicking anywhere on the map background
map.on('click', function(e) {
    // Only close if the sidebar is actually open
    if (document.body.classList.contains('sidebar-open')) {
        closeSidebar(); // This calls the function in your index.html
    }
});

function updateRuler(dateString) {
    const year = parseInt(dateString.split('-')[0]);
    const startYear = 1863;
    const endYear = 1902;
    const totalYears = endYear - startYear;
    
    // Calculate percentage across the ruler
    let percentage = ((year - startYear) / totalYears) * 100;
    
    // Safety check to keep needle within 0-100%
    percentage = Math.max(0, Math.min(100, percentage));
    
    document.getElementById('year-indicator').style.left = percentage + "%";
}
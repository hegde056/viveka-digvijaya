// 1. Initialize the map
var map = L.map('map').setView([20.5937, 78.9629], 4); 

// 2. Add the Tile Layer
L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
    maxZoom: 19
}).addTo(map);

// 3. Define the Orange Icon
var saffronIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// 4. Load Data
fetch('data/locations.json')
    .then(response => response.json())
    .then(data => {
        
        var allMarkers = [];

        data.forEach(point => {
            allMarkers.push([point.lat, point.lng]);

            var marker = L.marker([point.lat, point.lng], {icon: saffronIcon}).addTo(map);
            
            // Initial "Loading" state for the popup
            marker.bindPopup(`
                <div style="font-family: Georgia, serif; min-width: 250px;">
                    <h3 style="margin: 0 0 5px; color: #d35400;">${point.title}</h3>
                    <em style="color: #555;">${point.date} | ${point.location}</em>
                    <hr style="border: 0; border-top: 1px solid #ccc; margin: 10px 0;">
                    <div id="content-${point.id}">Loading article...</div>
                </div>
            `);

            // EVENT: When the user clicks the marker, go fetch the text file
            marker.on('popupopen', function() {
                fetch(`data/articles/${point.filename}`)
                    .then(res => {
                        if (!res.ok) throw new Error("File not found");
                        return res.text();
                    })
                    .then(text => {
                        // Convert newlines in the text file to HTML line breaks (<br>)
                        // This preserves paragraphs from your text file.
                        var formattedText = text.replace(/\n/g, '<br>');
                        
                        // Inject the text into the popup
                        document.getElementById(`content-${point.id}`).innerHTML = formattedText;
                    })
                    .catch(err => {
                        document.getElementById(`content-${point.id}`).innerHTML = "<em style='color:red'>Article content not found.</em>";
                    });
            });
        });

        // Auto-Fit
        if (allMarkers.length > 0) {
            map.fitBounds(allMarkers, {padding: [50, 50]});
        }

    })
    .catch(error => {
        console.error('Error loading the map data:', error);
    });
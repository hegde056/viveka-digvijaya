# Viveka Digvijaya

An interactive historical atlas documenting Swami Vivekananda's travels across India and the world. Explore his journey through an interactive map with curated lectures, addresses, and historical photographs.

## Project Structure

```
viveka-digvijaya/
├── index.html              # Main application page
├── css/
│   └── style.css           # All styling (map, sidebar, timeline, header)
├── js/
│   ├── map.js              # Leaflet map initialization, marker rendering with offset handling
│   ├── ui.js               # URL routing, navigation, sidebar coordination
│   └── timeline.js         # Timeline ruler functionality
├── data/
│   ├── chapters.json       # Index of all chapter files
│   ├── chapters/           # Chapter data organized by travel era
│   │   ├── 01_parivrajaka_india_1888-1893.json
│   │   ├── 02_first_visit_west_1893-1897.json
│   │   ├── 03_return_to_india_1897-1899.json
│   │   ├── 04_second_visit_west_1899-1900.json
│   │   └── 05_final_years_india_1901-1902.json
│   ├── texts/
│   │   └── en/             # English text content (markdown files)
│   │       ├── chicago-parliament-welcome-response-1893.md
│   │       ├── colombo-first-address-1897.md
│   │       ├── pamban-address-1897.md
│   │       ├── rameshwaram-real-worship-1897.md
│   │       ├── ...
│   │       └── ...
│   └── images/             # Historical photographs (optional, can use external URLs)
├── assets/
│   └── icons/              # Project icons and assets
└── README.md               # This file
```

## Adding New Entries

### 1. Add Entry to Appropriate Chapter File

Identify which era/chapter your entry belongs to and add it to the corresponding file in `data/chapters/`:

```json
{
  "sl_num": 1,
  "id": "YYYY-MM-DD-location-slug",
  "date": "YYYY-MM-DD",
  "date_precision": "exact",    // or "approximate", "month-only"
  "year": YYYY,
  "slug": "location-slug",
  "location": {
    "point": { "lat": 0.0000, "lon": 0.0000 },
    "display_name": "City, Country",
    "historical_name": "Historical name if different",
    "region": { "macro": "Region", "subregion": "SubRegion" }
  },
  "content": {
    "available_langs": ["en"],
    "title_i18n": { "en": "Address Title" },
    "subtitle_i18n": { "en": "Subtitle" },
    "text_path": "data/texts/{lang}/filename.md",    // For lectures
    "image_path": "https://url-to-image.jpg",       // For photographs (optional)
    "caption_i18n": { "en": "Image caption" },      // For photographs (optional)
    "category": {
      "type": ["lecture"],  // or ["gallery"]
      "tags": ["tag1", "tag2"]
    }
  },
  "source": {
    "work": "Complete Works of Swami Vivekananda",
    "volume": 3,
    "page": 103,
    "quote_range": "pp. 103–115",
    "publisher": "Advaita Ashrama"
  },
  "journey": {
    "arrival_mode": "sea",    // sea, land, boat, train
    "prev_id": "previous-entry-id",
    "next_id": "next-entry-id"
  }
}
```

**Note:** For multiple lectures at the same location, offset coordinates slightly (0.0005-0.0008 degrees, ~50-90m) to prevent marker overlap while keeping them visually clustered.

### 2. Add Text Content (if Lecture)

Create a markdown file in `data/texts/en/` with the address or lecture text:

```markdown
# Address at [Location]

[First paragraph of the address...]

[Second paragraph...]

[Continue with the full text...]
```

### 3. Add Images (if Gallery Entry)

**Option A:** Use external URL (direct image link)
```json
"image_path": "https://upload.wikimedia.org/wikipedia/commons/path/to/image.jpg"
```

**Option B:** Store locally
- Place image in `data/images/filename.jpg`
- Reference as: `"image_path": "data/images/filename.jpg"`

## Features

- **Interactive World Map** - Satellite imagery with Leaflet.js mapping
- **URL-based Navigation** - Shareable links to individual lectures (e.g., `#colombo-first-address`)
- **Marker Highlighting** - Visual feedback with enlarged icons for selected lectures
- **Historical Timeline** - Visual ruler showing chronological journey (1863-1902)
- **Multilingual Support** - Ready for multiple language content (currently English)
- **Mixed Content Types** - Display both lecture texts and historical photographs
- **Responsive Sidebar** - Click markers to read full addresses or view images
- **Glass Morphism UI** - Modern, elegant design with semi-transparent overlays
- **Historically Accurate Data** - Coordinates and dates verified from primary sources

## Technologies Used

- **Leaflet.js** v1.9.4 - Interactive mapping
- **Esri World Imagery** - Satellite map tiles
- **CartoDB Labels** - Map label overlay
- **Google Fonts** - Typography (Bodoni Moda, Garamond)
- **HTML5/CSS3/JavaScript** - Vanilla stack (no frameworks)

## Data Schema

Each entry in the chapter files follows a stric: `YYYY-MM-DD-location-slug`)
- **date**: ISO format (YYYY-MM-DD)
- **date_precision**: Accuracy indicator ("exact", "approximate", "month-only")
- **year**: Integer year for filtering
- **slug**: URL-friendly identifier for navigation
- **location.point**: Latitude/longitude coordinates
- **content.text_path**: Path to markdown text (uses `{lang}` placeholder)
- **content.image_path**: URL or local path to photograph
- **source**: Bibliographic citation information
- **journey**: Linking between entries (prev_id, next_id, arrival_mode)

Chapter files are automatically loaded via `data/chapters.json` index.

## URL Navigation

Share specific lectures using hash-based URLs:
- Format: `https://yourdomain.com/#slug-name`
- Example: `https://yourdomain.com/#colombo-first-address`
- The UI automatically highlights the marker and opens the sidebar
- Closing the sidebar returns to home URL (no hash)
- **journey**: Linking between entries

Chapter files are automatically loaded via `data/chapters.json` index.

## Historical Accuracy Notes

### Coordinates
Coordinates are verified against:
- Google Maps / OpenStreetMap data
- Historical city records
- Biographical sources (Complete Works, Vivekananda biographies)


### Sources
All addresses sourced from **Complete Works of Swami Vivekananda** (Advaita Ashrama editions)

## Browser Support

- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+

Requires JavaScript enabled.

## GitHub Pages Deployment

This project is live on GitHub Pages: https://hegde056.github.io/viveka-digvijaya/


## License & Attribution

Historical photographs and text content are sourced from:
- Complete Works of Swami Vivekananda (Public Domain)
- Ramakrishna Math & Mission archives
- Wikimedia Commons

Attribution provided in individual entry source fields.

## Contributing

To add new entries or correct information:

1. Identify the appropriate chapter file based on travel era
2. Follow the JSON schema (sl_num, id, date, location, content, source, journey)
3. Increment `sl_num` sequentially within the chapter
4. Verify dates and coordinates from primary sources
5. Add full citations in the `source` field
6. Include `{lang}` placeholder in text paths for i18n compatibility
7. Update `data/chapters.json` if adding a new chapter file
8. Test marker display and content loading before committing

---

**Project Status:** Active development
**Last Updated:** February 2026

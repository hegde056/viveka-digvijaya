# Viveka Digvijaya

An interactive historical atlas documenting Swami Vivekananda's travels across India and the world. Explore his journey through an interactive map with curated lectures, addresses, and historical photographs.

## Project Structure

```
viveka-digvijaya/
├── index.html              # Main application page
├── css/
│   └── style.css           # All styling (map, sidebar, timeline, header)
├── js/
│   ├── map.js              # Map initialization, marker placement, content loading
│   └── timeline.js         # Timeline ruler functionality
├── data/
│   ├── entries.json        # Central data store for all locations & content
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

### 1. Add Entry to `data/entries.json`

```json
{
  "id": "YYYY-MM-DD-location-slug",
  "date": "YYYY-MM-DD",
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
    "arrival_mode": "sea",    // sea, land, boat
    "prev_id": "previous-entry-id",
    "next_id": "next-entry-id"
  }
}
```

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
- **Historical Timeline** - Visual ruler showing chronological journey
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

## Data Schema (entries.json)

Each entry follows a strict schema for consistency:

- **id**: Unique identifier (date + slug format)
- **date**: ISO format (YYYY-MM-DD)
- **year**: Integer year for filtering
- **location.point**: Latitude/longitude coordinates
- **content.text_path**: Path to markdown text (uses `{lang}` placeholder)
- **content.image_path**: URL or local path to photograph
- **source**: Bibliographic citation information
- **journey**: Linking between entries

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

1. Follow the JSON schema in `entries.json`
2. Verify dates and coordinates from primary sources
3. Add full citations in the `source` field
4. Include `{lang}` placeholder in text paths for i18n compatibility
5. Test marker display and content loading before committing

---

**Project Status:** Active development
**Last Updated:** February 2026

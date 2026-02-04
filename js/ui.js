// js/ui.js
// Handles URL routing, navigation, and UI coordination

class VivekaUI {
    constructor() {
        this.allEntries = [];
        this.currentLang = 'en';
        this.initialized = false;
    }

    /**
     * Initialize the UI system with loaded chapter data
     * @param {Array} chapters - Array of chapter objects
     */
    init(chapters) {
        // Flatten all entries from all chapters
        chapters.forEach(chapter => {
            if (chapter.entries) {
                chapter.entries.forEach(entry => {
                    entry.chapterColor = chapter.color; // Preserve chapter color
                    this.allEntries.push(entry);
                });
            }
        });

        this.initialized = true;
        this.setupURLRouting();
        this.checkInitialURL();
    }

    /**
     * Setup URL hash change listener
     */
    setupURLRouting() {
        window.addEventListener('hashchange', () => {
            this.handleURLChange();
        });
    }

    /**
     * Check if there's a slug in the URL on page load
     */
    checkInitialURL() {
        const hash = window.location.hash.substring(1); // Remove #
        if (hash) {
            this.navigateToSlug(hash);
        }
    }

    /**
     * Handle URL hash changes
     */
    handleURLChange() {
        const slug = window.location.hash.substring(1);
        if (slug) {
            this.navigateToSlug(slug);
        }
    }

    /**
     * Navigate to a lecture by slug
     * @param {string} slug - The lecture slug
     */
    navigateToSlug(slug) {
        const entry = this.findEntryBySlug(slug);
        if (entry) {
            this.displayEntry(entry);
        } else {
            console.warn(`No entry found for slug: ${slug}`);
        }
    }

    /**
     * Find an entry by its slug
     * @param {string} slug - The lecture slug
     * @returns {Object|null} The entry object or null
     */
    findEntryBySlug(slug) {
        return this.allEntries.find(entry => entry.slug === slug);
    }

    /**
     * Display an entry in the sidebar and map
     * @param {Object} entry - The entry object
     */
    displayEntry(entry) {
        if (!entry) return;

        // Highlight the marker on the map
        this.highlightMarker(entry.slug);

        // Open sidebar if not already open
        if (!document.body.classList.contains('sidebar-open')) {
            document.body.classList.add('sidebar-open');
            document.getElementById('sidebar').classList.add('active');
            setTimeout(() => {
                if (window.map) {
                    window.map.invalidateSize();
                    window.map.panTo([entry.location.point.lat, entry.location.point.lon], { 
                        animate: true,
                        duration: 0.5 
                    });
                }
            }, 360);
        } else {
            // Already open, just pan
            if (window.map) {
                window.map.panTo([entry.location.point.lat, entry.location.point.lon], { 
                    animate: true,
                    duration: 0.5 
                });
            }
        }

        // Update timeline ruler
        if (typeof updateRuler === 'function') {
            updateRuler(entry.date);
        }

        // Update sidebar content
        this.updateSidebarContent(entry);
    }

    /**
     * Highlight a marker on the map by slug
     * @param {string} slug - The lecture slug
     */
    highlightMarker(slug) {
        // Reset previous highlighted marker
        if (window.currentHighlightedMarker && window.allMarkers[window.currentHighlightedMarker]) {
            const prev = window.allMarkers[window.currentHighlightedMarker];
            prev.marker.setIcon(prev.normalIcon);
            prev.marker.setZIndexOffset(0);
        }

        // Highlight new marker
        if (window.allMarkers[slug]) {
            const current = window.allMarkers[slug];
            current.marker.setIcon(current.highlightIcon);
            current.marker.setZIndexOffset(1000); // Bring to front
            window.currentHighlightedMarker = slug;
        }
    }

    /**
     * Update sidebar with entry content
     * @param {Object} entry - The entry object
     */
    updateSidebarContent(entry) {
        const title = entry.content.title_i18n[this.currentLang] || entry.content.title_i18n['en'];
        const subtitle = entry.content.subtitle_i18n[this.currentLang] || entry.content.subtitle_i18n['en'];
        
        document.getElementById('sidebar-title').innerText = title;
        document.getElementById('sidebar-subtitle').innerText = subtitle;
        
        // Format date
        const [year, month, day] = entry.date.split('-');
        const formattedDate = `${day}-${month}-${year}`;
        document.getElementById('sidebar-date').innerText = formattedDate + " | " + entry.location.display_name;
        
        // Load content
        if (entry.content.image_path) {
            this.displayImageContent(entry);
        } else if (entry.content.text_path) {
            this.displayTextContent(entry);
        } else {
            document.getElementById('sidebar-body').innerHTML = "<em>No content available</em>";
        }
        
        document.getElementById('sidebar').scrollTop = 0;
    }

    /**
     * Display image content in sidebar
     * @param {Object} entry - The entry object
     */
    displayImageContent(entry) {
        const imageCaption = entry.content.caption_i18n[this.currentLang] || entry.content.caption_i18n['en'];
        let galleryHTML = `<img src="${entry.content.image_path}" style="width: 60%; max-width: 300px; height: auto; border-radius: 6px; margin-bottom: 20px;">`;
        
        if (imageCaption) {
            galleryHTML += `<p style="font-size: 0.9em; color: #666; font-style: italic; margin-top: 10px;">${imageCaption}</p>`;
        }
        
        if (entry.source) {
            galleryHTML += this.formatSourceInfo(entry.source);
        }
        
        document.getElementById('sidebar-body').innerHTML = galleryHTML;
    }

    /**
     * Display text content in sidebar
     * @param {Object} entry - The entry object
     */
    displayTextContent(entry) {
        document.getElementById('sidebar-body').innerHTML = "<em>Loading article...</em>";
        const finalPath = entry.content.text_path.replace('{lang}', this.currentLang);
        
        fetch(finalPath)
            .then(res => res.text())
            .then(text => {
                let content = text.replace(/\n/g, '<br><br>');
                if (entry.source) {
                    content += this.formatSourceInfo(entry.source);
                }
                document.getElementById('sidebar-body').innerHTML = content;
            })
            .catch(err => {
                document.getElementById('sidebar-body').innerHTML = "<em>Error loading content</em>";
                console.error('Error loading text:', err);
            });
    }

    /**
     * Format source information HTML
     * @param {Object} source - The source object
     * @returns {string} HTML string
     */
    formatSourceInfo(source) {
        return `<hr style="margin-top:40px; border:0; border-top:1px solid #ddd;">
                <div style="font-size: 0.85em; color: #666; font-style: italic;">
                Source: ${source.work}${source.volume ? ', Vol ' + source.volume : ''}${source.page ? ', p. ' + source.page : ''}${source.quote_range ? ', ' + source.quote_range : ''}${source.accession_id ? '<br>Accession: ' + source.accession_id : ''}
                </div>`;
    }

    /**
     * Set the URL hash to a slug (for programmatic navigation)
     * @param {string} slug - The lecture slug
     */
    setSlug(slug) {
        window.location.hash = slug;
    }

    /**
     * Get current slug from URL
     * @returns {string|null} Current slug or null
     */
    getCurrentSlug() {
        const hash = window.location.hash.substring(1);
        return hash || null;
    }

    /**
     * Generate shareable link for an entry
     * @param {string} slug - The lecture slug
     * @returns {string} Full URL with hash
     */
    getShareableLink(slug) {
        return window.location.origin + window.location.pathname + '#' + slug;
    }
}

// Create global instance
window.vivekaUI = new VivekaUI();

// js/timeline.js
const SWAMIJI_BIRTH_YEAR = 1863;
const SWAMIJI_MAHASAMADHI_YEAR = 1902;

/**
 * Moves the timeline indicator based on the event date.
 * @param {string} dateString - Expected format "YYYY-MM-DD"
 */
function updateRuler(dateString) {
    if (!dateString) return;

    const year = parseInt(dateString.split('-')[0]);
    const totalYears = SWAMIJI_MAHASAMADHI_YEAR - SWAMIJI_BIRTH_YEAR;
    
    // Calculate percentage
    let percentage = ((year - SWAMIJI_BIRTH_YEAR) / totalYears) * 100;
    percentage = Math.max(0, Math.min(100, percentage));
    
    const indicator = document.getElementById('year-indicator');
    if (indicator) {
        indicator.style.left = percentage + "%";
        // Add a 'pulse' effect when it moves
        indicator.style.boxShadow = "0 0 15px #FF9933, 0 0 5px #fff";
    }
}
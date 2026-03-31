/**
 * NexusHub — Community Page Logic
 * Handles tab switching, community joining, and dynamic content filtering.
 */

// ==========================================
// 1. DATA & CONFIG
// ==========================================
const CHANNEL_DESCRIPTIONS = {
    'general': 'The main hub for all things Pro Gamers. Say hello, share updates, ask anything, or just vibe with the community.',
    'introductions': 'New here? Introduce yourself! Tell us your stack, experience level, and what you\'re working on.',
    'off-topic': 'Non-dev chat lives here. Memes, life updates, random thoughts — keep it friendly.',
    'frontend': 'Everything UI — HTML, CSS, MOBA, FPS, Vue, Angular, and more.',
    'Strategy': 'APIs, databases, server architecture, microservices, and all things server-side.',
    'Streaming': 'CI/CD, containers, cloud infrastructure, monitoring, and deployment discussions.',
    'code-review': 'Post your code for review. Be specific about what feedback you need.',
    'open-source': 'Share open-source projects, contributions, and opportunities.',
    'job-board': 'Post job openings, freelance gigs, and career opportunities for the community.',
    'portfolio-review': 'Share your portfolio for honest, constructive feedback from peers.',
    'interview-prep': 'LeetCode, system design, behavioral tips — help each other get hired.'
};

// ==========================================
// 2. NAVIGATION & TABS
// ==========================================

/**
 * Switches between Overview, Channels, Members, and Rules
 */
window.switchTab = function(tabName, btn) {
    // UI: Update Buttons
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    // UI: Update Content Panels
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    const targetTab = document.getElementById('tab-' + tabName);
    if (targetTab) {
        targetTab.classList.add('active');
    }

    console.log(`Switched community tab to: ${tabName}`);
};

// ==========================================
// 3. JOIN / LEAVE LOGIC
// ==========================================

/**
 * Toggles the membership status for the community
 */
window.toggleMainJoin = function() {
    const btn = document.getElementById('joinMainBtn');
    if (!btn) return;

    const isJoined = btn.textContent.includes('Joined');

    if (isJoined) {
        // Leave Logic
        btn.textContent = '+ Join Community';
        btn.classList.remove('btn-joined-main');
        btn.style.background = 'rgba(91, 110, 245, 0.12)';
        btn.style.borderColor = 'rgba(91, 110, 245, 0.3)';
        btn.style.color = 'var(--accent)';
        
        // Optional: Trigger a "toast" notification from the global utility
        if (window.toast) window.toast("Left Pro Gamers");
    } else {
        // Join Logic
        btn.textContent = '✓ Joined';
        btn.classList.add('btn-joined-main');
        btn.style.background = '';
        btn.style.borderColor = '';
        btn.style.color = '';
        
        if (window.toast) window.toast("Joined Pro Gamers! ⚡");
    }
};

// ==========================================
// 4. CHANNEL INTERACTION
// ==========================================

/**
 * Updates the side-panel info when a channel is clicked
 */
window.setActiveChannel = function(el, channelName) {
    // UI: Active Row State
    document.querySelectorAll('.ch-row').forEach(r => r.classList.remove('active-ch'));
    el.classList.add('active-ch');

    // Logic: Update Info Display
    const cleanName = channelName.replace('#', '');
    const titleEl = document.getElementById('activeCh');
    const descEl = document.getElementById('activeChDesc');

    if (titleEl) titleEl.textContent = cleanName;
    if (descEl) {
        descEl.textContent = CHANNEL_DESCRIPTIONS[cleanName] || 'No description available for this channel.';
    }

    // Scroll the info card to top
    const sidebar = document.querySelector('.ch-sidebar');
    if (sidebar) sidebar.scrollTop = 0;
};

// ==========================================
// 5. MEMBER FILTERING
// ==========================================

/**
 * Searches through the member grid
 */
window.filterMembers = function(query) {
    const q = query.toLowerCase().trim();
    const cards = document.querySelectorAll('.member-card');
    
    cards.forEach(card => {
        const name = card.querySelector('.m-name').textContent.toLowerCase();
        // Check if name contains search query
        const isMatch = !q || name.includes(q);
        card.style.display = isMatch ? '' : 'none';
    });

    // Optional: Toggle visibility of group titles if all members in group are hidden
    document.querySelectorAll('.member-group-title').forEach(title => {
        const groupGrid = title.nextElementSibling;
        if (groupGrid && groupGrid.classList.contains('member-grid')) {
            const hasVisibleMembers = Array.from(groupGrid.children).some(c => c.style.display !== 'none');
            title.style.display = hasVisibleMembers ? '' : 'none';
        }
    });
};

// ==========================================
// 6. INITIALIZATION
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    console.log("Community Page Module Initialized.");

    // Handle Report Button action
    const reportBtn = document.querySelector('.u-extracted-225');
    if (reportBtn) {
        reportBtn.addEventListener('click', () => {
            if (window.toast) window.toast("Opening reporting tool...");
        });
    }
});
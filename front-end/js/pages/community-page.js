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
    
    // Navigate to chat interface with the selected channel
    window.openChatInterface(channelName);
};

/**
 * Opens the chat interface with the selected channel
 */
window.openChatInterface = function(channelName) {
    // Store the selected channel in sessionStorage for the chat page to use
    sessionStorage.setItem('selectedChannel', channelName);
    sessionStorage.setItem('fromCommunityPage', 'true');
    
    // Navigate to chat page
    window.location.href = 'chat.html';
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
// 6. REPORT FUNCTIONALITY
// ==========================================

/**
 * Shows the report message dialog
 */
window.showReportDialog = function() {
    // Create and show report modal
    const modal = document.createElement('div');
    modal.className = 'report-modal';
    modal.innerHTML = `
        <div class="report-modal-content">
            <div class="report-header">
                <h3>🚩 Report Message</h3>
                <button class="close-btn" onclick="closeReportModal()">×</button>
            </div>
            <div class="report-body">
                <div class="report-options">
                    <label class="report-option">
                        <input type="radio" name="reason" value="spam">
                        <span>📢 Spam or Self-Promotion</span>
                    </label>
                    <label class="report-option">
                        <input type="radio" name="reason" value="harassment">
                        <span>😠 Harassment or Hate Speech</span>
                    </label>
                    <label class="report-option">
                        <input type="radio" name="reason" value="inappropriate">
                        <span>🔞 Inappropriate Content</span>
                    </label>
                    <label class="report-option">
                        <input type="radio" name="reason" value="off-topic">
                        <span>💬 Off-Topic</span>
                    </label>
                    <label class="report-option">
                        <input type="radio" name="reason" value="other">
                        <span>⚠️ Other</span>
                    </label>
                </div>
                <div class="report-description">
                    <label for="report-desc">Additional Details (Optional)</label>
                    <textarea id="report-desc" placeholder="Please provide any additional context..."></textarea>
                </div>
            </div>
            <div class="report-actions">
                <button class="btn-cancel" onclick="closeReportModal()">Cancel</button>
                <button class="btn-submit" onclick="submitReport()">Submit Report</button>
            </div>
        </div>
    `;
    
    // Add modal to page
    document.body.appendChild(modal);
    
    // Add CSS for modal
    if (!document.getElementById('report-modal-styles')) {
        const style = document.createElement('style');
        style.id = 'report-modal-styles';
        style.textContent = `
            .report-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 1000;
            }
            .report-modal-content {
                background: var(--bg-primary);
                border: 1px solid var(--border);
                border-radius: 12px;
                padding: 24px;
                max-width: 500px;
                width: 90%;
                max-height: 80vh;
                overflow-y: auto;
            }
            .report-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
            }
            .report-header h3 {
                margin: 0;
                color: var(--text-primary);
            }
            .close-btn {
                background: none;
                border: none;
                font-size: 24px;
                cursor: pointer;
                color: var(--text-secondary);
            }
            .report-option {
                display: flex;
                align-items: center;
                gap: 8px;
                padding: 12px;
                border: 1px solid var(--border);
                border-radius: 8px;
                margin-bottom: 8px;
                cursor: pointer;
                transition: background 0.2s;
            }
            .report-option:hover {
                background: var(--bg-secondary);
            }
            .report-option input[type="radio"] {
                margin: 0;
            }
            .report-description {
                margin-top: 20px;
            }
            .report-description label {
                display: block;
                margin-bottom: 8px;
                color: var(--text-primary);
            }
            .report-description textarea {
                width: 100%;
                min-height: 100px;
                padding: 12px;
                border: 1px solid var(--border);
                border-radius: 8px;
                resize: vertical;
                background: var(--bg-secondary);
                color: var(--text-primary);
            }
            .report-actions {
                display: flex;
                gap: 12px;
                justify-content: flex-end;
                margin-top: 20px;
            }
            .btn-cancel, .btn-submit {
                padding: 10px 20px;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                font-weight: 500;
            }
            .btn-cancel {
                background: var(--bg-secondary);
                color: var(--text-primary);
                border: 1px solid var(--border);
            }
            .btn-submit {
                background: var(--accent);
                color: white;
            }
            .btn-submit:hover {
                background: var(--accent-hover);
            }
        `;
        document.head.appendChild(style);
    }
};

/**
 * Closes the report modal
 */
window.closeReportModal = function() {
    const modal = document.querySelector('.report-modal');
    if (modal) {
        modal.remove();
    }
};

/**
 * Submits the report
 */
window.submitReport = function() {
    const selectedReason = document.querySelector('input[name="reason"]:checked');
    const description = document.getElementById('report-desc').value;
    
    if (!selectedReason) {
        if (window.toast) window.toast("Please select a reason for reporting");
        return;
    }
    
    // Here you would normally send the report to your backend
    console.log('Report submitted:', {
        reason: selectedReason.value,
        description: description,
        timestamp: new Date().toISOString()
    });
    
    // Close modal and show confirmation
    closeReportModal();
    if (window.toast) window.toast("🚩 Report submitted successfully. Thank you for helping keep our community safe.");
};

// ==========================================
// 7. INITIALIZATION
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
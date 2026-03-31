/**
 * NexusHub — Profile & Settings Logic
 * Handles view switching, theme selection, and real-time profile synchronization.
 */

// ==========================================
// 1. STATE & CONFIG
// ==========================================
let hasUnsavedChanges = false;
let toastDebounce;

// ==========================================
// 2. VIEW MANAGEMENT
// ==========================================

/**
 * Switches between settings categories (Profile, Account, etc.)
 */
window.switchView = function(viewId, navEl) {
    // UI: Update active view visibility
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    const targetView = document.getElementById('view-' + viewId);
    if (targetView) targetView.classList.add('active');

    // UI: Update sidebar item active state
    document.querySelectorAll('.ln-item').forEach(i => i.classList.remove('active'));
    if (navEl) navEl.classList.add('active');

    console.log(`Settings view switched to: ${viewId}`);
};

// ==========================================
// 3. PROFILE & PREVIEW SYNC
// ==========================================

/**
 * Updates the left sidebar preview in real-time as the user types
 */
function setupProfileSync() {
    const nameInput = document.querySelector('input[value="Alex Morgan"]');
    const handleInput = document.querySelector('input[value="alexmorgan"]');
    
    const sidebarName = document.querySelector('.profile-name');
    const sidebarHandle = document.querySelector('.profile-handle');

    if (nameInput && sidebarName) {
        nameInput.addEventListener('input', (e) => {
            sidebarName.textContent = e.target.value || "New User";
            markAsDirty();
        });
    }

    if (handleInput && sidebarHandle) {
        handleInput.addEventListener('input', (e) => {
            const val = e.target.value.replace(/[^a-zA-Z0-9_]/g, '');
            sidebarHandle.textContent = val ? `@${val}` : "@username";
            markAsDirty();
        });
    }

    // Monitor all inputs for the "Save Changes" highlight
    document.querySelectorAll('.main input, .main textarea, .main select').forEach(input => {
        input.addEventListener('change', markAsDirty);
    });
}

function markAsDirty() {
    hasUnsavedChanges = true;
    const saveBtn = document.querySelector('.tb-btn.save');
    if (saveBtn) saveBtn.classList.add('pulse');
}

window.setStatus = function(el) {
    document.querySelectorAll('.status-badge').forEach(b => b.classList.remove('on'));
    el.classList.add('on');
    
    // Update sidebar status text
    const statusText = el.textContent.trim();
    const sidebarStatus = document.querySelector('.profile-status');
    if (sidebarStatus) sidebarStatus.textContent = statusText;
    
    window.toast(`Status updated to ${statusText}`);
    markAsDirty();
};

// ==========================================
// 4. THEME & APPEARANCE
// ==========================================

window.setTheme = function(el) {
    document.querySelectorAll('.theme-opt').forEach(t => t.classList.remove('on'));
    el.classList.add('on');
    
    const themeName = el.querySelector('.theme-label').textContent;
    window.toast(`Theme preview: ${themeName}`);
    
    // In a real app, you would toggle a class on the <body> or <html>
    // document.body.setAttribute('data-theme', themeName.toLowerCase().replace(' ', '-'));
    markAsDirty();
};

// ==========================================
// 5. AUTHENTICATION
// ==========================================

/**
 * Handles user logout functionality
 * Clears session data and redirects to login page
 */
window.logout = function() {
    // Clear any stored session data
    localStorage.removeItem('userToken');
    localStorage.removeItem('userData');
    sessionStorage.clear();
    
    // Show confirmation toast
    window.toast("Logging out... 👋");
    
    // Redirect to login page after a short delay
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 1000);
};

// ==========================================
// 6. UTILITIES & TOASTS
// ==========================================

window.toast = function(msg) {
    const t = document.getElementById('toast');
    const m = document.getElementById('toastMsg');
    if (!t || !m) return;

    m.textContent = msg;
    t.classList.add('show');
    
    clearTimeout(toastDebounce);
    toastDebounce = setTimeout(() => t.classList.remove('show'), 2500);
};

/**
 * Handles the "Save Changes" button click
 */
window.saveAllChanges = function() {
    if (!hasUnsavedChanges) {
        window.toast("No changes to save.");
        return;
    }

    // Validation Check
    if (window.NexusValidator) {
        const nameInput = document.querySelector('input[value="Alex Morgan"]') || document.querySelector('.main input[type="text"]');
        const handleInput = document.querySelector('input[value="alexmorgan"]') || document.querySelectorAll('.main input[type="text"]')[1];
        const emailInput = document.querySelector('input[type="email"]');
        
        let valid = true;
        const rules = [];
        
        if (nameInput) rules.push({ element: nameInput, validators: [{ check: v => window.NexusValidator.isRequired(v), message: 'Display name is required' }, { check: v => window.NexusValidator.minLength(v, 2), message: 'Minimum 2 characters' }]});
        if (handleInput) rules.push({ element: handleInput, validators: [{ check: v => window.NexusValidator.isHandle(v), message: '3-20 characters, alphanumeric only' }]});
        if (emailInput) rules.push({ element: emailInput, validators: [{ check: v => window.NexusValidator.isEmail(v), message: 'Please enter a valid email address' }]});
        
        if (rules.length > 0) {
            valid = window.NexusValidator.validateForm(rules);
        }
        
        if (!valid) {
            window.toast("⚠️ Please fix the validation errors.");
            return;
        }
    }

    // Simulate API call
    const saveBtn = document.querySelector('.tb-btn.save');
    if(saveBtn) {
        saveBtn.textContent = "Saving...";
        saveBtn.disabled = true;
    }

    setTimeout(() => {
        hasUnsavedChanges = false;
        if(saveBtn) {
            saveBtn.textContent = "Save Changes";
            saveBtn.disabled = false;
            saveBtn.classList.remove('pulse');
        }
        window.toast("✅ All changes saved successfully!");
    }, 1200);
};

// ==========================================
// 6. INITIALIZATION
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    setupProfileSync();

    // Map the Top Bar "Save" button to our logic
    const topSaveBtn = document.querySelector('.tb-btn.save');
    if (topSaveBtn) {
        topSaveBtn.onclick = window.saveAllChanges;
    }

    console.log("Settings module initialized. Session: Alex Morgan.");
});
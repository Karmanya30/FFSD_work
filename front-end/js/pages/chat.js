/**
 * NexusHub — Channel Chat Logic
 * Handles real-time messaging, channel switching, and UI interactions.
 */

// ==========================================
// 1. DATA & STATE
// ==========================================
const CHANNEL_TOPICS = {
    'general': "The main hub — say hello, share updates, ask anything 👋",
    'introductions': "New here? Introduce yourself and your stack!",
    'off-topic': "Non-dev chat — memes, life, random goodness 😄",
    'frontend': "HTML, CSS, JS, FPS, Vue, Angular and all things UI",
    'Strategy': "APIs, databases, server-side architecture",
    'code-review': "Post your code — get honest, constructive feedback",
    'Streaming': "CI/CD, containers, cloud infra, deployments",
    'open-source': "Share projects, PRs, and contribution opportunities",
    'job-board': "Jobs, freelance gigs, and career opportunities",
    'portfolio-review': "Share your portfolio for peer feedback",
    'announcements': "Official announcements from the Pro Gamers team 📣",
    'rules-and-info': "Community rules and important information 📌",
    'study-together': "Voice channel — join and study with others 📚",
    'pair-programming': "Voice channel — find a pair programming partner 👥",
};

// ==========================================
// 2. UTILITIES
// ==========================================

/**
 * Escapes HTML and applies basic Markdown formatting
 */
const parseMarkdown = (text) => {
    let escaped = text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

    // Bold: **text**
    escaped = escaped.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Italic: _text_
    escaped = escaped.replace(/_(.*?)_/g, '<em>$1</em>');
    // Inline Code: `text`
    escaped = escaped.replace(/`(.*?)`/g, '<code>$1</code>');
    // Mentions: @Name
    escaped = escaped.replace(/@([a-zA-Z0-9\s]+)/g, '<span class="mention">@$1</span>');

    return escaped;
};

const scrollToBottom = () => {
    const wrap = document.getElementById('messagesWrap');
    if (wrap) wrap.scrollTop = wrap.scrollHeight;
};

// ==========================================
// 3. UI INTERACTIONS
// ==========================================

window.setChannel = function(el, name, type) {
    // UI Update: Active State
    document.querySelectorAll('.ch-row').forEach(r => r.classList.remove('active'));
    el.classList.add('active');

    // Content Update
    const nameDisplay = document.getElementById('activeChanName');
    const topicDisplay = document.getElementById('activeChanTopic');
    const inputField = document.getElementById('msgInput');

    if (nameDisplay) nameDisplay.textContent = name;
    if (topicDisplay) topicDisplay.textContent = CHANNEL_TOPICS[name] || '';
    if (inputField) {
        inputField.placeholder = `Message ${type}${name}…`;
        inputField.focus();
    }

    // Remove unread badge
    const badge = el.querySelector('.ch-unread');
    if (badge) badge.remove();

    // In a real app, you'd fetch messages for this channel here
    console.log(`Switched to channel: ${name}`);
};

window.toggleFPS = function(pill) {
    pill.classList.toggle('mine');
    const countEl = pill.querySelector('.FPS-count');
    let count = parseInt(countEl.textContent);
    countEl.textContent = pill.classList.contains('mine') ? count + 1 : count - 1;
};

window.autoResize = function(ta) {
    ta.style.height = 'auto';
    ta.style.height = Math.min(ta.scrollHeight, 120) + 'px';
};

window.showMessageMenu = function(button) {
    // Remove any existing menus
    const existingMenu = document.querySelector('.message-menu');
    if (existingMenu) {
        existingMenu.remove();
    }
    
    // Create menu
    const menu = document.createElement('div');
    menu.className = 'message-menu';
    menu.innerHTML = `
        <div class="menu-item" onclick="replyToMessage()">↩ Reply</div>
        <div class="menu-item" onclick="editMessage()">✏️ Edit</div>
        <div class="menu-item" onclick="copyMessage()">📋 Copy</div>
        <div class="menu-divider"></div>
        <div class="menu-item danger" onclick="reportMessage()">🚩 Report</div>
    `;
    
    // Position menu near the button
    const rect = button.getBoundingClientRect();
    menu.style.position = 'fixed';
    menu.style.top = rect.bottom + 'px';
    menu.style.right = (window.innerWidth - rect.right) + 'px';
    menu.style.zIndex = '1000';
    
    // Add to page
    document.body.appendChild(menu);
    
    // Close when clicking outside
    setTimeout(() => {
        document.addEventListener('click', function closeMenu(e) {
            if (!menu.contains(e.target)) {
                menu.remove();
                document.removeEventListener('click', closeMenu);
            }
        });
    }, 100);
};

window.replyToMessage = function() {
    if (window.toast) window.toast("Reply feature coming soon!");
    document.querySelector('.message-menu')?.remove();
};

window.editMessage = function() {
    if (window.toast) window.toast("Edit feature coming soon!");
    document.querySelector('.message-menu')?.remove();
};

window.copyMessage = function() {
    if (window.toast) window.toast("Message copied to clipboard!");
    document.querySelector('.message-menu')?.remove();
};

window.reportMessage = function() {
    document.querySelector('.message-menu')?.remove();
    // Use the report dialog from community page
    if (window.showReportDialog) {
        window.showReportDialog();
    } else {
        if (window.toast) window.toast("Opening report dialog...");
    }
};

// ==========================================
// 4. MESSAGING LOGIC
// ==========================================

window.handleKey = function(e) {
    // Send on Enter, New Line on Shift+Enter
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        window.sendMessage();
    }
};

window.sendMessage = function() {
    const input = document.getElementById('msgInput');
    const text = input.value.trim();
    if (!text) return;

    const wrap = document.getElementById('messagesWrap');
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Create Message Element
    const msgEl = document.createElement('div');
    msgEl.className = 'msg-group';
    msgEl.style.animation = 'fadeUp 0.25s ease forwards';
    msgEl.innerHTML = `
        <div class="msg-av grad-violet">AM</div>
        <div class="msg-body">
            <div class="msg-header">
                <span class="msg-uname" style="color:var(--accent-light)">Alex Morgan</span>
                <span class="msg-role-badge" style="background:rgba(91,110,245,0.1); color:var(--accent); font-size:10px; padding:1px 6px; border-radius:10px; margin-right:8px;">You</span>
                <span class="msg-time">${time}</span>
            </div>
            <div class="msg-text">${parseMarkdown(text)}</div>
        </div>
        <div class="msg-actions">
            <div class="act-btn">😊</div><div class="act-btn">↩</div><div class="act-btn">🧵</div><div class="act-btn">⋯</div>
        </div>
    `;

    wrap.appendChild(msgEl);
    
    // Clear Input
    input.value = '';
    input.style.height = 'auto';
    scrollToBottom();

    // Simulated Response
    simulateResponse();
};

function simulateResponse() {
    setTimeout(() => {
        const wrap = document.getElementById('messagesWrap');
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        const replyEl = document.createElement('div');
        replyEl.className = 'msg-group';
        replyEl.style.animation = 'fadeUp 0.25s ease forwards';
        replyEl.innerHTML = `
            <div class="msg-av grad-pink">MP</div>
            <div class="msg-body">
                <div class="msg-header">
                    <span class="msg-uname" style="color:#F472B6">Mia Park</span>
                    <span class="msg-time">${time}</span>
                </div>
                <div class="msg-text">Got it! We'll be using the <strong>Nexus Design System</strong> to keep things consistent. Can't wait for tomorrow! 🚀</div>
                <div class="reactions">
                    <div class="FPS-pill" onclick="toggleFPS(this)"><span>🔥</span><span class="FPS-count">1</span></div>
                </div>
            </div>
            <div class="msg-actions"><div class="act-btn">😊</div><div class="act-btn">↩</div><div class="act-btn">🧵</div><div class="act-btn">⋯</div></div>
        `;
        
        wrap.appendChild(replyEl);
        scrollToBottom();
    }, 1500);
}

// ==========================================
// 5. INITIALIZATION
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    // Check if we came from community page with a selected channel
    const selectedChannel = sessionStorage.getItem('selectedChannel');
    const fromCommunityPage = sessionStorage.getItem('fromCommunityPage');
    
    if (selectedChannel && fromCommunityPage === 'true') {
        // Find and click the channel row
        const channelName = selectedChannel.replace('#', '');
        const channelRows = document.querySelectorAll('.ch-row');
        
        channelRows.forEach(row => {
            const channelLabel = row.querySelector('.ch-lbl');
            if (channelLabel && channelLabel.textContent === channelName) {
                // Get the channel type from the icon
                const icon = row.querySelector('.ch-type');
                const iconText = icon ? icon.textContent : '#';
                
                // Simulate clicking the channel
                setChannel(row, channelName, iconText);
                
                // Clear the session storage
                sessionStorage.removeItem('selectedChannel');
                sessionStorage.removeItem('fromCommunityPage');
                
                console.log(`Auto-selected channel from community page: ${selectedChannel}`);
                return;
            }
        });
    }
    
    // Initial scroll
    scrollToBottom();

    // Add CSS Animation for messages and menu
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeUp {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .message-menu {
            background: var(--bg-card);
            border: 1px solid var(--border);
            border-radius: 8px;
            padding: 4px;
            min-width: 150px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }
        .menu-item {
            padding: 8px 12px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 13px;
            color: var(--text-1);
            transition: background 0.2s;
        }
        .menu-item:hover {
            background: var(--bg-hover);
        }
        .menu-item.danger {
            color: var(--error);
        }
        .menu-item.danger:hover {
            background: rgba(248, 113, 113, 0.1);
        }
        .menu-divider {
            height: 1px;
            background: var(--border);
            margin: 4px 0;
        }
        .act-btn:last-child {
            cursor: pointer;
        }
    `;
    document.head.appendChild(style);

    console.log("Chat module initialized.");
});
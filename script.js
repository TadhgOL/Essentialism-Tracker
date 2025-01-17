document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.tab-btn').forEach(button => {
        button.addEventListener('click', () => {
            const tabName = button.dataset.tab;
            
            // Update button states
            document.querySelectorAll('.tab-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            button.classList.add('active');
            
            // Update tab content visibility
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            document.getElementById(`${tabName}View`).classList.add('active');
            
            // Load history entries if switching to history tab
            if (tabName === 'history') {
                loadHistoryEntries(0, 21);
            }
        });
    });
});

function showHistoryEntry(entry) {
    const historyView = document.getElementById('historyView');
    const originalContent = historyView.innerHTML;

    const backButton = document.createElement('button');
    backButton.className = 'back-button';
    backButton.textContent = '← Back to History';
    backButton.onclick = () => {
        historyView.innerHTML = originalContent;
        loadHistoryEntries();
    };

    const todayView = document.getElementById('todayView').cloneNode(true);
    todayView.id = 'historyEntry';
    
    todayView.querySelector('#currentDate').textContent = new Date(entry.date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    todayView.querySelector('#whatThoughts').value = entry.what;
    todayView.querySelector('#soWhatThoughts').value = entry.soWhat;
    todayView.querySelector('#topPriorityTasks').value = entry.topPriority;
    todayView.querySelector('#urgentTasks').value = entry.urgent;
    todayView.querySelector('#maintenanceTasks').value = entry.maintenance;

    todayView.querySelectorAll('textarea').forEach(textarea => {
        textarea.readOnly = true;
    });

    historyView.innerHTML = '';
    historyView.appendChild(backButton);
    historyView.appendChild(todayView);
    
    historyView.classList.add('active');
    todayView.style.display = 'block';
}

function updateCurrentDate() {
    const dateElement = document.getElementById('currentDate');
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };
    dateElement.textContent = new Date().toLocaleDateString('en-US', options);
}

function saveJournal() {
    const entry = {
        date: new Date().toISOString(),
        what: document.getElementById('whatThoughts').value,
        soWhat: document.getElementById('soWhatThoughts').value,
        topPriority: document.getElementById('topPriorityTasks').value,
        urgent: document.getElementById('urgentTasks').value,
        maintenance: document.getElementById('maintenanceTasks').value
    };

    // Get existing entries from localStorage
    let entries = JSON.parse(localStorage.getItem('journalEntries') || '[]');
    
    // Add new entry
    entries.unshift(entry);
    
    // Save to localStorage
    localStorage.setItem('journalEntries', JSON.stringify(entries));
    
    // Clear the form
    document.getElementById('whatThoughts').value = '';
    document.getElementById('soWhatThoughts').value = '';
    document.getElementById('topPriorityTasks').value = '';
    document.getElementById('urgentTasks').value = '';
    document.getElementById('maintenanceTasks').value = '';
    
    // Show confirmation
    alert('Entry saved successfully!');
    
    // If we're on the history tab, reload the entries
    if (document.getElementById('historyView').classList.contains('active')) {
        loadHistoryEntries();
    }
}

function loadHistoryEntries(start = 0, limit = 21) {
    const entries = JSON.parse(localStorage.getItem('journalEntries') || '[]');
    const historyList = document.querySelector('.history-list');
    const seeMoreButton = document.getElementById('seeMoreButton');
    
    // Clear the list if this is the first batch (start = 0)
    if (start === 0) {
        historyList.innerHTML = '';
    }

    // Get the slice of entries for this page
    const entriesToShow = entries.slice(start, start + limit);
    
    entriesToShow.forEach(entry => {
        const entryElement = document.createElement('div');
        entryElement.className = 'history-entry';
        
        const date = new Date(entry.date);
        const options = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };
        
        entryElement.textContent = date.toLocaleDateString('en-US', options);
        entryElement.onclick = () => showHistoryEntry(entry);
        
        historyList.appendChild(entryElement);
    });

    // Show/hide "See More" button based on whether there are more entries
    if (entries.length > start + limit) {
        seeMoreButton.style.display = 'block';
        seeMoreButton.onclick = () => loadHistoryEntries(start + limit, limit);
    } else {
        seeMoreButton.style.display = 'none';
    }
}

// Update date when page loads
updateCurrentDate();
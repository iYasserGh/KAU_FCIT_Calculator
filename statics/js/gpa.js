// GPA Calculator Logic

let subjectsData = [];
let selectedSubjects = [];

// Grade to GPA point mapping (KAU scale)
const gradePoints = {
    'A+': 5.0,
    'A': 4.75,
    'B+': 4.5,
    'B': 4.0,
    'C+': 3.5,
    'C': 3.0,
    'D+': 2.5,
    'D': 2.0,
    'F': 1.0
};

const gradeLabels = {
    'A+': 'ممتاز مرتفع',
    'A': 'ممتاز',
    'B+': 'جيد جداً مرتفع',
    'B': 'جيد جداً',
    'C+': 'جيد مرتفع',
    'C': 'جيد',
    'D+': 'مقبول مرتفع',
    'D': 'مقبول',
    'F': 'راسب'
};

// Load subjects data
async function loadSubjectsData() {
    try {
        const response = await fetch('/data/subjects_data.json');
        const data = await response.json();
        subjectsData = data.subjects;
    } catch (error) {
        console.error('Error loading subjects data:', error);
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    loadSubjectsData();
    setupSearchEventListeners();
});

// Setup event listeners for search
function setupSearchEventListeners() {
    const searchInput = document.getElementById('subjectSearch');
    const searchResults = document.getElementById('searchResults');

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.trim();
        if (query.length >= 1) {
            searchSubjects(query);
        } else {
            hideSearchResults();
        }
    });

    // Hide results when clicking outside
    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
            hideSearchResults();
        }
    });

    // Handle keyboard navigation
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            hideSearchResults();
        }
    });
}

// Search subjects
function searchSubjects(query) {
    const normalizedQuery = query.toLowerCase();
    const results = subjectsData.filter(subject => {
        const isAlreadySelected = selectedSubjects.some(s => s.code === subject.code);
        if (isAlreadySelected) return false;
        
        return subject.code.toLowerCase().includes(normalizedQuery) ||
               subject.name.includes(query);
    }).slice(0, 10); // Limit to 10 results

    displaySearchResults(results);
}

// Display search results
function displaySearchResults(results) {
    const searchResults = document.getElementById('searchResults');
    
    if (results.length === 0) {
        searchResults.innerHTML = `
            <div class="p-3 text-neutral-400 text-center text-sm">
                لم يتم العثور على نتائج
            </div>
        `;
        searchResults.classList.remove('hidden');
        return;
    }

    searchResults.innerHTML = results.map(subject => `
        <div class="p-3 hover:bg-neutral-700 cursor-pointer transition duration-150 border-b border-neutral-700 last:border-b-0"
             onclick="selectSubject('${subject.code}')">
            <div class="flex justify-between items-center">
                <span class="text-white font-[400]">${subject.name}</span>
                <span class="text-green-400 text-sm font-mono">${subject.code}</span>
            </div>
            <div class="text-neutral-400 text-xs mt-1">ساعات المادة ${subject.credits}</div>
        </div>
    `).join('');

    searchResults.classList.remove('hidden');
}

// Hide search results
function hideSearchResults() {
    document.getElementById('searchResults').classList.add('hidden');
}

// Select a subject
function selectSubject(code) {
    const subject = subjectsData.find(s => s.code === code);
    if (!subject || selectedSubjects.some(s => s.code === code)) return;

    selectedSubjects.push({
        ...subject,
        grade: ''
    });

    // Clear search input and hide results
    document.getElementById('subjectSearch').value = '';
    hideSearchResults();

    // Update UI
    renderSelectedSubjects();
    updateCalculateButton();
}

// Render selected subjects
function renderSelectedSubjects() {
    const container = document.getElementById('selectedSubjects');
    const emptyState = document.getElementById('emptyState');

    if (selectedSubjects.length === 0) {
        container.innerHTML = '';
        emptyState.classList.remove('hidden');
        return;
    }

    emptyState.classList.add('hidden');

    container.innerHTML = selectedSubjects.map((subject, index) => `
        <div class="bg-neutral-800 rounded border border-neutral-700 p-4 subject-card" data-code="${subject.code}">
            <div class="flex justify-between items-center gap-3">
                <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2 flex-wrap">
                        <span class="text-white font-[400]">${subject.name}</span>
                        <span class="text-green-400 text-sm font-mono">${subject.code}</span>
                    </div>
                    <div class="text-neutral-500 text-xs mt-1">ساعات المادة ${subject.credits}</div>
                </div>
                <select onchange="setGrade('${subject.code}', this.value)"
                        class="bg-neutral-700 text-white p-2 rounded border border-neutral-600 focus:border-neutral-400 transition duration-200 min-w-[100px]">
                    <option value="" ${subject.grade === '' ? 'selected' : ''}>التقدير</option>
                    ${Object.keys(gradePoints).map(grade => `
                        <option value="${grade}" ${subject.grade === grade ? 'selected' : ''}>
                            ${grade}
                        </option>
                    `).join('')}
                </select>
                <button onclick="removeSubject('${subject.code}')" 
                        class="text-red-400 hover:text-red-300 transition p-1 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>
    `).join('');
}

// Set grade for a subject
function setGrade(code, grade) {
    const subject = selectedSubjects.find(s => s.code === code);
    if (subject) {
        subject.grade = grade;
        renderSelectedSubjects();
        updateCalculateButton();
    }
}

// Remove a subject
function removeSubject(code) {
    selectedSubjects = selectedSubjects.filter(s => s.code !== code);
    renderSelectedSubjects();
    updateCalculateButton();
    hideResult();
}

// Update calculate button state
function updateCalculateButton() {
    const btn = document.getElementById('calcBtn');
    const allGradesSet = selectedSubjects.length > 0 && 
                         selectedSubjects.every(s => s.grade !== '');
    btn.disabled = !allGradesSet;
}

// Calculate GPA
function calculateGPA() {
    const errorMsg = document.getElementById('errorMsg');
    const resultArea = document.getElementById('resultArea');

    // Validate all subjects have grades
    if (selectedSubjects.length === 0 || !selectedSubjects.every(s => s.grade !== '')) {
        errorMsg.classList.remove('hidden');
        resultArea.classList.add('hidden');
        return;
    }

    errorMsg.classList.add('hidden');

    // Calculate weighted GPA
    let totalPoints = 0;
    let totalCredits = 0;

    selectedSubjects.forEach(subject => {
        const points = gradePoints[subject.grade] || 0;
        totalPoints += points * subject.credits;
        totalCredits += subject.credits;
    });

    const gpa = totalCredits > 0 ? (totalPoints / totalCredits) : 0;

    // Display result
    document.getElementById('finalScore').textContent = gpa.toFixed(2);
    document.getElementById('totalCredits').textContent = `إجمالي الساعات: ${totalCredits} ساعة`;
    resultArea.classList.remove('hidden');

    // Scroll to result
    resultArea.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Hide result
function hideResult() {
    document.getElementById('resultArea').classList.add('hidden');
    document.getElementById('errorMsg').classList.add('hidden');
}

// Mock API data - In production, this would be fetched from an actual API
const mockApiData = {
    "data": [
        {
            "id": "06fa32eb-1d01-4c3b-b5d2-91204f96df30",
            "code": "ACAC",
            "number": "112",
            "title": "مبادئ الاقتصاد",
            "fullCode": "ACAC-112",
            "credit": 3
        },
        {
            "id": "fe2f45af-da9d-4512-b744-e56bc351ac3f",
            "code": "ACAC",
            "number": "113",
            "title": "مبادئ المالية",
            "fullCode": "ACAC-113",
            "credit": 2
        },
        {
            "id": "71eb68be-9902-4d49-8b28-e571c2379f0a",
            "code": "ACAC",
            "number": "115",
            "title": "مقدمة في المحاسبة المهنية",
            "fullCode": "ACAC-115",
            "credit": 3
        },
        {
            "id": "83f4e6b5-7aa8-4f89-87b6-812ae2d0c8dd",
            "code": "ACAC",
            "number": "121",
            "title": "محاسبة مالية 1",
            "fullCode": "ACAC-121",
            "credit": 3
        },
        {
            "id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
            "code": "CPIT",
            "number": "201",
            "title": "مقدمة في البرمجة",
            "fullCode": "CPIT-201",
            "credit": 3
        },
        {
            "id": "b2c3d4e5-f6a7-8901-2345-67890abcdef1",
            "code": "CPCS",
            "number": "202",
            "title": "هياكل البيانات",
            "fullCode": "CPCS-202",
            "credit": 3
        },
        {
            "id": "c3d4e5f6-a7b8-9012-3456-7890abcdef12",
            "code": "STAT",
            "number": "210",
            "title": "الإحصاء والاحتمالات",
            "fullCode": "STAT-210",
            "credit": 3
        },
        {
            "id": "d4e5f6a7-b8c9-0123-4567-890abcdef123",
            "code": "CPIT",
            "number": "221",
            "title": "مهارات الحاسب الآلي",
            "fullCode": "CPIT-221",
            "credit": 2
        },
        {
            "id": "e5f6a7b8-c9d0-1234-5678-90abcdef1234",
            "code": "CPCS",
            "number": "203",
            "title": "البرمجة الشيئية",
            "fullCode": "CPCS-203",
            "credit": 3
        }
    ]
};

const apiUrl = 'https://dev.api.kaustack.com';
const apiEndpoint = '/catalog/courses';
const apiSearchEndpoint = '/catalog/search?q=';

let subjects = [];
let selectedSubjects = [];
let selectedSubjectId = null;

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Load subjects from mock API
    loadSubjects();
    
    // Setup search input event listener
    const searchInput = document.getElementById('subjectSearch');
    const dropdown = document.getElementById('subjectDropdown');
    
    searchInput.addEventListener('focus', function() {
        filterSubjects('');
        dropdown.classList.remove('hidden');
    });
    
    searchInput.addEventListener('input', function(e) {
        const searchTerm = e.target.value;
        filterSubjects(searchTerm);
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!searchInput.contains(e.target) && !dropdown.contains(e.target)) {
            dropdown.classList.add('hidden');
        }
    });
});

// Load subjects from API (mock data)
function loadSubjects() {
    // In production: fetch('/api/subjects').then(res => res.json()).then(data => {...})
    fetch(`${apiUrl}${apiEndpoint}`)
        .then(res => res.json())
        .then(data => {
            subjects = data.data; // Limit to first 30 subjects for performance
        })
        .catch(err => {
            console.error('Error loading subjects:', err);
            subjects = mockApiData.data;
        });
    // if no credit make credit 0
    for (let subject of subjects) {
        if (!subject.credit) {
            subject.credit = 0;
        }
    }
    // subjects = mockApiData.data; // For testing without actual API
}

// Filter subjects based on search term
function filterSubjects(searchTerm) {
    const dropdown = document.getElementById('subjectDropdown');
    const searchLower = searchTerm.toLowerCase();
    
    var filtered = subjects.filter(subject => {
        // Check if already selected
        if (selectedSubjects.find(s => s.id === subject.id)) {
            return false;
        }
        
        // Filter by search term
        if (searchTerm === '') return true;
        
        // Normalize Arabic text for better search matching
        const normalizeArabic = (text) => {
            return text
            .replace(/[أإآا]/g, 'ا')
            .replace(/[ى]/g, 'ي')
            .replace(/[ة]/g, 'ه')
            .replace(/[ؤ]/g, 'و')
            .replace(/[ئ]/g, 'ي')
            .replace(/[٠]/g, '0')
            .replace(/[١]/g, '1')
            .replace(/[٢]/g, '2')
            .replace(/[٣]/g, '3')
            .replace(/[٤]/g, '4')
            .replace(/[٥]/g, '5')
            .replace(/[٦]/g, '6')
            .replace(/[٧]/g, '7')
            .replace(/[٨]/g, '8')
            .replace(/[٩]/g, '9');
        };
        
        // Split search term into individual words/tokens
        const normalizedSearch = normalizeArabic(searchLower);
        const searchTokens = normalizedSearch.split(/[\s\-]+/).filter(token => token.length > 0);
        
        // If no tokens, return true (show all)
        if (searchTokens.length === 0) return true;
        
        // Create searchable text from all subject properties
        const searchableText = normalizeArabic([
            subject.title,
            subject.fullCode,
            subject.code,
            subject.number,
            `${subject.code}${subject.number}`,
            `${subject.code} ${subject.number}`,
            `${subject.code}-${subject.number}`,
            subject.title.split(' ').join(''),
        ].join(' ').toLowerCase());
        
        // Check if ALL tokens are found somewhere in the searchable text
        return searchTokens.every(token => searchableText.includes(token));
    });

    filtered = filtered.slice(0, 20); // Limit to first 20 results for performance
    
    // Display filtered subjects
    if (filtered.length === 0) {
        dropdown.innerHTML = '<div class="px-4 py-2 text-neutral-400 text-sm">لا توجد نتائج</div>';
    } else {
        dropdown.innerHTML = filtered.map(subject => `
            <div onclick="selectSubject('${subject.id}')" 
                 class="px-4 py-2 hover:bg-neutral-700 cursor-pointer transition border-b border-neutral-700 last:border-b-0">
                <div class="text-neutral-100 font-medium">${subject.fullCode}</div>
                <div class="text-neutral-400 text-sm">${subject.title}</div>
                <div class="text-neutral-500 text-xs mt-1">${subject.credit} ساعة</div>
            </div>
        `).join('');
    }
    
    dropdown.classList.remove('hidden');
}

// Select a subject from dropdown
function selectSubject(subjectId) {
    const subject = subjects.find(s => s.id === subjectId);
    if (subject) {
        selectedSubjectId = subjectId;
        document.getElementById('subjectSearch').value = `${subject.fullCode} - ${subject.title}`;
        document.getElementById('subjectDropdown').classList.add('hidden');
    }
}

// Add subject to the list
function addSubject() {
    const gradeInput = document.getElementById('gradeInput');
    const grade = parseFloat(gradeInput.value);
    const errorMsg = document.getElementById('errorMsg');
    
    // Validate inputs
    if (!selectedSubjectId) {
        showError('الرجاء اختيار مادة');
        return;
    }
    
    if (!grade || grade === '') {
        showError('الرجاء اختيار الدرجة');
        return;
    }
    
    // Get subject details
    const subject = subjects.find(s => s.id === selectedSubjectId);
    
    // Check if already added
    if (selectedSubjects.find(s => s.id === selectedSubjectId)) {
        showError('تم إضافة هذه المادة بالفعل');
        return;
    }
    
    // Add to selected subjects
    selectedSubjects.push({
        ...subject,
        grade: grade
    });
    
    // Update UI
    displaySelectedSubjects();
    
    // Reset inputs
    document.getElementById('subjectSearch').value = '';
    gradeInput.value = '';
    selectedSubjectId = null;
    errorMsg.classList.add('hidden');
    document.getElementById('resultArea').classList.add('hidden');
}

// Display selected subjects
function displaySelectedSubjects() {
    const container = document.getElementById('selectedSubjects');
    
    if (selectedSubjects.length === 0) {
        container.innerHTML = '<p class="text-neutral-400 text-sm text-center py-4">لم يتم إضافة أي مواد بعد</p>';
        return;
    }
    
    container.innerHTML = selectedSubjects.map((subject, index) => `
        <div class="bg-neutral-800 border border-neutral-700 rounded p-3">
            <div class="flex justify-between items-start mb-2">
                <div class="flex-1">
                    <div class="text-neutral-100 font-medium text-sm">${subject.fullCode} - ${subject.title}</div>
                    <div class="text-neutral-400 text-xs mt-1">الساعات: ${subject.credit}</div>
                </div>
                <button onclick="removeSubject(${index})" 
                        class="text-red-400 hover:text-red-300 px-2 py-1 transition">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>
            <div class="flex items-center gap-2">
                <label class="text-neutral-400 text-xs">الدرجة:</label>
                <div class="relative flex-1">
                    <select onchange="updateSubjectGrade(${index}, this.value)" 
                            class="w-full px-3 py-1.5 text-sm bg-neutral-900 border border-neutral-600 rounded text-neutral-100 focus:outline-none focus:border-green-400 transition appearance-none cursor-pointer">
                        <option value="5.0" ${subject.grade === 5.0 ? 'selected' : ''}>A+</option>
                        <option value="4.75" ${subject.grade === 4.75 ? 'selected' : ''}>A</option>
                        <option value="4.5" ${subject.grade === 4.5 ? 'selected' : ''}>B+</option>
                        <option value="4.0" ${subject.grade === 4.0 ? 'selected' : ''}>B</option>
                        <option value="3.5" ${subject.grade === 3.5 ? 'selected' : ''}>C+</option>
                        <option value="3.0" ${subject.grade === 3.0 ? 'selected' : ''}>C</option>
                        <option value="2.5" ${subject.grade === 2.5 ? 'selected' : ''}>D+</option>
                        <option value="2.0" ${subject.grade === 2.0 ? 'selected' : ''}>D</option>
                        <option value="1.0" ${subject.grade === 1.0 ? 'selected' : ''}>F</option>
                    </select>
                    <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center px-2 text-neutral-400">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// Update subject grade
function updateSubjectGrade(index, newGrade) {
    selectedSubjects[index].grade = parseFloat(newGrade);
    document.getElementById('resultArea').classList.add('hidden');
}

// Remove subject from list
function removeSubject(index) {
    selectedSubjects.splice(index, 1);
    displaySelectedSubjects();
    document.getElementById('resultArea').classList.add('hidden');
}

// Calculate GPA
function calculateGPA() {
    const errorMsg = document.getElementById('errorMsg');
    const resultArea = document.getElementById('resultArea');
    
    if (selectedSubjects.length === 0) {
        showError('الرجاء إضافة مادة واحدة على الأقل');
        resultArea.classList.add('hidden');
        return;
    }
    
    // Calculate GPA: sum(grade * credit) / sum(credit)
    let totalPoints = 0;
    let totalCredits = 0;
    
    selectedSubjects.forEach(subject => {
        totalPoints += subject.grade * subject.credit;
        totalCredits += subject.credit;
    });
    
    const gpa = totalPoints / totalCredits;
    
    // Display result
    document.getElementById('finalScore').textContent = gpa.toFixed(2);
    document.getElementById('totalCredits').textContent = totalCredits;
    resultArea.classList.remove('hidden');
    errorMsg.classList.add('hidden');
    
    // Scroll to result
    resultArea.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Show error message
function showError(message) {
    const errorMsg = document.getElementById('errorMsg');
    errorMsg.textContent = message;
    errorMsg.classList.remove('hidden');
    
    setTimeout(() => {
        errorMsg.classList.add('hidden');
    }, 3000);
}

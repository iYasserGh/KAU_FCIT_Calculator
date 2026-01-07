function loadPrevGrades() {
    const CS_table = document.getElementById('CS_prev_years_table');
    const IT_table = document.getElementById('IT_prev_years_table');
    const IS_table = document.getElementById('IS_prev_years_table');
    
    CS_table.querySelector('tbody').innerHTML = '';
    IT_table.querySelector('tbody').innerHTML = '';
    IS_table.querySelector('tbody').innerHTML = '';
    
    for (let raw of prev_grades['CS']) {
        let row = document.createElement('tr');
        row.classList.add('border-t', 'border-neutral-700', 'hover:bg-neutral-800', 'transition-colors', 'duration-200');
        let year = raw['year'];
        let maleGrade = raw['male'] !== null ? raw['male'] : '-';
        let femaleGrade = raw['female'] !== null ? raw['female'] : '-';
        row.innerHTML = `<td class="p-3">${year}</td><td class="p-3">${maleGrade}</td><td class="p-3">${femaleGrade}</td>`;
        CS_table.querySelector('tbody').appendChild(row);
    }

    for (let raw of prev_grades['IT']) {
        let row = document.createElement('tr');
        row.classList.add('border-t', 'border-neutral-700', 'hover:bg-neutral-800', 'transition-colors', 'duration-200');
        let year = raw['year'];
        let maleGrade = raw['male'] !== null ? raw['male'] : '-';
        let femaleGrade = raw['female'] !== null ? raw['female'] : '-';
        row.innerHTML = `<td class="p-3">${year}</td><td class="p-3">${maleGrade}</td><td class="p-3">${femaleGrade}</td>`;
        IT_table.querySelector('tbody').appendChild(row);
    }

    for (let raw of prev_grades['IS']) {
        let row = document.createElement('tr');
        row.classList.add('border-t', 'border-neutral-700', 'hover:bg-neutral-800', 'transition-colors', 'duration-200');
        let year = raw['year'];
        let maleGrade = raw['male'] !== null ? raw['male'] : '-';
        let femaleGrade = raw['female'] !== null ? raw['female'] : '-';
        row.innerHTML = `<td class="p-3">${year}</td><td class="p-3">${maleGrade}</td><td class="p-3">${femaleGrade}</td>`;
        IS_table.querySelector('tbody').appendChild(row);
    }
}

function loadLastGPA() {
    const lastGPAData = localStorage.getItem('lastGPAResult');
    if (lastGPAData) {
        const data = JSON.parse(lastGPAData);
        console.log(data);
        document.getElementById("userWeightedDegree").innerText = data.finalGPA;
        document.getElementById("userDegreeComparison").classList.remove('hidden');
    }
}

function closeLastGPAAlert() {
    document.getElementById("userDegreeComparison").classList.add('hidden');
}

window.onload = function() {
    fetch('prev_years_data.json')
        .then(response => response.json())
        .then(data => {
            prev_grades = data;
            loadPrevGrades();
            loadLastGPA();
        })
        .catch(error => console.error('Error loading previous grades data:', error));
}
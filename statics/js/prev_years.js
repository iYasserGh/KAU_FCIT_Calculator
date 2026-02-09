function clearTables(){
    const CS_table = document.getElementById('CS_prev_years_table');
    const IT_table = document.getElementById('IT_prev_years_table');
    const IS_table = document.getElementById('IS_prev_years_table');
    
    CS_table.querySelector('tbody').innerHTML = '';
    IT_table.querySelector('tbody').innerHTML = '';
    IS_table.querySelector('tbody').innerHTML = '';
}

function loadPrevGrades() {
    const CS_table = document.getElementById('CS_prev_years_table');
    const IT_table = document.getElementById('IT_prev_years_table');
    const IS_table = document.getElementById('IS_prev_years_table');

    clearTables();

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

function getLastGPA() {
    const lastGPAData = localStorage.getItem('lastGPAResult');
    if (lastGPAData) {
        return JSON.parse(lastGPAData).finalGPA;
    }
    return 0;
}

function loadLastGPA() {
    const lastGPAData = localStorage.getItem('lastGPAResult');
    if (lastGPAData) {
        const data = JSON.parse(lastGPAData);

        let nowTimestamp = new Date().toISOString();
        if ((new Date(nowTimestamp) - new Date(data.timestamp)) > 24 * 60 * 60 * 1000) return; // older than 24 hours

        document.getElementById("userWeightedDegree").innerText = data.finalGPA;
        document.getElementById("userDegreeComparison").classList.remove('hidden');
        document.getElementById("canJoinMajors").classList.remove('hidden');
        document.getElementById("calcGPA").classList.add('hidden');
    }
}

function closeLastGPAAlert() {
    document.getElementById("userDegreeComparison").classList.add('hidden');
}

function calcMeanOfSection(section, gender){
    let mean = 0;
    let count = 0;
    for (let raw of prev_grades[section].slice(2)){
        if (raw[gender] !== null &&
            raw[gender] !== undefined && 
            raw[gender] !== '-'){
            
            const numValue = parseFloat(raw[gender]);
            
            if (!isNaN(numValue)) {
                mean += numValue;
                count += 1;
            }
        }
    }
    
    if (count === 0) return 101; // to allow all if no data
    console.log(section + ' ' + gender + ' ' + (mean / count).toFixed(2));
    return (mean / count).toFixed(2);
}

function loadMajorsCanJoin(canJoin){
    const maleMajors = document.getElementById('maleMajors');
    const femaleMajors = document.getElementById('femaleMajors');

    let maleList = [];
    let femaleList = [];

    for (let item of canJoin){
        if (item.male){
            maleList.push(item.name);
        }
        if (item.female){
            femaleList.push(item.name);
        }
    }

    maleMajors.innerText = maleList.length > 0 ? maleList.join(', ') : 'لا يوجد';
    femaleMajors.innerText = femaleList.length > 0 ? femaleList.join(', ') : 'لا يوجد';
}

let degree = getLastGPA();

window.addEventListener('load', async function() {
    await fetch('/data/prev_years_data.json')
    .then(response => response.json())
    .then(data => {
            prev_grades = data;
            let canJoin = [
                {section: 'CS', name: 'علوم الحاسبات', male:degree > calcMeanOfSection('CS', 'male'), female:degree > calcMeanOfSection('CS', 'female')},
                {section: 'IT', name: 'تقنية المعلومات', male:degree > calcMeanOfSection('IT', 'male'), female:degree > calcMeanOfSection('IT', 'female')},
                {section: 'IS', name: 'نظم المعلومات', male:degree > calcMeanOfSection('IS', 'male'), female:degree > calcMeanOfSection('IS', 'female')}
            ]
            loadPrevGrades();
            loadMajorsCanJoin(canJoin);
        })
        .catch(error => console.error('Error loading previous grades data:', error));
        
    loadLastGPA();
    

});
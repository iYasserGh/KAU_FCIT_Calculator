const errorMsg = document.getElementById('errorMsg');
const resultArea = document.getElementById('resultArea');

const hours = {
    cpit201: 3,
    cpcs202: 3,
    stat210: 3,
    cpit221: 2,
    cpcs203: 3
};

const arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
const englishNumbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

function convertArabicToEnglish(str) {    
    let result = str;
    arabicNumbers.forEach((arabic, index) => {
        result = result.replace(new RegExp(arabic, 'g'), englishNumbers[index]);
    });
    return result;
}

function saveGradesToLocalStorage(cpit201 = null, cpcs202 = null, stat210 = null, cpit221 = null, cpcs203 = null) {
    const gradesData = {
        cpit201: cpit201 !== null ? cpit201 : '',
        cpcs202: cpcs202 !== null ? cpcs202 : '',
        stat210: stat210 !== null ? stat210 : '',
        cpit221: cpit221 !== null ? cpit221 : '',
        cpcs203: cpcs203 !== null ? cpcs203 : '',
        timestamp: new Date().toISOString()
    };
    localStorage.setItem('lastGrades', JSON.stringify(gradesData));
}

function calculateMajor() {

    const totalHours = 11;

    // const val_cpit201 = parseFloat(document.getElementById('cpit201').value);
    // const val_cpcs202 = parseFloat(document.getElementById('cpcs202').value);
    // const val_stat210 = parseFloat(document.getElementById('stat210').value);
    // const val_cpit221 = parseFloat(document.getElementById('cpit221').value);

    

    const val_cpit201 = parseFloat(convertArabicToEnglish(document.getElementById('cpit201').value));
    const val_cpcs202 = parseFloat(convertArabicToEnglish(document.getElementById('cpcs202').value));
    const val_stat210 = parseFloat(convertArabicToEnglish(document.getElementById('stat210').value));
    const val_cpit221 = parseFloat(convertArabicToEnglish(document.getElementById('cpit221').value));


    if (isNaN(val_cpit201) || isNaN(val_cpcs202) || isNaN(val_stat210) || isNaN(val_cpit221) ||
        val_cpit201 < 0 || val_cpit201 > 100 ||
        val_cpcs202 < 0 || val_cpcs202 > 100 ||
        val_stat210 < 0 || val_stat210 > 100 ||
        val_cpit221 < 0 || val_cpit221 > 100) {
        errorMsg.classList.remove('hidden');
        resultArea.classList.add('hidden');
        return;
    }

    errorMsg.classList.add('hidden');

    const weightedSum = (val_cpit201 * hours.cpit201) +
        (val_cpcs202 * hours.cpcs202) +
        (val_stat210 * hours.stat210) +
        (val_cpit221 * hours.cpit221);

    const finalGPA = weightedSum / totalHours;

    document.getElementById('finalScore').innerText = finalGPA.toFixed(2);
    resultArea.classList.remove('hidden');
    // Save to localStorage
    // const resultsData = {
    //     cpit201: val_cpit201,
    //     cpcs202: val_cpcs202,
    //     stat210: val_stat210,
    //     cpit221: val_cpit221,
    //     finalGPA: finalGPA.toFixed(2),
    //     timestamp: new Date().toISOString()
    // };
    saveGradesToLocalStorage(val_cpit201, val_cpcs202, val_stat210, val_cpit221);
    // localStorage.setItem('lastGrades', JSON.stringify(resultsData));
}

window.onload = function() {
    // Load last result from localStorage
    const lastResult = localStorage.getItem('lastGrades');
    if (lastResult) {
        const data = JSON.parse(lastResult);
        document.getElementById('cpit201').value = data.cpit201 || '';
        document.getElementById('cpcs202').value = data.cpcs202 || '';
        document.getElementById('stat210').value = data.stat210 || '';
        document.getElementById('cpit221').value = data.cpit221 || '';
        const cpcs203 = document.getElementById('cpcs203')
        if (cpcs203) {
            cpcs203.value = data.cpcs203 || '';
        }
    }
}

function calculateTransferMajor() {
    const totalHours = 11;

    const val_cpit201 = parseFloat(convertArabicToEnglish(document.getElementById('cpit201').value));
    const val_cpcs202 = parseFloat(convertArabicToEnglish(document.getElementById('cpcs202').value));
    const val_stat210 = parseFloat(convertArabicToEnglish(document.getElementById('stat210').value));
    const val_cpit221 = parseFloat(convertArabicToEnglish(document.getElementById('cpit221').value));
    const val_cpcs203 = parseFloat(convertArabicToEnglish(document.getElementById('cpcs203').value));

    if (isNaN(val_cpit201) || isNaN(val_cpcs202) || isNaN(val_stat210) || isNaN(val_cpit221) || isNaN(val_cpcs203) ||
        val_cpit201 < 0 || val_cpit201 > 100 ||
        val_cpcs202 < 0 || val_cpcs202 > 100 ||
        val_stat210 < 0 || val_stat210 > 100 ||
        val_cpit221 < 0 || val_cpit221 > 100 ||
        val_cpcs203 < 0 || val_cpcs203 > 100) {
        errorMsg.classList.remove('hidden');
        resultArea.classList.add('hidden');
        return;
    }

    errorMsg.classList.add('hidden');

    // replace min grade of first 4 courses with cpcs203 grade.
    var grades = {
        cpit201: val_cpit201,
        cpcs202: val_cpcs202,
        stat210: val_stat210,
        cpit221: val_cpit221
    }
    const minGrade = Math.min(...Object.values(grades));
    const minKey = Object.keys(grades).find(key => grades[key] === minGrade);
    delete grades[minKey];
    grades.cpcs203 = val_cpcs203;

    var weightedSum = 0;
    Object.keys(grades).forEach(key => {
        weightedSum += grades[key] * hours[key];
    });
    
    const finalGPA = weightedSum / totalHours;

    document.getElementById('finalScore').innerText = finalGPA.toFixed(2);
    resultArea.classList.remove('hidden');

    // Save to localStorage
    saveGradesToLocalStorage(val_cpit201, val_cpcs202, val_stat210, val_cpit221, val_cpcs203);
}

function calculateGPA() {
    const hours = {
        cpit201: 3,
        cpcs202: 3,
        stat210: 3,
        cpit221: 2
    };

    const totalHours = 11;

    // const val_cpit201 = parseFloat(document.getElementById('cpit201').value);
    // const val_cpcs202 = parseFloat(document.getElementById('cpcs202').value);
    // const val_stat210 = parseFloat(document.getElementById('stat210').value);
    // const val_cpit221 = parseFloat(document.getElementById('cpit221').value);

    function convertArabicToEnglish(str) {
        const arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
        const englishNumbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
        
        let result = str;
        arabicNumbers.forEach((arabic, index) => {
            result = result.replace(new RegExp(arabic, 'g'), englishNumbers[index]);
        });
        return result;
    }

    const val_cpit201 = parseFloat(convertArabicToEnglish(document.getElementById('cpit201').value));
    const val_cpcs202 = parseFloat(convertArabicToEnglish(document.getElementById('cpcs202').value));
    const val_stat210 = parseFloat(convertArabicToEnglish(document.getElementById('stat210').value));
    const val_cpit221 = parseFloat(convertArabicToEnglish(document.getElementById('cpit221').value));

    const errorMsg = document.getElementById('errorMsg');
    const resultArea = document.getElementById('resultArea');

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
}
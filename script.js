document.addEventListener('DOMContentLoaded', () => {
    // Navigation Logic
    const navBtns = document.querySelectorAll('.nav-btn');
    const calcSections = document.querySelectorAll('.calc-section');

    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all
            navBtns.forEach(b => b.classList.remove('active'));
            calcSections.forEach(s => s.classList.remove('active'));

            // Add active class to clicked
            btn.classList.add('active');
            const targetId = btn.getAttribute('data-target');
            document.getElementById(targetId).classList.add('active');
        });
    });

    // Standard Calculator Logic
    class Calculator {
        constructor(prevOperandElement, currOperandElement) {
            this.prevOperandElement = prevOperandElement;
            this.currOperandElement = currOperandElement;
            this.clear();
        }

        clear() {
            this.currentOperand = '0';
            this.previousOperand = '';
            this.operation = undefined;
        }

        delete() {
            if (this.currentOperand === '0') return;
            this.currentOperand = this.currentOperand.toString().slice(0, -1);
            if (this.currentOperand === '') this.currentOperand = '0';
        }

        appendNumber(number) {
            if (number === '.' && this.currentOperand.includes('.')) return;
            if (this.currentOperand === '0' && number !== '.') {
                this.currentOperand = number.toString();
            } else {
                this.currentOperand = this.currentOperand.toString() + number.toString();
            }
        }

        chooseOperation(operation) {
            if (this.currentOperand === '0' && this.previousOperand === '') return;
            if (this.previousOperand !== '') {
                this.compute();
            }
            this.operation = operation;
            this.previousOperand = this.currentOperand;
            this.currentOperand = '0';
        }

        compute() {
            let computation;
            const prev = parseFloat(this.previousOperand);
            const current = parseFloat(this.currentOperand);
            if (isNaN(prev) || isNaN(current)) return;
            switch (this.operation) {
                case '+':
                    computation = prev + current;
                    break;
                case '-':
                    computation = prev - current;
                    break;
                case '*':
                    computation = prev * current;
                    break;
                case '÷':
                    if(current === 0) {
                        alert("Cannot divide by zero");
                        this.clear();
                        return;
                    }
                    computation = prev / current;
                    break;
                default:
                    return;
            }
            this.currentOperand = computation.toString();
            
            // Add to history
            const historyList = document.getElementById('history-list');
            const historyItem = document.createElement('div');
            historyItem.classList.add('history-item');
            historyItem.innerText = `${prev} ${this.operation} ${current} = ${computation}`;
            historyList.appendChild(historyItem);
            historyList.scrollTop = historyList.scrollHeight;

            this.operation = undefined;
            this.previousOperand = '';
        }

        getDisplayNumber(number) {
            const stringNumber = number.toString();
            const integerDigits = parseFloat(stringNumber.split('.')[0]);
            const decimalDigits = stringNumber.split('.')[1];
            let integerDisplay;
            if (isNaN(integerDigits)) {
                integerDisplay = '';
            } else {
                integerDisplay = integerDigits.toLocaleString('en', { maximumFractionDigits: 0 });
            }
            if (decimalDigits != null) {
                return `${integerDisplay}.${decimalDigits}`;
            } else {
                return integerDisplay;
            }
        }

        updateDisplay() {
            this.currOperandElement.innerText = this.getDisplayNumber(this.currentOperand);
            if (this.operation != null) {
                this.prevOperandElement.innerText = `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`;
            } else {
                this.prevOperandElement.innerText = '';
            }
        }
    }

    const prevOperandEl = document.getElementById('prev-operand');
    const currOperandEl = document.getElementById('curr-operand');
    const calculator = new Calculator(prevOperandEl, currOperandEl);

    document.querySelectorAll('[data-number]').forEach(button => {
        button.addEventListener('click', () => {
            calculator.appendNumber(button.getAttribute('data-number'));
            calculator.updateDisplay();
        });
    });

    document.querySelectorAll('[data-operator]').forEach(button => {
        button.addEventListener('click', () => {
            calculator.chooseOperation(button.getAttribute('data-operator'));
            calculator.updateDisplay();
        });
    });

    document.querySelector('[data-action="equals"]').addEventListener('click', () => {
        calculator.compute();
        calculator.updateDisplay();
    });

    document.querySelector('[data-action="clear"]').addEventListener('click', () => {
        calculator.clear();
        calculator.updateDisplay();
    });

    document.querySelector('[data-action="delete"]').addEventListener('click', () => {
        calculator.delete();
        calculator.updateDisplay();
    });

    document.getElementById('clear-history').addEventListener('click', () => {
        document.getElementById('history-list').innerHTML = '';
    });

    // Percentage Logic
    document.getElementById('btn-calc-pct1').addEventListener('click', () => {
        const x = parseFloat(document.getElementById('pct1-x').value);
        const y = parseFloat(document.getElementById('pct1-y').value);
        if (isNaN(x) || isNaN(y)) return;
        const res = (x / 100) * y;
        document.getElementById('pct1-out').innerText = res;
        document.getElementById('pct1-res').style.display = 'block';
    });
    document.getElementById('btn-calc-pct2').addEventListener('click', () => {
        const x = parseFloat(document.getElementById('pct2-x').value);
        const y = parseFloat(document.getElementById('pct2-y').value);
        if (isNaN(x) || isNaN(y) || y === 0) return;
        const res = (x / y) * 100;
        document.getElementById('pct2-out').innerText = res.toFixed(4).replace(/\.?0+$/, '');
        document.getElementById('pct2-res').style.display = 'block';
    });
    document.getElementById('btn-calc-pct3').addEventListener('click', () => {
        const x = parseFloat(document.getElementById('pct3-x').value);
        const y = parseFloat(document.getElementById('pct3-y').value);
        if (isNaN(x) || isNaN(y) || x === 0) return;
        const res = ((y - x) / Math.abs(x)) * 100;
        document.getElementById('pct3-out').innerText = Math.abs(res).toFixed(4).replace(/\.?0+$/, '');
        const typeEl = document.getElementById('pct3-type');
        if(res > 0) { typeEl.innerText = "Increase"; typeEl.style.color = "#10b981"; }
        else if(res < 0) { typeEl.innerText = "Decrease"; typeEl.style.color = "#ef4444"; }
        else { typeEl.innerText = "No Change"; typeEl.style.color = "var(--text-secondary)"; }
        document.getElementById('pct3-res').style.display = 'block';
    });

    // BMI Logic
    document.getElementById('btn-calc-bmi').addEventListener('click', () => {
        const weight = parseFloat(document.getElementById('bmi-weight').value);
        const heightCm = parseFloat(document.getElementById('bmi-height').value);
        
        if (!weight || !heightCm) {
            alert('Please enter valid weight and height.');
            return;
        }

        const heightM = heightCm / 100;
        const bmi = (weight / (heightM * heightM)).toFixed(1);
        
        let category = '';
        let color = '';
        if (bmi < 18.5) { category = 'Underweight'; color = '#3b82f6'; }
        else if (bmi < 25) { category = 'Normal weight'; color = '#10b981'; }
        else if (bmi < 30) { category = 'Overweight'; color = '#f59e0b'; }
        else { category = 'Obese'; color = '#ef4444'; }

        document.getElementById('bmi-value').innerText = bmi;
        document.getElementById('bmi-value').style.color = color;
        document.getElementById('bmi-category').innerText = category;
        document.getElementById('bmi-category').style.color = color;
        
        document.getElementById('bmi-result-box').style.display = 'block';
        document.getElementById('bmi-result-box').style.borderColor = color;
    });

    // EMI Logic
    document.getElementById('btn-calc-emi').addEventListener('click', () => {
        const p = parseFloat(document.getElementById('emi-principal').value);
        const r = parseFloat(document.getElementById('emi-rate').value) / 12 / 100;
        const n = parseFloat(document.getElementById('emi-tenure').value) * 12;

        if (!p || !r || !n) {
            alert('Please fill all EMI fields correctly.');
            return;
        }

        const emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
        const totalAmount = emi * n;
        const totalInterest = totalAmount - p;

        document.getElementById('emi-value').innerText = '$' + emi.toFixed(2);
        document.getElementById('emi-interest').innerText = '$' + totalInterest.toFixed(2);
        document.getElementById('emi-total').innerText = '$' + totalAmount.toFixed(2);
        
        document.getElementById('emi-result-box').style.display = 'block';
    });

    // Discount Logic
    document.getElementById('btn-calc-disc').addEventListener('click', () => {
        const price = parseFloat(document.getElementById('disc-price').value);
        const discount = parseFloat(document.getElementById('disc-percent').value);

        if (!price || discount == null || discount < 0 || discount > 100) {
            alert('Please enter a valid price and discount percentage (0-100).');
            return;
        }

        const saved = (price * discount) / 100;
        const finalPrice = price - saved;

        document.getElementById('disc-final').innerText = '$' + finalPrice.toFixed(2);
        document.getElementById('disc-saved').innerText = '$' + saved.toFixed(2);
        
        document.getElementById('disc-result-box').style.display = 'block';
    });

    // Date Calculator Logic
    document.getElementById('btn-calc-date').addEventListener('click', () => {
        const start = new Date(document.getElementById('date-start').value);
        const end = new Date(document.getElementById('date-end').value);

        if (isNaN(start) || isNaN(end)) {
            alert('Please select valid start and end dates.');
            return;
        }

        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

        let years = end.getFullYear() - start.getFullYear();
        let months = end.getMonth() - start.getMonth();
        let days = end.getDate() - start.getDate();

        if (days < 0) {
            months--;
            const previousMonth = new Date(end.getFullYear(), end.getMonth(), 0);
            days += previousMonth.getDate();
        }

        if (months < 0) {
            years--;
            months += 12;
        }

        // Adjust if end date is before start date
        if (end < start) {
            years = -years;
            months = -months;
            days = -days;
        }

        document.getElementById('date-diff-days').innerText = `${diffDays} days`;
        document.getElementById('date-diff-detailed').innerText = `${Math.abs(years)} Years, ${Math.abs(months)} Months, ${Math.abs(days)} Days`;
        document.getElementById('date-result-box').style.display = 'block';
    });

    // Unit Converter Logic
    const units = {
        length: {
            Meter: 1, Kilometer: 1000, Centimeter: 0.01, Millimeter: 0.001,
            Mile: 1609.34, Yard: 0.9144, Foot: 0.3048, Inch: 0.0254
        },
        weight: {
            Kilogram: 1, Gram: 0.001, Milligram: 0.000001, MetricTon: 1000,
            Pound: 0.453592, Ounce: 0.0283495
        },
        temperature: {
            Celsius: 'C', Fahrenheit: 'F', Kelvin: 'K'
        }
    };

    const typeSelect = document.getElementById('unit-type');
    const fromSelect = document.getElementById('unit-from');
    const toSelect = document.getElementById('unit-to');
    const inputEl = document.getElementById('unit-input');
    const outputEl = document.getElementById('unit-output');

    function populateUnits() {
        const type = typeSelect.value;
        const options = Object.keys(units[type]);
        
        fromSelect.innerHTML = '';
        toSelect.innerHTML = '';
        
        options.forEach(opt => {
            fromSelect.add(new Option(opt, opt));
            toSelect.add(new Option(opt, opt));
        });
        
        if (options.length > 1) {
            toSelect.selectedIndex = 1;
        }
        convertUnit();
    }

    function convertUnit() {
        const type = typeSelect.value;
        const from = fromSelect.value;
        const to = toSelect.value;
        const val = parseFloat(inputEl.value);

        if (isNaN(val)) {
            outputEl.value = '';
            return;
        }

        let result;
        if (type === 'temperature') {
            let celsius;
            if (from === 'Celsius') celsius = val;
            else if (from === 'Fahrenheit') celsius = (val - 32) * 5/9;
            else if (from === 'Kelvin') celsius = val - 273.15;

            if (to === 'Celsius') result = celsius;
            else if (to === 'Fahrenheit') result = (celsius * 9/5) + 32;
            else if (to === 'Kelvin') result = celsius + 273.15;
        } else {
            const baseVal = val * units[type][from];
            result = baseVal / units[type][to];
        }

        outputEl.value = Number.isInteger(result) ? result : result.toFixed(4);
    }

    typeSelect.addEventListener('change', populateUnits);
    fromSelect.addEventListener('change', convertUnit);
    toSelect.addEventListener('change', convertUnit);
    inputEl.addEventListener('input', convertUnit);

    // Initialize units
    populateUnits();
});

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
});

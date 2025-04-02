class Calculator {
    constructor() {
      this.display = document.getElementById('currentDisplay');
      this.previousResult = document.getElementById('previousResult');
      this.history = [];
      this.setupEventListeners();
    }
  
    setupEventListeners() {
      // Theme Toggle
      document.getElementById('themeToggle').addEventListener('click', () => {
        const app = document.querySelector('.app');
        const currentTheme = app.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        app.setAttribute('data-theme', newTheme);
        
        // Update theme toggle icon
        const icon = document.querySelector('#themeToggle svg');
        if (newTheme === 'dark') {
          icon.innerHTML = '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>';
        } else {
          icon.innerHTML = '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>';
        }
      });
  
      // Modal Controls
      const modals = ['help', 'history'].map(id => ({
        element: document.getElementById(`${id}Modal`),
        button: document.getElementById(`${id}Button`),
        close: document.querySelector(`#${id}Modal .close-button`)
      }));
  
      modals.forEach(({ element, button, close }) => {
        button.addEventListener('click', () => this.openModal(element));
        close.addEventListener('click', () => this.closeModal(element));
        element.addEventListener('click', (e) => {
          if (e.target === element) this.closeModal(element);
        });
      });
  
      // Keypad
      document.querySelectorAll('.key').forEach(key => {
        key.addEventListener('click', () => {
          const type = key.getAttribute('data-type');
          const value = key.textContent;
  
          switch (type) {
            case 'number':
              this.appendNumber(value);
              break;
            case 'operator':
              this.appendOperator(value);
              break;
            case 'equals':
              this.calculate();
              break;
            case 'clear':
              this.clear();
              break;
          }
        });
      });
  
      // Scroll to Top
      const scrollTop = document.getElementById('scrollTop');
      window.addEventListener('scroll', () => {
        scrollTop.classList.toggle('hidden', window.scrollY < 200);
      });
      scrollTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  
    appendNumber(number) {
      const display = this.display.textContent;
      if (display === '0' && number !== '.') {
        this.display.textContent = number;
      } else {
        this.display.textContent += number;
      }
      this.animateDisplay();
    }
  
    appendOperator(operator) {
      this.display.textContent += operator;
      this.animateDisplay();
    }
  
    clear() {
      this.display.textContent = '0';
      this.previousResult.textContent = '';
      this.animateDisplay();
    }
  
    calculate() {
      try {
        const expression = this.display.textContent
          .replace(/×/g, '*')
          .replace(/÷/g, '/');
        
        // Handle special operations
        const processedExpression = this.handleSpecialOperations(expression);
        
        // Use Function constructor instead of eval for better security
        const result = Number(Function('"use strict";return (' + processedExpression + ')')());
        
        // Update display and history
        this.previousResult.textContent = this.display.textContent;
        this.display.textContent = result.toString();
        this.addToHistory(this.previousResult.textContent, result.toString());
        this.animateDisplay();
      } catch (error) {
        this.display.textContent = 'Error';
        this.animateDisplay();
      }
    }
  
    handleSpecialOperations(expression) {
      let processed = expression;
      
      // Handle percentage
      processed = processed.replace(/(\d+)%/g, '($1/100)');
      
      // Handle square root
      processed = processed.replace(/√(\d+)/g, 'Math.sqrt($1)');
      
      // Handle power
      processed = processed.replace(/(\d+)\^(\d+)/g, 'Math.pow($1,$2)');
      
      return processed;
    }
  
    addToHistory(expression, result) {
      this.history.unshift({ expression, result });
      this.updateHistoryDisplay();
    }
  
    updateHistoryDisplay() {
      const historyList = document.getElementById('historyList');
      historyList.innerHTML = this.history
        .map(({ expression, result }) => `
          <div class="history-item" onclick="calculator.useHistoryItem('${result}')">
            <div class="history-expression">${expression}</div>
            <div class="history-result">${result}</div>
          </div>
        `)
        .join('');
    }
  
    useHistoryItem(result) {
      this.display.textContent = result;
      this.closeModal(document.getElementById('historyModal'));
    }
  
    openModal(modal) {
      modal.classList.add('active');
    }
  
    closeModal(modal) {
      modal.classList.remove('active');
    }
  
    animateDisplay() {
      this.display.classList.remove('animate-fade-in');
      void this.display.offsetWidth; // Force reflow
      this.display.classList.add('animate-fade-in');
    }
  }
  
  // Initialize calculator
  const calculator = new Calculator();
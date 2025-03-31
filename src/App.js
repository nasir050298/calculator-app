import React, { useState } from 'react';
import './App.css';

function App() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [decimalPrecision, setDecimalPrecision] = useState(4); // Set decimal precision

  // Handle button click
  const handleButtonClick = (value) => {
    // If the value is a trigonometric function or sqrt, ensure the parentheses are added
    if (['sin', 'cos', 'tan', 'log', 'ln', 'sqrt'].includes(value)) {
      // Prevent adding multiple parentheses if one already exists
      if (input && !input.includes('(')) {
        setInput(input + value + '(');
      } else {
        setInput(input + value);
      }
    } else {
      setInput(input + value);
    }
  };

  // Handle clear
  const handleClear = () => {
    setInput('');
    setResult('');
  };

  // Exponentiation (^)
  const handleExponentiation = () => {
    try {
      // Replace ^ with ** for exponentiation
      let formattedInput = input.replace(/\^/g, '**');
      // Now safely evaluate the expression with ** for exponentiation
      let evaluatedResult = eval(formattedInput);
      setResult(evaluatedResult.toFixed(decimalPrecision));
      setInput('');
    } catch (e) {
      setResult('Error');
      setInput('');
    }
  };

  // Factorial
  const handleFactorial = () => {
    try {
      const num = parseInt(input);
      if (num < 0) throw new Error("Factorial is not defined for negative numbers.");
      let factorial = 1;
      for (let i = 1; i <= num; i++) {
        factorial *= i;
      }
      setResult(factorial.toString());
      setInput('');
    } catch (e) {
      setResult('Error');
      setInput('');
    }
  };

  // Percentage Calculation
  const handlePercentage = () => {
    try {
      const percentage = parseFloat(input);
      const resultPercentage = percentage / 100;
      setResult(resultPercentage.toFixed(decimalPrecision));
      setInput('');
    } catch (e) {
      setResult('Error');
      setInput('');
    }
  };

  // Evaluate the expression
  const handleEvaluate = () => {
    try {
      // Preprocess the input to fix any scientific function that doesn't have parentheses
      let formattedInput = input.replace(/\^/g, '**'); // Exponentiation fix

      // Convert functions like sin30 to sin(30)
      formattedInput = formattedInput.replace(/([a-zA-Z]+)(\d+)/g, '$1($2)'); 

      // Replace sin, cos, tan, etc. with Math equivalents for evaluation
      formattedInput = formattedInput.replace(/sin\(/g, "Math.sin("); 
      formattedInput = formattedInput.replace(/cos\(/g, "Math.cos("); 
      formattedInput = formattedInput.replace(/tan\(/g, "Math.tan("); 
      formattedInput = formattedInput.replace(/log\(/g, "Math.log10("); 
      formattedInput = formattedInput.replace(/ln\(/g, "Math.log("); 
      formattedInput = formattedInput.replace(/sqrt\(/g, "Math.sqrt(");

      // Convert degree inputs to radians for sin, cos, tan
      formattedInput = formattedInput.replace(/Math\.(sin|cos|tan)\((\d+)\)/g, (match, func, num) => {
        // Convert degrees to radians
        return `Math.${func}(${num} * (Math.PI / 180))`;
      });
      
      // Now safely evaluate the expression
      let evalResult = eval(formattedInput); 
      setResult(evalResult.toFixed(decimalPrecision)); // Show result with precision
      setInput('');
    } catch (e) {
      setResult('Error');
      setInput('');
    }
  };

  // Handle keyboard events for user input
  const handleKeyDown = (event) => {
    if ((event.key >= '0' && event.key <= '9') || ['+', '-', '*', '/', '.', 'Enter'].includes(event.key)) {
      event.preventDefault();
      handleButtonClick(event.key);
    } else if (event.key === 'Backspace') {
      setInput(input.slice(0, -1));
    }
  };

  // Listen for keyboard input
  React.useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [input]);

  return (
    <div className="calculator-container">
      <div className="calculator">
        <div className="display">
          <input
            type="text"
            value={input}
            placeholder="0"
            readOnly
            className="input"
          />
          {result && <div className="result">{result}</div>}
        </div>
        <div className="buttons">
          <button className="button clear" onClick={handleClear}>AC</button>

          <button className="button scientific" onClick={() => handleButtonClick('sin')}>sin</button>
          <button className="button scientific" onClick={() => handleButtonClick('cos')}>cos</button>
          <button className="button scientific" onClick={() => handleButtonClick('tan')}>tan</button>
          <button className="button scientific" onClick={() => handleButtonClick('sqrt')}>√</button>
          <button className="button scientific" onClick={() => handleButtonClick('log')}>log</button>
          <button className="button scientific" onClick={() => handleButtonClick('ln')}>ln</button>
          <button className="button" onClick={handleFactorial}>n!</button>

          <button className="button" onClick={() => handleButtonClick('+')}>+</button>
          <button className="button" onClick={() => handleButtonClick('-')}>-</button>
          <button className="button" onClick={() => handleButtonClick('*')}>*</button>
          <button className="button" onClick={() => handleButtonClick('/')}>/</button>

          <button className="button" onClick={() => handleButtonClick('7')}>7</button>
          <button className="button" onClick={() => handleButtonClick('8')}>8</button>
          <button className="button" onClick={() => handleButtonClick('9')}>9</button>
          <button className="button" onClick={() => handleButtonClick('^')}>^</button>

          <button className="button" onClick={() => handleButtonClick('4')}>4</button>
          <button className="button" onClick={() => handleButtonClick('5')}>5</button>
          <button className="button" onClick={() => handleButtonClick('6')}>6</button>
          <button className="button" onClick={handlePercentage}>%</button>

          <button className="button" onClick={() => handleButtonClick('1')}>1</button>
          <button className="button" onClick={() => handleButtonClick('2')}>2</button>
          <button className="button" onClick={() => handleButtonClick('3')}>3</button>
          <button className="button" onClick={() => handleButtonClick('')}></button>
          
          <button className="button" onClick={() => handleButtonClick('0')}>0</button>
          <button className="button" onClick={() => handleButtonClick('.')}>.</button>
          <button className="button" onClick={handleEvaluate}>=</button>
        </div>
      </div>
    </div>
  );
}

export default App;

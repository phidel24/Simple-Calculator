import { useState, useEffect, useMemo, useCallback } from 'react';
import { evaluate } from 'mathjs';

function App() {
	const [calc, setCalc] = useState("");
	const [result, setResult] = useState("");

	const ops = useMemo(() => ['/', '*', '+', '-', '.'], []);

	const updateCalc = useCallback((value) => {
		if ((ops.includes(value) && calc === '') ||
			(ops.includes(value) && ops.includes(calc.slice(-1)))) {
			return;
		}
	
		if (value === '.' && calc.split(/[+\-*/]/).pop().includes('.')) {
			return;
		}
	
		setCalc((prevCalc) => prevCalc + value);
	
		if (!ops.includes(value)) {
			setResult(evaluate(calc + value).toString());
		}
	}, [calc, ops]);
	
	const calculate = useCallback(() => {
		try {
			setCalc((prevCalc) => evaluate(prevCalc).toString());
		} catch (error) {
			alert("Invalid expression");
		}
	}, []);
	
	const deleteLast = useCallback(() => {
		setCalc((prevCalc) => prevCalc.slice(0, -1));
	}, []);

	const clearAll = () => {
		setCalc("");
		setResult("");
	};

	const createDigits = () => {
		return [...Array(10).keys()].map((i) => (
			<button key={i} onClick={() => updateCalc(i.toString())}>
				{i}
			</button>
		));
	};

	useEffect(() => {
		const handleKeyPress = (event) => {
			const { key } = event;
			if ((/\d/.test(key) || ops.includes(key) || key === '.') && key.length === 1) {
				updateCalc(key);
			} else if (key === 'Enter') {
				calculate();
			} else if (key === 'Backspace') {
				deleteLast();
			} else if (key === 'Escape') {
				clearAll();
			}
		};

		window.addEventListener('keydown', handleKeyPress);
		return () => window.removeEventListener('keydown', handleKeyPress);
	}, [calculate, deleteLast, ops, updateCalc]);

	return (
		<div className="App">
			<div className="calculator">
				<div className="display">
					{result ? <span>({result})</span> : ''} {calc || '0'}
				</div>

				<div className="operators">
					{ops.map((op) => (
						<button key={op} onClick={() => updateCalc(op)}>
							{op}
						</button>
					))}
					<button onClick={deleteLast}>DEL</button>
					<button onClick={clearAll}>AC</button>
				</div>

				<div className="digits">
					{createDigits()}
					<button onClick={() => updateCalc('.')}>.</button>
					<button onClick={calculate}>=</button>
				</div>
			</div>
		</div>
	);
}

export default App;

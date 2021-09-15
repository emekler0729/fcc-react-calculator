import React from 'react';
import Display from './Display'

/*
  TODO: 
    -Add keypress handling for numpad
    -Make it mobile responsive
    -Handle rounding
    -Handle Digit Overflow & Expression Wrapping
*/

class Calculator extends React.Component {
    constructor(props) {
        super(props);

        this.clearState = {
            currentValue: '0',
            expression: '',
            lastAction: null
        }

        this.errorState = {
            currentValue: 'ERROR',
            expression: '',
            lastAction: null
        }

        this.buttonDefinitions = [
            [
                'zero',
                'one',
                'two',
                'three',
                'four',
                'five',
                'six',
                'seven',
                'eight',
                'nine'
            ],
            { symbol: '=', id: 'equals' },
            { symbol: '+', id: 'add' },
            { symbol: '-', id: 'subtract' },
            { symbol: '*', id: 'multiply' },
            { symbol: '/', id: 'divide' },
            { symbol: '.', id: 'decimal' },
            { symbol: 'C', id: 'clear' },
        ]

        this.state = this.clearState;

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(event) {
        switch (event.target.id) {
            case 'clear':
                this.clear();
                break;
            case 'equals':
                this.calculate();
                break;
            case 'add':
            case 'subtract':
            case 'multiply':
            case 'divide':
                this.handleOperator(event.target.value);
                break;
            default:
                this.handleNumber(event.target.value);
        }
    }

    clear() {
        this.setState(this.clearState);
    }

    error() {
        this.setState(this.errorState);
        setTimeout(() => {
            this.clear();
        }, 1000);
    }

    calculate() {
        this.setState(state => {
            if (state.lastAction !== 'equals' && state.lastAction !== null) {
                let result;
                try {
                    result = new Function(`'use strict'; return ${state.expression.replace('--', '- -')};`)();

                } catch {
                    this.error();
                }
                return {
                    currentValue: result,
                    expression: `${state.expression}=${result}`,
                    lastAction: 'equals'
                };
            } else {
                return state;
            }
        })
    }

    handleOperator(operator) {
        function createState(expression, lastAction) {
            return {
                currentValue: operator,
                expression,
                lastAction
            }
        }

        this.setState(state => {
            switch (state.lastAction) {
                case null:
                    if (operator === '-') {
                        return createState(operator, 'negative');
                    }
                    break;
                case 'negative':
                    if (operator !== '-') {
                        if (state.expression.startsWith('-')) {
                            return createState(`0${operator}`, 'operator');
                        } else {
                            return createState(`${state.expression.replace(/[-/*+]-*$/, operator)}`, 'operator');
                        }
                    }
                    break;
                case 'operator':
                    if (operator === '-') {
                        return createState(`${state.expression + operator}`, 'negative');
                    } else {
                        return createState(`${state.expression.replace(/[-/*+]-*$/, operator)}`, 'operator')
                    }
                default:
                    return createState(`${state.expression + operator}`, 'operator');
            }
        })
    }

    handleNumber(number) {
        this.setState(state => {
            let newState = {};

            if (state.currentValue === '0' || state.lastAction === 'equals') {
                number = number === '.' ? '0.' : number;
                newState = {
                    currentValue: number,
                    expression: number
                };
            } else {
                number = number === '.' && state.currentValue.includes('.') ? '' : number;
                newState = {
                    currentValue: state.currentValue.replace(/^[-/+*]/, '') + number,
                    expression: state.expression + number
                };
            }

            newState.lastAction = 'number';
            return newState;
        });
    }

    render() {
        const buttonComponents = makeButtons(this.buttonDefinitions, this.handleClick);

        return (
            <div className="calculator">
                <Display currentValue={this.state.currentValue} expression={this.state.expression}></Display>
                {buttonComponents}
            </div>
        )
    }
}

function makeButtons(definitions, handleClick) {
    function makeButtonJSX(id, symbol) {
        return <button className="button" key={id} id={id} value={symbol} onClick={handleClick}>{symbol}</button>;
    }
    const buttons = definitions.reduce((components, definition) => {
        if (Array.isArray(definition)) {
            definition.forEach((number, index) => {
                components.push(makeButtonJSX(number, index));
            });
        } else {
            components.push(makeButtonJSX(definition.id, definition.symbol));
        }

        return components;
    }, []);

    return buttons;
}

export default Calculator;
import React from 'react';
import Display from './Display'

/*
  TODO: 
    -Handle Leading & Trailing Operators in Calculation
    -Add keypress handling for numpad
    -Make it mobile responsive
    -Handle rounding
    -Handle Digit Overflow & Expression Wrapping
*/

class Calculator extends React.Component {
    constructor(props) {
        super(props);

        this.clearState = {
            expression: '',
            currentValue: '0',
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

    calculate() {
        this.setState(state => {
            const EXPRESSION = state.expression.replace('--', '- -');
            if (state.lastAction !== 'equals' && state.lastAction !== null) {
                let result;
                try {
                    result = new Function(`'use strict'; return ${EXPRESSION};`)();

                } catch {
                    return this.clearState;
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

    /*
        Last Action was operator:
            If the operator is not minus then replace previous operators (including combined negative operator)
            Else it is negative unary operator. Concatenate it if it isn't already present.
        Else
            If the last action was equals bring over the result as the new expression and set operator
            Else (number or null) add the operator

        The missing case? The very first operator was set to negative then it should not treat it like an operator was set.
    */
    handleOperator(operator) {
        this.setState(state => {
            if (state.lastAction === null && operator !== '-') return state;

            let newState = {};
            newState.currentValue = operator;

            if (state.lastAction === 'operator') {
                if (operator !== '-') {
                    newState.expression = state.expression.replace(/[/*+]*[-/*+]$/, operator);
                } else {
                    if (!state.expression.endsWith('--')) {
                        newState.expression = state.expression + operator;
                    }
                }
            } else {
                if (state.lastAction === 'equals') {
                    newState.expression = state.currentValue + operator;
                } else {
                    newState.expression = state.expression + operator;
                }
            }

            newState.lastAction = 'operator';
            return newState;
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
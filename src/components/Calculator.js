import React from 'react';
import Display from './Display'

/*
  TODO: 
    -Make it mobile responsive
    -Handle rounding
    -Handle Digit Overflow & Expression Wrapping
    -Prettify buttons
*/

// Create State Object shorthand notation
function createState(currentValue, expression, lastAction) {
    return {
        currentValue,
        expression,
        lastAction
    }
}

// Enumerations for actions, operators, and decimal
const ACTION = {
    CLEAR: null,
    ERROR: 'error',
    OPERATOR: 'operator',
    NEGATIVE: 'negative',
    CALCULATION: 'equals',
    NUMBER: 'number'
};

const OPERATOR = {
    SUBTRACT: '-',
    ADD: '+',
    MULTIPLY: '*',
    DIVIDE: '/',
    CALCULATE: '=',
    CLEAR: 'C'
};

const DECIMAL = '.';

// Clear & error state constants
const CLEAR_STATE = createState('0', '', ACTION.CLEAR);
const ERROR_STATE = createState('ERROR', '', ACTION.ERROR);

const BUTTON_DEFINITIONS = [
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
    { symbol: OPERATOR.CALCULATE, id: 'equals' },
    { symbol: OPERATOR.ADD, id: 'add' },
    { symbol: OPERATOR.SUBTRACT, id: 'subtract' },
    { symbol: OPERATOR.MULTIPLY, id: 'multiply' },
    { symbol: OPERATOR.DIVIDE, id: 'divide' },
    { symbol: OPERATOR.CLEAR, id: 'clear' },
    { symbol: DECIMAL, id: 'decimal' },
]

class Calculator extends React.Component {
    constructor(props) {
        super(props);

        this.state = CLEAR_STATE;

        this.handleClick = this.handleClick.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
    }

    componentDidMount() {
        document.addEventListener('keydown', this.handleKeyPress);
    }

    componentWillUnmount() {
        document.addEventListener('keydown', this.handleKeyPress);
    }

    handleClick(event) {
        switch (event.target.value) {
            case OPERATOR.CLEAR:
                this.clear();
                break;
            case OPERATOR.CALCULATE:
                this.calculate();
                break;
            case OPERATOR.ADD:
            case OPERATOR.SUBTRACT:
            case OPERATOR.MULTIPLY:
            case OPERATOR.DIVIDE:
                this.handleOperator(event.target.value);
                break;
            default:
                this.handleNumber(event.target.value);
        }
    }

    handleKeyPress(event) {
        // F keys,  any key that is not a calculator value, or Control / Caps Lock
        const INVALID_KEYS = /^F\d{1,2}|[^-1234567890./*+=C]+|^C.+/

        const CLEAN_KEY = event.key.replace('Enter', OPERATOR.CALCULATE)
            .replace('Escape', OPERATOR.CLEAR)
            .replace(INVALID_KEYS, '');

        CLEAN_KEY && this.handleClick({ target: { value: CLEAN_KEY } });
    }

    clear() {
        this.setState(CLEAR_STATE);
    }

    error() {
        this.setState(ERROR_STATE);
        setTimeout(() => {
            this.clear();
        }, 600);
    }

    calculate() {
        this.setState(state => {
            if (state.lastAction !== ACTION.CALCULATION && state.lastAction !== ACTION.CLEAR) {
                let result;
                try {
                    // eslint-disable-next-line
                    result = Math.round(10000000000 * eval(state.expression.replace(/--/g, '- -'))) / 10000000000;

                } catch {
                    this.error();
                }
                return createState(result, `${state.expression}=${result}`, ACTION.CALCULATION);
            } else {
                return state;
            }
        })
    }

    handleOperator(operator) {
        const makeState = createState.bind(null, operator);

        this.setState(state => {
            switch (state.lastAction) {
                case ACTION.CLEAR:
                    if (operator === OPERATOR.SUBTRACT) {
                        return makeState(operator, ACTION.NEGATIVE);
                    }
                    break;
                case ACTION.NEGATIVE:
                    if (operator !== OPERATOR.SUBTRACT) {
                        if (state.expression.startsWith(OPERATOR.SUBTRACT)) {
                            return makeState(`0${operator}`, ACTION.OPERATOR);
                        } else {
                            return makeState(`${state.expression.replace(/[-/*+]-*$/, operator)}`, ACTION.OPERATOR);
                        }
                    }
                    break;
                case ACTION.OPERATOR:
                    if (operator === OPERATOR.SUBTRACT) {
                        return makeState(`${state.expression + operator}`, ACTION.NEGATIVE);
                    } else {
                        return makeState(`${state.expression.replace(/[-/*+]-*$/, operator)}`, ACTION.OPERATOR)
                    }
                case ACTION.CALCULATION:
                    return makeState(`${state.currentValue + operator}`, ACTION.OPERATOR);
                default:
                    return makeState(`${state.expression + operator}`, ACTION.OPERATOR);
            }
        })
    }

    handleNumber(number) {
        this.setState(state => {
            if (state.currentValue === CLEAR_STATE.currentValue || state.lastAction === ACTION.CALCULATION) {
                number = number === DECIMAL ? '0.' : number;
                return createState(number, number, ACTION.NUMBER);
            } else {
                number = number === DECIMAL && state.currentValue.includes(DECIMAL) ? '' : number;
                return createState(
                    state.currentValue.replace(/^[-/+*]/, '') + number,
                    state.expression + number,
                    ACTION.NUMBER
                );
            }
        });
    }

    render() {
        const buttonComponents = makeButtons(BUTTON_DEFINITIONS, this.handleClick);

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
        return <button
            className="button"
            key={id}
            id={id}
            value={symbol}
            onClick={handleClick}
        >
            {symbol}
        </button>;
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
import React from 'react';
import Display from './Display'

/*
  TODO: 
    -Handles Expression trimming
    -Prettify buttons
*/

// Create State Object shorthand notation
function createState(currentValue, expression, lastAction) {
    let expressionDisplay = expression;

    if (expressionDisplay.toString().length > MAX_LENGTH.EXPRESSION) {
        expressionDisplay = expressionDisplay.slice(-MAX_LENGTH.EXPRESSION + 3).padStart(MAX_LENGTH.EXPRESSION, '.');
    }
    return {
        currentValue,
        expression,
        lastAction,
        expressionDisplay
    }
}

// Enumerations for actions, operators, decimal, and max length
const ACTION = {
    CLEAR: null,
    ERROR: 'error',
    OPERATOR: 'operator',
    NEGATIVE: 'negative',
    CALCULATION: 'equals',
    NUMBER: 'number',
    OVERFLOW: 'overflow'
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

/*
    This is very crude currently and may break if the font or element sizing is modified.
    On mobile, the max length of display current value is 11 characters & 68 characters for the expression.
    On desktop, the max length of display current value is 12 characters & 76 characters for the expression.
*/
const MAX_LENGTH = {
    CURRENT_VALUE: 11,
    EXPRESSION: 68
}

// Clear & error state constants
const CLEAR_STATE = createState('0', '', ACTION.CLEAR);

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
        document.removeEventListener('keydown');
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

        console.log(CLEAN_KEY);

        CLEAN_KEY && this.handleClick({ target: { value: CLEAN_KEY } });
    }

    clear() {
        this.setState(CLEAR_STATE);
    }

    error(message, state) {
        const HANDLER = this.handleClick;
        this.handleClick = () => null;

        this.setState(createState('ERROR', message, ACTION.ERROR));
        setTimeout(() => {
            this.handleClick = HANDLER;
            state ? this.setState(state) : this.clear();
        }, 1000);
    }

    calculate() {
        function round(result) {
            const LEADING_DIGITS = result.toString().indexOf(DECIMAL);
            if (LEADING_DIGITS === -1) return result;

            const SIGNIFICANT_DIGITS = MAX_LENGTH.CURRENT_VALUE - (LEADING_DIGITS + 1);
            const ROUND_FACTOR = Number.parseInt('1'.padEnd(SIGNIFICANT_DIGITS + 1, '0'));

            return Math.round(result * ROUND_FACTOR) / ROUND_FACTOR;
        }
        this.setState(state => {
            if (state.lastAction !== ACTION.CALCULATION && state.lastAction !== ACTION.CLEAR) {
                let result;
                try {
                    // eslint-disable-next-line
                    result = round(eval(state.expression.replace(/--/g, '- -')));
                    if (result.toString().length > MAX_LENGTH.CURRENT_VALUE) this.error('OVERFLOW');
                } catch {
                    this.error('INVALID EXPRESSION');
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
                const NEXT_VALUE = state.currentValue.replace(/^[-/+*]/, '') + number;
                if (NEXT_VALUE.toString().length > MAX_LENGTH.CURRENT_VALUE) this.error('MAX DIGITS', state);
                return createState(
                    NEXT_VALUE,
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
                <Display currentValue={this.state.currentValue} expression={this.state.expressionDisplay}></Display>
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
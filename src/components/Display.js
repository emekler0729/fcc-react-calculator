import React from 'react';

const Display = props => {
    return (
        <div className="display">
            <div id="currentValue">{props.currentValue}</div>
            <div id="expression">{props.expression}</div>
        </div>
    )
}

export default Display;
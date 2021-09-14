import React from 'react';
import ReactDOM from 'react-dom';
import Calculator from './components/Calculator';

if (module.hot) module.hot.accept();

const App = () => {
    return (
        <div>
            <Calculator />
        </div>
    )
}

ReactDOM.render(
    <App />,
    document.querySelector('#root')
)
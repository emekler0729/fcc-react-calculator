import React from 'react';
import ReactDOM from 'react-dom';
import Calculator from './components/Calculator';
import './scss/index.scss';

if (module.hot) module.hot.accept();

const App = () => {
    return (
        <div>
            <Calculator />
            <footer>
                <p>Designed and Developed by <a href="https://www.eduard-mekler.com">Eduard Mekler</a></p>
            </footer>
        </div>
    )
}

ReactDOM.render(
    <App />,
    document.querySelector('#root')
)
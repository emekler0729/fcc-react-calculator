import React from 'react';
import ReactDOM from 'react-dom';

if (module.hot) module.hot.accept();

const App = () => <h1>React Setup</h1>

ReactDOM.render(
    <App />,
    document.querySelector('#root')
)
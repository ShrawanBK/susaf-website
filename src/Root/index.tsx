import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import App from './App';

interface Props {
}

function Root(props: Props) {
    return (
        <Router>
            <App {...props} />
        </Router>
    );
}

export default Root;

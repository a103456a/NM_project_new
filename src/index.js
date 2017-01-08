import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, hashHistory, IndexRoute } from 'react-router';
import App from './components/App';
import Home from './components/Home';


const routes = (
    <Route path="/" component={App}>
        <IndexRoute component={Home} />
    </Route>
);

ReactDOM.render(
    <Router routes={routes} history={hashHistory} />,
    document.getElementById('app')
);


// <Route path="/repos/:name" component={Repos} />
import React from 'react';
import { Link, IndexLink } from 'react-router';
import styles from './appStyles';
import NavLink from '../NavLink';

const App = (props) => (
    <div>
        <nav className="nav-extended">
            <div className="nav-wrapper">
                <ul className="tabs tabs-transparent">
                    <li className="tab"><IndexLink to="/" activeClassName="active">Home</IndexLink></li>
                    <li className="tab"><Link to="/about" activClassName="active">About</Link></li>
                    <li className="tab"><NavLink to="/contacts" activeClassName="active">Contacts</NavLink></li>
                </ul>
            </div>
        </nav>
        {props.children}
    </div>
);

App.propTypes = {
    children: React.PropTypes.object,
};

export default App;
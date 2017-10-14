import React from 'react';
// import { BrowserRouter, Route } from 'react-router-dom';
import AppState from './state/AppState';
// import styles
import './resources/styles/base.scss';
// import components
import PageTransition from './modules/PageTransition/PageTransition';
import Route from './modules/Route/Route';
// import pages
import Home from './pages/Home';
import Test from './pages/Test';


// create global state
const appState = new AppState();

export default class Routes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      routes: [
        <Route exact path="/" key="Home" component={() => <Home state={appState} />} />,
        <Route exact path="/test" key="Test" component={() => <Test state={appState} />} />,
      ],
    };
  }

  // enterPageAnimation={{ animation: { opacity: [1, 0], translateX: ['0%', '100%'] }, duration: 500 }}
  // exitPageAnimation={{ animation: { opacity: 0, translateX: '-100%' }, duration: 500 }}

  render() {
    const animationObject = {
      pop: {
        enter: { animation: { opacity: [1, 0], translateX: ['0%', '100%'] }, duration: 500 },
        exit: { animation: { opacity: [0, 1], translateX: ['-100%', '0%'] }, duration: 500 },
      },
      push: {
        enter: { animation: { opacity: [1, 0], translateX: ['0%', '-100%'] }, duration: 500 },
        exit: { animation: { opacity: [0, 1], translateX: ['100%', '0%'] }, duration: 500 },
      },
    };

    return (
      <div id="app-container">
        <PageTransition
          routes={this.state.routes}
          animations={animationObject}
        />
      </div>
    );
  }
}

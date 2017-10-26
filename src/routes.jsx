import React from 'react';
import AppState from './state/AppState';
// import components
// import { PageTransition, Route } from 'react-transition-router';
import { PageTransition, Route, History } from '../react-transition-router';
// import pages
import Home from './pages/Home';
import Test from './pages/Test';
import Modal from './pages/Modal';

// create global state
const appState = new AppState();

export default class Routes extends React.Component {
  constructor(props) {
    super(props);

    // console.log('transitioner', PageTransition);
    //
    // const animationObject = {
    //   load: { animation: { opacity: [1, 0], translateY: ['0%', '100%'] }, duration: 500 },
    //   pop: {
    //     enter: { animation: { opacity: [1, 0], translateX: ['0%', '100%'] }, duration: 500 },
    //     exit: { animation: { opacity: [0, 1], translateX: ['-100%', '0%'] }, duration: 500 },
    //   },
    //   push: {
    //     enter: { animation: { opacity: [1, 0], translateX: ['0%', '-100%'] }, duration: 500 },
    //     exit: { animation: { opacity: [0, 1], translateX: ['100%', '0%'] }, duration: 500 },
    //   },
    // };

    this.state = {
      routes: [
        <Route path="/" key="Home" component={() => <Home state={appState} />} />,
        <Route path="/mytest" key="Test" component={() => <Test state={appState} />} />,
        <Route append path="/test/" key="modal" component={() => <Modal state={appState} />} />,
        // <Route path="/test/" key="TestIt" component={parameters => <Test parameters={parameters} state={appState} />} />,
      ],
    };
  }

  render() {
    const animationObject = {
      load: { animation: { opacity: [1, 0], translateY: ['0vh', '100vh'] }, duration: 1000 },
      pop: {
        enter: { animation: { opacity: [1, 0], translateY: ['0px', '20px'], rotateX: ['0deg', '15deg'], scale: [1, 0.98] }, duration: 500 },
        exit: { animation: { opacity: [0, 1], translateY: ['-20px', '0px'], rotateX: ['15deg', '0deg'], scale: [0.98, 1] }, duration: 500 },
      },
      push: {
        enter: { animation: { opacity: [1, 0], translateY: ['0px', '-20px'], rotateX: ['0deg', '15deg'], scale: [1, 0.98] }, duration: 500 },
        exit: { animation: { opacity: [0, 1], translateY: ['20px', '0px'], rotateX: ['15deg', '0deg'], scale: [0.98, 1] }, duration: 500 },
      },
    };

    return (
      <div id="app-container">
        <button onClick={() => { History.push('/test/modal'); }} />
        <PageTransition
          routes={this.state.routes}
          loadAnimationName="load"
          serialize={false}
        />
      </div>
    );
  }
}

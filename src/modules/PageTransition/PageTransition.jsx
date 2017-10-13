import React from 'react';
import PropTypes from 'prop-types';
import { VelocityTransitionGroup } from 'velocity-react';
// import { Router, Route } from 'react-router-dom';
import createHistory from 'history/createBrowserHistory';
import AppState from '../../state/AppState';

// scss
import './PageTransition.scss';

// Wrapper element for the pages
class Route extends React.Component {
  render() {
    return this.props.component();
  }
}

Route.propTypes = {
  path: PropTypes.string.isRequired,
  component: PropTypes.func.isRequired,
  exact: PropTypes.bool,
};

// Class defining the actual transitions
class PageTransition extends React.Component {
  constructor(props) {
    super(props);
    this.setDefaults();
  }

  componentDidMount() {
    this.setBinds();
    this.setRoutes()
      .then(() => {
        this.setPageForRoute(this.state.currentRoute);
        console.log(this.state.currentPage);
      });
  }

  setDefaults() {
    this.state = {
      routes: {},
      currentRoute: window.location.pathname,
      prevRoute: null,
      currentPage: null,
    };
    this.history = createHistory();
  }

  setBinds() {
    // window.addEventListener('popstate', this.historyChange.bind(this));
    this.history.listen(this.historyChange.bind(this));

    // let home = true;
    // setInterval(() => {
    //   // this.history.push('/test');
    //   console.log(history);
    //   home = !home;
    // }, 2000);
  }

  setRoutes() {
    return new Promise((resolve) => {
      const routes = {};
      for (let i = 0; i < this.props.routes.length; i+=1) {
        const routeItem = this.props.routes[i];
        routes[routeItem.props.path] = routeItem;
      }

      this.setState({ routes }, resolve);
    });
  }

  setPageForRoute(route) {
    const page = this.getPageForRoute(route);
    this.setState({ currentPage: page });
  }

  getPageForRoute(path) {
    const page = this.state.routes[path];
    if (typeof page === 'object') {
      return page;
    } else {
      return null;
    }
  }

  historyChange(location, action) {
    this.goToRoute(location.pathname);
    switch (action) {
      case 'PUSH':
        break;
      case 'POP':
        break;
      default:
        break;
    }
    console.log(location, action);
  }

  goToRoute(route) {
    this.routeWillChange(route);
  }

  routeWillChange(route) {
    console.log('route will change');

    // Notify parent if needed
    if (typeof this.props.routeWillChange === 'function') {
      this.props.routeWillChange(route);
    }

    // Set current route and previous route.
    //  currentPage is set to null so the transition out will begin.
    this.setState({
      currentRoute: route,
      prevRoute: this.state.currentRoute,
      currentPage: null,
    });
  }

  routeDidChange() {
    console.log('route did change');
    // Notify parent if needed
    if (typeof this.props.routeDidChange === 'function') {
      this.props.routeDidChange(route);
    }
  }

  enterPageComplete() {
    console.log('enter page complete');
    this.routeDidChange();
  }

  exitPageComplete() {
    console.log('exit page complete');
    this.setState({ currentPage: this.getPageForRoute(this.state.currentRoute) });
  }

  render() {
    // const enterStartStyles = this.props.enterPageStartStyles || { opacity: 1 };
    // const enterEndStyles = this.props.enterPageEndStyles || { opacity: 1 };
    // const exitStartStyles = this.props.exitPageStartStyles || { opacity: 1 };
    // const exitEndStyles = this.props.exitPageEndStyles || { opacity: 1 };
    const newEnterAnimation = this.props.enterPageAnimation || { animation: { opacity: 1 }, duration: 0 };
    const newExitAnimation = this.props.exitPageAnimation || { animation: { opacity: 1 }, duration: 0 };
    newEnterAnimation.complete = this.enterPageComplete.bind(this);
    newExitAnimation.complete = this.exitPageComplete.bind(this);

    return (
      <div className="page-transition">
        <VelocityTransitionGroup
          enter={newEnterAnimation}
          leave={newExitAnimation}
          runOnMount
        >
          {this.state.currentPage}
        </VelocityTransitionGroup>
      </div>
    );
  }
}

PageTransition.propTypes = {
  routes: PropTypes.array.isRequired,
  routeWillChange: PropTypes.func,
  routeDidChange: PropTypes.func,
  enterPageAnimation: PropTypes.object,
  exitPageAnimation: PropTypes.object,
  enterPageStartStyles: PropTypes.object,
  enterPageEndStyles: PropTypes.object,
  exitPageStartStyles: PropTypes.object,
  exitPageEndStyles: PropTypes.object,
  // exitPageStartAnimation: PropTypes.object,
  // exitPageEndAnimation: PropTypes.object,
  // enterPageStartAnimation: PropTypes.object,
  // enterPageEndAnimation: PropTypes.object,
};

export {
  Route,
  PageTransition,
};

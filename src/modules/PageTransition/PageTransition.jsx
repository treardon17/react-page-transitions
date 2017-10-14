import React from 'react';
import PropTypes from 'prop-types';
import { VelocityTransitionGroup } from 'velocity-react';
import AppState from '../../state/AppState';
import History from '../../state/History';

// scss
import './PageTransition.scss';

// Class defining the actual transitions
export default class PageTransition extends React.Component {
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
    this.currentAction = '';
  }

  setBinds() {
    History.listen(this.historyChange.bind(this));
  }

  /**
   * setRoutes - Creates route object
   * Each route has a string path as a key, and a component (page)
   * as the value
   *
   * @return {void}
   */
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

  /**
   * setPageForRoute - Sets the current page
   *
   * @param  {String} route - the page that should be loaded
   * @return {void}
   */
  setPageForRoute(route) {
    const page = this.getPageForRoute(route);
    this.setState({ currentPage: page });
  }

  /**
   * getPageForRoute - Retrieves the requested page or null
   * if it doesn't exist
   *
   * @param  {type} path - the page that should be loaded
   * @return {Page} Page component
   */
  getPageForRoute(path) {
    const page = this.state.routes[path];
    if (typeof page === 'object') {
      return page;
    } else {
      return null;
    }
  }

  /**
   * historyChange - History callback function
   * Initiates page change
   *
   * @param  {Object} location - Window location object
   * @param  {String} action - PUSH or POP
   * @return {void}
   */
  historyChange(location, action) {
    this.goToRoute(location.pathname, action);
  }

  /**
   * goToRoute - Begin page transition to requested page
   *
   * @param  {String} route - Page to transition to
   * @param  {String} action - OPTIONAL for handling history PUSH or POP differently
   * @return {void}
   */
  goToRoute(route, action) {
    console.log('GOING TO ROUTE:', route, action);
    this.currentAction = action ? action.toLowerCase() : null;
    this.routeWillChange(route);
  }

  /**
   * routeWillChange - Function called before route changes.
   * Notifies parent if `routeWillChange` passed as prop
   *
   * @param  {String} route - Page to be loaded
   * @return {void}
   */
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

  /**
   * routeDidChange - Function called after route changed
   * Notifies parent if `routeDidChange` passed as prop
   *
   * @return {void}
   */
  routeDidChange() {
    console.log('route did change');
    // Notify parent if needed
    if (typeof this.props.routeDidChange === 'function') {
      this.props.routeDidChange(route);
    }
  }

  /**
   * enterPageComplete - Function called after page enter animation complete
   *
   * @return {void}
   */
  enterPageComplete() {
    console.log('enter page complete');
    this.routeDidChange();
  }

  /**
   * exitPageComplete - Function called after page finished exiting
   *
   * @return {type}  description
   */
  exitPageComplete() {
    console.log('exit page complete');
    this.setState({ currentPage: this.getPageForRoute(this.state.currentRoute) });
  }

  render() {
    const animations = this.props.animations[this.currentAction];
    let newEnterAnimation = { animation: { opacity: 1 }, duration: 0 };
    let newExitAnimation = { animation: { opacity: 1 }, duration: 0 };

    if (animations) {
      if (animations.enter) { newEnterAnimation = animations.enter; }
      if (animations.exit) { newExitAnimation = animations.exit; }
    }

    newEnterAnimation.complete = this.enterPageComplete.bind(this);
    newExitAnimation.complete = this.exitPageComplete.bind(this);

    return (
      <div className="page-transition">
        <button onClick={() => { History.push('/test'); }} />
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
  animations: PropTypes.object,
};

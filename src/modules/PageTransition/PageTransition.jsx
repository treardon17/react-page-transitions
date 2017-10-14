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
    this.routeDidChange();
  }

  /**
   * exitPageComplete - Function called after page finished exiting
   *
   * @return {type}  description
   */
  exitPageComplete() {
    this.setState({ currentPage: this.getPageForRoute(this.state.currentRoute) });
  }


  /**
   * createAnimations - Creates animations based on current action and load status
   *
   * @return {Object}  Object containing `enterAnimation` and `exitAnimation`
   */
  createAnimations() {
    const animations = this.props.animations;
    // Default animations
    let newEnterAnimation = animations ?
      { animation: { opacity: [0, 0] }, duration: 200 }
      :
      { animation: { opacity: 1 }, duration: 200 };

    let newExitAnimation = { animation: { opacity: 0 }, duration: 200 };
    // If we even have animations
    if (animations) {
      // If we're on the initial load
      if (this.currentAction === ''
        && this.props.loadAnimationName
        && animations[this.props.loadAnimationName]) {
        newEnterAnimation = animations[this.props.loadAnimationName];
      } else if (this.currentAction === History.directions.push.toLowerCase()
        || this.currentAction === History.directions.pop.toLowerCase()) {
        // If we're coming from a history action
        const actionAnimations = this.props.animations[this.currentAction];
        if (actionAnimations.enter) { newEnterAnimation = actionAnimations.enter; }
        if (actionAnimations.exit) { newExitAnimation = actionAnimations.exit; }
      }
    }

    // Set completion handlers
    newEnterAnimation.complete = this.enterPageComplete.bind(this);
    newExitAnimation.complete = this.exitPageComplete.bind(this);

    return {
      enterAnimation: newEnterAnimation,
      exitAnimation: newExitAnimation,
    };
  }

  render() {
    const { enterAnimation, exitAnimation } = this.createAnimations();

    return (
      <div className="page-transition">
        <button onClick={() => { History.push('/test'); }} />
        <VelocityTransitionGroup
          enter={enterAnimation}
          leave={exitAnimation}
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
  loadAnimationName: PropTypes.string,
};

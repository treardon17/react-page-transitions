import React from 'react';
import PropTypes from 'prop-types';

// scss
import './Route.scss';

export default class Route extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return this.props.component();
  }
}

Route.propTypes = {
  path: PropTypes.string.isRequired,
  component: PropTypes.func.isRequired,
  exact: PropTypes.bool,
};

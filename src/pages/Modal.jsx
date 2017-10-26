import React from 'react';
import PropTypes from 'prop-types';
import AppState from 'state/AppState.jsx';
// import modules here

export default class Modal extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div id="Modal">
        <h1>Welcome to the Modal page</h1>
      </div>
    );
  }
}

Modal.propTypes = {
  state: PropTypes.instanceOf(AppState),
};

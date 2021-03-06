import React from 'react';
import PropTypes from 'prop-types';
import AppState from 'state/AppState.jsx';
// import modules here

export default class Test extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    if (this.props.parameters) {
      console.log(this.props.parameters.urlParams);
    }
    return (
      <div id="Test">
        <h1>Welcome to the Test page</h1>
      </div>
    );
  }
}

Test.propTypes = {
  state: PropTypes.instanceOf(AppState),
  parameters: PropTypes.object,
};

import React from 'react';
import PropTypes from 'prop-types';
import AppState from 'state/AppState.jsx';
// import modules here

export default class Home extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const styles = {
      backgroundColor: 'black',
      height: '100vh',
      color: 'white',
    };

    return (
      <div id="Home" style={styles}>
        <h1>Welcome to the Home page</h1>
      </div>
    );
  }
}

Home.propTypes = {
  state: PropTypes.instanceOf(AppState),
};

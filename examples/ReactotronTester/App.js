/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';

import './app/config/ReactotronConfig';

import AppComponent from './app/App';

const App: () => React$Node = () => {
  return (
    <>
      <AppComponent />
    </>
  );
};

export default App;

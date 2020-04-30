import React from 'react';
import { View, StatusBar, SafeAreaView } from 'react-native';
import Constants from 'expo-constants'
import { purple, white } from './utils/colors'

// redux
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import reducer from './reducers';

import TabNav from './components/TabNav';

function UdaciStatusBar({ backgroundColor, ...props }) {
  return (
    <View style={{ backgroundColor, height: Constants.statusBarHeight }}>
      <StatusBar translucent backgroundColor={backgroundColor} {...props} />
    </View>
  )
}

export default class App extends React.Component {
  render() {
    return (
      <Provider store={createStore(reducer)}>
        <View style={{ flex: 1 }}>
          <UdaciStatusBar backgroundColor={purple} barStyle='light-content' />
          <TabNav />
        </View>
      </Provider>
    );
  }
}
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {SafeAreaView, StatusBar} from 'react-native';
import RichText from './src/example';
import {getFile, uploadFile} from './src/Utils/functions';

const inactiveTextColor = '#959ca0';
const secondaryHeaderColor = '#005587';
const primaryHeaderColor = '#005587';
const inactiveButtonColor = '#40BAE8';

const IMAGE_UPLOAD_URL = 'https://qa-api.hcpspace.app/api/upload';

const App: () => React$Node = () => {
  return (
    <SafeAreaView style={{flex: 1}}>
      <StatusBar
        style={{backgroundColor: primaryHeaderColor}}
        barStyle="dark-content"
      />
      <RichText
        getFile={getFile}
        uploadFile={uploadFile}
        IMAGE_UPLOAD_URL={IMAGE_UPLOAD_URL}
        inactiveTextColor={inactiveTextColor}
        secondaryHeaderColor={secondaryHeaderColor}
        primaryHeaderColor={primaryHeaderColor}
        inactiveButtonColor={inactiveButtonColor}
        cursorPrompt="Please set the cursor where you want the image to be inserted"
      />
    </SafeAreaView>
  );
};

export default App;

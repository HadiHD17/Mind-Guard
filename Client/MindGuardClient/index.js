import * as WebBrowser from "expo-web-browser";
WebBrowser.maybeCompleteAuthSession();
import { registerRootComponent } from "expo";
import React from "react";
import { Provider } from "react-redux";
import { store } from "./Redux/store";
import RootNavigator from "./Root";

registerRootComponent(() => (
  <Provider store={store}>
    <RootNavigator />
  </Provider>
));

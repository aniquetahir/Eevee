import React, {Component} from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';

import SignInMenu from '../authentication/SignInMenu';
import MainTabNavigator from './MainTabNavigator';
import CreateScreen from '../screens/CreateScreen';
import FilterScreen from '../screens/FilterScreen';
import LocationPicker from '../screens/LocationPicker';


export default createAppContainer(createSwitchNavigator({
  // You could add another route here for authentication.
  // Read more at https://reactnavigation.org/docs/en/auth-flow.html
  Main: SignInMenu/*MainTabNavigator*/,
  App: MainTabNavigator,
  Create: CreateScreen,
  Filter: FilterScreen,
  LocationPicker
}));
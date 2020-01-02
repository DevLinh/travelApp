import React from 'react';
import {Image} from 'react-native';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';

import Welcome from '../screens/Welcome';
import Login from '../screens/Login';
import SignUp from '../screens/SignUp';
import Forgot from '../screens/Forgot';
import Browse from '../screens/Browse';
import Settings from '../screens/Settings';
import Article from '../screens/Article';
import List from '../screens/List';
import Cart from '../screens/Cart';
import {theme} from '../constants';

const screens = createStackNavigator(
  {
    Welcome,
    Login,
    SignUp,
    Forgot,
    Browse,
    Settings,
    List,
    Article,
    Cart,
  },
  {
    mode: 'modal',
    defaultNavigationOptions: {
      headerStyle: {
        height: theme.sizes.base * 4,
        backgroundColor: theme.colors.white, // or 'white
        borderBottomColor: 'transparent',
        elevation: 0, // for android
      },
      headerBackImage: <Image source={require('../assets/icons/back.png')} />,
      headerBackTitle: null,
      headerLeftContainerStyle: {
        alignItems: 'center',
        marginLeft: theme.sizes.base * 2,
        paddingRight: theme.sizes.base,
      },
      headerRightContainerStyle: {
        alignItems: 'center',
        paddingRight: theme.sizes.base,
      },
      transitionConfig: () => ({
        transitionSpec: {
          duration: 500,
          easing: Easing.out(Easing.poly(4)),
          timing: Animated.timing,
        },
        screenInterpolator: sceneProps => {
          const {layout, position, scene} = sceneProps;
          const {index} = scene;

          const height = layout.initHeight;
          const translateY = position.interpolate({
            inputRange: [index - 1, index, index + 1],
            outputRange: [height, 0, 0],
          });

          const opacity = position.interpolate({
            inputRange: [index - 1, index - 0.99, index],
            outputRange: [0, 1, 1],
          });

          return {opacity, transform: [{translateY}]};
        },
      }),
    },
  },
);

export default createAppContainer(screens);

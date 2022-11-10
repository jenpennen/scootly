import React from 'react';
import {Image, Pressable, StyleSheet} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import MessagesScreen from '../screens/MessagesScreen';
import ProfileScreen from '../screens/ProfileScreen';
import {AppIcon, AppStyles} from '../AppStyles';
import {Configuration} from '../Configuration';
import DrawerContainer from '../components/DrawerContainer';

const Stack = createStackNavigator();

// login stack
const LoginStack = () => (
  <Stack.Navigator
    initialRouteName="Welcome"
    screenOptions={{
      headerTintColor: 'red',
      headerTitleStyle: styles.headerTitleStyle,
      headerMode: 'float',
      backgroundColor: AppStyles.color.primarybg
    }}>
    <Stack.Screen name="Welcome" component={WelcomeScreen} options={{headerShown: false}}/>
    <Stack.Screen name="Login" component={LoginScreen} options={{headerShown: false}}/>
    <Stack.Screen name="Signup" component={SignupScreen} options={{headerShown: false}}/>
    
  </Stack.Navigator>
);

const HomeStack = () => (
  <Stack.Navigator
    initialRouteName="Home"
    screenOptions={{
      headerTintColor: 'red',
      headerStyle: {
        backgroundColor: AppStyles.color.primarybg
      },
      headerTitleStyle: styles.headerTitleStyle,
      headerMode: 'float',
      headerShown: false
    }}>

    {/* Add different screens to the Home Stack */}
    <Stack.Screen
      name="Home"
      component={HomeScreen}
      style={styles.homeHeader}
      options={({navigation}) => ({
        headerLeft: () => (
          <Pressable onPress={() => navigation.openDrawer()}>
            <Image style={styles.iconStyle} source={AppIcon.images.menu} />
          </Pressable>
        ),
        headerLeftContainerStyle: {paddingLeft: 10},
      })}
    />
    
    <Stack.Screen
      name="Messages"
      component={MessagesScreen}
      style={styles.homeHeader}
      options={{headerShown:false}}
    />

    <Stack.Screen
      name="Profile"
      component={ProfileScreen}
      style={styles.homeHeader}
      options={{headerShown:false}}
    />
  </Stack.Navigator>
);

// BOTTOM TAB BAR ON THE HOME SCREEN
      // it's an imported react component, so styling is different: https://reactnavigation.org/docs/bottom-tab-navigator/
const BottomTab = createBottomTabNavigator();
const TabNavigator = () => (
  <BottomTab.Navigator
    initialRouteName="Home"
    screenOptions={{
      tabBarStyle: {
        backgroundColor:'black',
      },
      tabBarInactiveTintColor: 'lightgrey',
      tabBarActiveTintColor: AppStyles.color.tint,
      headerShown: false,
    }}>

    {/* Add Screen Switch Buttons to Bottom Bar */}

    <BottomTab.Screen
      options={{
        tabBarLabel: 'Home',
        tabBarIcon: ({focused}) => {
          return (
            <Image
              style={{ tintColor: focused ? AppStyles.color.tint : 'lightgrey',}}
              source={AppIcon.images.home}
            />
          );
        },
      }}
      name="HomeStack"
      component={HomeStack}
    />

    <BottomTab.Screen
      options={{
        tabBarLabel:'Messages',
        tabBarIcon: ({focused}) => {
          return (
            <Image
              style={{ tintColor: focused ? AppStyles.color.tint : 'lightgrey', height: 25, width: 25}}
              source={AppIcon.images.messages}
            />
          );
        },
      }}
      name="MessagesScreen"
      component={MessagesScreen}
    />

    <BottomTab.Screen
      options={{
        tabBarLabel: 'Profile',
        tabBarIcon: ({focused}) => {
          return (
            <Image
              style={{ tintColor: focused ? AppStyles.color.tint : 'lightgrey', height:25, width:25}}
              source={AppIcon.images.defaultUser}
            />
          );
        },
      }}
      name="ProfileScreen"
      component={ProfileScreen}
    />

  </BottomTab.Navigator>
);

// drawer stack
const Drawer = createDrawerNavigator();
const DrawerStack = () => (
  <Drawer.Navigator
    screenOptions={{
      drawerStyle: {outerWidth: 200},
      drawerPosition: 'left',
      headerShown: false,
    }}
    drawerContent={({navigation}) => (
      <DrawerContainer navigation={navigation} />
    )}>
    <Drawer.Screen name="Tab" component={TabNavigator} />
  </Drawer.Navigator>
);

// Manifest of possible screens
const RootNavigator = () => (
  <Stack.Navigator
    initialRouteName="LoginStack"
    screenOptions={{headerShown: false}}>
    <Stack.Screen name="LoginStack" component={LoginStack} />
    <Stack.Screen name="DrawerStack" component={DrawerStack} />
  </Stack.Navigator>
);

const AppNavigator = () => (
  <NavigationContainer>
    <RootNavigator />
  </NavigationContainer>
);

const styles = StyleSheet.create({
  homeHeader:{
    backgroundColor: AppStyles.color.primarybg,
  },
  headerTitleStyle: {
    fontWeight: 'bold',
    textAlign: 'center',
    alignSelf: 'center',
    color: 'black',
  },
  iconStyle: {
    tintColor: AppStyles.color.tint, 
    width: 30, 
    height: 30
  },
});

export default AppNavigator;

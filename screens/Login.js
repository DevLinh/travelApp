import React, {Component} from 'react';
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  StyleSheet,
  Alert,
  CheckBox,
  View,
} from 'react-native';

import {Button, Block, Input, Text} from '../components';
import {theme} from '../constants';

import AsyncStorage from '@react-native-community/async-storage';

const VALID_EMAIL = 'devlinh99qb@gmail.com';
const VALID_PASSWORD = '123abc';

export default class Login extends Component {
  async componentDidMount() {
    const savedUser = await this.getRememberUser();
    this.setState({
      userEmail: savedUser.email || '',
      userPassword: savedUser.pass || '',
      rememberMe: savedUser ? true : false,
    });
  }

  constructor(props) {
    super(props);
    this.state = {
      userEmail: '',
      userPassword: '',
      errors: [],
      loading: false,
      rememberMe: false,
    };
  }

  handleLogin() {
    const {navigation} = this.props;
    const {userEmail, userPassword} = this.state;
    const errors = [];

    Keyboard.dismiss();
    this.setState({loading: true});

    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    // check with backend API or with some static data
    if (userEmail == '' || reg.test(userEmail) === false) {
      errors.push('email');
    }
    if (userPassword == '') {
      errors.push('password');
    }

    this.setState({errors, loading: false});

    if (!errors.length) {
      fetch('https://myfreshfruits.000webhostapp.com/Login.php', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userEmail,

          password: userPassword,
        }),
      })
        .then(response => response.json())
        .then(responseJson => {
          // If server response message same as Data Matched
          if (responseJson === 'Data Matched') {
            //Then open Profile activity and send user email to profile activity.
            Alert.alert('Hola!', 'Chào mừng bạn trở lại', [
              {
                text: 'Hola!',
              },
            ]);
            navigation.navigate('List', {
              Email: userEmail,
              Password: userPassword,
            });
          } else {
            Alert.alert('Không thành công', responseJson);
          }
        })
        .catch(error => {
          console.error(error);
        });
    }
  }

  toggleRememberMe = value => {
    this.setState({rememberMe: value});
    if (value === true) {
      this.rememberUser();
    } else {
      this.forgetUser();
    }
  };

  rememberUser = async () => {
    try {
      await AsyncStorage.setItem('useremail', this.state.userEmail);
      await AsyncStorage.setItem('password', this.state.userPassword);
    } catch (error) {
      console.log(error);
    }
  };

  getRememberUser = async () => {
    try {
      const useremail = await AsyncStorage.getItem('useremail');
      const password = await AsyncStorage.getItem('password');
      const user = {email: useremail, pass: password};
      if (useremail !== null && password !== null) {
        return user;
      }
    } catch (error) {
      console.log(error);
    }
  };

  forgetUser = async () => {
    try {
      await AsyncStorage.removeItem('useremail');
      await AsyncStorage.removeItem('password');
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    const {navigation} = this.props;
    const {loading, errors, rememberMe} = this.state;
    const hasErrors = key => (errors.includes(key) ? styles.hasErrors : null);

    return (
      <KeyboardAvoidingView style={styles.login} behavior="padding">
        <Block padding={[0, theme.sizes.base * 2]}>
          <Text h1 bold>
            Đăng nhập
          </Text>
          <Block middle>
            <Input
              label="Email"
              error={hasErrors('email')}
              style={[styles.input, hasErrors('email')]}
              defaultValue={
                navigation.getParam('Email') != null
                  ? navigation.getParam('Email')
                  : this.state.userEmail
              }
              onChangeText={text => this.setState({userEmail: text})}
            />
            <Input
              secure
              label="Mật khẩu"
              error={hasErrors('password')}
              style={[styles.input, hasErrors('password')]}
              defaultValue={this.state.userPassword}
              onChangeText={text => this.setState({userPassword: text})}
            />
            <View style={styles.saveUser}>
              <CheckBox
                value={rememberMe}
                onValueChange={value => this.toggleRememberMe(value)}
              />
              <Text gray2 caption>
                Lưu tài khoản
              </Text>
            </View>
            <Button gradient onPress={() => this.handleLogin()}>
              {loading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text bold white center>
                  Đăng nhập
                </Text>
              )}
            </Button>

            <Button onPress={() => navigation.navigate('Forgot')}>
              <Text
                gray
                caption
                center
                style={{textDecorationLine: 'underline'}}>
                Quên mật khẩu?
              </Text>
            </Button>
          </Block>
        </Block>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  login: {
    flex: 1,
    justifyContent: 'center',
  },
  input: {
    borderRadius: 0,
    borderWidth: 0,
    borderBottomColor: theme.colors.gray2,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  hasErrors: {
    borderBottomColor: theme.colors.accent,
  },
  saveUser: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

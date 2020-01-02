import React, {Component} from 'react';
import {Alert, ActivityIndicator, Keyboard, StyleSheet} from 'react-native';

import {Button, Block, Input, Text} from '../components';
import {theme} from '../constants';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
export default class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userEmail: null,
      userPassword: null,
      userName: null,
      errors: [],
      loading: false,
    };
  }
  handleSignUp() {
    const {navigation} = this.props;
    const {userEmail, userPassword, userName} = this.state;
    const errors = [];

    Keyboard.dismiss();
    this.setState({loading: true});

    // check with backend API or with some static data
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (reg.test(userEmail) === false) errors.push('email');
    if (!userEmail) errors.push('email');
    if (!userName) errors.push('username');
    if (!userPassword) errors.push('password');

    this.setState({errors, loading: false});

    if (!errors.length) {
      fetch('https://myfreshfruits.000webhostapp.com/user_registration.php', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: userName,

          email: userEmail,

          password: userPassword,
        }),
      })
        .then(response => response.json())
        .then(responseJson => {
          // Showing response message coming from server after inserting records.
          if (responseJson == 'OK') {
            Alert.alert(
              'Đăng ký thành công!',
              'Vui lòng đăng nhập lại để sử dụng tài khoản',
              [
                {
                  text: 'Đã hiểu',
                  onPress: () => {
                    navigation.navigate('Login', {Email: userEmail});
                  },
                },
                {
                  text: 'Thử lại',
                },
              ],
              {cancelable: false},
            );
          } else {
            Alert.alert('Thông báo', responseJson);
          }
        });
    }
  }

  render() {
    const {navigation} = this.props;
    const {loading, errors} = this.state;
    const hasErrors = key => (errors.includes(key) ? styles.hasErrors : null);

    return (
      <KeyboardAwareScrollView
        contentContainerStyle={styles.signup}
        scrollEnabled={false}
        resetScrollToCoords={{x: 0, y: 0}}>
        <Block padding={[0, theme.sizes.base * 2]}>
          <Text h1 bold>
            Đăng ký
          </Text>
          <Block middle>
            <Input
              email
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
              label="Tên tài khoản"
              error={hasErrors('username')}
              style={[styles.input, hasErrors('username')]}
              defaultValue={this.state.userName}
              onChangeText={text => this.setState({userName: text})}
            />
            <Input
              secure
              label="Mật khẩu"
              error={hasErrors('password')}
              style={[styles.input, hasErrors('password')]}
              defaultValue={this.state.userPassword}
              onChangeText={text => this.setState({userPassword: text})}
            />
            <Button gradient onPress={() => this.handleSignUp()}>
              {loading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text bold white center>
                  Đăng ký
                </Text>
              )}
            </Button>

            <Button onPress={() => navigation.navigate('Login')}>
              <Text
                gray
                caption
                center
                style={{textDecorationLine: 'underline'}}>
                Quay về đăng nhập
              </Text>
            </Button>
          </Block>
        </Block>
      </KeyboardAwareScrollView>
    );
  }
}

const styles = StyleSheet.create({
  signup: {
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
});

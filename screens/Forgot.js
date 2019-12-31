import React, {Component} from 'react';
import {
  Alert,
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  StyleSheet,
} from 'react-native';

import {Button, Block, Input, Text} from '../components';
import {theme} from '../constants';

export default class Forgot extends Component {
  state = {
    userEmail: 'devlinh99qb@gmail.com',
    errors: [],
    loading: false,
  };

  handleForgot() {
    const {navigation} = this.props;
    const {userEmail} = this.state;
    const errors = [];

    Keyboard.dismiss();
    this.setState({loading: true});

    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    // check with backend API or with some static data
    if (userEmail == '' || reg.test(userEmail) === false) {
      errors.push('email');
    }

    this.setState({errors, loading: false});

    if (!errors.length) {
      fetch('https://myfreshfruits.000webhostapp.com/reset_password.php', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userEmail,
        }),
      })
        .then(response => response.json())
        .then(responseJson => {
          // If server response message same as Data Matched
          if (responseJson === 'Data Matched') {
            //Then open Profile activity and send user email to profile activity.
            Alert.alert('Thành công!', 'Vui lòng kiểm tra hộp thư', [
              {
                text: 'Đã hiểu!',
              },
            ]);
            navigation.navigate('Login', {Email: userEmail});
          } else {
            Alert.alert(
              'Không thành công',
              responseJson,
              [
                {
                  text: 'Đăng ký',
                  onPress: () => {
                    navigation.navigate('SignUp', {Email: userEmail});
                  },
                },
              ],
              {cancelable: true},
            );
          }
        })
        .catch(error => {
          console.error(error);
        });
    } else {
      Alert.alert(
        'Lỗi',
        'Vui lòng kiểm tra lại địa chỉ email.',
        [{text: 'Thử lại'}],
        {cancelable: false},
      );
    }
  }

  render() {
    const {navigation} = this.props;
    const {loading, errors} = this.state;
    const hasErrors = key => (errors.includes(key) ? styles.hasErrors : null);

    return (
      <KeyboardAvoidingView style={styles.forgot} behavior="padding">
        <Block padding={[0, theme.sizes.base * 2]}>
          <Text h1 bold>
            Quên mật khẩu
          </Text>
          <Block middle>
            <Input
              label="Email"
              error={hasErrors('email')}
              style={[styles.input, hasErrors('email')]}
              defaultValue={this.state.userEmail}
              onChangeText={text => this.setState({userEmail: text})}
            />
            <Button gradient onPress={() => this.handleForgot()}>
              {loading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text bold white center>
                  Tạo lại mật khẩu
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
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  forgot: {
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

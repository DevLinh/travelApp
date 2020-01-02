import React, {Component} from 'react';
import {StyleSheet, ScrollView, TextInput} from 'react-native';
import Slider from 'react-native-slider';

import {Divider, Block, Text, Switch} from '../components';
import {theme} from '../constants';

class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      point: 0,
      notifications: true,
      newsletter: false,
      editing: null,
      user: [],
    };
  }

  componentDidMount() {
    const {navigation} = this.props;
    const userEmail = navigation.getParam('Email');
    const userPassword = navigation.getParam('Password');
    this.setState({profile: this.props.profile});
    fetch('https://myfreshfruits.000webhostapp.com/get_user.php', {
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
        console.log(responseJson);
        this.setState({
          user: responseJson,
          point: Number(responseJson[5]),
        });
      })
      .catch(error => {
        console.error(error);
      });
  }

  handleEdit(name, text) {
    const {user} = this.state;
    const profile = {
      username: user[3],
      address: user[4],
      email: user[1],
    };
    profile[name] = text;

    this.setState({profile});
  }

  toggleEdit(name) {
    const {editing} = this.state;
    this.setState({editing: !editing ? name : null});
  }

  renderEdit(name) {
    const {editing} = this.state;
    const {user} = this.state;
    const profile = {
      username: user[3],
      address: user[4],
      email: user[1],
    };
    if (editing === name) {
      return (
        <TextInput
          defaultValue={profile[name]}
          onChangeText={text => this.handleEdit([name], text)}
        />
      );
    }

    return <Text bold>{profile[name]}</Text>;
  }

  render() {
    const {editing} = this.state;
    const {user} = this.state;
    const profile = {
      username: user[3],
      address: user[4],
      email: user[1],
    };
    // const notifications = user[6] == '1' ? true : false;
    // const newsletter = user[7] == '1' ? true : false;
    return (
      <Block>
        <Block flex={false} row center space="between" style={styles.header}>
          <Text h1 bold>
            Cài đặt
          </Text>
        </Block>

        <ScrollView showsVerticalScrollIndicator={false}>
          <Block style={styles.inputs}>
            <Block row space="between" margin={[10, 0]} style={styles.inputRow}>
              <Block>
                <Text gray2 style={{marginBottom: 10}}>
                  Tên tài khoản
                </Text>
                {this.renderEdit('username')}
              </Block>
              <Text
                medium
                secondary
                onPress={() => this.toggleEdit('username')}>
                {editing === 'username' ? 'Lưu' : 'Chỉnh sửa'}
              </Text>
            </Block>
            <Block row space="between" margin={[10, 0]} style={styles.inputRow}>
              <Block>
                <Text gray2 style={{marginBottom: 10}}>
                  Địa chỉ
                </Text>
                {this.renderEdit('address')}
              </Block>
              <Text medium secondary onPress={() => this.toggleEdit('address')}>
                {editing === 'address' ? 'Lưu' : 'Chỉnh sửa'}
              </Text>
            </Block>
            <Block row space="between" margin={[10, 0]} style={styles.inputRow}>
              <Block>
                <Text gray2 style={{marginBottom: 10}}>
                  E-mail
                </Text>
                <Text bold>{profile.email}</Text>
              </Block>
            </Block>
          </Block>

          <Divider margin={[theme.sizes.base, theme.sizes.base * 2]} />

          <Block style={styles.sliders}>
            <Text caption gray>
              Hãy tích lũy điểm thưởng thông qua các reviews và các chuyến đi để
              trở thành thành viên VIP.
            </Text>
            <Block margin={[10, 0]}>
              <Text gray2 style={{marginBottom: 10}}>
                Điểm tích lũy
              </Text>
              <Slider
                disabled={true}
                minimumValue={0}
                maximumValue={1000}
                style={{height: 19}}
                thumbStyle={styles.thumb}
                trackStyle={{height: 6, borderRadius: 6}}
                minimumTrackTintColor={theme.colors.secondary}
                maximumTrackTintColor="rgba(157, 163, 180, 0.10)"
                value={this.state.point}
                onValueChange={value => this.setState({point: value})}
              />
              <Text caption gray right>
                1000 điểm
              </Text>
            </Block>

            <Text semibold gray2>
              Hãy tận hưởng những chuyến đi và nhận về những ưu đãi !
            </Text>
          </Block>

          <Divider />

          <Block style={styles.toggles}>
            <Block
              row
              center
              space="between"
              style={{marginBottom: theme.sizes.base * 2}}>
              <Text gray2>Thông báo đẩy</Text>
              <Switch
                value={this.state.notifications}
                onValueChange={value => this.setState({notifications: value})}
              />
            </Block>

            <Block
              row
              center
              space="between"
              style={{marginBottom: theme.sizes.base * 2}}>
              <Text gray2>Nhận thông tin khuyến mãi qua mail</Text>
              <Switch
                value={this.state.newsletter}
                onValueChange={value => this.setState({newsletter: value})}
              />
            </Block>
          </Block>
        </ScrollView>
      </Block>
    );
  }
}

export default Settings;

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: theme.sizes.base * 2,
  },
  avatar: {
    height: theme.sizes.base * 2.2,
    width: theme.sizes.base * 2.2,
  },
  inputs: {
    marginTop: theme.sizes.base * 0.7,
    paddingHorizontal: theme.sizes.base * 2,
  },
  inputRow: {
    alignItems: 'flex-end',
  },
  sliders: {
    marginTop: theme.sizes.base * 0.7,
    paddingHorizontal: theme.sizes.base * 2,
  },
  thumb: {
    width: theme.sizes.base,
    height: theme.sizes.base,
    borderRadius: theme.sizes.base,
    borderColor: 'white',
    borderWidth: 3,
    backgroundColor: theme.colors.secondary,
  },
  toggles: {
    paddingHorizontal: theme.sizes.base * 2,
  },
});

import React, {Component} from 'react';
import {
  Text,
  StyleSheet,
  View,
  ScrollView,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import {Block, Divider, Button} from '../components';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Octicons from 'react-native-vector-icons/Octicons';
import NumberFormat from 'react-number-format';
import InputSpinner from 'react-native-input-spinner';
import AsyncStorage from '@react-native-community/async-storage';

import {theme} from '../constants';

const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
  flex: {
    flex: 0,
  },
  column: {
    flexDirection: 'column',
  },
  row: {
    flexDirection: 'row',
  },
  header: {
    backgroundColor: theme.colors.white,
    paddingHorizontal: theme.sizes.padding2,
    paddingTop: theme.sizes.padding2 * 1.33,
    paddingBottom: theme.sizes.padding2 * 0.66,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  articles: {},
  tours: {
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: 80,
  },
  tour: {
    width: width - theme.sizes.padding2 * 2,
    height: height / 5,
    marginHorizontal: theme.sizes.margin,
    paddingHorizontal: theme.sizes.padding2 / 4,
    paddingVertical: theme.sizes.padding2 / 8,
    borderRadius: theme.sizes.radius2,
    marginVertical: height / 10,
  },
  tourInfo: {
    position: 'absolute',
    borderRadius: theme.sizes.radius2,
    paddingHorizontal: theme.sizes.padding2 / 2,
    paddingVertical: theme.sizes.padding2 / 4,
    bottom: 20,
    left: width / 2 - theme.sizes.padding * 3,
    top: width / 3,
    backgroundColor: theme.colors.white,
    width: width / 1.5,
    height: height / 5,
  },

  shadow: {
    shadowColor: theme.colors.black,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 5,
  },
  dots: {
    width: 10,
    height: 10,
    borderWidth: 2.5,
    borderRadius: 5,
    marginHorizontal: 6,
    backgroundColor: theme.colors.gray,
    borderColor: 'transparent',
  },
  activeDot: {
    width: 12.5,
    height: 12.5,
    borderRadius: 6.25,
    borderColor: theme.colors.active,
  },
  list: {
    flexWrap: 'wrap',
    marginBottom: theme.sizes.base * 3.5,
  },
  contentHeader: {
    padding: theme.sizes.padding,
    paddingBottom: theme.sizes.padding / 2,
    backgroundColor: theme.colors.white,
  },
});

class Cart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userID: '',
      cart: {
        tours: [],
        totalPrice: 0,
      },
      totalQuantity: 1,
    };
  }

  async setCart(cart) {
    try {
      await AsyncStorage.setItem('cart', JSON.stringify(cart));
      this.setState({
        cart: cart,
      });
    } catch (error) {
      console.error();
    }
  }

  async getCart() {
    try {
      let cart = await AsyncStorage.getItem('cart');
      if (cart != null) {
        this.setState({
          cart: JSON.parse(cart),
        });
      }
    } catch (error) {
      console.error();
    }
  }

  async removeCart() {
    try {
      await AsyncStorage.removeItem('cart');
    } catch (error) {
      console.error();
    }
  }

  handleBook() {
    this.removeCart();
    Alert.alert(
      'Đặt thành công',
      'Chúng tôi sẽ liên lạc tới bạn sớm nhất!',
      [
        {
          text: 'Đã hiểu',
          onPress: () => {
            this.props.navigation.navigate('List');
          },
        },
      ],
      {cancelable: false},
    );
  }

  countQuantity() {
    var total = 0;
    for (var i in this.state.cart.tours) {
      total += this.state.cart.tours[i].quantity;
    }
    this.setState({
      totalQuantity: total,
    });
  }

  async componentDidMount() {
    const {navigation} = this.props;
    this.getCart().then(() => {
      let tour = navigation.getParam('tour');
      console.log(this.props.navigation.getParam('Email'));
      this.countQuantity();
      if (tour != null) {
        this.addItemCart(tour);
        this.countQuantity();
      }
    });
  }

  search(tour, tours) {
    for (var i = 0; i < tours.length; i++) {
      if (tours[i].id === tour.id) {
        return i;
      }
    }
    return -1;
  }

  addItemCart(tour) {
    let tours = this.state.cart.tours;

    let idx = this.search(tour, this.state.cart.tours);
    console.log('So sanh co trunh khong:....' + idx);
    let totalPrice = this.state.cart.totalPrice + tour.price * tour.quantity;

    if (idx > -1) {
      tours[idx].quantity += 1;
    } else {
      tours.push(tour);
    }

    let cart = {
      tours: tours,
      totalPrice: totalPrice,
    };

    this.setCart(cart);
  }

  editItemCart(tour, operation) {
    // Get current list of tours
    let tours = this.state.cart.tours;
    let idx = this.search(tour, tours);
    let totalPrice = parseInt(this.state.cart.totalPrice);
    if (operation == 'add') {
      totalPrice += parseInt(tour.price);
      tours[idx].quantity += 1;
    } else if (operation == 'sub') {
      if (tours[idx].quantity > 1) {
        totalPrice -= parseInt(tour.price);
        tours[idx].quantity -= 1;
      }
    }
    // Update the state
    let cart = {
      tours: tours,
      totalPrice: totalPrice,
    };
    this.setCart(cart);
  }

  removeItemCart(tour) {
    let tours = this.state.cart.tours;
    let idx = this.search(tour, tours);
    let totalPrice = this.state.cart.totalPrice - tour.price * tour.quantity;
    // Remove single item
    tours.splice(idx, 1);
    // Update the state
    let cart = {
      tours: tours,
      totalPrice: totalPrice,
    };
    this.setCart(cart);
    this.countQuantity();
  }
  static navigationOptions = ({navigation}) => ({
    header: (
      <View style={[styles.flex, styles.row, styles.header]}>
        <View>
          <Text style={{color: theme.colors.caption}}>
            Cùng đi yourTrip đi khắp Việt Nam
          </Text>
          <Text
            style={{
              fontSize: theme.sizes.font * 2,
              color: theme.colors.primary,
            }}>
            Hành trình bạn chọn
          </Text>
        </View>
      </View>
    ),
  });

  renderTours = () => {
    return (
      <View style={[styles.column, styles.tours]}>
        <Block flex={false} row space="between" style={styles.list}>
          {this.state.cart.tours.map((tour, index) =>
            this.renderTour(tour, index),
          )}
        </Block>
      </View>
    );
  };

  renderTour = (item, index) => {
    const isLastItem = index === this.state.cart.tours.length - 1;
    return (
      <View>
        <ImageBackground
          style={[
            styles.flex,
            styles.tour,
            styles.shadow,
            index === 0 ? {marginTop: theme.sizes.margin / 2} : null,
            isLastItem ? {marginBottom: theme.sizes.margin} / 2 : null,
          ]}
          imageStyle={{borderRadius: theme.sizes.radius2}}
          source={{uri: item.preview}}>
          <View
            style={[
              styles.row,
              {justifyContent: 'space-between', alignItems: 'center'},
            ]}>
            <View
              style={[
                styles.column,
                {flex: 1, paddingHorizontal: theme.sizes.padding2 / 3},
              ]}></View>
          </View>
        </ImageBackground>
        <View
          style={[
            styles.column,
            styles.tourInfo,
            styles.shadow,
            index === 0 ? {top: (width - theme.sizes.padding2 * 5) / 2} : null,
            isLastItem
              ? {marginRight: theme.sizes.margin, paddingBottom: 0} / 4
              : null,
          ]}>
          <View
            style={[
              styles.row,
              {
                justifyContent: 'space-between',
                alignItems: 'center',
              },
            ]}>
            <Text
              style={{
                fontSize: theme.sizes.font * 1.25,
                fontWeight: '500',
              }}>
              {item.title}
            </Text>
            <TouchableOpacity onPress={() => this.removeItemCart(item)}>
              <Octicons
                name="trashcan"
                size={theme.sizes.font * 1.7}
                color={theme.colors.accent}
              />
            </TouchableOpacity>
          </View>

          <Text style={{color: theme.colors.caption}}>
            <Octicons
              name="location"
              size={theme.sizes.font}
              color={theme.colors.primary}
            />
            <Text> {item.location}</Text>
          </Text>
          <NumberFormat
            value={item.price}
            displayType={'text'}
            thousandSeparator={true}
            suffix={' VND'}
            renderText={value => (
              <Text
                style={{
                  color: theme.colors.primary,
                  fontSize: theme.sizes.header,
                  marginTop: 0,
                }}>
                {value}
              </Text>
            )}
          />
          <View
            style={[
              styles.row,
              {
                justifyContent: 'flex-start',
                alignItems: 'center',
                paddingTop: theme.sizes.padding / 2,
              },
            ]}>
            <Text
              style={{
                color: theme.colors.primary,
                paddingRight: theme.sizes.padding,
              }}>
              Số lượng
            </Text>
            <InputSpinner
              editable={false}
              min={1}
              step={1}
              rounded={true}
              showBorder={false}
              fontSize={12}
              inputStyle={{
                paddingVertical: 5,
              }}
              width={100}
              height={30}
              value={item.quantity}
              color={theme.colors.primary}
              buttonLeftImage={
                <FontAwesome
                  name="chevron-left"
                  size={theme.sizes.font * 0.75}
                  color={theme.colors.white}
                />
              }
              buttonRightImage={
                <FontAwesome
                  name="chevron-right"
                  size={theme.sizes.font * 0.75}
                  color={theme.colors.white}
                />
              }
              onIncrease={increase => {
                this.editItemCart(item, 'add');
                this.countQuantity();
              }}
              onDecrease={decrease => {
                this.editItemCart(item, 'sub');
                this.countQuantity();
              }}
            />
          </View>
        </View>
      </View>
    );
  };

  render() {
    return (
      <Block>
        {this.state.cart.tours.length > 0 ? (
          <View style={{flex: 3}}>
            <Divider margin={[theme.sizes.base / 4, theme.sizes.base * 2]} />
            <ScrollView
              showsVerticalScrollIndicator={true}
              contentContainerStyle={{paddingBottom: theme.sizes.padding2}}>
              {this.renderTours()}
            </ScrollView>
            <Divider margin={[theme.sizes.base / 4, theme.sizes.base * 2]} />
          </View>
        ) : (
          <View style={{flex: 3, alignItems: 'center'}}>
            <Text
              style={{
                color: theme.colors.primary,
                fontSize: theme.sizes.base,
                fontStyle: 'italic',
              }}>
              Hãy lựa chọn hành trình của bạn nhé !
            </Text>
            <Image
              style={{
                width: width - theme.sizes.base * 2,
                height: height / 2,
                overflow: 'visible',
                resizeMode: 'contain',
              }}
              source={require('../assets/images/asset3.png')}
            />
          </View>
        )}

        <View style={[{flex: 1}, styles.contentHeader]}>
          <Block row space="between">
            <Text
              style={{
                color: theme.colors.primary,
                fontStyle: 'italic',
                fontWeight: 'bold',
              }}>
              Số tour:
            </Text>
            <NumberFormat
              value={this.state.totalQuantity}
              displayType={'text'}
              suffix={' Tour'}
              renderText={value => <Text style={styles.price}>{value}</Text>}
            />
          </Block>
          <Block row space="between">
            <Text
              style={{
                color: theme.colors.primary,
                fontStyle: 'italic',
                fontWeight: 'bold',
              }}>
              Thành tiền:
            </Text>
            <NumberFormat
              value={this.state.cart.totalPrice}
              displayType={'text'}
              thousandSeparator={true}
              suffix={' VND'}
              renderText={value => <Text style={styles.price}>{value}</Text>}
            />
          </Block>

          <View style={{justifyContent: 'center'}}>
            <Button
              gradient
              onPress={() => {
                if (this.state.cart.tours.length > 0) {
                  this.handleBook();
                } else {
                  this.props.navigation.navigate('List');
                }
              }}>
              <Text
                style={{
                  color: theme.colors.white,
                  textAlign: 'center',
                  fontSize: theme.sizes.font * 1.3,
                }}>
                {this.state.cart.tours.length > 0
                  ? 'Book Tour'
                  : 'Tìm kiếm hành trình'}
              </Text>
            </Button>
          </View>
        </View>
      </Block>
    );
  }
}

export default Cart;

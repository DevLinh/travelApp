import React, {Component} from 'react';
import {
  Animated,
  Text,
  StyleSheet,
  View,
  ScrollView,
  FlatList,
  Image,
  ImageBackground,
  Dimensions,
  Platform,
  TouchableOpacity,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Octicons from 'react-native-vector-icons/Octicons';

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
  destinations: {
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: 30,
  },
  destination: {
    width: width - theme.sizes.padding2 * 2,
    height: width * 0.6,
    marginHorizontal: theme.sizes.margin,
    paddingHorizontal: theme.sizes.padding2,
    paddingVertical: theme.sizes.padding2 * 0.66,
    borderRadius: theme.sizes.radius2,
  },
  destinationInfo: {
    position: 'absolute',
    borderRadius: theme.sizes.radius2,
    paddingHorizontal: theme.sizes.padding2,
    paddingVertical: theme.sizes.padding2 / 2,
    bottom: 20,
    left:
      (width - theme.sizes.padding2 * 4) / (Platform.OS === 'ios' ? 3.2 : 3),
    backgroundColor: theme.colors.white,
    width: width - theme.sizes.padding2 * 4,
  },
  recommendedHeader: {
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: theme.sizes.padding2,
  },
  recommendation: {
    width: (width - theme.sizes.padding2 * 2) / 2,
    marginHorizontal: 8,
    backgroundColor: theme.colors.white,
    overflow: 'hidden',
    borderRadius: theme.sizes.radius2,
    marginVertical: theme.sizes.margin * 0.5,
  },
  recommendationHeader: {
    overflow: 'hidden',
    borderTopRightRadius: theme.sizes.radius2,
    borderTopLeftRadius: theme.sizes.radius2,
  },
  recommendationOptions: {
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.sizes.padding2 / 2,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  recommendationTemp: {
    fontSize: theme.sizes.font * 1.25,
    color: theme.colors.white,
  },
  recommendationImage: {
    width: (width - theme.sizes.padding2 * 2) / 2,
    height: (width - theme.sizes.padding2 * 2) / 2,
  },
  avatar: {
    width: theme.sizes.padding2 * 0.8,
    height: theme.sizes.padding2 * 0.8,
    borderRadius: theme.sizes.padding2 / 2,
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
});

class Articles extends Component {
  scrollX = new Animated.Value(0);

  constructor(props) {
    super(props);
    this.state = {
      destinations: [],
      highlight: [],
      recommended: [],
      email: '',
      pw: '',
    };
  }

  componentDidMount() {
    fetch('http://myfreshfruits.000webhostapp.com/get_destination.php')
      .then(response => response.json())
      .then(responseJson => {
        this.setState({
          destinations: responseJson,
        });
      });
  }

  static navigationOptions = ({navigation}) => ({
    header: (
      <View style={[styles.flex, styles.row, styles.header]}>
        <View>
          <Text style={{color: theme.colors.caption}}>Welcome to yourTRIP</Text>
          <Text style={{fontSize: theme.sizes.font * 2}}>Địa điểm nổi bật</Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            const e = navigation.getParam('Email');
            const p = navigation.getParam('Password');
            navigation.navigate('Settings', {
              Email: e,
              Password: p,
            });
            // navigation.navigate('Cart', {
            //   Email: e,
            //   Password: p,
            // });
          }}>
          <Image
            style={styles.avatar}
            source={{
              uri: 'https://myfreshfruits.000webhostapp.com/default_avatar.png',
            }}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            const id = navigation.getParam('id');
            navigation.navigate('Cart', {
              id: id,
            });
          }}>
          <FontAwesome
            name="shopping-cart"
            size={theme.sizes.font * 2}
            color={theme.colors.primary}
          />
        </TouchableOpacity>
      </View>
    ),
  });

  renderDots() {
    const highlightedTour = this.state.destinations.filter(
      tour => tour.highlight == '1',
    );
    const dotPosition = Animated.divide(this.scrollX, width);
    return (
      <View
        style={[
          styles.flex,
          styles.row,
          {justifyContent: 'center', alignItems: 'center', marginTop: 10},
        ]}>
        {highlightedTour.map((item, index) => {
          const borderWidth = dotPosition.interpolate({
            inputRange: [index - 1, index, index + 1],
            outputRange: [0, 2.5, 0],
            extrapolate: 'clamp',
          });
          if (item.highlight == '1') {
            return (
              <Animated.View
                key={`step-${item.id}`}
                style={[
                  styles.dots,
                  styles.activeDot,
                  {borderWidth: borderWidth},
                ]}
              />
            );
          }
        })}
      </View>
    );
  }

  renderRatings(rating) {
    const stars = new Array(5).fill(0);
    return stars.map((_, index) => {
      const activeStar = Math.floor(rating) >= index + 1;
      return (
        <FontAwesome
          name="star"
          key={`star-${index}`}
          size={theme.sizes.font}
          color={theme.colors[activeStar ? 'active' : 'gray']}
        />
      );
    });
  }

  renderDestinations = () => {
    const highlightedTour = this.state.destinations.filter(
      tour => tour.highlight == '1',
    );
    return (
      <View style={[styles.column, styles.destinations]}>
        <FlatList
          horizontal
          pagingEnabled
          scrollEnabled
          showsHorizontalScrollIndicator={false}
          decelerationRate={0}
          scrollEventThrottle={16}
          snapToAlignment="center"
          style={{overflow: 'visible', height: 280}}
          data={highlightedTour}
          keyExtractor={(item, index) => `${item.id}`}
          onScroll={Animated.event([
            {nativeEvent: {contentOffset: {x: this.scrollX}}},
          ])}
          renderItem={({item}) => this.renderDestination(item)}
        />
        {this.renderDots()}
      </View>
    );
  };

  renderDestination = item => {
    const {navigation} = this.props;
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => navigation.navigate('Article', {article: item})}>
        <ImageBackground
          style={[styles.flex, styles.destination, styles.shadow]}
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
        <View style={[styles.column, styles.destinationInfo, styles.shadow]}>
          <Text
            style={{
              fontSize: theme.sizes.font * 1.25,
              fontWeight: '500',
            }}>
            {item.title}
          </Text>

          <View
            style={[
              styles.row,
              {justifyContent: 'space-between', alignItems: 'flex-end'},
            ]}>
            <Text style={{color: theme.colors.caption}}>
              {item.description.split('').slice(0, 50)}...
            </Text>
            <FontAwesome
              name="chevron-right"
              size={theme.sizes.font * 0.75}
              color={theme.colors.caption}
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  renderRecommended = () => {
    const {navigation} = this.props;
    const recommendedTour = this.state.destinations.filter(
      tour => tour.recommended == '1',
    );
    return (
      <View style={[styles.flex, styles.column, styles.recommended]}>
        <View style={[styles.row, styles.recommendedHeader]}>
          <Text style={{fontSize: theme.sizes.font * 1.4}}>Được gợi ý</Text>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() =>
              navigation.navigate('Browse', {
                tours: this.state.destinations,
              })
            }>
            <Text
              style={{color: theme.colors.primary, fontSize: theme.sizes.h2}}>
              Khám phá
            </Text>
          </TouchableOpacity>
        </View>
        <View style={[styles.column, styles.recommendedList]}>
          <FlatList
            horizontal
            pagingEnabled
            scrollEnabled
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={16}
            snapToAlignment="center"
            style={[styles.shadow, {overflow: 'visible'}]}
            data={recommendedTour}
            keyExtractor={(item, index) => `${item.id}`}
            renderItem={({item, index}) =>
              this.renderRecommendation(item, index)
            }
          />
        </View>
      </View>
    );
  };

  renderRecommendation = (item, index) => {
    const {navigation} = this.props;
    const recommendedTour = this.state.destinations.filter(
      tour => tour.recommended == '1',
    );
    const isLastItem = index === recommendedTour.length - 1;
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => navigation.navigate('Article', {article: item})}>
        <View
          style={[
            styles.flex,
            styles.column,
            styles.recommendation,
            styles.shadow,
            index === 0 ? {marginLeft: theme.sizes.margin} : null,
            isLastItem ? {marginRight: theme.sizes.margin} / 2 : null,
          ]}>
          <View style={[styles.flex, styles.recommendationHeader]}>
            <Image
              style={[styles.recommendationImage]}
              source={{uri: item.preview}}
            />
            <View
              style={[styles.flex, styles.row, styles.recommendationOptions]}>
              <Text style={styles.recommendationTemp}>{item.temperature}℃</Text>
              <TouchableOpacity>
                <FontAwesome
                  name={item.saved === '1' ? 'bookmark' : 'bookmark-o'}
                  color={theme.colors.white}
                  size={theme.sizes.font * 1.25}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View
            style={[
              styles.flex,
              styles.column,
              styles.shadow,
              {
                justifyContent: 'space-between',
                padding: theme.sizes.padding2 / 2,
                flex: 1,
              },
            ]}>
            <Text
              style={{
                fontSize: theme.sizes.font * 1.25,
                fontWeight: '500',
                paddingBottom: theme.sizes.padding2 / 4.5,
                flex: 2.5,
              }}>
              {item.title}
            </Text>
            <Text style={{color: theme.colors.caption, flex: 1}}>
              <Octicons
                name="location"
                size={theme.sizes.font}
                color={theme.colors.primary}
              />
              <Text> {item.location}</Text>
            </Text>

            <View
              style={[
                styles.row,
                {
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: theme.sizes.margin,
                  flex: 1,
                },
              ]}>
              {this.renderRatings(item.rating)}
              <Text style={{color: theme.colors.active}}>{item.rating}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  render() {
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: theme.sizes.padding2}}>
        {this.renderDestinations()}
        {this.renderRecommended()}
      </ScrollView>
    );
  }
}

export default Articles;

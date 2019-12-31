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
const mocks = [
  {
    id: 1,
    user: {
      name: 'Linh Võ',
      avatar: 'https://myfreshfruits.000webhostapp.com/avatar.png',
    },
    saved: true,
    location: 'Bố Trạch, Quảng Bình',
    temperature: 34,
    title: 'Hang Sơn Đoòng',
    description:
      'Hang Sơn Đoòng nằm trong vùng lõi của Vườn Quốc gia Phong Nha – Kẻ Bàng, tỉnh Quảng Bình – là một hang động mới được Hiệp hội nghiên cứu hang động Hoàng gia Anh khám phá và công bố là hang động lớn nhất thế giới trong năm 2009 – 2010 và được đưa vào khai thác theo hình thức du lịch khám phá mạo hiểm từ năm 2013. Với cách khai thác hạn chế số lượng người tham gia, số lượng người chinh phục thành công Hang Sơn Đoòng hiện tại thậm chí còn ít hơn rất nhiều so với số lượng người đã từng đứng trên đỉnh Everest.',
    rating: 4.3,
    reviews: 3212,
    preview: 'https://myfreshfruits.000webhostapp.com/phongnha2.jpg',
    images: [
      'https://myfreshfruits.000webhostapp.com/phongnha4.jpg',
      'https://myfreshfruits.000webhostapp.com/phongnha3.jpg',
      'https://myfreshfruits.000webhostapp.com/phongnha5.jpg',
      'https://myfreshfruits.000webhostapp.com/phongnha1.jpg',
    ],
  },
  {
    id: 2,
    user: {
      name: 'Lelia Chavez',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    },
    saved: false,
    location: 'Loutraki, Greece',
    temperature: 34,
    title: 'Loutraki',
    description: 'This attractive small town, 80 kilometers from Athens',
    rating: 4.6,
    reviews: 3212,
    preview:
      'https://images.unsplash.com/photo-1458906931852-47d88574a008?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1458906931852-47d88574a008?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1446903572544-8888a0e60687?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    id: 3,
    user: {
      name: 'Lelia Chavez',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    },
    saved: true,
    location: 'Santorini, Greece',
    temperature: 34,
    title: 'Santorini',
    description: 'Santorini - Description',
    rating: 3.2,
    reviews: 3212,
    preview:
      'https://images.unsplash.com/photo-1507501336603-6e31db2be093?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1507501336603-6e31db2be093?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1507501336603-6e31db2be093?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1507501336603-6e31db2be093?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1507501336603-6e31db2be093?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    id: 4,
    user: {
      name: 'Lelia Chavez',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    },
    location: 'Loutraki, Greece',
    temperature: 34,
    title: 'Loutraki',
    description: 'This attractive small town, 80 kilometers from Athens',
    rating: 5,
    reviews: 3212,
    preview:
      'https://images.unsplash.com/photo-1458906931852-47d88574a008?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1458906931852-47d88574a008?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1446903572544-8888a0e60687?auto=format&fit=crop&w=800&q=80',
    ],
  },
];
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
  recommended: {},
  recommendedHeader: {
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: theme.sizes.padding2,
  },
  recommendedList: {},
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
    width: theme.sizes.padding2,
    height: theme.sizes.padding2,
    borderRadius: theme.sizes.padding2 / 2,
  },
  rating: {
    fontSize: theme.sizes.font * 2,
    color: theme.colors.white,
    fontWeight: 'bold',
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

  static navigationOptions = {
    header: (
      <View style={[styles.flex, styles.row, styles.header]}>
        <View>
          <Text style={{color: theme.colors.caption}}>Search for place</Text>
          <Text style={{fontSize: theme.sizes.font * 2}}>Địa điểm nổi bật</Text>
        </View>
        <View>
          <Image
            style={styles.avatar}
            source={{
              uri: 'https://myfreshfruits.000webhostapp.com/default_avatar.png',
            }}
          />
        </View>
      </View>
    ),
  };

  renderDots() {
    const {destinations} = this.state;
    const dotPosition = Animated.divide(this.scrollX, width);
    return (
      <View
        style={[
          styles.flex,
          styles.row,
          {justifyContent: 'center', alignItems: 'center', marginTop: 10},
        ]}>
        {destinations.map((item, index) => {
          const borderWidth = dotPosition.interpolate({
            inputRange: [index - 1, index, index + 1],
            outputRange: [0, 2.5, 0],
            extrapolate: 'clamp',
          });
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
          data={this.state.destinations}
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
        activeOpacity={0.8}
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
              ]}>
              <Text style={{color: theme.colors.white}}>
                <Octicons
                  name="location"
                  size={theme.sizes.font * 0.8}
                  color={theme.colors.white}
                />
                <Text> {item.location}</Text>
              </Text>
            </View>
            <View
              style={{
                flex: 0,
                justifyContent: 'center',
                alignItems: 'flex-end',
              }}>
              <Text style={styles.rating}>{item.rating}</Text>
            </View>
          </View>
        </ImageBackground>
        <View style={[styles.column, styles.destinationInfo, styles.shadow]}>
          <Text
            style={{
              fontSize: theme.sizes.font * 1.25,
              fontWeight: '500',
              paddingBottom: 8,
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
    return (
      <View style={[styles.flex, styles.column, styles.recommended]}>
        <View style={[styles.row, styles.recommendedHeader]}>
          <Text style={{fontSize: theme.sizes.font * 1.4}}>Recommended</Text>
          <TouchableOpacity activeOpacity={0.5}>
            <Text style={{color: theme.colors.caption}}>More</Text>
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
            data={this.state.destinations}
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
    const {destinations} = this.props;
    const isLastItem = index === destinations.length - 1;
    return (
      <View
        style={[
          styles.flex,
          styles.column,
          styles.recommendation,
          styles.shadow,
          index === 0 ? {marginLeft: theme.sizes.margin} : null,
          isLastItem ? {marginRight: theme.sizes.margin / 2} : null,
        ]}>
        <View style={[styles.flex, styles.recommendationHeader]}>
          <Image
            style={[styles.recommendationImage]}
            source={{uri: item.preview}}
          />
          <View style={[styles.flex, styles.row, styles.recommendationOptions]}>
            <Text style={styles.recommendationTemp}>{item.temperature}℃</Text>
            <FontAwesome
              name={item.saved === '1' ? 'bookmark' : 'bookmark-o'}
              color={theme.colors.white}
              size={theme.sizes.font * 1.25}
            />
          </View>
        </View>
        <View
          style={[
            styles.flex,
            styles.column,
            styles.shadow,
            {
              justifyContent: 'space-evenly',
              padding: theme.sizes.padding2 / 2,
            },
          ]}>
          <Text
            style={{
              fontSize: theme.sizes.font * 1.25,
              fontWeight: '500',
              paddingBottom: theme.sizes.padding2 / 4.5,
            }}>
            {item.title}
          </Text>
          <Text style={{color: theme.colors.caption}}>{item.location}</Text>
          <View
            style={[
              styles.row,
              {
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: theme.sizes.margin,
              },
            ]}>
            {this.renderRatings(item.rating)}
            <Text style={{color: theme.colors.active}}>{item.rating}</Text>
          </View>
        </View>
      </View>
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

Articles.defaultProps = {
  destinations: mocks,
};

export default Articles;

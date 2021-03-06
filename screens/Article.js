import React, {Component} from 'react';
import {
  Text,
  StyleSheet,
  View,
  Animated,
  Image,
  Dimensions,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {Divider, Button} from '../components';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import NumberFormat from 'react-number-format';
import {theme} from '../constants';
import LinearGradient from 'react-native-linear-gradient';
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
    // backgroundColor: 'transparent',
    paddingHorizontal: theme.sizes.padding,
    paddingTop: theme.sizes.padding,
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  back: {
    width: theme.sizes.base * 3,
    height: theme.sizes.base * 3,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  content: {
    backgroundColor: theme.colors.active,
    borderTopLeftRadius: theme.sizes.border,
    borderTopRightRadius: theme.sizes.border,
  },
  contentHeader: {
    backgroundColor: 'transparent',
    padding: theme.sizes.padding,
    backgroundColor: theme.colors.white,
    borderTopLeftRadius: theme.sizes.radius,
    borderTopRightRadius: theme.sizes.radius,
    marginTop: -theme.sizes.padding / 2,
  },
  shadow: {
    shadowColor: theme.colors.black,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.5,
    shadowRadius: 5,
  },
  dotsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 36,
    right: 0,
    left: 0,
  },
  dots: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 6,
    backgroundColor: theme.colors.gray,
  },
  title: {
    fontSize: theme.sizes.font * 2,
    fontWeight: 'bold',
  },
  price: {
    fontSize: theme.sizes.font * 1.5,
    color: theme.colors.primary,
    paddingTop: theme.sizes.base / 4,
  },
  description: {
    fontSize: theme.sizes.font * 1.2,
    lineHeight: theme.sizes.font * 2,
    color: theme.colors.caption,
    textAlign: 'justify',
  },
});

class Article extends Component {
  scrollX = new Animated.Value(0);

  static navigationOptions = ({navigation}) => {
    return {
      header: (
        <View style={[styles.flex, styles.row, styles.header]}>
          <TouchableOpacity
            style={styles.back}
            onPress={() => navigation.goBack()}>
            <FontAwesome
              name="chevron-left"
              color={theme.colors.white}
              size={theme.sizes.font * 1}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <MaterialIcons
              name="more-horiz"
              color={theme.colors.white}
              size={theme.sizes.font * 1.5}
            />
          </TouchableOpacity>
        </View>
      ),
      headerTransparent: true,
    };
  };

  renderDots = () => {
    const {navigation} = this.props;
    const article = navigation.getParam('article');
    var parsedImg = JSON.parse(article.images.replace(/\'/g, '"'));
    var images = [];
    for (var i in parsedImg) {
      images.push(parsedImg[i]);
    }
    const dotPosition = Animated.divide(this.scrollX, width);

    return (
      <View style={[styles.flex, styles.row, styles.dotsContainer]}>
        {images.map((item, index) => {
          const opacity = dotPosition.interpolate({
            inputRange: [index - 1, index, index + 1],
            outputRange: [0.5, 1, 0.5],
            extrapolate: 'clamp',
          });
          return (
            <Animated.View
              key={`step-${item}-${index}`}
              style={[styles.dots, {opacity}]}
            />
          );
        })}
      </View>
    );
  };

  renderRatings = rating => {
    const stars = new Array(5).fill(0);
    return stars.map((_, index) => {
      const activeStar = Math.floor(rating) >= index + 1;
      return (
        <FontAwesome
          name="star"
          key={`star-${index}`}
          size={theme.sizes.font}
          color={theme.colors[activeStar ? 'primary' : 'gray']}
          style={{marginRight: 4}}
        />
      );
    });
  };

  render() {
    const {navigation} = this.props;
    const article = navigation.getParam('article');
    var parsedImg = JSON.parse(article.images.replace(/\'/g, '"'));
    var images = [];
    for (var i in parsedImg) {
      images.push(parsedImg[i]);
    }
    let tourAdd = {
      id: article.id,
      title: article.title,
      price: article.price,
      preview: article.preview,
      location: article.location,
      quantity: 1,
    };

    return (
      <View style={styles.flex}>
        <View style={[styles.flex]}>
          <ScrollView
            horizontal
            pagingEnabled
            scrollEnabled
            showsHorizontalScrollIndicator={false}
            decelerationRate={0}
            scrollEventThrottle={16}
            snapToAlignment="center"
            onScroll={Animated.event([
              {nativeEvent: {contentOffset: {x: this.scrollX}}},
            ])}>
            {images.map((img, index) => (
              <Image
                key={`${index}-${img}`}
                source={{uri: img}}
                resizeMode="cover"
                style={{width: width, height: height / 2.2}}
              />
            ))}
          </ScrollView>
          {this.renderDots()}
        </View>
        <View style={[styles.flex]}>
          <View style={[styles.flex, styles.contentHeader]}>
            <Text style={styles.title}>{article.title}</Text>
            <NumberFormat
              value={article.price}
              displayType={'text'}
              thousandSeparator={true}
              suffix={' VND'}
              renderText={value => <Text style={styles.price}>{value}</Text>}
            />

            <View
              style={[
                styles.row,
                {alignItems: 'center', marginVertical: theme.sizes.margin / 4},
              ]}>
              {this.renderRatings(article.rating)}
              <Text style={{color: theme.colors.active}}>{article.rating}</Text>
              <Text style={{marginLeft: 8, color: theme.colors.caption}}>
                ({article.reviews} nhận xét)
              </Text>
            </View>
            <Divider margin={[theme.sizes.base / 2, theme.sizes.base / 4]} />
            <TouchableOpacity>
              <Text style={styles.description}>
                {article.description.split('').slice(0, 120)}...
                <Text style={{color: theme.colors.active}}> Đọc tiếp</Text>
              </Text>
            </TouchableOpacity>
            <Divider margin={[theme.sizes.base / 4, theme.sizes.base / 4]} />
            <View style={{justifyContent: 'center'}}>
              <Button
                gradient
                onPress={() => navigation.navigate('Cart', {tour: tourAdd})}>
                <Text
                  style={{
                    color: theme.colors.white,
                    textAlign: 'center',
                    fontSize: theme.sizes.font * 1.3,
                  }}>
                  Thêm vào giỏ hàng
                </Text>
              </Button>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

export default Article;

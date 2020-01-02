import React, {Component} from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  View,
  FlatList,
} from 'react-native';

import {Block, Text} from '../components';
import {theme} from '../constants';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Octicons from 'react-native-vector-icons/Octicons';
const {width} = Dimensions.get('window');
import NumberFormat from 'react-number-format';
class Browse extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: 'Tất cả',
      destinations: [],
      constants: [],
    };
  }

  componentDidMount() {
    const {navigation} = this.props;
    const tours = navigation.getParam('tours');
    this.setState({
      destinations: tours,
      constants: tours,
    });
  }

  handleTab = tab => {
    const {constants} = this.state;
    const filtered = constants.filter(tour => {
      var parsedTag = JSON.parse(tour.tags.replace(/\'/g, '"'));
      var currentTab = [];
      for (var i in parsedTag) {
        currentTab.push(parsedTag[i]);
      }
      if (currentTab.includes(tab)) return tour;
    });
    console.log(filtered);
    this.setState({active: tab, destinations: filtered});
    console.log(this.state.destinations.length);
  };

  renderTab(tab) {
    const {active} = this.state;
    const isActive = active === tab;

    return (
      <TouchableOpacity
        key={`tab-${tab}`}
        onPress={() => this.handleTab(tab)}
        style={[styles.tab, isActive ? styles.active : null]}>
        <Text
          size={width > 900 ? 20 : 12}
          medium
          gray={!isActive}
          secondary={isActive}>
          {tab}
        </Text>
      </TouchableOpacity>
    );
  }

  renderRecommendation = (item, index) => {
    const {navigation} = this.props;
    const isLastItem = index === this.state.destinations.length - 1;
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => navigation.navigate('Article', {article: item})}>
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
                justifyContent: 'space-evenly',
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
                    marginTop: theme.sizes.margin / 4,
                  }}>
                  {value}
                </Text>
              )}
            />

            <View
              style={[
                styles.row,
                {
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: theme.sizes.margin / 4,
                  flex: 1,
                  justifyContent: 'flex-end',
                },
              ]}>
              {this.renderRatings(item.rating)}
              <Text style={{color: theme.colors.active, paddingHorizontal: 4}}>
                {item.rating}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

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

  render() {
    const {navigation} = this.props;
    const {destinations} = this.state;
    console.log(this.state.destinations);
    //const tabs = ['Products', 'Inspirations', 'Shop'];
    const tabs = ['Tất cả', 'Khám phá', 'Nghỉ dưỡng', 'Trải nghiệm'];

    return (
      <Block>
        <Block flex={false} row center space="between" style={styles.header}>
          <Text h1 bold>
            Khám phá
          </Text>
        </Block>

        <Block flex={false} row style={styles.tabs}>
          {tabs.map(tab => this.renderTab(tab))}
        </Block>

        <ScrollView
          showsVerticalScrollIndicator={true}
          style={{paddingVertical: theme.sizes.base * 2}}>
          <Block flex={false} row space="between" style={styles.categories}>
            {destinations.map(tour => this.renderRecommendation(tour))}
          </Block>
        </ScrollView>
      </Block>
    );
  }
}

export default Browse;

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
  recommendation: {
    width: width - theme.sizes.padding2 * 2,
    marginHorizontal: 8,
    backgroundColor: theme.colors.white,
    overflow: 'hidden',
    borderRadius: theme.sizes.radius2,
    marginVertical: theme.sizes.margin * 0.5,
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
    width: width - theme.sizes.padding2 * 2,
    height: (width - theme.sizes.padding2 * 2) / 1.5,
  },
  header: {
    paddingHorizontal: theme.sizes.base * 2,
  },
  avatar: {
    height: theme.sizes.base * 2.2,
    width: theme.sizes.base * 2.2,
  },
  tabs: {
    borderBottomColor: theme.colors.gray2,
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginVertical: theme.sizes.base,
    marginHorizontal: theme.sizes.base * 1.8,
  },
  tab: {
    marginRight: theme.sizes.base * 2,
    paddingBottom: theme.sizes.base,
  },
  active: {
    borderBottomColor: theme.colors.secondary,
    borderBottomWidth: 3,
  },
  categories: {
    flexWrap: 'wrap',
    paddingHorizontal: theme.sizes.base * 2,
    marginBottom: theme.sizes.base * 3.5,
  },
  category: {
    // this should be dynamic based on screen width
    minWidth: (width - theme.sizes.padding * 2.4 - theme.sizes.base) / 2,
    maxWidth: (width - theme.sizes.padding * 2.4 - theme.sizes.base) / 2,
    maxHeight: (width - theme.sizes.padding * 2.4 - theme.sizes.base) / 2,
  },
  destinations: {
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: 30,
  },
});

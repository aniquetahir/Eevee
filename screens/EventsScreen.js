import React from 'react';
import { ScrollView, StyleSheet, Text, Button, View } from 'react-native';
import { Card, CardTitle, CardContent, CardAction, CardButton, CardImage } from 'react-native-cards';
import _ from 'lodash';

let navi = null;
class Header extends React.Component{
    _onFilter(){
        if(!_.isNil(navi))
            navi.navigate('Filter');
    }
    render() {
        return (
            <View style={{flex:1, flexDirection: 'row', justifyContent: 'space-between', padding: 10}} >
                <Text style={{width: '50%',fontSize: 20, fontWeight: 'bold', alignSelf: 'stretch'}}>Events</Text>
                <Button title='Filter' onPress={()=>this._onFilter()}/>
            </View>
        );
    }
}

class EventItem extends React.Component{
  render() {
    return (
        <Card>
          <CardImage
              source={{uri: 'http://bit.ly/2GfzooV'}}
              title="Test Event"
          />
          <CardTitle
              subtitle="Distance: 0.5mi"
          />
          <CardContent text="Vacancy 2/10" />
          <CardAction
              separator={true}
              inColumn={false}>
            <CardButton
                onPress={() => {}}
                title="Join"
                color="#FEB557"
            />
          </CardAction>
        </Card>
    );
  }
}

export default class EventsScreen extends React.Component {
  static navigationOptions = {
    headerTitle: <Header />,
  };
  componentDidMount() {
      navi = this.props.navigation;
  }

  componentWillUnmount() {
      navi = null;
  }

    render() {
    return (
      <ScrollView style={styles.container}>
        {/* Go ahead and delete ExpoLinksView and replace it with your
           * content, we just wanted to provide you with some helpful links */}
        <EventItem/>
        <EventItem/>
        <EventItem/>
        <EventItem/>
        <EventItem/>

      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
});

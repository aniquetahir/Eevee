import React from 'react';
import {ScrollView, StyleSheet, Text, Button, View, AsyncStorage} from 'react-native';
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
      let {name, distance, vacancy, capacity, num_participants, datetime} = this.props;
      let date = Date.parse(datetime);

    return (
        <Card>
          <CardImage
              source={{uri: 'http://bit.ly/2GfzooV'}}
              title={name}

          />
          <CardTitle
              subtitle={`Distance: ${_.round(distance, 2)} km`}
          />
            <CardContent text={(vacancy)?`Vacancy: ${vacancy}/${capacity}`:`Participants: ${num_participants}`} >
            </CardContent>
            <Text>Date: {datetime}</Text>
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

  constructor(){
      super();
      this.state={
          location: null,
          events: []
      }
  }
  componentDidMount() {
      navi = this.props.navigation;
      //console.log(navigator.geolocation);
      navigator.geolocation.getCurrentPosition(position => {
          this.setState({
              location: {
                  latitude: position.coords.latitude,
                  longitude: position.coords.longitude
              }
          });

          this.loadEvents(position.coords);

      });
  }

    loadUser = async ()=>{
        const user_details = await AsyncStorage.getItem('user_details');
        this.setState({
            user:{...JSON.parse(user_details)}
        });
    };

  async loadEvents(position){
      try {
          let {latitude, longitude} = position;

          let response = await fetch(`https://teamup-cc-546.appspot.com/get-nearby-events?location_coords=${latitude},${longitude}`, {
              method: 'GET',
              headers: {
                  Auth: 'lvargis@asu.edu',
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
              }
          });
          let responseJson = await response.json();
          this.setState({
              events: responseJson
          });



      }catch (e) {
          console.log(e);
      }

  }

  componentWillUnmount() {
      navi = null;
  }

    render() {
        let event_items = this.state.events.map((event, i)=>{
            return (
                <EventItem
                        key={i}
                        name={event.name}
                           distance={event.distance}
                           vacancy={_.isUndefined(event.vacancy)?null:event.vacancy}
                           capacity={event.max}
                           num_participants={event.count_of_participants}
                           datetime={event.datetime}
                />
            );
        });
        return (
        <ScrollView style={styles.container}>
        {/* Go ahead and delete ExpoLinksView and replace it with your
           * content, we just wanted to provide you with some helpful links */}
            {event_items}
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

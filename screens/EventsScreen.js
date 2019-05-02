import React from 'react';
import {ScrollView, StyleSheet, Text, Button, View, AsyncStorage} from 'react-native';
import { Card, CardTitle, CardContent, CardAction, CardButton, CardImage } from 'react-native-cards';
import _ from 'lodash';

let navi = null;

const serialize = function(obj) {
    let str = [];
    for (let p in obj)
        if (obj.hasOwnProperty(p)) {
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        }
    return str.join("&");
};


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

    async callAPI(url, params, method){
        let encoded_params = serialize(params);

        if(method!=='POST'){
            let response = await fetch(`${url}?${encoded_params}`, {
                method: method,
                headers: {
                    Auth: this.props.user.email,
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                }
            });
            return response;
        }else {
            let response = await fetch(url, {
                method: 'POST',
                headers: {
                    Auth: this.props.user.email,
                    Accept: 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: encoded_params,
            });
            return response;
        }

    }

    async onJoinEvent(){
        let response = await this.callAPI('https://teamup-cc-546.appspot.com/add-event-user', {event_id: this.props.event_id},'GET');
        console.log(response);
        this.props.parent.componentDidMount();
        //this.props.navigation.navigate('Events');
    }

    async onLeaveEvent(){
        let response = await this.callAPI('https://teamup-cc-546.appspot.com/cancel-event-participation', {event_id: this.props.event_id},'GET');
        console.log(response);
        this.props.parent.componentDidMount();
        //this.props.navigation.navigate('Events');
    }


    async onRemoveEvent(){
        let response = await this.callAPI('https://teamup-cc-546.appspot.com/delete-event', {event_id: this.props.event_id},'DELETE');
        console.log(response);
        this.props.parent.componentDidMount();
        //this.props.navigation.navigate('Events');
    }


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
                    {this.props.is_owner?
                        (<CardButton
                              onPress={() => {this.onRemoveEvent()}}
                              title="Delete"
                              color="#FEAAAA"
                        />):this.props.is_joined?(
                          <CardButton
                              onPress={() => {this.onLeaveEvent()}}
                              title="Leave"
                              color="#FEB557"
                          />
                        ):(
                          <CardButton
                              onPress={() => {this.onJoinEvent()}}
                              title="Join"
                              color="#FEB557"
                          />
                )}

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
          events: [],
          user:null
      }
  }



  componentDidMount() {
      navi = this.props.navigation;
      this.loadUser();
      //console.log(navigator.geolocation);
      navigator.geolocation.getCurrentPosition(position => {
          this.setState({
              location: {
                  latitude: position.coords.latitude,
                  longitude: position.coords.longitude
              }
          });

          this.loadEvents(position.coords);

      }, ()=>{}, {enableHighAccuracy: false, timeout: 10000, maximumAge: 0});
  }

    loadUser = async ()=>{
        const user_details = await AsyncStorage.getItem('user_details');
        this.setState({
            user:{...JSON.parse(user_details)}
        });
    };

  async loadEvents(position){
      if(!this.state.user){
          return;
      }
      try {
          let {latitude, longitude} = position;

          let response = await fetch(`https://teamup-cc-546.appspot.com/get-nearby-events?location_coords=${latitude},${longitude}`, {
              method: 'GET',
              headers: {
                  Auth: this.state.user.email,
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
                        is_joined={event.is_joined}
                        is_owner={event.is_owner}
                        event_id={event.event_id}
                        location_coords={event.location_coords}
                        location_name={event.location_name}
                        user={this.state.user}
                        parent={this}

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

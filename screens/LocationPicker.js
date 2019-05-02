import React, {Component} from 'react';
import {Image, Text, TextInput, View, ScrollView, Button, TouchableNativeFeedback, AsyncStorage} from 'react-native';
import _ from 'lodash';

const main_view_style = {
    padding: 10,
};

const start_select_style = {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    maxHeight: 55
};

class LocationItem extends Component{
    async setPickedLocation(location){
        await AsyncStorage.setItem('location_cache', JSON.stringify(location));
        this.props.navigation.navigate('Create');
    }


    render() {
        const card_style = {
            flex: 1,
            flexDirection: 'row',
            alignContent: 'stretch',
            margin: 10
        };

        const description_style = {
            flex: 1,
            flexDirection: 'column',
            padding: 10
        };

        return (
            <TouchableNativeFeedback onPress={()=>this.setPickedLocation({name: this.props.name, coordinates: this.props.location_coords})} >
            <View style={card_style} >
                <Image style={{width: 60, height: 60}} source={require('../assets/images/icon.png')} />
                <View style={description_style}>
                    <Text style={{fontWeight: 'bold'}}>{this.props.name}</Text>
                    <Text>Distance: {_.round(this.props.distance,3)}</Text>
                </View>
            </View>
            </TouchableNativeFeedback>
        );
    }
}

export default class LocationPicker extends Component{

    constructor(props){
        super(props);
        this.state = {
            kw: '',
            locations: []
        }
    }

    componentDidMount(){
        this.getLocations();
    }

    async setNewLocation(position, category){
        let latlng = `${position.coords.latitude},${position.coords.longitude}`;
        console.log(`https://teamup-cc-546.appspot.com/get-locations?location=${latlng}&category=${category}`,{
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }
        });
        let response = await fetch(`https://teamup-cc-546.appspot.com/get-locations?location=${latlng}&category=${category}`);
        let r = await response.json();
        console.log(r);
        this.setState({
            locations: r
        });
    }

    async getLocations(){
        let create_state = await AsyncStorage.getItem('create_cache');
        create_state = JSON.parse(create_state);
        navigator.geolocation.getCurrentPosition(position => {
            this.setNewLocation(position, create_state.category);
        })

    }

    filterLocations(keyword){
        let kw = _.toLower(keyword);
        let results = this.state.locations.filter(loc=>{
            return _.toLower(loc.name).indexOf(kw)!==-1
        });



        return results;
    }

    render() {
        let filtered_locations = this.state.locations;
        if(this.state.kw !== ''){
            filtered_locations = this.filterLocations(this.state.kw);
        }

        let locations_array = filtered_locations.map((location, i)=>{
            return (<LocationItem key={i} navigation={this.props.navigation} {...location} />);

        });
        return (
            <View style={{height: '100%', width: '100%'}}>
                <ScrollView style={main_view_style}>
                    <TextInput
                        style={{minWidth: '50%', backgroundColor: 'rgba(0,0,0,0.1)', flexGrow: 1, marginBottom: 20}}
                        onChangeText={text=>this.setState({kw: text})}
                        placeholder="e.g. Gammage Theatre"  />
                    {locations_array}


                </ScrollView>
                <View style={start_select_style}>
                    {/*<Button title='Select' onPress={()=>{}}/>*/}
                    <Button title='Cancel' onPress={()=>this.props.navigation.navigate('Create')}/>
                </View>
            </View>
        );
    }
}


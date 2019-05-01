import React, {Component} from 'react';
import {Image, Text, TextInput, View, ScrollView, Button, TouchableNativeFeedback, AsyncStorage} from 'react-native';

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
            <TouchableNativeFeedback onPress={()=>this.setPickedLocation({name: 'Location Name', coordinates: [0,0]})} >
            <View style={card_style} >
                <Image style={{width: 60, height: 60}} source={require('../assets/images/icon.png')} />
                <View style={description_style}>
                    <Text style={{fontWeight: 'bold'}}>Location Name</Text>
                    <Text>Distance: 0.5mi</Text>
                </View>
            </View>
            </TouchableNativeFeedback>
        );
    }
}

export default class LocationPicker extends Component{
    render() {
        return (
            <View style={{height: '100%', width: '100%'}}>
                <ScrollView style={main_view_style}>
                    <TextInput
                        style={{minWidth: '50%', backgroundColor: 'rgba(0,0,0,0.1)', flexGrow: 1, marginBottom: 20}}
                        onChangeText={text=>{}}
                        placeholder="e.g. Gammage Theatre"  />
                    <LocationItem {...this.props} />
                    <LocationItem {...this.props} />
                    <LocationItem {...this.props} />
                    <LocationItem {...this.props} />
                    <LocationItem {...this.props} />
                    <LocationItem {...this.props} />
                    <LocationItem {...this.props} />
                    <LocationItem {...this.props} />
                    <LocationItem {...this.props} />
                    <LocationItem {...this.props} />
                    <LocationItem {...this.props} />


                </ScrollView>
                <View style={start_select_style}>
                    {/*<Button title='Select' onPress={()=>{}}/>*/}
                    <Button title='Cancel' onPress={()=>this.props.navigation.navigate('Create')}/>
                </View>
            </View>
        );
    }
}


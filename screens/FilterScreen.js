import React, {Component} from 'react';
import {View, Text, TextInput, Picker, Button} from 'react-native';

export default class FilterScreen extends Component{
    static navigationOptions= {
        title: 'Filter'
    };

    render() {
        return (
            <View>
                <Text>Filter Events</Text>

                <Text>Name:</Text>
                <TextInput placeholder="Event Name" />

                <Text>Vacancy:</Text>
                <Text>{">"}</Text><TextInput placeholder="Event Name" keyboardType="numeric" />

                <Text>Distance:</Text>
                <Text>{"<"}</Text><TextInput placeholder="Event Name" keyboardType="numeric" />

                <Text>Type</Text>
                <Picker>
                    <Picker.Item label="Sports" value="sports" />
                    <Picker.Item label="Theatre" value="theatre" />
                    <Picker.Item label="Food" value="food" />
                </Picker>

                <Button title='Save' onPress={()=>this.props.navigation.navigate('Events')}/>
            </View>
        );
    }
}
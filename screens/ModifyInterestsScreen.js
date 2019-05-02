import React, {Component} from 'react';
import {View, ScrollView, Button, Text} from 'react-native';


class InterestView extends Component{
    render(){
        return (
            <View>
                <Text>Day: </Text><Text>{this.props.day}</Text>
                <Text>Time of Day: </Text><Text>{this.props.tod}</Text>
                <Text>Category: </Text><Text>{this.props.category}</Text>
                <Button title='Delete' onPress={()=>{}} />
            </View>
        );
    }
}

export default class ModifyInterestsScreen extends Component{
    constructor(){
        super();
        this.state = {
            interests: [
                {
                    day: 'Monday',
                    tod: 'Evening',
                    category: 'Sports'
                },
                {
                    day: 'Monday',
                    tod: 'Morning',
                    category: 'Sports'
                }
            ]
        }

    }
    render(){

        return (
            <ScrollView>
                <Button title="Back" onPress={()=>this.props.navigation.navigate("Home")}/>
                <Button title="Add Interest" onPress={()=>this.props.navigation.navigate("AddInterests")}/>
                {this.state.interests.map((interest, i)=>{
                    return (<InterestView key={i} {...interest} />);
                })}
            </ScrollView>
        );
    }
};
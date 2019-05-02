import React, {Component} from 'react';
import {Button, View, ScrollView, Text, TextInput, Picker} from 'react-native';

const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday"
];


const times_of_day = [
    ["Morning", "morn"],
    ["Evening", "eve"]
];


const categories = [
    "Sports",
    "Food",
    "Film"
];

export default class AddInterestScreen extends Component{
    constructor(){
        super();
        this.state = {
            day: days[0],
            tod: times_of_day[0][1],
            category: categories[0]
        }
    }
    render(){
        return (
            <ScrollView>

                <Text>Day: </Text>
                <Picker selectedValue={this.state.day} onValueChange={newVal=>this.setState({day: newVal})}>
                    {days.map((day, i)=>{
                        return (
                            <Picker.Item key={i} label={day} value={day} />
                        );
                    })}
                </Picker>

                <Text>Time of Day: </Text>
                <Picker selectedValue={this.state.tod} onValueChange={newVal=>this.setState({tod: newVal})}>
                    {times_of_day.map((tod_set, i)=>{
                        return (
                            <Picker.Item key={i} label={tod_set[0]} value={tod_set[1]} />
                        );
                    })}
                </Picker>

                <Text>Category: </Text>
                <Picker selectedValue={this.state.category} onValueChange={newVal=>this.setState({category: newVal})}>
                    {categories.map((cat, i)=>{
                        return (
                            <Picker.Item key={i} label={cat} value={cat} />
                        );
                    })}
                </Picker>

                <Button title="Save" onPress={()=>{}}/>
                <Button title="Back" onPress={()=>this.props.navigation.navigate("Interests")}/>

            </ScrollView>
        );
    }
}
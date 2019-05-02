import React, {Component} from 'react';
import {Button, View, ScrollView, Text, TextInput, Picker, AsyncStorage} from 'react-native';
import _ from 'lodash';

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
    constructor(props){
        super(props);
        this.state = {
            day: days[0],
            tod: times_of_day[0][1],
            category: categories[0],
            radius: 1.5,
            user: null
        }
    }
    getPosition(){
        console.log(navigator);
        return new Promise((res, rej)=>{
            navigator.geolocation.getCurrentPosition(position => {
                res(position.coords);
            });
        });
    }

    loadUser = async ()=>{
        const user_details = await AsyncStorage.getItem('user_details');
        this.setState({
            user:{...JSON.parse(user_details)}
        });
    };

    componentDidMount(){
        this.loadUser();
    }

    async onAddInterests(){
        // "category": "string",
        // "location": "string",
        // "radius": "string (in km)",
        // "time_tag": "string (eg: sat-eve)"

        let category = _.toLower(this.state.category);
        let position = await this.getPosition();
        let location = `${position.latitude},${position.longitude}`;
        let radius = this.state.radius;
        let time_tag = `${_.toLower(_.join(_.take(this.state.day,3), ''))}-${this.state.tod}`;

        const serialize = function(obj) {
            let str = [];
            for (let p in obj)
                if (obj.hasOwnProperty(p)) {
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                }
            return str.join("&");
        };

        console.log(serialize({
            category,
            location,
            radius,
            time_tag
        }));

        let response = await fetch('https://teamup-cc-546.appspot.com/create-interest', {
            method: 'POST',
            headers: {
                Auth: this.state.user.email,
                Accept: 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: serialize({
                category,
                location,
                radius,
                time_tag
            }),
        });

        console.log(response);
        this.props.navigation.navigate("Interests");
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

                <Text>Radius: </Text>
                <TextInput  keyboardType='decimal-pad' onChangeText={text=>this.setState({radius: parseFloat(text)})}
                            value={(_.isNaN(this.state.radius))?'0':this.state.radius.toString()} />

                <Button title="Save" onPress={()=>{this.onAddInterests();}}/>
                <Button title="Back" onPress={()=>this.props.navigation.navigate("Interests")}/>

            </ScrollView>
        );
    }
}
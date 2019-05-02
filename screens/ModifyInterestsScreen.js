import React, {Component} from 'react';
import {View, ScrollView, Button, Text, AsyncStorage} from 'react-native';

const serialize = function(obj) {
    let str = [];
    for (let p in obj)
        if (obj.hasOwnProperty(p)) {
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        }
    return str.join("&");
};

const days = {
    "sun": "Sunday",
    "mon": "Monday",
    'tue': "Tuesday",
    'wed': "Wednesday",
    'thu': "Thursday",
    'fri': "Friday",
    'sat': "Saturday"
};

const tods = {
    'morn': "Morning",
    'eve': "Evening"
};

class InterestView extends Component{

    render(){
        let [day, tod] = this.props.time_tag.split('-');
        day = days[day];
        tod = tods[tod];
        return (
            <View>
                <Text>Day: </Text><Text>{day}</Text>
                <Text>Time of Day: </Text><Text>{tod}</Text>
                <Text>Category: </Text><Text>{this.props.category}</Text>
                <Text>Radius: </Text><Text>{this.props.radius}</Text>
                <Button title='Delete' onPress={()=>{this.props.onDelete(this.props.id)}} />
            </View>
        );
    }
}

export default class ModifyInterestsScreen extends Component{
    constructor(props){
        super(props);
        this.state = {
            interests: [],
            user: null
        }

    }

    loadUser = async ()=>{
        const user_details = await AsyncStorage.getItem('user_details');
        this.setState({
            user:{...JSON.parse(user_details)}
        });
    };

    async callAPI(url, params, method){
        let encoded_params = serialize(params);

        if(method!=='POST'){
            let response = await fetch(`${url}?${encoded_params}`, {
                method: method,
                headers: {
                    Auth: this.state.user.email,
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                }
            });
            return response;
        }else {
            let response = await fetch(url, {
                method: 'POST',
                headers: {
                    Auth: this.state.user.email,
                    Accept: 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: encoded_params,
            });
            return response;
        }

    }

    componentDidMount() {
        this.loadUser().then(()=>{
            this.loadInterests();
        });


    }

    async loadInterests(){
        let response = await this.callAPI('https://teamup-cc-546.appspot.com/get-interests', {}, 'GET');
        let responseJSON = await response.json();
        this.setState({
            interests: responseJSON
        });
    }

    async deleteInterest(id){
        let response = await this.callAPI('https://teamup-cc-546.appspot.com/delete-interest', {interest_id: id}, 'DELETE');
        this.loadInterests();
    }

    render(){

        return (
            <ScrollView>
                <Button title="Back" onPress={()=>this.props.navigation.navigate("Home")}/>
                <Button title="Add Interest" onPress={()=>this.props.navigation.navigate("AddInterests")}/>
                {this.state.interests.map((interest, i)=>{
                    return (<InterestView key={i} {...interest} onDelete={this.deleteInterest.bind(this)} />);
                })}
            </ScrollView>
        );
    }
};
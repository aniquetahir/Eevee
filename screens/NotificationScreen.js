import React, {Component} from 'react';
import {View, Text, ScrollView, AsyncStorage} from 'react-native';

const serialize = function(obj) {
    let str = [];
    for (let p in obj)
        if (obj.hasOwnProperty(p)) {
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        }
    return str.join("&");
};

const notificationStyle={
    padding: 10,
    border: 2,
    margin:2,
    borderColor: '#000',
    backgroundColor: 'rgba(0,0,0,0.2)'
};


class Notification extends Component{
    render(){
        return (
            <View style={notificationStyle}>
                <Text>{this.props.message}</Text>
            </View>
        );
    }
}

export default class NotificationScreen extends Component{
    static navigationOptions = {
        title: "Notifications",
    };

    constructor(props){
        super(props);
        this.state = {
            notifications: [],
            user: null,
        }
    }

    loadUser = async ()=>{
        const user_details = await AsyncStorage.getItem('user_details');
        this.setState({
            user:{...JSON.parse(user_details)}
        });
    };

    componentDidMount(){
        this.loadNotifications();
        this.loadUser()
    }

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

    async loadNotifications(){
        if(this.state.user) {
            let request = await this.callAPI('https://teamup-cc-546.appspot.com/get-notifications', {}, 'GET');
            console.log(request);
            let requestJSON = await request.json();

            this.setState({
                notifications: requestJSON
            });
        }

    }

    render(){
        return (
            <ScrollView>
                {this.state.notifications.map((notification, i)=>{
                    return (
                        <Notification key={i} {...notification} />
                    );
                })}
            </ScrollView>
        );
    }
}
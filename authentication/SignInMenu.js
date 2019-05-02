import React, {Component} from 'react';
import {View, Button, Text, Image, AsyncStorage} from 'react-native';
import {Google} from 'expo';
import _ from 'lodash';


const LoginPage = props => {
    const adminLogin = (
        <Button title="Dev Sign In" onPress={props.signInDev} />
    );
    return (
        <View>
            <Button title="Sign in with Google" onPress={props.signIn} />
            {__DEV__?adminLogin:null}
        </View>
    );
};

const serialize = function(obj) {
    let str = [];
    for (let p in obj)
        if (obj.hasOwnProperty(p)) {
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        }
    return str.join("&");
};

const WelcomePage = props => {
    return (
        <View>
            <Text>Welcome: {props.name}</Text>
            {/*<Image source={{ uri: props.photoUrl }} />*/}
            <Text>{JSON.stringify(props)}</Text>
        </View>
    );
};

class SignInMenu extends Component{
    constructor(props){
        super(props);
        this.state = {
            signedIn: false,
            name: '',
            email: '',
            photoUrl: ''
        }
    }

    componentDidMount() {
        this.checkStorage();
    }

    async callAPI(url, params, method){
        let encoded_params = serialize(params);

        if(method!=='POST'){
            let response = await fetch(`${url}?${encoded_params}`, {
                method: method,
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                }
            });
            return response;
        }else {
            let response = await fetch(url, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: encoded_params,
            });
            return response;
        }

    }

    getLocation(){
        return new Promise((res, rej)=>{
           navigator.geolocation.getCurrentPosition((position)=>{
              res(position.coords);
           });
        });
    }

    checkStorage = async () => {
        try {
            const user_details = await AsyncStorage.getItem('user_details');
            if(!_.isNil(user_details)){
                console.log(user_details);
                let user_details_obj = JSON.parse(user_details);
                let location = await this.getLocation();
                location = `${location.latitude},${location.longitude}`;
                let response = await this.callAPI('https://teamup-cc-546.appspot.com/login',
                    {name: user_details_obj.name , email:user_details_obj.email, location:location},
                    'POST');
                console.log(response);
                this.setState({
                    signedIn: true,
                    ...user_details
                });
                this.props.navigation.navigate('App');

            }
        }catch (e) {
            console.log(e);
        }

    };

    signInDev = async () => {
        this.setState({
            signedIn: true,
            name: 'Anique',
            email: 'admin@eevee',
            photoUrl: ''
        });
        await AsyncStorage.setItem('user_details', JSON.stringify({name: 'Anique', email: 'admin@eevee', photoUrl: ''}));
        let location = await this.getLocation();
        let response = await this.callAPI('https://teamup-cc-546.appspot.com/login',
            {name: user_details.name , email:user_details.email, location:location},
            'POST');
        this.props.navigation.navigate('App', {name: 'Anique', email: 'admin@eevee', photoUrl: ''});
    };

    signIn = async () => {
        try {
            const result = await Google.logInAsync({
               androidClientId: "581473129650-upiuaqc5vp9b1op6un9kbqgaametnrcl.apps.googleusercontent.com",
               scopes: ["profile", "email"]
            });

            if(result.type === 'success'){
                this.setState({
                    signedIn: true,
                    ...result.user
                });
                let location = await this.getLocation();
                let response = await this.callAPI('https://teamup-cc-546.appspot.com/login',
                    {name: result.user.name , email:result.user.email, location:location},
                    'POST');
                await AsyncStorage.setItem('user_details', JSON.stringify(result.user));
                const {name, email, photoUrl} = result.user;
                this.props.navigation.navigate('App', {name, email, photoUrl});
            } else {
                console.log('cancelled')
            }
        } catch (error) {
            console.log("error", error);
        }
    };

    render() {
        return (
            <View>
                <LoginPage signIn = {this.signIn.bind(this)} signInDev={this.signInDev.bind(this)} />
            </View>
        );
    }
}

export default SignInMenu;
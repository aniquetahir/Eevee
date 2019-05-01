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

    checkStorage = async () => {
        try {
            const user_details = await AsyncStorage.getItem('user_details');
            if(!_.isNil(user_details)){
                console.log(user_details);
                this.setState({
                    signedIn: true,
                    ...user_details
                })
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
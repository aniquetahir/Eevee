import React, {Component} from 'react';
import {
    Text,
    TextInput,
    View,
    DatePickerAndroid,
    TimePickerAndroid,
    Button,
    ScrollView,
    AsyncStorage,
    Picker,
    ToastAndroid
} from 'react-native';
import _ from 'lodash';

const createStyle = {
    margin: 10,
    //flex: 1,
    //justifyContent: 'center'
};
const minRowHeight = 30;
const labelStyle = {
    fontSize: 14,
    fontWeight: 'bold',
    paddingRight: 10
};

const minMaxStyle = {
  minWidth: '20%',
};

const categories = [
    "Sports",
    "Food",
    "Film"
];

const rowStyle = {
    flex:1,
    flexDirection: 'row',
    //minHeight: minRowHeight,
    padding: 10,
    justifyContent: 'space-between'
};




class CreateScreen extends Component{
    static navigationOptions= {
        title: 'Create'
    };

    constructor(props){
        super(props);
        this.state = {
            name: null,
            category: 'sports',
            location: null,
            date: null,
            time: null,
            min: '',
            max: '',
            user: null
        }
    }

    async pickDate(){
        try {
            const {action, year, month, day} = await DatePickerAndroid.open({
                // Use `new Date()` for current date.
                // May 25 2020. Month 0 is January.
                date: new Date(),
            });
            if (action !== DatePickerAndroid.dismissedAction) {
                // Selected year, month (0-11), day
                this.setState({
                    date: [year, month, day]
                })
            }
        } catch ({code, message}) {
            console.warn('Cannot open date picker', message);
        }
    }

    async pickTime(){
        try {
            const {action, hour, minute} = await TimePickerAndroid.open({
                hour: 14,
                minute: 0,
                is24Hour: false, // Will display '2 PM'
            });
            if (action !== TimePickerAndroid.dismissedAction) {
                // Selected hour (0-23), minute (0-59)
                this.setState({
                    time: [hour, minute]
                })
            }
        } catch ({code, message}) {
            console.warn('Cannot open time picker', message);
        }
    }

    async pickLocation(){
        try {
            await AsyncStorage.setItem('create_cache', JSON.stringify(this.state));
            this.props.navigation.navigate('LocationPicker');
        }catch (e) {
            console.log(e);
        }

    }

    async restoreState(){
        try{
            let previousState = await AsyncStorage.getItem('create_cache');
            previousState = JSON.parse(previousState);
            this.setState({
                ...previousState
            });
            let cached_location = await AsyncStorage.getItem('location_cache');
            cached_location = JSON.parse(cached_location);
            this.setState({
                location: cached_location
            });

        }catch (e) {
            console.log(e);
        }
    }

    loadUser = async ()=>{
        const user_details = await AsyncStorage.getItem('user_details');
        this.setState({
            user:{...JSON.parse(user_details)}
        });
    };

    componentDidMount() {
        this.restoreState();
        this.loadUser();
    }

    async _onCancel(){
        try {
            await AsyncStorage.removeItem('create_cache');
            await AsyncStorage.removeItem('location_cache');
        }catch (e) {
            console.log(e);
        }
        this.props.navigation.navigate('App');
    }

    async onCreateEvent(){
        console.log('test');
        console.log(this.state);
        try {
            if(_.isNil(this.state.name) ||
                this.state.name==='' ||
                _.isNil(this.state.location) ||
                _.isNil(this.state.date) ||
                _.isNil(this.state.time)
            ){
                throw "Failed! Please Enter important Fields";
            }

            console.log(this.state);
            //"name": "string",
            const name = this.state.name;
            //"details": "string",
            const details = '';
            //"location-name": "string",
            const location_name = this.state.location.name;
            //"location": "string",
            const location = this.state.location.coordinates;
            //"min": "number",
            const min = this.state.min;
            //"max": "number",
            const max = this.state.max;
            //"datetime": "string, in the format M/d/Y hh:mm",
            const datetime = `${this.state.date[1]}/${this.state.date[2]}/${this.state.date[0]} ${this.state.time[0]}:${this.state.time[1]}`;
            //"category": "string"
            const category = this.state.category;

            console.log({
                name,
                details,
                location_name,
                location,
                min,
                max,
                datetime,
                category
            });
            //
            let serialize = function(obj) {
                let str = [];
                for (var p in obj)
                    if (obj.hasOwnProperty(p)) {
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    }
                return str.join("&");
            };

            let response = await fetch('https://teamup-cc-546.appspot.com/create-event', {
                method: 'POST',
                headers: {
                    Auth: this.state.user.email,
                    Accept: 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: serialize({
                    name,
                    details,
                    location_name,
                    location,
                    min,
                    max,
                    datetime,
                    category
                }),
            });

            console.log(response);
        }catch (e) {
            console.log(e);
            ToastAndroid.show(e, ToastAndroid.LONG)
        }finally {
            this.props.navigation.navigate("Home");
        }


    }

    render(){
        return (
            <ScrollView style={createStyle}>
                <View style={rowStyle}>
                    <Text style={labelStyle}>Event Name:</Text>
                    <TextInput
                        style={{minWidth: '50%', backgroundColor: 'rgba(0,0,0,0.1)', flexGrow: 1}}
                        onChangeText={text=>{this.setState({name: text});}}
                        value={this.state.name}
                        placeholder="Football, Golf, etc"  />
                </View>

                <View style={rowStyle}>
                    <Text style={labelStyle}>Category:</Text>
                    <Picker
                        selectedValue={this.state.category?this.state.category:"sports"}
                        style={{ minWidth: 200}}
                        onValueChange={itemValue =>
                            this.setState({category: itemValue})
                        }>

                            <Picker.Item label="Sports" value="sports" />
                            <Picker.Item label="Film" value="film" />
                            <Picker.Item label="Food" value="food" />

                    </Picker>
                </View>


                <View style={rowStyle}>
                    <Text style={labelStyle}>Location:</Text>
                    <Text>{_.isNil(this.state.location) ? 'No Location Selected' : this.state.location.name}</Text>
                    <Button title="Pick" onPress={() => this.pickLocation()}/>
                </View>

                <View style={rowStyle}>
                    <Text style={labelStyle}>Date:</Text>
                    <Text>
                        {_.isNil(this.state.date)?
                            'No Date Selected':
                            `${this.state.date[1]}/${this.state.date[2]}/${this.state.date[0]}`}
                    </Text><Button title="Pick" onPress={()=>this.pickDate()} />
                </View>

                <View style={rowStyle}>
                    <Text style={labelStyle}>Time:</Text>
                    <Text>{_.isNil(this.state.time)?
                        'No Time Selected':
                        `${this.state.time[0]}:${_.padStart(this.state.time[1].toString(),2,'0')}`}
                    </Text><Button title="Pick" onPress={()=>this.pickTime()} />
                </View>

                <View style={rowStyle}>
                    <Text style={labelStyle}>Capacity(Optional):</Text>
                    <TextInput
                        style={minMaxStyle}
                        keyboardType='numeric'
                        onChangeText={text=>this.setState({min: text})}
                        value={this.state.min}
                        placeholder="Min" />
                    <TextInput
                        style={minMaxStyle}
                        keyboardType='numeric'
                        onChangeText={text=>this.setState({max: text})}
                        value={this.state.max}
                        placeholder="Max" />
                </View>

                <View style={rowStyle}>
                    <Button title='Create' onPress={()=>{this.onCreateEvent()}} />
                    <Button title='Cancel' onPress={()=>this._onCancel()} />

                </View>
            </ScrollView>
        );
    }
}


export default CreateScreen;


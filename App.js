import React from 'react';
import {View,
        Text,
        TouchableWithoutFeedback,
        TouchableOpacity,
        Dimensions,
        ActivityIndicator,
        FlatList,
        Animated,
        Image} from 'react-native';
import axios from 'axios';

const {height,width} = Dimensions.get("window");//Screen size fix

class App extends React.Component {
  constructor(){
    super()
    this.state = {
      isLoading: true,
      images:[],
      scale: new Animated.Value(1),
      isImageFocused: false//when you scroll ,it will not swipe.
    };
    this.scale = {
      transform:[{scale:this.state.scale}]//this line coming from line 74
    };
    this.BarY = this.state.scale.interpolate({
      inputRange:[0.8,1],
      outputRange:[0,-80]
    })

  }
  loadWallpapers = () => {
    axios.get('https://api.unsplash.com/photos/random?count=20&client_id=97c550dfd52a738b3feb526e042f65759e5c5bba32892628264435b8361bba7b')//My Unsplash Access ID
    .then(function(response){
    console.log(response.data);
    this.setState({images:response.data, isLoading:false})
    }.bind(this)//isLoading turning until image comes.
    )
    .catch(function(error){
      console.log(error)
    }).finally(function(){
      console.log('request completed');
    });
  }

  componentDidMount(){
    this.loadWallpapers()
  }
//arrow function with item parameter
  showControl = (item) => {
    this.setState((state) => ({
      isImageFocused: !state.isImageFocused
    }), () => {
      if(this.state.isImageFocused)//when tapping
      {
        Animated.spring(this.state.scale,{
          toValue:0.8
        }).start()
      }
      else 
      {
        Animated.spring(this.state.scale,{
          toValue:1
        }).start()
      }
    })
  }

    renderItem = ({item}) => {
      return(
        <View style={{flex:1}}>
          <View style={{backgroundColor:'black',
                        alignItems:'center',justifyContent:'center',
                        position:'absolute',top:0,bottom:0,left:0,right:0}}>
              <ActivityIndicator size="large" color="grey"/>
          </View>
            <TouchableWithoutFeedback onPress = {() =>this.showControl(item)}>
              <Animated.View style={[{height,width},this.scale]}>
                <Image style={{flex:1,height:null,width:null}}
                source={{uri:item.urls.regular}}
                />
                </Animated.View>
              </TouchableWithoutFeedback>
              <Animated.View style={{
                borderRadius:20,
                borderWidth:2,
                backgroundColor:'#90a4ae',
                flexDirection: 'row',
                justifyContent: 'space-around',
                position:'absolute',
                height: 80,
                left: 0,
                bottom: this.BarY,
                right: 0
              }}>
              <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                <TouchableOpacity activeOpacity={0.4} onPress={() => alert('Load Images')}>
                <Image style={{width: Dimensions.get('window').width * 0.1,height: Dimensions.get('window').width * 0.1,}}
                    source={require ('C:/WallpaperApp/assets/arrows.png')}/>
                </TouchableOpacity>
              </View>
              <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                <TouchableOpacity activeOpacity={0.4} onPress={() => alert('Load Images')}>
                <Image style={{width: Dimensions.get('window').width * 0.1,height: Dimensions.get('window').width * 0.1,}}
                    source={require ('C:/WallpaperApp/assets/download.png')}/>
                </TouchableOpacity>
              </View>
              <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                <TouchableOpacity activeOpacity={0.4} onPress={() => alert('Load Images')}>
                <Image style={{width: Dimensions.get('window').width * 0.1,height: Dimensions.get('window').width * 0.1,}}
                    source={require ('C:/WallpaperApp/assets/share.png')}/>
                </TouchableOpacity>
              </View>
              </Animated.View>
          </View>
      )//replaced view at 74 to Animated.View

    }
    render (){
       
        return this.state.isLoading? (
            <View style={{
              flex:1,
              backgroundColor:'black',
              alignItems:'center',
              justifyContent:'center',
            }}>
                <ActivityIndicator size="large" color="grey"></ActivityIndicator>
            </View>
        ):(
          <View style={{flex:1,backgroundColor:'black'}}>
            <FlatList
              horizontal
              pagingEnabled
              scrollEnabled={!this.state.isImageFocused} //when u tap the image, swipe is disabled.
              data={this.state.images}
              renderItem={this.renderItem}
              keyExtractor={item => item.id}
            />
          </View>
        )
        
};
}
export default App;
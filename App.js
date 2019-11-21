import React from 'react';
import {View,
        Text,
        Dimensions,
        ActivityIndicator,
        FlatList,
        Image} from 'react-native';
import axios from 'axios';

const {height,width} = Dimensions.get("window");//Screen size fix

class App extends React.Component {
  constructor(){
    super()
    this.state = {
      isLoading: true,
      images:[]
    };
    this.loadWallpapers = this.loadWallpapers.bind(this)
    this.renderItem = this.renderItem.bind(this)
  }
  loadWallpapers(){
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
    renderItem(image){
      return(
        <View style={{height,width}}>
          <Image style={{flex:1,height:null,width:null}}
          source={{uri:image.urls.regular}}
          />
        </View>
      )

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
              data={this.state.images}
              renderItem={(({item})=>this.renderItem(item))}
            />
          </View>
        )
        
};
}
export default App;
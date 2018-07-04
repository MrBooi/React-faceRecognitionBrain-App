import React, { Component } from 'react';
import Particles from 'react-particles-js';
import  Clarifai from 'clarifai'
import  Navigation from './components/Navigation/Navigation';
import  Logo from './components/Logo/Logo';
import  ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import  Rank from './components/Rank/Rank';
import  FaceRecognition from './components/FaceRecognition/FaceRecognition';
import './App.css';





const app = new Clarifai.App({
  apiKey: 'f9c42b71e4c24da6b8a67be14bffbc19'
 });

const ParticlesOptions= {
  particles: {
    number: {
    value:40,
    density:{
     enable:true,
     value_area:400
    }
    }
  }
}
class App extends Component {
   constructor(){
     super();
     this.state ={
       'input':'',
       'imageURL':''
     }
   }
     onInputChange =(event) =>{
  console.log(event.target.value);
  this.setState({input:event.target.value});
     }


onsubmitBtn= () =>{
  this.setState({imageURL:this.state.input});

app.models.predict(Clarifai.FACE_DETECT_MODEL,this.state.input).then(
    function(response) {
      // do something with response
      console.log(response.outputs[0].data.region[0].region_info.bounding_box);
    },
    function(err) {
      // there was an error
    }
  );
}


  render() {
    return (
      <div className="App">
       <Particles className='particles'
              params={ParticlesOptions}
          
            />
        <Navigation />
      <Logo />
      <Rank />
       <ImageLinkForm  onInputChange={this.onInputChange} onsubmitBtn={this.onsubmitBtn}/ >
        <FaceRecognition  imageURL={this.state.imageURL} />

      </div>
    );
  }
}

export default App;

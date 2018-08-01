import React, { Component } from 'react';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai'
import Navigation from './components/Navigation/Navigation';
import Register from './components/Register/Register';
import SignIn from './components/SignIn/SignIn';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import './App.css';

const app = new Clarifai.App({
  apiKey: 'f9c42b71e4c24da6b8a67be14bffbc19'
});

const ParticlesOptions = {
  particles: {
    number: {
      value: 40,
      density: {
        enable: true,
        value_area: 400
      }
    }
  }
}
class App extends Component {
  constructor() {
    super();
    this.state = {
      'input': '',
      'imageURL': '',
      'box': {},
      route: 'SignIn',
      isSignedIn: false,
      user:{
        id: '',
        name: '',
        email:'' ,
      entries: 0,
      joined: ''
      }
    }
  }
  loadUser = (user)=>{
    this.setState({user:{
        id: user.id,
        name: user.name,
        email: user.email,
        entries: user.entries,
         joined: user.joined
    }})
  }
  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputImage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftcol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)

    }
  }

  displayFaceBox = (box) => {
    this.setState({ box: box });
  }

  onInputChange = (event) => {
    this.setState({ input: event.target.value });
  }


  onsubmitBtn = () => {
    this.setState({ imageURL: this.state.input });

    app.models.predict(Clarifai.FACE_DETECT_MODEL,
      this.state.input)
      .then(response => {
        if(response){
          fetch('http://localhost:3000/image',{
            method:'put',
        headers:{'Content-Type':'application/json'},
        body : JSON.stringify({
            id:this.state.user.id,
          })
        }).then(response =>response.json())
        .then(count => {
          console.log(count)
         this.setState(Object.assign(this.state.user,{ entries:count }))
        })
        }
        this.displayFaceBox(this.calculateFaceLocation(response))})
      
      .catch(err => console.log(err));
  }

  onRouteChange = (route) => {
    if(route === 'signOut'){
      this.setState({isSignedIn :false});
    }else if(route === 'home'){
      this.setState({isSignedIn :true});
    }
     this.setState({route: route });
  }


  render() {
   const {isSignedIn, imageURL , route, box , user} = this.state;
    return (
      <div className="App">
        <Particles className='particles'
          params={ParticlesOptions}
        />
        <Navigation isSignedIn ={isSignedIn} onRouteChange={this.onRouteChange} />
        {route === 'home' 
        ?
        <div>
            <Logo />
            <Rank name={user.name} entries={user.entries} />
            <ImageLinkForm 
            onInputChange={this.onInputChange}
             onsubmitBtn={this.onsubmitBtn}
              />
            <FaceRecognition box={box} imageURL={imageURL} />
          </div>
          : (
            this.state.route ==='SignIn'
             ? <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
             : <Register  loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
          )
        }
      </div>
    );
  }
}

export default App;

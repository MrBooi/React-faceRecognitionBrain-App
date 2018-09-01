import React, { Component } from 'react';
import Particles from 'react-particles-js';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Navigation from './components/Navigation/Navigation';
import Register from './components/Register/Register';
import SignIn from './components/SignIn/SignIn';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import './App.css';



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

const initialState= {
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





class App extends Component {
  constructor() {
    super();
    this.state = initialState;
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
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);

    console.log("found",clarifaiFace.left_col * width);
    
    return {
      leftCol: clarifaiFace.left_col * width,
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
    fetch('https://vast-wildwood-61643.herokuapp.com/imageurl',{
      method:'post',
      headers:{'Content-Type':'application/json'},
       body : JSON.stringify({
         input:this.state.input,
         id :this.state.user.id
    })
  })   .then(response => response.json())
      .then(response => {
        if (response){
          fetch('https://vast-wildwood-61643.herokuapp.com/image',{
            method:'put',
        headers:{'Content-Type':'application/json'},
        body : JSON.stringify({
            id:this.state.user.id,
          })
        })
        .then(response =>response.json())
        .then(count => {
         this.setState(Object.assign(this.state.user,{ entries:count }))
        })
        }

        this.displayFaceBox(this.calculateFaceLocation(response))
      })
      
      .catch(err => console.log(err));
  }

  onRouteChange = (route) => {
    if(route === 'signOut'){
      this.setState(initialState);
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
            route ==='SignIn'
             ? <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
             : <Register  loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
          )
        }
      </div>
    );
  }
}

export default App;

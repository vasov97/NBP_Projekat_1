import React,{Component} from 'react';
import Login from '../LoginPage/Components/Login.js'
import './App.css'
import Home from '../HomePage/Components/Home'
import 'bootstrap/dist/css/bootstrap.min.css'

class App extends Component{
    
  render(){

return(
    <div className="appDiv">
      {/*<Login/>*/}
      <Home/>

    </div>
)
}
} 

export default App;

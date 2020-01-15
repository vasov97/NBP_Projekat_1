import React,{Component} from 'react'
import '../CSS/LoginStyle.css';
import {withRouter} from 'react-router-dom'
import {loginEndPoint}  from '../../appConfig/EndPoints'
class SingIn extends Component{
    state={
        
        display:false,
        error:{}
    }

    handleLogin=()=>{
        var myUsername=document.getElementById('MyUsernameLogin').value;
        var myPassword=document.getElementById('MyPasswordLogin').value;
        var payload={
            username : myUsername,
            password : myPassword
           
        }
        fetch(loginEndPoint, {
            method: 'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            body:JSON.stringify(payload) 
                
               
            
            })
          .then((response) => response.json())
          .then((data) => {
           if(data.status==200)
           {
               console.log(data.object)
               this.props.history.push("/Home",{user:data.object})
           }
           else
           {
            this.setState({
                display:true,
                error:{
                     message:data.message
                }
            })
           }
            
           
          })
    }
    render(){
        return(
            <div>
            <h1>Sign in</h1>
			
			<input id='MyUsernameLogin' type="text" placeholder="Username" />
			<input id='MyPasswordLogin' type="password" placeholder="Password" />
			{/* <a href="#">Forgot your password?</a> */}
			<div><button onClick={this.handleLogin}>Sign In</button></div>
            {this.state.display ? <div>Message:<p>{this.state.error.message}</p></div>:<div></div>}
            </div>
        )
    }


}

export default withRouter(SingIn);
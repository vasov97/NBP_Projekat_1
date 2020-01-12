import React,{Component} from 'react'
import '../CSS/LoginStyle.css';
import {singUpEndPoint} from '../../appConfig/EndPoints'

class CreateAccount extends Component{
    state={
        
        display:false,
        error:{}
    }
    handleSingUp=()=>{
         var myUsername=document.getElementById('MyUsername').value;
         var myEmail=document.getElementById('MyEmail').value;
         var myPassword=document.getElementById('MyPassword').value;
         var myConfirmPassword=document.getElementById('MyConfirmPassword').value;
        if(myPassword===myConfirmPassword)
        {
            var payload={
                username : myUsername,
                password : myPassword,
                email : myEmail
            }
            fetch(singUpEndPoint, {
                method: 'POST',
                headers:{
                    'Content-Type': 'application/json'
                },
                body:JSON.stringify(payload)     
              })
              .then((response) => response.json())
              .then((data) => {
               console.log(data)
                this.setState({
                    display:true,
                    error:{
                         message:data.message
                    }
                })
               
              })
            
        }
        else
        {
            this.setState({
                display:true,
                error:{
                     message:"Passwords do not match"
                }
            })
        }
        
    }
    render(){
        return(
            <div>
            <h1>Create Account</h1>
			
			<input id='MyUsername' type="text" placeholder="Username" />
			<input id='MyEmail' type="email" placeholder="Email" />
			<input id='MyPassword' type="password" placeholder="Password" />
            <input id='MyConfirmPassword' type="password" placeholder="Confirm Password" />
            <button onClick={this.handleSingUp}>Sign Up</button>
            {this.state.display ? <div>Message:<p>{this.state.error.message}</p></div>:<div></div>}
            
            </div>
        )
    }


}

export default CreateAccount;

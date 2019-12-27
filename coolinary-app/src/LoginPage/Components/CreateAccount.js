import React,{Component} from 'react'
import '../CSS/LoginStyle.css';

class CreateAccount extends Component{

    render(){
        return(
            <div>
            <h1>Create Account</h1>
			
			<input type="text" placeholder="Name" />
			<input type="email" placeholder="Email" />
			<input type="password" placeholder="Password" />
            <button>Sign Up</button>
            </div>
        )
    }


}

export default CreateAccount;

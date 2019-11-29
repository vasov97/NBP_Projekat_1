import React,{Component} from 'react'
import '../CSS/LoginStyle.css';


class SingIn extends Component{

    render(){
        return(
            <div>
            <h1>Sign in</h1>
			
			<input type="email" placeholder="Email" />
			<input type="password" placeholder="Password" />
			<a href="#">Forgot your password?</a>
			<button>Sign In</button>
            </div>
        )
    }


}

export default SingIn;
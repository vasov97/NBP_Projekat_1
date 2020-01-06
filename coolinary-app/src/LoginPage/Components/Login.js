import React,{Component} from 'react';
import '../CSS/LoginStyle.css';
import CreateAccount from './CreateAccount'
import SingIn from './SingIn'



class Login extends Component{

    handleSignUp=(event)=>{
         const container=document.getElementById('container')
         container.classList.add("right-panel-active");
    }
    handleSignIn=(event)=>{
        const container=document.getElementById('container')
      container.classList.remove("right-panel-active");
    }
    render(){  
        
        return(
       <div className='loginDiv'>
       <div className='centerDiv'>
       <h2 className='welcomeH2'>Welcome to Coolinary!</h2>
       <div className="container centeredDiv" id="container">
	   <div className="form-container sign-up-container">
	   <div className='startPageDiv'>
			<CreateAccount/>
		</div>
	 </div>
	 <div className="form-container sign-in-container">
            <div className='startPageDiv'>
				<SingIn/>
			</div>
	 </div>
	 <div className="overlay-container">
		<div className="overlay">
			<div className="overlay-panel overlay-left">
				<h1>Welcome Back!</h1>
				<p>To keep connected with us please login with your personal info</p>
				<button onClick={this.handleSignIn} className="ghost" id="signIn">Sign In</button>
			</div>
			<div className="overlay-panel overlay-right">
				<h1>Hello, Chef!</h1>
				<p>Enter your personal details and start cooking with us</p>
				<button onClick={this.handleSignUp} className="ghost" id="signUp">Sign Up</button>
			</div>
		</div>
	 </div>
    </div>
    </div>
    </div>

         
        )
    }
} 

export default Login;
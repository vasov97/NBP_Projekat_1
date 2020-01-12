import React,{Component} from 'react';
import '../CSS/User.css'



class UserPage extends Component{

    
    render(){  
        const {comments} = this.props;
        console.log(comments)
        return(
          <div>User Page


          </div>
        )
    }
} 

export default UserPage;
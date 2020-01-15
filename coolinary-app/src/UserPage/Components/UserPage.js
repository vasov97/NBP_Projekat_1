import React,{Component} from 'react';
import '../CSS/User.css'
import Typography from '@material-ui/core/Typography';
import LisOfCards from '../../HomePage/Components/ListOfCards'
import {withRouter} from 'react-router-dom'
import {getUsersPostsendPoint} from '../../appConfig/EndPoints'
import { loginAndSingupsRoute } from '../../appConfig/Routes';
class UserPage extends Component
{
state={
    posts:null,
    user:null
}

componentDidMount(){
    this.setState({
        user:this.props.location.state.user,
        page:this.props.location.state.page
    },()=>this.getUsersPosts())
}
getUsersPosts=()=>{
    const {user}=this.state;
    fetch(getUsersPostsendPoint+"/"+user.username, {
        method: 'GET',
        headers:{
            'Content-Type': 'application/json'
        }
          
      })
      .then((response) => response.json())
      .then((data) => {
      
       if(data.status===200)
       {
         this.setState({
             posts:data.object
         })
       }})
    
} 
    render(){  
         const {posts,user,page}=this.state
         
        return(
          <div className="userDetails">
           <div><h3 className='text3D'>USER</h3></div>
           {(user===undefined)? <div>Loading</div>:
                <Typography variant="subtitle1">Username: {(user===null) ? "Loading...":user.username}</Typography>
           }
       
           {(posts===null) ? <div>Loading...</div>:<div style={{width:500}}><LisOfCards posts={posts} user={user} page={page}/></div>}
          </div>
        )
    }
} 

export default withRouter(UserPage);
import React,{Component} from 'react';
import '../CSS/User.css'
import Typography from '@material-ui/core/Typography';
import LisOfCards from '../../HomePage/Components/ListOfCards'

class UserPage extends Component
{
state={
    posts:[
        {
            description:"Mnogo dobar opis",
            title:"Opasan naziv",
        }
    ]
}

componentDidMount(){

}
    
    render(){  
        const {comments} = this.props;
        const {posts} = this.state;
        console.log(comments)
        return(
          <div className="userDetails">
           <div><h3 className='text3D'>USER</h3></div>
           <Typography variant="subtitle1">Type: Cold,Lunch</Typography>
           {(this.state.posts===null) ? <div>Loading...</div>:<div style={{width:500}}><LisOfCards posts={posts}/></div>}
          </div>
        )
    }
} 

export default UserPage;
import React,{Component} from 'react';
import Button from '@material-ui/core/Button';
import  '../CSS/Home.css'
import {withRouter} from 'react-router-dom'
import LisOfCards from './ListOfCards'
import ListOfTopPosts from './ListOfTopPosts'
import {getAllPostsEndPoint,getAllTopPostsEndPoint} from '../../appConfig/EndPoints'


class Home extends Component{
    state = {
        posts:null,
        topPosts:null
    }
    
    componentWillMount(){
        this.getAllPosts()
        this.getAllTopPosts()
       
    }
    getAllPosts=()=>{
        fetch(getAllPostsEndPoint, {
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
    getAllTopPosts=()=>{
        fetch(getAllTopPostsEndPoint+'/3', {
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
                topPosts:data.object
             })
           }})
    }
    handleCreatePost=()=>{
        this.props.history.push('/CreateRecipe')
    }
    handleMyPosts=()=>this.props.history.push('/UserPage')
    
    render(){  
        const {posts,topPosts} = this.state;
        

        return(
          
             <div className='flex-container'>
                
                 {(this.state.topPosts===null) ? <div className='flex-element'>Loading...</div>:<div className='flex-element'><ListOfTopPosts posts={topPosts}/></div> }
                 {(this.state.posts===null) ? <div className='middle-flex-element'>Loading...</div>:<div className='middle-flex-element'><LisOfCards posts={posts}/></div> }
                 <div className='flex-element-controls'>
                 
                 
                 <Button variant="contained" color="primary" onClick={this.handleCreatePost}>Create Post</Button>
                 <Button variant="contained" color="primary" onClick={this.handleMyPosts}>
                     My Posts
                 </Button>
                 </div> 
                 
            </div>

         
        )
    }
} 

export default withRouter(Home);
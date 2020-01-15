import React,{Component} from 'react';
import Button from '@material-ui/core/Button';
import  '../CSS/Home.css'
import TextField from '@material-ui/core/TextField';
import {withRouter} from 'react-router-dom'
import LisOfCards from './ListOfCards'
import ListOfTopPosts from './ListOfTopPosts'
import {
    getAllPostsEndPoint,
    getAllTopPostsEndPoint, 
    getUsersPostsendPoint,
    getPostByTitleendpoint,
    checkIfUserIsLogedEndPoint,
    logOutUserEndPoint,
} from '../../appConfig/EndPoints'


class Home extends Component{
    state = {
        posts:null,
        topPosts:null,
        logedUser:null
    }
    
    componentDidMount(){
        this.getAllPosts()
        this.getAllTopPosts()
        this.getLogedUser()  
    }
    search=(defineSearch)=>{
     if(defineSearch==='username')
        this.getUserPosts()
     else this.getTitlePosts()
    }
    getTitlePosts(){
        const title=document.getElementById('SearchByTitle').value;
        fetch(getPostByTitleendpoint+"/"+title, {
            method: 'GET',
            headers:{
                'Content-Type': 'application/json'
            }
              
          })
          .then((response) => response.json())
          .then((data) => {
          
           if(data.status===200)
           {
               var newarray=[];
               newarray.push(data.object)

               this.setState({
                   posts:newarray
               })
             
           }})
    }
    getUserPosts()
    {
        const username=document.getElementById('SearchByUsername').value;
        fetch(getUsersPostsendPoint+"/"+username, {
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
    getLogedUser=()=>{
        this.setState({
            logedUser:this.props.location.state.user
            
        },()=>this.checkIfUserIsLoged())
    }
    checkIfUserIsLoged=()=>{
        const {logedUser}=this.state;
        console.log(logedUser)
        fetch(checkIfUserIsLogedEndPoint+"/"+logedUser.username, {
            method: 'GET',
            headers:{
                'Content-Type': 'application/json'
            }
              
          })
          .then((response) => response.json())
          .then((data) => {
          
           if(data.status!==200)
           {
            
            this.props.history.push("/")
             
           }
          
        })
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
    handleCreatePost=(user)=>{
        this.props.history.push('/CreateRecipe',{user:user})
    }
    handleMyPosts=(user)=>this.props.history.push('/UserPage',{user:user,page:"defined"})

    handleLogOut=()=>{
        const {logedUser}=this.state;
        fetch(logOutUserEndPoint+"/"+logedUser.username, {
            method: 'GET',
            headers:{
                'Content-Type': 'application/json'
            }
              
          })
          .then((response) => response.json())
          .then((data) => {
          
           if(data.status===200)
           {
              
               this.props.history.push("/")
             
           }})
    }
   
    render(){  
        const {posts,topPosts,logedUser} = this.state;
        return(
          
             <div className='flex-container'>
                
                 {(this.state.topPosts===null) ? <div className='flex-element'>Loading...</div>:<div className='flex-element'><ListOfTopPosts posts={topPosts}/></div> }
                 {(this.state.posts===null) ? <div className='middle-flex-element'>Loading...</div>:<div className='middle-flex-element'><LisOfCards posts={posts} user={logedUser} page={undefined}/></div> }
                 <div className='flex-element-controls' >
                 
                 <Button variant="contained" color="primary" onClick={()=>this.handleLogOut()}>LogOut</Button>
                 <Button variant="contained" color="primary" onClick={()=>this.handleCreatePost(logedUser)}>Create Post</Button>
                 <Button variant="contained" color="primary" onClick={()=>this.handleMyPosts(logedUser)}>
                     My Posts
                 </Button>
                 <div>
                     <TextField id="SearchByUsername" label="Search By Username" />
                     <Button style={{marginTop:14,marginLeft:12}} variant="contained" color="primary" onClick={()=>this.search('username')}>Search</Button>
                </div>
                 <div>
                     <TextField id="SearchByTitle" label="Search By Title" />
                     <Button style={{marginTop:14,marginLeft:12}} variant="contained" color="secondary" onClick={()=>this.search('title')}>Search</Button>
                </div>
                
                 </div> 
                 
            </div>

         
        )
    }
} 

export default withRouter(Home);
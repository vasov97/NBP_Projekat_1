import React,{Component} from 'react';
import  '../CSS/Home.css'

import LisOfCards from './ListOfCards'
import ListOfTopPosts from './ListOfTopPosts'
import {getAllPostsEndPoint} from '../../appConfig/EndPoints'
class Home extends Component{
    state = {
        posts:null
    }
    
    componentWillMount(){
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
                 posts:data.posts
             })
           }
          
           
          })
    }

    
    render(){  
        const {posts} = this.state;
        

        return(
          
             <div className='flex-container'>
                 {/* <div className='flex-element'><ListOfTopPosts/></div>
                 <div className='middle-flex-element'><LisOfCards names={names}/></div>
                 <div className='flex-element-controls'>13
                 
                 <button>Click me</button>
                 
                 </div> */}
                 {(this.state.posts===null) ? <div>Loading...</div>:<div className='middle-flex-element'><LisOfCards posts={posts}/></div> }
            </div>

         
        )
    }
} 

export default Home;
import React,{Component} from 'react';
import  '../CSS/Home.css'
import ListOfCards from './ListOfCards'

class ListOfTopPosts extends Component{

    
    render(){  
        const {posts}=this.props;
       
        return(
          
             <div className='flex-container-topPosts'>
                 
                 <div className='topPosts'><h3 className='text3D'>Top Posts!</h3></div>
                
                 <div className='top3PostsDiv'><ListOfCards posts={posts}/></div>
            </div>

         
        )
    }
} 

export default ListOfTopPosts;
import React,{Component} from 'react';
import  '../CSS/Home.css'
import ListOfCards from './ListOfCards'

class ListOfTopPosts extends Component{

    
    render(){  
        
        return(
          
             <div className='flex-container-topPosts'>
                 
                 <div className='topPosts'><h3 className='text3D'>Top Posts!</h3></div>
                
                 <div className='top3PostsDiv'><ListOfCards/></div>
            </div>

         
        )
    }
} 

export default ListOfTopPosts;
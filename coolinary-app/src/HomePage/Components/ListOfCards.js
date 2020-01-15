import React,{Component} from 'react';
import  '../CSS/Home.css'
import Card from './Card'



class LisOfCards extends Component{

    
    render(){  
        const {posts,user,page} = this.props;
       
        return(
            <div>
           {(posts===undefined) ? <div>Loading...</div>:<div>
            <ul className='ListRoot'>
     
            {  
               posts.map((post, index) => 
                   <li className='MyMuiListItem-root' key={index}>
                       <Card post={post} user={user} page={page}/>
                   </li>
               )
           } 
           
           
           </ul>
            
            </div>

           }
           </div>
           
         
        )
    }
} 

export default LisOfCards;
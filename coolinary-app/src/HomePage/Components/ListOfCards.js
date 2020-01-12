import React,{Component} from 'react';
import  '../CSS/Home.css'
import Card from './Card'



class LisOfCards extends Component{

    
    render(){  
        const {posts} = this.props;
        console.log(posts)
        return(
          
            <ul className='ListRoot'>
     
             {  
                posts.map((post, index) => 
                    <li className='MyMuiListItem-root' key={index}>
                        <Card post={post}/>
                    </li>
                )
            } 
            
            
            </ul>
         
        )
    }
} 

export default LisOfCards;
import React,{Component} from 'react';
import Comment from '../Components/Comment'



class ListOfComments extends Component{

    
    render(){  
        const {comments} = this.props;
        console.log(comments)
        return(
          
            <ul className='ListRoot'>
              {  
                comments.map((comment, index) => 
                    <li className='MyMuiListItem-root' key={index}>
                        <Comment comment={comment}/>
                    </li>
                )
            } 
             </ul>
         
        )
    }
} 

export default ListOfComments;
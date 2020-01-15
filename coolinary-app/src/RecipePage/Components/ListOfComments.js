import React,{Component} from 'react';
import Comment from '../Components/Comment'



class ListOfComments extends Component{

    
    render(){  
        const {comments} = this.props;
        
        return(
            <div>
                {(comments===null || comments===undefined) ? <div><p>No Comments Posted</p></div> :
                <div>
                    {(comments.length===0) ? <div><p>No Comments Posted</p></div>:
                    
                    <ul className='ListRoot'>
                    {  
                      comments.map((comment, index) => 
                          <li className='MyMuiListItem-root' key={index}>
                              <Comment comment={comment}/>
                          </li>
                      )
                  } 
                   </ul>
                    }
                
                </div>
                
                }
            </div>
           
         
        )
    }
} 

export default ListOfComments;
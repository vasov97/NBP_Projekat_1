import React,{Component} from 'react';
import Typography from '@material-ui/core/Typography';



class Comment extends Component{

    
    render(){  
        const {comment} = this.props;
        console.log(comment)
        return(
          
            <div>
                <Typography variant="subtitle1">By: {comment.username}</Typography>
                <textarea disabled rows="4" cols='40'>
                {comment.text}
                </textarea>
            </div>
         
        )
    }
} 

export default Comment;
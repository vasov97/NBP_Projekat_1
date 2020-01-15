import React,{Component} from 'react';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import ListOfComments from '../Components/ListOfComments.js'
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Favorite from '@material-ui/icons/Favorite';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import TextField from '@material-ui/core/TextField';
import {withRouter} from 'react-router-dom'
import {
    getTypesOfPostendPoint,
    getCommentsendPOint,
    createCommentendPoint,
    getPostByTitleendpoint,
    likePostEndPoint,
} from '../../appConfig/EndPoints'
class Recipe extends Component{
state={
    dialogOpen:false,
    user:null,
    post:null,
    page:null,
    comments:null,
    types:null,
    
    numberOfLikes:null,
}
componentDidMount(){
      this.getHistoryProps()
      
}
getLikes=()=>{
    //get likes
}

getTypes=()=>{
    const {post}=this.state
    
    if(post!=null)
    {
        fetch(getTypesOfPostendPoint+'/'+post.title, {
            method: 'GET',
            headers:{
                'Content-Type': 'application/json'
            }
              
          })
          .then((response) => response.json())
          .then((data) => {
          
           if(data.status===200)
           {
               var types=[]
               data.object.forEach((element)=>{
                   types.push(element.type)
               })
              
             this.setState({
                 types:types
             },()=>this.getComments())
            
           }})
    }
    
}
getComments=()=>{
    const {post}=this.state
     var payload={
         title:post.title
     }
    fetch(getCommentsendPOint, {
        method: 'POST',
        headers:{
            'Content-Type': 'application/json'
        },
        body:JSON.stringify(payload)
          
      })
      .then((response) => response.json())
      .then((data) => {
      
       if(data.status===200)
       {
           
        this.setState({
            comments:data.object
        },()=>this.getNewPost())
        
       }})

}
getNewPost=()=>{
    const {post}=this.state;
    fetch(getPostByTitleendpoint+'/'+post.title, {
        method: 'GET',
        headers:{
            'Content-Type': 'application/json'
        }
          
      })
      .then((response) => response.json())
      .then((data) => {
      
       if(data.status===200)
       {
           console.log("newPostIs",data.object)
         this.setState({
             post:data.object,
             numberOfLikes:data.object.numOfLikes
         })
       }
    })
}
getHistoryProps=()=>{
    
    this.setState({
        user:this.props.location.state.user,
        post:this.props.location.state.post,
        page:this.props.location.state.page
        
    },()=>this.getTypes())
    
    
     

}
handleClickOpen=()=>{
    this.setState({
        dialogOpen:true
    })
}
handleClose=()=>{
    const {user,post}=this.state;
    var commentText=document.getElementById("CommentText")
    if(commentText.value!="")
    {
        var payload={
            username:user.username,
            title:post.title,
            text:commentText.value,
        }
        this.createComment(payload)
    }
    else
    {
        this.setState({
            dialogOpen:false
        })
    }
   
}
createComment=(payload)=>{
    fetch(createCommentendPoint, {
        method: 'POST',
        headers:{
            'Content-Type': 'application/json'
        },
        body:JSON.stringify(payload)     
      })
      .then((response) => response.json())
      .then((data) => {
       
        this.setState({
            dialogOpen:false
        })

       
       
      })
}

changeChecked=(value,types)=>{
    types.pop(value)
    console.log(types)
}
handleVisitUser=()=>{
    this.props.history.push('/UserPage')
}
handleDelete=()=>{
    console.log("Brisanje")
}
checkedIngredient(type,types)
{
    var contains=false;
   if(types!=null)
   {
      
    types.forEach((element)=>{
       if(element===type)
          contains=true;
          
    })
   }
  

   return contains
        
    
   
}
likePost=()=>{
    const {post,user,numberOfLikes}=this.state;
    var newLIkes=parseInt(numberOfLikes)+1;
    var payload={
        username:user.username,
        postTitle:post.title,
        date:new Date(),
    }
   fetch(likePostEndPoint, {
       method: 'POST',
       headers:{
           'Content-Type': 'application/json'
       },
       body:JSON.stringify(payload)
         
     })
     .then((response) => response.json())
     .then((data) => {
        
      if(data.status===200)
      {
          
       
       this.setState({
           numberOfLikes:newLIkes,
       })
       
      }})
}
    render(){  
        
        const {page,user,post,comments,types,numberOfLikes}=this.state;
         
        return(
            <div>
            {(post===null) ? 
                <div>Loading...</div>:
                <div>
                <div className='recipeDiv'>
                      
                <div className='divFlexElement'>
                  <div className='recipeDataDiv'>
                     <div><h3>Recipe details:</h3></div>
                      <div><Button size="small" onClick={this.handleVisitUser}>by {user.username}</Button></div>
                     {(page === undefined) ? <div className='recipeDataDiv'>
                            <Typography variant="subtitle1">Title: {post.title}</Typography>
                            <Typography variant="subtitle1">Type: {(types===null) ? "":types.toString()}</Typography>
                            <Typography variant="subtitle1">List of ingrediants:</Typography>
                            <textarea style={{width:250}} disabled rows="8" cols='5'>
                               {post.ingredients}
                            </textarea>
                            <Typography variant="subtitle1">Description:</Typography>
                            <textarea style={{width:400}} disabled rows="12" cols='5'>
                                {post.description}
                            </textarea>
                        </div >
    
    
    
    
                     :<div className='recipeDataDiv'>
                          <div  className='add-padding'><TextField id="title" label="Title" value={post.title}/></div>
                          <h4 className='add-padding'>Recipe Type:</h4>
                        <div>
                       
                        <div>
                        
                        <label className='add-padding'><input type="checkbox" value='Sweet'/>Sweet</label>
                        <label className='add-padding'><input type="checkbox" value='Salty' />Salty</label>
    
                        <label className='add-padding'><input type="checkbox" value='Breakfast' />Breakfast</label>
                        <label className='add-padding'><input type="checkbox" value='Lunch' />Lunch</label>
                        <label className='add-padding'><input type="checkbox" value='Dinner' />Dinner</label>
    
                        <label className='add-padding'><input name='hotcold' type="radio" value='Hot' />Hot</label>
                        <label className='add-padding'><input name='hotcold' type="radio" value='Cold' />Cold</label>
                    
                        </div>
                        </div>
                            <Typography variant="subtitle1">List of ingrediants:</Typography>
                            <textarea style={{width:250}} rows="8" cols='5' value={post.ingredients}>
           
                            </textarea>
                            <Typography variant="subtitle1" >Description:</Typography>
                            <textarea style={{width:400}} rows="12" cols='5' value={post.description}>
           
                            </textarea>
    
    
                     </div>
                    
                     }
                     
                    <FormControlLabel
                           control={<Checkbox onClick={this.likePost} icon={<FavoriteBorder />} checkedIcon={<Favorite />} value="checkedH" />}
                         label={"Likes: "+ numberOfLikes}
                       />
                       <div>
                           <Button variant="outlined" color="secondary" onClick={this.handleClickOpen}>Leave Comment</Button>
                       <Dialog onClose={this.handleClose} aria-labelledby="customized-dialog-title" open={this.state.dialogOpen}>
                             <MuiDialogTitle id="customized-dialog-title" onClose={this.handleClose}>
                                 Comment
                             </MuiDialogTitle>
                        <MuiDialogContent dividers>
                        <textarea id="CommentText" style={{width:250}}  rows="8" cols='5'>
    
                           </textarea>
                        </MuiDialogContent>
                        <MuiDialogActions>
                        <Button autoFocus onClick={this.handleClose} color="primary">
                            Save
                        </Button>
                        </MuiDialogActions>
                    </Dialog>
                       </div>
                       {(page === undefined) ? <div></div>: <div style={{marginTop:10}}><Button variant="outlined" color="secondary" onClick={this.handleDelete}>Delete</Button>
                       <Button variant="outlined" color="secondary" onClick={this.handleSaveChanges}>Save Changes</Button></div>}
                     </div>
                </div> 
                <div className='divFlexElement'>
                    <div>
                        
                      <ListOfComments comments={comments}/>
                    </div>
                    
                </div>
                  
               </div>
             </div>

        
        
        
        
        
        
        
        
            }
            </div>
          
        )
    }
} 

export default withRouter(Recipe);
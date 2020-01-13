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
class Recipe extends Component{
state={
    dialogOpen:false,
}

handleClickOpen=()=>{
    this.setState({
        dialogOpen:true
    })
}
handleClose=()=>{
    this.setState({
        dialogOpen:false
    })
}
handleVisitUser=()=>{
    this.props.history.push('/UserPage')
}
handleDelete=()=>{
    console.log("Brisanje")
}
    
    render(){  
        const {page}=this.props;
        return(
          
            <div className='recipeDiv'>
                  
            <div className='divFlexElement'>
              <div className='recipeDataDiv'>
                 <div><h3>Recipe details:</h3></div>
                 <div><Button size="small" onClick={this.handleVisitUser}>by User123</Button></div>
                 {(page === undefined) ? <div className='recipeDataDiv'>
                        <Typography variant="subtitle1">Tittle: Salata</Typography>
                        <Typography variant="subtitle1">Type: Cold,Lunch</Typography>
                        <Typography variant="subtitle1">List of ingrediants:</Typography>
                        <textarea style={{width:250}} disabled rows="8" cols='5'>
       
                        </textarea>
                        <Typography variant="subtitle1">Description:</Typography>
                        <textarea style={{width:400}} disabled rows="12" cols='5'>
       
                        </textarea>
                    </div >




                 :<div className='recipeDataDiv'>
                      <div  className='add-padding'><TextField id="title" label="Title" /></div>
                      <h4 className='add-padding'>Recipe Type:</h4>
                    <div>
                   
                    <div>
                    
                    <label className='add-padding'><input type="checkbox" value='Sweet' />Sweet</label>
                    <label className='add-padding'><input type="checkbox" value='Salty' />Salty</label>

                    <label className='add-padding'><input type="checkbox" value='Breakfast'/>Breakfast</label>
                    <label className='add-padding'><input type="checkbox" value='Lunch'/>Lunch</label>
                    <label className='add-padding'><input type="checkbox" value='Dinner'/>Dinner</label>

                    <label className='add-padding'><input name='hotcold' type="radio" value='Hot'/>Hot</label>
                    <label className='add-padding'><input name='hotcold' type="radio" value='Cold'/>Cold</label>
                
                    </div>
                    </div>
                        <Typography variant="subtitle1">List of ingrediants:</Typography>
                        <textarea style={{width:250}} rows="8" cols='5'>
       
                        </textarea>
                        <Typography variant="subtitle1">Description:</Typography>
                        <textarea style={{width:400}} rows="12" cols='5'>
       
                        </textarea>


                 </div>
                
                 }
                 
                <FormControlLabel
                       control={<Checkbox icon={<FavoriteBorder />} checkedIcon={<Favorite />} value="checkedH" />}
                     label="Likes: 50"
                   />
                   <div>
                       <Button variant="outlined" color="secondary" onClick={this.handleClickOpen}>Leave Comment</Button>
                   <Dialog onClose={this.handleClose} aria-labelledby="customized-dialog-title" open={this.state.dialogOpen}>
                         <MuiDialogTitle id="customized-dialog-title" onClose={this.handleClose}>
                             Comment
                         </MuiDialogTitle>
                    <MuiDialogContent dividers>
                    <textarea style={{width:250}}  rows="8" cols='5'>

                       </textarea>
                    </MuiDialogContent>
                    <MuiDialogActions>
                    <Button autoFocus onClick={this.handleClose} color="primary">
                        Save
                    </Button>
                    </MuiDialogActions>
                </Dialog>
                   </div>
                   {(page === undefined) ? <div></div>: <div style={{marginTop:10}}><Button variant="outlined" color="secondary" onClick={this.handleDelete}>Delete</Button></div>}
                 </div>
            </div> 
            <div className='divFlexElement'>
                <div>
                  <ListOfComments comments={[1,2,3,4,5,6,7,8]}/>
                </div>
                
            </div>
              
             </div>
         
        )
    }
} 

export default withRouter(Recipe);
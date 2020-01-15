import React,{Component} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import {withRouter} from 'react-router-dom'
import {createPostendPoint} from '../../appConfig/EndPoints'
import '../CSS/Recipe.css'

const useStyles = makeStyles(theme => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
      width: 200,
    },
  },
}));




class CreateRecipe extends Component{
state={
  logedUser:null
}

componentDidMount(){
  this.getLogedUser()
}
getLogedUser=()=>{
  this.setState({
      logedUser:this.props.location.state.user
      
  })
}
hadnleCreatePost=(user)=>{
        
        var ingredients=document.getElementById('Ingredients').value;
        var description=document.getElementById('Description').value;
        var title=document.getElementById('Title').value;
        var typeArray=[]
        document.querySelectorAll("input:checked").forEach((element)=>{
          typeArray.push(element.value)
        });
       

      var payload={
        username:user.username,
        title:title,
        ingredients:ingredients,
        description:description,
        types:typeArray

      }
      this.createPost(payload,user)
      
}
createPost=(payload,user)=>{
  fetch(createPostendPoint, {
    method: 'POST',
    headers:{
        'Content-Type': 'application/json'
    },
    body:JSON.stringify(payload)     
  })
  .then((response) => response.json())
  .then((data) => {
   
      this.props.history.push('/Home',{user:user})
   
   
  })
}
    
    render(){  
        const {logedUser}=this.state;
       
        return(
          
        
           <div className='createRecipeDiv'>
            <div className='add-padding'><h3 className='text3D'>Create Recipe!</h3></div>
            <div  className='add-padding'><TextField id="Title" label="Title" /></div>
            
            <textarea id='Ingredients' className='add-padding' rows="8" cols="50">
            Ingredients:
             </textarea>
           
            <h4 className='add-padding'>Recipe Type:</h4>
            
            <div>
            <label className='add-padding'><input type="checkbox" value='Sweet' />Sweet</label>
            <label className='add-padding'><input type="checkbox" value='Salty' />Salty</label>

            <label className='add-padding'><input type="checkbox" value='Breakfast'/>Breakfast</label>
            <label className='add-padding'><input type="checkbox" value='Lunch'/>Lunch</label>
            <label className='add-padding'><input type="checkbox" value='Dinner'/>Dinner</label>

            <label className='add-padding'><input name='hotcold' type="radio" value='Hot'/>Hot</label>
            <label className='add-padding'><input name='hotcold' type="radio" value='Cold'/>Cold</label>
            </div>
           <div>
            <textarea id='Description' rows="12" cols="50">
            Description:
             </textarea>
             <div className='buttonDiv'>
             <Button onClick={()=>this.hadnleCreatePost(logedUser)}variant="contained" color="primary">
              Post
             </Button>
             <Button variant="contained" color="primary">
              Cancel
             </Button>
             
             </div>
            </div>
            </div>
           
           
           
           
            
           

         
        )
    }
} 

export default withRouter(CreateRecipe);
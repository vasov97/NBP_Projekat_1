import React,{Component} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
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

    
    render(){  
        
        return(
          
        
           <div className='createRecipeDiv'>
            <div className='add-padding'><h3 className='text3D'>Create Recipe!</h3></div>
            <div  className='add-padding'><TextField id="title" label="Title" /></div>
            
            <textarea className='add-padding' rows="8" cols="50">
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
            <textarea rows="12" cols="50">
            Description:
             </textarea>
             <div className='buttonDiv'>
             <Button variant="contained" color="primary">
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

export default CreateRecipe;
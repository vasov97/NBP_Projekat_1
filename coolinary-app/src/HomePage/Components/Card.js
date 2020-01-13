import React,{Component} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import {withRouter} from 'react-router-dom'
const useStyles = makeStyles({
  card: {
    minWidth: 275,
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
});

class SimpleCard extends Component{

 
    getPostUser=(post)=>{
       //get user of POST!
    }
    handleLearnMore=(post,user,clickedBy)=>{
        console.log(post)
       this.props.history.push("/Recipe")
    }
render(){
    


  
  const {clickedBy,post,user}=this.props;
  
  const bull = <span className={useStyles.bullet}>•</span>;
  let displayDescription=post.description.slice(0,(post.description.length)/2)
  displayDescription=displayDescription+'...'
  return (
          <Card className={useStyles.card}>
          <CardContent>
            <Typography className={useStyles.title} color="textSecondary" gutterBottom>
             {post.title}
            </Typography>
            <Typography variant="h5" component="h2">
            By Milan{bull}
            </Typography>
            <Typography className={useStyles.pos} color="textSecondary">
              Description
            </Typography>
            <Typography variant="body2" component="p">
             
               {displayDescription}
              <br />
              {'"Happy Coocking"'}
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="small" onClick={()=>this.handleLearnMore(post,user,clickedBy)}>Learn More</Button>
          </CardActions>
        </Card>
      

      
    
  );
}}


export default withRouter(SimpleCard);
import React from 'react'
import { BrowserRouter, Route } from 'react-router-dom'
import Login from "../LoginPage/Components/Login.js"
import Home from "../HomePage/Components/Home.js"
import Recipe from '../RecipePage/Components/Recipe'
import CreateRecipe from '../RecipePage/Components/CreateRecipe'
import UserPage from '../UserPage/Components/UserPage'

import {
    loginAndSingupsRoute,
    homePageRoute, 
    recipePageRoute,
    createRecipePageRoute,
    userPageRoute,

} from "./Routes";

const Router = () => {
    
    return(
        <BrowserRouter>
            <Route  exact path={loginAndSingupsRoute} render={() => <Login /> }/> 
            <Route  path={homePageRoute} render={()=><Home />} />  
            <Route  path={recipePageRoute} render={()=><Recipe />} />
            <Route  path={createRecipePageRoute} render={()=><CreateRecipe />} />
            <Route  path={userPageRoute} render={()=><UserPage />} />

        </BrowserRouter>
    )
}

export default Router
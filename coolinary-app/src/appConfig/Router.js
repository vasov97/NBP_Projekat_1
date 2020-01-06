import React from 'react'
import { BrowserRouter, Route } from 'react-router-dom'
import Login from "../LoginPage/Components/Login.js"
import Home from "../HomePage/Components/Home.js"
import Receipt from '../ReceiptPage/Components/Receipt'

import {
    loginAndSingupsRoute,
    homePageRoute, 
    receiptPageRoute,

} from "./Routes";

const Router = () => {
    
    return(
        <BrowserRouter>
            <Route  exact path={loginAndSingupsRoute} render={() => <Login /> }/> 
            <Route  path={homePageRoute} render={()=><Home />} />  
            <Route  path={receiptPageRoute} render={()=><Receipt />} />
              
        </BrowserRouter>
    )
}

export default Router
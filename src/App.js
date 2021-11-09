import React, {Component} from 'react'
// import * as BooksAPI from './BooksAPI'
import './App.css'
import {Route} from "react-router-dom";
import SearchPage from "./pages/search-page/SearchPage";
import MainPage from "./pages/main-page/MainPage";

class BooksApp extends Component {
    render() {
        return (
            <div className="app">
                <Route path="/search" component={SearchPage}/>
                <Route path="/" exact component={MainPage}/>
            </div>
        )
    }
}

export default BooksApp

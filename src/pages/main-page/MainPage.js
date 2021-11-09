import React, {Component} from "react";
import {Link} from "react-router-dom";
import "./MainPage.css"
import Shelves from "../../components/Shelves";

class MainPage extends Component {
    render() {
        return <div className="list-books">
            <div className="list-books-title">
                <h1>MyReads</h1>
            </div>
            <Shelves/>
            <div className="open-search">
                <Link className="add-button" to="/search">Add a book</Link>
            </div>
        </div>
    }
}

export default MainPage;

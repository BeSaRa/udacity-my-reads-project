import React from "react";
import {Link} from "react-router-dom";
import "./MainPage.css"
import Shelves from "../../components/Shelves";


function MainPage({shelvesByOrder, reload, loaded, shelves, moveBookToShelf}) {
    return <div className="list-books">
        <div className="list-books-title">
            <h1>MyReads</h1>
        </div>
        <Shelves shelvesByOrder={shelvesByOrder} loaded={loaded}
                 shelves={shelves} moveBookToShelf={moveBookToShelf}/>
        <button onClick={reload} className="reload-button">
            <span>reload</span>
            <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" viewBox="0 0 24 24"
                 stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
        </button>
        <div className="open-search">
            <Link className="add-button" to="/search">Add a book</Link>
        </div>
    </div>
}


export default MainPage;

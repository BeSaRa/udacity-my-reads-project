import React from "react";
import Shelf from "./Shelf";
import Loader from "./Loader";


function Shelves({shelvesByOrder, loaded, shelves, moveBookToShelf}) {
    const shelfList = <div>{shelvesByOrder.map(shelf => (
        <Shelf key={shelf} moveBookCallback={moveBookToShelf}
               shelf={shelves[shelf]}/>))}</div>

    return (
        <div className="list-books-content">
            {(loaded && (shelfList)) || <Loader/>}
        </div>
    )
}


export default Shelves;

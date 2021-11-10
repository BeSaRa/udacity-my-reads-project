import React from "react";
import Book from "./Book";

function Shelf({shelf: {books, title}, moveBookCallback}) {
    return <div className="bookshelf">
        <h2 className="bookshelf-title">{title} - ({books.length})</h2>
        <div className="bookshelf-books">
            <ol className="books-grid">
                {books.map(book => <Book moveBookCallback={moveBookCallback} book={book} key={book.id}/>)}
            </ol>
        </div>
    </div>;
}

export default Shelf;

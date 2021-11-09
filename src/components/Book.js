import React from "react";
import noImageAvailable from "../images/no-cover.jpg";
import BookShelfChanger from "./BookShelfChanger";

function Book(props) {
    const {book, moveBookCallback , booksByIds} = props;
    // to handle books that has no cover
    book.imageLinks = book.imageLinks || {
        smallThumbnail: noImageAvailable
    }
    // to handle the books that has no authors
    book.authors = book.authors || [];
    return <li>
        <div className="book">
            <div className="book-top">
                <div className="book-cover" style={{
                    width: 128,
                    height: 193,
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'contain',
                    backgroundImage: `url(${book.imageLinks.smallThumbnail})`
                }}/>
                <BookShelfChanger booksByIds={booksByIds} moveBookCallback={moveBookCallback} book={book}/>
            </div>
            <div className="book-title">{book.title}</div>
            <div className="book-authors">{book.authors.join(', ')}</div>
        </div>
    </li>
}

export default Book;

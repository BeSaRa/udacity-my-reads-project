import React, {Component} from "react";
import Shelf from "./Shelf";
import * as BookAPI from './../BooksAPI';
import loaderImage from '../images/Loader.gif';

class Shelves extends Component {
    state = {
        loaded: false,
        shelvesByOrder: ['currentlyReading', 'wantToRead', 'read'],
        shelves: {
            wantToRead: {
                title: 'Want to read',
                books: []
            },
            currentlyReading: {
                title: 'Currently Reading',
                books: []
            },
            read: {
                title: 'Read',
                books: []
            }
        }
    };

    componentDidMount() {
        BookAPI.getAll()
            .then((books) => {
                this.distributeBooksOnShelves(books);
                this.setState((prevState) => ({...prevState, loaded: true}))
            })
    }

    /**
     * @description add book to shelf
     * @param {string} shelf
     * @param book - book model
     */
    addBookToShelf(shelf, book) {
        this.setState((prevState) => {
            return {
                shelves: {
                    ...prevState.shelves,
                    [shelf]: {
                        ...prevState.shelves[shelf],
                        books: prevState.shelves[shelf].books.concat(book)
                    }
                }
            }
        })
    }

    /**
     * @description distribute books for each shelf
     * @param {Array} books
     */
    distributeBooksOnShelves(books) {
        books.forEach(book => this.addBookToShelf(book.shelf, book));
    }

    render() {
        const shelves = <div>{this.state.shelvesByOrder.map(shelf => (
            <Shelf key={shelf} shelf={this.state.shelves[shelf]}/>))}</div>

        const loading = <div className="loader-wrapper">
            <div style={{
                background: `url(${loaderImage}) center center no-repeat`,
                width: 250,
                height: 150
            }}/>
            <span className="loading-word">Loading...</span>
        </div>
        return (
            <div className="list-books-content">
                {(this.state.loaded && (shelves)) || loading}
            </div>
        )
    }
}

export default Shelves;

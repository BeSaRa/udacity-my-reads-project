import React, {Component} from 'react'
import './App.css'
import {Route} from "react-router-dom";
import SearchPage from "./pages/search-page/SearchPage";
import MainPage from "./pages/main-page/MainPage";
import * as BookAPI from "./BooksAPI";
import {from, of, Subject} from "rxjs";
import {catchError, exhaustMap} from "rxjs/operators";

class BooksApp extends Component {
    state = this.createInitialState();
    destroy$ = new Subject();
    reload$ = new Subject();

    componentDidMount() {
        this.listenToReload();
        this.reload$.next(null);
    }

    componentWillUnmount() {
        this.destroy$.next(null);
        this.destroy$.complete();
        this.destroy$.unsubscribe();
    }

    /**
     * listen to reload event to call the API
     */
    listenToReload = () => {
        this.reload$
            // ignore any upcoming reload event till the API respond on the previous one to avoid multi click on reload btn
            .pipe(exhaustMap(_ => {
                return from(this.loadBooks())
                    // catch any error from reload books to avoid stopping reload button from work
                    .pipe(catchError(_ => of([])))
            }))
            .subscribe((books) => {
                this.setState({loaded: true, booksByIds: books.reduce((acc, book) => ({...acc, [book.id]: book}), {})})
                this.distributeBooksOnShelves(books)
            })
    }

    /**
     * @description create initial state
     * @returns {object} initial state
     */
    createInitialState() {
        return {
            loaded: false,
            shelvesByOrder: ['currentlyReading', 'wantToRead', 'read'],
            booksByIds: {},
            shelves: {
                wantToRead: {
                    title: 'Want to read',
                    books: [],
                    booksIds: []
                },
                currentlyReading: {
                    title: 'Currently Reading',
                    books: [],
                    booksIds: []
                },
                read: {
                    title: 'Read',
                    books: [],
                    booksIds: []
                }
            }
        }
    }

    /**
     * @description load books
     */
    loadBooks = () => {
        this.setState(this.createInitialState())
        return BookAPI.getAll();
    }

    /**
     * @description add book to shelf
     * @param {string} shelf
     * @param book - book model
     */
    addBookToShelf(book, shelf) {
        this.setState((prevState) => {
            const books = prevState.shelves[shelf].books.concat(book);
            return {
                shelves: {
                    ...prevState.shelves,
                    [shelf]: {
                        ...prevState.shelves[shelf],
                        books,
                        booksIds: books.map(b => b.id)
                    }
                }
            }
        })
    }

    /**
     * @description distribute books for each shelf
     * @param {array} books
     */
    distributeBooksOnShelves(books) {
        books.forEach(book => this.addBookToShelf(book, book.shelf));
    }

    /**
     * @description move book between shelves
     * @param book
     * @param shelf
     */
    moveBookToShelf = (book, shelf) => {
        BookAPI
            .update(book, shelf)
            .then(shelvesWithBooksIds => {
                !book.shelf && this.setState((prev) => {
                    book.shelf = shelf;
                    return {booksByIds: {...prev.booksByIds, [book.id]: book}}
                })
                this.updateShelves(shelvesWithBooksIds);
            })
    }

    updateShelves = (shelvesWithBooksIds) => {
        Object.keys(shelvesWithBooksIds).forEach(shelf => {
            this.setState((preState) => {
                return {
                    shelves: {
                        ...preState.shelves,
                        [shelf]: {
                            ...preState.shelves[shelf],
                            booksIds: shelvesWithBooksIds[shelf],
                            books: shelvesWithBooksIds[shelf].map(id => preState.booksByIds[id])
                        }
                    }
                }
            })
        });
    }

    render() {
        return (
            <div className="app">
                <Route path="/search" render={() => <SearchPage booksByIds={this.state.booksByIds}  moveBookToShelf={this.moveBookToShelf}/>}/>
                <Route path="/" exact
                       render={() => <MainPage reload={() => this.reload$.next(null)}
                                               shelvesByOrder={this.state.shelvesByOrder}
                                               loaded={this.state.loaded}
                                               shelves={this.state.shelves} moveBookToShelf={this.moveBookToShelf}/>}/>
            </div>
        )
    }
}

export default BooksApp

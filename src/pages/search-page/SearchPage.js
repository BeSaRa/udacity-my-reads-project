import React, {Component} from "react";
import {Link} from "react-router-dom";
import "./SearchPage.css";
import {from, of, Subject} from "rxjs";
import {debounceTime, distinctUntilChanged, map, switchMap, takeUntil} from "rxjs/operators";
import * as BookAPI from "../../BooksAPI"
import Book from "../../components/Book";
import Loader from "../../components/Loader";
import history from "../../history";

class SearchPage extends Component {
    state = {
        term: '',
        displayLoader: false,
        books: [],
        hasError: false
    }
    term$ = new Subject();
    destroy$ = new Subject();
    searchParams = null;
    queryKey = 'q';

    constructor(props) {
        super(props);
        // to use it later if user refreshed the page with query string to call the API again with the same term
        this.searchParams = new URLSearchParams(history.location.search);
    }

    /**
     * @description search if the URLSearchParams has the queryKey "term"
     */
    searchByQuery() {
        this.searchParams.has(this.queryKey) && this.handleChanges(this.searchParams.get(this.queryKey));
    }

    componentDidMount() {
        this.listenToTermChanges();
        this.searchByQuery();
    }

    componentWillUnmount() {
        // emit to stop listening to term changes
        this.destroy$.next();
        this.destroy$.complete();
        this.destroy$.unsubscribe();
    }

    /**
     * @description to hide/display loader
     * @param {boolean} value
     */
    displayLoader(value) {
        this.setState({displayLoader: value});
    }

    /**
     * @description call the API and get search result
     * @param term
     * @returns {Promise<unknown>}
     */
    search(term) {
        this.displayLoader(true);
        return BookAPI.search(term).then((result) => {
            this.displayLoader(false);
            return result;
        }).catch((error) => {
            this.displayLoader(false);
            return error;
        });
    }

    /**
     * @description listen to term changes and calling the API to get the search result
     */
    listenToTermChanges() {
        this.term$
            .pipe(
                map(value => value.trim()),
                debounceTime(200), // eliminate unnecessary API Calls (avoid calling the API with every keystroke)
                distinctUntilChanged(), // avoid calling the API with the same last term result
                // return empty array if there is no term.length to clear old search result
                switchMap((term) => term.length ? from(this.search(term)) : of([])),
                takeUntil(this.destroy$)
            )
            .subscribe((result) => {
                // update books state to re-render component
                this.setState({
                    hasError: result.hasOwnProperty('error'),
                    books: result.hasOwnProperty('error') ? [] : result,
                })
            })
    }

    /**
     * @default handle input changes
     * @param value
     */
    handleChanges = (value) => {
        this.setState({term: value})
        history.push({
            pathname: history.location.pathname,
            search: value ? '?' + this.queryKey + '=' + value : ''
        })
        this.term$.next(value); // emit term value to use it later for calling API
    }

    render() {
        const {displayLoader, term, hasError, books} = this.state;

        const list = (<div className="text-center">
            <span>Number of search results (<mark>{books.length}</mark>)</span>
            <ol className="books-grid">
                {books.map(book => <Book booksByIds={this.props.booksByIds}
                                         moveBookCallback={this.props.moveBookToShelf}
                                         book={book}
                                         key={book.id}/>)}
            </ol>
        </div>);

        const message = (<div className="text-center">there is no result for your term "
            <mark>{term}</mark>
            "</div>);

        return (
            <div className="search-books">
                <div className="search-books-bar">
                    <Link className="close-search" to="/">Close</Link>
                    <div className="search-books-input-wrapper">
                        <input type="text"
                               autoFocus={true}
                               value={this.state.term}
                               onChange={(event) => this.handleChanges(event.target.value)}
                               placeholder="Search by title or author"/>
                    </div>
                </div>
                <div className="search-books-results">
                    {displayLoader && <Loader/>}
                    {hasError && !!term.length && message}
                    {!!books.length && list}
                </div>
            </div>
        )
    }
}

export default SearchPage;

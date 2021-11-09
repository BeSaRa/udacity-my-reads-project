import React, {Component} from "react";

class BookShelfChanger extends Component {
    //  no need to make shelves as state case it will never change
    shelves = [
        {value: 'currentlyReading', label: 'Currently Reading'},
        {value: 'wantToRead', label: 'Want to Read'},
        {value: 'read', label: 'Read'},
        {value: 'none', label: 'None'}]

    constructor(props) {
        super(props);
        const {booksByIds, book} = props;
        this.state = {
            shelf: (booksByIds && booksByIds[book.id] && booksByIds[book.id].shelf) || book.shelf || 'none',
        }
    }

    handleChange = (shelf) => {
        const {moveBookCallback, book} = this.props;
        this.setState({
            shelf
        }, () => {
            moveBookCallback(book, shelf)
        });
    }

    render() {
        return <div className="book-shelf-changer">
            <select value={this.state.shelf} onChange={(event) => this.handleChange(event.target.value)}>
                <option value="move" disabled>Move to...</option>
                {this.shelves.map(shelf => (<option key={shelf.value} value={shelf.value}>{shelf.label}</option>))}
            </select>
        </div>
    }
}

export default BookShelfChanger;

// the import is needed in every component
import React from 'react';
import { getFunName } from '../helpers';

class StorePicker extends React.Component {

    constructor() {
        // super creates the react component first and then adjusts it
        super();
        this.goToStore = this.goToStore.bind(this);
    }

    goToStore(event) {
        event.preventDefault();
        console.log('url changed');
        // first grab the text from the box
        const storeId = this.storeInput.value;
        console.log(this.storeInput.value)
        // second transition from / to /store/:storeId
        this.context.router.transitionTo(`/store/${storeId}`);
    }

    handleFocus(event) {
        event.target.select();
        //document.querySelector('form input').select();
    }

    // at least the render method is needed
    // only render is bound to the component (storepicker)
    render() {
        return (
            <form className="store-selector" onSubmit={this.goToStore}>
            {/* onSubmit={(e) => this.goToStore(e)} is the other way instead of using the constructor (but it is multiply creating the function) */}
                {/* Comment like this! */}
                <h2>Please Enter A Store</h2>
                {/* in jsx it is important to close all tags (e.g. input, img) */}
                <input type="text" required placeholder="Store Name" defaultValue={getFunName()} onFocus={this.handleFocus} ref={(input) => {this.storeInput = input}} />
                <button type="submit">Visit Store -></button>
            </form>
        )
    }
}


// make context functions available to router
// needed to call something like this.context.router.transitionTo()
StorePicker.contextTypes = {
    router: React.PropTypes.object
}

export default StorePicker;
import React from 'react';


// stateless functional component way (you can use this, if component only renders html)
/*
const Header = (props) => {
    // remove this, because context is not set here
} 
*/

// conventional way to go (creating a class)
// choose either A)  always making a class (make it the same way all the time)
// or B) using stateless functional components for static html to "better" recognize the difference
class Header extends React.Component {
    render() {
        const { tagline } = this.props;
        return (
            <header className="top">
                <h1>
                    Catch 
                    <span className="ofThe">
                        <span className="of">of</span>
                        <span className="the">the</span>
                    </span>
                    Day
                </h1>
                <h3 className="tagline"><span>{tagline}</span></h3>
            </header>
        )
    }
}

Header.propTypes = {
    tagline: React.PropTypes.string.isRequired
}

export default Header;

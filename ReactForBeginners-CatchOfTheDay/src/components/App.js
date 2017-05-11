import React from 'react';
import Header from './Header';
import Order from './Order';
import Inventory from './Inventory';
import Fish from './Fish';
import base from '../base';

import sampleFishes from '../sample-fishes';

class App extends React.Component {

  constructor() {
    super();
    // not needed with arrow function

    // this.addFish = this.addFish.bind(this);
    // this.updateFish = this.updateFish.bind(this);
    // this.removeFish = this.removeFish.bind(this);
    // this.loadSamples = this.loadSamples.bind(this);
    // this.addToOrder = this.addToOrder.bind(this);
    // this.onLogin = this.onLogin.bind(this);
    // this.onLogout = this.onLogout.bind(this);
    // this.removeFromOrder = this.removeFromOrder.bind(this);
  }

  // state is taken out of constructor (semicolon at the end important!)
  // initial state (getInitialState)
  state = {
    fishes: {},
    order: {},
    loggedIn: JSON.parse(localStorage.getItem('loggedIn')) || false
  };

  // this runs right before the app is rendered
  componentWillMount() {
    this.ref = base.syncState(`${this.props.params.storeId}/fishes`,
      {
        context: this,
        state: 'fishes'
      });

    // check if any order is in localStorage
    const localStorageRef = localStorage.getItem(`order-${this.props.params.storeId}`);

    if (localStorageRef) {
      // update our App component's order state
      this.setState({
        order: JSON.parse(localStorageRef)
      });
    }
  }

  componentWillUnmount() {
    base.removeBinding(this.ref);
  }

  componentWillUpdate(nextProps, nextState) {
    localStorage.setItem(`order-${this.props.params.storeId}`, JSON.stringify(nextState.order));
  }

  addFish = (fish) => {
    // update state
    // create a copy of fishes (... = spread-opterator)
    const fishes = {
      ...this.state.fishes
    };
    // add in new fish
    const timestamp = Date.now();
    fishes[`fish-${timestamp}`] = fish;
    // set state
    this.setState({
      fishes: fishes
    });
  };

  updateFish = (key, updatedFish) => {
    const fishes = {...this.state.fishes};
    fishes[key] = updatedFish;
    this.setState({fishes: fishes});
  };

  removeFish = (key) => {
    const fishes = {...this.state.fishes};
    // has to be set to null instead of deleting because of firebase
    fishes[key] = null;
    // this.setState({fishes}) === this.setState(fishes: fishes)
    this.setState({fishes});
  };

  loadSamples = () => {
    this.setState({
      fishes: sampleFishes
    });
  };

  onLogout = () => {
    this.setState({
        loggedIn: false
    });
    localStorage.setItem('loggedIn', false);
  };

  onLogin = () => {
    this.setState({
        loggedIn: true
    });
    localStorage.setItem('loggedIn', true);
  };

  addToOrder = (key) => {
    // copy of state
    const order = {...this.state.order};
    // update or add the new number of fish ordered
    order[key] = order[key] + 1 || 1;
    // update state
    this.setState({
      order: order
    });
  };

  removeFromOrder = (key) => {
    const order = {...this.state.order};
    delete order[key];
    this.setState({order});
  };

  renderFishList = () => {
    return (
      <ul className="list-of-fishes">
    {
      Object
        .keys(this.state.fishes)
        .map((key, index) => <Fish key={index} index={key} details={this.state.fishes[key]} addToOrder={this.addToOrder}/>)
      }
        </ul>
    )
  };

  render() {
    return (
      <div className="catch-of-the-day">
        <div className="menu">
          <Header tagline="Fresh Seafood Market"/>
          {(this.state.loggedIn) ? this.renderFishList() : null}
        </div>
        <Order 
            fishes={this.state.fishes}
            order={this.state.order}
            removeFromOrder={this.removeFromOrder}
            loggedIn={this.state.loggedIn}
            params={this.props.params}/>
        <Inventory 
            fishes={this.state.fishes} 
            addFish={this.addFish} 
            updateFish={this.updateFish} 
            removeFish={this.removeFish} 
            loadSamples={this.loadSamples}
            onLogin={this.onLogin}
            onLogout={this.onLogout}
            storeId={this.props.params.storeId}/>
      </div>
    )
  }

  static propTypes = {
    params: React.PropTypes.object.isRequired
  }
}

export default App

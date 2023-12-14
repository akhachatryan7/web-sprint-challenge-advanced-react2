import React from 'react'
import axios from 'axios'

// Suggested initial states
const initialMessage = ''
const initialEmail = ''
const initialSteps = 0
const initialIndex = 4 // the index the "B" is at

const initialState = {
  message: initialMessage,
  email: initialEmail,
  index: initialIndex,
  steps: initialSteps,
}

export default class AppClass extends React.Component {
  // THE FOLLOWING HELPERS ARE JUST RECOMMENDATIONS.
  // You can delete them and build your own logic from scratch.
state = {...initialState}

  getTime = () => {
    if (this.state.steps === 1) {
      return "time"
    } else {
      return "times"
    }
  }

  getXY = () => {
    // It it not necessary to have a state to track the coordinates.
    // It's enough to know what index the "B" is at, to be able to calculate them.
    const coordinatesArray = [  '(1, 1)', '(2, 1)', '(3, 1)', '(1, 2)', '(2, 2)', '(3, 2)', '(1, 3)', '(2, 3)', '(3, 3)']
    return coordinatesArray[this.state.index]
    
  }

  getXYMessage = () => {
    // It it not necessary to have a state to track the "Coordinates (2, 2)" message for the user.
    // You can use the `getXY` helper above to obtain the coordinates, and then `getXYMessage`
    // returns the fully constructed string.
    return `Coordinates ${this.getXY()}`
  }

  reset = () => {
    // Use this helper to reset all states to their initial values.
    this.setState({
      message: initialMessage,
      email: initialEmail,
      index: initialIndex,
      steps: initialSteps,
  })
  }

  getNextIndex = (direction) => {
    // This helper takes a direction ("left", "up", etc) and calculates what the next index
    // of the "B" would be. If the move is impossible because we are at the edge of the grid,
    // this helper should return the current index unchanged.
    if (direction === 'left' && (this.state.index === 1 || this.state.index === 2 || this.state.index === 4 || this.state.index === 5 || this.state.index === 7 || this.state.index === 8)) {
      this.setState({ ... this.state, index: this.state.index - 1, steps: this.state.steps + 1})
    } else if (direction === 'left' && (this.state.index === 0 || this.state.index === 3 || this.state.index === 6)) {
      this.setState({ ...this.state, message: "You can't go left"})
    } else if (direction === 'right' && (this.state.index === 0 || this.state.index === 1 || this.state.index === 3 || this.state.index === 4 || this.state.index === 6 || this.state.index === 7)) {
      this.setState({ ... this.state, index: this.state.index + 1, steps: this.state.steps + 1})
     } else if (direction === 'right' && (this.state.index === 2 || this.state.index === 5 || this.state.index === 8)) {
      this.setState({ ...this.state, message: "You can't go right"})
     } else if (direction === 'up' && this.state.index >= 3 && this.state.index <= 8 ) {
      this.setState({ ... this.state, index: this.state.index - 3, steps: this.state.steps + 1})
        } else if (direction === 'up' && this.state.index >= 0 && this.state.index <= 2 ) {
          this.setState({ ...this.state, message: "You can't go up"})
            } else if (direction === 'down' && this.state.index >= 0 && this.state.index <= 5) {
              this.setState({ ... this.state, index: this.state.index + 3, steps: this.state.steps + 1})
      }  else if (direction === 'down' && this.state.index >= 6 && this.state.index <= 8) {
        this.setState({ ...this.state, message: "You can't go down"})
      } else {
        return this.state.index
  }
  }

  move = (evt) => {
    // This event handler can use the helper above to obtain a new index for the "B",
    // and change any states accordingly.
    this.getNextIndex(evt.target.id)
  }

  onChange = (evt) => {
    // You will need this to update the value of the input.
    const { value } = evt.target
    this.setState({ ... this.state, email: value})
  }

  onSubmit = (evt) => {
    // Use a POST request to send a payload to the server.
    evt.preventDefault()
    axios.post('http://localhost:9000/api/result', { "x": this.getXY().charAt(1), "y": this.getXY().charAt(4), "steps": this.state.steps, "email": this.state.email })
    .then(res=> {
      this.setState({ ...this.state, message: res.data.message, email: initialEmail,})
    })
    .catch(err => {
      this.setState({ ...this.state, message: err.response.data.message})
    })
  }

  render() {
    const { className } = this.props
    return (
      <div id="wrapper" className={className}>
        <div className="info">
          <h3 id="coordinates">{this.getXYMessage()}</h3>
          <h3 id="steps">You moved {this.state.steps} {this.getTime()}</h3>
        </div>
        <div id="grid">
          {
            [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
              <div key={idx} className={`square${idx === this.state.index ? ' active' : ''}`}>
                {idx === this.state.index ? 'B' : null}
              </div>
            ))
          }
        </div>
        <div className="info">
          <h3 id="message">{this.state.message}</h3>
        </div>
        <div id="keypad">
          <button id="left" onClick={this.move}>LEFT</button>
          <button id="up" onClick={this.move}>UP</button>
          <button id="right" onClick={this.move}>RIGHT</button>
          <button id="down" onClick={this.move}>DOWN</button>
          <button id="reset"onClick= {this.reset}>reset</button>
        </div>
        <form onSubmit={this.onSubmit}>
          <input id="email" type="email" placeholder="type email" value={this.state.email} onChange={this.onChange}></input>
          <input id="submit" type="submit"></input>
        </form>
      </div>
    )
  }
}

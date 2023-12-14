import React, { useState } from 'react'
import axios from 'axios'

// Suggested initial states
const initialMessage = ''
const initialEmail = ''
const initialSteps = 0
const initialIndex = 4 // the index the "B" is at

export default function AppFunctional(props) {
  // THE FOLLOWING HELPERS ARE JUST RECOMMENDATIONS.
  // You can delete them and build your own logic from scratch.
  const [index, setIndex] = useState(initialIndex);
  const [message, setMessage] = useState(initialMessage);
  const [email, setEmail] = useState(initialEmail);
  const [steps, setSteps] = useState(initialSteps);

  function getTime (){
    if (steps === 1) {
      return "time"
    } else {
      return "times"
    }
  }

  function getXY() {
    // It it not necessary to have a state to track the coordinates.
    // It's enough to know what index the "B" is at, to be able to calculate them.
    const coordinatesArray = [  '(1, 1)', '(2, 1)', '(3, 1)', '(1, 2)', '(2, 2)', '(3, 2)', '(1, 3)', '(2, 3)', '(3, 3)']
    const coordinates = coordinatesArray[index]
    return coordinates
  }

  function getXYMessage() {
    // It is not necessary to have a state to track the "Coordinates (2, 2)" message for the user.
    // You can use the `getXY` helper above to obtain the coordinates, and then `getXYMessage`
    // returns the fully constructed string.
    return `Coordinates ${getXY()}`
  }

  function reset() {
    // Use this helper to reset all states to their initial values.
    setEmail(initialEmail);
    setMessage(initialMessage);
    setIndex(initialIndex);
    setSteps(initialSteps);
  }

  function getNextIndex(direction) {
    // This helper takes a direction ("left", "up", etc) and calculates what the next index
    // of the "B" would be. If the move is impossible because we are at the edge of the grid,
    // this helper should return the current index unchanged.
    if (direction === 'left' && (index === 1 || index === 2 || index === 4 || index === 5 || index === 7 || index === 8)) {
        return setIndex(index - 1) & setSteps(steps + 1)
      } else if (direction === 'left' && (index === 0 || index === 3 || index === 6)) {
        return setMessage("You can't go left")
      } else if (direction === 'right' && (index === 0 || index === 1 || index === 3 || index === 4 || index === 6 || index === 7)) {
        return setIndex(index + 1) & setSteps(steps + 1)
       } else if (direction === 'right' && (index === 2 || index === 5 || index === 8)) {
        return setMessage("You can't go right")
       } else if (direction === 'up' && index >= 3 && index <= 8 ) {
        return setIndex(index - 3) & setSteps(steps + 1)
          } else if (direction === 'up' && index >= 0 && index <= 2 ) {
            return setMessage("You can't go up")
              } else if (direction === 'down' && index >= 0 && index <= 5) {
          return setIndex(index + 3) & setSteps(steps + 1)
        }  else if (direction === 'down' && index >= 6 && index <= 8) {
          return setMessage("You can't go down")
        } else {
          return index
    }
  }

  function move(evt) {
    // This event handler can use the helper above to obtain a new index for the "B",
    // and change any states accordingly.
    getNextIndex(evt.target.id)
  }

  function onChange(evt) {
    // You will need this to update the value of the input.
    const { value } = evt.target
    setEmail(value)
  }

  function onSubmit(evt) {
    // Use a POST request to send a payload to the server.
    evt.preventDefault()
    axios.post('http://localhost:9000/api/result', { "x": getXY().charAt(1), "y": getXY().charAt(4), "steps": steps, "email": email })
    .then(res=> {
      setEmail("");
      setMessage(res.data.message)
    })
    .catch(err => {
      setMessage(err.response.data.message)
    })
  }

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">{getXYMessage()}</h3>
        <h3 id="steps">You moved {steps} {getTime()}</h3>
      </div>
      <div id="grid">
        {
          [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
            <div key={idx} className={`square${idx === index ? ' active' : ''}`}>
              {idx === index ? 'B' : null}
            </div>
          ))
        }
      </div>
      <div className="info">
        <h3 id="message">{message}</h3>
      </div>
      <div id="keypad">
        <button id="left" onClick={move}>LEFT</button>
        <button id="up" onClick={move}>UP</button>
        <button id="right" onClick={move}>RIGHT</button>
        <button id="down" onClick={move}>DOWN</button>
        <button onClick={reset} id="reset">reset</button>
      </div>
      <form onSubmit={onSubmit}>
        <input id="email" type="email" placeholder="type email" value={email} onChange={onChange}></input>
        <input id="submit" type="submit"></input>
      </form>
    </div>
  )
}

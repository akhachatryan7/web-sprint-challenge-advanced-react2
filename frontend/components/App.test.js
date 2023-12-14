// Write your tests here
import React from "react"
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import AppClass from "./AppClass"

const updateStatelessSelectors = document => {
  up = document.querySelector('#up')
  down = document.querySelector('#down')
  left = document.querySelector('#left')
  right = document.querySelector('#right')
  reset = document.querySelector('#reset')
  submit = document.querySelector('#submit')
}

const updateStatefulSelectors = document => {
  squares = document.querySelectorAll('.square')
  coordinates = document.querySelector('#coordinates')
  steps = document.querySelector('#steps')
  message = document.querySelector('#message')
  email = document.querySelector('#email')
}

test('renders without errors', () => {
  render(<AppClass/>);
})

test('can enter email', () => {
  render(<AppClass/>);

  fireEvent.change(email, { target: { value: 'adrianp1299@gmail.com' } })
  expect(email).toHaveValue('adrianp1299@gmail.com')
})

test('steps are reset', () => {
  render(<AppClass/>)
    fireEvent.click(up)
    fireEvent.click(up)
    fireEvent.click(left)
    expect(steps.textContent).toBe("You moved 2 times")
    fireEvent.click(reset)
    expect(steps.textContent).toBe("You moved 0 times")
})

test('Has Coordinates', () => {
  render(<AppClass/>);

  expect(coordinates.textContent).toMatch(/\(2.*2\)$/)
})

test('coordinates moves', () => {
  render(<AppClass/>);
  fireEvent.click(up)
  fireEvent.click(left)
  expect(coordinates.textContent).toMatch(/\(1.*1\)$/)
})



test('sanity', () => {
  expect(true).toBe(true)
})

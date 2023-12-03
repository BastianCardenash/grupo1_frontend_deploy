/* eslint-disable react/prop-types */
import './Button.css'

export default function Button ({ text, type, isDisabled, onClick }) {
  return (
    <div>
      <button className={type} disabled={isDisabled} onClick={onClick}>{text}</button>
    </div>
  )
}
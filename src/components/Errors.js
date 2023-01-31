import React from 'react'

const Errors = ({ errorMsg }) => {
  return (
    <div
      className={`${errorMsg ? "show-error" : "hide-error"} error`}
    >
      {errorMsg ? `${errorMsg}` : "placeholder"}
    </div>
  )
}

export default Errors
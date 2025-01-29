import React from "react";

const FailureView = ({ onRetry }) => (
  <div className="failure-view">
    <p>Something went wrong</p>
    <button onClick={onRetry}>Try Again</button>
  </div>
);

export default FailureView;

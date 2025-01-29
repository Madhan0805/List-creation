import React from "react";

const ListContainer = ({ list }) => (
  <div className="list-container">
    <h3>{list?.name || "Untitled"}</h3>
    <p>{list?.description || "No description available"}</p>
  </div>
);

export default ListContainer;

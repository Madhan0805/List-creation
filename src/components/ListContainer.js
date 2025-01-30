import React from "react"; // Import React library

// ListContainer component: Displays a list with its name and description
const ListContainer = ({ list }) => (
  <div className="list-container"> 
    {/* Display list name, fallback to 'Untitled' if name is missing */}
    <h3>{list?.name || "Untitled"}</h3>  

    {/* Display list description, fallback to default text if missing */}
    <p>{list?.description || "No description available"}</p>  
  </div>
);

export default ListContainer; // Export the component for reuse

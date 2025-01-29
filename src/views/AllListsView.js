import React, { useState, useEffect } from "react";
import ListContainer from "../components/ListContainer"; // Assuming ListContainer is in the components folder
import '../styles/index.css'; // Import the CSS file

const AllListsView = () => {
  const [lists, setLists] = useState([]); // Store fetched lists
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [hasError, setHasError] = useState(false); // Error state

  useEffect(() => {
    // Function to fetch lists from the API
    const fetchLists = async () => {
      try {
        const response = await fetch("https://apis.ccbp.in/list-creation/lists");
        if (response.ok) {
          const data = await response.json();
          setLists(data.lists || []); // Set the fetched lists data
          setIsLoading(false); // Stop loading
        } else {
          throw new Error("Failed to fetch lists");
        }
      } catch (error) {
        console.error(error);
        setHasError(true); // Set error if API fails
        setIsLoading(false); // Stop loading
      }
    };

    fetchLists(); // Call the fetch function when the component mounts
  }, []); // Empty dependency array to run this effect once on mount

  if (isLoading) {
    return <p>Loading...</p>; // Show loading state
  }

  if (hasError) {
    return (
      <div>
        <p>Something went wrong. Please try again.</p>
        <button onClick={() => window.location.reload()}>Try Again</button>
      </div>
    ); // Show error message and retry button
  }

  // Split lists based on list_number
  const list1 = lists.filter((list) => list.list_number === 1);
  const list2 = lists.filter((list) => list.list_number === 2);

  return (
    <div className="list-container-wrapper">
      <h1 className="heading">List creation</h1>
      <div className="button-container">
      <button className="new-list-btn">Create New List</button>
      </div>
      <div className="list-column-wrapper">
        {/* Column for List 1 */}
        <div className="list-column">
          <h2>
            List 1 ({list1.length}) {/* Display the count of List 1 */}
          </h2>
          {list1.length > 0 ? (
            list1.map((list) => (
              <ListContainer key={list.id} list={list} />
            ))
          ) : (
            <p>No items available in List 1</p>
          )}
        </div>

        {/* Column for List 2 */}
        <div className="list-column">
          <h2>
            List 2 ({list2.length}) {/* Display the count of List 2 */}
          </h2>
          {list2.length > 0 ? (
            list2.map((list) => (
              <ListContainer key={list.id} list={list} />
            ))
          ) : (
            <p>No items available in List 2</p>
          )}
        </div>
      </div>
      <div className="button-container">
      <button className="update-list-btn">Update</button>
      <button className="cancel-list-btn">Cancel</button>
      </div>
    </div>
  );
};

export default AllListsView;
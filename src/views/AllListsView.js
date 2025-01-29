import React, { useState, useEffect } from "react";
import ListContainer from "../components/ListContainer"; // Assuming ListContainer is in the components folder
import "../styles/index.css"; // Import the CSS file

const AllListsView = () => {
  const [lists, setLists] = useState([]); // Store fetched lists
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [hasError, setHasError] = useState(false); // Error state
  const [isList1Selected, setIsList1Selected] = useState(false); // Checkbox for List 1
  const [isList2Selected, setIsList2Selected] = useState(false); // Checkbox for List 2
  const [validationMessage, setValidationMessage] = useState(""); // Validation message state
  const [newList, setNewList] = useState([]); // New list to store dragged items
  const [isNewListCreated, setIsNewListCreated] = useState(false); // Check if the new list is created
  const [list3, setList3] = useState(null); // Store List 3 after update
  const [isList3Visible, setIsList3Visible] = useState(false); // Track visibility of List 3

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

  const handleCreateNewList = () => {
    // Check if both checkboxes are selected
    if (isList1Selected && isList2Selected) {
      setIsNewListCreated(true); // Set new list creation flag
      setValidationMessage(""); // Clear validation message
      setList3(null); // Reset List 3 in case of new creation
      setIsList3Visible(false); // Initially keep List 3 hidden
    } else {
      // Show validation message if not both checkboxes are selected
      setValidationMessage("You should select exactly 2 lists to create a new list.");
    }
  };

  const handleUpdateList = () => {
    // After clicking the update button, List 3 is created with the dropped items
    if (newList.length > 0) {
      const newList3 = {
        id: Date.now(), // Generate a unique ID for List 3
        list_number: 3, // List number
        name: `List 3 (${newList.length})`, // Name with count
        items: newList, // Add the dropped items
      };

      setList3(newList3); // Set List 3 with dropped items
      setIsList3Visible(true); // Show List 3 after update
      setNewList([]); // Clear new list items (so it disappears)
      setIsNewListCreated(false); // Hide the New List box
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault(); // Allow dropping by preventing default handling
  };

  const handleDrop = (e) => {
    // Parse the dragged item data
    const draggedItem = JSON.parse(e.dataTransfer.getData("item"));
    if (draggedItem && isNewListCreated) {
      setNewList((prevNewList) => [...prevNewList, draggedItem]); // Add dragged item to the new list
    }
  };

  const handleDragStart = (e, item) => {
    // Set the dragged item data to be transferred
    e.dataTransfer.setData("item", JSON.stringify(item));
  };

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
        <button className="new-list-btn" onClick={handleCreateNewList}>Create New List</button>
        {validationMessage && <p className="validation-message">{validationMessage}</p>}
      </div>

      <div className="list-column-wrapper">
        {/* Column for List 1 */}
        <div className="list-column">
          <div className="checkbox-container">
            <div>
              <input 
                type="checkbox" 
                id="list1-checkbox" 
                checked={isList1Selected} 
                onChange={() => setIsList1Selected(!isList1Selected)} 
              />
              <label htmlFor="list1-checkbox">Select List 1</label>
            </div>
          </div>
          <h2>
            List 1 ({list1.length}) {/* Display the count of List 1 */}
          </h2>
          {list1.length > 0 ? (
            list1.map((list) => (
              <div
                key={list.id}
                className="list-container"
                draggable
                onDragStart={(e) => handleDragStart(e, list)}
              >
                <ListContainer list={list} />
              </div>
            ))
          ) : (
            <p>No items available in List 1</p>
          )}
        </div>

        {/* New List Column (between List 1 and List 2) */}
        {isNewListCreated && (
          <div
            className="list-column new-list-column"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <h2>New List</h2> {/* New list title */}
            {newList.length > 0 ? (
              newList.map((item, index) => (
                <div key={index} className="list-container">
                  <ListContainer list={item} />
                </div>
              ))
            ) : (
              <p>No items added to New List</p>
            )}
          </div>
        )}

        {/* Column for List 2 */}
        <div className="list-column">
          <div className="checkbox-container">
            <div>
              <input 
                type="checkbox" 
                id="list2-checkbox" 
                checked={isList2Selected} 
                onChange={() => setIsList2Selected(!isList2Selected)} 
              />
              <label htmlFor="list2-checkbox">Select List 2</label>
            </div>
          </div>
          <h2>
            List 2 ({list2.length}) {/* Display the count of List 2 */}
          </h2>

          {list2.length > 0 ? (
            list2.map((list) => (
              <div
                key={list.id}
                className="list-container"
                draggable
                onDragStart={(e) => handleDragStart(e, list)}
              >
                <ListContainer list={list} />
              </div>
            ))
          ) : (
            <p>No items available in List 2</p>
          )}
        </div>

        {/* Column for List 3 */}
        {isList3Visible && list3 && (
          <div className="list-column">
            <h2>{list3.name}</h2> {/* Display List 3 name with count */}
            {list3.items.map((item, index) => (
              <div key={index} className="list-container">
                <ListContainer list={item} />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="button-container-2">
        <button className="update-list-btn" onClick={handleUpdateList}>Update</button>
        <button className="cancel-list-btn" onClick={() => setIsNewListCreated(false)}>Cancel</button>
      </div>
    </div>
  );
};

export default AllListsView;

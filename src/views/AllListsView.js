import React, { useState, useEffect } from "react";
import ListContainer from "../components/ListContainer"; // Import the ListContainer component
import "../styles/index.css"; // Import the CSS file

const AllListsView = () => {
  // State variables
  const [lists, setLists] = useState([]); // Stores fetched lists
  const [isLoading, setIsLoading] = useState(true); // Tracks loading state
  const [hasError, setHasError] = useState(false); // Tracks error state
  const [isList1Selected, setIsList1Selected] = useState(false);
  const [isList2Selected, setIsList2Selected] = useState(false);
  const [validationMessage, setValidationMessage] = useState(""); // Stores validation message
  const [newList, setNewList] = useState([]); // Stores dragged items for the new list
  const [isNewListCreated, setIsNewListCreated] = useState(false);
  const [list3, setList3] = useState(null); // Stores the created new list
  const [isList3Visible, setIsList3Visible] = useState(false); // Controls visibility of list 3

  // Fetch lists from API on component mount
  useEffect(() => {
    const fetchLists = async () => {
      try {
        const response = await fetch("https://apis.ccbp.in/list-creation/lists");
        if (response.ok) {
          const data = await response.json();
          setLists(data.lists || []);
        } else {
          throw new Error("Failed to fetch lists");
        }
      } catch (error) {
        console.error(error);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLists();
  }, []);

  // Handle creating a new list after selecting two lists
  const handleCreateNewList = () => {
    if (isList1Selected && isList2Selected) {
      setIsNewListCreated(true);
      setValidationMessage("");
      setList3(null);
      setIsList3Visible(false);
    } else {
      setValidationMessage("You should select exactly 2 lists to create a new list.");
    }
  };

  // Handle updating the new list with dragged items
  const handleUpdateList = () => {
    if (newList.length > 0) {
      setList3({
        id: Date.now(),
        list_number: 3,
        name: `List 3 (${newList.length})`,
        items: newList,
      });

      setIsList3Visible(true);
      setNewList([]);
      setIsNewListCreated(false);
    }
  };

  // Allow dropping items by preventing default behavior
  const handleDragOver = (e) => e.preventDefault();

  // Handle dropping an item into a specific list
  const handleDrop = (e, targetList) => {
    e.preventDefault();
    const draggedItem = JSON.parse(e.dataTransfer.getData("item"));

    if (draggedItem) {
      if (targetList === "newList" && !newList.some(item => item.id === draggedItem.id)) {
        setNewList(prevNewList => [...prevNewList, draggedItem]);
        setLists(prevLists => prevLists.filter(item => item.id !== draggedItem.id));
      } else if (targetList === "list1") {
        setNewList(prevNewList => prevNewList.filter(item => item.id !== draggedItem.id));
        setLists(prevLists => [...prevLists, { ...draggedItem, list_number: 1 }]);
      } else if (targetList === "list2") {
        setNewList(prevNewList => prevNewList.filter(item => item.id !== draggedItem.id));
        setLists(prevLists => [...prevLists, { ...draggedItem, list_number: 2 }]);
      }
    }
  };

  // Store dragged item data for transfer
  const handleDragStart = (e, item) => {
    e.dataTransfer.setData("item", JSON.stringify(item));
  };

  // Show loading or error message if applicable
  if (isLoading) {
    return <div className="loading-view"><p className="loading-text">Loading...</p></div>;
  }
  if (hasError) {
    return (
      <div className="failure-view">
        <p className="failure-text">Something went wrong</p>
        <button className="retry-button" onClick={() => window.location.reload()}>Try Again</button>
      </div>
    );
  }

  // Separate lists based on list_number
  const list1 = lists.filter(list => list.list_number === 1);
  const list2 = lists.filter(list => list.list_number === 2);

  return (
    <div className="list-container-wrapper">
      <h1 className="heading">List creation</h1>
      <div className="button-container">
        <button className="new-list-btn" onClick={handleCreateNewList}>Create New List</button>
        {validationMessage && <p className="validation-message">{validationMessage}</p>}
      </div>

      <div className="list-column-wrapper">
        {/* List 1 */}
        <div className="list-column" onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, "list1")}>
          <div className="checkbox-container">
            <input type="checkbox" id="list1-checkbox" checked={isList1Selected} onChange={() => setIsList1Selected(!isList1Selected)} />
            <label htmlFor="list1-checkbox">Select List 1</label>
          </div>
          <h2>List 1 ({list1.length})</h2>
          {list1.length > 0 ? (
            list1.map((list) => (
              <div key={list.id} className="list-container" draggable onDragStart={(e) => handleDragStart(e, list)}>
                <ListContainer list={list} />
              </div>
            ))
          ) : <p>No items available in List 1</p>}
        </div>

        {/* New List */}
        {isNewListCreated && (
          <div className="list-column new-list-column" onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, "newList")}>
            <h2>New List</h2>
            {newList.length > 0 ? (
              newList.map((item, index) => (
                <div key={index} className="list-container" draggable onDragStart={(e) => handleDragStart(e, item)}>
                  <ListContainer list={item} />
                </div>
              ))
            ) : <p>No items added to New List</p>}
          </div>
        )}

        {/* List 2 */}
        <div className="list-column" onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, "list2")}>
          <div className="checkbox-container">
            <input type="checkbox" id="list2-checkbox" checked={isList2Selected} onChange={() => setIsList2Selected(!isList2Selected)} />
            <label htmlFor="list2-checkbox">Select List 2</label>
          </div>
          <h2>List 2 ({list2.length})</h2>
          {list2.length > 0 ? (
            list2.map((list) => (
              <div key={list.id} className="list-container" draggable onDragStart={(e) => handleDragStart(e, list)}>
                <ListContainer list={list} />
              </div>
            ))
          ) : <p>No items available in List 2</p>}
        </div>

        {/* List 3 */}
        {isList3Visible && list3 && (
          <div className="list-column">
            <h2>{list3.name}</h2>
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

import React, { useState, useEffect } from "react";
import ListContainer from "../components/ListContainer";
import "../styles/index.css";

const AllListsView = () => {
  const [lists, setLists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isList1Selected, setIsList1Selected] = useState(false);
  const [isList2Selected, setIsList2Selected] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");
  const [newList, setNewList] = useState([]);
  const [isNewListCreated, setIsNewListCreated] = useState(false);
  const [list3, setList3] = useState(null);
  const [isList3Visible, setIsList3Visible] = useState(false);

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

  const handleDragStart = (e, item) => {
    e.dataTransfer.setData("item", JSON.stringify(item));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetList) => {
    e.preventDefault();
    const draggedItem = JSON.parse(e.dataTransfer.getData("item"));

    if (draggedItem) {
      if (targetList === "newList" && !newList.some((item) => item.id === draggedItem.id)) {
        setNewList((prevNewList) => [...prevNewList, draggedItem]);
        setLists((prevLists) => prevLists.filter((item) => item.id !== draggedItem.id));
      } else if (targetList === "list1") {
        setNewList((prevNewList) => prevNewList.filter((item) => item.id !== draggedItem.id));
        setLists((prevLists) => [...prevLists, { ...draggedItem, list_number: 1 }]);
      } else if (targetList === "list2") {
        setNewList((prevNewList) => prevNewList.filter((item) => item.id !== draggedItem.id));
        setLists((prevLists) => [...prevLists, { ...draggedItem, list_number: 2 }]);
      }
    }
  };

  const handleTouchStart = (e, item) => {
    e.preventDefault();
    handleDragStart(e, item);
  };

  const handleTouchEnd = (e) => {
    e.preventDefault();
  };

  const handleTouchMove = (e) => {
    e.preventDefault();
  };

  if (isLoading) {
    return <div className="loading-view"><p className="loading-text">Loading...</p></div>;
  }
  if (hasError) {
    return (
      <div className="failure-view">
        <p className="failure-text">Something went wrong</p>
        <button className="retry-button" onClick={() => window.location.reload()}>
          Try Again
        </button>
      </div>
    );
  }

  const list1 = lists.filter((list) => list.list_number === 1);
  const list2 = lists.filter((list) => list.list_number === 2);

  return (
    <div className="list-container-wrapper">
      <h1 className="heading">List creation</h1>
      <div className="button-container">
        <button className="new-list-btn" onClick={handleCreateNewList}>
          Create New List
        </button>
        {validationMessage && <p className="validation-message">{validationMessage}</p>}
      </div>

      <div className="list-column-wrapper">
        <div className="list-column" onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, "list1")}>
          <div className="checkbox-container">
            <input
              type="checkbox"
              id="list1-checkbox"
              checked={isList1Selected}
              onChange={() => setIsList1Selected(!isList1Selected)}
            />
            <label htmlFor="list1-checkbox">Select List 1</label>
          </div>
          <h2>List 1 ({list1.length})</h2>
          {list1.length > 0 ? (
            list1.map((list) => (
              <div
                key={list.id}
                className="list-container"
                draggable
                onDragStart={(e) => handleDragStart(e, list)}
                onTouchStart={(e) => handleTouchStart(e, list)}
                onTouchEnd={(e) => handleTouchEnd(e)}
                onTouchMove={(e) => handleTouchMove(e)}
              >
                <ListContainer list={list} />
              </div>
            ))
          ) : (
            <p>No items available in List 1</p>
          )}
        </div>

        {isNewListCreated && (
          <div className="list-column new-list-column" onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, "newList")}>
            <h2>New List</h2>
            {newList.length > 0 ? (
              newList.map((item, index) => (
                <div
                  key={index}
                  className="list-container"
                  draggable
                  onDragStart={(e) => handleDragStart(e, item)}
                  onTouchStart={(e) => handleTouchStart(e, item)}
                  onTouchEnd={(e) => handleTouchEnd(e)}
                  onTouchMove={(e) => handleTouchMove(e)}
                >
                  <ListContainer list={item} />
                </div>
              ))
            ) : (
              <p>No items added to New List</p>
            )}
          </div>
        )}

        <div className="list-column" onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, "list2")}>
          <div className="checkbox-container">
            <input
              type="checkbox"
              id="list2-checkbox"
              checked={isList2Selected}
              onChange={() => setIsList2Selected(!isList2Selected)}
            />
            <label htmlFor="list2-checkbox">Select List 2</label>
          </div>
          <h2>List 2 ({list2.length})</h2>
          {list2.length > 0 ? (
            list2.map((list) => (
              <div
                key={list.id}
                className="list-container"
                draggable
                onDragStart={(e) => handleDragStart(e, list)}
                onTouchStart={(e) => handleTouchStart(e, list)}
                onTouchEnd={(e) => handleTouchEnd(e)}
                onTouchMove={(e) => handleTouchMove(e)}
              >
                <ListContainer list={list} />
              </div>
            ))
          ) : (
            <p>No items available in List 2</p>
          )}
        </div>

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
        <button className="update-list-btn" onClick={handleUpdateList}>
          Update
        </button>
        <button className="cancel-list-btn" onClick={() => setIsNewListCreated(false)}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default AllListsView;

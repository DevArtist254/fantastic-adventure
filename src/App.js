import { useState } from "react";
import "./App.css";

function Logo() {
  return <h1>Far Away</h1>;
}

function Form({ setItems }) {
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState(1);

  function handleSumbit(e) {
    e.preventDefault();

    const newItem = { id: Date.now(), description, quantity, packed: false };

    setItems((curItems) => [...curItems, newItem]);

    setDescription("");
    setQuantity(1);
  }

  return (
    <form onSubmit={(e) => handleSumbit(e)} className="add-form">
      <h3>What do you need for your trip?</h3>
      <select value={quantity} onChange={(e) => setQuantity(e.target.value)}>
        {Array(20)
          .fill()
          .map((e, i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1}
            </option>
          ))}
      </select>
      <input
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        type="text"
        placeholder="item..."
      />
      <button type="submit">Add</button>
    </form>
  );
}

function PackingList({ items, onPackedItem, onDeleteItems }) {
  const [sortby, setSortby] = useState("input");

  let sortedItems;

  if (sortby === "input") sortedItems = items;

  if (sortby === "description")
    sortedItems = items
      .slice()
      .sort((a, b) => a.description.localeCompare(b.description));

  if (sortby === "quantity")
    sortedItems = items
      .slice()
      .sort((a, b) => Number(a.quantity) - Number(b.quantity));

  return (
    <div className="list">
      <ul>
        {sortedItems.map((item) => (
          <Item
            key={item.id}
            item={item}
            onPackedItem={onPackedItem}
            onDeleteItems={onDeleteItems}
          />
        ))}
      </ul>
      <select value={sortby} onChange={(e) => setSortby(e.target.value)}>
        <option value="input">Sort by input</option>
        <option value="description">Sort by description</option>
        <option value="quantity">Sort by quantity</option>
      </select>
    </div>
  );
}

function Item({ item, onPackedItem, onDeleteItems }) {
  return (
    <li>
      <input onChange={() => onPackedItem(item.id)} type="checkbox" />
      <span style={{ textDecoration: item.packed ? "line-through" : "" }}>
        {item.quantity} {item.description}
      </span>
      <button onClick={() => onDeleteItems(item.id)}>x</button>
    </li>
  );
}

function Stats({ items }) {
  const tripItems = items.length;
  const itemsPacked = items.filter((item) => item.packed).length;
  const percentage = Math.round((itemsPacked / tripItems) * 100);

  return (
    <div className="stats">
      {tripItems === 0 ? (
        <h3>Start your packing journey here</h3>
      ) : (
        <h3>
          {" "}
          {tripItems} total items, {itemsPacked} total items packed {percentage}
          %{" "}
        </h3>
      )}
    </div>
  );
}

function App() {
  const [items, setItems] = useState([]);

  function handleDeleteItems(id) {
    setItems((items) => items.filter((item) => !(item.id === id)));
  }

  function handlePackedItems(id) {
    setItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, packed: !item.packed } : item
      )
    );
  }

  return (
    <div className="app">
      <Logo />
      <Form setItems={setItems} />
      <PackingList
        items={items}
        onPackedItem={handlePackedItems}
        onDeleteItems={handleDeleteItems}
      />
      <Stats items={items} />
    </div>
  );
}

export default App;

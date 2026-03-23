import React from "react";

const AddElementPanel: React.FC = () => {
  return (
    <div className="edit-panel">
      <h3>Add element</h3>

      <div className="element-options">
        <button>Jewelry</button>
        <button>Bag</button>
        <button>Shoes</button>
      </div>
    </div>
  );
};

export default AddElementPanel;

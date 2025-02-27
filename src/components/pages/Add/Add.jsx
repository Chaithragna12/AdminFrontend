import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Add.css";

const Add = ({ onProductAdded }) => {
  const [product, setProduct] = useState({
    name: "",
    price: "",
    category: "", // This will temporarily store the category _id from the dropdown
    available: true,
  });

  const [categories, setCategories] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch categories from backend
  useEffect(() => {
    axios
      .get("http://localhost:3000/api/categories/categories")
      .then((response) => {
        console.log("Fetched Categories:", response.data);
        setCategories(response.data);
      })
      .catch((error) => console.error("Error fetching categories:", error));
  }, []);

  // Clear success message after 3 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Find the selected category (using its _id)
      const selectedCategory = categories.find(
        (cat) => cat._id === product.category
      );
      if (!selectedCategory) {
        throw new Error("Invalid category selected");
      }

      // Prepare product data: send the category name instead of its id
      const productToSend = { ...product, category: selectedCategory.name };

      console.log("Submitting product:", productToSend);

      const response = await axios.post(
        "http://localhost:3000/api/products/add",
        productToSend,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log("Product Added:", response.data);
      setSuccessMessage("Product added successfully!");

      // Reset form
      setProduct({
        name: "",
        price: "",
        category: "",
        available: true,
      });
      if (onProductAdded) {
        onProductAdded(response.data);
      }
    } catch (error) {
      console.error(
        "Error adding product:",
        error.response ? error.response.data : error.message
      );
    }
  };

  return (
    <div className="add-product-container">
      <h1>Add Product</h1>
      {successMessage && (
        <p className="success-message">
          {successMessage}
          <button onClick={() => setSuccessMessage("")} className="close-btn">
            X
          </button>
        </p>
      )}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={product.name}
          onChange={handleChange}
          placeholder="Product Name"
          required
        />
        <input
          type="number"
          name="price"
          value={product.price}
          onChange={handleChange}
          placeholder="Price"
          required
        />
        <select
          name="category"
          value={product.category}
          onChange={handleChange}
          required
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
        <label>
          Available:
          <input
            type="checkbox"
            name="available"
            checked={product.available}
            onChange={handleChange}
          />
        </label>
        <button type="submit">Add Product</button>
      </form>
    </div>
  );
};

export default Add;

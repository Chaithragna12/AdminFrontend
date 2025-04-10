import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Add.css"; // Updated CSS file name

const AddProduct = ({ onProductAdded }) => {
  const [product, setProduct] = useState({
    name: "",
    price: "",
    category: "",
  });

  const [categories, setCategories] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    axios
      .get("https://adminbackend-dg8o.onrender.com/api/categories/categories")
      .then((response) => setCategories(response.data))
      .catch((error) => console.error("Error fetching categories:", error));
  }, []);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const selectedCategory = categories.find((cat) => cat._id === product.category);
      if (!selectedCategory) throw new Error("Invalid category selected");

      const productToSend = { ...product, category: selectedCategory.name };

      await axios.post("https://adminbackend-dg8o.onrender.com/api/products/add", productToSend, {
        headers: { "Content-Type": "application/json" },
      });

      setSuccessMessage("Product added successfully!");
      setProduct({ name: "", price: "", category: "" });

      if (onProductAdded) onProductAdded();
    } catch (error) {
      console.error("Error adding product:", error.response ? error.response.data : error.message);
    }
  };

  return (
    <div className="add-product-container">
      <h1>Add New Product</h1>
      {successMessage && (
        <p className="success-message">
          {successMessage}
          <button onClick={() => setSuccessMessage("")} className="close-btn">
            ✖
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
          placeholder="Price ($)"
          required
        />
        <select name="category" value={product.category} onChange={handleChange} required>
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
        <button type="submit">Add Product</button>
      </form>
    </div>
  );
};

export default AddProduct;

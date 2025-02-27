import React, { useState, useEffect } from "react";
import axios from "axios";
import "./List.css"; // Updated CSS

const List = () => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editData, setEditData] = useState({
    name: "",
    price: "",
    category: ""
  });
  const [categories, setCategories] = useState([]);

  // Fetch products from backend
  useEffect(() => {
    axios
      .get("https://akshaya-admin-be.onrender.com/api/products/all")
      .then((response) => {
        console.log("Fetched Products:", response.data);
        setProducts(response.data);
      })
      .catch((error) => console.error("Error fetching products:", error));
  }, []);

  // Fetch categories for the dropdown in update form
  useEffect(() => {
    axios
      .get("https://akshaya-admin-be.onrender.com/api/categories/categories")
      .then((response) => {
        console.log("Fetched Categories:", response.data);
        setCategories(response.data);
      })
      .catch((error) => console.error("Error fetching categories:", error));
  }, []);

  // Handle Edit Button Click
  const handleEdit = (product) => {
    setEditingProduct(product._id);
    setEditData({
      name: product.name,
      price: product.price,
      // Use category name here because backend expects a category name
      category: product.category?.name || ""
    });
  };

  // Handle Input Changes for the update form
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle Update with dropdown-selected category
  const handleUpdate = async () => {
    try {
      console.log("Updating product with data:", editData);
      const response = await axios.put(
        `https://akshaya-admin-be.onrender.com/api/products/edit/${editingProduct}`,
        editData,
        { headers: { "Content-Type": "application/json" } }
      );

      const updatedProduct = response.data; // Get the full updated product from backend

      setProducts((prevProducts) =>
        prevProducts.map((p) =>
          p._id === editingProduct ? updatedProduct : p
        )
      );

      setEditingProduct(null);
    } catch (error) {
      console.error(
        "Error updating product:",
        error.response ? error.response.data : error.message
      );
    }
  };

  // Handle Delete (unchanged)
  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://akshaya-admin-be.onrender.com/api/products/delete/${id}`);
      setProducts((prevProducts) => prevProducts.filter((p) => p._id !== id));
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <div className="list-container">
      <h1 className="heading">Product List</h1>
      {products.length === 0 ? (
        <p>No products available</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Category</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <React.Fragment key={product._id}>
                <tr>
                  <td>{product.name}</td>
                  <td>₹{product.price}</td>
                  <td>{product.category?.name || "Unknown"}</td>
            
                  <td>
                  <button  className="button"  onClick={() => handleEdit(product)}>Edit</button>
                    <button className="delete-button" onClick={() => handleDelete(product._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
                {editingProduct === product._id && (
                  <tr className="edit-row">
                    <td colSpan="5">
                      <div className="edit-form-container">
                        <h3>Edit Product</h3>
                        <input
                          type="text"
                          name="name"
                          value={editData.name}
                          onChange={handleChange}
                          placeholder="Product Name"
                        />
                        <input
                          type="number"
                          name="price"
                          value={editData.price}
                          onChange={handleChange}
                          placeholder="Price"
                        />
                        {/* Dropdown for category selection */}
                        <select
                          name="category"
                          value={editData.category}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Select Category</option>
                          {categories.map((cat) => (
                            <option key={cat._id} value={cat.name}>
                              {cat.name}
                            </option>
                          ))}
                        </select>
                       
                        <button onClick={handleUpdate}>Update</button>
                        <button onClick={() => setEditingProduct(null)}>
                          Cancel
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default List;

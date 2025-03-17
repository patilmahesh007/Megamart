import React, { useState, useEffect } from 'react';
import { toast } from "react-hot-toast";
import api from "../../util/api.util.js";

const CategoryForm = ({ onSuccess, onCancel }) => {
  const [mode, setMode] = useState("newMain");

  const [newMainCategory, setNewMainCategory] = useState({
    name: "",
    description: "",
  });
  const [newMainImg, setNewMainImg] = useState(null);

  const [parentCategory, setParentCategory] = useState("");
  const [subCategory, setSubCategory] = useState({
    name: "",
    description: "",
  });
  const [subCategoryImg, setSubCategoryImg] = useState(null);

  const [categories, setCategories] = useState([]);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/category/list");
        const mainCategories = res.data.data.filter(cat => !cat.parent);
        setCategories(mainCategories);
      } catch (error) {
        toast.error("Failed to fetch categories");
      }
    };

    fetchCategories();
  }, []);

  const handleNewMainInputChange = (e) => {
    const { name, value } = e.target;
    setNewMainCategory(prev => ({ ...prev, [name]: value }));
  };

  const handleSubInputChange = (e) => {
    const { name, value } = e.target;
    setSubCategory(prev => ({ ...prev, [name]: value }));
  };

  const handleNewMainImgChange = (e) => {
    setNewMainImg(e.target.files[0]);
  };

  const handleSubImgChange = (e) => {
    setSubCategoryImg(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (mode === "newMain") {
      if (!newMainCategory.name || !newMainCategory.description || !newMainImg) {
        toast.error("All fields are required for new main category");
        return;
      }
      const data = new FormData();
      data.append("name", newMainCategory.name);
      data.append("description", newMainCategory.description);
      data.append("categoryImg", newMainImg);
      try {
        await api.post("/category/add", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Main category added successfully");
        onSuccess && onSuccess();
        setNewMainCategory({ name: "", description: "" });
        setNewMainImg(null);
      } catch (error) {
        toast.error(error.response?.data?.message || "Error adding main category");
      }
    } else if (mode === "sub") {
      if (!parentCategory) {
        toast.error("Please select a parent category");
        return;
      }
      if (!subCategory.name || !subCategory.description || !subCategoryImg) {
        toast.error("All fields are required for sub-category");
        return;
      }
      const data = new FormData();
      data.append("name", subCategory.name);
      data.append("description", subCategory.description);
      data.append("categoryImg", subCategoryImg);
      data.append("parent", parentCategory);
      try {
        await api.post("/category/add", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Sub-category added successfully");
        onSuccess && onSuccess();
        setParentCategory("");
        setSubCategory({ name: "", description: "" });
        setSubCategoryImg(null);
      } catch (error) {
        toast.error(error.response?.data?.message || "Error adding sub-category");
      }
    }
  };

  const resetForm = () => {
    setNewMainCategory({ name: "", description: "" });
    setNewMainImg(null);
    setParentCategory("");
    setSubCategory({ name: "", description: "" });
    setSubCategoryImg(null);
    onCancel && onCancel();
  };

  return (
    <div className="bg-slate-800 rounded-lg p-6 mb-6">
      <h3 className="text-xl font-semibold mb-4">Add New Category / Sub-Category</h3>
      <div className="mb-6 flex space-x-4">
        <button
          type="button"
          onClick={() => setMode("newMain")}
          className={`px-4 py-2 rounded-md text-sm ${
            mode === "newMain"
              ? "bg-teal-500 text-black"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
        >
          New Main Category
        </button>
        <button
          type="button"
          onClick={() => setMode("sub")}
          className={`px-4 py-2 rounded-md text-sm ${
            mode === "sub"
              ? "bg-teal-500 text-black"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
        >
          Add Sub-Category
        </button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        {mode === "newMain" && (
          <div className="border-b border-gray-700 pb-4">
            <h4 className="text-lg font-semibold text-teal-300 mb-2">Main Category Details</h4>
            <div>
              <label className="block text-gray-300 mb-1">Category Name</label>
              <input
                type="text"
                name="name"
                value={newMainCategory.name}
                onChange={handleNewMainInputChange}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white"
                required
              />
            </div>
            <div className="mt-2">
              <label className="block text-gray-300 mb-1">Description</label>
              <textarea
                name="description"
                value={newMainCategory.description}
                onChange={handleNewMainInputChange}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white h-20"
                required
              ></textarea>
            </div>
            <div className="mt-2">
              <label className="block text-gray-300 mb-1">Category Image</label>
              <div className="flex items-center">
                <label
                  htmlFor="newMainCategoryImg"
                  className="cursor-pointer bg-teal-600 hover:bg-teal-700 px-4 py-2 rounded-md text-white"
                >
                  Choose File
                </label>
                <span className="ml-4 text-gray-400">
                  {newMainImg ? newMainImg.name : "No file chosen"}
                </span>
              </div>
              <input
                id="newMainCategoryImg"
                name="newMainCategoryImg"
                type="file"
                accept="image/*"
                onChange={handleNewMainImgChange}
                className="hidden"
                required
              />
            </div>
          </div>
        )}
        {mode === "sub" && (
          <div className="border-b border-gray-700 pb-4">
            <h4 className="text-lg font-semibold text-teal-300 mb-2">Sub-Category Details</h4>
            <div>
              <label className="block text-gray-300 mb-1">Select Parent Category</label>
              <select
                name="parent"
                value={parentCategory}
                onChange={(e) => setParentCategory(e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white"
                required
              >
                <option value="">Select Parent Category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mt-2">
              <label className="block text-gray-300 mb-1">Sub-Category Name</label>
              <input
                type="text"
                name="name"
                value={subCategory.name}
                onChange={handleSubInputChange}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white"
                placeholder="Sub-Category Name"
                required
              />
            </div>
            <div className="mt-2">
              <label className="block text-gray-300 mb-1">Description</label>
              <textarea
                name="description"
                value={subCategory.description}
                onChange={handleSubInputChange}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white h-20"
                placeholder="Sub-Category Description"
                required
              ></textarea>
            </div>
            <div className="mt-2">
              <label className="block text-gray-300 mb-1">Sub-Category Image</label>
              <div className="flex items-center">
                <label
                  htmlFor="subCategoryImg"
                  className="cursor-pointer bg-teal-600 hover:bg-teal-700 px-4 py-2 rounded-md text-white"
                >
                  Choose File
                </label>
                <span className="ml-4 text-gray-400">
                  {subCategoryImg ? subCategoryImg.name : "No file chosen"}
                </span>
              </div>
              <input
                id="subCategoryImg"
                name="subCategoryImg"
                type="file"
                accept="image/*"
                onChange={handleSubImgChange}
                className="hidden"
                required
              />
            </div>
          </div>
        )}
        <div className="flex space-x-3">
          <button
            type="submit"
            className="bg-teal-600 hover:bg-teal-700 px-4 py-2 rounded-md"
          >
            Add Category
          </button>
          <button
            type="button"
            onClick={resetForm}
            className="bg-slate-600 hover:bg-slate-700 px-4 py-2 rounded-md"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CategoryForm;

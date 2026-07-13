import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../utils/api";
import { toast } from "react-toastify";

const FoodItemForm = () => {
  const { id: restaurantId, foodId } = useParams();
  const navigate = useNavigate();
  const isEdit = !!foodId;

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [stock, setStock] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch existing menus to populate category autocomplete/list
        const { data: menuData } = await api.get(`/v1/eats/stores/${restaurantId}/menus`);
        if (menuData && menuData.data && menuData.data.length > 0) {
          const catList = menuData.data[0].menu.map((m) => m.category);
          setCategories(catList);
        }

        if (isEdit) {
          // Fetch single food item for editing
          const { data: foodData } = await api.get(`/v1/eats/item/${foodId}`);
          if (foodData && foodData.data) {
            const food = foodData.data;
            setName(food.name || "");
            setPrice(food.price || "");
            setDescription(food.description || "");
            setStock(food.stock || "");
            setImageUrl(food.images?.[0]?.url || "");
            setCategory(food.category || "");
          }
        }
        setLoading(false);
      } catch (error) {
        toast.error("Failed to load details");
        setLoading(false);
      }
    };
    fetchData();
  }, [restaurantId, foodId, isEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !price || !description || !stock || (!isEdit && !category)) {
      toast.error("Please fill in all required fields");
      return;
    }

    const payload = {
      name,
      price: Number(price),
      description,
      stock: Number(stock),
      images: [
        {
          public_id: "default",
          url: imageUrl || "/images/template.jpeg",
        },
      ],
    };

    try {
      if (isEdit) {
        // Edit food item
        await api.patch(`/v1/eats/item/${foodId}`, payload);
        toast.success("Food Item Updated Successfully");
      } else {
        // Create food item
        // 1. Get or create menu
        let menuId = null;
        const { data: menuResponse } = await api.get(`/v1/eats/stores/${restaurantId}/menus`);
        if (menuResponse && menuResponse.data && menuResponse.data.length > 0) {
          menuId = menuResponse.data[0]._id;
        } else {
          // Create menu
          const { data: newMenu } = await api.post("/v1/eats/menus", {
            restaurant: restaurantId,
            menu: [],
          });
          menuId = newMenu.data._id;
        }

        // 2. Create the food item in database
        const foodItemPayload = {
          ...payload,
          restaurant: restaurantId,
          menu: menuId,
        };
        const { data: foodItemResponse } = await api.post("/v1/eats/item", foodItemPayload);
        const createdFoodId = foodItemResponse.data._id;

        // 3. Link the food item to the menu under category
        await api.patch(`/v1/eats/menus/${menuId}/addItem`, {
          category,
          foodItemId: createdFoodId,
        });

        toast.success("Food Item Added to Menu Successfully");
      }
      navigate(`/eats/stores/${restaurantId}/menus`);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Failed to save food item");
    }
  };

  if (loading) {
    return <div className="container text-center mt-5"><h3>Loading...</h3></div>;
  }

  return (
    <div className="container d-flex justify-content-center mt-5 mb-5">
      <div className="card p-4 shadow-lg" style={{ maxWidth: "600px", width: "100%", borderRadius: "15px" }}>
        <h2 className="mb-4 text-center">{isEdit ? "✏️ Edit Food Item" : "➕ Add Food Item / Category"}</h2>
        <form onSubmit={handleSubmit}>
          
          {!isEdit && (
            <div className="mb-3">
              <label className="form-label">Category <span className="text-danger">*</span></label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Pizzas, Desserts, Beverages"
                list="category-suggestions"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              />
              <datalist id="category-suggestions">
                {categories.map((cat, index) => (
                  <option key={index} value={cat} />
                ))}
              </datalist>
              <small className="form-text text-muted">
                Type a new category name or select an existing one from the list.
              </small>
            </div>
          )}

          <div className="mb-3">
            <label className="form-label">Food Name <span className="text-danger">*</span></label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Margherita Pizza"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Description <span className="text-danger">*</span></label>
            <textarea
              className="form-control"
              placeholder="e.g. Classic cheese pizza with fresh basil"
              rows="2"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Price (₹) <span className="text-danger">*</span></label>
              <input
                type="number"
                min="0"
                className="form-control"
                placeholder="e.g. 299"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Stock <span className="text-danger">*</span></label>
              <input
                type="number"
                min="0"
                className="form-control"
                placeholder="e.g. 50"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Image URL</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. https://images.unsplash.com/photo-..."
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
          </div>

          <div className="d-grid gap-2 mt-4">
            <button type="submit" className="btn btn-success btn-lg">
              {isEdit ? "Save Changes" : "Add to Menu"}
            </button>
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => navigate(`/eats/stores/${restaurantId}/menus`)}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FoodItemForm;

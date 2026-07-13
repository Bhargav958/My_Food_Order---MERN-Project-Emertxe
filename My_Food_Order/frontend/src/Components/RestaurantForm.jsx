import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { createRestaurant, updateRestaurant } from "../redux/actions/restaurantAction";
import api from "../utils/api";
import { toast } from "react-toastify";

const RestaurantForm = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [isVeg, setIsVeg] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [ratings, setRatings] = useState(0);
  const [deliveryTime, setDeliveryTime] = useState("30-35 mins");
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [latitude, setLatitude] = useState(19.076);
  const [longitude, setLongitude] = useState(72.8777);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit) {
      const fetchRestaurant = async () => {
        try {
          setLoading(true);
          const { data } = await api.get(`/v1/eats/stores/${id}`);
          if (data && data.data) {
            const rest = data.data;
            setName(rest.name || "");
            setAddress(rest.address || "");
            setIsVeg(rest.isVeg || false);
            setImageUrl(rest.images?.[0]?.url || "");
            setRatings(rest.ratings || 0);
            setDeliveryTime(rest.deliveryTime || rest.timeToDeliver || "30-35 mins");
            setDeliveryFee(rest.deliveryFee || 0);
            if (rest.location && rest.location.coordinates) {
              setLongitude(rest.location.coordinates[0]);
              setLatitude(rest.location.coordinates[1]);
            }
          }
          setLoading(false);
        } catch (error) {
          toast.error("Failed to load restaurant details");
          setLoading(false);
        }
      };
      fetchRestaurant();
    }
  }, [id, isEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !address) {
      toast.error("Please fill in all required fields");
      return;
    }

    const restaurantData = {
      name,
      address,
      isVeg,
      ratings: Number(ratings),
      timeToDeliver: deliveryTime,
      deliveryTime,
      deliveryFee: Number(deliveryFee),
      location: {
        type: "Point",
        coordinates: [Number(longitude), Number(latitude)],
      },
      images: [
        {
          public_id: "default",
          url: imageUrl || "/images/template.jpeg",
        },
      ],
    };

    try {
      if (isEdit) {
        await dispatch(updateRestaurant(id, restaurantData));
        toast.success("Restaurant Updated Successfully");
      } else {
        await dispatch(createRestaurant(restaurantData));
        toast.success("Restaurant Created Successfully");
      }
      navigate("/");
    } catch (err) {
      toast.error(err.message || "Operation failed");
    }
  };

  if (loading) {
    return <div className="container text-center mt-5"><h3>Loading...</h3></div>;
  }

  return (
    <div className="container d-flex justify-content-center mt-5 mb-5">
      <div className="card p-4 shadow-lg" style={{ maxWidth: "600px", width: "100%", borderRadius: "15px" }}>
        <h2 className="mb-4 text-center">{isEdit ? "✏️ Edit Restaurant" : "➕ Add New Restaurant"}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Restaurant Name <span className="text-danger">*</span></label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Pizza Hut"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Address <span className="text-danger">*</span></label>
            <textarea
              className="form-control"
              placeholder="e.g. 123 Main Street, City Center"
              rows="2"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>

          <div className="mb-3 form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              id="isVegCheckbox"
              checked={isVeg}
              onChange={(e) => setIsVeg(e.target.checked)}
            />
            <label className="form-check-label" htmlFor="isVegCheckbox">
              🍃 Pure Veg Restaurant?
            </label>
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

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Ratings (0 - 5)</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="5"
                className="form-control"
                value={ratings}
                onChange={(e) => setRatings(e.target.value)}
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Delivery Fee (₹)</label>
              <input
                type="number"
                min="0"
                className="form-control"
                value={deliveryFee}
                onChange={(e) => setDeliveryFee(e.target.value)}
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Delivery Time</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. 30-35 mins"
              value={deliveryTime}
              onChange={(e) => setDeliveryTime(e.target.value)}
            />
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Longitude (Lng)</label>
              <input
                type="number"
                step="any"
                className="form-control"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Latitude (Lat)</label>
              <input
                type="number"
                step="any"
                className="form-control"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
              />
            </div>
          </div>

          <div className="d-grid gap-2 mt-4">
            <button type="submit" className="btn btn-success btn-lg">
              {isEdit ? "Save Changes" : "Create Restaurant"}
            </button>
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => navigate("/")}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RestaurantForm;

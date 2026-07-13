import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { updateProfile } from "../redux/actions/userActions";
import { toast } from "react-toastify";


const Profile = () => {
  const { user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  const handleUpdate = async () => {
    try {
      await dispatch(updateProfile(name));
      toast.success("Profile Updated Successfully");
    } catch (error) {
      toast.error("Profile Update Failed");
    }
  };

  const [name, setName] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.name);
    }
  }, [user]);

  return (
    <div className="container d-flex justify-content-center mt-5">
      <div className="card p-4 shadow" style={{ maxWidth: "650px", width: "100%", borderRadius: "20px" }}>

        <h2 className="mb-4">My Profile</h2>

        <div className="mb-3">
          <label>Name</label>
          <input
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label>Email</label>
          <input
            className="form-control"
            value={user?.email || ""}
            readOnly
          />
        </div>

        <div className="mb-3">
          <label>Role</label>
          <input
            className="form-control"
            value={user?.role || ""}
            readOnly
          />
        </div>

        <button className="btn btn-success" onClick={handleUpdate}>
          Save Changes
        </button>

        <hr />

        <Link
          to="/orders/me"
          className="btn btn-primary me-3"
        >
          My Orders
        </Link>

      </div>
    </div>
  );
};

export default Profile;
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { getMenus } from "../redux/actions/menuActions";
import Fooditem from "./Fooditem";
import Loader from "./layout/Loader";
import Message from "./Message";

const Menu = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { menus, loading, error } = useSelector((state) => state.menus);
  const { user } = useSelector((state) => state.auth || {});

  useEffect(() => {
    dispatch(getMenus(id));
  }, [dispatch, id]);

  return (
    <div className="container mt-4">
      {user?.role === "admin" && (
        <div className="d-flex justify-content-end mb-3">
          <Link to={`/admin/restaurant/${id}/menu/new-item`} className="btn btn-success shadow-sm" style={{ borderRadius: "10px" }}>
            ➕ Add Food Item / Category
          </Link>
        </div>
      )}
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : Array.isArray(menus) && menus.length > 0 ? (
        menus.map((menu) => (
          <div key={menu._id} className="mb-4">
            <div className="d-flex align-items-center">
              <div className="menu-category">
                <div className="category-line"></div>
                <h2>{menu.category}</h2>
                <div className="category-line"></div>
              </div>
            </div>

            <hr />

            {Array.isArray(menu.items) && menu.items.length > 0 ? (
              <div className="row">
                {menu.items.map((fooditem) => (
                  <Fooditem
                    key={fooditem._id}
                    fooditem={fooditem}
                    restaurant={id}
                  />
                ))}
              </div>
            ) : (
              <Message variant="info">No items available.</Message>
            )}
          </div>
        ))
      ) : (
        <Message variant="info">No menus available.</Message>
      )}
    </div>
  );
};

export default Menu;

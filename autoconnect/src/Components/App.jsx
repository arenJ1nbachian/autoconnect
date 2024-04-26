import { createBrowserRouter, RouterProvider } from "react-router-dom";
import CarListingCreation from "../Layouts/CarListingCreation";
import CarListingDetails from "../Layouts/CarListingDetails";
import CarListingEdit from "../Layouts/CarListingEdit";
import Listings from "../Layouts/Listings";
import Error from "../Layouts/Error";
import Home from "../Layouts/Home";
import Login from "../Layouts/Login";
import Register from "../Layouts/Register";
import Root from "../Layouts/Root";
import UserSettings from "../Layouts/UserSettings";
import UserListings from "../Layouts/UserListings";
import UserFavorites from "../Layouts/UserFavorites";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <Error />,
    children: [
      { path: "", element: <Home /> },
      { path: "register", element: <Register /> },
      { path: "login", element: <Login /> },
      { path: "listings", element: <Listings /> },
      { path: "listings/search/:query", element: <Listings /> },
      { path: "listings/details/:listingId", element: <CarListingDetails /> },
      { path: "listing/create", element: <CarListingCreation /> },
      { path: "listing/edit/:listingId", element: <CarListingEdit /> },
      { path: "profile/:userId/settings", element: <UserSettings /> },
      { path: "profile/:userId/listings", element: <UserListings /> },
      { path: "profile/:userId/favorites", element: <UserFavorites /> },
    ],
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;

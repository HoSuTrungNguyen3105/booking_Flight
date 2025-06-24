import { createBrowserRouter, type RouteObject } from "react-router-dom";
import FullLayout from "../components/Layout/FullLayout";
import MainLayout from "../components/Layout/MainLayout";
import ErrorPage from "../components/Layout/ErrorPage";
import Guard from "../guard/Guard";
import Home from "../components/Home/Home";
import Setting from "../common/Setting/Setting";
import Registration from "../components/Auth/Registration";
import AdminLayout from "../components/Layout/AdminLayout";
import Search_layout from "../components/Admin/Search_layout";
import { FileUpload } from "../common/FileUploader/FileUpload";
import Login from "../components/Auth/Login";
import Register from "../components/Auth/Register";
import Hero from "../components/Hero/Hero";
import SignOut from "../components/Auth/SignOut";
import BookTicket from "../components/User/BookTicket";
import { Typography } from "@mui/material";
import Food from "../common/Food/Food";

const routes: RouteObject[] = [
  {
    path: "login",
    element: <FullLayout />,
    children: [{ index: true, element: <Login /> }],
  },
  {
    path: "RegistrationForm",
    element: <Registration />,
    // children: [{ index: true, element: <Registration /> }],
  },
  {
    path: "Register",
    element: <Register />,
  },
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Guard />,
        children: [
          { index: true, element: <Hero /> },
          { path: "setting", element: <Setting /> },
          // { index: false, element: <Registration /> },
        ],
      },
      {
        path: "overview/revenue",
        element: <Typography>Xin chao</Typography>,
      },
      {
        path: "airport-list/domestic",
        element: <Typography>Xin chao</Typography>,
      },
      {
        path: "flight-management/food",
        element: <Food />,
      },
      {
        path: "sampleFormDemo",
        element: <Search_layout />,
      },
      {
        path: "logout",
        element: <SignOut />,
      },
      {
        path: "sampleFileUploader",
        element: <FileUpload name="fileUploader" />,
      },
      {
        path: "bookticket",
        element: <BookTicket />,
      },
      {
        path: "sample",
        element: <Home />,
        children: [
          //   {
          //     path: "RegistrationForm",
          //     element: <Registration />,
          //     children: [{ index: true, element: <Registration /> }],
          //   },
          //   {
          //     path: "headerpage",
          //     element: <Header />,
          //   },
        ],
      },
    ],
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    errorElement: <ErrorPage />,
    children: [
      //   {
      //     path: 'createFlight',
      //     element: <CreateFlight />,
      //   },
      //   {
      //     path: "sampleFormDemo",
      //     element: <Search_layout />,
      //   },
    ],
  },
  {
    path: "*",
    element: <ErrorPage />,
  },
];

const router = createBrowserRouter(routes);

export default router;

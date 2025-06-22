import { createBrowserRouter, type RouteObject } from "react-router-dom";
import FullLayout from "../components/Layout/FullLayout";
import MainLayout from "../components/Layout/MainLayout";
import ErrorPage from "../components/Layout/ErrorPage";
import Guard from "../guard/Guard";
import Home from "../components/Home/Home";
import Setting from "../common/Setting/Setting";
import Registration from "../components/Auth/Registration";
import { Header } from "../common/Header/Header";
import AdminLayout from "../components/Layout/AdminLayout";
import Search_layout from "../components/Admin/Search_layout";
import { FileUpload } from "../common/FileUploader/FileUpload";
import Login from "../components/Auth/Login";
import Register from "../components/Auth/Register";
import Hero from "../components/Hero/Hero";

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
        path: "sampleFormDemo",
        element: <Search_layout />,
      },
      {
        path: "sampleFileUploader",
        element: <FileUpload name="fileUploader" />,
      },
      {
        path: "headerpage",
        element: <Header />,
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

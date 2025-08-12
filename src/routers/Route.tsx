import { createBrowserRouter, type RouteObject } from "react-router-dom";
import MainLayout from "../components/Layout/MainLayout";
import ErrorPage from "../components/Layout/ErrorPage";
import Guard from "../guard/Guard";
import Home from "../components/Home/Home";
import Setting from "../common/Setting/Setting";
import Registration from "../components/Auth/Registration";
import { FileUpload } from "../common/FileUploader";
import Login from "../components/Auth/Login";
import Register from "../components/Auth/Register";
import Hero from "../components/Hero/Hero";
import SignOut from "../components/Auth/SignOut";
import BookTicket from "../components/User/BookTicket";
import { Typography } from "@mui/material";
import Food from "../common/Food/Food";
import SampleTimePicker from "../common/Sample/SampleTimePicker";
import Sample from "../common/Sample";
import TableCustom from "../common/Table/Table";
import { ROUTE_PATHS } from "./RoutePath";
import ManageLayout from "../components/Layout/ResizeLayout";
// import App from "../components/Auth/Loginv2";
import Search_layout from "../components/Admin/Search_layout";
import GuestGuard from "../components/Layout/GuardLayout";
import InspectionDetails from "../components/User/Profile";
import type { JSX } from "react";
import DataSecure from "../common/Setting/DataSecure";
import DataV2 from "../common/Dropdown/DataV2";
import { LoginPage } from "../components/Auth/LoginPage";
import Security from "../common/Setting/Security";
import FullLayout from "../components/Layout/FullLayout";
import CheckboxUI from "../common/Checkbox/CheckboxUI";
import Setting_flight from "../components/Admin/Setting_flight";
interface IRouteObject {
  path?: (typeof ROUTE_PATHS)[keyof typeof ROUTE_PATHS];
  index?: boolean;
  element: JSX.Element;
  errorElement?: JSX.Element;
  children?: IRouteObject[];
}
const routes = [
  {
    path: ROUTE_PATHS.LOGIN,
    element: (
      <GuestGuard>
        <Login />,
      </GuestGuard>
    ),
  },
  // {
  //   path: "loginPage",
  //   element: <LoginPage />,
  // },
  {
    path: ROUTE_PATHS.SAMPLE_BUTTON,
    element: <Sample />,
  },
  {
    path: ROUTE_PATHS.TABLE,
    element: <TableCustom />,
  },
  {
    path: ROUTE_PATHS.REGISTRATION_FORM,
    element: <Registration />,
  },
  {
    path: ROUTE_PATHS.REGISTER,
    element: <Register />,
  },
  {
    path: ROUTE_PATHS.INIT,
    element: <FullLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "loginPage",
        element: (
          <GuestGuard>
            <LoginPage />
          </GuestGuard>
        ),
      },
    ],
  },
  {
    path: ROUTE_PATHS.LANDING,
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: ROUTE_PATHS.LANDING, // = "/"
        element: <Guard />,
        children: [
          { index: true, element: <Hero /> },
          { path: "setting", element: <Setting /> },
        ],
      },
      {
        path: "overview/revenue",
        element: <Typography>Xin chào</Typography>,
      },
      {
        path: "airport-list/domestic",
        element: <Typography>Xin chào</Typography>,
      },
      {
        path: "profile",
        element: <InspectionDetails />,
      },
      // {
      //   path: ROUTE_PATHS.FOOD.replace("/", ""),
      //   element: <Food />,
      // },
      {
        path: ROUTE_PATHS.SAMPLE_FORM.replace("/", ""),
        element: <CheckboxUI />,
      },
      {
        path: ROUTE_PATHS.TIME_PICKER.replace("/", ""),
        element: <SampleTimePicker />,
      },
      {
        path: ROUTE_PATHS.LOGOUT.replace("/", ""),
        element: <SignOut />,
      },
      {
        path: "/sampleFormData",
        element: <Search_layout />,
      },
      {
        path: "/sampleFormData",
        element: <TableCustom />,
      },
      // {
      //   path: ROUTE_PATHS.PROFILE.replace("/", ""),
      //   element: <App />,
      // },
      {
        path: ROUTE_PATHS.FILE_UPLOAD.replace("/", ""),
        element: <FileUpload name="fileUploader" />,
      },
      {
        path: ROUTE_PATHS.BOOK_TICKET.replace("/", ""),
        element: <BookTicket />,
      },
      {
        path: ROUTE_PATHS.SAMPLE.replace("/", ""),
        element: <Home />,
      },
    ],
  },
  {
    path: ROUTE_PATHS.ADMIN,
    element: <ManageLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "international",
        element: <Security />,
      },
      {
        path: "domestic",
        element: <DataSecure />,
      },
      {
        path: "profile",
        element: <DataV2 />,
      },
      {
        path: ROUTE_PATHS.FOOD.replace("/", ""),
        element: <Food />,
      },
      {
        path: ROUTE_PATHS.SAMPLE_BUTTON.replace("/", ""),
        element: <Sample />,
      },
      {
        path: ROUTE_PATHS.TIME_PICKER.replace("/", ""),
        element: <SampleTimePicker />,
      },
      {
        path: ROUTE_PATHS.LOGOUT.replace("/", ""),
        element: <SignOut />,
      },
      {
        path: "hero",
        element: <Hero />,
      },
      {
        path: "setting",
        element: <Setting_flight />,
      },
      {
        path: ROUTE_PATHS.FILE_UPLOAD.replace("/", ""),
        element: <FileUpload name="fileUploaderV2" />,
      },
      {
        path: ROUTE_PATHS.BOOK_TICKET.replace("/", ""),
        element: <BookTicket />,
      },
      {
        path: ROUTE_PATHS.SAMPLE.replace("/", ""),
        element: <Home />,
      },
    ],
  },
  {
    path: "*",
    element: <ErrorPage />,
  },
] satisfies RouteObject[];

const router = createBrowserRouter(routes);

export default router;

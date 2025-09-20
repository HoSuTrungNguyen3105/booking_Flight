import { createBrowserRouter, type RouteObject } from "react-router-dom";
import MainLayout from "../components/Layout/MainLayout";
import ErrorPage from "../components/Layout/ErrorPage";
import Guard from "../guard/Guard";
// import Home from "../components/Home/Home";
// import Setting from "../common/Setting/Setting";
import { FileUpload } from "../common/FileUploader";
import Hero from "../components/Hero/Hero";
import BookTicket from "../components/User/BookTicket";
import Food from "../common/Food/Food";
import TableCustom from "../common/Table/Table";
import { ROUTE_PATHS } from "./RoutePath";
import ManageLayout from "../components/Layout/ResizeLayout";
import Search_layout from "../components/Admin/Search_layout";
import GuestGuard from "../components/Layout/GuardLayout";
// import InspectionDetails from "../components/User/Profile";
import { LoginPage } from "../components/Auth/LoginPage";
import Security from "../common/Setting/Security";
import FullLayout from "../components/Layout/FullLayout";
import CheckboxUI from "../common/Checkbox/CheckboxUI";
import MealList from "../common/Setting/MealList";
import SecurityManage from "../common/Setting/hooks/SecurityManage";
// import ProfileUser from "../common/Profile";
import ManageMyInformation from "../common/Setting/ManageMyInformation";
import ManageMyInfo from "../common/Setting/ManageMyInfo";
import Special from "../common/Setting/hooks/Special";
import FlightBooking from "../components/User/FlightBooking";
import AircraftPage from "../components/User/AircraftPage";
import UnlockRequestTable from "../common/DetailSection/UnlockRequestTable";
import FlightPage from "../components/Admin/component/FlightPage";
import LeaveRequestGrid from "../components/Admin/component/LeaveRequestGrid";
import PayrollManagement from "../common/Sample/PayrollManagement";
import DataSecure from "../common/Setting/DataSecure";
import AdditionalServicesPage from "../common/Sample/AdditionalServicesPage";
import ChatContainer from "../components/Chat/ChatContainer";
import Registration from "../components/Auth/Registration";
import FlightPath from "../components/User/FlightPath";
import ChatApp from "../components/Chat/HeaderChat";
import AirportDiagram from "../components/Admin/TerminalContainer";
import RevenueDashboard from "../components/User/RevenueDashboard";
import TicketSalesDashboard from "../components/User/TicketSalesDashboard";
import FlightRoutesDashboard from "../components/User/FlightRoutesDashboard";
import AircraftBatchCreator from "../components/Admin/component/AircraftBatchCreator";
import AircraftBatchCreatorEnhanced from "../components/Admin/component/AircraftBatchCreate";
import TerminalGateContainer from "../components/Admin/AirportMasterplan";
import AirportManagement from "../components/Admin/component/AirportManagement";
import SendEmailToUsers from "../common/Setting/SendEmailToUsers";
import CreateGateForm from "../components/User/CreateGateForm";

const routes = [
  {
    path: ROUTE_PATHS.TABLE,
    element: <TableCustom />,
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
      // {
      //   path: ROUTE_PATHS.FILE_UPLOAD.replace("/", ""),
      //   element: <FileUpload name="fileUploader" />,
      // },
      {
        path: "registerPage",
        element: (
          <GuestGuard>
            <Registration email="fghdjs" onClose={() => {}} />
            {/* AccountYn */}
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
        children: [{ index: true, element: <Hero /> }],
      },
      {
        path: "special",
        element: <Special />,
      },
      // {
      //   path: ROUTE_PATHS.FILE_UPLOAD.replace("/", ""),
      //   element: <FileUpload name="fileUploader" />,
      // },
      {
        path: "FlightPage",
        element: <FlightPage />,
      },
      {
        path: ROUTE_PATHS.SAMPLE_FORM.replace("/", ""),
        element: <CheckboxUI />,
      },
      {
        path: "/sampleFormData",
        element: <Search_layout />,
      },
      {
        path: "/TableCustom",
        element: <TableCustom />,
      },
      {
        path: ROUTE_PATHS.FILE_UPLOAD.replace("/", ""),
        element: <FileUpload name="fileUploader" />,
      },
      {
        path: ROUTE_PATHS.BOOK_TICKET.replace("/", ""),
        element: <BookTicket />,
      },
      // {
      //   path: ROUTE_PATHS.SAMPLE.replace("/", ""),
      //   element: <Home />,
      // },
    ],
  },
  {
    path: ROUTE_PATHS.ADMIN,
    element: (
      // <AuthGuard allowedRoles={["ADMIN"]}>
      <ManageLayout />
      // </AuthGuard>
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        path: "international",
        element: <Security />,
      },
      {
        path: "sampleDatePicker",
        element: <LeaveRequestGrid />,
      },
      {
        path: "domestic",
        element: <SecurityManage />,
      },
      {
        path: "service",
        element: <AdditionalServicesPage />,
      },
      {
        path: "unlock_request", //bookseat
        element: <UnlockRequestTable />,
      },
      {
        path: "CreateGateForm", //bookseat
        element: <CreateGateForm />,
      },
      {
        path: "data-secure",
        element: <DataSecure />,
      },
      {
        path: "flightmeals",
        element: <MealList />,
      },
      {
        path: ROUTE_PATHS.FOOD.replace("/", ""),
        element: <Food />,
      },
      {
        path: "message",
        element: <ChatContainer />,
      },
      {
        path: "AircraftBatchCreatorEnhanced",
        element: <AircraftBatchCreatorEnhanced />,
      },
      {
        path: "AircraftBatchCreator",
        element: <AircraftBatchCreator />,
      },
      {
        path: "special",
        element: <RevenueDashboard />,
      },
      {
        path: "special/one",
        element: <FlightRoutesDashboard />,
      },
      {
        path: ROUTE_PATHS.NOTIFICATIONS,
        element: <Search_layout />,
      },
      {
        path: "hero",
        element: <TicketSalesDashboard />,
      },
      {
        path: "TerminalContainer",
        element: <AirportDiagram />,
      },
      {
        path: "ChatApp",
        element: <ChatApp />,
      },
      {
        path: "AirportManagement",
        element: <AirportManagement />,
      },
      {
        path: "TerminalGateContainer",
        element: <TerminalGateContainer />,
      },
      {
        path: "FlightPath",
        element: <FlightPath />,
      },
      {
        path: "setting",
        element: <ManageMyInformation />,
      },
      {
        path: ROUTE_PATHS.FILE_UPLOAD.replace("/", ""),
        element: <FileUpload name="fileUploader" />,
      },
      {
        path: ROUTE_PATHS.BOOK_TICKET.replace("/", ""),
        element: <BookTicket />,
      },
      {
        path: "checkboxui",
        element: <CheckboxUI />,
      },
      {
        path: "flight-book",
        element: <FlightBooking />,
      },
      {
        path: "manage-my-info",
        element: <ManageMyInfo />,
      },
      {
        path: "payroll-management",
        element: <PayrollManagement />,
      },
      {
        path: "aircraft",
        element: <AircraftPage />,
      },
      {
        path: "SendEmailToUsers",
        element: <SendEmailToUsers selectedUser={[]} />,
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

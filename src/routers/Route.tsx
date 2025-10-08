import { createBrowserRouter, type RouteObject } from "react-router-dom";
import MainLayout from "../components/Layout/MainLayout";
import ErrorPage from "../components/Layout/ErrorPage";
import Guard from "../guard/Guard";
import { FileUpload } from "../common/FileUploader";
import Hero from "../components/Hero/Hero";
import BookTicket from "../components/User/BookTicket";
import { ROUTE_PATHS } from "./RoutePath";
import ManageLayout from "../components/Layout/ResizeLayout";
import Search_layout from "../components/Admin/component/Flight/Search_layout";
import GuestGuard from "../components/Layout/GuardLayout";
import { LoginPage } from "../components/Auth/LoginPage";
import Security from "../common/Setting/Security";
import FullLayout from "../components/Layout/FullLayout";
import MealList from "../components/User/MealList";
import SecurityManage from "../common/Setting/hooks/SecurityManage";
import ManageMyInformation from "../common/Setting/ManageMyInformation";
import ManageMyInfo from "../common/Setting/ManageMyInfo";
import AircraftPage from "../components/Admin/component/Aircraft/AircraftPage";
import UnlockRequestTable from "../components/Auth/UnlockRequestTable";
import FlightPage from "../components/Admin/component/Flight/FlightPage";
import LeaveRequestGrid from "../components/Admin/component/LeaveRequest/LeaveRequestGrid";
import PayrollManagement from "../common/Sample/PayrollManagement";
import AdditionalServicesPage from "../common/Sample/AdditionalServicesPage";
import ChatContainer from "../components/Chat/ChatContainer";
import Registration from "../components/Auth/Registration";
import FlightPath from "../components/User/FlightPath";
import ChatApp from "../components/Chat/HeaderChat";
import AirportDiagram from "../components/Admin/TerminalContainer";
import RevenueDashboard from "../components/User/RevenueDashboard";
import TicketSalesDashboard from "../components/User/TicketSalesDashboard";
import FlightRoutesDashboard from "../components/User/FlightRoutesDashboard";
import TerminalGateContainer from "../components/Admin/AirportMasterplan";
import AirportManagement from "../components/Admin/component/Airport/AirportManagement";
import SendEmailToUsers from "../common/Setting/SendEmailToUsers";
import MealForm from "../common/Sample/MealForm";
import FlightStatisticsPage from "../components/User/FlightStatisticsPage";
import AirportMap from "../components/User/AirportMap";
import AirportManagementDetail from "../components/User/AirportManagementDetail";
import ChangePasswordInProfile from "../components/Profile/ChangePasswordInProfile";
import FlightBatchCreator from "../components/Admin/component/Flight/FlightBatchCreator";
import AuthGuard from "../components/Layout/AuthGuard";
import TicketTable from "../common/Sample/TicketTable";
import BulkMealCreator from "../components/Admin/component/Meal/BulkMealCreator";

const routes = [
  {
    path: ROUTE_PATHS.INIT,
    element: <FullLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: ROUTE_PATHS.LOGIN,
        element: (
          <GuestGuard>
            <LoginPage />
          </GuestGuard>
        ),
      },
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
        element: (
          <AuthGuard>
            <Hero />
          </AuthGuard>
        ),
        // children: [{ index: true, element: <Hero /> }],
      },
      {
        path: "FlightPage",
        element: <FlightPage />,
      },
      {
        path: "/sampleFormData",
        element: <Search_layout />,
      },
      {
        path: ROUTE_PATHS.FILE_UPLOAD.replace("/", ""),
        element: <FileUpload name="fileUploader" />,
      },
      {
        path: ROUTE_PATHS.BOOK_TICKET.replace("/", ""),
        element: <BookTicket />,
      },
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
        path: "BulkMealCreator",
        element: <BulkMealCreator />,
      },
      {
        path: "AirportMap",
        element: (
          <AirportMap
            airportCode="SGN"
            // terminals={mockTerminals}
            height={540}
          />
        ),
      },
      {
        path: "FlightStatisticsPage",
        element: <FlightStatisticsPage />,
      },
      {
        path: "service",
        element: <AdditionalServicesPage />,
      },
      {
        path: "MealForm",
        element: <MealForm onSubmit={() => {}} />,
      },
      {
        path: "unlock_request", //bookseat
        element: <UnlockRequestTable />,
      },
      {
        path: "CreateGateForm", //bookseat
        element: <TicketTable />,
      },
      // {
      //   path: "data-secure",
      //   element: <DataSecure />,
      // },
      {
        path: "flightmeals",
        element: <MealList />,
      },
      {
        path: "message",
        element: <ChatContainer />,
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
      // {
      //   path: "facilities",
      //   element: <CreateFacility />,
      // },
      {
        path: "TerminalContainer",
        element: <AirportDiagram />,
      },
      {
        path: "AirportManagementDetail",
        element: <AirportManagementDetail />,
      },
      {
        path: "ChatApp",
        element: <ChatApp />,
      },
      {
        path: "FlightBatchCreator",
        element: <FlightBatchCreator />,
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
        path: "flight-book",
        // element: <FlightBooking />,
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
        path: "ChangePasswordInProfile",
        element: <ChangePasswordInProfile />,
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

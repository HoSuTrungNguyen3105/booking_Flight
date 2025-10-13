import { createBrowserRouter, type RouteObject } from "react-router-dom";
import MainLayout from "../components/Layout/MainLayout";
import ErrorPage from "../components/Layout/ErrorLayout";
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
import MealList from "../components/Admin/component/Meal/MealList";
import SecurityManage from "../common/Setting/Component/SecurityManage";
import ManageMyInformation from "../common/Setting/ManageMyInformation";
import ManageMyInfo from "../components/Profile/ManageMyInfo";
import AircraftPage from "../components/Admin/component/Aircraft/AircraftPage";
import UnlockRequestTable from "../components/Auth/UnlockRequestTable";
import FlightPage from "../components/Admin/component/Flight/FlightPage";
import LeaveRequestGrid from "../components/Admin/component/LeaveRequest/LeaveRequestGrid";
import PayrollManagement from "../components/Sample/PayrollManagement";
import AdditionalServicesPage from "../components/Sample/AdditionalServicesPage";
import ChatContainer from "../components/Chat/ChatContainer";
import FlightPath from "../components/Admin/component/Flight/FlightPath";
import ChatApp from "../components/Chat/HeaderChat";
import AirportDiagram from "../components/Admin/TerminalContainer";
import RevenueDashboard from "../components/User/RevenueDashboard";
import TicketSalesDashboard from "../components/User/TicketSalesDashboard";
import FlightRoutesDashboard from "../components/Admin/component/Flight/FlightRoutesDashboard";
import TerminalGateContainer from "../components/Admin/component/Airport/AirportMasterplan";
import AirportManagement from "../components/Admin/component/Airport/AirportManagement";
import SendEmailToUsers from "../components/Auth/SendEmailToUsers";
import MealForm from "../components/Admin/component/Meal/MealForm";
import FlightStatisticsPage from "../components/Admin/component/Flight/FlightStatisticsPage";
import AirportMap from "../components/User/AirportMap";
import AirportManagementDetail from "../components/Admin/component/Airport/AirportManagementDetail";
import ChangePasswordInProfile from "../components/Profile/ChangePasswordInProfile";
import FlightBatchCreator from "../components/Admin/component/Flight/FlightBatchCreator";
import AuthGuard from "../components/Layout/AuthGuard";
import TicketTable from "../components/Sample/TicketTable";
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
      // {
      //   path: "registerPage",
      //   element: (
      //     <GuestGuard>
      //       <Registration email="fghdjs" onClose={() => {}} />
      //     </GuestGuard>
      //   ),
      // },
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
        path: ROUTE_PATHS.INTERNATIONAL,
        element: <Security />,
      },
      {
        path: ROUTE_PATHS.SAMPLE_DATE_PICKER,
        element: <LeaveRequestGrid />,
      },
      {
        path: ROUTE_PATHS.DOMESTIC,
        element: <SecurityManage />,
      },
      {
        path: ROUTE_PATHS.BULK_MEAL_CREATOR,
        element: <BulkMealCreator />,
      },
      {
        path: ROUTE_PATHS.AIRPORT_MAP,
        element: <AirportMap airportCode="SGN" height={540} />,
      },
      {
        path: ROUTE_PATHS.FLIGHT_STATISTICS,
        element: <FlightStatisticsPage />,
      },
      {
        path: ROUTE_PATHS.SERVICE,
        element: <AdditionalServicesPage />,
      },
      {
        path: ROUTE_PATHS.MEAL_FORM,
        element: <MealForm onSubmit={() => {}} />,
      },
      {
        path: ROUTE_PATHS.UNLOCK_REQUEST,
        element: <UnlockRequestTable />,
      },
      {
        path: ROUTE_PATHS.CREATE_GATE_FORM,
        element: <TicketTable />,
      },
      {
        path: ROUTE_PATHS.FLIGHT_MEALS,
        element: <MealList />,
      },
      {
        path: ROUTE_PATHS.MESSAGE,
        element: <ChatContainer />,
      },
      {
        path: ROUTE_PATHS.SPECIAL,
        element: <RevenueDashboard />,
      },
      {
        path: ROUTE_PATHS.SPECIAL_ONE,
        element: <FlightRoutesDashboard />,
      },
      {
        path: ROUTE_PATHS.NOTIFICATIONS,
        element: <Search_layout />,
      },
      {
        path: ROUTE_PATHS.TicketSalesDashboard,
        element: <TicketSalesDashboard />,
      },
      {
        path: ROUTE_PATHS.TERMINAL_CONTAINER,
        element: <AirportDiagram />,
      },
      {
        path: ROUTE_PATHS.AIRPORT_MANAGEMENT_DETAIL,
        element: <AirportManagementDetail />,
      },
      {
        path: ROUTE_PATHS.CHAT_APP,
        element: <ChatApp />,
      },
      {
        path: ROUTE_PATHS.FLIGHT_BATCH_CREATOR,
        element: <FlightBatchCreator />,
      },
      {
        path: ROUTE_PATHS.AIRPORT_MANAGEMENT,
        element: <AirportManagement />,
      },
      {
        path: ROUTE_PATHS.TERMINAL_GATE_CONTAINER,
        element: <TerminalGateContainer />,
      },
      {
        path: ROUTE_PATHS.FLIGHT_PATH,
        element: <FlightPath />,
      },
      {
        path: ROUTE_PATHS.SETTING,
        element: <ManageMyInformation />,
      },
      {
        path: ROUTE_PATHS.FILE_UPLOAD,
        element: <FileUpload name="fileUploader" />,
      },
      {
        path: ROUTE_PATHS.BOOK_TICKET,
        element: <BookTicket />,
      },
      {
        path: ROUTE_PATHS.FLIGHT_BOOK,
        // element: <FlightBooking />,
      },
      {
        path: ROUTE_PATHS.MANAGE_MY_INFO,
        element: <ManageMyInfo />,
      },
      {
        path: ROUTE_PATHS.PAYROLL_MANAGEMENT,
        element: <PayrollManagement />,
      },
      {
        path: ROUTE_PATHS.AIRCRAFT,
        element: <AircraftPage />,
      },
      {
        path: ROUTE_PATHS.CHANGE_PASSWORD_PROFILE,
        element: <ChangePasswordInProfile />,
      },
      {
        path: ROUTE_PATHS.SEND_EMAIL_TO_USERS,
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

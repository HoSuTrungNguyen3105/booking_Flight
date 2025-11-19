import { createBrowserRouter, type RouteObject } from "react-router-dom";
import MainLayout from "../components/Layout/MainLayout";
import ErrorPage from "../components/Layout/Error404Layout";
import { FileUpload } from "../common/FileUploader";
import BookTicket from "../components/User/BookTicket";
import { ROUTE_PATHS } from "./RoutePath";
import ManageLayout from "../components/Layout/ResizeLayout";
import Search_layout from "./../components/Admin/component/Flight/Search_layout";
import { LoginPage } from "../components/Auth/Login";
import Security from "../common/Setting/Security";
import FullLayout from "../components/Layout/FullLayout";
import SecurityManage from "../components/User/SecurityManage";
import ManageMyInformation from "../common/Setting/ManageMyInformation";
import ManageMyInfo from "../components/Profile/ManageMyInfo";
import AircraftPage from "../components/Admin/component/Aircraft/AircraftPage";
import UnlockRequestTable from "../components/User/UnlockRequestTable";
import LeaveRequestTable from "../components/Admin/component/LeaveRequest/LeaveRequestTable";
import PayrollManagement from "../components/Admin/component/Payroll/PayrollManagement";
import AdditionalServicesPage from "../components/Sample/BaggageList";
import ChatContainer from "../components/Chat/ChatContainer";
import AirportDiagram from "../components/Admin/component/InfrastructureEntities/TerminalContainer";
import RevenueDashboard from "../components/User/RevenueDashboard";
import TicketSalesDashboard from "../components/User/TicketSalesDashboard";
import FlightRoutesDashboard from "../components/Admin/component/Flight/FlightRoutesDashboard";
import TerminalGateContainer from "../components/Admin/component/Airport/AirportMasterplan";
import AirportManagement from "../components/Admin/component/Airport/AirportManagement";
import SendEmailToUsers from "../components/Common/SendEmailToUsers";
import FlightStatisticsPage from "../components/Admin/component/Flight/FlightStatisticsPage";
// import AirportManagementDetail from "../components/Admin/component/Airport/AirportManagementDetail";
import ChangePasswordInProfile from "../components/Profile/ChangePasswordInProfile";
import AuthGuard from "../guard/AuthGuard";
import TransferAdminTable from "../common/Setting/TransferAdminTable";
import MealList from "../components/Admin/component/Meal/MealList";
import FlightManagement from "../components/Admin/component/Flight/FlightManagement";
import AttendanceCalendar from "../components/Sample/AttendanceCalendar";
import ForgetPassword from "../components/Auth/ForgetPassword/index";
import FacilityManagement from "../components/Admin/component/InfrastructureEntities/FacilityManagement";
import GuestGuard from "../guard/GuardLayout";
import Hero from "../components/Sample/Hero";
import TicketPage from "../components/Employee";
import ContactPage from "../components/Contact";
import PassengerProfile from "../components/Employee/PassengerProfile";
import FlightInfoPage from "../components/Employee/FlightInfoPage";
import HotelListPage from "../components/Admin/component/Hotel/HotelListPage";
import HotelDetailPage from "../components/Admin/component/Hotel/HotelDetailPage";
import EventCardDetail from "../common/AdditionalCustomFC/EventCardDetail";
import FlightDeals from "../common/AdditionalCustomFC/FlightDeals";
import OrderSeat from "../components/Employee/OrderSeat";
import { UpdateEmailForm } from "../components/Sample/UpdateEmailForm";
import BookingPage from "../components/Employee/BookingPage";
import { TerminalBatchCreator } from "../components/Admin/component/InfrastructureEntities/CreateTerminal";
import AttendancePage from "../components/Employee/AttendancePage";
import { HotelBatchCreator } from "../components/Admin/component/Hotel/HotelBatchCreator";
import Tictoctoe from "../components/User/Tictoctoe";
import FlightSummaryRef from "../components/Employee/FlightSummary";
import TripSummary from "../components/Employee/TripSummary";
import OrderMeal from "../components/Admin/component/Meal/OrderMeal";
import ExplorePage from "../components/Sample/ExplorePage";
import ContentPackage from "../components/Common/ContentPackage";
import FlightDealsAcceppst from "../components/Sample/FlightDeal";
import CreateRandomFlights from "../components/User/CreateRandomFlights";
import FlightPassengerSelector from "../components/Employee/PassengerSelector";
import FlightSelection from "../components/Employee/FlightSelection";
import SeatSelection from "../components/Sample/SeatSelection";
import FareComparison from "../components/Admin/component/Meal/FareComparison";
import OrderTable from "../components/Admin/component/Meal/OrderTable";
import FlightMealList from "../components/Admin/component/Meal/FlightMealList";
import FlightScheduleDashboard from "../components/User/FlightScheduleDashboard";
import AdvancedAnalytics from "../common/Header/AdvancedAnalytics";
import FlightsPage from "../components/Employee/FlightsPage";
import BookingPassengerSearch from "../components/Employee/BookingPassengerSearch";
import Confirmation from "../components/Admin/component/Meal/ConfirmationBooking";

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
        path: "change_password",
        element: <ForgetPassword />,
      },
    ],
  },
  {
    path: ROUTE_PATHS.LANDING,
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: ROUTE_PATHS.LANDING,
        element: <Hero />,
      },
      {
        path: "/TicketPage",
        element: <TicketPage />,
      },
      {
        path: "/Tictoctoe",
        element: <Tictoctoe />,
      },
      {
        path: "/FlightScheduleDashboard",
        element: <FlightScheduleDashboard />,
      },
      {
        path: "/FareComparison",
        element: <FareComparison />,
      },
      {
        path: "/FlightSummaryRef",
        element: <FlightSummaryRef />,
      },
      {
        path: "/contact",
        element: <ContactPage />,
      },
      {
        path: "/profile",
        element: <PassengerProfile />,
      },
      {
        path: "/Confirmation",
        element: <Confirmation />,
      },
      {
        path: "/flight/info-page",
        element: <FlightInfoPage />,
      },
      {
        path: "/SeatSelection",
        element: <SeatSelection />,
      },
      {
        path: "/flight/select",
        element: <FlightSelection aircraftCode="SGN" />,
      },
      {
        path: "/payment",
        element: <BookingPage />,
      },
      {
        path: "/OrderTable",
        element: <OrderTable />,
      },
      {
        path: "/FlightMealList",
        element: <FlightMealList />,
      },
      {
        path: "/AdvancedAnalytics",
        element: <AdvancedAnalytics />,
      },
      {
        path: "/TripSummary",
        element: <TripSummary />,
      },
      {
        path: "/OrderMeal",
        element: <OrderMeal />,
      },
      {
        path: "/AttendancePage",
        element: <AttendancePage />,
      },
      {
        path: "/booking-detail",
        element: <OrderSeat />,
      },
      {
        path: "/hotels",
        element: <HotelListPage />,
      },
      {
        path: "/search",
        element: <FlightsPage />,
      },
      {
        path: "/hotels/detail",
        element: <HotelDetailPage />,
      },
      {
        path: "/ticket/search",
        element: <BookingPassengerSearch />,
      },
      {
        path: "/detail",
        element: <EventCardDetail />,
      },
      {
        path: "/CreateRandomFlights",
        element: <CreateRandomFlights />,
      },
      {
        path: "/select",
        element: <FlightPassengerSelector departureDate="Nov.26,2025(Wed)" />,
      },
      {
        path: "/change/email",
        element: <UpdateEmailForm />,
      },
      {
        path: "/flight/deals",
        element: <FlightDeals />,
      },
      {
        path: "/hotel/Batch",
        element: <HotelBatchCreator />,
      },
      // {
      //   path: "/seat/select",
      //   element: <SeatSelect />,
      // },
      {
        path: "/flight/dealsAcceppst",
        element: <FlightDealsAcceppst />,
      },
      {
        path: "/content/:title",
        element: <ContentPackage />,
      },
      {
        path: "/explore/:arrival/:departure/:dateRange/:passengerCount/:hasTicket",
        element: <ExplorePage />,
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
      // // <AuthGuard allowedRoles={["ADMIN"]}>
      // <ManageLayout />
      // // </AuthGuard>
      <AuthGuard allowedRoles={["ADMIN"]}>
        <ManageLayout />
      </AuthGuard>
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        path: ROUTE_PATHS.INTERNATIONAL,
        element: <Security />,
      },
      {
        path: ROUTE_PATHS.LEAVE_REQUEST_TABLE,
        element: <LeaveRequestTable />,
      },
      {
        path: ROUTE_PATHS.DOMESTIC,
        element: <SecurityManage />,
      },
      {
        path: ROUTE_PATHS.BULK_MEAL_CREATOR,
        // element: <BulkMealCreator />,
      },
      {
        path: ROUTE_PATHS.SAMPLE_FORM,
        // element: <FlightPage />,
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
      },
      {
        path: ROUTE_PATHS.UNLOCK_REQUEST,
        element: <UnlockRequestTable />,
      },
      {
        path: ROUTE_PATHS.CREATE_HOTELS,
        element: <HotelBatchCreator />,
      },
      {
        path: ROUTE_PATHS.TRANSFER_ADMIN,
        element: <TransferAdminTable />,
      },
      {
        path: ROUTE_PATHS.FLIGHTMANAGE,
        element: <FlightManagement />,
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
        element: <AirportManagement />,
      },
      {
        path: ROUTE_PATHS.MANAGEMENT_ATTENDANCE,
        element: <AttendancePage />,
      },
      {
        path: ROUTE_PATHS.CALENDER_ATTENDANCE,
        element: <AttendanceCalendar />,
      },
      {
        path: ROUTE_PATHS.TERMINAL_BATCH_CREATOR,
        element: <TerminalBatchCreator />,
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
        path: "terminal/facility",
        element: <FacilityManagement />,
      },
      // {
      //   path: ROUTE_PATHS.FLIGHT_PATH,
      //   element: <FlightPath />,
      // },
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
        path: ROUTE_PATHS.SUPPORT,
        // element: <FlightStatus />,
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

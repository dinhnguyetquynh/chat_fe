import {Suspense, lazy} from "react";
import {Navigate, useRoutes} from "react-router-dom";

// layouts
// import DashboardLayout from "../layouts/dashboard";
import AuthLayout from "../layouts/auth";

// config
import {DEFAULT_PATH} from "../config";
import LoadingScreen from "../components/LoadingScreen";
import DashboardLayout from "../layouts/dashboard";
import {Outlet} from "react-router-dom/dist";

const Loadable = (Component) => (props) => {
    return (
        <Suspense fallback={<LoadingScreen/>}>
            <Component {...props} />
        </Suspense>
    );
};

export default function Router() {
    return useRoutes([
        {
            path: "/auth",
            element: <AuthLayout/>,
            children: [
                {path: "login", element: <LoginPage/>},
                {path: "register", element: <RegisterPage/>},
                {path: "reset-password", element: <ResetPasswordPage/>},
                {path: "new-password", element: <NewPasswordPage/>},
                {path: "verify", element: <VerifyPage/>},
            ],
        },
        {
            path: "/",
            element: <DashboardLayout/>,
            children: [
                {element: <Navigate to={DEFAULT_PATH} replace/>, index: true},

                {
                    path: "conversations",
                    element: <ConversationPage/>,
                    children: [
                        {
                            path: ":id",
                            element: (
                                <ChatPage/>
                            ),
                        },
                    ],
                },
                {path: "friends", element: <FriendRequest/>},
                {path: "404", element: <Page404/>},
                {path: "*", element: <Navigate to="/404" replace/>},
            ],
        },

        {path: "*", element: <Navigate to="/404" replace/>},
    ]);
}

const ConversationPage = Loadable(
    lazy(() => import("../pages/dashboard/ConversationPage"))
);
const ChatPage = Loadable(lazy(() => import("../pages/dashboard/ChatPage")));
// const Chats = Loadable(lazy(() => import("../pages/dashboard/Chats")));
const FriendRequest = Loadable(
    lazy(() => import("../pages/dashboard/FriendRequest"))
);
// const CallPage = Loadable(lazy(() => import("../pages/dashboard/Call")));
// const Contact = Loadable(lazy(() => import("../sections/Dashboard/Contact")));
const Page404 = Loadable(lazy(() => import("../pages/Page404")));

const LoginPage = Loadable(lazy(() => import("../pages/auth/Login")));
const VerifyPage = Loadable(lazy(() => import("../pages/auth/Verify")));
const RegisterPage = Loadable(lazy(() => import("../pages/auth/Register")));
const ResetPasswordPage = Loadable(
    lazy(() => import("../pages/auth/ResetPassword"))
);
const NewPasswordPage = Loadable(
    lazy(() => import("../pages/auth/NewPassword"))
);

// Settings
// const Settings = Loadable(lazy(() => import("../pages/dashboard/Settings")));
// const Profile = Loadable(
//   lazy(() => import("../pages/dashboard/Settings/Profile"))
// );

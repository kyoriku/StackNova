// import { createBrowserRouter, RouterProvider } from "react-router-dom";
// import { lazy, Suspense } from "react";
// import { RootLayout } from "./components/RootLayout";
// import { ErrorBoundary } from "./components/ErrorBoundary";
// import ProtectedRoute from "./components/ProtectedRoute";
// import LoadingSpinner from "./components/LoadingSpinner";
// import Posts from "./pages/Posts";
// import PostDetails from "./pages/PostDetails";
// import Login from "./pages/Login";
// import Signup from "./pages/SignUp";
// import NewPost from "./pages/NewPost";
// import EditPost from "./pages/EditPost";
// import NotFound from "./pages/NotFound";

// // Lazy load the UserProfile and Dashboard components
// const UserProfile = lazy(() => import("./pages/UserProfile"));
// const Dashboard = lazy(() => import("./pages/Dashboard"));

// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <RootLayout />,
//     errorElement: <NotFound />,
//     children: [
//       { index: true, element: <ErrorBoundary><Posts /></ErrorBoundary> },
//       { path: "post/:id", element: <ErrorBoundary><PostDetails /></ErrorBoundary> },
//       {
//         path: "user/:username",
//         element: (
//           <ErrorBoundary>
//             {/* <Suspense fallback={<LoadingSpinner text="Loading profile..." />}> */}
//               <UserProfile />
//             {/* </Suspense> */}
//           </ErrorBoundary>
//         )
//       },
//       { path: "login", element: <Login /> },
//       { path: "signup", element: <Signup /> },

//       // Protected routes group
//       {
//         element: <ProtectedRoute />,
//         children: [
//           {
//             path: "dashboard",
//             element: (
//               <ErrorBoundary>
//                 <Suspense fallback={<LoadingSpinner text="Loading dashboard..." />}>
//                   <Dashboard />
//                 </Suspense>
//               </ErrorBoundary>
//             )
//           },
//           { path: "new-post", element: <ErrorBoundary><NewPost /></ErrorBoundary> },
//           { path: "edit-post/:id", element: <ErrorBoundary><EditPost /></ErrorBoundary> },
//         ],
//       },
//       { path: "*", element: <NotFound /> }
//     ],
//   },
// ]);

// function App() {
//   return <RouterProvider router={router} />;
// }

// export default App;

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { lazy } from "react";
import { RootLayout } from "./components/RootLayout";
import { ErrorBoundary } from "./components/ErrorBoundary";
import ProtectedRoute from "./components/ProtectedRoute";
import Posts from "./pages/Posts";
import PostDetails from "./pages/PostDetails";
import Login from "./pages/Login";
import Signup from "./pages/SignUp";
import NewPost from "./pages/NewPost";
import EditPost from "./pages/EditPost";
import NotFound from "./pages/NotFound";
import DashboardWrapper from "./components/DashboardWrapper";
import UserProfileWrapper from "./components/UserProfileWrapper";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <ErrorBoundary><Posts /></ErrorBoundary> },
      { path: "post/:id", element: <ErrorBoundary><PostDetails /></ErrorBoundary> },
      {
        path: "user/:username",
        element: <UserProfileWrapper />
      },
      { path: "login", element: <Login /> },
      { path: "signup", element: <Signup /> },

      // Protected routes group
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "dashboard",
            element: <DashboardWrapper />
          },
          { path: "new-post", element: <ErrorBoundary><NewPost /></ErrorBoundary> },
          { path: "edit-post/:id", element: <ErrorBoundary><EditPost /></ErrorBoundary> },
        ],
      },
      { path: "*", element: <NotFound /> }
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
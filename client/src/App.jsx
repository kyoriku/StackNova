import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { RootLayout } from "./components/RootLayout";
import { ErrorBoundary } from "./components/ErrorBoundary";
import ProtectedRoute from "./components/ProtectedRoute";
import Posts from "./pages/Posts";
import PostDetails from "./pages/PostDetails";
import UserProfile from "./pages/UserProfile";
import Login from "./pages/Login";
import Signup from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import NewPost from "./pages/NewPost";
import EditPost from "./pages/EditPost";
import NotFound from "./pages/NotFound";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: (
          <ErrorBoundary>
            <Posts />
          </ErrorBoundary>
        ),
      },
      {
        path: "post/:id",
        element: (
          <ErrorBoundary>
            <PostDetails />
          </ErrorBoundary>
        ),
      },
      {
        path: "user/:username",
        element: (
          <ErrorBoundary>
            <UserProfile />
          </ErrorBoundary>
        ),
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "signup",
        element: <Signup />,
      },
      // Protected routes group
      {
        element:  <ProtectedRoute />,
        children: [
          {
            path: "dashboard",
            element: (
              <ErrorBoundary>
                <Dashboard />
              </ErrorBoundary>
            ),
          },
          {
            path: "new-post",
            element: (
              <ErrorBoundary>
                <NewPost />
              </ErrorBoundary>
            ),
          },
          {
            path: "edit-post/:id",
            element: (
              <ErrorBoundary>
                <EditPost />
              </ErrorBoundary>
            ),
          },
        ],
      },
      {
        path: "*",
        element: <NotFound />
      }
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
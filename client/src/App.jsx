import { createBrowserRouter, RouterProvider, redirect, Outlet } from "react-router-dom";
import { RootLayout } from "./components/RootLayout";
import { ErrorBoundary } from "./components/ErrorBoundary";
import PostsPage from "./pages/PostsPage/index";
import Dashboard from "./pages/Dashboard";
import SinglePost from "./pages/SinglePost";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NewPost from "./pages/NewPost";
import EditPost from "./pages/EditPost";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";

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
            <PostsPage />
          </ErrorBoundary>
        ),
      },
      {
        path: "post/:id",
        element: (
          <ErrorBoundary>
            <SinglePost />
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
// // src/App.jsx
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { AuthProvider } from "./context/AuthContext";
// import { ThemeProvider } from "./context/ThemeContext";

// import Header from "./components/Header";
// import Footer from "./components/Footer";
// import PostsPage from "./pages/PostsPage/index.jsx";
// import Dashboard from "./pages/Dashboard";
// import SinglePost from "./pages/SinglePost";
// import Login from "./pages/Login";
// import Signup from "./pages/Signup";
// import NewPost from "./pages/NewPost";
// import EditPost from "./pages/EditPost";
// import NotFound from "./pages/NotFound";
// import ProtectedRoutes from "./components/ProtectedRoutes";

// const queryClient = new QueryClient();

// function App() {
//   return (
//     <Router>
//       <AuthProvider>
//         <ThemeProvider>
//           <QueryClientProvider client={queryClient}>
//             <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
//               <Header />
//               <main className="flex-grow container mx-auto px-4 py-8">
//                 <Routes>
//                   {/* Public routes */}
//                   <Route path="/" element={<PostsPage />} />
//                   <Route path="/post/:id" element={<SinglePost />} />
//                   <Route path="/login" element={<Login />} />
//                   <Route path="/signup" element={<Signup />} />

//                   {/* Protected routes */}
//                   <Route element={<ProtectedRoutes />}>
//                     <Route path="/dashboard" element={<Dashboard />} />
//                     <Route path="/new-post" element={<NewPost />} />
//                     <Route path="/edit-post/:id" element={<EditPost />} />
//                   </Route>

//                   <Route path="*" element={<NotFound />} />
//                 </Routes>
//               </main>
//               <Footer />
//             </div>
//           </QueryClientProvider>
//         </ThemeProvider>
//       </AuthProvider>
//     </Router>
//   );
// }

// export default App;

// src/App.jsx
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
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
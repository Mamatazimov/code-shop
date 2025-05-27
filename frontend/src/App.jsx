import './App.css'
import {  createBrowserRouter, RouterProvider } from 'react-router-dom';
import MainLayout from './layout/MainLayout.jsx';
import ErrorPage from './pages/ErrorPage.jsx';
import Home from './pages/Home.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Products from './pages/Products.jsx';
import Login from './pages/Login.jsx';
import Admin from './pages/Admin.jsx';


function App() {
  const routes = createBrowserRouter([
    {
      path: "/",
      element: <MainLayout/>,
      errorElement: <ErrorPage />,
      children: [
        {index: true, element: <Home/>},
        {path: "/dashboard", element: <Dashboard/>},
        {path: "/products", element: <Products/>},
        {path: "/login",element: <Login/>},
        {path: "/admin", element: <Admin/>}
      ]
    },
  ]);



  return <RouterProvider router={routes} />;
}

export default App

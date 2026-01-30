import { Routes, Route, Outlet } from 'react-router-dom';
import Navbar from './Components/Header/Navbar';
import AllRoute from './Routes/Routes';
import { Toaster } from 'react-hot-toast';
function App() {
  return (
    <div className='flex min-h-screen flex-col'>
      {/* <Navbar />
      <AllRoute />
      <Outlet />
      <Toaster /> */}
      <AllRoute />
      <Toaster />
    </div>
  );
}

export default App;

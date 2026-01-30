// import Navbar from "../Components/Header/Navbar";
import { Outlet } from "react-router-dom";
import Navbar from "./Components/Header/Navbar";
import Footer from "./Components/Footer/Footer";

const MainLayout = () => {
    return (
        <>
            <Navbar />
            <Outlet />
            <Footer />
        </>
    );
};

export default MainLayout;

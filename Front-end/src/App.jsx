import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Toaster } from "react-hot-toast";
import AllRoute from "./Routes/Routes";
import { BaseUrl } from "./BaseApi/Api";
import { setUserFromSession, logout, authLoading } from "./Redux/authSlice";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const restoreSession = async () => {
      try {
        dispatch(authLoading());

        const res = await fetch(BaseUrl + "user", {
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          dispatch(setUserFromSession({ user: data }));
        } else {
          dispatch(logout());
        }
      } catch (error) {
        dispatch(logout());
      }
    };

    restoreSession();
  }, [dispatch]);

  return (
    <div className="flex min-h-screen flex-col">
      <AllRoute />
      <Toaster />
    </div>
  );
}

export default App;

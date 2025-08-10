import { Navigate, Route, Routes } from "react-router-dom";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Customize from "./pages/Customize";
import { useUserContext } from "./context/UserContext";
import Home from "./pages/Home";
import Customize2 from "./pages/Customize2";

function App() {
  const { user, setUser } = useUserContext();

  return (
    <Routes>
      <Route
        path="/"
        element={
          user?.assistantImage && user?.assistantName ? (
            <Home />
          ) : (
            <Navigate to="/customize" />
          )
        }
      />
      <Route
        path="/signin"
        element={!user ? <SignIn /> : <Navigate to="/" />}
      />
      <Route
        path="/signup"
        element={!user ? <SignUp /> : <Navigate to="/" />}
      />
      <Route
        path="/customize"
        element={user ? <Customize /> : <Navigate to="/signup" />}
      />
      <Route
        path="/customize2"
        element={user ? <Customize2 /> : <Navigate to="/signup" />}
      />
    </Routes>
  );
}

export default App;

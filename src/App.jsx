import { BrowserRouter, Route, Routes } from "react-router-dom";
import Body from "./Body";
import Footer from "./Footer";
import Login from "./Login";
import Profile from "./Profile";
function App() {
  return (
    <>
        <BrowserRouter basename="/">
          <Routes>
            <Route path="/" element={<Body />}>  
            <Route path="/login" element={<Login />}/>
            <Route path="/profile" element={<Profile />}/>
            <Route path="/footer" element={<Footer />}/>
            </Route>
          </Routes>
        </BrowserRouter>
    </>
  );
}

export default App;

import Auth from "./Pages/Auth/Auth";
import Profile from "./Pages/Profile"
import Home from "./Pages/Home";
import Messages from "./Pages/Messages";
import Notifications from "./Pages/Notifications";
import Search from "./Pages/Search";
import {Route, Routes} from "react-router-dom";

export default function App() {
  return (
    <Routes>
      <Route path ="/" element={<Home />} />
      <Route path ="/search" element={<Search />} />
      <Route path ="/notifications" element={<Notifications />} />
      <Route path ="/messages" element={<Messages />} />
      <Route path ="/profile" element={<Profile />} />
      <Route path ="/auth" element={<Auth />} />
    </Routes>
  )
}
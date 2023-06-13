import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./screens/Home";
import About from "./screens/About";
import Contact from "./screens/Contact";
import Header from "./screens/Header";
import Login from "./screens/Login";
import NewPasswordForm from "./screens/NewPasswordForm";
import ManagerTable from "./screens/ManagerTable";
import StatusTable from "./screens/StatusTable";
import Profile from "./screens/Profile";
import SuperAdminTable from "./screens/SuperAdminTable";
import Dashboard from "./screens/Dashboard";
import ForgotPassword from "./screens/ForgotPassword";
import UserData from "./screens/UserData";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="home" element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="log" element={<Login />} />
          <Route path="npform/:id" element={<NewPasswordForm />} />
          <Route path="mTb" element={<ManagerTable />} />
          <Route path="sadTb" element={<SuperAdminTable />} />
          <Route path="myStatus" element={<StatusTable />} />
          <Route path="profile" element={<Profile />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="forgotpwd" element={<ForgotPassword />} />
          <Route path="users" element={<UserData />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

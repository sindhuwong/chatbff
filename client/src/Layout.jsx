import { Outlet } from "react-router-dom";
import Footer from "./components/Footer.jsx";

export default function Layout() {
  return (
    <div className="app-layout">
      <main className="app-main">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

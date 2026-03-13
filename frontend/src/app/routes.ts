import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { ChatAssistant } from "./pages/ChatAssistant";
import { BookAppointment } from "./pages/BookAppointment";
import { MyAppointments } from "./pages/MyAppointments";
import { Doctors } from "./pages/Doctors";
import { Settings } from "./pages/Settings";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: ChatAssistant },
      { path: "chat", Component: ChatAssistant },
      { path: "book", Component: BookAppointment },
      { path: "appointments", Component: MyAppointments },
      { path: "doctors", Component: Doctors },
      { path: "settings", Component: Settings },
    ],
  },
]);

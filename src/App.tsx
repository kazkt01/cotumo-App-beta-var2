import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Repoarts from "./pages/Repoarts";
import QandA from "./pages/QandA";
import AppLayout from "./layout/AppLayout";
import Calendar from "./pages/Calendar";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Home />} />
            <Route path="/reports" element={<Repoarts />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/qanda" element={<QandA />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;

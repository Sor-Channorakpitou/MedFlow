import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


import LoginPage from "./pages/LoginPage";
import MedflowSupport from "./components/MedflowSupport";
import HomeScreen from "./pages/HomeScreen";

function App() {
  return (
      <>
        <Router>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/medflowSupport" element={<MedflowSupport />} />
            <Route path="/homescreen" element={<HomeScreen />} />
          </Routes>
        </Router>
      </>
  );
}

export default App;
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./Components/Header";
import Home from "./Routes/Home";
import Search from "./Routes/Search";
import Tv from "./Routes/Tv";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/React_netflix" element={<Home />}></Route>
        <Route
          path="/React_netflix/movies/:category/:movieId"
          element={<Home />}
        ></Route>
        <Route path="/React_netflix/tv" element={<Tv />}></Route>
        <Route
          path="/React_netflix/tv/:category/:movieId"
          element={<Tv />}
        ></Route>
        <Route path="/React_netflix/search" element={<Search />}></Route>
      </Routes>
    </Router>
  );
}

export default App;

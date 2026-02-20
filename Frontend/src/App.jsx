import Header from "./Components/Header/Header"
import Footer from "./Components/Footer/Footer"
import Home from "./Components/Home/Home"
import Navbar from "./Components/Navbar/Navbar"
import { BrowserRouter, Route, Routes } from "react-router-dom";
import About from "./Components/Pages/About/About";
import Automotive from "./Components/Pages/Automotive/Automotive";
import Marine from "./Components/Pages/Marine/Marine";
import Contract from "./Components/Pages/Contract/Contract";
import News from "./Components/Pages/News/News";
import Product from "./Components/Pages/Product/Product";
import Apollo from "./Components/Pages/Apollo/Apollo";
import ProductDetail from "./Components/Pages/Product/ProductDetail";
import Contact from "./Components/Contact/Contact";
import Preformance from "./Components/Pages/Performance/Preformance";
import ProductList from "./Components/Dashboard/ProductList/ProductList";
import Sustainability from "./Components/Pages/Sustainability/Sustainability";
import GlobalPresence from "./Components/Pages/GlobalPresence/GlobalPresence";


function App() {
  AOS.init({
    duration: 1000,
    once: true,
  });
  return (
    <>

      <BrowserRouter>
        <Header />
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/automotive" element={<Automotive />} />
          <Route path="/marine" element={<Marine />} />
          <Route path="/contract" element={<Contract />} />
          <Route path="/news" element={<News />} />
          <Route path="/product" element={<Product />} />
          <Route path="/productDetail/:id" element={<ProductDetail />} />
          <Route path="/apollo" element={<Apollo />} />
          <Route path="/preformance" element={<Preformance />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/productList" element={<ProductList />} />
          <Route path="/sustainability" element={<Sustainability />} />
          <Route path="/global-Presence" element={<GlobalPresence />} />
        </Routes>
        <Footer />
      </BrowserRouter>

    </>
  )
}

export default App

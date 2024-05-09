// App.jsx
import { useImperativeHandle, useState } from "react";
import { Toaster } from "react-hot-toast";
import { GlobalContext } from "./contexts/GlobalContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import EditorContainer from "./pages/Room";
// import { ContextProvider } from "./pages/SocketContext";
import React from "react";
const App = () => {
  const [name, setName] = useState("");
  return (
    <BrowserRouter>
      <GlobalContext.Provider value={{ name, setName }}>
        <Toaster
          position="top-right"
          toastOptions={{
            success: {
              duration: 3000,
              theme: {
                primary: "#4aee88",
              },
            },
          }}
        />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/editor/:roomId" element={<EditorContainer />} />
        </Routes>
      </GlobalContext.Provider>
    </BrowserRouter>
  );
};

export default App;

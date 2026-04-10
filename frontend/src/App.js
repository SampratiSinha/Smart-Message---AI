import { useState } from "react";
import Login from "./pages/Login";
import Chat from "./pages/Chat";

function App() {
  const [page, setPage] = useState("login");

  return (
    <>
      {page === "login" && <Login setPage={setPage} />}
      {page === "chat" && <Chat />}
    </>
  );
}

export default App;
import { Outlet } from "react-router-dom";
import Menu from "../Components/Menu";

const Root = () => {
  return (
    <>
      <Menu />
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default Root;

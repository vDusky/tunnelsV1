import ReactDOM from "react-dom/client";
import "molstar/lib/mol-plugin-ui/skin/light.scss";
import { App } from "./App";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(<App />);

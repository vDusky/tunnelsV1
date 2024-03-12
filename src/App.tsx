import { Viewer } from "./Viewer";
import { Context } from "./context";

export function App() {
  const context = new Context();

  return <Viewer context={context} />;
}

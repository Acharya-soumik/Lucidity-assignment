import "./App.css";
import DashboardLayout from "./components/layout/DashboaardLayout";
import { store } from "./store/slices/store";
import { Provider } from "react-redux";

function App() {
  return (
    <Provider store={store}>
      <DashboardLayout />
    </Provider>
  );
}

export default App;

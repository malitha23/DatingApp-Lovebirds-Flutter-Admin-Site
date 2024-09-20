import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/saga-blue/theme.css'; // or any theme you prefer
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css'; // for PrimeIcons





        
        

import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

import React from "react";
import ReactDOM from "react-dom";
import Main from "./Entryfile/Main";
import 'react-phone-number-input/style.css'
import 'react-toastify/dist/ReactToastify.css';
import 'react-phone-number-input/style.css'
import 'dayjs/locale/en-au';
import { ToastContainer } from 'react-toastify'
// window.Popper = require("popper.js").default;

// // ReactDOM.render(<Main/>, document.getElementById('app'));

// if (module.hot) { // enables hot module replacement if plugin is installed
//  module.hot.accept();
// }
import { createRoot } from 'react-dom/client';
import { CompanyProvider } from "./context";
import OnlineStatus from "./hooks/onlineStatus";
import dayjs from "dayjs";
dayjs.locale('en-au');
const container = document.getElementById('app');
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(
    <CompanyProvider>
        <OnlineStatus />
        <ToastContainer position="top-right" />
        <Main />
    </CompanyProvider>
);
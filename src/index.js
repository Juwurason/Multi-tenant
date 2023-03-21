import React from "react";
import ReactDOM from "react-dom";
import Main from "./Entryfile/Main";
import 'react-phone-number-input/style.css'
// import 'react-phone-number-input/style.css'
import { ToastContainer } from 'react-toastify'
// import { CompanyProvider } from './context';
// window.Popper = require("popper.js").default;

// // ReactDOM.render(<Main/>, document.getElementById('app'));

// if (module.hot) { // enables hot module replacement if plugin is installed
//  module.hot.accept();
// }
import { createRoot } from 'react-dom/client';
import { CompanyProvider } from "./context";
const container = document.getElementById('app');
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(
    <CompanyProvider>
        <Main />
    </CompanyProvider>
);
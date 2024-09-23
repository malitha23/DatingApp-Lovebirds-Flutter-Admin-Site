import React, { useState } from 'react';
import { TabView, TabPanel } from 'primereact/tabview';
import "primereact/resources/themes/saga-blue/theme.css";  // PrimeReact theme
import "primereact/resources/primereact.min.css";  // Core CSS
import "./index.css"; // Import your CSS file
import "primereact/resources/themes/saga-blue/theme.css";  // PrimeReact theme
import "primereact/resources/primereact.min.css";  // Core CSS
import "./index.css"; // Import your CSS file


import NewPaymentsMangeTable from './components/NewPaymentsMangeTable';
import NewHeartsPaymentsMangeTable from './components/NewHeartsPaymentsMangeTable';

import 'primereact/resources/themes/saga-blue/theme.css';  // PrimeReact theme
import 'primereact/resources/primereact.min.css';  // Core CSS
import 'primeicons/primeicons.css';  // PrimeIcons CSS
import './index.css';  // Your custom styles
import "primereact/resources/themes/lara-light-indigo/theme.css";

import {
  columnsDataDevelopment,

} from './variables/columnsData';



const Tables = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  

  return (
    <div>
      <br></br>
      <div className="card">
      <TabView activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}>
        <TabPanel header="New Monthly Payments">
          <NewPaymentsMangeTable columns={columnsDataDevelopment}  />
        </TabPanel>
        <TabPanel header="New Hearts Payments">
          <NewHeartsPaymentsMangeTable columns={columnsDataDevelopment}  />
        </TabPanel>
      </TabView>
    </div>
    </div>
  );
};

export default Tables;

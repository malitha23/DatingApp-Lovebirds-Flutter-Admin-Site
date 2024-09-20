import React, { useState } from 'react';
import { TabView, TabPanel } from 'primereact/tabview';
import "primereact/resources/themes/saga-blue/theme.css";  // PrimeReact theme
import "primereact/resources/primereact.min.css";  // Core CSS
import "./index.css"; // Import your CSS file
import "primereact/resources/themes/saga-blue/theme.css";  // PrimeReact theme
import "primereact/resources/primereact.min.css";  // Core CSS
import "./index.css"; // Import your CSS file

import CheckTable from './components/CheckTable';
import NewPaymentsMangeTable from './components/NewPaymentsMangeTable';
import ColumnsTable from './components/ColumnsTable';
import ComplexTable from './components/ComplexTable';
import 'primereact/resources/themes/saga-blue/theme.css';  // PrimeReact theme
import 'primereact/resources/primereact.min.css';  // Core CSS
import 'primeicons/primeicons.css';  // PrimeIcons CSS
import './index.css';  // Your custom styles
import "primereact/resources/themes/lara-light-indigo/theme.css";

import {
  columnsDataDevelopment,
  columnsDataCheck,
  columnsDataColumns,
  columnsDataComplex,
} from './variables/columnsData';

import tableDataCheck from './variables/tableDataCheck.json';
import tableDataColumns from './variables/tableDataColumns.json';
import tableDataComplex from './variables/tableDataComplex.json';

const Tables = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  

  return (
    <div>
      <br></br>
      <div className="card">
      <TabView activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}>
        <TabPanel header="New Payments">
          <NewPaymentsMangeTable columns={columnsDataDevelopment}  />
        </TabPanel>
        <TabPanel header="Check">
          <CheckTable columns={columnsDataCheck} data={tableDataCheck} />
        </TabPanel>
        <TabPanel header="Columns">
          <ColumnsTable columns={columnsDataColumns} data={tableDataColumns} />
        </TabPanel>
        <TabPanel header="Complex">
          <ComplexTable columns={columnsDataComplex} data={tableDataComplex} />
        </TabPanel>
      </TabView>
    </div>
    </div>
  );
};

export default Tables;

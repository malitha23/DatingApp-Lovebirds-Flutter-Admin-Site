import React, { useEffect, useState } from "react";
import MiniCalendar from "components/calendar/MiniCalendar";
import WeeklyRevenue from "views/admin/default/components/WeeklyRevenue";
import TotalSpent from "views/admin/default/components/TotalSpent";
import PieChartCard from "views/admin/default/components/PieChartCard";

import { MdBarChart } from "react-icons/md";
import { API_ENDPOINTS } from '../../../config';
import { columnsDataCheck, columnsDataComplex } from "./variables/columnsData";

import Widget from "components/widget/Widget";
import CheckTable from "views/admin/default/components/CheckTable";
import ComplexTable from "views/admin/default/components/ComplexTable";
import DailyTraffic from "views/admin/default/components/DailyTraffic";
import TaskCard from "views/admin/default/components/TaskCard";
import tableDataCheck from "./variables/tableDataCheck.json";
import tableDataComplex from "./variables/tableDataComplex.json";

const Dashboard = () => {

  const [dashboardData, setDashboardData] = useState(null);

  // Fetch data from the API
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token'); // Get token from localStorage

        const response = await fetch(`${API_ENDPOINTS.getadmindashboardpaymnetsdata}`, {
          method: 'GET', // Use POST method for bulk updates
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        const data = await response.json();
        setDashboardData(data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, []);

  // Return loading state if data is not yet fetched
  if (!dashboardData) {
    return <div>Loading...</div>;
  }

  // Destructure the data for easier access
  const {
    total,
    packagesbuydata,
    heartsbuydata,
    totalcurrentmonth,
    packagesbuydatacurrentmonth,
    heartsbuydatacurrentmonth
  } = dashboardData;

  return (
    <div>
      {/* Card widget */}

      <div className="mt-3 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3 3xl:grid-cols-6">
        <Widget
          icon={<MdBarChart className="h-7 w-7" />}
          title={`Total Earnings`}
          subtitle={`Rs ${total.total_approved_payments.toFixed(2)}`}
          subtitle2={`From ${total.total_users_paid} Users`}
        />
        <Widget
          icon={<MdBarChart className="h-7 w-7" />}
          title={`Total Earnings (Packages)`}
          subtitle={`Rs ${packagesbuydata.total_approved_payments.toFixed(2)}`}
          subtitle2={`From ${packagesbuydata.total_users_paid} Users`}
        />
        <Widget
           icon={<MdBarChart className="h-7 w-7" />}
           title={`Total Earnings (Hearts)`}
           subtitle={`Rs ${heartsbuydata.total_approved_payments.toFixed(2)}`}
           subtitle2={`From ${heartsbuydata.total_users_paid} Users`}
        />
        <Widget
          icon={<MdBarChart className="h-7 w-7" />}
          title={`This Month Total Earnings`}
          subtitle={`Rs ${totalcurrentmonth.total_approved_payments.toFixed(2)}`}
          subtitle2={`From ${totalcurrentmonth.total_users_paid} Users`}
        />
        <Widget
            icon={<MdBarChart className="h-7 w-7" />}
            title={`This Month Earnings (Packages)`}
            subtitle={`Rs ${packagesbuydatacurrentmonth.total_approved_payments.toFixed(2)}`}
            subtitle2={`From ${packagesbuydatacurrentmonth.total_users_paid} Users`}
        />
        <Widget
           icon={<MdBarChart className="h-7 w-7" />}
           title={`This Month Earnings (Hearts)`}
           subtitle={`Rs ${heartsbuydatacurrentmonth.total_approved_payments.toFixed(2)}`}
           subtitle2={`From ${heartsbuydatacurrentmonth.total_users_paid} Users`}
        />
      </div>

      {/* Charts */}

      <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
        <TotalSpent />
        <WeeklyRevenue />
      </div>

      {/* Tables & Charts */}

      <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-2">
        {/* Check Table */}
        <div>
          {/* <CheckTable
            columnsData={columnsDataCheck}
            tableData={tableDataCheck}
          /> */}
        </div>

        {/* Traffic chart & Pie Chart */}

        <div className="grid grid-cols-1 gap-5 rounded-[20px] md:grid-cols-2">
          {/* <DailyTraffic />
          <PieChartCard /> */}
        </div>

        {/* Complex Table , Task & Calendar */}

        {/* <ComplexTable
          columnsData={columnsDataComplex}
          tableData={tableDataComplex}
        /> */}

        {/* Task chart & Calendar */}

        <div className="grid grid-cols-1 gap-5 rounded-[20px] md:grid-cols-2">
          {/* <TaskCard /> */}
          <div className="grid grid-cols-1 rounded-[20px]">
            {/* <MiniCalendar /> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

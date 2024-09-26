import React, { useState, useEffect } from "react";
import { MdBarChart } from "react-icons/md";
import Card from "components/card";
import LineChart from "components/charts/LineChart";
import { API_ENDPOINTS } from '../../../../config';

const initialLineChartOptions = {
  chart: {
    type: "line",
    height: "100%",
    toolbar: { show: false },
    zoom: {
      enabled: true,
      type: 'x',
      autoScaleYaxis: true,
    },
  },
  stroke: {
    curve: "smooth",
  },
  xaxis: {
    categories: [], // Will be updated dynamically
    labels: {
      style: {
        colors: "#A3AED0",
        fontSize: "12px",
        fontWeight: "500",
      },
    },
  },
  yaxis: {
    show: true,
  },
  grid: {
    show: false,
  },
  tooltip: {
    style: {
      fontSize: "12px",
      backgroundColor: "#000000",
    },
    theme: 'dark',
  },
  responsive: [{
    breakpoint: 480,
    options: {
      chart: {
        height: 300,
      },
      xaxis: {
        labels: {
          show: true,
        },
      },
    },
  }],
};

const TotalSpent = () => {
  const [selectedWeek, setSelectedWeek] = useState('lastWeek');
  const [chartData, setChartData] = useState([]);
  const [lineChartOptions, setLineChartOptions] = useState(initialLineChartOptions);
  const [weeklyPaymentData, setWeeklyPaymentData] = useState({
    lastWeek: [],
    oneWeekAgo: [],
    twoWeeksAgo: [],
    fourWeeksAgo: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch(`${API_ENDPOINTS.getDailyPackagePaymentsDataToChart}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();

        // Transform the fetched data into the weekly format
        const formattedData = {
          lastWeek: [],
          oneWeekAgo: [],
          twoWeeksAgo: [],
          fourWeeksAgo: [],
        };

        const today = new Date();
        console.log(today);

        // Fill the last week
        for (let i = 5; i >= -1; i--) {
          const date = new Date(today);
          date.setDate(date.getDate() - i);
          const dayString = date.toISOString().split('T')[0];
          const dayData = data.find(item => item.day_of_month === dayString);
          formattedData.lastWeek.push({
            day_of_month: dayString,
            total_approved_payments: dayData ? dayData.total_approved_payments : 0,
          });

        }

        // Fill the one week ago
        for (let i = 12; i >= 6; i--) {
          const date = new Date(today);
          date.setDate(date.getDate() - i);
          const dayString = date.toISOString().split('T')[0];
          const dayData = data.find(item => item.day_of_month === dayString);
          formattedData.oneWeekAgo.push({
            day_of_month: dayString,
            total_approved_payments: dayData ? dayData.total_approved_payments : 0,
          });
        }

        // Fill the two weeks ago
        for (let i = 19; i >= 13; i--) {
          const date = new Date(today);
          date.setDate(date.getDate() - i);
          const dayString = date.toISOString().split('T')[0];
          const dayData = data.find(item => item.day_of_month === dayString);
          formattedData.twoWeeksAgo.push({
            day_of_month: dayString,
            total_approved_payments: dayData ? dayData.total_approved_payments : 0,
          });
        }

        // Fill the four weeks ago
        for (let i = 30; i >= 22; i--) {
          const date = new Date(today);
          date.setDate(date.getDate() - i);
          const dayString = date.toISOString().split('T')[0];
          const dayData = data.find(item => item.day_of_month === dayString);
          formattedData.fourWeeksAgo.push({
            day_of_month: dayString,
            total_approved_payments: dayData ? dayData.total_approved_payments : 0,
          });
        }

        setWeeklyPaymentData(formattedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const selectedData = weeklyPaymentData[selectedWeek];
    const data = selectedData.map(item => item.total_approved_payments);
    const categories = selectedData.map(item => item.day_of_month);

    setChartData([{ name: "Total Payments", data, color: "#4318FF" }]);
    setLineChartOptions(prevOptions => ({
      ...prevOptions,
      xaxis: {
        ...prevOptions.xaxis,
        categories: categories, // Update categories dynamically
      },
    }));
  }, [selectedWeek, weeklyPaymentData]);

   // Calculate total approved payments for the selected week
   const totalApprovedPayments = weeklyPaymentData[selectedWeek].reduce((total, item) => total + item.total_approved_payments, 0);

  return (
    <Card extra="text-center">
    <h2 className="pb-[10px] text-xl font-bold py-2" style={{opacity:'0.8', color:'#101067'}}>Weekly Monthly Package Payments</h2> {/* Adjust the title text and styles as needed */}
    <p className="text-s font-semibold" style={{opacity:'0.8', color:'black'}}>Total Payments: Rs {totalApprovedPayments}</p> {/* Display total payments */}

    <div className="!p-[20px]  flex justify-between">
      <div className="flex items-center space-x-2">
        {Object.keys(weeklyPaymentData).map((week) => (
          <button
            key={week}
            className={`flex items-center justify-center rounded-md py-1 px-2 text-sm transition duration-200 
              ${selectedWeek === week ? "bg-lightPrimary text-brand-500" : "bg-gray-100 text-gray-600"}`}
            onClick={() => setSelectedWeek(week)}
          >
            {week.replace(/([A-Z])/g, ' $1').trim()}
          </button>
        ))}
      </div>
    </div>
  
    <div className="pb-[5px]  h-full w-full">
      <LineChart series={chartData} options={lineChartOptions} />
    </div>
  </Card>
  
  );
};

export default TotalSpent;

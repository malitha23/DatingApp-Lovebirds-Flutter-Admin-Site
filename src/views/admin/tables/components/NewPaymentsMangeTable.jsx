import React, { useState, useEffect, useCallback } from 'react';
import { API_ENDPOINTS } from '../../../../config';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import DetailsModal from './DetailsModal'; // Import the DetailsModal component
import './css/NewPaymentsMangeTable.css'; // Import the CSS file

const NewPaymentsMangeTable = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [globalFilter, setGlobalFilter] = useState('');
    const [selectedItem, setSelectedItem] = useState(null); // State to handle selected item for modal
    const [modalVisible, setModalVisible] = useState(false); // State to handle modal visibility

    const fetchData = useCallback(async () => {
        const token = localStorage.getItem('token'); // Get token from localStorage

        try {
            const response = await fetch(API_ENDPOINTS.getPendingPackagespayments, {
                method: 'GET', // HTTP method
                headers: {
                    'Authorization': `Bearer ${token}`, // Authorization header with token
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();
            console.log(result);

            // Process the data to add 'name' field
            const processedData = result.data.map(item => ({
                ...item,
                name: `${item.firstName || ''} ${item.lastName || ''}`.trim(), // Combine firstName and lastName
                formatedpayment_date: new Date(item.payment_date).toLocaleString('en-GB', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false // 24-hour format
                })
            }));
            setData(processedData); // Set processed data to state
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleView = (item) => {
        setSelectedItem(item); // Set the selected item
        setModalVisible(true); // Show the modal
    };

    const header = (
        <div className="table-header">
            <h5 className="p-mb-0">Pending Payments</h5>
            <span className="p-input-icon-left">
                <input
                    type="text"
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    placeholder="Search"
                    className="p-inputtext p-component"
                />
            </span>
        </div>
    );

    return (
        <>
            <DataTable
                value={data}
                paginator
                rows={10}
                dataKey="id"
                loading={loading}
                globalFilter={globalFilter}
                header={header}
                emptyMessage="No pending packages found."
                responsiveLayout="scroll"
            >
                <Column field="id" header="ID" sortable />
                <Column field="userId" header="User ID" sortable />
                <Column field="name" header="Name" sortable />
                <Column field="price" header="Price" sortable />
                <Column field="plan_name" header="Plan Name" sortable />
                <Column field="payment_method" header="Payment Method" sortable />
                <Column field="formatedpayment_date" header="Payment Date" sortable />
                <Column
                    header="Actions"
                    body={(rowData) => (
                        <Button
                            icon="pi pi-eye"
                            className="custom-button"
                            onClick={() => handleView(rowData)}
                        />
                    )}
                />
            </DataTable>
            {modalVisible && selectedItem && (
                <DetailsModal
                    item={selectedItem}
                    onClose={() => setModalVisible(false)} // Hide modal
                    onUpdateStatus={fetchData} 
                />
            )}
        </>
    );
};

export default NewPaymentsMangeTable;

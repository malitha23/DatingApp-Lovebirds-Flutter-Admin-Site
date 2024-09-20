import React, { useState, useEffect, useRef } from 'react';
import { Dialog } from 'primereact/dialog';
import { API_ENDPOINTS } from '../../../../config';
import './css/DetailsModal.css'; // Import the CSS file for modal
import ImageFullScreenModal from '../../../../components/ImageFullCrean/ImageFullScreanModal'; // Import the fullscreen modal component
import { Toast } from 'primereact/toast';


const DetailsModal = ({ item, onClose, onUpdateStatus }) => {
    const initialStartDate = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Colombo" }));
    const [paymentStatus, setPaymentStatus] = useState(item.payment_status);
    const [months, setMonths] = useState(0); // Store months as number
    const [price, setPrice] = useState(item.price);
    const [packagePrice, setPackagePrice] = useState(0);
    const [days, setDays] = useState(0); // Store days as number
    const [isModalOpen, setIsModalOpen] = useState(false); // State for fullscreen modal
    const [modalContent, setModalContent] = useState(''); // State for modal content
    const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 }); // State for modal position
    const [startDate, setStartDate] = useState(initialStartDate); // Set start date
    const [endDate, setEndDate] = useState(initialStartDate); // Initialize end date
    const toast = useRef(null);
    useEffect(() => {
        const performInitialOperations = async () => {
            try {
                const token = localStorage.getItem('token');

                const response = await fetch(`${API_ENDPOINTS.getSubcriptionPackagesForPendingPackagesPayments}`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ plan_name: item.plan_name })
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                console.log('Initial data fetched:', data);

                if (data.length > 0) {
                    const priceString = data[0].price;
                    const priceValue = parseFloat(priceString.split(' ')[0]); // Convert to float for accurate calculations
                    console.log('Price value:', priceValue);
                    setPackagePrice(priceValue);
                    const calculatedMonths = item.price / priceValue;
                    setMonths(Math.floor(calculatedMonths)); // Set the whole months
                    setDays(Math.round((calculatedMonths - Math.floor(calculatedMonths)) * 30)); // Set the remaining days
                }
            } catch (error) {
                console.error('Failed to fetch initial data:', error);
            }
        };
        performInitialOperations();
    }, [item]);

    useEffect(() => {
        const calculateEndDate = () => {
            setStartDate(startDate);
            const newEndDate = new Date(startDate);
            newEndDate.setMonth(newEndDate.getMonth() + months);
            newEndDate.setDate(newEndDate.getDate() + days);
            setEndDate(newEndDate);
        };

        calculateEndDate();
    }, [startDate, months, days]);

    const handleStatusChange = async (e) => {
        const newStatus = e.target.value;
        const approvedValue = newStatus === '1' ? 1 : newStatus === '-1' ? -1 : 0; // Assuming '1' means approved
        setPaymentStatus(newStatus);
    
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_ENDPOINTS.approveOrrejectPendingPackagesPayments}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: item.id,
                    userId: item.userId,
                    status: approvedValue,
                    price: price,
                    duration: months === 0 ? 1 : months,
                    packageStartDate: startDate,
                    packageEndDate: endDate,
                    plan_name: item.plan_name,
                    payment_date: new Date(item.payment_date).toISOString(),
                    payment_method: item.payment_method,
                    approved: approvedValue === 0 ? 0 : 1,
                }),
            });
    
            const data = await response.json();
    
            if (response.ok) {
                // Show success toast
                toast.current.show({ severity: 'success', summary: 'Success', detail: data.message || 'Payment status updated successfully' });
                onUpdateStatus();
                // onClose();
            } else {
                // Show error toast
                toast.current.show({ severity: 'error', summary: 'Error', detail: data.message || 'Failed to update payment status' });
            }
        } catch (error) {
            console.error('Failed to update status:', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'An error occurred while updating the payment status' });
        }
    };
    
    

    const handlePriceChange = (e) => {
        const newPrice = parseFloat(e.target.value) || 0; // Convert to float or set to 0 if input is empty
        setPrice(newPrice);

        const calculatedMonths = newPrice / packagePrice;
        const wholeMonths = Math.floor(calculatedMonths); // Calculate whole months
        const remainingDays = Math.round((calculatedMonths - wholeMonths) * 30); // Calculate remaining days

        setMonths(wholeMonths); // Set the whole months
        setDays(remainingDays); // Set the remaining days

        // Automatically update end date when price changes
        const newEndDate = new Date(startDate);
        newEndDate.setMonth(newEndDate.getMonth() + wholeMonths);
        newEndDate.setDate(newEndDate.getDate() + remainingDays);
        setEndDate(newEndDate);
    };

    const handleImageClick = (e) => {
        setModalContent(`${API_ENDPOINTS.Base_Url}${item.receiptImage}`);
        setModalPosition({
            top: e.clientY,
            left: e.clientX
        });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const formatDateToLocal = (date) => {
        return date.toLocaleString("en-US", { timeZone: "Asia/Colombo" });
    };

    return (
        <>
<Toast ref={toast} />
            <Dialog header="Payment Details" visible={true} onHide={onClose} style={{ width: '50vw' }}>
                <div className="status-container">
                    <p><strong>Status:</strong>
                        <span className="highlight">
                            {item.payment_status === 0 ? (
                                <select value={paymentStatus} onChange={handleStatusChange}>
                                    <option value={0}>Pending</option>
                                    <option value={1}>Approved</option>
                                    <option value={-1}>Rejected</option>
                                </select>
                            ) : (
                                item.payment_status === 1 ? 'Approved' : 'Rejected'
                            )}
                        </span>
                    </p>
                </div>
                <div className="details-modal-content">
                    <div className="left-column top-left">
                        <p><strong>User ID:</strong> <span className="highlight">{item.userId}</span></p>
                        <p><strong>Name:</strong> <span className="highlight">{item.firstName} {item.lastName || ''}</span></p>
                        <p><strong>Start Date:</strong> <span className="highlight">{formatDateToLocal(startDate)}</span></p>
                        <p><strong>End Date:</strong> <span className="highlight">{formatDateToLocal(endDate)}</span></p>
                        <p><strong>Payment Date:</strong> <span className="highlight">{formatDateToLocal(new Date(item.payment_date))}</span></p>
                        <p><strong>Discount Applied:</strong> <span className="highlight">{item.withDiscount ? 'Yes' : 'No'}</span></p>
                        <p><strong>Referral Code:</strong> <span className="highlight">{item.withrefaralCode || 'N/A'}</span></p>
                        <p><strong>WhatsApp Number:</strong> <span className="highlight">{item.whatsAppNumber}</span></p>
                    </div>
                    <div className="right-column top-right">
                        {item.receiptImage && (
                            <img
                                src={item.receiptImage ? `${API_ENDPOINTS.Base_Url}${item.receiptImage}` : 'fallback-image-url'}
                                alt="Receipt"
                                className="receipt-image"
                                onClick={handleImageClick}
                                style={{ cursor: 'pointer' }}
                            />
                        )}
                        <p><strong>Price Rs:</strong>
                            <span className="highlight">
                                <input
                                    type="text"
                                    value={price}
                                    onChange={handlePriceChange}
                                />
                            </span>
                        </p>
                        <p><strong>Plan Name:</strong> <span className="highlight">{item.plan_name}</span></p>
                        <p><strong>Price Per 1 Mon:</strong> <span className="highlight">Rs {packagePrice}</span></p>
                        <p><strong>Payment Method:</strong> <span className="highlight">{item.payment_method}</span></p>
                        <p>
                            <strong>Duration:</strong>
                            <span className="highlight">
                                {months > 0 ? `${months} ${months === 1 ? 'Month' : 'Months'} ` : ''}
                                {days > 0 ? `${days} ${days === 1 ? 'Day' : 'Days'}` : ''}
                            </span>
                        </p>
                    </div>
                </div>
            </Dialog>

            {isModalOpen && (
                <ImageFullScreenModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    content={modalContent}
                    position={modalPosition}
                />
            )}
        </>
    );
};

export default DetailsModal;

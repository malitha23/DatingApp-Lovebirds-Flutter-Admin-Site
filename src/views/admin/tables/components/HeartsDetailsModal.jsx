import React, { useState, useEffect, useRef } from 'react';
import { Dialog } from 'primereact/dialog';
import { API_ENDPOINTS } from '../../../../config';
import './css/HeartsDetailsModal.css'; // Import the CSS file for modal
import ImageFullScreenModal from '../../../../components/ImageFullCrean/ImageFullScreanModal'; // Import the fullscreen modal component
import { Toast } from 'primereact/toast';


const HeartsDetailsModal = ({ item, onClose, onUpdateStatus }) => {
    const [paymentStatus, setPaymentStatus] = useState(item.approved);
    const [price, setPrice] = useState(item.total_price);
    const [packageHearts, setPackageHearts] = useState(0);
    const [packagePrice, setPackagePrice] = useState(0);
    const [packageaccordingHearts, setPackageaccordingHearts] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false); // State for fullscreen modal
    const [modalContent, setModalContent] = useState(''); // State for modal content
    const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 }); // State for modal position
    const toast = useRef(null);
    useEffect(() => {
        const performInitialOperations = async () => {
            try {
                const token = localStorage.getItem('token');

                const response = await fetch(`${API_ENDPOINTS.getHearsPackagesForPendingPackagesPayments}`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ hearts_count: item.hearts })
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                console.log('Initial data fetched:', data);

                if (data.length > 0) {
                    const priceValue = data[0].price;
                    const heartsValue = data[0].heart;

                    const accordingHearts = (heartsValue / priceValue) * price;

                    setPackagePrice(priceValue);
                    setPackageHearts(heartsValue);
                    setPackageaccordingHearts(accordingHearts);
                }
            } catch (error) {
                console.error('Failed to fetch initial data:', error);
            }
        };
        performInitialOperations();
    }, [item, price]);



    const handleStatusChange = async (e) => {
        const newStatus = e.target.value;
        const approvedValue = newStatus === '1' ? 1 : newStatus === '-1' ? -1 : 0; // Assuming '1' means approved
        setPaymentStatus(newStatus);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_ENDPOINTS.approveOrRejectPendingHeartsPackagesPayments}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: item.id,
                    userId: item.userId,
                    firstName: item.firstName,
                    lastName: item.lastName,
                    price: price,
                    payment_date: new Date(item.payment_date).toISOString(),
                    payment_method: item.payment_method,
                    approved: approvedValue,
                    whatsAppNumber: item.whatsAppNumber,
                    packageaccordingHearts: packageaccordingHearts,
                    packagePrice:packagePrice,
                    packageHearts: packageHearts
                }),
            });

            const data = await response.json();

            if (response.ok) {
                // Show success toast
                toast.current.show({ severity: 'success', summary: 'Success', detail: data.message || 'Payment status updated successfully' });
                onUpdateStatus();
                setTimeout(() => {
                    onClose();
                }, 2000); // Delay of 2 seconds (2000 milliseconds)

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

        const a = (packageHearts / packagePrice) * newPrice;
        setPackageaccordingHearts(a);
    };

    const handleImageClick = (e) => {
        setModalContent(`${API_ENDPOINTS.Base_Url}${item.bank_receipt_image}`);
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
            <Dialog header="Payment Details" visible={true} onHide={onClose} style={{
                width: '100%', // Default for desktop
                maxWidth: '90vw', // Ensure the dialog doesn't exceed viewport width on mobile
            }}
                className="custom-dialog">
                <div className="status-container">
                    <p>
                        <strong>Status:</strong>
                        <span className="highlight">
                            {item.approved === 0 ? (
                                <select
                                    value={paymentStatus}
                                    onChange={handleStatusChange}
                                    className="status-select"
                                >
                                    <option value={0}>Pending</option>
                                    <option value={1}>Approved</option>
                                    <option value={-1}>Rejected</option>
                                </select>
                            ) : item.payment_status === 1 ? (
                                <span className="status-approved">Approved</span>
                            ) : (
                                <span className="status-rejected">Rejected</span>
                            )}
                        </span>
                    </p>
                </div>
                <div className="details-modal-content">
                    <div className="left-column top-left">
                        <p><strong>User ID:</strong> <span className="highlight">{item.userId}</span></p>
                        <p><strong>Name:</strong> <span className="highlight">{item.firstName} {item.lastName || ''}</span></p>
                        <p><strong>Payment Date:</strong> <span className="highlight">{formatDateToLocal(new Date(item.payment_date))}</span></p>
                        {item.withrefaralCode != null && (
                            <p><strong>Referral Code:</strong> <span className="highlight">{item.withrefaralCode || 'Not Code'}</span></p>
                        )}
                        <p>
                            <strong>Selected Plan Hearts:</strong>
                            <span className="highlight heart-background">
                                <i className="pi pi-heart" style={{ color: 'white' }}></i> {/* Change icon color to white for contrast */}
                                <span style={{ marginLeft: '7px' }}>  {packageHearts} </span>
                            </span>
                        </p>



                        <p><strong>Selected Plan Price:</strong> <span className="highlight">Rs. {packagePrice} {item.lastName || ''}</span></p>
                        <p><strong>WhatsApp Number:</strong> <span className="highlight">{item.whatsAppNumber}</span></p>
                    </div>
                    <div className="right-column top-right">
                        {item.bank_receipt_image && (
                            <img
                                src={item.bank_receipt_image ? `${API_ENDPOINTS.Base_Url}${item.bank_receipt_image}` : 'fallback-image-url'}
                                alt="Receipt"
                                className="receipt-image"
                                onClick={handleImageClick}
                                style={{ cursor: 'pointer' }}
                            />
                        )}
                        <p style={{display:'flex'}}>
                            <strong style={{height:'40px', marginTop:'10px'}}>Pay Price Rs:</strong>
                            <span className="highlight">
                                <input
                                    type="text"
                                    value={price}
                                    onChange={handlePriceChange}
                                    style={{width:'120px', marginBottom:'5px', height:'38px'}}
                                />
                            </span>
                        </p>
                        <span style={{fontSize:'12px', color:'#f7c8be'}}><b>Note:</b> Check receipt the amount paid in the receipt is equal to this amount </span>
                        <p>
                            <strong>Hearts count according to payment:</strong>
                           
                    
                            <span className="highlight heart-background">
                                <i className="pi pi-heart" style={{ color: 'white' }}></i> {/* Change icon color to white for contrast */}
                                <input
                                type="number"
                                value={packageaccordingHearts}
                                onChange={(e) => setPackageaccordingHearts(e.target.value)}
                                className="highlight"
                                style={{ borderRadius:'10px', backgroundColor: 'white', border: '2px solid green', color: 'black', width: '80px', padding: '2px 4px' }} // Set background to white and border to green
                            />
                                <span style={{ marginLeft: '7px' }}>  Hearts </span>
                            </span>
                    
                        </p>


                        <p><strong>Payment Method:</strong> <span className="highlight">{item.payment_method} Payment</span></p>

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

export default HeartsDetailsModal;

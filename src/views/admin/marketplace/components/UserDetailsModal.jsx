import React, { useState, useRef, useEffect } from 'react';
import './UserDetailsModal.css';
import ImageFullScreenModal from '../../../../components/ImageFullCrean/ImageFullScreanModal'; // Import the fullscreen modal component
import { Toast } from 'primereact/toast';
import Swal from 'sweetalert2';

const UserDetailsModal = ({ users, setUsers, modalVisible, selectedUser, closeModal, handleOpenModal, formatInterests, API_ENDPOINTS }) => {
    const [isModalOpen, setIsModalOpen] = useState(false); // State for fullscreen modal
    const [modalContent, setModalContent] = useState(''); // State for modal content
    const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 }); // State for modal position
    const [message, setMessage] = useState('');
    const toast = useRef(null); // Reference for Toast
    const [loadingsendwhatsapp, setLoadingsendwhatsapp] = useState(false);
    const [language, setLanguage] = useState('English');

    
    useEffect(() => {
        const messages = {
            English: {
                greeting: `Hello, ${selectedUser?.firstName || 'User'}!\n`,
                title: 'Do you want to use our platform? Please follow the steps below:',
                steps: {
                    nic: '1. Please upload your National ID or Driving License images through the lovebirds app and complete the registration process again from where you left off.',
                    terms: '2. Step 3 You must agree to the conditions of the lovebirds app to complete the registration process. So click the agree button and continue.',
                    payment: '3. Step 5 You can complete the process by getting the free one-month package by clicking the skip button on the page that appears to select the monthly package.',
                },
                thankYou: '\nAfter all, find a good partner that suits you, Thank you!'
            },
            Sinhala: {
                greeting: `ආයුබෝවන්, ${selectedUser?.firstName || 'User'}!\n`,
                title: 'ඔබට අපගේ වේදිකාව භාවිතා කිරීමට අවශ්‍යද? කරුණාකර පහත පියවර අනුගමනය කරන්න:',
                steps: {
                    nic: '1. කරුණාකර ඔබගේ ජාතික හැඳුනුම්පත හෝ රියදුරු බලපත්‍ර පින්තූර lovebirds යෙදුම හරහා උඩුගත කර ඔබ නතර කළ ස්ථානයෙන් නැවත ලියාපදිංචි කිරීමේ ක්‍රියාවලිය සම්පූර්ණ කරන්න.',
                    terms: '2. පියවර 3 ලියාපදිංචි කිරීමේ ක්‍රියාවලිය සම්පූර්ණ කිරීම සඳහා ඔබ lovebirds යෙදුමේ කොන්දේසි වලට එකඟ විය යුතුය. එබැවින් එකඟතා බොත්තම ක්ලික් කර ඉදිරියට යන්න.',
                    payment: '3. පියවර 5 මාසික පැකේජය තේරීමට දිස්වන පිටුවේ ඇති skip බොත්තම ක්ලික් කිරීමෙන් ඔබට නොමිලේ මාසයක පැකේජය ලබා ගැනීමෙන් ක්‍රියාවලිය සම්පූර්ණ කළ හැක.'
                },
                thankYou: '\nසියල්ලට පසු, ඔබට ගැලපෙන හොඳ සහකරුවෙකු සොයා ගන්න, ස්තූතියි!'
            },
            Tamil: {
                greeting: `வணக்கம், ${selectedUser?.firstName || 'User'}!\n`,
                title: 'நீங்கள் எங்கள் தளத்தைப் பயன்படுத்த விரும்புகிறீர்களா? கீழே உள்ள படிகளை பின்பற்றவும்:',
                steps: {
                    nic: '1. லவ்பேர்ட்ஸ் செயலி மூலம் உங்கள் தேசிய ஐடி அல்லது ஓட்டுநர் உரிமப் படங்களைப் பதிவேற்றி, நீங்கள் நிறுத்திய இடத்திலிருந்து மீண்டும் பதிவுச் செயல்முறையை முடிக்கவும்.',
                    terms: '2. படி 3 பதிவு செயல்முறையை முடிக்க லவ்பேர்ட்ஸ் பயன்பாட்டின் நிபந்தனைகளை நீங்கள் ஏற்க வேண்டும். எனவே ஒப்புக்கொள் பொத்தானைக் கிளிக் செய்து தொடரவும்.',
                    payment: '3. படி 5 மாதாந்திர தொகுப்பைத் தேர்ந்தெடுக்க தோன்றும் பக்கத்தில் உள்ள தவிர் பொத்தானைக் கிளிக் செய்வதன் மூலம் இலவச ஒரு மாத தொகுப்பைப் பெறுவதன் மூலம் செயல்முறையை முடிக்கலாம்.'
                },
                thankYou: '\nஎல்லாவற்றிற்கும் மேலாக, உங்களுக்கு ஏற்ற ஒரு நல்ல துணையைத் தேடுங்கள், நன்றி!'
            }
        };
    
        
        const generateMessage = () => {
            const greeting = messages[language].greeting; // Get the greeting
            const title = messages[language].title; // Get the title
            const incompleteSteps = [
                messages[language].steps.nic,
                messages[language].steps.terms,
                messages[language].steps.payment,
            ].filter(step => step); // Filter out any undefined steps
    
            const fullMessage = [greeting, title, ...incompleteSteps, messages[language].thankYou].join('\n'); // Include all parts
            setMessage(fullMessage); // Set the full message
        };
    
        generateMessage();
    }, [language, selectedUser]); // Added messages to the dependency array
    
    
    // Steps tracking based on user data
    const stepsData = [
        { label: 'NIC Or License Image Upload Process Not Completed', completed: !!selectedUser?.nicFrontImage },
        { label: 'Terms Agreed Process Not Completed', completed: !!selectedUser?.terms_agree },
        { label: 'Create Portfolio Process Not Completed. (Whatsapp number is empty!)', completed: !!selectedUser?.whatsAppNumber },
        {
            label: 'Payment Process Not Completed',
            completed: selectedUser?.plan_name &&
                selectedUser?.packageDurationMonth &&
                selectedUser?.packageStartDate &&
                selectedUser?.packageEndDate &&
                selectedUser?.payment_date
        },
        { label: 'Last Step Not Completed (Generated Key)', completed: !!selectedUser?.generatedKey }
    ];

    // Calculate completed steps
    const completedSteps = stepsData.filter(step => step.completed).length;
    const totalSteps = stepsData.length;

    // Determine color for progress bar
    let barColor = 'orange'; // Default color for partially completed steps
    if (completedSteps === totalSteps) {
        barColor = 'green'; // Fully completed
    } else if (stepsData.some(step => !step.completed && step.label.includes('Whatsapp number is empty!'))) {
        barColor = 'red'; // Specific condition for red color
    }


    const notCompletedSteps = stepsData.filter(step => !step.completed);

    
    




    if (!modalVisible || !selectedUser) return null;

    const isEmpty = (value) => !value || value === '';  // Utility to check for empty fields





    /** Step 4 css design **/
    const hasNonEmptyWhatsAppNumber = !!selectedUser?.whatsAppNumber;
    const allFieldsEmpty = [
        selectedUser?.firstName,
        selectedUser?.lastName,
        selectedUser?.whatsAppNumber,
        selectedUser?.job,
        selectedUser?.location,
        selectedUser?.marriageStatus,
        selectedUser?.weight,
        selectedUser?.personalityDescription,
        selectedUser?.alcoholConsumption,
        selectedUser?.lookingFor
    ].every(isEmpty);

    const allFieldsCompleted = [
        selectedUser?.firstName,
        selectedUser?.lastName,
        selectedUser?.whatsAppNumber,
        selectedUser?.job,
        selectedUser?.location,
        selectedUser?.marriageStatus,
        selectedUser?.weight,
        selectedUser?.personalityDescription,
        selectedUser?.alcoholConsumption,
        selectedUser?.lookingFor
    ].every(field => !isEmpty(field));

    const headingStyle = allFieldsCompleted
        ? { color: 'green', fontWeight: 'bold' }
        : allFieldsEmpty
            ? { color: 'red', fontWeight: 'bold' }
            : hasNonEmptyWhatsAppNumber && !allFieldsEmpty
                ? { color: 'orange', fontWeight: 'bold' }
                : { fontWeight: 'bold' };
    /** end Step 4 css design **/

    const handleImageClick = (e, imagepath) => {
        setModalContent(imagepath); // Use the passed image path
        setModalPosition({
            top: e.clientY,
            left: e.clientX
        });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    // Check if WhatsApp number is not null
    const hasWhatsAppNumber = !!selectedUser?.whatsAppNumber;






    const handleSendMessage = async () => {
        if (message) {
            setLoadingsendwhatsapp(true); // Set loading to true
            try {
                let phoneNumber = selectedUser.whatsAppNumber;
                if (phoneNumber.startsWith('0')) {
                    phoneNumber = phoneNumber.substring(1);
                }
                phoneNumber = `94${phoneNumber}`;

                const response = await fetch(API_ENDPOINTS.sendmessagewhatsappsend, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        userId: selectedUser.user_id,
                        phoneNumber: phoneNumber,
                        message: message,
                    }),
                });

                const data = await response.json();

                if (response.ok) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Success',
                        text: data.message,
                        timer: 3000,
                        showConfirmButton: false,
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: data.message,
                        timer: 3000,
                        showConfirmButton: false,
                    });
                }

                setMessage('');
            } catch (error) {
                console.error('Error sending message:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Failed to send message',
                    timer: 3000,
                    showConfirmButton: false,
                });
            } finally {
                setLoadingsendwhatsapp(false); // Reset loading state
            }
        } else {
            Swal.fire({
                icon: 'warning',
                title: 'Warning',
                text: 'Please enter a message',
                timer: 3000,
                showConfirmButton: false,
            });
        }
    };

    const onStatusChange = async (e, rowData) => {
        // Determine the status code based on e.value
        const statusCode = e.value === 'approve' ? 1 : e.value === 'reject' ? 2 : 0;

        // Fetch API call to update the user's status
        try {
            const token = localStorage.getItem('token'); // Get token from localStorage
            const response = await fetch(`${API_ENDPOINTS.NewUsersStatusChange}${rowData.user_id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: statusCode })
            });

            const result = await response.json(); // Parse the response JSON

            if (result.message === 'User status updated successfully') {
                // Update the local state first
                const updatedUsers = users.map(user => {
                    if (user.id === rowData.user_id) {
                        user.status = e.value;
                    }
                    return user;
                });
                setUsers(updatedUsers);

                console.log('User status updated successfully');

                // Show success message using SweetAlert
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'User status updated successfully.',
                });

                // Remove the user from the list
                const filteredUsers = users.filter(user => user.id !== rowData.user_id);
                setUsers(filteredUsers);
            } else {
                throw new Error(result.message || 'Failed to update user status');
            }
        } catch (error) {
            console.error('Error updating user status:', error);
            // Show error message using SweetAlert
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to update user status.',
            });
        } finally {
            closeModal();
        }
    };

    // Example of handling approval and rejection directly
    const handleRejectUser = async () => {
        await onStatusChange({ value: 'reject' }, selectedUser);
    };

    const handleApproveUser = async () => {
        await onStatusChange({ value: 'approve' }, selectedUser);
    };

    return (
        <>
            <Toast ref={toast} style={{ zIndex: 99999 }} />

            {isModalOpen && (
                <ImageFullScreenModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    content={modalContent}
                    position={modalPosition}

                />
            )}
            <div className="modaldetails" style={{ display: 'block' }}>
                <div className="modaldetails-content">
                    <span className="close" onClick={closeModal}>&times;</span>

                    {/* Step Progress Bar */}
                    <div className="step-bar">
                        <p>Steps Completed: {completedSteps}/{totalSteps}</p>
                        <div className="step-bar-progress-wrapper">
                            <div
                                className="step-bar-progress"
                                style={{
                                    width: `${(completedSteps / totalSteps) * 100}%`,
                                    backgroundColor: barColor
                                }}
                            />
                        </div>
                    </div>

                    {notCompletedSteps.length > 0 && (
                        <>
                            <div className="not-completed-steps">
                                <p><strong>Incomplete Steps:</strong></p>
                                <ol>
                                    {notCompletedSteps.map((step, index) => (
                                        <li key={index} style={{ color: 'red' }}>
                                            {index + 1}. {step.label}
                                        </li>
                                    ))}
                                </ol>
                            </div>

                            {/* Other modal content... */}

                            {notCompletedSteps.length > 0 && hasWhatsAppNumber && (
                                <div className="whatsapp-message">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <h3><b>Send WhatsApp Message to User:</b></h3>
                                        <select style={{ marginBottom: '10px', backgroundColor: 'gray', padding: '3px', color: 'white', marginLeft: '20px' }} onChange={(e) => setLanguage(e.target.value)} value={language}>
                                            <option value="English">English</option>
                                            <option value="Sinhala">සිංහල</option>
                                            <option value="Tamil">தமிழ்</option>
                                        </select>
                                    </div>
                                    <textarea
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        placeholder="Enter your message"
                                        maxLength={255} // Limit input to 255 characters
                                        rows="4" // Adjust height as needed
                                    />

                                    <button onClick={handleSendMessage} disabled={loadingsendwhatsapp}>
                                        {loadingsendwhatsapp ? 'Sending...' : 'Send'}
                                    </button>
                                </div>
                            )}


                        </>
                    )}




                    <div className="modal-header">
                        <h2>User Details</h2>
                    </div>
                    <div className="modal-body">
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <img
                                id="img01"
                                src={selectedUser?.profilePic ? `${API_ENDPOINTS.Base_Url}${selectedUser.profilePic}` : 'fallback-image-url'}
                                alt=""
                                className="profile-pic"
                                style={{
                                    width: '100px', // Adjust width as needed
                                    height: '100px', // Adjust height as needed
                                    borderRadius: '50%', // Circular image
                                    border: !selectedUser?.profilePic ? '2px solid red' : 'none',
                                    backgroundColor: !selectedUser?.profilePic ? 'silver' : 'transparent',
                                    marginRight: '20px' // Space between image and buttons
                                }}
                                onError={(e) => {
                                    e.target.src = 'fallback-image-url';
                                    e.target.style.backgroundColor = 'silver';
                                }}
                                onClick={(e) => handleImageClick(e, `${API_ENDPOINTS.Base_Url}${selectedUser?.profilePic}`)}
                            />
                            <div style={{ marginTop: '5px' }}>
                                <button
                                    onClick={handleRejectUser}
                                    style={{ backgroundColor: 'red', color: 'white', marginLeft: '10px', padding: '5px 10px', borderRadius: '8px', fontSize: '14px' }}
                                >
                                    Reject User
                                </button>
                                {hasWhatsAppNumber && (
                                    <button
                                        onClick={handleApproveUser}
                                        style={{ backgroundColor: 'green', color: 'white', marginLeft: '10px', padding: '5px 10px', borderRadius: '8px', fontSize: '14px' }}
                                    >
                                        Approve User
                                    </button>
                                )}
                            </div>
                        </div>


                        <div id="userDetails" className="user-details">

                            <p style={isEmpty(selectedUser?.user_id) ? { color: 'red' } : {}}><strong>User ID:</strong> {selectedUser?.user_id || 'N/A'}</p>
                            <p style={isEmpty(selectedUser?.nic) ? { color: 'red' } : {}}><strong>NIC:</strong> {selectedUser?.nic || 'N/A'}</p>
                            <p><strong>Online:</strong> {selectedUser?.online ? 'Yes' : 'No'}</p>
                            <p style={
                                selectedUser?.status === 0
                                    ? { color: 'white' }
                                    : selectedUser?.status === 1
                                        ? { color: 'white' }
                                        : {}
                            }>
                                <strong>Status:</strong> {selectedUser?.status === 0 ? 'Pending' : selectedUser?.status === 1 ? 'Active' : 'N/A'}
                            </p>

                            <p><strong>Acount Created At:</strong> {selectedUser?.created_at ? new Date(selectedUser?.created_at).toLocaleString() : 'N/A'}</p>

                            <br></br>
                            <div class="card" >
                                <div className="step-header">
                                    <h2
                                        style={
                                            !selectedUser?.profilePic &&
                                                (selectedUser?.gender || selectedUser?.age || selectedUser?.interests)
                                                ? { color: 'orange', fontWeight: 'bold' }
                                                : selectedUser?.profilePic
                                                    ? { color: 'green', fontWeight: 'bold' }
                                                    : { color: 'red', fontWeight: 'bold' }
                                        }
                                    >
                                        Step 1 -
                                    </h2>
                                    <h4
                                        style={
                                            !selectedUser?.profilePic &&
                                                (selectedUser?.gender || selectedUser?.age || selectedUser?.interests)
                                                ? { color: 'orange' }
                                                : selectedUser?.profilePic
                                                    ? { color: 'green' }
                                                    : { color: 'red' }
                                        }
                                    >
                                        {!selectedUser?.profilePic &&
                                            (selectedUser?.gender || selectedUser?.age || selectedUser?.interests)
                                            ? 'Incomplete'
                                            : selectedUser?.profilePic
                                                ? 'completed'
                                                : 'not completed'}
                                    </h4>
                                </div>
                                {!selectedUser?.profilePic && (<p style={isEmpty(selectedUser?.profilePic) ? { color: 'red' } : {}}><strong>Profile pic:</strong> {'' || 'not uploaded'}</p>)}
                                <p style={isEmpty(selectedUser?.gender) ? { color: 'red' } : {}}><strong>Gender:</strong> {selectedUser?.gender || 'not selected'}</p>
                                <p style={isEmpty(selectedUser?.age) ? { color: 'red' } : {}}><strong>Age:</strong> {selectedUser?.age || 'not selected'}</p>
                                <p style={isEmpty(selectedUser?.interests) ? { color: 'red' } : {}}><strong>Interests:</strong> {formatInterests(selectedUser?.interests) || 'not selected'}</p>
                            </div>
                            <br></br>

                            <div class="card" >
                                <div className="step-header">
                                    <h2 style={selectedUser?.nicFrontImage ? { color: 'green', fontWeight: 'bold' } : { color: 'red', fontWeight: 'bold' }}>
                                        Step 2 -
                                    </h2>
                                    <h4 style={selectedUser?.nicFrontImage ? { color: 'green' } : { color: 'red' }}>
                                        {selectedUser?.nicFrontImage ? 'completed' : 'not completed'}
                                    </h4>
                                </div>
                                {!selectedUser?.nicFrontImage && (<p style={selectedUser?.nicFrontImage ? { color: 'green' } : { color: 'red' }}><strong>NIC Front Image:</strong> Not uploaded</p>)}
                                <div className="nic-images">
                                    {selectedUser?.nicFrontImage ? (
                                        <div>
                                            <p><strong>NIC Front Image:</strong></p>
                                            <img
                                                src={API_ENDPOINTS.Base_Url + selectedUser?.nicFrontImage}
                                                alt="NIC Front"
                                                className="nic-image"
                                                onClick={(e) => handleImageClick(e, `${API_ENDPOINTS.Base_Url}${selectedUser?.nicFrontImage}`)}
                                            />
                                        </div>
                                    ) : (
                                        '' // Message when NIC Front Image is not uploaded
                                    )}
                                    {selectedUser?.nicBackImage ? (
                                        <div>
                                            <p><strong>NIC Back Image:</strong></p>
                                            <img
                                                src={API_ENDPOINTS.Base_Url + selectedUser?.nicBackImage}
                                                alt="NIC Back"
                                                className="nic-image"
                                                onClick={(e) => handleImageClick(e, `${API_ENDPOINTS.Base_Url}${selectedUser?.nicBackImage}`)}
                                            />
                                        </div>
                                    ) : (
                                        ''
                                    )}
                                </div>
                            </div>

                            <br>
                            </br>
                            <div class="card" >
                                <div className="step-header">
                                    <h2 style={selectedUser?.terms_agree ? { color: 'green', fontWeight: 'bold' } : { color: 'red', fontWeight: 'bold' }}>
                                        Step 3 -
                                    </h2>
                                    <h4 style={selectedUser?.terms_agree ? { color: 'green' } : { color: 'red' }}>
                                        {selectedUser?.terms_agree ? 'completed' : 'not completed'}
                                    </h4>
                                </div>
                                <p style={isEmpty(selectedUser?.terms_agree) ? { color: 'red' } : {}}>
                                    <strong >Terms Agree:</strong>
                                    {selectedUser?.terms_agree ? ' Yes' : ' not agree'}
                                </p>
                            </div>
                            <br>
                            </br>

                            <div class="card" >
                                <div className="step-header">
                                    <h2 style={headingStyle}>Step 4 -</h2>
                                    <h4 style={headingStyle}>{hasNonEmptyWhatsAppNumber && !allFieldsEmpty ? 'completed' : 'not completed'}</h4>
                                </div>

                                <p style={isEmpty(selectedUser?.firstName) ? { color: 'red' } : {}}><strong>First Name:</strong> {selectedUser?.firstName || 'empty'}</p>
                                <p style={isEmpty(selectedUser?.lastName) ? { color: 'red' } : {}}><strong>Last Name:</strong> {selectedUser?.lastName || 'empty'}</p>
                                <p style={isEmpty(selectedUser?.whatsAppNumber) ? { color: 'red' } : {}}><strong>WhatsApp Number:</strong> {selectedUser?.whatsAppNumber || 'empty'}</p>
                                <p style={isEmpty(selectedUser?.job) ? { color: 'red' } : {}}><strong>Job:</strong> {selectedUser?.job || 'empty'}</p>
                                <p style={isEmpty(selectedUser?.location) ? { color: 'red' } : {}}><strong>Location:</strong> {selectedUser?.location || 'empty'}</p>
                                <p style={isEmpty(selectedUser?.marriageStatus) ? { color: 'red' } : {}}><strong>Marriage Status:</strong> {selectedUser?.marriageStatus || 'empty'}</p>
                                <p><strong>Height:</strong> {`${selectedUser?.heightFt || 'empty'}'${selectedUser?.heightIn || 'empty'}`}</p>
                                <p style={isEmpty(selectedUser?.weight) ? { color: 'red' } : {}}><strong>Weight:</strong> {selectedUser?.weight || 'empty'}</p>
                                <p style={isEmpty(selectedUser?.personalityDescription) ? { color: 'red' } : {}}><strong>Personality Description:</strong> {selectedUser?.personalityDescription || 'empty'}</p>
                                <p style={isEmpty(selectedUser?.alcoholConsumption) ? { color: 'red' } : {}}><strong>Alcohol Consumption:</strong> {selectedUser?.alcoholConsumption || 'empty'}</p>
                                <p style={isEmpty(selectedUser?.lookingFor) ? { color: 'red' } : {}}><strong>Looking For:</strong> {selectedUser?.lookingFor || 'empty'}</p>
                            </div>

                            <br>
                            </br>
                            <div class="card" >

                                <div className="step-header">
                                    <h2 style={
                                        selectedUser?.plan_name &&
                                            selectedUser?.packageDurationMonth &&
                                            selectedUser?.packageStartDate &&
                                            selectedUser?.packageEndDate &&
                                            selectedUser?.payment_date
                                            ? { color: 'green', fontWeight: 'bold' }
                                            : { color: 'red', fontWeight: 'bold' }
                                    }>
                                        Step 5 -
                                    </h2>
                                    <h4 style={
                                        selectedUser?.plan_name &&
                                            selectedUser?.packageDurationMonth &&
                                            selectedUser?.packageStartDate &&
                                            selectedUser?.packageEndDate &&
                                            selectedUser?.payment_date
                                            ? { color: 'green' }
                                            : { color: 'red' }
                                    }>
                                        {selectedUser?.plan_name &&
                                            selectedUser?.packageDurationMonth &&
                                            selectedUser?.packageStartDate &&
                                            selectedUser?.packageEndDate &&
                                            selectedUser?.payment_date
                                            ? 'completed'
                                            : 'not completed'}
                                    </h4>
                                </div>

                                <p><strong>Package Name:</strong> {selectedUser?.plan_name || 'N/A'}</p>
                                <p ><strong>Package Price:</strong> {selectedUser?.packagePrice || '0'}</p>
                                <p><strong>Package Duration:</strong> {`${selectedUser?.packageDurationMonth || 'N/A'} month(s)`}</p>
                                <p><strong>Package Start Date:</strong> {selectedUser?.packageStartDate ? new Date(selectedUser?.packageStartDate).toLocaleDateString() : 'N/A'}</p>
                                <p><strong>Package End Date:</strong> {selectedUser?.packageEndDate ? new Date(selectedUser?.packageEndDate).toLocaleDateString() : 'N/A'}</p>
                                <p><strong>Payment Date:</strong> {selectedUser?.payment_date ? new Date(selectedUser?.payment_date).toLocaleDateString() : 'N/A'}</p>
                                <p><strong>Payment Status:</strong> {selectedUser?.payment_status === 1 ? 'Paid' : 'Unpaid'}</p>
                            </div>
                            <br>
                            </br>
                            <div class="card" >

                                <div className="step-header">
                                    <h2
                                        style={
                                            isEmpty(selectedUser?.generatedKey)
                                                ? { color: 'red', fontWeight: 'bold' }
                                                : { color: 'green', fontWeight: 'bold' }
                                        }
                                    >
                                        Step 6
                                    </h2>
                                    <h4 style={selectedUser?.generatedKey ? { color: 'green' } : { color: 'red' }}>
                                        {selectedUser?.generatedKey ? 'completed' : 'not completed'}
                                    </h4>
                                </div>
                                <p
                                    style={
                                        isEmpty(selectedUser?.generatedKey)
                                            ? { color: 'red' }
                                            : { color: '' }
                                    }
                                >
                                    <strong>Generated Key:</strong> {selectedUser?.generatedKey || 'N/A'}
                                </p>

                            </div>
                            <br>
                            </br>



                            {selectedUser?.otherImages && JSON.parse(selectedUser.otherImages).length > 0 && (
                                <div className="other-images-section">
                                    <p><strong>Other Images:</strong></p>
                                    <div id="modalOtherImages" className="other-images">
                                        {JSON.parse(selectedUser.otherImages).map((image, index) => (
                                            <img
                                                key={index}
                                                src={`${API_ENDPOINTS.Base_Url}${image}`}
                                                alt={`${selectedUser.name} other ${index + 1}`}  // Updated alt text
                                                className="other-image"
                                                onClick={(e) => handleImageClick(e, `${API_ENDPOINTS.Base_Url}${image}`)}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default UserDetailsModal;

import React, { useState } from 'react';
import './UserDetailsModal.css';
import ImageFullScreenModal from '../../../../components/ImageFullCrean/ImageFullScreanModal'; // Import the fullscreen modal component

const UserDetailsModal = ({ modalVisible, selectedUser, closeModal, handleOpenModal, formatInterests, API_ENDPOINTS }) => {
    const [isModalOpen, setIsModalOpen] = useState(false); // State for fullscreen modal
    const [modalContent, setModalContent] = useState(''); // State for modal content
    const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 }); // State for modal position

   
    if (!modalVisible || !selectedUser) return null;

    const isEmpty = (value) => !value || value === '';  // Utility to check for empty fields

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

    return (
        <>
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
                )}




                <div className="modal-header">
                    <h2>User Details</h2>
                </div>
                <div className="modal-body">
                    <img
                        id="img01"
                        src={selectedUser?.profilePic ? API_ENDPOINTS.Base_Url + selectedUser?.profilePic : 'fallback-image-url'}
                        alt=""
                        className="profile-pic"
                        style={
                            !selectedUser?.profilePic
                                ? { border: '2px solid red', backgroundColor: 'silver' }
                                : {}
                        }
                        onError={(e) => {
                            e.target.src = 'fallback-image-url';
                            e.target.style.backgroundColor = 'silver';
                        }}
                        onClick={(e) => handleImageClick(e, `${API_ENDPOINTS.Base_Url}${selectedUser?.profilePic}`)}
                    />


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

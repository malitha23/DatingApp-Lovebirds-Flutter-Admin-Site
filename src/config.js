// src/config.js
  const API_BASE_URL = 'https://lovebird4u.com/api';
 // const API_BASE_URL = 'http://localhost:3000/api';

export const API_ENDPOINTS = {
  Base_Url: API_BASE_URL,
  LOGIN: `${API_BASE_URL}/user/login`,
  GETUSERDATA: `${API_BASE_URL}/user/getUser`,
  NewUsersFetch: `${API_BASE_URL}/admin/getAllNewUsers`,
  NewUsersStatusChange: `${API_BASE_URL}/admin/UpdateUserStatusForAdmin/`,
  NewUsersBulkStatusChange: `${API_BASE_URL}/admin/UpdateUserBulkStatusForAdmin`,
  NewUsersDetete: `${API_BASE_URL}/admin/deleteuser/`,
  getPendingPackagespayments: `${API_BASE_URL}/admin/pending-packages-payments`,
  getSubcriptionPackagesForPendingPackagesPayments: `${API_BASE_URL}/admin/getSubcriptionPackagesForPendingPackagesPayments`,
  approveOrrejectPendingPackagesPayments: `${API_BASE_URL}/admin/approveOrrejectPendingPackagesPayments`,
  sendmessagewhatsappwhatsappstatus: `${API_BASE_URL}/send-message-whatsapp/whatsapp-status`,
  sendmessagewhatsappsend: `${API_BASE_URL}/send-message-whatsapp/send`,
  getPendingHeartsPackagespayments: `${API_BASE_URL}/admin/pending-Heartspackages-payments`,
  getHearsPackagesForPendingPackagesPayments: `${API_BASE_URL}/admin/getHearsPackagesForPendingPackagesPayments`,
  approveOrRejectPendingHeartsPackagesPayments: `${API_BASE_URL}/admin/approveOrRejectPendingHeartsPackagesPayments`,
  // Add other endpoints here as needed
};

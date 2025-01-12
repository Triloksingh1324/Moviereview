import axios from 'axios';

const getUserDetail = async () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  try {
    const response = await axios.get(`${apiUrl}/api/users/current-user-details`, {
      withCredentials: true 
    });

    if (response.status === 200) {
      return response.data.data; // This will be the user object
    }
  } catch (error) {
    console.error('Error fetching user details:', error);
  }
};

export default getUserDetail;


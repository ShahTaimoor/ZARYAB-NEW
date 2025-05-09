import axios from "axios";

const loginUser = async (userData) => {
    try {
        const response = await axios.post(
            `${import.meta.env.VITE_API_URL}/login`,
            userData,
            {
                withCredentials: true,
                headers: { "Content-Type": "application/json" },
            }
        );
        localStorage.setItem('user', JSON.stringify(response.data.user));
        return response.data;
    } catch (error) {
        return error.response?.data || { success: false, message: 'Something went wrong' };
    }
};

const authService = { loginUser };
export default authService;

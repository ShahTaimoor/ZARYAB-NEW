import axios from 'axios'
import React, { useEffect, useState } from 'react'

const Users = () => {
    const [users, setUsers] = useState({})
    const getAllUsers = () => {
        axios
            .get(import.meta.env.VITE_API_URL + '/all-users', {
                withCredentials: true,
                headers: { "Content-Type": "application/json" }
            })
            .then((response) => {
                console.log(response);
                setUsers(response?.data)
            })
            .catch((error) => {
                console.log(error);

            })
    }
    useEffect(() => {
        getAllUsers()
    }, [])
    return (
        <div>
            <h1>{JSON.stringify(users)}</h1>
        </div>
    )
}

export default Users
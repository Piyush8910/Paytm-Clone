import axios from "axios";
import { useEffect, useState } from "react";

export const Balance = () => {

    const [balance, setBalance] = useState(0);
    const token = localStorage.getItem("token");

    useEffect(() => {
        axios.post("http://localhost:3000/api/v1/account/balance", {userId: token},{headers: {Authorization: `Bearer ${token}`,}})
        .then(response => {
            setBalance(response.data.balance)
        })
        .catch(error => {
            console.error(error);
        });
    }, []);

    return <div className="flex">
        <div className="font-bold text-lg">
            Your balance
        </div>
        <div className="font-semibold ml-4 text-lg">
            Rs {balance}
        </div>
    </div>
}
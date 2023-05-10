import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const OnlineStatus = () => {
    const [online, setOnline] = useState(navigator.onLine);

    useEffect(() => {
        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);
        return () => {
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);
        };
    }, []);

    const handleOnline = () => {
        setOnline(true);
        toast.success("You are now online!", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
        });
    };

    const handleOffline = () => {
        setOnline(false);
        // toast.error("You are offline.", {
        //     position: "top-right",
        //     autoClose: false,
        //     hideProgressBar: true,
        //     closeOnClick: true,
        //     pauseOnHover: false,
        //     draggable: true,
        // });
    };

    return (
        <div>
            {online ? (
                <span></span>
            ) : (
                toast.error("You are offline.", {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: true,
                })
            )}
        </div>
    );
};

export default OnlineStatus;

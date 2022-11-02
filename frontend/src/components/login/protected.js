import { Navigate } from "react-router-dom";
import checkToken from "./validate";
import {useState} from "react";
import axios from "axios";

const Protected = ({children, redirectTo }) => {
    const [isAuth, setAuth] = useState(null);

    const logIn = () => {
        setAuth(true);
    };
    const logOut = () => {
        setAuth(false);
    };
    let temp_token = localStorage.getItem('access_token');
    axios.defaults.headers.post['Authorization'] = 'Bearer '+temp_token;
    axios.defaults.headers.get['Authorization'] = 'Bearer '+temp_token;

    checkToken()
        .then( data => {
            if(data === "Invalid") {
                console.log(data)
                localStorage.removeItem("access_token")
                console.log("[*] Setting Login = False")
                logOut()
            } else {
                console.log("[*] Setting Login = True")
                logIn()
            }
        })
    if (isAuth === false) {
        console.log("[*] Not Logged In - Redirecting to Authenticate")
        return <Navigate to={redirectTo} />;
    } else if (isAuth === true) {
        console.log("[*] Logged In - Passing Child")
        return children;
    }
};
export default Protected;
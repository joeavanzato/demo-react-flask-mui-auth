import { useSpring, animated } from '@react-spring/web'
import { useState } from 'react';
import axios from "axios";
import {Navigate} from "react-router-dom";
import { MagnifyingGlass } from "react-loader-spinner";
import * as Constants from '../../Constants'

export default function Auth() {

    const [isAuth, setAuth] = useState(null);
    const [isLoading, SetLoading] = useState( false);

    const logIn = () => {
        setAuth(true);
    };
    const logOut = () => {
        setAuth(false);
    };
    const springs = useSpring({
        from: { y: 1000 },
        to: { y: 0 },
    })
    const [loginForm, setloginForm] = useState({
        email: "",
        password: ""
    })

    function logMeIn(event) {
        SetLoading(true);
        axios({
            method: "POST",
            url:Constants.API_URL+"/api/login",
            data:{
                email: loginForm.email,
                password: loginForm.password
            },
            mode: 'cors',
            headers: {'Content-Type': 'application/json'},
        })
            .then((response) => {
                console.log("[*] Login Response Done")
                if (response.data.msg === "Successfully Authenticated") {
                    SetLoading(false);
                    console.log("[*] Successfully Authenticated")
                    const temp_token = response.data.access_token
                    localStorage.setItem('access_token', temp_token);
                    axios.defaults.headers.post['Authorization'] = 'Bearer '+temp_token;
                    axios.defaults.headers.get['Authorization'] = 'Bearer '+temp_token;
                    logIn()
                }
            }).catch((error) => {
            if (error.response) {
                SetLoading(false);
                logOut()
                console.log(error.response)
                console.log(error.response.status)
                console.log(error.response.headers)
            }
        })

        setloginForm(({
            email: "",
            password: ""}))

        event.preventDefault()
    }

    function handleChange(event) {
        const {value, name} = event.target
        setloginForm(prevNote => ({
            ...prevNote, [name]: value})
        )}

    if (isAuth === true) {
        console.log("[*] Logged In - Going Home")
        return <Navigate to='/' />;
    }

    return(
        <animated.div className="Auth-form-container" style={{...springs,}}>
            <form className="Auth-form">
                <div className="Auth-form-content">
                    <h3 className="Auth-form-title">Login</h3>
                    <div className="form-group mt-3">
                        <label>Email</label>
                        <input
                            onChange={handleChange}
                            name="email"
                            type="email"
                            className="form-control mt-1"
                            placeholder="Enter email"
                            text={loginForm.email}
                            value={loginForm.email}
                        />
                    </div>
                    <div className="form-group mt-3">
                        <label>Password</label>
                        <input
                            onChange={handleChange}
                            name="password"
                            type="password"
                            className="form-control mt-1"
                            placeholder="Enter password"
                            text={loginForm.password}
                            value={loginForm.password}
                        />
                    </div>
                    <animated.div className="d-grid gap-2 mt-3">
                        <div className="login_spinner">
                            {isLoading ? <MagnifyingGlass width="60" height="60"/> : <p></p>}
                        </div>
                        <button type="submit" className="btn btn-primary" onClick={logMeIn}>
                            Submit
                        </button>
                    </animated.div>
                </div>
            </form>
        </animated.div>
    )
}
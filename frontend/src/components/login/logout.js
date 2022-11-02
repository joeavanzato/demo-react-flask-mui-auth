import axios from "axios";
import * as Constants from '../../Constants'
import {useState} from "react";
import {RotatingTriangles} from "react-loader-spinner";



const Logout = () => {
    const [isLoading, SetLoading] = useState( true);

    const LogoutRun = () => {
        return axios({
            url: Constants.API_URL+"/api/logout",
            method: 'get',
            timeout: 8000,
        })
            .then(res => {
                console.log("User Logged Out")
                SetLoading(false)
            })
            .catch (err => {
                console.error(err)
                console.log("Failure Logging Out - Probably Already Logged Out")
                SetLoading(false)
            })
    };
    LogoutRun()

    const StillLoading = () => {
        return (
            <RotatingTriangles width="60" height="60"/>
        )
    }
    const DoneLoading = () => {
        return (
            <p>Logged Out!</p>
        )
    }

    return (
        <div className="Logout">
            <div className="logout_spinner">
                {isLoading ? <StillLoading/> : <DoneLoading/>}
            </div>
        </div>
    )
}

export default Logout
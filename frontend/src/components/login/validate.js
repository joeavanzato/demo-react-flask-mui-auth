import axios from "axios";

function checkToken() {
    /* Check Current Bearer Token for Validity */
    console.log("[*] Validating LocalStorage Token...")
    return axios({
        url: 'http://127.0.0.1:5000/api/validate',
        method: 'get',
        timeout: 8000,
    })
        .then(res => {
            return "Valid"
        })
        .catch (err => {
            console.error(err)
            console.log(err.response.data.msg)
            return "Invalid"
        })
};

export default checkToken
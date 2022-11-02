import * as Constants from '../../Constants'
import axios from "axios";

export const GetAllDemos = () => {
    return axios({
        url: Constants.API_URL+'/api/demos',
        method: 'get',
        timeout: 8000,
    })
        .then(res => {
            let data = JSON.parse(res.data)
            return data;
        })
        .catch (err => {
            console.error(err)
            console.log(err.response.data.msg)
            return null
        })
};

export const AddNewScan = () => {


}

export const EditScan = () => {


}
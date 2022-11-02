
import {useNavigate} from "react-router-dom";

const Error404 =  () => {
    const navigate = useNavigate();

    function goHome(event) {
        navigate('/');
    }

    return (
        <div className="Auth-form-container">
            <form className="Auth-form">
                <div className="Auth-form-content">
                    <h3 className="Auth-form-title">404 - Page Not Found!</h3>
                    <div className="d-grid gap-2 mt-3">
                        <button type="submit" className="btn btn-primary" onClick={goHome}>
                            Go Home!
                        </button>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default Error404;
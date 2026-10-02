import { useNavigate } from "react-router-dom"

const NoMatch = () => {

    const navigate = useNavigate();

    const handleGoBack = () => {

        navigate('/');

    }

    return (
        <div className="container col-lg-6 col-md-6 col-10 mt-5">
            <div className="text-center text-danger font-weight-bold error404">
                <p>404 NOT FOUND :(</p>
                <button type="button" className="btn btn-danger btn-lg btn-block " onClick={() => handleGoBack()}>Get back to the Portal</button>
            </div>
        </div>

    )
}

export default NoMatch

//404 NOT FOUND
import StudentNavBar from "../compoents/StudentNavBar"
import { ProtectRoute } from "../manageRoutes/ProtectRoutes"

const UpdateBatch = () => {
    return (
        <ProtectRoute>
            <StudentNavBar/>
            <div className="container-fluid">
                
            </div>
        </ProtectRoute>
    )
}

export default UpdateBatch
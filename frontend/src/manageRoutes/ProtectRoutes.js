import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/store";
import { useEffect } from "react";

export const AuthorizeUser = ({ children }) => {
    const userData = localStorage.getItem('user');

    if (!userData) {
        return <Navigate to={'/'} replace={true}></Navigate>
    }
    return children;
}

export const ProtectRoute = ({ children }) => {
    const user = useAuthStore.getState().user;
    if (!user) {
        return <Navigate to={'/'} replace={true}></Navigate>
    }
    if (user && user?.role === 1) {
        return <><Navigate to={'/teacher-dashboard'} replace={true}>{children}</Navigate></>
    }

    if (user && user?.role === 2) {
        return <><Navigate to={'/admin-dashboard'} replace={true}>{children}</Navigate></>
    }

    if (user && user?.role === 0) {
        return <><Navigate to={'/student-dashboard'} replace={true}>{children}</Navigate></>
    } else {
        return children;
    }
}

export const ProtectTeacherRoute = ({ children }) => {
    const user = useAuthStore.getState().user;

    if (user?.role === 2 || user?.role === 0 || !user) {
        return <Navigate to={'/'} replace={true}>{children}</Navigate>
    } else {
        return children
    }
}

export const ProtectStudentRoute = ({ children }) => {
    const user = useAuthStore.getState().user;
    if (user?.role === 2 || user?.role === 1 || !user) {
        return <Navigate to={'/'} replace={true}>{children}</Navigate>
    } else {
        return children
    }
}

export const ProtectAdminRoute = ({ children }) => {
    const user = useAuthStore.getState().user;

    if (user?.role === 0 || user?.role === 1 || !user) {
        return <Navigate to={'/'} replace={true}>{children}</Navigate>
    } else {
        return children
    }
}

export const SetStateProvider = ({ children }) => {
    const setLocalUser = useAuthStore(state => state.setUserFromLocalStorage)
    setLocalUser();

    return children
}

export const PreventAuthFlow = ({ children }) => {
    const user = useAuthStore.getState().user;

    if (user && user?.role === 1) {
        return <Navigate to={'/teacher-dashboard'} replace={true}>{children}</Navigate>
    }

    if (user && user?.role === 2) {
        return <Navigate to={'/admin-dashboard'} replace={true}>{children}</Navigate>
    }

    if (user && user?.role === 0) {
        return <Navigate to={'/student-dashboard'} replace={true}>{children}</Navigate>
    } else {
        return children
    }
}

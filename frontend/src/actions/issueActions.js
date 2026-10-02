import { ENDPOINT_URL } from "../constants/constant";

export const createIssue = (data) => {
    return fetch(`${ENDPOINT_URL}/create-issue`, {
        method: "POST",
        headers: {
            Accept: 'application/json',
            'Content-type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .catch(err => console.log(err))
}

export const getAllIssues = () => {
    return fetch(`${ENDPOINT_URL}/get-issues`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        }
    })
        .then((response) => response.json())
        .catch(err => console.log(console.log(err)))
    }
import React, { useState, useEffect } from "react";


export function Home() {
    const STRAVA_BASE_URL = "https://www.strava.com/api/v3/";
    const AUTH_URL = "https://www.strava.com/oauth/token";
    const [activities, setActivities] = useState([]);

    async function getActivities(res) {
        const result = await fetch(`${STRAVA_BASE_URL}athlete/activities?access_token=${res.access_token}`)
            .then(res => res.ok ? res : Promise.reject(res))
            .then(res => res.json());
        return result;
    }

    async function reAuthorise() {
        const result = await fetch(AUTH_URL, {
            method: 'post',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                client_id: '68191',
                client_secret: 'a142d811b549cae6838fe41a58728fd4f0af4ea5',
                refresh_token: 'cf5a60fde96cf1512627dc2580b35b6ec0786fd3',
                grant_type: 'refresh_token'
            })
        })
            .then(res => res.json())
            .then(res => getActivities(res))
        return result;
    }

    useEffect(() => {
        reAuthorise()
            .then(images => setActivities(images));
    }, []);

    const activitiesCard = activities.map((activity, k) => <li key={k}>{activity.name}</li>);

    return (
        <div>
            <div>Homepage</div>
            <ul>
                {activitiesCard}
            </ul>
        </div>
    )
}

// https://www.strava.com/api/v3/athlete/activities?access_token=5c1c112aee3aea1b8d401c8bcee898440decdc11
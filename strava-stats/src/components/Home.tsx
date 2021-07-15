import L from "leaflet";
import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import ".././styles/Home.css";

interface Athlete {
    id: number;
    username: string;
    resource_state: number;
    firstname: string;
    lastname: string;
    bio: string;
    city: string;
    state: string;
    country: string;
    sex: string;
    premium: boolean;
    summit: boolean;
    created_at: Date;
    updated_at: Date;
    badge_type_id: number;
    weight: number;
    profile_medium: string;
    profile: string;
    friend: null;
    follower: null
}

interface Authorise {
    token_type: string;
    expires_at: number;
    expires_in: number;
    refresh_token: string;
    access_token: string;
    athlete: Athlete
}

interface Activity {
    name: string;
}

export function Home() {
    const STRAVA_BASE_URL = "https://www.strava.com/api/v3/";
    const AUTH_URL = "https://www.strava.com/oauth/token";
    const [activities, setActivities] = useState([]);

    async function getActivities(res: Authorise) {
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

    const activitiesCard = activities.map((activity: Activity, k) => <li key={k}>{activity.name}</li>);
    //let mymap = L.map('mapid').setView([51.505, -0.09], 13);

    return (
        <div>
            <div>Homepage</div>
            <div id="mapid">
                <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={true}>
                    <TileLayer
                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={[51.505, -0.09]}>
                        <Popup>
                            A pretty CSS3 popup. <br /> Easily customizable.
                        </Popup>
                    </Marker>
                </MapContainer>
            </div>
            <ul>
                {activitiesCard}
            </ul>
        </div>
    )
}

// https://www.strava.com/api/v3/athlete/activities?access_token=5c1c112aee3aea1b8d401c8bcee898440decdc11
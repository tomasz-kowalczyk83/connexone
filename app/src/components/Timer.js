import React, { useState, useEffect } from 'react'
import axios from 'axios'

const Timer = () => {
    const [serverTime, setServerTime] = React.useState(null)
    const [clientTime, setClientTime] = React.useState(Date.now())
    const [difference, setDifference] = React.useState(0)
    const [loading, setLoading] = React.useState(0)
    let [tick, setTick] = React.useState(0)
    

    useEffect(() => {
        const interval = setInterval(() => {
            return setTick(tick++)
        }, 1000);
    }, [])

    useEffect(() => {      
        if(!(tick % 30)) {
            setLoading(1)
            axios.get(process.env.REACT_APP_API_URL + '/time', {
                headers: {
                    authorization: 'mysecrettoken'
                }
            })
            .then(resp => {
                setServerTime(resp.data.epoch * 1000)
            })
            .finally(() => {
                setLoading(0)
            })
        } 
        setClientTime(Date.now())
        if(serverTime)
            setDifference(clientTime - serverTime)
        
    }, [tick])

    const formatTime = (timestamp) => {
        return timestamp ? new Date(timestamp).toLocaleTimeString() : ''
    }

    const formatDiff = (diff) => {
        //
        const cap = Math.max(0, diff)
        const hh = Math.floor(cap / 1000 / 60 / 60).toString().padStart(2, '0');
        const mm = Math.floor(cap / 1000 / 60).toString().padStart(2, '0');
        const ss = Math.floor(cap / 1000).toString().padStart(2, '0');

        return `${hh}:${mm}:${ss}`
    }

    return (
        <div
            className={`timer ${loading ? 'loading' : ''}`}
        >
            <p>last server time: {formatTime(serverTime)}</p>
            <p>client time: {formatTime(clientTime)}</p>
            <p>difference: {formatDiff(difference)}</p>
        </div>
    )
}

export default Timer
import React, { useState, useEffect } from 'react'
import axios from 'axios'

const Timer = (props) => {
    const [serverTime, setServerTime] = React.useState(0)
    const [clientTime, setClientTime] = React.useState(Date.now())
    const [difference, setDifference] = React.useState(0)
    let [tick, setTick] = React.useState(0)
    

    useEffect(() => {
        const interval = setInterval(() => {
            return setTick(tick++)
        }, 1000);
    }, [])

    useEffect(() => {
        console.log('update from tick', tick)
        
        if(!(tick % 30)) {
            console.log('should update server time')
            axios.get(process.env.REACT_APP_API_URL + '/time', {
                headers: {
                    authorization: 'mysecrettoken'
                }
            })
            .then(resp => {
                console.log('setting server time', resp.data.epoch)
                setServerTime(resp.data.epoch * 1000)
            })
        }
        setClientTime(Date.now())
        setDifference(clientTime - serverTime)
    }, [tick])

    const formatTime = (timestamp) => {
        const date = new Date(timestamp)

        return date.toLocaleTimeString()
    }

    const formatDiff = (diff) => {
        const hh = Math.floor(diff / 1000 / 60 / 60).toString().padStart(2, '0');
        const mm = Math.floor(diff / 1000 / 60).toString().padStart(2, '0');
        const ss = Math.floor(diff / 1000).toString().padStart(2, '0');

        return `${hh}:${mm}:${ss}`
    }

    return (
        <div>
            <p>last server time: {formatTime(serverTime)}</p>
            <p>client time: {formatTime(clientTime)}</p>
            <p>difference: {formatDiff(difference)}</p>
        </div>
    )
}

export default Timer
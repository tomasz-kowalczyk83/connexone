import React, { useState, useEffect } from 'react'
import axios from 'axios'

const Metrics = () => {
    const [metrics, setMetrics] = React.useState(0)
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
            axios.get(process.env.REACT_APP_API_URL + '/metrics', {
                headers: {
                    authorization: 'mysecrettoken'
                }
            })
            .then(resp => {
                setMetrics(resp.data)
                setLoading(0)
            })
        }
    }, [tick])

    return (
        <div
            className={`metrics ${loading ? 'loading' : ''}`}
        >
            <pre>
                { metrics }
            </pre>
        </div>
    )
}

export default Metrics
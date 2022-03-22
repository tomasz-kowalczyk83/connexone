const Timer = (props) => {
    const [time, setTime] = React.useState(0)

    return (
        <div>
            <p>last server time: {time}</p>
        </div>
    )
}
import React from 'react';

function TimestampConverter({ timestamp }) {
    const date = new Date(timestamp * 1000); // Convert the timestamp to milliseconds

    const formattedTime = date.toLocaleTimeString();
    const formatted = formattedTime.slice(0,5)
    return <div>{formatted}</div>;
}

export { TimestampConverter };
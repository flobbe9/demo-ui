import React, { useEffect, useState } from "react";


let countGlobal;


export function getCountGlobal(): number {

    return countGlobal;
}


export function setCountGlobal(newCountGlobal: number): void {

    countGlobal = newCountGlobal;
}


export default function Test(props) {

    const [count, setCount] = useState(0);

    useEffect(() => {
        countGlobal = count;
    }, [count])

    return (
        <div>
            <button onClick={() => alert(count)}>Test</button>
            <button onClick={() => alert(countGlobal)}>TestGlobal</button>
            <button onClick={() => setCount(count + 1)}>Increase</button>
        </div>
    );
}
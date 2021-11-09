import loaderImage from "../images/Loader.gif";
import React from "react";

function Loader() {
    return <div className="loader-wrapper">
        <div style={{
            background: `url(${loaderImage}) center center no-repeat`,
            width: 250,
            height: 150
        }}/>
        <span className="loading-word">Loading...</span>
    </div>
}

export default Loader

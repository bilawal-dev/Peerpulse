import React from "react";

const PreLoader = () => {
    return (
        <div
            style={{
                width: "100vw",
                height: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: "#fff",
            }}
        >
            <style>{`
        .wrapper {
          width: 150px; /* Reduced width from 200px to 150px */
          height: 60px;
          position: relative;
          z-index: 1;
        }

        .circle {
          width: 20px;
          height: 20px;
          position: absolute;
          border-radius: 50%;
          background-color: #E63946; /* red circles */
          transform-origin: 50%;
          animation: circle7124 0.5s alternate infinite ease;
        }

        /* Keyframes for the bounce effect */
        @keyframes circle7124 {
          0% {
            top: 60px;
            height: 5px;
            border-radius: 50px 50px 25px 25px;
            transform: scaleX(1.7);
          }
          40% {
            height: 20px;
            border-radius: 50%;
            transform: scaleX(1);
          }
          100% {
            top: 0%;
          }
        }

        /* Circle positions — moved closer together */
        .circle:nth-child(1) {
          left: 20%; /* was 15% */
        }
        .circle:nth-child(2) {
          left: 45%; /* was 45%, kept the same or adjust as you like */
          animation-delay: 0.2s;
        }
        .circle:nth-child(3) {
          left: auto;
          right: 20%; /* was 15% */
          animation-delay: 0.3s;
        }
      `}</style>

            {/* Loader Markup */}
            <div className="wrapper">
                <div className="circle"></div>
                <div className="circle"></div>
                <div className="circle"></div>
                <div className="shadow"></div>
                <div className="shadow"></div>
                <div className="shadow"></div>
            </div>
        </div>
    );
};

export default PreLoader;

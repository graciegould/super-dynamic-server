import React, { useEffect, useState } from "react";

// REACT APP EXAMPLE
function App() {
  const [clouds, setClouds] = useState([]);
  useEffect(() => {
    const initialClouds = Array.from({ length: 10 }).map((_, index) => {
      const cloudWidth = window.innerWidth * 0.2;
      const cloudHeight = window.innerHeight * 0.2;
      return {
        id: index,
        left: `${Math.random() * (100 - (cloudWidth / window.innerWidth) * 100)}%`,
        top: `${Math.random() * (100 - (cloudHeight / window.innerHeight) * 100)}%`,
      };
    });
    setClouds(initialClouds);
  }, []);

  return (
    <div className="app">
      <div className="super-dynamic-container">
        <div className="super-dynamic-info">
          WELCOME TO THE SUPER DYNAMIC APP!
        </div>
        <div className="clouds">
          {clouds.map((cloud) => (
            <img
              key={cloud.id}
              src="images/cloud.png"
              className="cloud-img"
              style={{
                left: cloud.left,
                top: cloud.top,
              }}
              alt="cloud"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;

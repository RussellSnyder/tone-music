import React from "react";
import ReactDOM from "react-dom";

import FlyingHigh from "./components/compositions/FlyingHigh"

const introMusic = new FlyingHigh();
introMusic.init();
// introMusic.play();


const App = () => {
  return (
    <div>
      <p>Interface stuff coming soon</p>
    </div>
  );
};

export default App;
ReactDOM.render(<App />, document.getElementById("app"));

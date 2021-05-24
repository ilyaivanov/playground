import "../src3/normalize";
import Clock from "./Clock";
// import Clock from "./DigitalWatch";

const clock = new Clock();

document.body.appendChild(clock.el);

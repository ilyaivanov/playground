import { ClassName, dom, style, css } from "../src3/browser";

class AnalogClock {
  private minutesArrow = dom.div({ className: "arrow" as ClassName });
  private secondsArrow = dom.div({ className: "arrow" as ClassName });
  el = dom.div({
    className: "circle" as ClassName,
    children: [this.secondsArrow, this.minutesArrow],
  });
  setTime = (minutes: number, seconds: number) => {
    const minutesRotation = (minutes - 15) * (360 / 60);
    const secondsRotation = (seconds - 15) * (360 / 60);
    this.minutesArrow.style.transform = `rotateZ(${minutesRotation}deg)`;
    this.secondsArrow.style.transform = `rotateZ(${secondsRotation}deg)`;
  };
}

class ClockDigit {
  private clock1 = new AnalogClock();
  private clock2 = new AnalogClock();
  private clock3 = new AnalogClock();
  private clock4 = new AnalogClock();
  private clock5 = new AnalogClock();
  private clock6 = new AnalogClock();

  el = dom.div({
    className: "clocks-container" as ClassName,
    children: [
      this.clock1.el,
      this.clock2.el,
      this.clock3.el,
      this.clock4.el,
      this.clock5.el,
      this.clock6.el,
    ],
  });
  inactive = { m: 36, s: 36 };

  private digitToClockPositions = [
    [
      { m: 30, s: 15 },
      { m: 45, s: 30 },
      { m: 30, s: 0 },
      { m: 30, s: 0 },
      { m: 0, s: 15 },
      { m: 45, s: 0 },
    ],
    [
      this.inactive,
      { m: 30, s: 30 },
      this.inactive,
      { m: 30, s: 0 },
      this.inactive,
      { m: 0, s: 0 },
    ],
    [
      { m: 15, s: 15 },
      { m: 45, s: 30 },
      { m: 30, s: 15 },
      { m: 45, s: 0 },
      { m: 0, s: 15 },
      { m: 45, s: 45 },
    ],
    [
      { m: 15, s: 15 },
      { m: 45, s: 30 },
      { m: 15, s: 15 },
      { m: 45, s: 0 },
      { m: 15, s: 15 },
      { m: 0, s: 45 },
    ],
    [
      { m: 30, s: 30 },
      { m: 30, s: 30 },
      { m: 0, s: 15 },
      { m: 45, s: 0 },
      this.inactive,
      { m: 0, s: 0 },
    ],
    [
      { m: 15, s: 30 },
      { m: 45, s: 45 },
      { m: 0, s: 15 },
      { m: 45, s: 30 },
      { m: 15, s: 15 },
      { m: 0, s: 45 },
    ],
    [
      { m: 15, s: 30 },
      { m: 45, s: 45 },
      { m: 0, s: 15 },
      { m: 45, s: 30 },
      { m: 0, s: 15 },
      { m: 0, s: 45 },
    ],
    [
      { m: 15, s: 15 },
      { m: 45, s: 30 },
      this.inactive,
      { m: 30, s: 0 },
      this.inactive,
      { m: 0, s: 0 },
    ],
    [
      { m: 15, s: 30 },
      { m: 45, s: 30 },
      { m: 0, s: 15 },
      { m: 45, s: 30 },
      { m: 0, s: 15 },
      { m: 0, s: 45 },
    ],
    [
      { m: 15, s: 30 },
      { m: 45, s: 30 },
      { m: 0, s: 15 },
      { m: 0, s: 30 },
      { m: 15, s: 15 },
      { m: 0, s: 45 },
    ],
  ];

  private getAllClocks = () => [
    this.clock1,
    this.clock2,
    this.clock3,
    this.clock4,
    this.clock5,
    this.clock6,
  ];

  private setClocksTo = (configurations: { m: number; s: number }[]) => {
    this.getAllClocks().forEach((clock, index) => {
      const { m, s } = configurations[index];
      clock.setTime(m, s);
    });
  };

  setDigit = (digit: number) => {
    this.setClocksTo(this.digitToClockPositions[digit]);
  };

  reset = () => {
    const times = Array.from(new Array(6)).map(() => this.inactive);
    this.setClocksTo(times);
  };
}

class TwoClockDigits {
  left = new ClockDigit();
  right = new ClockDigit();

  el = () => dom.fragment([this.left.el, this.right.el]);

  setTime = (time: number) => {
    this.left.setDigit(Math.floor(time / 10));
    this.right.setDigit(time % 10);
  };

  reset = () => {
    this.left.reset();
    this.right.reset();
  };
}

class DigitalWatch {
  minutes = new TwoClockDigits();
  seconds = new TwoClockDigits();

  el = dom.div({
    className: "page",
    children: [this.minutes.el(), this.seconds.el()],
  });

  constructor() {
    this.minutes.reset();
    this.seconds.reset();
    requestAnimationFrame(this.tick);
  }

  s = 0;
  m = 0;
  tick = () => {
    const time = new Date();
    if (this.s != time.getSeconds()) {
      this.s = time.getSeconds();
      this.seconds.setTime(this.s);
    }
    if (this.m != time.getMinutes()) {
      this.m = time.getMinutes();
      this.minutes.setTime(this.m);
    }
    requestAnimationFrame(this.tick);
  };
}

style.class("page", {
  height: "100vh",
  width: "100vw",
  backgroundColor: "#0E100F",
  paddingTop: "calc(50vh - 100px)",
  paddingLeft: `calc(50vw - ${46 * 4}px)`,
  boxSizing: "border-box",
  display: "flex",
  flexDirection: "row",
});

style.class("clocks-container" as ClassName, {
  width: 46 * 2,
  height: 46 * 3,
});

style.class("circle" as ClassName, {
  display: "inline-block",
  position: "relative",
  width: 46,
  height: 46,
  borderRadius: 46,
  boxShadow: "-3px 2px 4px -1px black inset, 4px 2.5px 2px -3.5px white inset",
});

style.class("arrow" as ClassName, {
  position: "absolute",
  height: 4,
  width: 22,
  top: 21,
  left: 21,
  backgroundColor: "white",
  borderBottomLeftRadius: 2,
  borderTopLeftRadius: 2,
  boxShadow: "0px 0px 8px 5px rgba(255,255,255,0.1)",
  transformOrigin: "2px 2px",
  transition: css.transition({ transform: 600 }),
});

export default DigitalWatch;

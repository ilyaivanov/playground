import { dom, style, ClassName, css } from "../src3/browser";
import "../src3/normalize";

const numbers = (from: number, to: number) =>
  Array.from(new Array(to - from + 1)).map((ignored, index) => from + index);

class Column {
  el: HTMLElement;
  digits: Element[];
  currentDigit: number | undefined;
  focusCircle = dom.div({ className: "focus-circle" as ClassName });
  constructor(lastDigit: number) {
    this.digits = numbers(0, lastDigit).map(this.digit);
    this.el = this.box(this.digits);
    this.el.style.height = (lastDigit + 1) * COL_WIDTH + "px";
  }

  highlightDigit = (digit: number) => {
    if (digit === this.currentDigit) return;

    if (typeof this.currentDigit === "undefined") {
      this.focusCircle.style.top = digit * COL_WIDTH - FOCUS_PADDING + "px";
      this.el.appendChild(this.focusCircle);
    } else {
      this.focusCircle
        .animate([{ opacity: 1 }, { opacity: 0 }], {
          duration: TRANSITION_TIME / 3,
        })
        .addEventListener("finish", () => {
          this.focusCircle.style.top = digit * COL_WIDTH - FOCUS_PADDING + "px";
          this.focusCircle.animate([{ opacity: 0 }, { opacity: 1 }], {
            duration: TRANSITION_TIME / 2,
          });
        });
    }

    if (typeof this.currentDigit !== "undefined")
      this.digits[this.currentDigit].classList.remove("digit-highlighted");

    this.currentDigit = digit;
    this.digits[this.currentDigit].classList.add("digit-highlighted");
    this.el.style.transform = `translate3d(0, -${digit * COL_WIDTH}px, 0)`;
  };

  private digit = (val: number) =>
    dom.div({ className: "digit" as ClassName, children: [val + ""] });

  private box = (children: Element[]) =>
    dom.div({
      className: "column" as ClassName,
      children: [
        dom.div({ className: "column-content" as ClassName, children }),
      ],
    });
}

type ColGroup = {
  left: Column;
  right: Column;
  time: number;
};
class Clock {
  el = dom.div({ className: "page" });

  seconds: ColGroup;
  minutes: ColGroup;
  hours: ColGroup;
  constructor() {
    this.seconds = { left: new Column(5), right: new Column(9), time: 0 };
    this.minutes = { left: new Column(5), right: new Column(9), time: 0 };
    this.hours = { left: new Column(2), right: new Column(9), time: 0 };

    this.setGroupLeftPositionGroup(this.seconds, 170);
    this.setGroupLeftPositionGroup(this.minutes, 0);
    this.setGroupLeftPositionGroup(this.hours, -170);

    this.appendGroup(this.seconds);
    this.appendGroup(this.minutes);
    this.appendGroup(this.hours);

    this.tick();
    requestAnimationFrame(this.tick);
  }

  appendGroup = (colGroup: ColGroup) => {
    this.el.appendChild(colGroup.left.el);
    this.el.appendChild(colGroup.right.el);
  };

  tick = () => {
    const time = new Date();
    if (this.seconds.time != time.getSeconds()) {
      this.seconds.time = time.getSeconds();
      this.updateTimeForGroup(this.seconds);
    }
    if (this.minutes.time != time.getMinutes()) {
      this.minutes.time = time.getMinutes();
      this.updateTimeForGroup(this.minutes);
    }
    if (this.hours.time != time.getHours()) {
      this.hours.time = time.getHours();
      this.updateTimeForGroup(this.hours);
    }
    requestAnimationFrame(this.tick);
  };

  setGroupLeftPositionGroup = (group: ColGroup, atX: number) => {
    const offset = COL_WIDTH / 2 + 12;
    group.left.el.style.left = `calc(100vw / 2 + ${atX}px - ${offset}px)`;
    group.right.el.style.left = `calc(100vw / 2 + ${atX}px + ${offset}px)`;
  };

  updateTimeForGroup = ({ left, right, time }: ColGroup) => {
    left.highlightDigit(Math.floor(time / 10));
    right.highlightDigit(time % 10);
  };
}

style.class("page", {
  height: "100vh",
  width: "100vw",
  background: "linear-gradient(-45deg, #585665 5%, #DEDADA 60%)",
});
const COL_WIDTH = 45;
const TRANSITION_TIME = 500;
style.class("column" as ClassName, {
  width: COL_WIDTH,
  backgroundColor: "#5F5F63",
  borderRadius: 6,
  position: "absolute",
  top: `calc(100vh / 2 - 100px)`,
  boxShadow: "5px 5px 20px 4px rgba(0,0,0,0.6), -5px -5px 15px 2px white",
  transition: css.transition({ transform: TRANSITION_TIME }),
});

style.class("column-content" as ClassName, {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  display: "flex",
  flexDirection: "column",
  zIndex: 1,
});

style.class("digit" as ClassName, {
  width: COL_WIDTH,
  height: COL_WIDTH,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  color: "white",
  transition: css.transition({
    fontSize: TRANSITION_TIME / 2,
    fontWeight: TRANSITION_TIME / 2,
  }),
});

style.class("digit-highlighted" as ClassName, {
  fontSize: 28,
  fontWeight: "bold",
});

const FOCUS_PADDING = 4;
style.class("focus-circle" as ClassName, {
  position: "absolute",
  top: 40 - FOCUS_PADDING,
  left: -FOCUS_PADDING,
  width: COL_WIDTH + FOCUS_PADDING * 2,
  height: COL_WIDTH + FOCUS_PADDING * 2,
  borderRadius: COL_WIDTH + FOCUS_PADDING * 2,
  backgroundColor: "rgba(0,0,0,0.3)",
  boxShadow:
    "4px 4px 20px rgba(0,0,0,0.3), -4px -3px 10px 2px rgba(255,255,255,0.5)",
});

style.tag("body", {
  fontFamily: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"`,
});

export default Clock;

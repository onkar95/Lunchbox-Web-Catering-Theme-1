import {fromUnixTime, format, addMinutes} from "date-fns";
import constants from "../constants";

const formatHour = (hour) => hour.substring(0, 5);

const toCivilianTime = (time) => {
  if (time) {
    let [hour, minute] = time.split(":");
    hour = parseInt(hour, 10);
    const suffix = hour >= 12 ? "PM" : "AM";
    return `${((hour + 11) % 12) + 1}:${minute} ${suffix}`;
  }
};

const toDayOfWeek = (number) => {
  const days = ["Sun", "Mon", "Tues", "Wed", "Thur", "Fri", "Sat", "Sun"];
  return days[number >= 0 ? number : 0];
};

const sortAndSplitHours = (obj) => {
  const splitBySequence = (items, differences) =>
    items.reduce(
      (memo, item) => {
        const lastArray = memo[memo.length - 1];
        const lastItem = lastArray[lastArray.length - 1];

        if (!lastItem || differences.includes(item - lastItem)) {
          lastArray.push(item);
        } else {
          memo.push([item]);
        }

        return memo;
      },
      [[]],
    );

  const getFlankDays = (k) => {
    if (k.length > 1) {
      return [toDayOfWeek(k[0]), toDayOfWeek(k[k.length - 1])].join("-");
    }
    return toDayOfWeek(k[0]);
  };

  const x = Object.entries(obj)
    .reduce((accu, i) => {
      const daysInSequence = splitBySequence(i[1], [1, -6]);
      return [
        ...accu,
        ...daysInSequence.map((x) => ({
          days: x,
          hours: i[0],
          order: x[0] ? x[0] : 7,
          text: getFlankDays(x),
        })),
      ];
    }, [])
    .sort((a, b) => a.order - b.order);
  return x;
};

const combineHours = (hours) => {
  const hoursObject = hours.reduce(
    (accu, i) => {
      if (!i.deliveryOpen && !i.deliveryClose) {
        accu.delivery.Closed = [...(accu.delivery.Closed || []), i.day];
      } else {
        const deliveryOpen = toCivilianTime(formatHour(i.deliveryOpen));
        const deliveryClose = toCivilianTime(formatHour(i.deliveryClose));
        if (accu.delivery[`${deliveryOpen} - ${deliveryClose}`]) {
          accu.delivery[`${deliveryOpen} - ${deliveryClose}`].push(i.day);
        } else {
          accu.delivery[`${deliveryOpen} - ${deliveryClose}`] = [i.day];
        }
      }

      if (!i.pickupOpen && !i.pickupClose) {
        accu.pickup.Closed = [...(accu.pickup.Closed || []), i.day];
      } else {
        const pickupOpen = toCivilianTime(formatHour(i.pickupOpen));
        const pickupClose = toCivilianTime(formatHour(i.pickupClose));
        if (accu.pickup[`${pickupOpen} - ${pickupClose}`]) {
          accu.pickup[`${pickupOpen} - ${pickupClose}`].push(i.day);
        } else {
          accu.pickup[`${pickupOpen} - ${pickupClose}`] = [i.day];
        }
      }

      if (!i.dineInOpen && !i.dineInClose) {
        accu.dineIn.Closed = [...(accu.dineIn.Closed || []), i.day];
      } else {
        const dineInOpen = toCivilianTime(formatHour(i.dineInOpen));
        const dineInClose = toCivilianTime(formatHour(i.dineInClose));
        if (accu.dineIn[`${dineInOpen} - ${dineInClose}`]) {
          accu.dineIn[`${dineInOpen} - ${dineInClose}`].push(i.day);
        } else {
          accu.dineIn[`${dineInOpen} - ${dineInClose}`] = [i.day];
        }
      }

      return accu;
    },
    {
      delivery: {},
      dineIn: {},
      pickup: {},
    },
  );

  return {
    delivery: sortAndSplitHours(hoursObject.delivery),
    dineIn: sortAndSplitHours(hoursObject.dineIn),
    pickup: sortAndSplitHours(hoursObject.pickup),
  };
};

const formatTime = (min) => {
  const hours = min ? Math.floor(min / 60) : 0;
  const minutes = min ? min % 60 : 0;
  const values = [];
  if (hours) {
    values.push(`${hours} hour${hours > 1 ? "s" : ""}`);
  }
  if (minutes) {
    values.push(`${minutes} minute${minutes > 1 ? "s" : ""}`);
  }
  return values.join(" and ");
};

const stdTimezoneOffset = () => {
  const baseDate = new Date();
  const jan = new Date(baseDate.getFullYear(), 0, 1);
  const jul = new Date(baseDate.getFullYear(), 6, 1);
  return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
};

const isDstObserved = new Date().getTimezoneOffset() < stdTimezoneOffset();

const mapTimeZone = (timeZone) => {
  const timeZoneMapping = isDstObserved
    ? constants.TIMEZONES_DST
    : constants.TIMEZONES;
  return timeZoneMapping[timeZone] || "";
};

const displayScheduledAtTime = (i) => {
  const timeStart = fromUnixTime(i);
  return format(timeStart, "h:mm a");
};

const displayScheduledAtTimeDelivery = (i) => {
  const timeStart = fromUnixTime(i);
  const timeEnd = addMinutes(timeStart, 15);
  return `${format(timeStart, "h:mm a")} - ${format(timeEnd, "h:mm a")}`;
};

export {
  formatHour,
  toCivilianTime,
  toDayOfWeek,
  combineHours,
  sortAndSplitHours,
  formatTime,
  stdTimezoneOffset,
  mapTimeZone,
  displayScheduledAtTime,
  displayScheduledAtTimeDelivery,
};

export default {
  combineHours,
  displayScheduledAtTime,
  displayScheduledAtTimeDelivery,
  formatHour,
  formatTime,
  mapTimeZone,
  sortAndSplitHours,
  stdTimezoneOffset,
  toCivilianTime,
  toDayOfWeek,
};

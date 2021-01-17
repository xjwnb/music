/*
 * @Author: your name
 * @Date: 2021-01-11 14:57:00
 * @LastEditTime: 2021-01-17 20:38:57
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \music\src\utils\numberformat\index.ts
 */

/**
  * 120000 -> 12万; 1200000000 -> 12亿 
  * @param num 数字
  * @returns 格式化后的字符串
  */
export function numberFormat(num: number): string {
  let numStr = (num as number).toString();
  let length = numStr.length;
  return length > 4 ?
    (length > 8
      ?
      numStr.replace(numStr.slice(-8, length), "亿")
      : numStr.replace(numStr.slice(-4, length), "万"))
    : numStr;
}


/**
 * 将毫秒数转换为 分钟 : 秒 的格式。
 * @param num number | string
 */
export function numberToTimeFormat(num: number | string): string {
  let n: number = 0;
  let isString = typeof num === "string" ? true : false;
  isString && (n = Number(num));
  (n as any) = num;
  let seconds: number = Math.floor((n as number) % 60);
  let minutes: number = Math.floor((n as number) / 60);

  let secondsLength = (seconds as number).toString().length;
  let minutesLength = (minutes as number).toString().length;
  let secondsStr = "";
  let minutesStr = "";
  secondsLength <= 1 ? secondsStr = `0${seconds}` : secondsStr = `${seconds}`;
  minutesLength <= 1 ? minutesStr = `0${minutes}` : minutesStr = `${minutes}`;
  return `${minutesStr} : ${secondsStr}`;
}


/**
 * 1610608721781 -> 2021-1-14
 * @param num number
 */
export function numberToDateFormat(num: number): string {
  let date = new Date(num);
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  let monthLength = month.toString().length;
  let dayLength = day.toString().length;
  return `${year} - ${monthLength >= 2 ? month : '0' + month} - ${dayLength >= 2 ? day : '0' + day}`;
}

export function numberToTimeDistanceFormat(num: number): string {
  let nowTimeData: any;
  let timeDate: any;
  let now = new Date();
  nowTimeData = {
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    date: now.getDate(),
    hour: now.getHours(),
    minutes: now.getMinutes()
  }

  let time = new Date(num);
  timeDate = {
    year: time.getFullYear(),
    month: time.getMonth() + 1,
    date: time.getDate(),
    hour: time.getHours(),
    minutes: time.getMinutes()
  }
  let timeDateHourLength = timeDate.hour.toString().length;
  let timeDateMinutesLength = timeDate.minutes.toString().length;
  let timeDateMonthLength = timeDate.month.toString().length;
  let timeDateDateLength = timeDate.date.toString().length;
  if (nowTimeData.year !== timeDate.year || nowTimeData.month !== timeDate.month || nowTimeData.date !== timeDate.date) {
    return `${timeDate.year}-${timeDateMonthLength < 2 ? `0${timeDate.month}` : `${timeDate.month}`}-${timeDateDateLength < 2 ? `0${timeDate.date}` : `${timeDate.date}`}  ${timeDateHourLength < 2 ? `0${timeDate.hour}` : `${timeDate.hour}`} : ${timeDateMinutesLength < 2 ? `0${timeDate.minutes}` : `${timeDate.minutes}`}`;
  } else {
    if (nowTimeData.hour === timeDate.hour) {
      return `${Math.ceil(nowTimeData.minutes - timeDate.minutes)} 分钟前`;
    } else {
      if (nowTimeData.hour - timeDate.hour == 1) {
        let result: string;
        let minute = timeDate.minutes + (60 - nowTimeData.minutes);
        minute < 60 ? result = `${minute} 分钟前` : result = `${timeDateHourLength < 2 ? `0${timeDate.hour}` : timeDate.hour} : ${timeDateMinutesLength < 2 ? `0${timeDate.minutes}` : timeDate.minutes}`;
        return result;
      } else {
        return `${timeDateHourLength < 2 ? `0${timeDate.hour}` : `${timeDate.hour}`} : ${timeDateMinutesLength < 2 ? `0${timeDate.minutes}` : `${timeDate.minutes}`}`;
      }
    }
  }
}



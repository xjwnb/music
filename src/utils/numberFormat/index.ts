/*
 * @Author: your name
 * @Date: 2021-01-11 14:57:00
 * @LastEditTime: 2021-01-13 19:42:51
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



export function numberToTimeFormat(num: number | string): string {
  let n: number = 0;
  let isString = typeof num === "string" ? true : false;
  isString && (n = Number(num));
  (n as any )= num;
  let seconds: number =  (n as number) % 60;
  let minutes: number =  Math.floor((n as number) / 60);
  
  let secondsLength = (seconds as number).toString().length;
  let minutesLength = (minutes as number).toString().length;
  let secondsStr = "";
  let minutesStr = "";
  secondsLength <= 1 ? secondsStr = `0${seconds}` : secondsStr = `${seconds}`;
  minutesLength <= 1 ? minutesStr = `0${minutes}` : minutesStr = `${minutes}`;
  console.log(`${minutesStr} : ${secondsStr}`, num)
  return `${minutesStr} : ${secondsStr}`;
}
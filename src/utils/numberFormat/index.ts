/*
 * @Author: your name
 * @Date: 2021-01-11 14:57:00
 * @LastEditTime: 2021-01-11 16:20:36
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
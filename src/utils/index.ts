const padTo2Digits = (num: number) => {
  return num.toString().padStart(2, '0');
};

export const convertMsToHM = (milliseconds: number): string => {
  let seconds = Math.floor(milliseconds / 1000);
  let minutes = Math.floor(seconds / 60);
  let hours = Math.floor(minutes / 60);

  seconds = seconds % 60;
  minutes = seconds >= 30 ? minutes + 1 : minutes;

  minutes = minutes % 60;

  // 👇️ If you don't want to roll hours over, e.g. 24 to 00
  // 👇️ comment (or remove) the line below
  // commenting next line gets you `24:00:00` instead of `00:00:00`
  // or `36:15:31` instead of `12:15:31`, etc.
//   hours = hours % 24;

  return `${padTo2Digits(hours)}:${padTo2Digits(minutes)}`;
}

// console.log(convertMsToHM(54000000)); // 👉️ 15:00 (15 hours)
// console.log(convertMsToHM(86400000)); // 👉️ 00:00 (24 hours)
// console.log(convertMsToHM(36900000)); // 👉️ 10:15 (10 hours, 15 minutes)
// console.log(convertMsToHM(15335000)); // 👉️ 04:16 (4 hours, 15 minutes, 35 seconds)
// console.log(convertMsToHM(130531000)); // 👉️ 36:16 (36 hours 15 minutes 31 seconds)

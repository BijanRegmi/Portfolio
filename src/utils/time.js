export const getTime = (now)=>{
  now = now || new Date()
  var hour = now.getHours()
  var min = now.getMinutes()
  var sec = now.getSeconds()
  now = (hour<10?'0':'')+hour+":"+(min<10?'0':'')+min+":"+(sec<10?'0':'')+sec
  return now
}
const generateId = ()=>{
  function randomNumber(length) {
    return Math.floor(Math.pow(10, length-1) + Math.random() * (Math.pow(10, length) - Math.pow(10, length-1) - 1));
}
  return randomNumber(8).toString();
  // while()
} 

export default generateId;
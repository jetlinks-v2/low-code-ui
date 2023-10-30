class Validator {
  rules: Array
  constructor(){
    this.rules = [];
  }
  add(elem, rule, err){
    const args_arr = rule.split(":");
    this.rules.push(()=>{
      const handler = args_arr.shift();
      args_arr.unshift(elem.value);
      args_arr.push(err);
      return strategies[handler].apply(elem, args_arr)
    })
  }
  start(){
    const errMsg = []
    for(let i = 0; i < this.rules.length; i++ ){
      const err = this.rules[i]();
      if(err){
        errMsg.push(err)
      }
    }
    return errMsg.join(",");
  }
}

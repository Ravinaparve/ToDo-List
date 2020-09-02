exports.getDate =getDate; //binding the getDate function to exports
//function1: gets the date
function getDate(){

  let today=new Date();

    let options= {
      weekday:"long",
      day:"numeric",
      month:"long"
};

let day = today.toLocaleDateString("en-US", options);
return day;
};

//function 2: get only the day name.

exports.getDay=getDay;
function getDay(){

  let today=new Date();

    let options= {
      weekday:"long"
};

let day = today.toLocaleDateString("en-US", options);
return day;
};

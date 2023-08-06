let alarms = [];
const alarmList = document.getElementById('list');
const addAlarmInputBtn = document.getElementById('addAlarm');
const hours = document.getElementById('hours');
const minutes = document.getElementById('minutes');
const seconds = document.getElementById('seconds');
const ampm = document.getElementById('ampm');
const alarmCounter = document.getElementById('alarm-counter');
document.addEventListener('click', handleClickListener);
// fecting the alarms from the local storage....
var nalarms = JSON.parse(localStorage.getItem('alarmsList'));
if(nalarms!=null){
    
    alarms =nalarms;
   // console.log(alarms);
    renderList();
    
}
    

// helper function to handle the delete button click
function handleClickListener(event){
    const target = event.target;
    if(target.className === 'fa fa-trash'){
        const alarmID = target.dataset.id;
        deleteAlarm(alarmID);
        return;
    }
}
function checkAlarmAlreadyExist(alarm){
    for(let i=0;i<alarms.length;i++){
        if(alarms[i].h == alarm.h && alarms[i].m == alarm.m && alarms[i].s == alarm.s && alarms[i].ap == alarm.ap){
            return false;
        }
    }
    
    return true;
}

// added event listner to add Alarm btn...
addAlarmInputBtn.addEventListener('click', processAlarmInput);
// function to validate the correct time for alarm and call addAlarm function....
function processAlarmInput(){
    let h = hours.value;
    let m = minutes.value;
    let s = seconds.value;
    let ap = ampm.value;
   
    // do some validation
    if(h==""||m==""||s==""){
        showNotification('Please set all the values');
        hours.value =' ';
        minutes.value =' ';
        seconds.value =' ';
        return;
    }
    if(h>12 || h<0 || m<0 || s<0||m>59||s>59|| h.length>2 ||m.length>2 || s.length>2){
        showNotification('Alarm : ' + h + ':'+m+':' +s+' '+ap+' is not valid');
        hours.value =' ';
        minutes.value =' ';
        seconds.value =' ';
        return;
    }
    h = h < 10 ? "0" + h : h;
    m = m < 10 ? "0" + m : m;
    s = s < 10 ? "0" + s : s;
    const alarm ={
        h,
        m,
        s,
        ap,
        id: Date.now().toString(),
    }
    if(h == 0 && m==0 && s==0 && ap=='PM'){
        showNotification('Alarm: 00:00:00 PM is not valid ');
        return;
    }
    if(checkAlarmAlreadyExist(alarm)){
        addAlarm(alarm);
    }
    else{
        showNotification('Alarm Already Exist');
    }
    
    hours.value =' ';
    minutes.value =' ';
    seconds.value =' ';
}
// helper function to render the list on the screen....<img src="./images/bin.png" class="delete" data-id="${alarm.id}" />
function addTaskToDom(alarm){
    const li = document.createElement('li');
    li.innerHTML = 
    `
        <label for="${alarm.id}">${alarm.h+" : "+alarm.m+" : "+alarm.s+" "+alarm.ap}</label>
        <i class="fa fa-trash" id = "delete" data-id = "${alarm.id}" aria-hidden="true"></i>        
    `;




    alarmList.append(li);
}

// function to render the alarm on the screen....
function renderList() {
    alarmList.innerHTML ='';
    for(let i = 0; i < alarms.length; i++) {
        addTaskToDom(alarms[i]);
    }
    alarmCounter.innerHTML = alarms.length;
}
// function to check which alarm is to go off...
function RingAlarm(hour, minute, second,ampm){
    //console.log(hour+" "+minute+" "+second+" "+ampm);
    for(let i =0;i<alarms.length;i++){
        //console.log(alarms[i].h+" "+alarms[i].m+" "+alarms[i].s+" "+alarms[i].ap);
        if(alarms[i].h == hour && alarms[i].m == minute && alarms[i].s == second && alarms[i].ap == ampm){
            showNotification('Alarm : '+hour+":"+minute+":"+second+" "+ampm);    
           //follow up with sound .....       
        }
    }
    return;
}
// function to delete the alarm from the list....
function deleteAlarm (alarmID) {
    let newAlarm = alarms.filter(function(alarm){
        return alarm.id !== alarmID;
    })
    alarms = newAlarm;
    localStorage.setItem('alarmsList', JSON.stringify(alarms));
    renderList();
    //showNotification('Alarm deleted successfully');
}
// function to add a new alarm to the list....
function addAlarm (alarm) {
    if(alarm){
        alarms.push(alarm);
        localStorage.setItem('alarmsList', JSON.stringify(alarms));
        renderList();
       // showNotification('Alarm added successfully');
        return;
    }
    showNotification('Alarm cannot be added');
    return;
   
}

function showNotification(text) {
    alert(text);
}



// to run the live clock ---
window.addEventListener("load", () => {
    clock();
    function clock() {
      const today = new Date();
  
      // get time components
      const hours = today.getHours();
      const minutes = today.getMinutes();
      const seconds = today.getSeconds();
  
      //add '0' to hour, minute & second when they are less 10
      const hour = hours < 10 ? "0" + hours : hours;
      const minute = minutes < 10 ? "0" + minutes : minutes;
      const second = seconds < 10 ? "0" + seconds : seconds;
  
      //make clock a 12-hour time clock
      const hourTime = hour > 12 ? hour - 12 : hour;
      //assigning 'am' or 'pm' to indicate time of the day
      const ampm = hour < 12 ? "AM" : "PM";
      const time = hourTime + ":" + minute + ":" + second +" "+ ampm;


      document.getElementById("date-time").innerHTML = time;
      //console.log(hourTime);
      
        RingAlarm(hourTime,minute,second,ampm);
        setTimeout(clock, 1000);
    
    }
  });
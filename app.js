let habits = JSON.parse(localStorage.getItem("habits")) || [];
let history = JSON.parse(localStorage.getItem("history")) || {};

function today(){
return new Date().toISOString().split("T")[0];
}

function save(){
localStorage.setItem("habits",JSON.stringify(habits));
localStorage.setItem("history",JSON.stringify(history));
}

function addHabit(){

const input = document.getElementById("habitInput");
const name = input.value.trim();

if(name==="") return;

habits.push(name);

if(!history[today()])
history[today()] = new Array(habits.length).fill(false);

save();
input.value="";

render();
}

function toggleHabit(i){

if(!history[today()])
history[today()] = new Array(habits.length).fill(false);

history[today()][i] = !history[today()][i];

save();
render();

/* ポップアニメーション */
setTimeout(()=>{
const habitsDOM = document.querySelectorAll(".habit");
habitsDOM[i].classList.add("pop");

setTimeout(()=>{
habitsDOM[i].classList.remove("pop");
},250);

},10);

}

function render(){

const list = document.getElementById("habitList");
list.innerHTML="";

if(!history[today()])
history[today()] = new Array(habits.length).fill(false);

habits.forEach((h,i)=>{

const div = document.createElement("div");
div.className="habit";

const checked = history[today()][i] ? "checked" : "";

div.innerHTML=
`<label>
<input type="checkbox" ${checked}
onclick="toggleHabit(${i})">
${h}
</label>`;

list.appendChild(div);

});

updateProgress();
updateStreak();
renderCalendar();
}

function updateProgress(){

const done =
history[today()].filter(v=>v).length;

const percent =
habits.length===0 ? 0 :
Math.round(done/habits.length*100);

const ring = document.getElementById("ring");

ring.style.setProperty("--progress", percent + "%");

document.getElementById("percentText").textContent =
percent+"%";
}

function updateStreak(){

let streak = 0;

let d = new Date();

while(true){

const key = d.toISOString().split("T")[0];

if(!history[key]) break;

if(history[key].every(v=>v)){

streak++;

}else break;

d.setDate(d.getDate()-1);
}

document.getElementById("streak").textContent =
"🔥 "+streak+" day streak";
}

function renderCalendar(){

const cal = document.getElementById("calendar");
cal.innerHTML="";

for(let i=29;i>=0;i--){

const d = new Date();
d.setDate(d.getDate()-i);

const key = d.toISOString().split("T")[0];

const div = document.createElement("div");
div.className="day";

if(history[key] && history[key].every(v=>v)){

div.textContent="○";

}else if(history[key]){

div.textContent="×";

}else{

div.textContent="-";

}

cal.appendChild(div);

}
}

render();

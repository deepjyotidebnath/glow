// ---- Edit these to customise ----
var SALON={name:"Glow Studio",wa:"919999999999",
cats:{
"Hair":[["Haircut & styling",45,600],["Hair spa",60,1200],["Colour / highlights",120,3500]],
"Skin":[["Classic facial",60,1400],["Deep cleanup",45,900],["Hydra glow facial",75,2400]],
"Bridal":[["Bridal makeup",120,8000],["Makeup trial",60,2000]],
"Spa & nails":[["Full body massage",60,2200],["Manicure",40,700],["Pedicure",50,900]]},
staff:[["Priya","Skin & bridal","10:00-18:00"],["Rohan","Hair","11:00-20:00"],["Sana","Spa & nails","10:00-19:00"]]};
var $=function(i){return document.getElementById(i)};
var BK={};try{BK=JSON.parse(localStorage.getItem("bk")||"{}")}catch(e){}
function save(){try{localStorage.setItem("bk",JSON.stringify(BK))}catch(e){}}
var cats=Object.keys(SALON.cats),cur=cats[0];
function esc(t){return String(t).replace(/[&<>"]/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})}
function drawSvc(){
 $("tabs").innerHTML=cats.map(function(c){return '<button aria-pressed="'+(c==cur)+'" data-c="'+esc(c)+'">'+esc(c)+'</button>'}).join("");
 $("svc").innerHTML=SALON.cats[cur].map(function(s){return '<div class="row"><div>'+esc(s[0])+'<small>'+s[1]+' min</small></div><span class="price">₹'+s[2].toLocaleString("en-IN")+'</span></div>'}).join("");
 Array.prototype.forEach.call($("tabs").children,function(b){b.onclick=function(){cur=b.dataset.c;drawSvc()}});
}
drawSvc();
var all=[];cats.forEach(function(c){SALON.cats[c].forEach(function(s){all.push(s)})});
$("s").innerHTML=all.map(function(s,i){return '<option value="'+i+'">'+esc(s[0])+' – ₹'+s[2]+'</option>'}).join("");
$("st").innerHTML=SALON.staff.map(function(s,i){return '<option value="'+i+'">'+esc(s[0])+' ('+esc(s[1])+')</option>'}).join("");
$("staff").innerHTML=SALON.staff.map(function(s){return '<div><b>'+esc(s[0])+'</b><br>'+esc(s[1])+'<br><small>Works '+esc(s[2])+'</small></div>'}).join("");
var names=["Bridal look","Hair colour","Facial glow","Nail art","Spa ritual","Party makeup"];
$("gal").innerHTML=names.map(function(n,i){return '<figure><img src="assets/gallery-'+(i+1)+'.svg" alt="'+n+'" loading="lazy" width="300" height="300"><figcaption>'+n+'</figcaption></figure>'}).join("");

var sel="";var d=$("d"),t=new Date();t.setMinutes(t.getMinutes()-t.getTimezoneOffset());
d.min=t.toISOString().slice(0,10);d.value=d.min;
function slots(){
 var st=SALON.staff[$("st").value],h=st[2].split("-"),a=+h[0].split(":")[0],b=+h[1].split(":")[0],out=[];
 for(var x=a;x<b;x++){["00","30"].forEach(function(m){out.push((x<10?"0":"")+x+":"+m)})}
 var key=d.value+"|"+st[0],taken=BK[key]||[],now=new Date(),isToday=d.value==d.min;
 sel="";
 $("slots").innerHTML=out.map(function(s){
  var past=isToday&&(+s.slice(0,2)*60+ +s.slice(3))<=now.getHours()*60+now.getMinutes();
  return '<button type="button" aria-pressed="false" '+((taken.indexOf(s)>-1||past)?"disabled":"")+'>'+s+'</button>'}).join("");
 Array.prototype.forEach.call($("slots").children,function(b){b.onclick=function(){
  Array.prototype.forEach.call($("slots").children,function(o){o.setAttribute("aria-pressed","false")});
  b.setAttribute("aria-pressed","true");sel=b.textContent}});
}
$("st").onchange=slots;d.onchange=slots;slots();

function show(txt,err){var m=$("m");m.textContent=txt;m.className="msg"+(err?" err":"");m.style.display="block"}
$("go").onclick=function(){
 var n=$("n").value.trim(),p=$("p").value.replace(/\D/g,"");
 if(!n){return show("Enter your name.",1)}
 if(p.length<10){return show("Enter a 10-digit WhatsApp number.",1)}
 if(!d.value){return show("Pick a date.",1)}
 if(!sel){return show("Pick a time.",1)}
 var s=all[$("s").value],st=SALON.staff[$("st").value],key=d.value+"|"+st[0];
 (BK[key]=BK[key]||[]).push(sel);save();
 var text="Hi "+SALON.name+", I'd like to book:\n• "+s[0]+" (₹"+s[2]+")\n• With "+st[0]+"\n• "+d.value+" at "+sel+"\nName: "+n+"\nPhone: "+p+($("l").checked?"\nPlease add me to the loyalty club.":"");
 window.open("https://wa.me/"+SALON.wa+"?text="+encodeURIComponent(text),"_blank","noopener");
 show("Booked: "+s[0]+" with "+st[0]+" on "+d.value+" at "+sel+". Send the WhatsApp message to confirm.");
 slots();
};

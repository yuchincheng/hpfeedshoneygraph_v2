function showmenu(e,pos){
var menuobj=document.getElementById("right_menu");
menuobj.style.left=e.x+'px';
if(pos==0){
menuobj.style.top=e.y+'px';}
else{
e.y=e.y+500;
menuobj.style.top=e.y+'px';
    }
menuobj.style.visibility="visible"
return false
}

function hidemenu(e){
menuobj.style.visibility="hidden"
}


document.title = "watcHy";
var vid = document.getElementById("myVideo"); 
var szov = document.getElementById("myVideo"), track;
    
    
    
    
var megallt = true;
var fajlNev;
var fajlNev2;


document.getElementById("fajl").addEventListener("change",function()
{
  var file = this.files[0];
  fajlNev = this.files[0].name;

  if (file) 
  {
    var fileURL = URL.createObjectURL(file);
    vid.src = fileURL
        
  }
},false);

document.getElementById("fajlSzoveg").addEventListener("change",function()
{
    console.log("ott");
    alert("itt");
  var file2 = this.files[0];
  console.log(file2);
  fajlNev2 = this.files[0].name;

  if (file2) 
  {
    var fileURL2 = URL.createObjectURL(file2);
    szov.src = fileURL2;
        
  }
},false);
    
function jump()
{
    var hova = document.getElementById("jumpIdo").value;
    vid.currentTime = hova;
    
}
    
function keszulj()
{
    var x = document.getElementById("lejatszasGomb");
    x.style.display = "block";
    
    var y = document.getElementById("megallasGomb");
    y.style.display = "block";
    
    var v = document.getElementById("myVideo");
    v.style.display = "block";
    
    var b = document.getElementById("outer2");
    b.style.display = "block";
    
    var f = document.getElementById("full");
    f.style.display = "block";
}
    
function openFullscreen() 
{
    if (vid.requestFullscreen) {
    vid.requestFullscreen();
    } else if (vid.mozRequestFullScreen) { /* Firefox */
    vid.mozRequestFullScreen();
    } else if (vid.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
    vid.webkitRequestFullscreen();
    } else if (vid.msRequestFullscreen) { /* IE/Edge */
    vid.msRequestFullscreen();
    }
}
    
function playVid() 
{
    window.clearInterval(myVar);
    //console.log("INDÍTÁS MEGNYOMÁSA-----");
    if(megallt)//vagyis játszódik
    {
        
        document.getElementById("demo").innerHTML = "Indulj";
        vid.play(); 
        megallt = false;
        document.title = "Play -  "+fajlNev+".mp4";
            
        //console.log("FILM INDÍTÁSA");
        var x = new XMLHttpRequest();
        x.open("GET","https://szolariummasszazs-klub.hu/dani/watchY/watchyServerInditas.php",true);
        x.send();
        
    
    }
    else
    {
    //console.log("FILM FUT");
    } 
    myVar = setInterval(myTimer, 1000);
      
} 
    
function pauseVid() 
{
    window.clearInterval(myVar);
    //console.log("LEÁLLÍTÁS MEGNOYMÁSA..........");
    if(megallt == false)//vagyis játszódik
    {
    
        vid.pause();
        megallt = true;
        document.title = "Pause - "+fajlNev+".mp4";
        
        //console.log("FILM MEGÁLLÍTÁSA");
        var x = new XMLHttpRequest();
        x.open("GET","https://szolariummasszazs-klub.hu/dani/watchY/watchyServerMegallitas.php",true);
        x.send();
        document.getElementById("demo").innerHTML = "Allj";
    
    }
    else//vagyis megallt
    {
    //console.log("FILM MEGÁLLT");
    } 
    myVar = setInterval(myTimer, 1000);
      
} 
    
    
var myVar = setInterval(myTimer, 1000);
    
function myTimer() 
{
      
      //console.log("current time: "+vid.currentTime);
      document.getElementById("ido").innerHTML = "Time: "+vid.currentTime+" sec";
      if(vid.paused)
      {
        //console.log("állítódik");
        pauseVid();
      }
      else
      {
        //console.log("játszódik");
        playVid();
      }
      //console.log("ido");
    
      var xmlhttp = new XMLHttpRequest();
    
      xmlhttp.onreadystatechange = function() 
      {
        if (this.readyState == 4 && this.status == 200) 
        {
          myObj = JSON.parse(this.responseText);
          document.getElementById("demo").innerHTML = myObj.name;
          //ide kell majd az ellenorzes!!!
          if(myObj.name == "Allj")
          { 
              //console.log("allj");
              pauseVid();
          }
          else
          {
            //console.log("megy");
            playVid();
          }
        }
      };
    xmlhttp.open("GET", "https://szolariummasszazs-klub.hu/dani/watchY/watchyGetter.php", true);
    xmlhttp.send();
    
    }
    
document.body.onkeyup = function(e)
{
    if(e.keyCode == 80){
        console.log("ener");
        if(document.getElementById("demo").innerHTML == "Allj")
        { 
            console.log("indulj");
            playVid();
        }
        else
        {
        console.log("allj");
        pauseVid();
        }
    }
    
    if(e.keyCode == 70){
            
        openFullscreen();
    }
}
    
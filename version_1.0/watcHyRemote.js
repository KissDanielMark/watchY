document.title = "watcHy";
var vid = document.getElementById("myVideo"); 
    
    
    
    
var megallt = true;

    
function playVid() 
{
    //console.log("INDÍTÁS MEGNYOMÁSA-----");
    if(megallt)//vagyis játszódik
    {
         megallt = false;
        //console.log("FILM INDÍTÁSA");
        var x = new XMLHttpRequest();
        x.open("GET","http://szolariummasszazs-klub.hu/dani/watchyServerInditas.php",true);
        x.send();
        
    
    }
    else
    {
    //console.log("FILM FUT");
    } 
      
} 
    
function pauseVid() 
{
    //alert("FASZ");
    //console.log("LEÁLLÍTÁS MEGNOYMÁSA..........");
    if(megallt == false)//vagyis játszódik
    {
        megallt = true;
        var x = new XMLHttpRequest();
        x.open("GET","http://szolariummasszazs-klub.hu/dani/watchyServerMegallitas.php",true);
        x.send();
        
    
    }
    else//vagyis megallt
    {
    //console.log("FILM MEGÁLLT");
        
    } 
      
} 
    
/*
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
}*/
    
class NewMap{
 static prevObcina = [null,null,null,null];
 static svg =null;
 static mapStyle="ranked";


static createmap(svgel){

  var svg = jQuery(svgel)[0].contentDocument.documentElement;
   jQuery(svg).children().each((idx,d)=>{
         var obcina=jQuery(d).attr('inkscape:label');
         jQuery(d).attr('fill',NewMap.makeColorRank(obcina));
         jQuery(d).click(NewMap.whenTileClicked);
         jQuery(d).hover( NewMap.onMouseOver, NewMap.onMouseOut )
    });
    NewMap.svg=svg
    //First time we acess the page, the random municipality shall be chosen.
    var obcina=Object.keys(JSONDATA)[1+Math.floor(Math.random()*212)] // on the 213th place is data for the whole country.
    NewMap.updateObcina(obcina)
    jQuery('#lista').val("Izberi občino")

}


static updateObcina(obcina){
  NewChart.updateAllCharts(obcina)//Update all charts
  jQuery('#lista').val(obcina) //Update all text
  NewMap.setTileStyle(obcina)
  jQuery('#izbrana-obcina').text(obcina)
  if(obcina==JSONkey_celaSlovenija){
    jQuery('#celotnaSlo').prop('checked', true);
    jQuery('#celotnaSlo').prop('disabled', true);
  }
  else{  
    jQuery('#celotnaSlo').prop('checked', false);
    jQuery('#celotnaSlo').prop('disabled', false);
  }

}

static onMouseOver(e){
  var obcina = e.currentTarget.attributes[0].value;
  let tooltip = document.getElementById("tooltip");
  tooltip.innerHTML = obcina
  tooltip.style.display = "block";
  tooltip.style.left = e.pageX + 0 + 'px';
  tooltip.style.top = e.pageY + 70 + 'px';
 
}

static onMouseOut(e){
  var tooltip = document.getElementById("tooltip");
  tooltip.style.display = "none";
  
}

static whenTileClicked(e) {
var obcina = e.currentTarget.attributes[0].value;
NewMap.updateObcina(obcina)

}

static toggleMapView(){

if(NewMap.mapStyle=="blue"){
  jQuery(NewMap.svg).children().each((idx,d)=>{
    var obcina=jQuery(d).attr('inkscape:label');
    jQuery(d).attr('fill',NewMap.makeColorRank(obcina));
    NewMap.mapStyle="ranked";
    NewMap.setTileStyle(this.prevObcina[0])
    jQuery('[data-toggle="tooltip1"]').attr("data-original-title",text_mapa_rgb);
  });
}
else{
  jQuery(NewMap.svg).children().each((idx,d)=>{
    var obcina=jQuery(d).attr('inkscape:label');
    jQuery(d).attr('fill',NewMap.makeColorB(obcina));  
  });
  NewMap.mapStyle="blue";
  NewMap.setTileStyle(this.prevObcina[1])
  jQuery('[data-toggle="tooltip1"]').attr("data-original-title",text_mapa_b);
  }
  
}
//Za heatmap

static makeColorRGB(obcina) {
       var value= JSONDATA[obcina][JSONkey_mejnehitrosti][JSONkey_mejnehitrosti_mid]+JSONDATA[obcina][JSONkey_mejnehitrosti][JSONkey_mejnehitrosti_top]
        var r;
        var treshold=70
       // var b=200*Math.exp(-(value-50)*(value-50)/150)
       var b=10
        var g;
        if (value >treshold) {
            g = 255;
            r = 255-(value-treshold)*255/(100-treshold);
            r=Math.round(r)
        } else {
            r = 255;
            g=255/treshold*(value)
            g=Math.round(g)
           
        }

        return rgb(r,g,b)
    }
    static makeColorB(obcina) {
     // var value= JSONDATA[obcina][JSONkey_mejnehitrosti][JSONkey_mejnehitrosti_mid]+JSONDATA[obcina][JSONkey_mejnehitrosti][JSONkey_mejnehitrosti_top]
     var value= JSONDATA[obcina][JSONkey_rank]
      var r=30+Math.ceil(value);
      var g=30+Math.ceil(value);
       var b=245;
       return rgb(r,g,b)
   }
   static makeColorRank(obcina) {
    var value= JSONDATA[obcina][JSONkey_mejnehitrosti][JSONkey_mejnehitrosti_mid]+JSONDATA[obcina][JSONkey_mejnehitrosti][JSONkey_mejnehitrosti_top]
    var color
    if (value<50){
     color='rgb(225,1,91)'
    }
    else if(value >=50 && value <80){
      color='rgb(1,254,225)'
    }
    else{
      color='rgb(0,226,148)'
    }
      return color
  }
static setTileStyle(obcina){
      if(NewMap.mapStyle=="blue"){
        if (NewMap.prevObcina[0] !== null) {
          NewMap.colorThetile(NewMap.prevObcina[0],NewMap.prevObcina[2])
          }  
        NewMap.prevObcina[0]= obcina
      NewMap.prevObcina[2]= NewMap.colorThetile(obcina,'#00eeaa')
      }
      else if(NewMap.mapStyle=="ranked"){
        if(NewMap.prevObcina[1]!==null){
          NewMap.colorThetile(NewMap.prevObcina[1],NewMap.prevObcina[3])
        }
        NewMap.prevObcina[1]= obcina
      NewMap.prevObcina[3]= NewMap.colorThetile(obcina,'#0000aa')
      }
}

static colorThetile(obcina,color){
  var prevCol;
  jQuery(NewMap.svg).children().each((id,d)=>{
    if (jQuery(d).attr("inkscape:label")==obcina){
      prevCol=jQuery(d).attr('fill')
      jQuery(d).attr('fill',color)
      
    }
  });
  return prevCol
}


}




//globalni podatki za imena keyev v jsonu.
JSONkey_ponudniki="topponudnik"
JSONkey_hitrosti="hitrosti"
JSONkey_tehnologije="tehnologije"
JSONkey_rank="Rank30"
JSONkey_mejnehitrosti="mejnehitrosti"
JSONkey_mejnehitrosti_bot="0-29"
JSONkey_mejnehitrosti_mid="30-99"
JSONkey_mejnehitrosti_top="100+"
Map_backgroud_color="#ffffff"
text_vrstePovezljivost="Kategorija Vrsta povezljivosti nudi vpogled v nosilne tehnologije širokopasovnega interneta v izbrani občini."
text_ponudniki="Kategorija Ponudniki ponuja vpogled v nosilce zagotavljanja digitalne infrastrukture."
text_interneteHitrosti="Kategorija Internetne hitrosti sloni na strateškem dokumentu 'Digitalna Slovenija 2020 – Strategija razvoja informacijske družbe do leta 2020', v katerem je do konca leta 2020 predviden cilj 96 % gospodinjstev v državi zagotoviti širokopasovni dostop do interneta hitrosti vsaj 100 Mb/s, ostalim gospodinjstvom pa vsaj 30 Mb/s."
text_naslov="Ker je dostopna in zmogljiva širokopasovna infrastruktura bistvena za zmanjševanje t. i. digitalne ločnice oz. razkoraka, kar se kot izjemno pomembno kaže ob pandemiji bolezni covid-19, je LTFE izdelal orodje 'Povezljivost v Sloveniji', ki z enostavno uporabo omogoča ugotavljanje pokritosti s širokopasovnim internetom v Sloveniji. Orodje vključuje vseh 212 slovenskih občin, prikazuje pa kategorije: Internetne hitrosti, Ponudniki in Vrsta povezljivosti."
text_mapa_rgb="Občina je obarvana zeleno, če ima več kot 80 % priključkov nad 30 Mb/s (zagotovitev vsaj 30 Mb/s je tudi cilj članic EU oz. glede na strategijo 'Digitalna Slovenija' je cilj, da se do leta 2020 čim več gospodinjstvom v državi zagotovi širokopasovni dostop do interneta hitrosti vsaj 100 Mb/s, ostalim gospodinjstvom pa vsaj 30 Mb/s). Občine, ki so turkizno-modro obarvane, imajo med 50 % in 80 % priključkov nad 30 Mb/s. Vse občine, ki so obarvane rdeče, pa imajo manj kot 50 % priključkov, ki so nad 30 Mb/s."
text_mapa_b="Gradient modrih barv pri občinah deluje tako, da temnejše modre barve, kot je obarvana občina, na višjem mestu je (nižja številka = višje mesto). "
text_rang="Obarvana številka, ki se izpiše, je vrstna številka izbrane občine od 1. do 212. mesta (nižja številka, boljše mesto) glede na to, kolikšen delež internetnih priključkov je nad 30 Mb/s. Na primer, izbrana občina, ki ima 20 % priključkov nad 30 Mb/s in 80 % pod 30 Mb/s, bo na nižjem mestu (npr. na 190. mestu) v primerjavi z občino, ki ima 60 % priključkov nad 30 Mb/s in 40 % priključkov pod 30 Mb/s in bo zato zasedla 32. mesto."
JSONkey_celaSlovenija="Statistika celotne Slovenije"

function changeButtonEnable(){
  $(function () {
    $('[data-toggle="tooltip0"]').tooltip()
    $('[data-toggle="tooltip1"]').tooltip()
    $('[data-toggle="tooltip2"]').tooltip()
    $('[data-toggle="tooltip3"]').tooltip()
    $('[data-toggle="tooltip4"]').tooltip()
    $('[data-toggle="tooltip5"]').tooltip()
    
  })
  //poskrbimo da se text na grafih skalira ob resizanju
  $(window).resize(()=>{setTextSizesOnChart()});
  //s tem switchamo med dvemi bar charti charti
  jQuery("#changeChart1").change(function() {
      bar1.toggleTwoKeysData(JSONkey_hitrosti,JSONkey_mejnehitrosti) ;
  });

  jQuery("#changeMap1").change(function() {
      NewMap.toggleMapView() ;
  });


  jQuery("#celotnaSlo").change(function() {
    if($('#celotnaSlo').is(":checked")){
    NewMap.updateObcina(JSONkey_celaSlovenija)
    }
  });

  jQuery('[data-toggle="tooltip0"]').attr("data-original-title",text_naslov);
  jQuery('[data-toggle="tooltip1"]').attr("data-original-title",text_mapa_rgb);
  jQuery('[data-toggle="tooltip2"]').attr("data-original-title",text_interneteHitrosti);
  jQuery('[data-toggle="tooltip3"]').attr("data-original-title",text_rang);
  jQuery('[data-toggle="tooltip4"]').attr("data-original-title",text_ponudniki);
  jQuery('[data-toggle="tooltip5"]').attr("data-original-title",text_vrstePovezljivost);

}

/*
Fill the drpodownlist with municipality names.

*/
function createList(){
  var listItems="";
  /*
  First item of the list should say "chose municipality"
  */
  listItems+="<option selected disabled>Izberi občino</option>";
  jQuery.each( JSONDATA, function( key1, value1 ) {
    if(key1!=="DATUM"){
      listItems+= "<option value='" + key1 + "'>" + key1 + "</option>";
    }

  });
  jQuery('#lista').html(listItems);

  //When we change municipality
  jQuery("#lista").change(function () {
          var obcina = jQuery('#lista').val(); //Read what we choose.
          NewMap.updateObcina(obcina)
      });

  jQuery("#datum").text(JSONDATA["DATUM"])
}


function setTextSizesOnChart(){
  hbar2.chart.options.title.fontSize=vwTOpx(3.5)
  if ($(window).width()>768){
  bar1.chart.options.scales.xAxes[0].scaleLabel.fontSize=vwTOpx(0.9)
  bar1.chart.options.scales.yAxes[0].scaleLabel.fontSize=vwTOpx(0.9)
  }
  else{
    bar1.chart.options.scales.xAxes[0].scaleLabel.fontSize=17
    bar1.chart.options.scales.yAxes[0].scaleLabel.fontSize=17

  }


}

function rgb(r,g,b){
    return 'rgb('+r+','+g+','+b+')'
  }

  function vwTOpx(value) {
      if(window.innerWidth >768){
        d = document,
        e = d.documentElement,
        g = d.getElementsByTagName('body')[0],
        x = window.innerWidth || e.clientWidth || g.clientWidth,
       result = (x*value)/100;
        return result
      }
      else{return 30}
    }
  
    function vhTOpx(value) {
        if(window.innerWidth >768){
          d = document,
          e = d.documentElement,
          g = d.getElementsByTagName('body')[0],
         y = window.innerHeight || e.clientHeight || g.clientHeight,
         result = (y*value)/100;
          return result
        }
        else{return 30}
      }
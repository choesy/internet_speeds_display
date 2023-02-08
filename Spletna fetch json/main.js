
$(window).on('load',function(){
 
$.ajax({
    dataType: "json",
    url: 'data.json',
    success: function(data){
        JSONDATA=data;
        var svgel = document.getElementById("map1");
        bar1= new NewChart(id='chart1',key=JSONkey_mejnehitrosti)
        hbar2= new NewChart(id='chart2',key=JSONkey_rank,type="horizontalBar")
        pie1= new NewChart(id='chart3',key=JSONkey_ponudniki,type='pie')
        pie2= new NewChart(id='chart4',key=JSONkey_tehnologije,type='pie')
            createList();
            NewMap.createmap(svgel);
            changeButtonEnable();
        }


  });

})
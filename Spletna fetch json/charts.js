class NewChart{
//We define colors that will be used on chart
static colorList=[[200,200,20],[150,20,0],[160,40,230]];
//List where all the charts are stored
static chartList=[];

constructor(id,key,type='bar'){
    /*
    We input element id of canvas, name of the chart (key) nad type of chart(bar,pie,horizontalBar)
    */
    this.colorIndex=0;
    this.key=key;
    this.type=type;
    this.obcina;
    this.ctx = document.getElementById(id).getContext('2d');
    this.id=id;
    //firstly we crate empty chart that will be filled later.
    //We configure it in the way that it is "noninvasive" untill the data gets loaded
    this.chart = new Chart(this.ctx, {
    type: type,
    data: { },
    options: {
        legend: {
            display: false
         },
    scales: {
        xAxes: [{
            display: false ,
            gridLines: {
                drawOnChartArea: false
            }
        }],
        yAxes: [{
            display: false ,
            gridLines: {
                drawOnChartArea: false
            }
        }]
    }
}
 
});
//we push chart onto the chart list
NewChart.chartList.push(this)
}

/*
Color the data on chart based on preferences
*/
colorChart(type,kljuc,data){
var collist=[];

//colors for the bar chart based on the internet speeds
if((type=='bar') && ((kljuc==JSONkey_hitrosti)||(kljuc==JSONkey_mejnehitrosti)) ){
	for (var key in data){
		key=parseInt(data[key])
		var color=null;
		if(key<29){color='rgb(225,1,91)'}
		else if(key>=29 && key<99){color='rgb(1,254,225)'}
		else{color='rgb(0,226,148)'}
		collist.push(color);
}
}
//colors for the pie chart based on the iternet providers
else if ((type=='pie') && (kljuc==JSONkey_ponudniki)){
	var c=[0,0,0]
	for (var key in data){
		switch(data[key]){
			case "Telekom" : c=[62,84,186]; break;
			case "Telemach" :c=[225,97,96]; break; 
			case "T-2" :c=[225,225,0]; break; //za implementacijo ponudnikov
			case "A1" : c=[0,253,0]; break; 
            case "ARIO" :c=[63,30,113]; break; 
            case "SISTEM-TV" :c=[137,96,228]; break; 
			case "DRUGI" : c=[0,0,0]; break; 
			default: c=this.randomColorGenerator();
        }
        var color='rgb(' + c[0] + ', ' + c[1] + ', ' + c[2] + ')'
		collist.push(color)
}
}

//colors for the pie chart based on the techonology types
else if ((type=='pie') && (kljuc==JSONkey_tehnologije)){
	var c=[0,0,0];
	for (var key in data){
		switch(data[key]){
			case "Bakrena parica" : c=[220,44,233]; break;
			case "Optični priključek" : c=[100,36,200]; break; //za implementacijo tipov prikjuckov
			case "Brezžično" : c=[250,50,255]; break; 
			case "Koaksialni kabel" :  c=[160,40,230]; break; 
			case "Drugo" : color='grey'; break; 
			default: c=[230,230,230]
		}
        var color='rgb(' + c[0] + ', ' + c[1] + ', ' + c[2] + ')'
		collist.push(color)
}
}

return collist
}

/*
We inflate char with data based on selected municipality on map and contents of graph.

obcina -> municipality selected (by name)
key -> type of data

*/
createChart(obcina,key)
{   
var type=this.type;
var self = this;
if (this.type=="horizontalBar"){
    if(obcina==JSONkey_celaSlovenija){
        var data=1;
    }
    else{
    var data=  [1+Object.keys(JSONDATA).length - JSONDATA[obcina][key]]
    }
    this.chart = new Chart(this.ctx, {
        // The type of chart we want to create
        type: type,
        // The data for our dataset
        data: {
            datasets: [
                {
                    backgroundColor: NewMap.makeColorRank(obcina),
                    data: data,
                    },
                {  
                backgroundColor: '#eeeeee',
                data: [213],
                id:'lowerBar'
                 },
            ]
        },
        // Configuration options go here
        options: NewChart.options(type,obcina)
    });


}
else{
this.chart = new Chart(this.ctx, {
    // The type of chart we want to create
    type: type,
    // The data for our dataset
    data: {
        labels: Object.keys(JSONDATA[obcina][key]),
        datasets: [{
            label: obcina+" "+key,
            backgroundColor: self.colorChart(type,key,Object.keys(JSONDATA[obcina][key])),
            data: Object.values(JSONDATA[obcina][key])
        }]
    },
    // Configuration options go here
    options: NewChart.options(type)
});

}
if(type=='pie'){
    document.getElementById(this.id+'-legend').innerHTML = this.chart.generateLegend();
}
setTextSizesOnChart();
}


/*
We update the data by destroyng previous chart and creating new one.
*/
updateData(obcina,key){

if (key == null ){key=this.key}
if(obcina==undefined){obcina=this.obcina}
this.chart.destroy();
this.createChart(obcina,key)

}

/*
Swaping betwen two different keys 
*/

toggleTwoKeysData(key1,key2) {
  if (this.key == key1) {
    this.key=key2
    this.updateData();
  } else {
    this.key=key1
    this.updateData();
  }
}

/*
We swap betwen colors in the list each time this function is called. and return the color.
*/
randomColorGenerator(){
    var c=NewChart.colorList[this.colorIndex];
    this.colorIndex+=1;
    if(this.colorIndex>=NewChart.colorList.length) this.colorIndex=0;
    return c
}


/*
function that returns options for graphs
*/
static options(type,obcina){
if(type=='pie'){
return {
    legend:{
        display:false
    },
  
    }
}
else if(type=='bar') {	
return { 
    
    legend: {
        display: false,
     },
  
    scales: {
        yAxes: [{
            scaleLabel: {
                display: true,
                labelString: '% gospodinjstev'
              },
            display: true ,
            ticks: {
                beginAtZero: true,
                callback: function(value, index, values) {
                    if(index%2==0)return value;
                }
            }
        }],
        xAxes: [{
            scaleLabel: {
                display: true,
                labelString: 'hitrosti internet povezave [Mb/s] '
              },

            display: true ,
            ticks:{
                beginAtZero: true,
            }
        }]
    },
    responsive: true,
    maintainAspectRatio: true
}
}
else if(type=="horizontalBar"){
    var rankObcine;
    if(obcina!=JSONkey_celaSlovenija){rankObcine=JSONDATA[obcina][JSONkey_rank];}
   else {rankObcine="Izberi občino";}
    return { 
        animation: {

        },
        tooltips: {
            enabled: false
       },
        legend: {
            display: false,
         },
         title: {
            display: true,
            text: rankObcine,
            fontColor: NewMap.makeColorRank(obcina),
            position: "top"
        },
        scales: {
            yAxes: [{
                stacked:true,
                display: false,
                barPercentage: 0.3,
                ticks: {
                    beginAtZero: true,
                }
            }],
            xAxes: [{
                display: false ,
                stacked:true,
                ticks:{
                    beginAtZero: true,
                    max: 212,
                    min: 1,
                }
            }]
        },
        responsive: true,
        maintainAspectRatio: true
    }

}

}

/*
This function updates all the charts when it is called. It is the first funtion that gets called when we change municipality
*/
static updateAllCharts(obcina){
    for (var i=0;i<NewChart.chartList.length;i++){
         NewChart.chartList[i].obcina=obcina;
        NewChart.chartList[i].updateData(obcina)
    }

}

static randomColor(){
		var r = Math.floor(50+Math.random() * 100)
		var g = Math.floor(50+Math.random() * 170)
		var b = 100
		return ('rgb(' + r + ', ' + g + ', ' + b + ')')
}

}


var w = 500,
	h = 500;

var colorscale = d3.scale.category10();

//Legend titles
var LegendOptions = ['Audi','BMW', 'Infiniti', 'Lexus'];

//Data
/*var d = [
		  [
			{axis:"Price",value:43307},
			{axis:"Engine Size",value:3.0},
			{axis:"Horsepower",value:250},
			{axis:"City MPG",value:18.0},
			{axis:"Highway MPG",value:26.0}			
		  ],
		  [
			{axis:"Price",value:43286},
			{axis:"Engine Size",value:3.125},
			{axis:"Horsepower",value:241},
			{axis:"City MPG",value:18.7},
			{axis:"Highway MPG",value:27.0}			
		  ],
		  [
			{axis:"Price",value:36100},
			{axis:"Engine Size",value:3.875},
			{axis:"Horsepower",value:291.5},
			{axis:"City MPG",value:17.25},
			{axis:"Highway MPG",value:23.875}			
		  ],
		  [
			{axis:"Price",value:44215},
			{axis:"Engine Size",value:3.7182},
			{axis:"Horsepower",value:243.6},
			{axis:"City MPG",value:17.5},
			{axis:"Highway MPG",value:23.5}			
		  ]
		];*/
		
var d = [
		  [
			{axis:"Price",value:0.59},
			{axis:"Engine Size",value:0.56},
			{axis:"Horsepower",value:0.42},
			{axis:"City MPG",value:0.34},
			{axis:"Highway MPG",value:0.48}
		  ],[
			{axis:"Price",value:0.42},
			{axis:"Engine Size",value:0.48},
			{axis:"Horsepower",value:0.42},
			{axis:"City MPG",value:0.56},
			{axis:"Highway MPG",value:0.59}
		  ],[
			{axis:"Price",value:0.59},
			{axis:"Engine Size",value:0.36},
			{axis:"Horsepower",value:0.52},
			{axis:"City MPG",value:0.24},
			{axis:"Highway MPG",value:0.58}
		  ],[
			{axis:"Price",value:0.29},
			{axis:"Engine Size",value:0.43},
			{axis:"Horsepower",value:0.52},
			{axis:"City MPG",value:0.14},
			{axis:"Highway MPG",value:0.28}
		  ]
		];

//Options for the Radar chart, other than default
var mycfg = {
  w: w,
  h: h,
  maxValue: 0.8,
  levels: 6,
  ExtraWidthX: 300
}

//Call function to draw the Radar chart
//Will expect that data is in %'s
RadarChart.draw("#chart", d, mycfg);

////////////////////////////////////////////
/////////// Initiate legend ////////////////
////////////////////////////////////////////

var svg = d3.select('#body')
	.selectAll('svg')
	.append('svg')
	.attr("width", w+300)
	.attr("height", h)

//Create the title for the legend
var text = svg.append("text")
	.attr("class", "title")
	.attr('transform', 'translate(90,0)') 
	.attr("x", w - 70)
	.attr("y", 10)
	.attr("font-size", "12px")
	.attr("fill", "#404040");
		
//Initiate Legend	
var legend = svg.append("g")
	.attr("class", "legend")
	.attr("height", 100)
	.attr("width", 200)
	.attr('transform', 'translate(90,20)') 
	;
	//Create colour squares
	legend.selectAll('rect')
	  .data(LegendOptions)
	  .enter()
	  .append("rect")
	  .attr("x", w - 65)
	  .attr("y", function(d, i){ return i * 20;})
	  .attr("width", 10)
	  .attr("height", 10)
	  .style("fill", function(d, i){ return colorscale(i);})
	  ;
	//Create text next to squares
	legend.selectAll('text')
	  .data(LegendOptions)
	  .enter()
	  .append("text")
	  .attr("x", w - 52)
	  .attr("y", function(d, i){ return i * 20 + 9;})
	  .attr("font-size", "11px")
	  .attr("fill", "#737373")
	  .text(function(d) { return d; })
	  ;
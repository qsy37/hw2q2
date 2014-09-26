var outer_width = 530,
    outer_height = 300,
	margin = {top: 10, right: 10, bottom: 10, left: 10},
	width = outer_width - margin.left - margin.right,
	height = outer_height - margin.top - margin.bottom;

var key = function(d) {
	return d.name;
}

var x = d3.scale.ordinal()
	.rangeRoundBands([1, width], 0.05);

var price_y = d3.scale.linear();
var engine_y = d3.scale.linear();
var hp_y = d3.scale.linear();
var mpg_y = d3.scale.linear();
	
var xAxis = d3.svg.axis()
	.scale(x)
	.orient('bottom');
	
var price_svg = d3.select('.price').append('svg')
    .attr('width', width)
    .attr('height', height)
	.append('g')
	.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
	
var engine_svg = d3.select('.engine-size').append('svg')
    .attr('width', width)
    .attr('height', height)
	.append('g')
	.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
	
var hp_svg = d3.select('.horsepower').append('svg')
    .attr('width', width)
    .attr('height', height)
	.append('g')
	.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

var mpg_svg = d3.select('.mpg').append('svg')
    .attr('width', width)
    .attr('height', height)
	.append('g')
	.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
	
var g = price_svg.append('g')
	.attr('class', 'axis');
	//.attr('transform', 'translate(0, ' + (height + margin.bottom) + ')');
	
d3.json('data/cars.json', function(error, data) {
	data = data.slice(0,5);
	x.domain(data.map(key));	
	
	price_y.domain([d3.min(data, function(d) { return +d.msrp; }),
			  d3.max(data, function(d) { return +d.msrp; })])
		.range([height*0.2, height]);
		
	engine_y.domain([d3.min(data, function(d) { return +d.engine_size; }),
			  d3.max(data, function(d) { return +d.engine_size; })])
		.range([height*0.2, height]);
			  
	hp_y.domain([d3.min(data, function(d) { return +d.horsepower; }),
			  d3.max(data, function(d) { return +d.horsepower; })])
		.range([height*0.2, height]);

	mpg_y.domain([d3.min(data, function(d) { return +d.cmpg; }),
			  d3.max(data, function(d) { return +d.cmpg; })])
		.range([height*0.2, height]);		

	//xAxis.ticks(data.length);

	//g.call(xAxis);
		
	var price_bars = g.selectAll('rect')
		.data(data, key)
		.enter();
		
	price_bars.append('rect')
		.attr('class', 'bar')
		.attr('height', function(d) { return price_y(+d.msrp); })
		.attr('width', function(d) { return x.rangeBand(); })
		.attr('x', function(d, i) { return x(i); })
		.attr('y', function(d) { return height-price_y(+d.msrp); })
		.attr('fill', '#ff7e47');

	var engine_bars = engine_svg.selectAll('rect')
		.data(data, key)
		.enter();
		
	engine_bars.append('rect')
		.attr('class', 'bar')
		.attr('height', function(d) { return engine_y(+d.engine_size); })
		.attr('width', function(d) { return x.rangeBand(); })
		.attr('x', function(d, i) { return x(i); })
		.attr('y', function(d) { return height-engine_y(+d.engine_size); })
		.attr('fill', '#ff7e47');
		
		

	var hp_bars = hp_svg.selectAll('rect')
		.data(data, key)
		.enter();
		
	hp_bars.append('rect')
		.attr('class', 'bar')
		.attr('height', function(d) { return hp_y(+d.horsepower); })
		.attr('width', function(d) { return x.rangeBand(); })
		.attr('x', function(d, i) { return x(i); })
		.attr('y', function(d) { return height-hp_y(+d.horsepower); })
		.attr('fill', '#ff7e47');

	var mpg_bars = mpg_svg.selectAll('rect')
		.data(data, key)
		.enter();
		
	mpg_bars.append('rect')
		.attr('class', 'bar')
		.attr('height', function(d) { return mpg_y(+d.cmpg); })
		.attr('width', function(d) { return x.rangeBand(); })
		.attr('x', function(d, i) { return x(i); })
		.attr('y', function(d) { return height-mpg_y(+d.cmpg); })
		.attr('fill', '#ff7e47');		
		
});
var margin = {top: 50, right: 50, bottom: 70, left: 50},
	width = 500 - margin.left - margin.right,
	height = 400 - margin.top - margin.bottom;

var key = function(d) {
	return d.name;
}

var x = d3.scale.ordinal()
	.rangeRoundBands([0, width], 0.2);	
	
var x0 = d3.scale.ordinal()
	.rangeRoundBands([0, width], 0.1);

var x1 = d3.scale.ordinal();

var y = d3.scale.linear()
	.range([height, 0]);
	
var xAxis = d3.svg.axis()
		.scale(x)
		.orient('bottom')	
		
var grouped_xAxis = d3.svg.axis()
		.scale(x0)
		.orient('bottom')	
	
var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")	

var color = d3.scale.ordinal()
		.range(['#006ba4', '#ff800e', '#ababab', '#5f9ed1', '#595959']);
	
var mpg_svg = d3.select('.mpg').append('svg')
		.attr('width', width + margin.left + margin.right + 300)
		.attr('height', height + margin.top + margin.bottom)
		.append('g')
		.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
	
var attribute_list = ['msrp', 'engine_size', 'horsepower'];
var svg = {};
attribute_list.forEach(function(entry) {
	svg[entry] = d3.select('.' + entry).append('svg')
		.attr('width', width + margin.left + margin.right)
		.attr('height', height + margin.top + margin.bottom)
		.append('g')
		.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
});
	
d3.json('data/cars.json', function(error, data) {
	data = data.filter(function(d) {return +d.sports === 1; });
	data = data.slice(6, 11);

	x.domain(data.map(key));
	
	attribute_list.forEach(function(entry) {

		var g = svg[entry]
			.append('g')
			.attr('class', 'x axis')
			.attr('transform', 'translate(0,' + height + ')')
			.call(xAxis);
			
		g.selectAll('.tick text')
			.call(wrap, x.rangeBand());
		
		var y = d3.scale.linear()
			.domain([0, d3.max(data, function(d) { return +d[entry]; })])
			.range([height, 0]);	

		var yAxis = d3.svg.axis()
			.scale(y)
			.orient('left');
		
		svg[entry].append('g')
			.attr('class', 'y axis')
			.call(yAxis);
			
		var bars = svg[entry].selectAll('rect')
			.data(data, key)
			.enter();

		bars.append('rect')
			.attr('class', 'bar')
			.attr('height', function(d) { return height-y(+d[entry]); })
			.attr('width', function(d) { return x.rangeBand(); })
			.attr('x', function(d, i) { return x(d.name); })
			.attr('y', function(d) { return y(+d[entry]); })
			.attr("fill", function(d){ return color(key(d)); });	
	});
	
	build_grouped_bars();
	
	
	
function build_grouped_bars() {
	
	
	var keys = ['City MPG', 'Hwy MPG'];
	var mpg = [{name: 'cmpg'}, {name: 'hmpg'}];
		
	mpg.forEach( function(d) {
		d.cars = data.map(function(car) { return {name: car.name, value: +car[d.name]}; }); 
	});
		
		x0.domain(keys);
		x1.domain(data.map(key)).rangeRoundBands([0, x0.rangeBand()], 0.2);
				
		y.domain([0, d3.max(mpg, function(d) { return d3.max(d.cars, function(d) { return d.value; }); })]);
		
		mpg_svg.append("g")
				.attr("class", "x axis")
				.attr("transform", "translate(0," + height + ")")
				.call(grouped_xAxis);

		mpg_svg.append("g")
				.attr("class", "y axis")
				.call(yAxis);
				
		var bars = mpg_svg.selectAll('.bar')
				.data(mpg)
			.enter().append('g')
				.attr('class', 'g')
				.attr('transform', function(d) { return 'translate(' + x0(d.name) + ',0)'; });
				
		bars.selectAll('rect')
				.data(function(d) { return d.cars; })
			.enter().append('rect')
				.attr('width', x1.rangeBand())
				.attr('x', function(d) { return x1(d.name); })
				.attr('y', function(d) { return y(d.value); })
				.attr('height', function(d) { return height - y(d.value); })
				.style('fill', function(d) { return color(d.name); });
				
		var legend = mpg_svg.selectAll('.legend')
				.data(data.map(key))
			.enter().append('g')
				.attr('class', 'legend')
				.attr('transform', function(d, i) { return 'translate(200,' + i*20 + ')'; });
				
		legend.append('rect')
			.attr('x', width - 18)
			.attr('width', 18)
			.attr('height', 18)
			.style('fill', color);
			
		legend.append('text')
			.attr('x', width - 24)
			.attr('y', 9)
			.attr('dy', '.35em')
			.style('text-anchor', 'end')
			.text(function(d) { return d; });
			
}

});

function wrap(text, width) {
  text.each(function() {
    var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.1, // ems
        y = text.attr("y"),
        dy = parseFloat(text.attr("dy")),
        tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
    while (word = words.pop()) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
      }
    }
  });
}
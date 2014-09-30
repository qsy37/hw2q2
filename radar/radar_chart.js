var margin = {left: 40, right: 40, top: 40, bottom: 40},
	width = 400,
	height = 400,
	axis_length = 300,
	radians = 2*Math.PI,
	num_attributes = 5,
	radius = Math.min(width/2, height/2);
	
	var theta = 360/num_attributes;
	
	var svg = d3.select('.vis').append('svg')
		.attr('width', width)
		.attr('height', height)
		.append('g');
	
	for (var j = 0; j < num_attributes; j++ ) {
		svg.append('svg:line')
			.attr('x1', width/2)
			.attr('y1', height/2)
			.attr('x2', width/2*(1-Math.sin(j*radians/num_attributes)))
			.attr('y2', height/2*(1-Math.cos(j*radians/num_attributes)))
			.style("stroke", "grey")
			.style("stroke-opacity", "0.75")
			.style("stroke-width", "1px");
	}
	
	var price_y = d3.scale.linear()
		.rangeRound([0, axis_length]);
	var engine_y = d3.scale.linear()
		.rangeRound([0, axis_length]);
	var horsepower_y = d3.scale.linear()
		.rangeRound([0, axis_length]);
	var cmpg_y = d3.scale.linear()
		.rangeRound([0, axis_length]);
	var hmpg_y = d3.scale.linear()
		.rangeRound([0, axis_length]);
	var color = d3.scale.ordinal()
		.range(['#006ba4', '#ff800e', '#ababab', '#5f9ed1']);
	
	
	var value = 300;
	d3.json('manu.json', function(error, data) {
		data = data.slice(0,5);
		dataset = [];
		
		price_y.domain([0, d3.max(data, function(d) { return +d.msrp; })]);
		engine_y.domain([0, d3.max(data, function(d) { return +d.engine_size; })]);
		horsepower_y.domain([0, d3.max(data, function(d) { return +d.horsepower; })]);
		cmpg_y.domain([0, d3.max(data, function(d) { return +d.cmpg; })]);
		hmpg_y.domain([0, d3.max(data, function(d) { return +d.hmpg; })]);
		data.forEach(function(d) {
			dataset.push([{name: 'msrp', value: price_y(+d.msrp)},
						  {name: 'engine_size', value: engine_y(+d.engine_size)},
						  {name: 'horsepower', value: horsepower_y(+d.horsepower)},
						  {name: 'cmpg', value: cmpg_y(+d.cmpg)},
						  {name: 'hmpg', value: hmpg_y(+d.hmpg)}]);
		});
		//console.log(data);
		
		//dataset = dataset[0];
		console.log(dataset);
		//dataset.forEach(function(manu, k) {
			//console.log(manu);
			//console.log(k);
		var manufacturer = svg.selectAll('.manu')
			.data(dataset)
			.enter()
			.append('g').datum(function(d, k) {
				//var temp = {data: d.map(function(i) { return i;}), k: k};
				//console.log(temp);
				//return temp;
				d.forEach(function(i) { i.k = k; });
				return d;
				}).attr('class', 'manu')
			.selectAll('.attrib').data(function(d) { 
			/*
				d.data.k = d.k;
				console.log(d.data);
				return d.data; */
				return d;
				})
			.enter()
			.append('svg:circle')
				.attr('class', 'node')
				.attr('cx', function(d, j) { 
					//console.log([width/2*(1 - d.value/height*Math.sin(j*radians/num_attributes)),
						 //height/2 *(1 - d.value/height*Math.cos(j*radians/num_attributes))]);
					//pts.push([width/2*(1 - d.value/height*Math.sin(j*radians/num_attributes)),
						 //height/2 *(1 - d.value/height*Math.cos(j*radians/num_attributes))]);
					return width/2*(1 - d.value/height*Math.sin(j*radians/num_attributes)); })
				.attr('cy', function(d, j) { 
					return height/2 *(1 - d.value/height*Math.cos(j*radians/num_attributes)); })
				.attr('r', 5)
				.attr('fill', function(d) { return color(d.k); });
			
			
			//console.log(pts);
			/*var poly = manufacturer.selectAll('.poly')
				//.data([pts])
				//.enter()
				.append('svg:polygon')
				.attr('points', function(d) {
					pt_str = '';
					//console.log(d);
					for(var j = 0; j < d.length; j++ ) {
						pt_str = pt_str + d[j][0] + ',' + d[j][1] + ' ';
					}
					return pt_str;
				})
				.attr('stroke', color(d.k))
				.attr('stroke-width', '1px')
				.attr('fill', color(d.k))
				.attr('fill-opacity', '0.25');*/
		//});
	});
			
	
	/*for (var j = 0; j < 5; j++ ) {
		
		svg.append('svg:line')
			.attr('x1', width/2)
			.attr('y1', height/2)
			.attr('x2', width/2*(1-Math.sin(j*radians/num_attributes)))
			.attr('y2', height/2*(1-Math.cos(j*radians/num_attributes)))
			.style("stroke", "grey")
			.style("stroke-opacity", "0.75")
			.style("stroke-width", "1px");
		
		var value = 200;
		svg.append('svg:circle')
			.attr('cx', width/2*(1 - value/height*Math.sin(j*radians/num_attributes)))
			.attr('cy', height/2 *(1 - value/height*Math.cos(j*radians/num_attributes)))
			.attr('r', 5)
			.attr('fill', 'orange');
		
		
		
		pts.push([width/2*(1 - value/height*Math.sin(j*radians/num_attributes)),
					 height/2 *(1 - value/height*Math.cos(j*radians/num_attributes))]);
		
		
	}
	
	svg.append('svg:polygon')
		.data([pts])
		.attr('points', function(d) {
			pt_str = '';
			for(var j = 0; j < d.length; j++ ) {
				pt_str = pt_str + d[j][0] + ',' + d[j][1] + ' ';
			}
			return pt_str;
		})
		.attr('stroke', 'orange')
		.attr('stroke-width', '1px')
		.attr('fill', 'orange')
		.attr('fill-opacity', '0.25');
*/	
		
/*	var y = d3.scale.linear()
		.domain([0, 1])
		.range([0, axis_length]);
	
	'translate(100, 100) rotate(-45 0 0)'
	
	var axis = d3.svg.axis()
		.scale(y)
		.orient('bottom')
		.ticks(0);
		
	var gAxis = g.append('g')
		.attr('class', 'axis')
		.call(axis);
*/			
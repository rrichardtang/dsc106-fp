function finalproject(){
    var filePath="cleaning_data.csv";
    question1(filePath);
    question2(filePath);
    question4(filePath);
    question5(filePath);
    question6(filePath);
}

var question1=function(filePath){
	var parseTime = d3.timeParse("%Y-%m");
    var rowConverter = function(d){
		return {
            case_month: parseTime(d.case_month),
			res_state: d.res_state,
            state_fips_code: d.state_fips_code,
			res_county: d.res_county,
            county_fips_code: d.county_fips_code,
            age_group: d.age_group,
            sex: d.sex,
			race: d.race,
			symptom_status: d.symptom_status,
            hosp_yn: d.hosp_yn,
            death_yn: d.death_yn,
            underlying_conditions_yn: d.underlying_conditions_yn
		};
	}

	var file_data = d3.csv(filePath, function(d){
		if (d.symptom_status == "Symptomatic") {
            	return rowConverter(d);
        }
	});

	file_data.then(function(d) {
		var grouped = Array.from(d3.rollup(d, v => v.length, d => d.case_month));
		var max_cases = d3.max(grouped, function(row) { return row[1]; });
    	
    	var flattened = [];

    	for (i = 0; i < grouped.length; i++) {
    		const curr_date = grouped[i][0];
    		const curr_cases = grouped[i][1];
    		var curr_year = curr_date.getFullYear();

    		flattened.push({year: curr_year, date: curr_date, cases: curr_cases});
    	}

    	var width = 1000;
        var height = 800;
        var margin = 120;

		var svg_q1 = d3.select("#q1_plot").append("svg")
                                          .attr("width", width)
                                          .attr("height", height)
                                          .append("g")
                                          .attr("transform", "translate(100, -20)")

        function plot(dataset, year) {
        	var xScale = d3.scaleTime().domain(d3.extent(dataset, item => item.date)).range([margin, width-margin]);
        	var yScale = d3.scaleLinear().domain([0, max_cases])
                                     .range([height-margin, margin])

        	var xAxis = d3.axisBottom(xScale).ticks(dataset.length).tickFormat(d3.timeFormat("%m-%Y"))
        	var yAxis = d3.axisLeft(yScale)

        	var ToolTip = d3.select("#q1_plot").append("div").style("opacity", 0).attr("class", "tooltip");

        	svg_q1.append("g").attr("class", "axis").attr("transform", "translate(100,0)").call(yAxis).append("text").attr("text-anchor", "end")
        	svg_q1.append("g").attr("class", "axis").attr("transform", "translate(0,700)").call(xAxis).selectAll("text").attr("text-anchor", "end").attr("transform", "rotate(-45)")

	        svg_q1.append("path").attr("class", "line").datum(dataset).attr("fill", "none")
                                      .attr("stroke", "green")
                                      .attr("stroke-width", 1.5)
                                      .attr("d", d3.line()
                                        .x(function(item) {
                                        	return xScale(item.date);
                                        	})
                                        .y(function(item) {
                                            	return yScale(item.cases);
                                            }))  

        	svg_q1.selectAll(".q1scatter").data(dataset)
                                    .enter()
                                    .append("circle")
                                    .attr("class", "q1scatter")
                                    .attr("cx", function(item) {
                                        		return xScale(item.date);
                                        	})
                                    .attr("cy", function(item) {
                                        		return yScale(item.cases);
                                        	})
                                    .attr("r", 5)
                                    .on("mouseover", function(e, d) {
                                        ToolTip.transition().duration(100).style("opacity", 0.9)
                                        ToolTip.html(d.cases).style("left", e.pageX + "px").style("top", e.pageY + "px")
                                    }).on("mousemove", function(e, d) {
                                        ToolTip.transition().duration(100).style("opacity", 0.9)
                                        ToolTip.html(d.cases).style("left", e.pageX + "px").style("top", e.pageY + "px")
                                    }).on("mouseout", function(e, d) {
                                        ToolTip.style("opacity", 0)
                                    })

            svg_q1.append("text")             
            .attr("transform", "translate(" + ((width-margin)/2) + " ," + (height - 20) + ")")
            .style("text-anchor", "middle")
            .text("Date");

        	svg_q1.append("text")             
            .attr("transform", "translate(20," + ((height-margin)/2) + ")rotate(90)")
            .style("text-anchor", "middle")
            .text("# of COVID-19 Cases");

            svg_q1.append("text")             
            .attr("transform", "translate(" + ((width-margin)/2) + " ," + (margin / 2) + ")")
            .style("text-anchor", "middle")
            .text("# of COVID-19 Cases by Date");
	    }

        plot(flattened, "All")
        
        function changeYear() {

			d3.selectAll("g.axis").remove()
        	d3.selectAll("path.line").remove()
            d3.selectAll(".q1scatter").remove()

        	var radioValue = d3.select("input[name='year']:checked").node().value;

            if (radioValue != "All") {
            	var sub_flattened = flattened.filter(function (item) {
		        	return (item.year == radioValue)
		    	})
		        plot(sub_flattened, radioValue)
            } else {
            	plot(flattened, radioValue)
            }
        }

        d3.select("#q1_All").on("change", changeYear)
        d3.select("#q1_2020").on("change", changeYear)
        d3.select("#q1_2021").on("change", changeYear)
        d3.select("#q1_2022").on("change", changeYear)
    })
}

var question2=function(filePath){
    var rowConverter = function(d){
		var sampleAge = function(group) {
			if (group == "65+ years") {
				return d3.randomUniform(65, 85)()
			} else if (group == "18 to 49 years") {
				return d3.randomUniform(18, 49)()
			} else if (group == "50 to 64 years") {
				return d3.randomUniform(50, 64)()
			} else {
				return d3.randomUniform(0, 17)()
			}
		}

		return {
			case_month: d.case_month,
			res_state: d.res_state,
            state_fips_code: d.state_fips_code,
			res_county: d.res_county,
            county_fips_code: d.county_fips_code,
            age_group: d.age_group,
            sex: d.sex,
			race: d.race,
			symptom_status: d.symptom_status,
            hosp_yn: d.hosp_yn,
            death_yn: d.death_yn,
            underlying_conditions_yn: d.underlying_conditions_yn,
			age: sampleAge(d.age_group),
			case_positive_specimen_interval: parseFloat(d["case_positive_specimen_interval"]),
            case_onset_interval: parseFloat(d["case_onset_interval"])
		};
	}

    var file_data = d3.csv(filePath, function(d) {
        if (d.symptom_status == "Symptomatic") {
        	return rowConverter(d);
        }
    });

    file_data.then(function(d){
		var width = 1000;
        var height = 800;
        var margin = 110;

        var svg_q2 = d3.select("#q2_plot").append("svg")
                                          .attr("width", width)
                                          .attr("height", height)
                                          .append("g")
                                          .attr("transform", "translate(100, -20)")

        var xScale = d3.scaleLinear().domain([0, d3.max(d, function(item){ 
							return item.age;
						})]).range([margin, width-margin]);
    	var yScale = d3.scaleLinear().domain([0, d3.max(d, function(item){ 
							return item.case_positive_specimen_interval;
						})]).range([height-margin, margin])

    	var xAxis = d3.axisBottom(xScale)
    	var yAxis = d3.axisLeft(yScale)

    	svg_q2.append("g").attr("class", "axis").attr("transform", "translate(100,0)").call(yAxis).append("text").attr("text-anchor", "end")
    	svg_q2.append("g").attr("class", "axis").attr("transform", "translate(0,700)").call(xAxis).selectAll("text").attr("text-anchor", "end").attr("transform", "rotate(-45)")

    	svg_q2.selectAll(".q2scatter").data(d)
                                .enter()
                                .append("circle")
                                .attr("class", "q2scatter")
                                .attr("cx", function(item) {
                                    	return xScale(item.age);
                                    	})
                                .attr("cy", function(item) {
                                			if (item.case_positive_specimen_interval > 0) {
                                				return yScale(item.case_positive_specimen_interval);
                                			}
                                    	})
                                .attr("r", 1)

        svg_q2.append("text")             
        .attr("transform", "translate(" + ((width-margin)/2) + " ," + (height - 10) + ")")
        .style("text-anchor", "middle")
        .text("Age");

    	svg_q2.append("text")             
        .attr("transform", "translate(0," + ((height-margin)/2) + ")rotate(90)")
        .style("text-anchor", "middle")
        .text("Weeks Until Tested Positive");

        svg_q2.append("text")             
            .attr("transform", "translate(" + ((width-margin)/2) + " ," + (margin / 2) + ")")
            .style("text-anchor", "middle")
            .text("Age vs Weeks Until Tested Positive");
	})
}

var question4=function(filePath){
	var parseTime = d3.timeParse("%Y-%m");
    var rowConverter = function(d){
		return {
			case_month: parseTime(d.case_month),
			res_state: d.res_state,
            state_fips_code: d.state_fips_code,
			res_county: d.res_county,
            county_fips_code: d.county_fips_code,
            age_group: d.age_group,
            sex: d.sex,
			race: d.race,
			symptom_status: d.symptom_status,
            hosp_yn: d.hosp_yn,
            death_yn: d.death_yn,
            underlying_conditions_yn: d.underlying_conditions_yn
		};
	}

    const file_data = d3.csv(filePath, rowConverter);
    file_data.then(function(data){
		var groupby = d3.group(data, function(d){
            return d.death_yn == "Yes";
        })
        var valid_data = groupby.get(true);
		
        var years = ["2020", "2021", "2022"];
		var crrent_year = years[0];
		var gender = ["Male", "Female"];
		var final = {};

		for (let i = 0; i < years.length; i++) {
			var year_count = [];
			for (let j = 0; j < gender.length; j++) {
				var dic = {"Gender": gender[j], "Symptomatic": 0, "Asymptomatic": 0};
				for (let k = 0; k < valid_data.length; k++) {
					const curr = valid_data[k];
					if (curr.case_month.getFullYear() == years[i] && curr.sex == gender[j]) {
						dic[curr.symptom_status] += 1;
					}
				}
				year_count.push(dic);
			}
			final[years[i]] = year_count;
		}

		console.log(final);

        var colors = function(i){
			colorarray = ["#64469e", "#c3c3df"];
			return colorarray[i];
		}

		var stack = d3.stack().keys(["Symptomatic", "Asymptomatic"]);
		var current_data = stack(final[crrent_year]);
		console.log(current_data);

        var width = 600;
        var height = 600;
        var padding = 70;

		var tooltip = d3.select("#q4_plot").append("div")
                            .style("opacity", 0)
                            .style("background-color", "white")
                            .style("position", "absolute")
                            .style("border-width", "2px")
                            .style("border-radius", "5px")
                            .style("padding", "5px");

		var svg = d3.select("#q4_plot").append("svg")
				.attr("height", height)
				.attr("width", width);

		svg.append("text")
			.attr("x", width/2)
			.attr("y", padding/2)
			.text("COVID Death for Symptomatic and Asymptomatic by Gender")
			.style("font-size", "16px")
			.attr("text-anchor", "middle");

		var x = d3.scaleBand()
						.domain(gender)
						.range([padding, width-padding])
						.padding(0.5);

		var y = d3.scaleLinear()
						.domain([0, d3.max(final[crrent_year], function(d){ 
							return d.Symptomatic + d.Asymptomatic;
						})])
						.range([height-padding, padding]);
        
        var x_axis = d3.axisBottom().scale(x);
        var y_axis = d3.axisLeft().scale(y);

		var groups = svg.selectAll(".gbars")
							.data(current_data).enter().append("g")
							.attr("class", "gbars")
							.attr("fill", function(d, i){
								return colors(i);
							});

		groups.selectAll(".gbars")
					.data(function(d){
						return d;
					}).enter().append("rect")
					.attr("x", function(d){
					    return x(d.data.Gender);
					})
    				.attr("y", function (d) {
						return y(d[1]);
					})
					.attr("width", x.bandwidth())
					.attr("height", function(d){
						return y(d[0])-y(d[1]);
					})
					.on("mouseover", (e,d)=>{
                        tooltip.style("opacity", 1);
                    })
                    .on("mousemove", (e,d)=>{
                        tooltip.html((d[1] - d[0])).style("left", e.pageX + "px").style("top", e.pageY + "px");
                    })
                    .on("mouseout", (e,d)=>{
                        tooltip.style("opacity", 0);
                    });

		svg.append("g").call(x_axis).attr("class", "x_axis")
                .attr("transform", "translate(0," + (height - padding) + ")");
        
        svg.append("g").call(y_axis).attr("class", "y_axis")
				.attr("transform", "translate(" + padding + ",0)");

		function change_plot(data) {
			var current_data = stack(data);
			d3.selectAll(".gbars").remove();
			d3.selectAll(".y_axis").remove();

			y.domain([0, d3.max(data, function(d){ 
									return d.Symptomatic + d.Asymptomatic;
							})]);
			svg.append("g").call(y_axis).attr("class", "y_axis")
					.attr("transform", "translate(" + padding + ",0)");

			var groups = svg.selectAll(".gbars")
							.data(current_data).enter().append("g")
							.attr("class", "gbars")
							.attr("fill", function(d, i){
								return colors(i);
							});

			groups.selectAll(".gbars")
					.data(function(d){
						return d;
					}).enter().append("rect")
					.attr("x", function(d){
					    return x(d.data.Gender);
					})
    				.attr("y", function (d) {
						return y(d[1]);
					})
					.attr("width", x.bandwidth())
					.attr("height", function(d){
						return y(d[0])-y(d[1]);
					})
					.on("mouseover", (e,d)=>{
                        tooltip.style("opacity", 1);
                    })
                    .on("mousemove", (e,d)=>{
                        tooltip.html((d[1] - d[0])).style("left", e.pageX + "px").style("top", e.pageY + "px");
                    })
                    .on("mouseout", (e,d)=>{
                        tooltip.style("opacity", 0);
                    });
		}

		d3.select("#radio_4").attr("name", "year2")
                .on("change", function(d) {
                    change_plot(final[d.target.value]);
                })
        
		svg.append("circle").attr("cx",480).attr("cy",80).attr("r", 6).style("fill", "#64469e")
        svg.append("circle").attr("cx",480).attr("cy",100).attr("r", 6).style("fill", "#c3c3df")
        svg.append("text").attr("x", 500).attr("y", 80).text("Symptomatic").style("font-size", "15px").attr("alignment-baseline","middle").style("fill", "#64469e")
        svg.append("text").attr("x", 500).attr("y", 100).text("Asymptomatic").style("font-size", "15px").attr("alignment-baseline","middle").style("fill", "#c3c3df")

		svg.append("text")             
            .attr("transform", "translate(" + ((width-padding)/2) + " ," + (height-35) + ")")
            .text("Gender");
		
		svg.append("text")             
			.attr("transform", "translate(0," + ((height-padding)/2) + ")rotate(90)")
			.style("text-anchor", "middle")
			.text("# of COVID Death");
    })
}

var question5=function(filePath){
	var rowConverter = function(d){
		return {
            case_month: d.case_month,
			res_state: d.res_state,
            state_fips_code: d.state_fips_code,
			res_county: d.res_county,
            county_fips_code: d.county_fips_code,
            age_group: d.age_group,
            sex: d.sex,
			race: d.race,
			symptom_status: d.symptom_status,
            hosp_yn: d.hosp_yn,
            death_yn: d.death_yn,
            underlying_conditions_yn: d.underlying_conditions_yn
		};
	}

	const file_data = d3.csv(filePath, rowConverter);
    file_data.then(function(data){
		var month = [];
		var deaths = [];
		var hosp = [];

        for (let i = 0; i < data.length; i++) {
            if (!month.includes(data[i].case_month)) {
                month.push(data[i].case_month);
            }
        }

        month.sort();

		for (let i = 0; i < month.length; i++) {
			var count_death = 0;
			var count_hosp = 0;
			for (let j = 0; j < data.length; j++) {
				const curr = data[j];
				if (curr.case_month == month[i]) {
					if (curr.death_yn == "Yes") {
						count_death += 1;
					}
					if (curr.hosp_yn == "Yes") {
						count_hosp += 1;
					}
				}
			}
			deaths.push(count_death);
			hosp.push(count_hosp);
		}

		function stats(data) {
			var q1 = d3.quantile(data.sort(d3.ascending),.25);
			var median = d3.quantile(data.sort(d3.ascending),.5);
			var q3 = d3.quantile(data.sort(d3.ascending),.75);
			var interQuantileRange = q3 - q1;
			var min = d3.min(data);
			var max = d3.max(data);
			return ({q1: q1, median: median, q3: q3, interQuantileRange: interQuantileRange, min: min, max: max})
		}

		var final = [{"key": "Dead", "val": stats(deaths)}, {"key": "Hospitalized", "val": stats(hosp)}];
		console.log(final);

		var color = d3.scaleOrdinal()
                        .domain(["Dead", "Hospitalized"])
                        .range(["red", "#fca36e"]);
		
		var width = 500;
        var height = 500;
		var boxwidth = 100;
        var padding = 70;

		var svg = d3.select("#q5_plot").append("svg")
				.attr("height", height)
				.attr("width", width);
		
		svg.append("text")
			.attr("x", width/2)
			.attr("y", padding/2)
			.text("Box Plots")
			.style("font-size", "16px")
			.attr("text-anchor", "middle")
			.style("fill", "black");

		var x = d3.scaleBand()
						.domain(["Dead", "Hospitalized"])
						.range([padding, width-padding])
						.paddingInner(1)
    					.paddingOuter(.5);

		var y = d3.scaleLinear()
						.domain([0, 15000])
						.range([height-padding, padding]);
        
        var x_axis = d3.axisBottom().scale(x);
        var y_axis = d3.axisLeft().scale(y);

		svg.selectAll("vertLines")
			.data(final)
			.enter()
			.append("line")
			.transition()
			.duration(1000)
			.attr("x1", function(d){
				return x(d.key);
			})
			.attr("x2", function(d){
				return x(d.key);
			})
			.attr("y1", function(d){
				return y(d.val.min);
			})
			.attr("y2", function(d){
				return y(d.val.max)
			})
			.attr("stroke", "black")
			.style("width", 40)

		svg.selectAll("boxes")
			.data(final)
			.enter()
			.append("rect")
			.transition()
			.duration(1000)
			.attr("x", function(d){
				return x(d.key)-boxwidth/2;
			})
			.attr("y", function(d){
				return y(d.val.q3);
			})
			.attr("height", function(d){
				return y(d.val.q1)-y(d.val.q3);
			})
			.attr("width", boxwidth)
			.attr("stroke", "black")
			.style("fill", d=>color(d.key))
		
		svg.selectAll("median")
			.data(final)
			.enter()
			.append("line")
			.transition()
			.duration(1000)
			.attr("x1", function(d){
				return x(d.key)-boxwidth/2;
			})
			.attr("x2", function(d){
				return x(d.key)+boxwidth/2;
			})
			.attr("y1", function(d){
				return y(d.val.median);
			})
			.attr("y2", function(d){
				return y(d.val.median);
			})
			.attr("stroke", "black")
			.style("width", 80)

		svg.selectAll("min")
			.data(final)
			.enter()
			.append("line")
			.transition()
			.duration(1000)
			.attr("x1", function(d){
				return x(d.key)-boxwidth/2;
			})
			.attr("x2", function(d){
				return x(d.key)+boxwidth/2;
			})
			.attr("y1", function(d){
				return y(d.val.min);
			})
			.attr("y2", function(d){
				return y(d.val.min);
			})
			.attr("stroke", "black")
			.style("width", 80)

		svg.selectAll("max")
			.data(final)
			.enter()
			.append("line")
			.transition()
			.duration(1000)
			.attr("x1", function(d){
				return x(d.key)-boxwidth/2;
			})
			.attr("x2", function(d){
				return x(d.key)+boxwidth/2;
			})
			.attr("y1", function(d){
				return y(d.val.max);
			})
			.attr("y2", function(d){
				return y(d.val.max);
			})
			.attr("stroke", "black")
			.style("width", 80)

		var zoomBoxes = d3.zoom()
						  .on("zoom",function(e,d){
						  	svg.attr("transform",e.transform)
						  });
		svg.call(zoomBoxes);

		svg.append("g").call(x_axis).attr("class", "x_axis")
                .attr("transform", "translate(0," + (height - padding) + ")");
        
        svg.append("g").call(y_axis).attr("class", "y_axis")
				.attr("transform", "translate(" + padding + ",0)");	
				
		svg.append("text")
            .attr("transform", "translate(" + ((width-padding)/2) + " ," + (height-15) + ")")
            .text("Status");

		svg.append("text")             
			.attr("transform", "translate(0," + ((height-70)/2) + ")rotate(90)")
			.style("text-anchor", "middle")
			.text("# of Patient Each Month");
	})
}

var question6=function(filePath){
    var rowConverter = function(d){
		return {
            case_month: d.case_month,
			res_state: d.res_state,
            state_fips_code: d.state_fips_code,
			res_county: d.res_county,
            county_fips_code: d.county_fips_code,
            age_group: d.age_group,
            sex: d.sex,
			race: d.race,
			symptom_status: d.symptom_status,
            hosp_yn: d.hosp_yn,
            death_yn: d.death_yn,
            underlying_conditions_yn: d.underlying_conditions_yn
		};
	}

    const file_data = d3.csv(filePath, rowConverter);
    file_data.then(function(data){
		var groupby = d3.group(data, function(d){
            return d.hosp_yn == "Yes";
        })
        var valid_data = groupby.get(true);

		var month = [];
        var count = [];

        for (let i = 0; i < valid_data.length; i++) {
            if (!month.includes(valid_data[i].case_month)) {
                month.push(valid_data[i].case_month);
            }
        }

        month.sort();

        for (let j = 0; j < month.length; j++) {
            var dic = {"Month": month[j], "Male": 0, "Female": 0};
            for (let k = 0; k < valid_data.length; k++) {
                const curr = valid_data[k];
                if (month[j] == curr.case_month) {
                    dic[curr.sex] += 1;
                }
            }
            count.push(dic);
        }

        console.log(count);

        var width = 1200;
        var height = 600;
        var padding = 70;

		var svg = d3.select("#q6_plot").append("svg")
				.attr("height", height)
				.attr("width", width);
		
		svg.append("text")
			.attr("x", width/2)
			.attr("y", padding/2)
			.text("Number of Hospitalized By Gender")
			.style("font-size", "16px")
			.attr("text-anchor", "middle")
			.style("fill", "black");

		var x = d3.scaleBand()
						.domain(count.map(function(d){
                            return d.Month;
                        }))
						.range([padding, width-padding]);

		var y = d3.scaleLinear()
						.domain([-8000, 8000])
						.range([height-padding, padding]);
        
        var x_axis = d3.axisBottom().scale(x);
        var y_axis = d3.axisLeft().scale(y);

		var color = d3.scaleOrdinal()
                        .domain(["Male", "Female"])
                        .range(["#827cb9", "pink"]);

		var stack = d3.stack().offset(d3.stackOffsetSilhouette)
                        .keys(["Female", "Male"])(count);

		console.log(stack)

		svg.selectAll("layers")
                .data(stack).enter().append("path")
                .style("fill", d=>color(d.key))
                .attr("d", d3.area()
                    .x(d=>x(d.data.Month))
                    .y0(d=>y(d[0]))
                    .y1(d=>y(d[1])))

        svg.append("g").call(x_axis).attr("class", "x_axis")
                .attr("transform", "translate(0," + (height - padding) + ")");
        
        svg.append("g").call(y_axis).attr("class", "y_axis")
				.attr("transform", "translate(" + padding + ",0)");

		svg.append("circle").attr("cx",1100).attr("cy",80).attr("r", 6).style("fill", "#827cb9")
        svg.append("circle").attr("cx",1100).attr("cy",100).attr("r", 6).style("fill", "pink")
        svg.append("text").attr("x", 1120).attr("y", 80).text("Male").style("font-size", "15px").attr("alignment-baseline","middle").style("fill", "#827cb9")
        svg.append("text").attr("x", 1120).attr("y", 100).text("Female").style("font-size", "15px").attr("alignment-baseline","middle").style("fill", "pink")

		svg.append("text")
            .attr("transform", "translate(" + ((width-padding)/2) + " ," + (height-15) + ")")
            .text("Month");
		
		svg.append("text")             
			.attr("transform", "translate(0," + ((height-padding)/2) + ")rotate(90)")
			.style("text-anchor", "middle")
			.text("# of Hospitalized");
    })
}

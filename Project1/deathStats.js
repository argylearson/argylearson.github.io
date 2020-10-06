function drawDeathStats(deaths = -1) {

    d3.csv("deaths_age_sex.csv").then((data) => {
        let canvas = d3.select("#deathStatsSvg");

        let maxHeightAge = 250;
        let maxWidthAge = 500;
        let top = 50;
        let left = 50;


        data.forEach(d => {
            d.x = parseFloat(d.x);
            d.y = parseFloat(d.y);
            d.age = age[parseInt(d.age)];
            d.gender = gender[parseInt(d.gender)];
        });


        let groupedByAge = Array.from(d3.group(data, d => d.age).entries());

        let maxValueAge = d3.max(d3.map(groupedByAge, d => d[1].length));
        while (maxValueAge % 10 != 0) {
            maxValueAge += 1;
        }

        if (deaths > 0) {
            data = data.slice(0, deaths);
        }

        groupedByAge = Array.from(d3.group(data, d => d.age).entries());

        let x = d3.scaleBand()
            .domain(age)
            .range([0, maxWidthAge])
            .padding(.7)
            .round(true);
        canvas.append("g")
            .attr("transform", "translate(" + left + "," + (top + maxHeightAge) + ")")
            .call(d3.axisBottom(x).tickSize(0));
        
        let y = d3.scaleLinear()
            .domain([0, maxValueAge])
            .range([maxHeightAge, 0]);
        canvas.append("g")
            .attr("transform", "translate(" + left + "," + top + ")")
            .call(d3.axisLeft(y)
                .ticks(10)
                .tickSize(-maxWidthAge));

        let bars = canvas.selectAll("rect").data(groupedByAge);

        bars.exit().remove();

        bars.enter()
            .append("rect")
            .merge(bars)
            .style("fill", cUmber)
            .attr("x", d => { return x(d[0]) + left;})
            .attr("width", x.bandwidth())
            .attr("y", d => { return y(d[1].length) + top})
            .attr("height", d => { return maxHeightAge - y(d[1].length)});
    });
}
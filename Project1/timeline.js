function drawTimeline() {

    d3.csv("deathdays.csv").then((data) => {
        let canvas = d3.select("#timelineSvg");

        let maxHeight = 200;
        let maxWidth = 550;
        let spacing = 3;
        let top = 50;
        let left = 50;

        let dateParse = d3.timeParse("%e-%b");

        data.forEach(d => {
            d.date = dateParse(d.date);
            d.deaths = parseInt(d.deaths);
        });

        let x = d3.scaleBand()
            .domain(data.map(d => { return d.date; }))
            .range([left, maxWidth])
            .paddingInner(.25)
            .round(true);
        let y = d3.scaleLinear()
            .domain([0, d3.max(data, d => { return parseInt(d.deaths); })])
            .range([maxHeight, 0]);
        let xAxis = d3.axisBottom(x)
            .tickFormat(d3.timeFormat("%e-%b"));
        let yAxis = d3.axisLeft(y)
            .ticks(10);

        canvas.append("g")
            .attr("id", "xAxis")
            .attr("transform", "translate(0," + (top + maxHeight) + ")")
            .call(xAxis)
                .selectAll("text")
                .style("text-anchor", "end")
                .attr("dx", "-.8em")
                .attr("dy", "-.55em")
                .attr("transform", "rotate(-90)");

        canvas.append("g")
            .attr("id", "yAxis")
            .attr("transform", "translate(" + left + ", " + top + ")")
            .call(yAxis)
                .append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", ".71em")
                .style("text-anchor", "end")
                .text("Deaths");


        canvas.selectAll("bar")
            .data(data)
            .enter()
            .append("rect")
            .style("fill", "red")
            .attr("x", d => { return x(d.date); })
            .attr("width", x.bandwidth())
            .attr("y", d => { return y(d.deaths) + top})
            .attr("height", d => { return maxHeight - y(d.deaths)});
    });
}
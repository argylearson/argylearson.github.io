function drawTimeline() {

    d3.csv("deathdays.csv").then((data) => {
        let canvas = d3.select("#timelineSvg");

        let maxHeight = 450;
        let maxWidth = 550;
        let top = 50;
        let left = 50;

        let dateParse = d3.timeParse("%e-%b");


        let totalDeaths = 0;
        data.forEach(d => {
            d.date = dateParse(d.date);
            d.deaths = parseInt(d.deaths);
            totalDeaths += d.deaths;
            d.totalDeaths = totalDeaths;
        });

        let maxValue = d3.max(data, d => { return parseInt(d.deaths); });
        while (maxValue % 10 != 0) {
            maxValue += 1;
        }

        let x = d3.scaleBand()
            .domain(data.map(d => { return d.date; }))
            .range([left, maxWidth])
            .paddingInner(.25)
            .round(true);
        let y = d3.scaleLinear()
            .domain([0, maxValue])
            .range([maxHeight, 0]);
        let xAxis = d3.axisBottom(x)
            .tickFormat(d3.timeFormat("%e-%b"));
        let yAxis = d3.axisLeft(y)
            .ticks(15)
            .tickSize(-maxWidth + left);

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
                .style("text-anchor", "end");

        canvas.append("text")
            .attr("id", "xLabel")
            .attr("text-anchor", "middle")
            .attr("x", maxWidth/2)
            .attr("y", maxHeight + top + 75)
            .attr("font-family", "sans-serif")
            .text("Date (1854)");

        canvas.append("text")
            .attr("id", "yLabel")
            .attr("text-anchor", "middle")
            .attr("x", -maxHeight/2)
            .attr("y", left - 25)
            .attr("font-family", "sans-serif")
            .attr("transform", "rotate(-90)")
            .text("Number of Deaths");

        canvas.append("text")
            .attr("id", "title")
            .attr("text-anchor", "middle")
            .attr("x", maxWidth/2 + left/2)
            .attr("y", top - 25)
            .attr("font-family", "sans-serif")
            .attr("font-weight", "bold")
            .text("Deaths per Day");

        canvas.append("text")
            .attr("id", "title")
            .attr("text-anchor", "middle")
            .attr("x", maxWidth/2 + left/2)
            .attr("y", top - 5)
            .attr("font-family", "sans-serif")
            .text("Hover to Show Cumulative Deaths up to that Date");

        let bars = canvas.selectAll("bar").data(data);

        bars.enter()
            .append("rect")
            .merge(bars)
            .style("fill", cOrange)
            .attr("x", d => { return x(d.date); })
            .attr("width", x.bandwidth())
            .attr("y", d => { return y(d.deaths) + top})
            .attr("height", d => { return maxHeight - y(d.deaths)})
            .on("mouseenter", (e, d) => {
                drawDeaths(d.totalDeaths);
                drawDeathStats(d.totalDeaths);
            });
    });
}
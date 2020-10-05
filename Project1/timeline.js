function drawTimeline() {

    d3.csv("deathdays.csv").then((data) => {
        let canvas = d3.select("#mainSvg");



        let maxValue = d3.max(data.map(d => parseInt(d.deaths)));
        let barCount = data.length;

        let maxHeight = 200;
        let maxWidth = 400;
        let spacing = 3;
        let bottom = 850;
        let left = 50;

        canvas.selectAll("rect")
            .data(data)
            .enter()
                .append("rect")
                .attr("x", (d, i) => {return left + (maxWidth / barCount) * i })
                .attr("y", (d) => {return bottom - (parseInt(d.deaths) / maxValue) * maxHeight})
                .attr("width", (maxWidth / barCount) - spacing)
                .attr("height", (d) => {return (parseInt(d.deaths) / maxValue) * maxHeight})
                .attr("fill", "red");
    });
}
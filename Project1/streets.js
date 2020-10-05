let width;
let height;
let maxSize;
let minSize;


function initMainSvg() {
    drawStreets();
}

function drawStreets() {

    d3.json("streets.json").then((data) => {
        let canvas = d3.select("#mainSvg");
        width = parseInt(canvas.attr("width"));
        height = parseInt(canvas.attr("height"));
        
        maxSize = d3.max(data.map(d => Math.max(d[0].x, d[0].y, d[1].x, d[1].y)));
        minSize = d3.min(data.map(d => Math.min(d[0].x, d[0].y, d[1].x, d[1].y)));

        canvas.selectAll("line")
            .data(data)
            .enter()
                .append("line")
                .attr("x1", (d) => {return pointConversion(d[0]).x})
                .attr("y1", (d) => {return pointConversion(d[0]).y})
                .attr("x2", (d) => {return pointConversion(d[1]).x})
                .attr("y2", (d) => {return pointConversion(d[1]).y})
                .attr("style", "stroke:rgb(0,0,0);stroke-width:2");
    //i tried to find a better way to force synchronous behavior
    }).then(drawPumps).then(drawDeaths);
}

function drawPumps() {

    d3.csv("pumps.csv").then((data) => {
        let canvas = d3.select("#mainSvg");
        data = data.map(d => {return {x: parseInt(d.x), y: parseInt(d.y)}});
        canvas.selectAll("circle")
            .data(data)
            .enter()
                .append("circle")
                .attr("cx", (d) => {return pointConversion(d).x})
                .attr("cy", (d) => {return pointConversion(d).y})
                .attr("r", 5)
                .attr("fill", "green");
    });
}

function drawDeaths() {

    d3.csv("deaths_age_sex.csv").then((data) => {
        let canvas = d3.select("#mainSvg");
        data = data.map(d => {return {x: parseFloat(d.x), y: parseFloat(d.y)}});

        let groupedData = [];

        data.forEach(element => {
            let matched = false;
            groupedData.forEach(group => {
                if (Math.abs(group.x - element.x) < .50) {
                    matched = true;
                    group.elements.push(element);
                }
            });
            if (!matched) {
                groupedData.push( {
                    x: element.x,
                    y: element.y,
                    elements: [element]
                });
            }
        });

        let flattenedData = groupedData.map(d => {return {x: d.x, y: d.y, count: d.elements.length}});

        canvas.selectAll("circle")
            .data(data)
            .enter()
                .append("circle")
                .attr("cx", (d) => {return pointConversion(d).x})
                .attr("cy", (d) => {return pointConversion(d).y})
                .attr("r", 2)
                .attr("fill", "red");
    });
}

function pointConversion(point) {

    return {
        x : (point.x - minSize) / (maxSize - minSize) * width,
        y : height - ((point.y - minSize) / (maxSize - minSize) * width)
    };
}
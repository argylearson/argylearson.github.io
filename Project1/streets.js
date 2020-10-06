let width;
let height;
let maxSize;
let minSize;

//using Wong colorblind safe palette
const cBlack = "rgb(0,0,0)";
const cOrange = "rgb(230, 159, 0)";
const cSky = "rgb(86,180, 233)";
const cCyan = "rgb(0, 158, 115)";
const cYellow = "rgb(240, 228, 66)";
const cBlue = "rgb(0, 114, 178)";
const cUmber = "rgb(213, 94, 0)";
const cPink = "rgb(204, 121, 167)";

const gender = ["male", "female"];
const age = ["0-10", "11-20", "21-40", "41-60", "61-80", ">80"];

function initMainSvg() {
    drawStreets();
}

function drawStreets() {

    d3.json("streets.json").then((data) => {
        let canvas = d3.select("#mainSvg");
        width = parseInt(canvas.attr("width"));
        height = parseInt(canvas.attr("height"));

        canvas.append("text")
            .attr("id", "title")
            .attr("text-anchor", "middle")
            .attr("x", 300)
            .attr("y", 25)
            .attr("font-family", "sans-serif")
            .attr("font-weight", "bold")
            .text("Map of Deaths");

        canvas.append("circle")
            .attr("cx", 370)
            .attr("cy", 10)
            .attr("r", 5)
            .attr("fill", cSky);

        canvas.append("text")
            .attr("id", "title")
            .attr("text-anchor", "start")
            .attr("x", 380)
            .attr("y", 14)
            .attr("font-family", "sans-serif")
            .attr("font-size", "70%")
            .text("Pump Location");

        canvas.append("circle")
            .attr("cx", 370)
            .attr("cy", 30)
            .attr("r", 5)
            .attr("fill", cOrange);

        canvas.append("text")
            .attr("id", "title")
            .attr("text-anchor", "start")
            .attr("x", 380)
            .attr("y", 34)
            .attr("font-family", "sans-serif")
            .attr("font-size", "70%")
            .text("Death Location");

        canvas.append("rect")
            .attr("id", "workhouseRectLegend")
            .attr("x", 470)
            .attr("y", 4)
            .attr("width", 20)
            .attr("height", 15)
            .style("fill", cPink)
            .text("Oxford Street");

        canvas.append("text")
            .attr("id", "title")
            .attr("text-anchor", "start")
            .attr("x", 495)
            .attr("y", 14)
            .attr("font-family", "sans-serif")
            .attr("font-size", "70%")
            .text("Work House");

        canvas.append("rect")
            .attr("id", "breweryRectLegend")
            .attr("x", 470)
            .attr("y", 22)
            .attr("width", 20)
            .attr("height", 15)
            .style("fill", cBlue)
            .text("Oxford Street");

        canvas.append("text")
            .attr("id", "title")
            .attr("text-anchor", "start")
            .attr("x", 495)
            .attr("y", 34)
            .attr("font-family", "sans-serif")
            .attr("font-size", "70%")
            .text("Brewery");


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
                .attr("style", "stroke:" + cBlack + ";stroke-width:2");

        
        canvas.append("text")
            .attr("id", "broadStreetText")
            .attr("x", 191)
            .attr("y", 405)
            .attr("transform", "rotate(-26)")
            .attr("text-anchor", "middle")
            .attr("font-family", "sans-serif")
            .attr("font-size", "70%")
            .attr("font-weight", "bold")
            .style("fill", cUmber)
            .text("Broad Street");

        canvas.append("text")
            .attr("id", "regentStreetText")
            .attr("x", 385)
            .attr("y", 20)
            .attr("transform", "rotate(60)")
            .attr("text-anchor", "middle")
            .attr("font-family", "sans-serif")
            .attr("font-size", "70%")
            .attr("font-weight", "bold")
            .style("fill", cUmber)
            .text("Regent Street");

        canvas.append("text")
            .attr("id", "oxfordStreetText")
            .attr("x", 300)
            .attr("y", 153)
            .attr("transform", "rotate(-9)")
            .attr("text-anchor", "middle")
            .attr("font-family", "sans-serif")
            .attr("font-size", "70%")
            .attr("font-weight", "bold")
            .style("fill", cUmber)
            .text("Oxford Street");

        canvas.append("rect")
            .attr("id", "workhouseRect")
            .attr("x", 138)
            .attr("y", 321)
            .attr("width", 40)
            .attr("height", 30)
            .attr("transform", "rotate(-26)")
            .style("fill", cPink)
            .text("Oxford Street");

        canvas.append("rect")
            .attr("id", "breweryRect")
            .attr("x", 415)
            .attr("y", -220)
            .attr("width", 35)
            .attr("height", 18)
            .attr("transform", "rotate(63)")
            .style("fill", cBlue)
            .text("Oxford Street");
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
                .attr("class", "pumpCircle")
                .attr("cx", (d) => {return pointConversion(d).x})
                .attr("cy", (d) => {return pointConversion(d).y})
                .attr("r", 5)
                .attr("fill", cSky);
    });
}

function drawDeaths(numberOfDeaths = -1) {

    //$(".deathCircle").remove();
    d3.selectAll(".deathCircle").remove();

    d3.csv("deaths_age_sex.csv").then(data => {
        d3.selectAll(".deathCircle").remove();
        return data;
    }).then((data) => {
        let canvas = d3.select("#mainSvg");

        //if (numberOfDeaths > 0) {
        //    data = data.slice(0, numberOfDeaths);
        //}

        data = data.map(d => {return {
            x: parseFloat(d.x), 
            y: parseFloat(d.y),
            age: parseInt(d.age),
            gender: parseInt(d.gender)
        }});

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

        let circles = canvas.selectAll(".deathCircle").data(data);

        circles.exit().remove();

        circles.enter()
                .append("circle")
                .merge(circles)
                .filter((d, i) => { return (i < numberOfDeaths) || (numberOfDeaths < 0)})
                .attr("class", "deathCircle")
                .attr("cx", (d) => {return pointConversion(d).x})
                .attr("cy", (d) => {return pointConversion(d).y})
                .attr("r", 2.5)
                .attr("fill", cOrange)
                .on("mouseenter", (e, d) => {
                    canvas.selectAll('#deathData').remove();
                    canvas.append("text")
                        .attr("id", "deathData")
                        .attr("text-anchor", "start")
                        .attr("x", 10)
                        .attr("y", 25)
                        .attr("font-family", "sans-serif")
                        .attr("font-size", "70%")
                        .text("Age: " + age[d.age] + " Gender: " + gender[d.gender]);
                });
    });
}

function pointConversion(point) {

    return {
        x : (point.x - minSize) / (maxSize - minSize) * width,
        y : height - ((point.y - minSize) / (maxSize - minSize) * width)
    };
}
function drawDeathStats(deaths = -1) {

    d3.csv("deaths_age_sex.csv").then((data) => {
        let canvas = d3.select("#deathStatsSvg");

        let maxHeightAge = 225;
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
        let groupedBySex = Array.from(d3.group(data, d => d.gender).entries());

        let maxValueAge = d3.max(d3.map(groupedByAge, d => d[1].length));
        while (maxValueAge % 10 != 0) {
            maxValueAge += 1;
        }

        let maxValueSex = d3.max(d3.map(groupedBySex, d => d[1].length));
        while (maxValueSex % 10 != 0) {
            maxValueSex += 1;
        }

        if (deaths > 0) {
            data = data.slice(0, deaths);
        }

        groupedByAge = Array.from(d3.group(data, d => d.age).entries());
        groupedBySex = Array.from(d3.group(data, d => d.gender).entries());


        //age

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

        let bars = canvas.selectAll(".ageRect").data(groupedByAge);

        bars.exit().remove();

        bars.enter()
            .append("rect")
            .merge(bars)
            .style("fill", cUmber)
            .attr("class", "ageRect")
            .attr("x", d => { return x(d[0]) + left;})
            .attr("width", x.bandwidth())
            .attr("y", d => { return y(d[1].length) + top})
            .attr("height", d => { return maxHeightAge - y(d[1].length)});

        canvas.append("text")
            .attr("id", "xLabel")
            .attr("text-anchor", "middle")
            .attr("x", maxWidthAge/2 + left)
            .attr("y", maxHeightAge + top + 20)
            .attr("font-family", "sans-serif")
            .attr("font-size", "70%")
            .text("Age Group");

        canvas.append("text")
            .attr("id", "yLabel")
            .attr("text-anchor", "middle")
            .attr("x", -maxHeightAge/2 - top)
            .attr("y", left - 25)
            .attr("font-family", "sans-serif")
            .attr("transform", "rotate(-90)")
            .attr("font-size", "70%")
            .text("Number of Deaths");

        canvas.append("text")
            .attr("id", "title")
            .attr("text-anchor", "middle")
            .attr("x", maxWidthAge/2 + left)
            .attr("y", top - 5)
            .attr("font-family", "sans-serif")
            .attr("font-weight", "bold")
            .text("Deaths by Age Group");



        //gender

        let x2 = d3.scaleBand()
            .domain(gender)
            .range([0, maxWidthAge])
            .padding(.3)
            .round(true);
        canvas.append("g")
            .attr("transform", "translate(" + left + "," + (2 * (top + maxHeightAge)) + ")")
            .call(d3.axisBottom(x2).tickSize(0));
        
        let y2 = d3.scaleLinear()
            .domain([0, maxValueSex])
            .range([maxHeightAge, 0]);
        canvas.append("g")
            .attr("transform", "translate(" + left + "," + (2 * top + maxHeightAge) + ")")
            .call(d3.axisLeft(y2)
                .ticks(10)
                .tickSize(-maxWidthAge));

        let bars2 = canvas.selectAll(".sexRect").data(groupedBySex);

        bars2.exit().remove();

        bars2.enter()
            .append("rect")
            .merge(bars2)
            .style("fill", cUmber)
            .attr("class", "sexRect")
            .attr("x", d => { return x2(d[0]) + 2.25*left;})
            .attr("width", x.bandwidth())
            .attr("y", d => { return y2(d[1].length) + 2 * top + maxHeightAge})
            .attr("height", d => { return maxHeightAge - y2(d[1].length)});

            
        canvas.append("text")
            .attr("id", "xLabel")
            .attr("text-anchor", "middle")
            .attr("x", maxWidthAge/2 + left)
            .attr("y", 2 * (maxHeightAge + top) + 20)
            .attr("font-family", "sans-serif")
            .attr("font-size", "70%")
            .text("Sex");

        canvas.append("text")
            .attr("id", "yLabel")
            .attr("text-anchor", "middle")
            .attr("x", -(2 * top + maxHeightAge * 1.5))
            .attr("y", left - 25)
            .attr("font-family", "sans-serif")
            .attr("transform", "rotate(-90)")
            .attr("font-size", "70%")
            .text("Number of Deaths");

        canvas.append("text")
            .attr("id", "title")
            .attr("text-anchor", "middle")
            .attr("x", maxWidthAge/2 + left)
            .attr("y", 2 * top + maxHeightAge - 5)
            .attr("font-family", "sans-serif")
            .attr("font-weight", "bold")
            .text("Deaths by Sex");
    });
}
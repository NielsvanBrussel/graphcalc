import * as d3 from 'd3'
import calcBoundaries from './calcBoundaries'

const createLineChartSvg = ({lineChartRef, rawData, xAxisUnit, yAxisUnit, autoSort, tabs}) => {

    const width = 1200
    const height = 600
    
    // sort data by x value if there is no data, insert mock data

    const rawDataCopy = [...rawData]

    // make sure there is an initial value
    const data = rawData.length?  rawDataCopy : [{x: 0, y: 0}];

    // split the data into groups
    const dataNest = Array.from(
        d3.group(data, d => d.colour), ([key, value]) => ({ key, value })
    );


    // sort the different arrays by x-value
    const finalData = autoSort? dataNest.map(item => item && {...item ,value: item.value.sort((a, b) => a.x - b.x)}) : dataNest

    const xBoundaries = calcBoundaries({axis: 'x', data: data})
    const leftXBoundary = xBoundaries.upperBoundary
    const rightXBoundary = xBoundaries.lowerBoundary

    const yBoundaries = calcBoundaries({axis: 'y', data: data})
    const upperYBoundary = yBoundaries.upperBoundary
    const lowerYBoundary = yBoundaries.lowerBoundary
    
   

    //set up svg container
        const svg = d3.select(lineChartRef.current)
            .attr("viewBox", `0 0 ${width} ${height}`)
            .style('background', 'rgba(0, 0, 0, 0.1)')
            .style('margin', 20)
            .style('padding', '5')
            .style('overflow', 'visible')

    // set up scale
        const xScale = d3.scaleLinear()
            .domain([rightXBoundary, leftXBoundary])
            .range([0 , width])
        const yScale = d3.scaleLinear()
            .domain([lowerYBoundary, upperYBoundary])
            .range([height, 0])                  // inverted (top to bottom)
        const drawLine = d3.line()
            .x((d, i) => xScale(d.x))
            .y((d, i) => yScale(d.y))
            .curve(d3.curveCardinal)
            

    // draw grid lines
        const yAxisGrid = d3.axisRight(yScale)
            .tickSize(width)
            .tickFormat('')
            .ticks(10);
        const xAxisGrid = d3.axisBottom(xScale)
            .tickSize(height)
            .tickFormat('')
            .ticks(10);
        svg.append('g')
            .attr('class', 'grid-lines')
            .style("color", "white")
            .call(xAxisGrid);
        svg.append('g')
            .attr('class', 'grid-lines')
            .style("color", "white")
            .call(yAxisGrid);

    // add title to axis
        svg.append("text")
            .attr("text-anchor", "y")
            .attr("y", 0)
            .attr("x", (width + 10))
            .style("stroke", "white")
            .attr('transform', `translate(0, ${yScale(0)} )`)
            .text(xAxisUnit)
        svg.append("text")
            .attr("text-anchor", "x")
            .attr("y", -10)
            .attr("x", 0)
            .style("stroke", "white")
            .attr('transform', `translate(${xScale(0)}, 0 )`)
            .text(yAxisUnit)

 
    // set up data for svg
        svg.selectAll('.line')
            .data(finalData)
            .join('path')
                .attr("d", d => drawLine(d.value))
                .attr('fill', 'none')
                .attr('stroke', d => d.key)
                .attr('stroke-width', '3')


    // set up labels at the end of the lines   
        svg.selectAll("myLabels")
            .data(finalData)
            .enter()
                .append('g')
                .append("text")
                // keep only the last value of each time series
                .datum((d) => { 
                    return (
                        {key: d.key, values: d.value[d.value.length - 1]}
                        )
                    }) 
                    .attr("transform", (d) => "translate(" + xScale(d.values.x) + "," + yScale(d.values.y) + ")") // Put the text at the position of the last point
                    .attr("x", 12) // shift the text a bit more right
                    .text((d)  => {
                        const value= tabs.filter(item => item.colour === d.key && item)[0]?.title
                        const title = value ? value : ""
                        return title
                    })
                    .style("fill", (d) => d.key)
                    .style("font-size", 20)


    // set up axes
        const xAxis = d3.axisBottom(xScale)
            .ticks(10)                 // amount of data we have to scale
        const yAxis = d3.axisLeft(yScale)
            .ticks(10)
        svg.append('g')
            .call(xAxis)
            .attr('transform', `translate(0, ${yScale(0)})`)    // put xAxis at the bottom instead of the top (default)
            .attr('class', 'axis')
            .style("font", "16px times")
            .style("color", "white")    
        svg.append('g')
            .call(yAxis)
            .attr('transform', `translate(${xScale(0)}, 0 )`)    // put xAxis at the bottom instead of the top (default)
            .style("font", "16px times")
            .style("color", "white")

        svg.selectAll(".axis .tick")    // remove one 0 from the ticks (clearer center)
            .filter(d =>  d === 0)
            .remove();

    // Create the circle that travels along the curve of chart
        const focus = svg
            .append('g')
            .append('circle')
                .style("fill", "white")
                .style("stroke", "white")
                .attr('r', 6)
                .style("opacity", 0)        
    // Create the text that travels along the curve of chart

        const focusRect = svg
            .append('g')
            .append("rect")
                .attr("height", 80)
                .style("fill", "rgba(0, 0, 0, 0.6)")
                .style("opacity", 0)

        const focusTextX = svg
            .append('g')
            .append('text')
                .style("opacity", 0)
                .style("stroke", "white")
                .attr("text-anchor", "left")
                .attr("alignment-baseline", "middle")
        
        const focusTextY = svg
            .append('g')
            .append('text')
                .style("opacity", 0)
                .style("stroke", "white")
                .attr("text-anchor", "left")
                .attr("alignment-baseline", "middle")


    // What happens when the mouse move -> show the annotations at the right positions.
        const mouseover = () => {
            // only display when there is actual data
            if (!(data[0].x === 0 && data[0].y === 0 && data.length === 1)) {
                focus.style("opacity", 1)
                focusTextX.style("opacity",1)
                focusTextY.style("opacity",1)
                focusRect.style("opacity",1)                
            }
        }

        const mousemove = (e) => {

            // recover coordinate we need
            const x0 = xScale.invert(d3.pointer(e)[0]);
            const y0 = yScale.invert(d3.pointer(e)[1]);

            // only display when there is actual data
            if (!(data[0].x === 0 && data[0].y === 0 && data.length === 1)) {
                try {

                    // get the closest value to the x-coordinates of your mouse
                    const outputX = data.reduce((prev, curr) => Math.abs(curr.x - x0) < Math.abs(prev.x - x0) ? curr: prev)
                    const outputY = data.reduce((prev, curr) => Math.abs(curr.y - y0) < Math.abs(prev.y - y0) ? curr: prev)

                    // if there are multiple data points for this x-value make an array
                    const closestXValuesArray = data.filter(item => {
                        return item.x === outputX.x
                    })

                    const closestYValuesArray = data.filter(item => {
                        return item.y === outputY.y
                    })

                    const closestValuesArray = closestXValuesArray.concat(closestYValuesArray)

                    console.log(closestValuesArray)

                    // get the closest value to the Y-coordinates of your mouse
                    // const closestValue =  closestXValuesArray.reduce((prev, curr) => Math.abs(curr.y - y0) < Math.abs(prev.y - y0) ? curr: prev)

                    const closestValue =  closestValuesArray.reduce((prev, curr) => Math.sqrt((Math.abs(curr.y - y0) ** 2) + (Math.abs(curr.x - x0) ** 2)) < Math.sqrt((Math.abs(prev.y - y0) ** 2) + (Math.abs(prev.x - x0) ** 2)) ? curr: prev)


    
                    // calc how long the numbers in the box will be and adjust the width accordingly
                    const widthAdjustment = Math.max(outputX.x, outputX.y).toString().length 
                
                    focus
                        .attr("cx", xScale(closestValue.x))
                        .attr("cy", yScale(closestValue.y))
                    focusTextX
                        .html("x : " + "\u00A0" + " " + closestValue.x)
                        .attr("x", xScale(closestValue.x) - 50)
                        .attr("y", yScale(closestValue.y) - 70)
                    focusTextY
                        .html("y : " + "\u00A0" + " " + closestValue.y)
                        .attr("x", xScale(closestValue.x) - 50)
                        .attr("y", yScale(closestValue.y) - 45)
    
                    focusRect
                        .attr("width", 100 + (widthAdjustment * 10))
                        .attr("x", xScale(closestValue.x) - 70)
                        .attr("y", yScale(closestValue.y) - 100)
    
                } catch (error) {
                    throw error
                }
            }             
        }

        const mouseout = () => {
            focus.style("opacity", 0)
            focusTextX.style("opacity", 0)
            focusTextY.style("opacity", 0)
            focusRect.style("opacity", 0)
        }

    // Create a rect on top of the svg area: this rectangle recovers mouse position
        svg.append('rect')
            .style("fill", "none")
            .style("pointer-events", "all")
            .attr('width', width)
            .attr('height', height)
            .on('mouseover', mouseover)
            .on('mousemove', (e) => mousemove(e))
            .on('mouseout', mouseout);
}   

export default createLineChartSvg
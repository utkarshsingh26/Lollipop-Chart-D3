// Hint: This is a good place to declare your global variables
let female_data = [];
let female_data_mod = [];
let male_data = [];
let male_data_mod = [];
const height = 600;
const width = 1000;
const margin = { top: 20, right: 30, bottom: 40, left: 50 };
let svg;
const chartHeight = height-margin.top-margin.bottom;
const chartWidth = width-margin.left-margin.right;
let prevSelection  = "";



// This function is called once the HTML page is fully loaded by the browser
document.addEventListener('DOMContentLoaded', function () {
   // Hint: create or set your svg element inside this function

   svg = d3.select('#lollipopChart')
                  .attr('width', width)
                  .attr('height', height)

    
   // This will load your two CSV files and store them into two arrays.
   Promise.all([d3.csv('data/females_data.csv'),d3.csv('data/males_data.csv')])
        .then(function (values) {
            console.log('loaded females_data.csv and males_data.csv');
            female_data = values[0];
            male_data = values[1];
            
            // Hint: This is a good spot for doing data wrangling

            female_data_mod = female_data.map((element) => {
                return {
                    Year : new Date(element["Year"]),
                    // Year : (element["Year"]),
                    "Afghanistan" : +element["Afghanistan"],
                    "Albania" : +element["Albania"],
                    "Algeria" : +element["Algeria"],
                    "India" : +element["India"],
                    "United States" : +element["United States"]
                }
            })

            male_data_mod = male_data.map((element) => {
                return {
                    Year : new Date(element["Year"]),
                    "Afghanistan" : +element["Afghanistan"],
                    "Albania" : +element["Albania"],
                    "Algeria" : +element["Algeria"],
                    "India" : +element["India"],
                    "United States" : +element["United States"]
                }
            })
            
            drawLolliPopChart();
        });
});

// Use this function to draw the lollipop chart.
function drawLolliPopChart() {

    svg.selectAll("*").remove();
    
    let selectedDropdown = document.getElementById("dropDown");
    selectedDropdown.addEventListener('change',()=>{

    let accessKey = selectedDropdown.value;
    
    let g = svg.append('g')
                .attr('transform', `translate(${margin.left},${margin.top})`);

    /** Adding a legend **/

    const keys = [{Color : 'pink', Label : 'Female Employement Rate'}, {Color : 'green', Label : 'Male Employement Rate'}];

    let size = 10
    svg.selectAll("legend")
        .data(keys)
        .enter()
        .append("rect")
            .attr("x", 775)
            .attr("y", function(d,i){ return 15 + i*(size+5)})
            .attr("width", size)
            .attr("height", size)
            .style("fill", d=> d.Color)



    svg.selectAll("labels")
            .data(keys)
            .enter()
            .append("text")
              .attr("x", 775 + size*1.2)
              .attr("y", function(d,i){ return 15 + i*(size+5) + (size/2)}) 
              .style("fill", d => d.Color)
              .text(d => d.Label)
              .attr("text-anchor", "left")
              .style("alignment-baseline", "middle")


    /** Adding a legend **/

            const xScale = d3.scaleTime()
            // .domain([d3.min(female_data_mod, d => d.Year),d3.max(female_data_mod, d => d.Year)])
            .domain([new Date(1990,1,1),new Date(2023,12,31)])
            .nice()
            .range([0, chartWidth]);


            g.append('g')
                .attr('transform', `translate(0,${chartHeight})`)
                .call(d3.axisBottom(xScale));


            const combinedArray = female_data_mod.concat(male_data_mod);
            let max = -1;
            
            for(let i of combinedArray){
                for(let j in i){
                    if(j !== "Year"){
                        if(i[j] > max){
                            max = i[j];
                        } 
                    }
                }
            }
                
            const yScale = d3.scaleLinear()
            .domain([0,max])
            // .nice()
            .range([chartHeight,0])

            g.append('g')
                // .attr('transform', `translate(${margin.left},0)`)
                .call(d3.axisLeft(yScale));

            
            /** Lables for Axes **/

            svg.append("text")
                .attr("class", "xAxis label")
                .attr("text-anchor", "end")
                .attr("x", width/2)
                .attr("y", height - 5)
                .text("Years");


            svg.append("text")
                .attr("class", "yAxis label")
                .attr("text-anchor", "end")
                .attr("x", -height/3)
                .attr("y", 1)
                .attr("dy", ".75em")
                .attr("transform", "rotate(-90)")
                .text("Employment Rate");

            /** Lables for Axes **/

            g.selectAll(".pink-circle")
                .data(female_data_mod)
                .enter()
                .append("circle")
                .attr("cx", (d) => xScale(d.Year)-5)
                .attr("cy", d => yScale(d[`${prevSelection}`])) 
                .attr("r", 4)
                .attr("fill", "pink")
                .transition()
                .duration(1000)
                .attr("cy", d => yScale(d[`${accessKey}`])) 
                .delay(100)

            g.selectAll(".green-circle")
                .data(male_data_mod)
                .enter()
                .append("circle")
                .attr("cx", (d) => xScale(d.Year)+5)
                .attr("cy", d => yScale(d[`${prevSelection}`])) 
                .attr("r", 4)
                .attr("fill", "green")
                .transition()
                .duration(1000)
                .attr("cy", d => yScale(d[`${accessKey}`])) 
                .delay(100)

            g.selectAll('.pink-line')
            .data(female_data_mod)
            .enter()
            .append('line')
            .attr('x1', (d) => xScale(d.Year)-5)
            .attr('x2', (d) => xScale(d.Year)-5)
            .attr('y1', yScale(0))
            .attr('y2', d => yScale(d[`${prevSelection}`]))
            .attr('stroke', 'pink')
            .attr('stroke-width', '2')
            .transition()
            .duration(1000)
            .attr('y2', d => yScale(d[`${accessKey}`]))
            .delay(100)

            g.selectAll('.green-line')
            .data(male_data_mod)
            .enter()
            .append('line')
            .attr('x1', (d) => xScale(d.Year)+5)
            .attr('x2', (d) => xScale(d.Year)+5)
            .attr('y1', yScale(0))
            .attr('y2', d => yScale(d[`${prevSelection}`]))
            .attr('stroke', 'green')
            .attr('stroke-width', '2')
            .transition()
            .duration(1000)
            .attr('y2', d => yScale(d[`${accessKey}`]))
            .delay(100)

            prevSelection = accessKey;
        
    })


    console.log('trace:drawLollipopChart()');
}


// Define URLs for the JSON files
/*const jsonUrls = [
  'data/starwars-episode-1-interactions-allCharacters.json',
  'data/starwars-episode-2-interactions-allCharacters.json',
  'data/starwars-episode-3-interactions-allCharacters.json',
  'data/starwars-episode-4-interactions-allCharacters.json',
  'data/starwars-episode-5-interactions-allCharacters.json',
  'data/starwars-episode-6-interactions-allCharacters.json',
  'data/starwars-episode-7-interactions-allCharacters.json',
  'data/starwars-episode-8-interactions-allCharacters.json',
  'data/starwars-full-interactions-allCharacters.json'
];*/
// Yt: https://www.youtube.com/watch?v=gda35eYXBJc
var graph = {
  nodes: [
    {name: "John", age:36},
    {name: "Tomas", age:38},
    {name: "Niko", age:50},
    {name: "Edvin", age:20},
    {name: "Stole", age:6},
    {name: "Peter", age:77}
  ],
  links: [
    {source: "John", target: "Tomas"},
    {source: "John", target: "Peter"},
    {source: "Niko" , target: "Edvin"},
    {source: "Niko", target: "Stole"},
    {source: "Edvin", target: "Stole"},
    {source: "Niko", target: "Peter"}
  ]
};

/*
// Function to fetch JSON data from a URL
async function fetchData(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return null;
  }
}

// Function to fetch data from all JSON files
async function fetchAllData() {
  try {
    const allData = [];
    for (const url of jsonUrls) {
      const data = await fetchData(url);
      allData.push(data);
    }
    return allData;
  } catch (error) {
    console.error('Error fetching all data:', error);
    return null;
  }
}

// Call the function to fetch all data
fetchAllData().then(data => {
  // Process the data as needed
  console.log(data);
  // Here you can work with the fetched data
}).catch(error => {
  console.error('Error:', error);
});*/


var canvas = d3.select("#visualization"),
width = canvas.attr("width"),
height = canvas.attr("height"),
r = 3,
ctx = canvas.node().getContext("2d"),
// Vet ej om forcesimulation behövs kommer från yt
// Det som händer är att punkterna förflyttas till mitten 
simulation = d3.forceSimulation()
  .force("x", d3.forceX(width/2))
  .force("y", d3.forceY(height/2))
  .force("collide", d3.forceCollide(r+1))
  .force("charge", d3.forceManyBody()
    .strength(-20))
  .force("link", d3.forceLink()
    .id(function (d) { return d.name; })) 
  .on("tick", update);

// Bara test noder
/*graph.nodes.forEach(function (d) {
d.x = Math.random() *width;
d.y = Math.random() *height;
});*/

simulation.nodes(graph.nodes);
simulation.force("link")
  .links(graph.links);

function update() {
ctx.clearRect(0, 0, width, height);

ctx.beginPath();
graph.links.forEach(drawLink);
ctx.stroke();

ctx.beginPath();
graph.nodes.forEach(drawNode);
ctx.fill();
}

function drawNode(d) {
  ctx.moveTo(d.x, d.y);
  ctx.arc(d.x, d.y, r, 0, 2* Math.PI);
}

function drawLink(l) {
  ctx.moveTo(l.source.x, l.source.y);
  ctx.lineTo(l.target.x, l.target.y);
}
update();

/*
// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 30, left: 40},
  width = 400 - margin.left - margin.right,
  height = 400 - margin.top - margin.bottom;

// Array för att lagra alla filnamn
var files = [
    "./data/starwars-episode-1-interactions-allCharacters.json",
    "./data/starwars-episode-2-interactions-allCharacters.json",
    "./data/starwars-episode-3-interactions-allCharacters.json",
    "./data/starwars-episode-4-interactions-allCharacters.json",
    "./data/starwars-episode-5-interactions-allCharacters.json",
    "./data/starwars-episode-6-interactions-allCharacters.json",
    "./data/starwars-episode-7-interactions-allCharacters.json",
    "./data/starwars-full-interactions-allCharacters.json"
];

// Läs in alla JSON-filer asynkront
Promise.all(files.map(file => d3.json(file))).then(function(data) {
    // Kombinera data från alla filer
    var combinedData = { nodes: [], links: [] };
    data.forEach(function(d) {
        combinedData.nodes = combinedData.nodes.concat(d.nodes);
        combinedData.links = combinedData.links.concat(d.links);
    });

    // Ditt kod för att skapa visualiseringen bör här inkluderas
      // Skapa en SVG-behållare för diagrammet
      var svg = d3.select("#visualization")
      .append("svg")
      .attr("width", width + margin.left + margin.right) // Anpassa storleken efter dina behov
      .attr("height", height + margin.top + margin.bottom) // Anpassa storleken efter dina behov
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
      

// Skapa en kraftlayout för att placera noderna och länkarna
var simulation = d3.forceSimulation(combinedData.nodes)
             .force("link", d3.forceLink(combinedData.links).id(d => d.id))
             .force("charge", d3.forceManyBody().strength(-100))
             .force("center", d3.forceCenter(400, 300)); // Anpassa centrum för layouten efter dina behov

// Skapa länkar mellan noderna
var link = svg.selectAll(".link")
        .data(combinedData.links)
        .enter()
        .append("line")
        .attr("class", "link")
        .style("stroke", "#aaa")
        .style("stroke-width", function(d) { return Math.sqrt(d.value); });


// Skapa noder för varje karaktär
var node = svg.selectAll(".node")
        .data(combinedData.nodes)
        .enter()
        .append("circle")
        .attr("class", "node")
        .attr("r", function(d) { return Math.sqrt(d.value) * 2; }) // Anpassa nodstorleken efter dina behov
        .style("fill", function(d) { return d.colour; }); // Anpassa färgen efter dina behov

// Lägg till tooltips för noderna (valfritt)
node.append("title")
.text(function(d) { return d.name; });

// Uppdatera länkarna och noderna vid varje steg i simuleringen
simulation.on("tick", function() {
link.attr("x1", function(d) { return d.source.x; })
  .attr("y1", function(d) { return d.source.y; })
  .attr("x2", function(d) { return d.target.x; })
  .attr("y2", function(d) { return d.target.y; });

node.attr("cx", function(d) { return d.x; })
  .attr("cy", function(d) { return d.y; });
    });

    
});*/
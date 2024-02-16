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
/*var graph = {
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
};*/

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

/*

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
    .id(function (d) { return d.name; })); 
 

// Bara test noder
/*graph.nodes.forEach(function (d) {
d.x = Math.random() *width;
d.y = Math.random() *height;
});*/
/*

fetch('./data/starwars-episode-1-interactions-allCharacters')
  .then(response => response.json())
  .then(data => {
    // Gör något med den hämtade datan
    simulation
    .nodes(data.nodes)
    .on("tick", update)
    .force("link")
    .links(data.links);

    function update() {
      ctx.clearRect(0, 0, width, height);
      
      ctx.beginPath();
      data.links.forEach(drawLink);
      ctx.stroke();
      
      ctx.beginPath();
      data.nodes.forEach(drawNode);
      ctx.fill();
    }})
  .catch(error => {
    console.error('Det uppstod ett fel:', error);
  });*/
  /*
d3.json("../data/starwars-episode-1-interactions-allCharacters", function (err, data) {
  if (err) throw err;

  simulation
    .nodes(data.nodes)
    .on("tick", update)
    .force("link")
    .links(data.links);

    function update() {
      ctx.clearRect(0, 0, width, height);
      
      ctx.beginPath();
      data.links.forEach(drawLink);
      ctx.stroke();
      
      ctx.beginPath();
      data.nodes.forEach(drawNode);
      ctx.fill();
      }
});*/

/*
function drawNode(d) {
  ctx.moveTo(d.x, d.y);
  ctx.arc(d.x, d.y, r, 0, 2* Math.PI);
}

function drawLink(l) {
  ctx.moveTo(l.source.x, l.source.y);
  ctx.lineTo(l.target.x, l.target.y);
}

*/
function createNetworkDiagram() {
  var width = 600; // Definiera bredden för diagrammet
  var height = 400; // Definiera höjden för diagrammet

  // Skapa en SVG-container
  var svg = d3.select("#visualization")
              .append("svg")
              .attr("width", width)
              .attr("height", height);
// Läser in data och skapar visualiseringen
d3.json("./data/starwars-episode-1-interactions-allCharacters.json").then(function(data) {
  console.log("Noder:", data.nodes);
  console.log("Länkar:", data.links);

  // Filtrera bort isolerade noder
  var filteredNodes = data.nodes.filter(node => {
    // Kontrollera om noden har länkar
    return data.links.some(link => link.source === node || link.target === node);
  });

  console.log("Filtrerade noder:", filteredNodes);

  // Skapa linjer för länkarna
  var link = svg.selectAll("link")
                .data(data.links.filter(link => {
                  // Hoppa över länkar som refererar till icke-existerande noder
                  return filteredNodes.some(node => node === link.source) &&
                         filteredNodes.some(node => node === link.target);
                }))
                console.log(data.links.filter(link => {
                  // Hoppa över länkar som refererar till icke-existerande noder
                  return filteredNodes.some(node => node === link.source) &&
                         filteredNodes.some(node => node === link.target);
                }))
                .enter()
                .append("line")
                .attr("class", "link")
                .style("stroke", "black")
                .style("stroke-opacity", 0.6)
                .style("stroke-width", function(d) { return Math.sqrt(d.value); });

  // Skapa cirkulära noder för noderna
  var node = svg.selectAll(".node")
                .data(filteredNodes)
                .enter()
                .append("circle")
                .attr("class", "node")
                .attr("r", 5)
                .style("fill", function(d) { return d.colour; });

  // Skapa nodnamn för tooltip
  //node.append("title")
   //   .text(function(d) { return d.name; });

  // Uppdatera nodernas och länkarnas positioner vid varje tick
  simulation.on("tick", function() {
    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node.attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });
  });

}).catch(function(error) {
  console.log("Det uppstod ett fel: " + error);
});


  return svg.node();
}

// Anropa funktionen för att skapa diagrammet
var networkDiagram = createNetworkDiagram();
document.getElementById("visualization").appendChild(networkDiagram);





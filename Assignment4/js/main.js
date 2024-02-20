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

//let data = await d3.json("./data/starwars-episode-1-interactions-allCharacters.json").catch(function(error){ console.log(error)});
(async function() {let RawEp;
  try {
   RawEp = await d3.json("./data/starwars-episode-1-interactions-allCharacters.json").catch(function (error) {
      console.error("Error loading data:", error);
    });
    console.log(RawEp)

  } catch (error) {
    console.error("Error loading data:", error);
  }
  try {
    let data = await d3.json("./data/starwars-episode-1-interactions-allCharacters.json");
    console.log(data)
    console.log("hej")

    function createNetworkDiagram(data) {
      var width = 600;
      var height = 400;

      let nodes = data.nodes;
      let links = data.links;

      var svg = d3.select("#visualization")
                  .append("svg")
                  .attr("width", width)
                  .attr("height", height);

      var simulation = d3.forceSimulation(nodes)
                         .force("charge", d3.forceManyBody().strength(-50))
                         .force("link", d3.forceLink().links(links))
                         .force("center", d3.forceCenter(width / 2, height / 2))
                         .on("tick", ticked);

      // Funktion för att uppdatera länkarna
      function updateLinks() {
       d3.select(".links")
            .data(data.links)
            .join("line")
            .attr("x1", function(d){
              return d.source.x
            })
            .attr("y1", function(d){
              return d.source.y
            })
            .attr("x2", function(d){  // Fix: Should be "x2" instead of "x1"
              return d.target.x
            })
            .attr("y2", function(d){
              return d.target.y
            });
      }

      // Funktion för att uppdatera noderna
      function updateNodes() {
          u = d3.select(".nodes")
            .selectAll("text")
            .data(data.nodes)
            .join("text")
            .text(function(d) {
              return d.x
            })
            .attr("x", function(d){
              return d.x
            })
            .attr("y", function(d){
              return 5
            });
      }

      // Funktion som anropas vid varje tick av simuleringen
      function ticked() {
        updateLinks();
        updateNodes();
      }

      return svg.node(); // Return the SVG node
    }

    var networkDiagram = createNetworkDiagram(data);
    document.getElementById("visualization").appendChild(networkDiagram);
  } catch (error) {
    console.log(error);
  }
})();



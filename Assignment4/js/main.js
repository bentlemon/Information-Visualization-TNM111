// Array för att lagra alla filnamn
var files = [
    "starwars-episode-1-interactions-allCharacters.json",
    "starwars-episode-2-interactions-allCharacters.json",
    "starwars-episode-3-interactions-allCharacters.json",
    "starwars-episode-4-interactions-allCharacters.json",
    "starwars-episode-5-interactions-allCharacters.json",
    "starwars-episode-6-interactions-allCharacters.json",
    "starwars-episode-7-interactions-allCharacters.json",
    "starwars-full-interactions-allCharacters.json"
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
      .attr("width", 800) // Anpassa storleken efter dina behov
      .attr("height", 600); // Anpassa storleken efter dina behov

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
        .style("stroke", "#999")
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
});
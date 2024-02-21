let jsonFiles = [
  { name: "Star Wars Episode 1", url: "starwars-episode-1-interactions-allCharacters.json" },
  { name: "Star Wars Episode 2", url: "starwars-episode-2-interactions-allCharacters.json" },
  { name: "Star Wars Episode 3", url: "starwars-episode-3-interactions-allCharacters.json" },
  { name: "Star Wars Episode 4", url: "starwars-episode-4-interactions-allCharacters.json" },
  { name: "Star Wars Episode 5", url: "starwars-episode-5-interactions-allCharacters.json" },
  { name: "Star Wars Episode 6", url: "starwars-episode-6-interactions-allCharacters.json" },
  { name: "Star Wars Episode 7", url: "starwars-episode-7-interactions-allCharacters.json" },
  { name: "Star Wars Episode all", url: "starwars-full-interactions-allCharacters.json" }
];

// Dropdown menu
var select = document.createElement("select");
select.id = "jsonSelect";

// Add all options to choose from
jsonFiles.forEach(function(file) {
  var option = document.createElement("option");
  option.value = file.url;
  option.text = file.name;
  select.appendChild(option);
});

document.body.appendChild(select);

// Create a container for the visualization
var visualizationContainer = document.createElement("div");
visualizationContainer.id = "visualizationContainer";
document.body.appendChild(visualizationContainer);

// Create a container for displaying dot information
var dotInfoContainer = document.createElement("div");
dotInfoContainer.id = "dotInfoContainer";
document.body.appendChild(dotInfoContainer);

select.addEventListener("change", async function() {
  var selectedValue = this.value;
  var jsonURL = "./data/" + selectedValue;
  
  try {
    var data = await d3.json(jsonURL);
    console.log("Data loaded successfully:", data);

    var width = 450, height = 340;
    let nodes = data.nodes;
    let links = data.links;
    
    var simulation = d3.forceSimulation(nodes)
      .force('charge', d3.forceManyBody().strength(-100))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('link', d3.forceLink().links(links))
      .on('tick', ticked);
  
    function updateLinks() {
      var u = d3.select('.links')
        .selectAll('line')
        .data(links)
        .join('line')
        .attr('x1', function(d) { return d.source.x })
        .attr('y1', function(d) { return d.source.y })
        .attr('x2', function(d) { return d.target.x })
        .attr('y2', function(d) { return d.target.y });
    }
  
    function updateNodes() {
      var circleSelection = d3.select('.nodes')
        .selectAll('circle')
        .data(nodes)
        .join('circle')
        .attr('cx', function(d) { return d.x; })
        .attr('cy', function(d) { return d.y; })
        .attr("r", function(d) { return d.value; })
        .attr("fill", function(d) { return d.colour; })
        .attr("opacity", 0.7)
        .on("click", function(d) {
          console.log(data.nodes.name)
          var isSelected = d3.select(this).classed("highlighted");
          d3.select(this).classed("highlighted", !isSelected);
          updateDotInfo(d); // Call the updateDotInfo function when a circle is clicked
        });

      // Update information when a dot is selected from the dropdown menu
      circleSelection.on("change", function(d) {
        var selectedNode = this.value;
        var selectedDot = d.name === selectedNode;
        updateDotInfo(selectedDot);
      });
    }
  
    function updateDotInfo(dot) {
      // Clear previous content
      dotInfoContainer.innerHTML = "";

      // Create and append elements to display dot information
      var nameElement = document.createElement("p");
      nameElement.textContent = "Name: " + dot.name;
      dotInfoContainer.appendChild(nameElement);
        
      var valueElement = document.createElement("p");
      valueElement.textContent = "Value: " + dot.value;
      dotInfoContainer.appendChild(valueElement);

      var colourElement = document.createElement("p");
      colourElement.textContent = "Colour: " + dot.colour;
      dotInfoContainer.appendChild(colourElement);

      // Add more information as needed
    }

    function ticked() {
      updateLinks();
      updateNodes();
    }
  
  } catch (error) {
    console.error("Error loading data:", error);
  }
});

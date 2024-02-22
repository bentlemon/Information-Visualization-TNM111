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

// Dropdown menu for content1
var select1 = document.createElement("select");
select1.id = "jsonSelect1";

// Add all options to choose from
jsonFiles.forEach(function(file) {
  var option = document.createElement("option");
  option.value = file.url;
  option.text = file.name;
  select1.appendChild(option);
});

document.getElementById("content1").appendChild(select1);

select1.addEventListener("change", async function() {
  var selectedValue = this.value;
  var jsonURL = "./data/" + selectedValue;

  try {
    var data = await d3.json(jsonURL);
    console.log("Data loaded successfully for content1:", data);

    var width = 450, height = 340;
    let nodes = data.nodes;
    let links = data.links;

    var simulation = d3.forceSimulation(nodes)
      .force('charge', d3.forceManyBody().strength(-100))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('link', d3.forceLink().links(links))
      .on('tick', ticked);

    function updateLinks() {
      var u = d3.select('#content1 .links')
        .selectAll('line')
        .data(links)
        .join('line')
        .attr('x1', function(d) { return d.source.x })
        .attr('y1', function(d) { return d.source.y })
        .attr('x2', function(d) { return d.target.x })
        .attr('y2', function(d) { return d.target.y });
    }

    var selectedNode1 = null;
    function updateNodes() {
      d3.select('#content1 .nodes')
        .selectAll('circle')
        .data(nodes)
        .join('circle')
        .attr('cx', function(d) { return d.x; })
        .attr('cy', function(d) { return d.y; })
        .attr("r", function(d) { return d.value; })
        .attr("fill", function(d) { return d.colour; })
        .attr("opacity", 0.7)
        .on("mouseover", function(event, d) {
          showTooltip(d);
          if (selectedNode1 !== null && selectedNode1 !== this) {
            d3.select(selectedNode1).classed("highlighted", false);
          }
          var isSelected = d3.select(this).classed("highlighted");
          d3.select(this).classed("highlighted", !isSelected);
          selectedNode1 = this;
        })
        .on("mouseout", function(event, d) {
          hideTooltip();
        });
    }

    function ticked() {
      updateLinks();
      updateNodes();
    }

  } catch (error) {
    console.error("Error loading data for content1:", error);
  }
});

// Dropdown menu for content2
var select2 = document.createElement("select");
select2.id = "jsonSelect2";

// Add all options to choose from
jsonFiles.forEach(function(file) {
  var option = document.createElement("option");
  option.value = file.url;
  option.text = file.name;
  select2.appendChild(option);
});

document.getElementById("content2").appendChild(select2);

select2.addEventListener("change", async function() {
  var selectedValue = this.value;
  var jsonURL = "./data/" + selectedValue;

  try {
    var data = await d3.json(jsonURL);
    console.log("Data loaded successfully for content2:", data);

    var width = 450, height = 340;
    let nodes = data.nodes;
    let links = data.links;

    var simulation = d3.forceSimulation(nodes)
      .force('charge', d3.forceManyBody().strength(-100))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('link', d3.forceLink().links(links))
      .on('tick', ticked);

    function updateLinks() {
      var u = d3.select('#content2 .links')
        .selectAll('line')
        .data(links)
        .join('line')
        .attr('x1', function(d) { return d.source.x })
        .attr('y1', function(d) { return d.source.y })
        .attr('x2', function(d) { return d.target.x })
        .attr('y2', function(d) { return d.target.y });
    }

    var selectedNode2 = null;
    function updateNodes() {
      d3.select('#content2 .nodes')
        .selectAll('circle')
        .data(nodes)
        .join('circle')
        .attr('cx', function(d) { return d.x; })
        .attr('cy', function(d) { return d.y; })
        .attr("r", function(d) { return d.value; })
        .attr("fill", function(d) { return d.colour; })
        .attr("opacity", 0.7)
        .on("mouseover", function(event, d) {
          showTooltip(d);
          if (selectedNode2 !== null && selectedNode2 !== this) {
            d3.select(selectedNode2).classed("highlighted", false);
          }
          var isSelected = d3.select(this).classed("highlighted");
          d3.select(this).classed("highlighted", !isSelected);
          selectedNode2 = this;
        })
        .on("mouseout", function(event, d) {
          hideTooltip();
        });
    }

    function ticked() {
      updateLinks();
      updateNodes();
    }

  } catch (error) {
    console.error("Error loading data for content2:", error);
  }
});
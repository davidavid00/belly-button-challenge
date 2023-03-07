const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Use D3 to read the data file
d3.json(url).then(function(OG_data) {
    console.log(OG_data);
  
    // Get the dropdown menu element
    var dropdown = d3.select("#selDataset");

    // Populate the dropdown menu with the sample IDs
    OG_data.names.forEach(function(name) {
      dropdown.append("option").text(name).property("value", name);
    });

    // Define a function to create the bar chart
    function createBarChart(data,id) {
      
      // Get the data for the selected sample
      var sampleData = data.samples.filter(function(d) { 
        return d.id === id;
      })[0];
  
      // Get the top 10 OTUs
      var top10 = sampleData.sample_values.slice(0, 10).reverse();
      var otuIDs = sampleData.otu_ids.slice(0, 10).map(function(id) {
        return "OTU " + id;
      }).reverse();
      var otuLabels = sampleData.otu_labels.slice(0, 10).reverse();
  
      // Create the trace for the bar chart
      var trace = {
        x: top10,
        y: otuIDs,
        text: otuLabels,
        type: "bar",
        orientation: "h"
      };
  
      // Create the data array for the plot
      var data = [trace];
  
      // Define the layout for the plot
      var layout = {
        title: "Top 10 OTUs",
        xaxis: { title: "Sample Values" },
        yaxis: { title: "OTU IDs" }
      };
  
      // Plot the chart
      Plotly.newPlot("bar", data, layout);
    }

    function createBubbleChart(data,id) {
      // Get the data for the selected sample
      var sampleData = data.samples.filter(function(d) {
        return d.id === id;
      })[0];
  
      // Create the trace for the bubble chart
      var trace = {
        x: sampleData.otu_ids,
        y: sampleData.sample_values,
        text: sampleData.otu_labels,
        mode: "markers",
        marker: {
          size: sampleData.sample_values,
          color: sampleData.otu_ids,
          colorscale: "Earth"
        }
      };
  
      // Create the data array for the plot
      var data = [trace];
  
      // Define the layout for the plot
      var layout = {
        title: "OTU Bubble Chart",
        xaxis: { title: "OTU ID" },
        yaxis: { title: "Sample Value" },
        showlegend: false,
        height: 600,
        width: 1000
      };
  
      // Plot the chart
      Plotly.newPlot("bubble", data, layout);
    }

    function metadata_frame(data,id){
      //Target the Metadata Frame
      let panel = document.querySelector('.panel-body');
      
      //Get the metadata related to the ID
      var meta_base = data.metadata.filter(function(i) {
        return i.id == id;
      })[0];

      //update the metadataframe with html
      panel.innerHTML = `<p>ID: ${meta_base.id} <br>
      Ethnicity: ${meta_base.ethnicity} <br>
      Gender: ${meta_base.gender}<br>
      Age: ${meta_base.age}<br>
      Location: ${meta_base.location}<br>
      BB Type: ${meta_base.bbtype}<br>
      W Freq: ${meta_base.wfreq}`
    }

    // Called to initate the charts
    var id = dropdown.property("value");
    createBarChart(OG_data,id);
    createBubbleChart(OG_data,id);
    metadata_frame(OG_data,id);

    // Define a function to update the chart when a new sample is selected
    function optionChanged() {
      id = dropdown.property("value");
      createBarChart(OG_data,id);
      createBubbleChart(OG_data,id);
      metadata_frame(OG_data,id);
    }
  
    // Set up the event listener for the dropdown menu
    dropdown.on("change", optionChanged);
  });
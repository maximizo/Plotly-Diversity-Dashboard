function buildMetadata(sample) {
    d3.json('samples.json').then((data)=>{
        var metadata = data.metadata;

        //Filter the data for the object with the selected sample 
        var resultArray = metadata.filter(sampleObj => sampleObj.id==sample);
        var result = resultArray[0];

        //Use d3 to select the id of `#sample-metadata
        var PANEL = d3.select(`#sample-metadata`);

        //Use `.html("") to clear existing metadata, if any
        PANEL.html('')

        //Add key values and pairs to the panel using `Object.entries`
        Object.entries(result).forEach(([key, value]) => {
            PANEL.append('h6').text(`${key.toUpperCase()}: ${value}`);
        });

    });
}

function buildCharts(sample) {
    d3.json('samples.json').then((data) => {
        var samples = data.samples;
        var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
        var result = resultArray[0];

        var otu_ids = result.otu_ids;
        var otu_labels = result.otu_labels;
        var sample_values = result.sample_values;

        //Build a Bubble Chart
        var bubbleLayout = {
            title:'Bacteria Cultures Per Sample',
            margin: {t:0},
            hovermode:'closest',
            xaxis:{title:'OTU ID'},
            margin:{t:30}
        };
        
        var bubbleData = [
            {
                x: otu_ids, 
                y: sample_values,
                text: otu_labels, 
                mode: 'markers',
                marker: {
                    size: 10,
                    color: otu_ids,
                    colorscale: 'Mars'
                }
            }
        ];

        Plotly.newPlot('bubble', bubbleData, bubbleLayout);

        var yticks = otu_ids.slice(0,10).map(otuID => `OTU ${otuID}`).reverse();
        var barData = [
            {
                y: yticks,
                x: sample_values.slice(0,10).reverse(),
                text: otu_labels.slice(0,10).reverse(),
                type: 'bar',
                orientation: 'h',
            }
        ];

    var barLayout = {
        title: 'Top 10 Bacteria Cultures Found',
        margin: {t:30, l:150}
    };

    Plotly.newPlot('bar', barData, barLayout);
});
}

function init() {
    //Connect to dropdown selected element
    var selector = d3.select('#selDataset');

    //Populate select options with sample numbers
    d3.json('samples.json').then((data) => {
        var sampleNames = data.names;

        sampleNames.forEach((sample) => {
            selector
                .append('option')
                .text(sample)
                .property('value', sample);
        });

    //Pick first sample to build initial plots
        var randomSample = sampleNames[0]
        buildCharts(randomSample);
        buildMetadata(randomSample);
    });
}

function optionChanged(newSample) {
    buildCharts(newSample);
    buildMetadata(newSample);
}

//Initialize dashboard
init();

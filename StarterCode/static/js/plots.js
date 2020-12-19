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
        Object.defineProperties(result).forEach(([key, value]) => {
            PANEL.append('h6').text(`${key.toUpperCase()}: ${value}`);
        });

        //Add gauge chart
        buildGauge(result.wfreq);
    });
}


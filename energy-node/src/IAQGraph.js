import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {LineChart} from 'react-easy-chart';


export default class IAQGraph extends Component {
	
	constructor(props) {
    	super(props);

    	this.val = 12;

    	this.superData = [
      		this.generateData(),
      		this.generateData(),
      		this.generateData()
    	];
    	this.superLineColors = ['red', 'green', 'blue']

    	this.data = this.superData.slice()

    	this.selected = [
    		true,
    		true,
    		true
    	]

    	this.lineColors=this.superLineColors.slice()

    	this.updateData = this.updateData.bind(this);
    	this.checkboxChecked = this.checkboxChecked.bind(this);
    	this.editData = this.editData.bind(this);
	}

	getRandomArbitrary(min, max) {
    	return Math.random() * (max - min) + min;
  	}

    generateData() 
    {
	    const data = [];
	    const xs = [];

	    for (let i = 1; i <= 12; i++) {
	      xs.push(i);
	    }
	    xs.forEach((x) => {
	      data.push({ x, y: this.getRandomArbitrary(0, 100) });
	    });
	    return data;
    }


    editData()
    {
    	var x = 0;
    	for(var i = 0; i < this.data.length; i++)
    	{
    		if(this.selected[x] === false)
    		{
    			//remove data
    			this.data.splice(i, 1);

    			//remove line
    			this.lineColors.splice(i, 1);
    			i = i - 1;
    		}
    		x = x + 1;
    	}
    }

    updateData()
    {
    	//console.log("updated data");
    	for(var i = 0; i < this.superData.length; i++)
    	{
	    	this.superData[i].push({
	    			x : this.val + 1,
	    			y : this.getRandomArbitrary(0, 100)
	    	});
	    	this.superData[i].shift();
    	}
    	this.val = this.val + 1;

    	this.data = this.superData.slice()
    	this.lineColors = this.superLineColors.slice()

    	this.editData();

    	this.forceUpdate();

    }


    checkboxChecked(event)
    {
    	console.log("change");

    	var x = parseInt(event.target.value, 10);

    	this.selected[x] = !this.selected[x];
    }

    componentDidMount()
	{
		//console.log("mounted");
		//console.log(this.data);
		this.interval = setInterval(this.updateData, 1000);
	}

	componentWillUnmount()
	{
		//console.log("unmounted");
		clearInterval(this.interval);
	}

	render()
	{
		//console.log("render");
		return (
			<div id="root">
				<div className="IAQGraph">
				<h3> Indoor Air Quality (ppm) vs Time (s) </h3>
				<LineChart
				    axes
				    grid
				    verticalGrid
				    margin={{top: 10, right: 10, bottom: 50, left: 50}}
				    axisLabels={{x: 'My x Axis', y: 'My y Axis'}}
				    lineColors = {this.lineColors}
				    width={750}
				    height={250}
				    data={this.data}				  
				/>
				</div>

				<input type = "checkbox" checked = {this.selected[0]} id = "cb_node1" value = "0" onChange = {this.checkboxChecked} />
				<input type="text" disabled="disabled" size="1" style={{'background-color' : 'red'}} />
				<label for="cb_node1">Node 1</label>
				<input type="text" disabled="disabled" size="4" style={{'background-color' : 'white', 'border' : 'none'}} />

				<input type = "checkbox" checked = {this.selected[1]} id = "cb_node2" value = "1" onChange = {this.checkboxChecked} />
				<input type="text" disabled="disabled" size="1" style={{'background-color' : 'green'}} />
				<label for="cb_node2">Node 2</label>
				<input type="text" disabled="disabled" size="4" style={{'background-color' : 'white', 'border' : 'none'}} />
			
				<input type = "checkbox" checked = {this.selected[2]} id = "cb_node3" value = "2" onChange = {this.checkboxChecked} />
				<input type="text" disabled="disabled" size="1" style={{'background-color' : 'blue'}} />
				<label for="cb_node3">Node 3</label>


				
			</div>
		);
	}
}

ReactDOM.render(<IAQGraph />, document.getElementById("root"));

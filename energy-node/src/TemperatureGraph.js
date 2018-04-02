import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {LineChart} from 'react-easy-chart';
import moment from 'moment';
import {getInitialData, getUpdatedData} from './Util';
import axios from 'axios';

export default class TemperatureGraph extends Component {
	
	constructor(props) {
    	super(props);

    	this.val = 0;

    	this.superData = [
			[],[]
      		//this.generateData(),
      		//this.generateData(),
      		//this.generateData()
    	];
		//this.superLineColors = ['red', 'green', 'blue']
		this.superLineColors = ['blue', 'green']

    	this.data = this.superData.slice()

    	this.selected = [
			true,
			true
		]
		
		this.lastData = [ 0, 0];

    	this.lineColors=this.superLineColors.slice()

		this.update_callback = this.update_callback.bind(this);
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

    updateData_old()
    {
    	//console.log("updated data");
    	for(var i = 0; i < this.superData.length; i++)
    	{
	    	this.superData[i].push({
	    			x : this.val + 1,
	    			y : this.getRandomArbitrary(0, 100)
			});
			
			if(this.superData[i].length > 12)
			{
				this.superData[i].shift();
			}
    	}
    	this.val = this.val + 1;

    	this.data = this.superData.slice()
    	this.lineColors = this.superLineColors.slice()

    	this.editData();

    	this.forceUpdate();

	}
	
	update_callback(response)
	{

		var myData = response["data"];

		var node1Data;
		var node2Data;

		if(myData[0]["Txid"] == "2")
		{
			node1Data = myData[1];
			node2Data = myData[0];
		}
		else
		{
			node1Data = myData[0];
			node2Data = myData[1];
		}

		if(node1Data["Id"] == this.lastData[0] || node2Data["Id"] == this.lastData[1])
		{
			return;
		}

		this.lastData[0] = node1Data["Id"];
		this.lastData[1] = node2Data["Id"];


		var now = moment().format("mm:ss")
		this.superData[0].push({
			x : now,
			y : parseInt(node1Data["Value"], 10)
		});

		if(this.superData[0].length > 12)
		{
			this.superData[0].shift();
		}

		this.superData[1].push({
			x : now,
			y : parseInt(node2Data["Value"], 10)
		});

		if(this.superData[1].length > 12)
		{
			this.superData[1].shift();
		}

		this.data = this.superData.slice()
		this.lineColors = this.superLineColors.slice()
		this.val = this.val + 1;

		this.editData();

		this.forceUpdate();
	}

	updateData()
	{

		var BASE_URL = "http://localhost:8080/api/";
		var table = "Temperature";
		
		var my_url = BASE_URL + "getupdateddata/" + table + "/";

		axios.get(my_url)
		.then((response) => {
			this.update_callback(response)
			})
		.catch(function (error) {
			console.log(error);
		});
	}


    checkboxChecked(event)
    {
    	//console.log("change");

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
				<div className="TemperatureGraph">
				<h3> Temperature (F) vs Time (s) </h3>
				<LineChart
					xType={'text'}
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
				<input type="text" disabled="disabled" size="1" style={{'background-color' : 'blue'}} />
				<label for="cb_node1">Node 1</label>
				<input type="text" disabled="disabled" size="4" style={{'background-color' : 'white', 'border' : 'none'}} />

				<input type = "checkbox" checked = {this.selected[1]} id = "cb_node2" value = "1" onChange = {this.checkboxChecked} />
				<input type="text" disabled="disabled" size="1" style={{'background-color' : 'green'}} />
				<label for="cb_node2">Node 2</label>
				<input type="text" disabled="disabled" size="4" style={{'background-color' : 'white', 'border' : 'none'}} />
			


				
			</div>
		);
	}
}

ReactDOM.render(<TemperatureGraph />, document.getElementById("root"));
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {LineChart} from 'react-easy-chart';
import moment from 'moment';
import {getInitialData, getUpdatedData} from './Util';
import axios from 'axios';

export default class GraphTemplate extends Component {

    constructor(props) {
    	super(props);

        this.numNodes = this.props.numNodes;
        this.graphTitle = this.props.graphTitle;

        this.superData = [];
        this.superLineColors = ['blue', 'green'];
        this.selected = [];
        this.lastData = [];

        var emptyData = [];
        for(var i = 0; i < this.numNodes; i++)
        {
            this.superData.push(emptyData);
            this.selected.push(true);
            this.lastData.push(0);
        }

        this.data = this.superData.slice()
        this.lineColors = this.superLineColors.slice()

        this.updateData = this.updateData.bind(this);
        this.checkboxChecked = this.checkboxChecked.bind(this);

    }

    updateData()
    {
        this.forceUpdate();
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
        let checkBoxes = []
        for(let i = 0; i < this.numNodes; i++)
        {
            checkBoxes.push(<input type = "checkbox" checked = {this.selected[i]} value = {i} onChange = {this.checkboxChecked} />);
            checkBoxes.push(<input type="text" disabled="disabled" size="1" style={{'background-color' : 'blue'}} />);
            checkBoxes.push(<label>Node {i}</label>);
            checkBoxes.push(<input type="text" disabled="disabled" size="4" style={{'background-color' : 'white', 'border' : 'none'}} />);
        }

        return (


			<div id="root">
				<div>
				<h3> {this.graphTitle} </h3>
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

                {checkBoxes}

				</div>




				
			</div>
		);
    }


}

ReactDOM.render(<GraphTemplate />, document.getElementById("root"));
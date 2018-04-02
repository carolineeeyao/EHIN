import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';


export default class Additional extends Component {
	
	constructor(props) {
        super(props);
        
        this.accelerometerData = [
            {x:0, y:0, z:0},
            {x:0, y:0, z:0}
        ];

        this.gyroscopeData = [
            {x:0, y:0, z:0},
            {x:0, y:0, z:0}
        ];

        this.magneticForceData = [
            {x:0, y:0, z:0},
            {x:0, y:0, z:0}
        ];

        this.update_callback = this.update_callback.bind(this);
    	this.updateData = this.updateData.bind(this);
    }

    update_callback(response)
	{
		var myData = response["data"];

        this.accelerometerData = myData[0];
        this.gyroscopeData = myData[1];
        this.magneticForceData = myData[2];

		this.forceUpdate();
	}

    updateData()
	{

		var BASE_URL = "http://localhost:8080/api/";
		
		var my_url = BASE_URL + "additionaldata/";

		axios.get(my_url)
		.then((response) => {
			this.update_callback(response)
			})
		.catch(function (error) {
			console.log(error);
		});
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
        return (
            <div id="root">

            <h3> Accelerometer Data </h3>
            <table border="1" cellpadding="10" width="70%" align="center">
                <tr>
                    <td></td>
                    <td>x val</td>
                    <td>y val</td>
                    <td>z val</td>
                </tr>                
                <tr>
                    <td>Node 1 </td>
                    <td>{this.accelerometerData[0]["x"]} </td>
                    <td>{this.accelerometerData[0]["y"]} </td>
                    <td>{this.accelerometerData[0]["z"]} </td>
                </tr>
                <tr>
                    <td>Node 2 </td>
                    <td>{this.accelerometerData[1]["x"]} </td>
                    <td>{this.accelerometerData[1]["y"]} </td>
                    <td>{this.accelerometerData[1]["z"]} </td>
                </tr>
            </table>

            <br></br>
            <br></br>

            <h3> Gyroscope Data </h3>
            <table border="1" cellpadding="10" width="70%" align="center">
                <tr>
                    <td></td>
                    <td>x val</td>
                    <td>y val</td>
                    <td>z val</td>
                </tr>                
                <tr>
                    <td>Node 1 </td>
                    <td>{this.gyroscopeData[0]["x"]} </td>
                    <td>{this.gyroscopeData[0]["y"]} </td>
                    <td>{this.gyroscopeData[0]["z"]} </td>
                </tr>
                <tr>
                    <td>Node 2 </td>
                    <td>{this.gyroscopeData[1]["x"]} </td>
                    <td>{this.gyroscopeData[1]["y"]} </td>
                    <td>{this.gyroscopeData[1]["z"]} </td>
                </tr>
            </table>

            <br></br>
            <br></br>

            <h3> Magnetic Force Data </h3>
            <table border="1" cellpadding="10" width="70%" align="center">
                <tr>
                    <td></td>
                    <td>x val</td>
                    <td>y val</td>
                    <td>z val</td>
                </tr>                
                <tr>
                    <td>Node 1 </td>
                    <td>{this.magneticForceData[0]["x"]} </td>
                    <td>{this.magneticForceData[0]["y"]} </td>
                    <td>{this.magneticForceData[0]["z"]} </td>
                </tr>
                <tr>
                    <td>Node 2 </td>
                    <td>{this.magneticForceData[1]["x"]} </td>
                    <td>{this.magneticForceData[1]["y"]} </td>
                    <td>{this.magneticForceData[1]["z"]} </td>
                </tr>
            </table>


            </div>

        );
    }

}


ReactDOM.render(<Additional />, document.getElementById("root"));
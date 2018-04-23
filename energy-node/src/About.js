import React, { Component } from 'react';
import ReactDOM from 'react-dom';

export default class About extends Component {
	
	constructor(props) {
        super(props);
    }

    render()
	{
		return (
			<div id="root">
            <br></br>
            <br></br>
            <table border="0" cellpadding="10" width="70%" align="center">
                <tr>
                    <td>
                        IoT devices are usually limited by being wired to a reliable power source or 
                        powered by a battery. In environments where batteries and wired sensors are often 
                        infeasible and data needs to be gathered over a large area, there arises a demand 
                        for self-sustaining wireless sensors. Our team has created a network of devices 
                        that wirelessly detects and transmits environmental data to a receiver, without 
                        the use of a battery. This data is easily accessed by a user in real-time through 
                        an interactive user interface.
                    </td>
                </tr>
            </table>
            </div>
        );
    }

}

ReactDOM.render(<About />, document.getElementById("root"));
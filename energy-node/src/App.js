import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import TemperatureGraph from './TemperatureGraph.js'
import LightIntensityGraph from './LightIntensityGraph.js'
import HumidityGraph from './HumidityGraph.js'
import PressureGraph from './PressureGraph.js'
import IAQGraph from './IAQGraph.js'
import Additional from './Additional.js'
import { TabProvider, Tab, TabPanel, TabList } from 'react-web-tabs';
import 'react-web-tabs/dist/react-web-tabs.css';

class App extends Component {

  

 

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Energy Harvesting Node</h1>
        </header>

              <TabProvider defaultTab="temperature">
        <section className="my-tabs">
          <TabList className="my-tablist">
           <span className="divider"></span>
            <Tab tabFor="about" className="my-tab">About</Tab>
            <Tab tabFor="temperature">Temperature</Tab>
            <span className="divider"></span>
            <Tab tabFor="humidity">Humidity</Tab>
            <span className="divider"></span>
            <Tab tabFor="pressure" className="my-tab">Pressure</Tab>
            <span className="divider"></span>
            <Tab tabFor="lightintensity" className="my-tab">Light Intensity</Tab>
            <span className="divider"></span>
            <Tab tabFor="additional" className="my-tab">Additional</Tab>
          </TabList>
          <div className="wrapper">
            <TabPanel tabId="temperature">
              <TemperatureGraph></TemperatureGraph>
            </TabPanel>
            <TabPanel tabId="humidity">
              <p><HumidityGraph></HumidityGraph></p>
            </TabPanel>
            <TabPanel tabId="pressure">
              <p><PressureGraph></PressureGraph></p>
            </TabPanel>
            <TabPanel tabId="lightintensity">
              <p><LightIntensityGraph></LightIntensityGraph></p>
            </TabPanel>
            <TabPanel tabId="about">
              <h1>About</h1>
            </TabPanel>
            <TabPanel tabId="additional">
              <p><Additional></Additional></p>
            </TabPanel>
          </div>
        </section>
      </TabProvider>

      </div>


    );
  }
}

export default App;

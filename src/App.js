import React, { Component } from 'react';
import './App.css';
import moment from 'moment';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis } from 'recharts';

class App extends Component {
  constructor() {
    super();
    // endpoint is tokenPrices || totalSupply
    this.state = { data: [], address: '0xb8c77482e45f1f44de1745f52c74426c631bdd52', apiKey: '', endpoint: 'totalSupply', yAxisLabel: '', yAxisTickFormatter: () => {}};

    this.handleAddressChange = this.handleAddressChange.bind(this);
    this.handleApiKeyChange = this.handleApiKeyChange.bind(this);
    this.selectAddress = this.selectAddress.bind(this);
    this.changeDataType = this.changeDataType.bind(this);
  }

  componentDidMount() {
    this.changeDataType('tokenPrices')
  }

  setData(endpoint, address) {
    const root = process.env.NODE_ENV === 'development' ? `http://localhost:${process.env.PORT || 3001}` : ''
    axios.get(`${root}/${endpoint}?address=${address}`, { headers: { 'x-api-key': this.state.apiKey }}).then(res => {
      const result = []
      res.data.forEach(point => {
        result.push({ value: point[1], time: point[0] })
      })
      this.setState({ data: result })
    }).catch(err => {
      console.log('err', err)
    })
  }

  handleAddressChange(event) {
    const address = event.target.value
    this.setState({address});
    this.setData(this.state.endpoint, this.state.address);
  }

  handleApiKeyChange(event) {
    const apiKey = event.target.value
    this.setState({apiKey});
    this.setData(this.state.endpoint, this.state.address);
  }

  selectAddress(address) {
    this.setState({address});
    this.setData(this.state.endpoint, address);
  }

  changeDataType(endpoint) {
    const yAxisLabel = endpoint === 'tokenPrices' ? 'Price in USD' : 'Total Token Supply';
    const yAxisTickFormatter = endpoint === 'tokenPrices' ? (val) => `$${val}` : val => val
    this.setState({yAxisLabel})
    this.setState({yAxisTickFormatter})
    this.setState({endpoint})
    this.setData(endpoint, this.state.address)
  }

  render() {
    const endpoint = this.state.endpoint;
    return (
      <div className="container">
        <div>
          <ul>
            <li className={endpoint === 'tokenPrices' ? 'active' : ''} onClick={() => this.changeDataType('tokenPrices')}>Token Value</li>
            <li className={endpoint === 'totalSupply' ? 'active' : ''} onClick={() => this.changeDataType('totalSupply')}>Total Supply</li>
          </ul>
          <h2>{endpoint === 'tokenPrices' ? 'Token Value' : 'Total Supply'}</h2>
          <LineChart
            width={400}
            height={400}
            data={this.state.data}
            margin={{bottom: 20, left: 50}}
          >
            <XAxis
              dataKey = 'time'
              domain = {['auto', 'auto']}
              name = 'Time'
              tickFormatter = {(unixTime) => moment(unixTime).format('M/D')}
              type = 'number'
              label={{ value:'Date', position: 'bottom'}}
            />
            <YAxis
            dataKey = 'value' 
            name = 'Value'
            label={{ value: this.state.yAxisLabel, angle: -90, position: 'insideLeft', offset: -20}} 
            tickFormatter = { this.state.yAxisTickFormatter }
            />
            <Line type="monotone" dataKey="value" stroke="#f26522" strokeWidth={3} yAxisId={0} />
          </LineChart>
          <div className="token-button-row">
            <div onClick={() => this.selectAddress('0xb8c77482e45f1f44de1745f52c74426c631bdd52')} className="token-button bnb"></div>
            <div onClick={() => this.selectAddress('0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2')} className="token-button mkr"></div>
            <div onClick={() => this.selectAddress('0x0d8775f648430679a709e98d2b0cb6250d2887ef')} className="token-button bat"></div>
            <input type="text" value={this.state.address} onChange={this.handleAddressChange} placeholder="0x..."/>
          </div>
          <div className="api-key-container">
            <input type="text" value={this.state.apiKey} onChange={this.handleApiKeyChange} placeholder="Enter Professional API Key"/>
          </div>
        </div>
      </div>
    );
  }
}

export default App;

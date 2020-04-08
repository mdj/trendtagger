import React from 'react';
// import ReactDOM from 'react-dom';
import * as V from 'victory';
import _ from 'lodash';
import Col from "./App";

const VictoryZoomSelectionContainer = V.createContainer("zoom", "selection");


class BS extends React.Component {


    constructor(props) {
        super(props);

        this.state = {
            isFetching: true,
            selectedClass: 1
        };
        this.labelStyles = ['black', 'red', 'blue', 'green', 'orange'];
        this.handleKeyPress = this.handleKeyPress.bind(this);

    }


    componentDidUpdate(prevProps) {

        console.log("componentDidUpdate", prevProps);
        if (this.props.data.length !== prevProps && this.props.dimensions.length > 0 && this.state.isFetching) {
            console.log("Ready with data", this.props, prevProps);

            this.entireDomain = this.getEntireDomain(this.props);
            this.setState({
                zoomedXDomain: this.entireDomain.x,
                zoomDomain: this.entireDomain,
                selectedDomain: this.entireDomain,
                isFetching: false

            });
        }
    }


    handleKeyPress(e) {
        console.log(e);
        if (e.key === 'Enter' && e.shiftKey) {
            // $('#app').append("<br/> Detected Shift+Enter")
            console.log(e);
        }
    }

    handleSelection(points, bounds, props) {


        const minDate = _.minBy(points[0].data, d=> d.Date).Date;
        const maxDate = _.maxBy(points[0].data, d=> d.Date).Date;

        for (var i = 0; i < this.props.data.length; i++) {

            if (this.props.data[i].Date >= minDate && this.props.data[i].Date <= maxDate) {

                if (this.props.data[i].Labeled) {
                    this.props.data[i].Labeled = this.state.selectedClass;
                } else {
                    this.props.data[i].Labeled = this.state.selectedClass;
                }
            }


        }

    }

    getData() {
        console.log("getData()");
        const {zoomedXDomain} = this.state;
        const {data, maxPoints} = this.props;
        const filtered = data.filter(
          // is d "between" the ends of the visible x-domain?
          (d) => (d.Date >= zoomedXDomain[0] && d.Date <= zoomedXDomain[1]));


        if (filtered.length > maxPoints) {
            const k = Math.ceil(filtered.length / maxPoints);
            return filtered.filter(
                (d, i) => ((i % k) === 0)
            );
        }

        return filtered;

    }

    getSparseData() {
        console.log("getSparseData()");
        const {data, maxPoints} = this.props;

        if (data.length > maxPoints) {
            const k = Math.ceil(data.length / maxPoints);
            return data.filter(
                (d, i) => ((i % k) === 0)
            );
        }
        return data;

    }


    getEntireDomain(props) {
        const {data, dimensions} = props;

        return {
            y: [_.minBy(data, d => d[dimensions[0]])[dimensions[0]], _.maxBy(data, d => d[dimensions[0]])[dimensions[0]]],
            x: [data[0].Date, _.last(data).Date]
        };
    }


    handleSelectionCleared(points, bounds, props) {
        // this.setState({selectedDomain: domain});
        // console.log("handleSelectionCleared()");

    }

    handleZoom(domain) {
        this.setState({selectedDomain: domain, zoomedXDomain: domain.x});
        // console.log("handleZoom(", domain, ")");
    }

    handleBrush(domain, props) {
        // console.log(domain);
        // console.log(props);
        // domain.y = [props.y1, props.y2]; // translate to high/low for main graph
        this.setState({zoomDomain: domain, zoomedXDomain: domain.x});
        // domain.y = [-100, 100];

        this.setState({selectedDomain: domain});

        // console.log("handleBrush(", domain, ")");
    }

    handleBrushTag(domain) {
        // this.setState({zoomDomain: domain});
        //  console.log("handleBrushTag(", domain, ")");
    }

    render() {
        if (this.state.isFetching) return <div>Loading charts</div>;

        console.log("render()");
        var charts = [];

        const renderedData = this.getData();

        charts.push(
            <div key={"label-selector"}>
                <button onClick={() => this.setState({selectedClass: 0})}>No label</button>
                <button onClick={() => this.setState({selectedClass: 1})}>Class 1</button>
                <button onClick={() => this.setState({selectedClass: 2})}>Class 2</button>

            </div>);

        charts.push(<div key={"title_main" +
        ""}>{this.props.dimensions[0]}</div>);
        charts.push(
            <div key={"d0"}>
                <V.VictoryChart key={"0"} width={700} height={350} scale={{x: "time"}}
                                theme={V.VictoryTheme.material}
                                containerComponent={

                                    <VictoryZoomSelectionContainer
                                        responsive={false}
                                        // selectionDimension="x"
                                        allowPan={false}
                                        // allowZoom={false}
                                        zoomDimension="x"
                                        zoomDomain={{x: this.state.zoomDomain.x}}
                                        activateSelectedData={false}
                                        onSelection={this.handleSelection.bind(this)}
                                        // onSelectionCleared={this.handleSelectionCleared.bind(this)}
                                        onZoomDomainChange={this.handleZoom.bind(this)}
                                        minimumZoom={{x: 1 / 100}}
                                    />
                                }
                >


                    <V.VictoryAxis tickFormat={(t) => `${t.getUTCDate()}/${t.getUTCMonth()}/${t.getUTCFullYear()}`} fixLabelOverlap={true} label={"Date"}/>
                    <V.VictoryAxis dependentAxis label={this.props.dimensions[0]}/>
                                    {/*<V.VictoryLine*/}
                    {/*name={this.props.dimensions[0]}*/}
                    {/*interpolation="monotoneX"*/}
                    {/*style={{*/}
                        {/*data: {stroke: ({Labeled}) => Labeled ? "tomato" : "gray"}*/}
                    {/*}}*/}
                    {/*data={renderedData}*/}
                    {/*x={"Date"}*/}
                    {/*y={this.props.dimensions[0]}*/}

                {/*/>*/}

                                    <V.VictoryCandlestick
                                        theme={V.VictoryTheme.material}
                    // candleColors={{positive: "#5f5c5b", negative: "#c43a31"}}

                    style={{
                        data: {
                            stroke: ({datum}) => datum.Labeled ? this.labelStyles[datum.Labeled] : "black",
                        }
                    }}
                    data={renderedData}
                    x={"Date"}
                    close={"Close"}
                    open={"Open"}
                    high={"High"}
                    low={"Low"}
                />
                    <V.VictoryScatter
                        style={{
                            data: {
                                opacity: 0,
                                fill: ({datum}) => datum.Labeled ? this.labelStyles[datum.Labeled] : "black",
                            }
                        }}
                        data={renderedData}
                        x={"Date"}
                        y={this.props.dimensions[0]}

                    />


                </V.VictoryChart>
                <div>rendering {renderedData.length} of {this.props.data.length}  </div>
            </div>
        );


        const sparseData = this.getSparseData();

        for (var i = 0; i < this.props.dimensions.length; i++) {
            charts.push(<div key={"title_" + i}>{this.props.dimensions[i]}</div>);
            charts.push(<V.VictoryChart key={"chart_" + i}
                                        padding={{top: 10, left: 100, right: 50, bottom: 50}}
                                        width={700} height={150} scale={{x: "time"}}
                                        containerComponent={
                                            <V.VictoryBrushContainer
                                                responsive={false}
                                                                     brushDimension="x"
                                                                     brushDomain={{x: this.state.selectedDomain.x}}
                                                                     onBrushDomainChange={this.handleBrush.bind(this)}
                                            />
                                        }
            >
                <V.VictoryAxis tickFormat={(t) => `${t.getDate()}/${t.getMonth()}`} fixLabelOverlap={true} label={"Date"} standalone={true}/>
                <V.VictoryAxis dependentAxis label={this.props.dimensions[i]} fixLabelOverlap={true} standalone={true}/>
                <V.VictoryLine
                    name={this.props.dimensions[i]}
                    interpolation="monotoneX"
                    style={{
                        data: {stroke: "tomato" }

                    }}
                    data={sparseData}
                    x={"Date"}
                    y={this.props.dimensions[i]}

                />
                 <V.VictoryScatter
                        style={{
                            data: {
                                opacity:  ({datum}) => datum.Labeled ? 1 : 0,
                                fill: ({datum}) => datum.Labeled ? this.labelStyles[datum.Labeled] : "black",
                            }
                        }}
                        data={sparseData}
                        x={"Date"}
                        y={this.props.dimensions[i]}

                    />
            </V.VictoryChart>);
        }


        return charts;
    }
}

export default BS;

// ReactDOM.render(</>, mountNode)
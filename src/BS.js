import React from 'react';
// import ReactDOM from 'react-dom';
import * as V from 'victory';


const VictoryZoomSelectionContainer = V.createContainer("zoom", "selection");


class BS extends React.Component {

    constructor(props) {
        super();

        this.state = {zoomDomain:{  y: [0, 1000]}};

    }

    handleSelection(points, bounds, props) {
        // this.setState({selectedDomain: domain});
        console.log("handleSelection()");
        // domain[0].data.active = true;
        console.log("points", points);

        for (var i=0; i < this.props.data.length; i++) {
            for (var j=0; j < points[0].data.length; j++) {
                if (this.props.data[i].Date === points[0].data[j].Date) {

                    if (this.props.data[i].labeled) {
                        this.props.data[i].labeled = false;
                    } else {
                        this.props.data[i].labeled = true;
                    }
                }

            }
        }
        console.log("bounds", bounds);
        console.log("props", props);
        // for (var i = 0; i < points[0].data.length; i++) {
        //     if (points[0].data[i].fill == "tomato") {
        //         points[0].data[i].fill = 'grey';
        //     } else {
        //         points[0].data[i].fill = 'tomato';
        //     }
        // }
        console.log(this.props.data);
    }

    handleSelectionCleared(points, bounds, props) {
        // this.setState({selectedDomain: domain});
        console.log("handleSelectionCleared()");

    }

    handleZoom(domain) {
        this.setState({selectedDomain: domain});
        console.log("handleZoom(", domain, ")");
    }

    handleBrush(domain, props) {
        // console.log(domain);
        // console.log(props);
        // domain.y = [props.y1, props.y2]; // translate to high/low for main graph
        this.setState({zoomDomain: domain});
        // domain.y = [-100, 100];

        this.setState({selectedDomain: domain});

        console.log("handleBrush(", domain, ")");
    }

    handleBrushTag(domain) {
        // this.setState({zoomDomain: domain});
        //  console.log("handleBrushTag(", domain, ")");
    }

    render() {
        if (this.props.dimensions.length === 0) return <div>Loading charts</div>;


        var charts = [];


        charts.push(
            <V.VictoryChart key={"0"} width={700} height={350} scale={{x: "time"}}
                            containerComponent={

                                <VictoryZoomSelectionContainer
                                    responsive={false}
                                    selectionDimension="x"
                                    allowPan={false}
                                    allowZoom={false}
                                    zoomDimension="x"
                                    zoomDomain={{x: this.state.zoomDomain.x }}
                                    activateSelectedData={false}
                                    onSelection={this.handleSelection.bind(this)}
                                    // onSelectionCleared={this.handleSelectionCleared.bind(this)}
                                    onZoomDomainChange={this.handleZoom.bind(this)}
                                />
                            }
            >


                <V.VictoryAxis tickFormat={(t) => `${t.getDate()}/${t.getMonth()}`}/>
                <V.VictoryAxis dependentAxis/>
                <V.VictoryScatter
                style= {{
                    data: {
                        fill: ({ datum }) => datum.labeled ? "red" : "black",
                    }
                }}
                data={this.props.data}
                x={"Date"}
                y={this.props.dimensions[0]}

                />
{/*                <V.VictoryCandlestick

                    candleColors={{positive: "#5f5c5b", negative: "#c43a31"}}

                    data={this.props.data}
                    x={"Date"}
                    close={"Close"}
                    open={"Open"}
                    high={"High"}
                    low={"Low"}
                />*/}

            </V.VictoryChart>
        );

        for (var i = 1; i < this.props.dimensions.length; i++) {
            charts.push(<div key={"title_" + i}>{this.props.dimensions[i]}</div>);
            charts.push(<V.VictoryChart key={"chart_" + i}
                                        padding={{top: 0, left: 50, right: 50, bottom: 30}}
                                        width={700} height={90} scale={{x: "time"}}
                                        containerComponent={
                                            <V.VictoryBrushContainer responsive={false}
                                                                     brushDimension="x"
                                                                     brushDomain={this.state.selectedDomain}
                                                                     onBrushDomainChange={this.handleBrush.bind(this)}
                                            />
                                        }
            >
                <V.VictoryAxis tickFormat={(t) => `${t.getDate()}/${t.getMonth()}`}/>
                <V.VictoryAxis dependentAxis/>
                <V.VictoryLine
                    name={this.props.dimensions[i]}
                    style={{
                data: { stroke: ({ labeled }) => labeled ? "tomato" : "gray" }
                }}
                    data={this.props.data}
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
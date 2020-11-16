import React from 'react';
import PropTypes from 'prop-types';
import LeGlobe from './libs/Globe';
import grid from './data/grid';
import pinLocations from './data/pin-locations';

const config = {
    font: "Inconsolata",
    data: pinLocations,
    tiles: grid.tiles,
    // baseColor: "blue",
    // markerColor: "red",
    // pinColor: "green",
    // satelliteColor: "yellow",
    scale: 1.0,
    dayLength: 1000 * 28,
    introLinesDuration: 2000,
    maxPins: 500,
    maxMarkers: 4,
    viewAngle: 0.1
}

class Globe extends React.Component {

    constructor(props) {
        super(props);
        this.globe = new LeGlobe(props.width, props.height, config);

        this.state = {
            ready: false,
        }
    }

    _onWindowResize = (width, height) => {
        this.globe.camera.aspect = width / height;
        this.globe.camera.updateProjectionMatrix();
        this.globe.renderer.setSize(width, height);
    }

    componentDidUpdate = (prevProps) => {
        const {prevWidth, prevHeight} = prevProps;
        const {width, height} = this.props;

        if(prevWidth !== width || prevHeight !== height){
            if(this.state.ready){
                this._onWindowResize(width, height)
            }
        }
    }

    _demo = () => {
        // ADD MARKERS
        setTimeout(()=>{
            this.globe.addMarker(49.25, -123.1, "Vancouver");
            this.globe.addMarker(35.6895, 129.69171, "Tokyo", true);
        }, 4000);

        //ADD SATELLITES
        setTimeout(()=>{
            const constellation = [];
            const opts = {
                coreColor: "#ff0000",
                numWaves: 8
            };
            const alt =  1.3;

            for(let i = 0; i< 2; i++){
                for(let j = 0; j< 3; j++){
                     constellation.push({
                        lat: 50 * i - 30 + 15 * Math.random(), 
                         lon: 120 * j - 120 + 30 * i, 
                         altitude: alt
                         });
                }
            }

            this.globe.addConstellation(constellation, opts);
        }, 6000)
    }

    _start = () => {
        this._animate();
    }

    _animate = () => {
        if(this.globe){
            this.globe.tick();
        }
        requestAnimationFrame(this._animate);
    }

    componentDidMount(){
        if(!this.state.ready) {
            document.fonts.load('10pt "Inconsolata"').then(() => {
                const div = document.getElementById("globe-div");

                div.append(this.globe.domElement);
                this.globe.init(this._start);
                if(this.props.demo){
                    this._demo();
                }
            
                this.setState({ready: true});
            });
        }
    }

    render() {
        const {width, height} = this.props;
        return <div id="globe-div" style={{height, width}}/>;
    }
}

Globe.propTypes = {
    show: PropTypes.bool,
    demo: PropTypes.bool,
    width: PropTypes.number,
    height: PropTypes.number,
}

export default Globe;
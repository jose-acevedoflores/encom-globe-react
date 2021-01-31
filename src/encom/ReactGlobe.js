import React from 'react';
import LeGlobe from './libs/Globe';

class Globe extends React.Component {

    constructor(props) {
        super(props);
        this.globe = new LeGlobe(props.width, props.height, props.globeConfig);

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
        const prevWidth = prevProps.width;
        const prevHeight = prevProps.height;
        const {width, height} = this.props;

        if(prevWidth !== width || prevHeight !== height){
            if(this.state.ready){
                this._onWindowResize(width, height)
            }
        }

        if(prevProps.markers !== this.props.markers){
            this.props.markers.forEach(marker => this.globe.addMarker(marker.lat, marker.lon, marker.label, marker.connected));
        }

        //TODO: add check that only adds the new entries and removes the removed ones.
        if(prevProps.constellations !== this.props.constellations){
            this.props.constellations.forEach(c => this.globe.addConstellation(c.sats, c.opts));
        }

    }

    _animate = () => {
        if(this.globe){
            this.globe.tick();
        }
        requestAnimationFrame(this._animate);
    }

    componentDidMount(){
        if(!this.state.ready) {
            //Wait until the font is loaded otherwise the pin labels show up with the default font.
            document.fonts.load(`10pt "${this.props.globeConfig.font}"`).then(() => {
                this.mount.appendChild( this.globe.domElement );
                this.globe.init(this._animate);
                this.props.globeReadyCb();
            
                this.setState({ready: true});
            });
        }
    }

    render() {
        return <div
            id="globe-div"
            ref={ref => (this.mount = ref)}
            style={{width: this.props.width, height: this.props.height}}
        />;
    }
}

export default Globe;
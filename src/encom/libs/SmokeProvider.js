import utils from './utils';
import {
    Points,
    ShaderMaterial,
    BufferAttribute,
    BufferGeometry,
    Color,
} from  'three';


var vertexShader = [
    "#define PI 3.141592653589793238462643",
    "#define DISTANCE 500.0",
    "attribute float myStartTime;",
    "attribute float myStartLat;",
    "attribute float myStartLon;",
    "attribute float altitude;",
    "attribute float activo;",
    "uniform float currentTime;",
    "uniform vec3 color;",
    "varying vec4 vColor;",
    "",
    "vec3 getPos(float lat, float lon)",
    "{",
    "   if (lon < -180.0){",
    "      lon = lon + 360.0;",
    "   }",
    "   float phi = (90.0 - lat) * PI / 180.0;",
    "   float theta = (180.0 - lon) * PI / 180.0;",
    "   float x = DISTANCE * sin(phi) * cos(theta) * altitude;",
    "   float y = DISTANCE * cos(phi) * altitude;",
    "   float z = DISTANCE * sin(phi) * sin(theta) * altitude;",
    "   return vec3(x, y, z);",
    "}",
    "",
    "void main()",
    "{",
    "   float dt = currentTime - myStartTime;",
    "   if (dt < 0.0){",
    "      dt = 0.0;",
    "   }",
    "   if (dt > 0.0 && activo > 0.0) {",
    "      dt = mod(dt,1500.0);",
    "   }",
    "   float opacity = 1.0 - dt/ 1500.0;",
    "   if (dt == 0.0 || activo == 0.0){",
    "      opacity = 0.0;",
    "   }",
    "   vec3 newPos = getPos(myStartLat, myStartLon - ( dt / 50.0));",
    "   vColor = vec4( color, opacity );", //     set color associated to vertex; use later in fragment shader.
    "   vec4 mvPosition = modelViewMatrix * vec4( newPos, 1.0 );",
    "   gl_PointSize = 2.5 - (dt / 1500.0);",
    "   gl_Position = projectionMatrix * mvPosition;",
    "}"
].join("\n");

var fragmentShader = [
    "varying vec4 vColor;",     
    "void main()", 
    "{",
    "   gl_FragColor = vColor;", 
    "   float depth = gl_FragCoord.z / gl_FragCoord.w;",
    "   float fogFactor = smoothstep(1500.0, 1800.0, depth );",
    "   vec3 fogColor = vec3(0.0);",
    "   gl_FragColor = mix( vColor, vec4( fogColor, gl_FragColor.w), fogFactor );",

    "}"
].join("\n");

var SmokeProvider = function(scene, _opts){

    /* options that can be passed in */
    var opts = {
        smokeCount: 600, //TODO: Big number here slows down
        smokePerPin: 30,
        smokePerSecond: 20
    }

    if(_opts){
        for(var i in opts){
            if(_opts[i] !== undefined){
                opts[i] = _opts[i];
            }
        }
    }

    this.opts = opts;

    this.geometry = new BufferGeometry();
    

    this.geometry.setAttribute( 'myStartTime', new BufferAttribute(new Float32Array(opts.smokeCount), 1 ));
    this.geometry.setAttribute( 'myStartLat', new BufferAttribute(new Float32Array(opts.smokeCount), 1 ));
    this.geometry.setAttribute( 'myStartLon', new BufferAttribute(new Float32Array(opts.smokeCount), 1 ));
    this.geometry.setAttribute( 'altitude', new BufferAttribute(new Float32Array(opts.smokeCount), 1 ));
    this.geometry.setAttribute( 'activo', new BufferAttribute(new Float32Array(opts.smokeCount), 1 ));
    this.geometry.setAttribute( 'position', new BufferAttribute(new Float32Array(3*opts.smokeCount), 3 ));
    

    this.uniforms = {
        currentTime: { type: 'f', value: 0.0},
        color: { type: 'c', value: new Color("#aaa")},
    }

    var material = new ShaderMaterial( {
        uniforms:       this.uniforms,
        vertexShader:   vertexShader,
        fragmentShader: fragmentShader,
        transparent:    true
    });

    for(let i = 0; i < opts.smokeCount; i++){
        const base = i*3;
        this.geometry.attributes.position.array[base] = 0;
        this.geometry.attributes.position.array[base+1] = 0;
        this.geometry.attributes.position.array[base+2] = 0;
        this.geometry.attributes.myStartTime.array[i] = 0.0;
        this.geometry.attributes.myStartLat.array[i] = 0.0;
        this.geometry.attributes.myStartLon.array[i] = 0.0;
        this.geometry.attributes.altitude.array[i] = 0.0;
        this.geometry.attributes.activo.array[i] = 0.0;
    }

    this.geometry.attributes.myStartTime.needsUpdate = true;
    this.geometry.attributes.myStartLat.needsUpdate = true;
    this.geometry.attributes.myStartLon.needsUpdate = true;
    this.geometry.attributes.altitude.needsUpdate = true;
    this.geometry.attributes.activo.needsUpdate = true;
    this.geometry.attributes.position.needsUpdate = true;

    this.smokeIndex = 0;
    this.totalRunTime = 0;

    scene.add( new Points( this.geometry, material));

};

SmokeProvider.prototype.setFire = function(lat, lon, altitude){

    var point = utils.mapPoint(lat, lon);

    /* add the smoke */
    var startSmokeIndex = this.smokeIndex;

    for(var i = 0; i< this.opts.smokePerPin; i++){
        const base = 3*i;
        this.geometry.attributes.position.array[this.smokeIndex + base] = point.x * altitude; 
        this.geometry.attributes.position.array[this.smokeIndex + base + 1] = point.y * altitude; 
        this.geometry.attributes.position.array[this.smokeIndex + base + 2] = point.z * altitude;

        this.geometry.attributes.myStartTime.array[this.smokeIndex] = this.totalRunTime + (1000*i/this.opts.smokePerSecond + 1500);
        this.geometry.attributes.myStartLat.array[this.smokeIndex] = lat;
        this.geometry.attributes.myStartLon.array[this.smokeIndex] = lon;
        this.geometry.attributes.altitude.array[this.smokeIndex] = altitude;
        this.geometry.attributes.activo.array[this.smokeIndex] = 1.0;
    
        this.geometry.attributes.position.needsUpdate = true;
        this.geometry.attributes.myStartTime.needsUpdate = true;
        this.geometry.attributes.myStartLat.needsUpdate = true;
        this.geometry.attributes.myStartLon.needsUpdate = true;
        this.geometry.attributes.altitude.needsUpdate = true;
        this.geometry.attributes.activo.needsUpdate = true;

        this.smokeIndex++;
        // this.smokeIndex = this.smokeIndex % this.geometry.vertices.length;
        // this.geometry.setDrawRange(0, 5000);

    }


    return startSmokeIndex;

};

SmokeProvider.prototype.extinguish = function(index){
    for(var i = 0; i< this.opts.smokePerPin; i++){
        this.geometry.attributes.activo.array[(i + index) % this.opts.smokeCount] = 0.0;
        this.geometry.attributes.activo.needsUpdate = true;
    }
};

SmokeProvider.prototype.changeAltitude = function(altitude, index){
    for(var i = 0; i< this.opts.smokePerPin; i++){
        this.geometry.attributes.altitude.array[(i + index) % this.opts.smokeCount] = altitude;
        this.geometry.attributes.altitude.needsUpdate = true;
    }

};

SmokeProvider.prototype.tick = function(totalRunTime){
    this.totalRunTime = totalRunTime;
    this.uniforms.currentTime.value = this.totalRunTime;
};

export default SmokeProvider;

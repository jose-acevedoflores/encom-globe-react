import TWEEN from '@tweenjs/tween.js';
import utils from './utils';
import {
    SpriteMaterial,
    Sprite,
    Texture,
    Geometry,
    Vector3,
    LineBasicMaterial,
    Line,
    LinearFilter,
} from  'three';


var createTopCanvas = function(color) {
    var markerWidth = 16,
    markerHeight = 16;

    return utils.renderToCanvas(markerWidth, markerHeight, function(ctx){
        ctx.fillStyle=color;
        ctx.beginPath();
        ctx.arc(markerWidth/2, markerHeight/2, markerWidth/4, 0, 2* Math.PI);
        ctx.fill();
    });

};

var Pin = function(lat, lon, text, altitude, scene, smokeProvider, _opts){

    /* options that can be passed in */
    var opts = {
        lineColor: "#8FD8D8",
        lineWidth: 0.5,
        topColor: "#8FD8D8",
        smokeColor: "#FFF",
        labelColor: "#FFF",
        font: "Inconsolata",
        showLabel: (text.length > 0),
        showTop: (text.length > 0),
        showSmoke: (text.length > 0)
    }

    //    line;

    this.lat = lat;
    this.lon = lon;
    this.text = text;
    this.altitude = altitude;
    this.scene = scene;
    this.smokeProvider = smokeProvider;
    this.dateCreated = Date.now();

    if(_opts){
        for(var i in opts){
            if(_opts[i] !== undefined){
                opts[i] = _opts[i];
            }
        }
    }

    this.opts = opts;

    this.topVisible = opts.showTop;
    this.smokeVisible = opts.showSmoke;
    this.labelVisible = opts.showLabel;

    /* the line */

    this.lineGeometry = new Geometry();
    const lineMaterial = new LineBasicMaterial({
        color: opts.lineColor,
        linewidth: opts.lineWidth
    });

    const point = utils.mapPoint(lat,lon);

    this.lineGeometry.vertices.push(new Vector3(point.x, point.y, point.z));
    this.lineGeometry.vertices.push(new Vector3(point.x, point.y, point.z));
    this.line = new Line(this.lineGeometry, lineMaterial);

    /* the label */
    const labelCanvas = utils.createLabel(text, 18, opts.labelColor, opts.font);
    const labelTexture = new Texture(labelCanvas);
    labelTexture.minFilter = LinearFilter;
    labelTexture.magFilter = LinearFilter;
    labelTexture.needsUpdate = true;

    const labelMaterial = new SpriteMaterial({
       map : labelTexture,
    //    useScreenCoordinates: false,
       opacity:0,
       depthTest: true,
       fog: true,
       name: "whodispin"
    });

   this.labelSprite = new Sprite(labelMaterial);
   this.labelSprite.position.set(point.x*altitude*1.1, point.y*altitude + (point.y < 0 ? -15 : 30), point.z*altitude*1.1);
   this.labelSprite.scale.set(labelCanvas.width, labelCanvas.height);

   /* the top */

   const topTexture = new Texture(createTopCanvas(opts.topColor));
   topTexture.needsUpdate = true;
   const topMaterial = new SpriteMaterial({name:"yolopin", map: topTexture, depthTest: true, fog: true, opacity: 0});
   this.topSprite = new Sprite(topMaterial);
   this.topSprite.scale.set(20, 20);
   this.topSprite.position.set(point.x * altitude, point.y * altitude, point.z * altitude);

   /* the smoke */
   if(this.smokeVisible){
       this.smokeId = smokeProvider.setFire(lat, lon, altitude);
   }

   var _this = this; //arghhh

   /* intro animations */

   if(opts.showTop || opts.showLabel){
       new TWEEN.Tween( {opacity: 0})
           .to( {opacity: 1}, 500 )
           .onUpdate(function(target){
               if(_this.topVisible){
                   topMaterial.opacity = target.opacity;
               } else {
                   topMaterial.opacity = 0;
               }
               if(_this.labelVisible){
                   labelMaterial.opacity = target.opacity;
               } else {
                   labelMaterial.opacity = 0;
               }
           }).delay(1000)
           .start();
   }


   new TWEEN.Tween(point)
   .to( {x: point.x*altitude, y: point.y*altitude, z: point.z*altitude}, 1500 )
   .easing( TWEEN.Easing.Elastic.Out )
   .onUpdate(function(target){
       _this.lineGeometry.vertices[1].x = target.x;
       _this.lineGeometry.vertices[1].y = target.y;
       _this.lineGeometry.vertices[1].z = target.z;
       _this.lineGeometry.verticesNeedUpdate = true;
   }).start();

    /* add to scene */

    if(text !== ""){
        this.scene.add(this.labelSprite);
    }
    this.scene.add(this.line);
    this.scene.add(this.topSprite);

};

Pin.prototype.toString = function(){
    return "" + this.lat + "_" + this.lon;
}

Pin.prototype.changeAltitude = function(altitude){
    var point = utils.mapPoint(this.lat, this.lon);
    var _this = this; // arghhhh

   new TWEEN.Tween({altitude: this.altitude})
   .to( {altitude: altitude}, 1500 )
   .easing( TWEEN.Easing.Elastic.Out )
   .onUpdate(function(target){
       if(_this.smokeVisible){
           _this.smokeProvider.changeAltitude(target.altitude, _this.smokeId);
       }
       if(_this.topVisible){
           _this.topSprite.position.set(point.x * target.altitude, point.y * target.altitude, point.z * target.altitude);
       }
       if(_this.labelVisible){
           _this.labelSprite.position = {x: point.x*target.altitude*1.1, y: point.y*target.altitude + (point.y < 0 ? -15 : 30), z: point.z*target.altitude*1.1};
       }
       _this.lineGeometry.vertices[1].x = point.x * target.altitude;
       _this.lineGeometry.vertices[1].y = point.y * target.altitude;
       _this.lineGeometry.vertices[1].z = point.z * target.altitude;
       _this.lineGeometry.verticesNeedUpdate = true;

   })
   .onComplete(function(){
       _this.altitude = altitude;
       
   }).start();

};

Pin.prototype.hideTop = function(){
    if(this.topVisible){
        this.topSprite.material.opacity = 0.0;
        this.topVisible = false;
    }
};

Pin.prototype.showTop = function(){
    if(!this.topVisible){
        this.topSprite.material.opacity = 1.0;
        this.topVisible = true;
    }
};

Pin.prototype.hideLabel = function(){
    if(this.labelVisible){
        this.labelSprite.material.opacity = 0.0;
        this.labelVisible = false;
    }
};

Pin.prototype.showLabel = function(){
    if(!this.labelVisible){
        this.labelSprite.material.opacity = 1.0;
        this.labelVisible = true;
    }
};

Pin.prototype.hideSmoke = function(){
    if(this.smokeVisible){
        this.smokeProvider.extinguish(this.smokeId);
        this.smokeVisible = false;
    }
};

Pin.prototype.showSmoke = function(){
    if(!this.smokeVisible){
        this.smokeId  = this.smokeProvider.setFire(this.lat, this.lon, this.altitude);
        this.smokeVisible = true;
    }
};

Pin.prototype.age = function(){
    return Date.now() - this.dateCreated;

};

Pin.prototype.remove = function(){
    this.scene.remove(this.labelSprite);
    this.scene.remove(this.line);
    this.scene.remove(this.topSprite);

    if(this.smokeVisible){
        this.smokeProvider.extinguish(this.smokeId);
    }
};

export default Pin;


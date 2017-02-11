class Sprite {
  /**
   * Represents a singular sprite with embedded physics.
   * @constructor
   * @param {string} title - The title of the book.
   * @param {string} author - The author of the book.
  */
  constructor() {
    this.position = {x:0,y:0};
    this.origin = {x:0,y:0};
    this.scale = {width:0,height:0};
    this.speed = {x:0,y:0};
    this.acceleration = {x:0,y:0};
    this.mass = 1;
    this.debug = { drawCollisionMask:0 };
  }

  /*
    * sets a singular resource location for the desired sprite
    * @param {string} url - locaiton of the image resource.
  */
  resource(url){
    this.image = new Array();
    var image = new Image();
    image.src = url;
    image.callback = this;
    image.onload = function(){
      if(this.callback.scale.width==0 && this.callback.scale.height==0 )
       this.callback.transform(this.width, this.height);
       this.collider = this;
    }
    this.image.push(image);
    return this;
  }

  /*
    * @override
    * sets layered image resources for the desired sprite
    * @param {string[]} url - locaitons of the spritesheet.
  */
  resources(urls){
    this.image = new Array();
    for(var i=0;i<urls.length;i++){
      var image = new Image();
      image.src = urls[i];
      image.callback = this;
      image.onload = function(){
        if(this.callback.scale.width==0 && this.callback.scale.height==0 )
         this.callback.transform(this.width, this.height);
      }
      this.image.push(image);
      this.collider = this;
    }
    return this;
  }

  /*
    * moves the  sprite to the given position
    * @param {int} x - x position to move.
    * @param {int} y - y position to move.
  */
  translate(x,y){
    this.position = {x:x,y:y};
    return this;
  }

  /*
    * transform the  sprite to the given scale
    * @param {int} width - desired width.
    * @param {int} height - desired height.
  */
  transform(width,height){
    this.scale = {width:width,height:height};
    return this;
  }

  /*
    * rotates the  sprite by given amount of degrees
    * @param {int} degree - amount of degrees to move.
  */
  rotate(degree){
    this.rotation = (!this.rotation)?degree:this.rotation+degree;
    return this;
  }

  /*
    * sets the origin of the sprite to the given position
    * @param {int} x - anchor in the x position.
    * @param {int} x - anchor in the y position.
  */
  center(x,y){
    this.origin = {x:x,y:y};
    return this;
  }

  /*
    * sets the velocity of the sprite
    * @param {int} x - horizontal velocity component.
    * @param {int} y- vertical velocity component.
  */
  velocity(x,y){
    this.speed = {x:x,y:y};
    return this;
  }

  /*
    * increases the acceleration of the sprite
    * @param {int} x - horizontal acceleration component.
    * @param {int} y- vertical acceleration component.
  */
  accelerate(x,y){
    this.acceleration.x += x;
    this.acceleration.y += x;
    return this;
  }

  /*
    * applies a force to the sprite
    * @param {int} x - horizontal force component.
    * @param {int} y- vertical force component.
  */
  force(x,y){
    this.acceleration.x += (x/this.mass);
    this.acceleration.y += (y/this.mass);
    return this;
  }

  /*
    * sets the weight of the sprite
    * @param {int} x - weight to set.
  */
  weight(w){
    this.mass = w;
    return this;
  }

  /*
    * sets the collision mask of the sprite
    * @param {string} mask - url of the mask to set.
  */
  setCollisionMask(mask){
    var image = new Image();
    image.src = mask;
    image.callback = this;
    this.collider = image;
    return this;
  }

  /*
    * get the collision mask of the sprite
  */
  getCollisionMask(){
    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
    var img = this.collider;
    context.drawImage(img, 0, 0, this.scale.width, this.scale.height);
    return context.getImageData(0, 0, this.scale.width,  this.scale.height);
  }

  /**
   * @author Joseph Lenton - PlayMyCode.com
   * @param {string} sprite - Sprite object this object colliding with.
   */
  IsColliding(sprite){
      // we need to avoid using floats, as were doing array lookups
      var x  = Math.round( this.position.x ),
          y  = Math.round( this.position.y ),
          x2 = Math.round( sprite.position.x ),
          y2 = Math.round( sprite.position.y );

      var w  = this.scale.width,
          h  = this.scale.height,
          w2 = sprite.scale.width,
          h2 = sprite.scale.height ;

      // deal with the image being centred
      if ( false ) {
          // fast rounding, but positive only
          x  -= ( w/2 + 0.5) << 0
          y  -= ( h/2 + 0.5) << 0
          x2 -= (w2/2 + 0.5) << 0
          y2 -= (h2/2 + 0.5) << 0
      }

      // find the top left and bottom right corners of overlapping area
      var xMin = Math.max( x, x2 ),
          yMin = Math.max( y, y2 ),
          xMax = Math.min( x+w, x2+w2 ),
          yMax = Math.min( y+h, y2+h2 );

      // Sanity collision check, we ensure that the top-left corner is both
      // above and to the left of the bottom-right corner.
      if ( xMin >= xMax || yMin >= yMax ) {
          return false;
      }

      var xDiff = xMax - xMin,
          yDiff = yMax - yMin;

      // get the pixels out from the images
      var pixels  = this.getCollisionMask().data,
          pixels2 = sprite.getCollisionMask().data;

      // if the area is really small,
      // then just perform a normal image collision check
      if ( xDiff < 4 && yDiff < 4 ) {
          for ( var pixelX = xMin; pixelX < xMax; pixelX++ ) {
              for ( var pixelY = yMin; pixelY < yMax; pixelY++ ) {
                  if (
                          ( pixels [ ((pixelX-x ) + (pixelY-y )*w )*4 + 3 ] !== 0 ) &&
                          ( pixels2[ ((pixelX-x2) + (pixelY-y2)*w2)*4 + 3 ] !== 0 )
                  ) {
                      return true;
                  }
              }
          }
      } else {
          /* What is this doing?
           * It is iterating over the overlapping area,
           * across the x then y the,
           * checking if the pixels are on top of this.
           *
           * What is special is that it increments by incX or incY,
           * allowing it to quickly jump across the image in large increments
           * rather then slowly going pixel by pixel.
           *
           * This makes it more likely to find a colliding pixel early.
           */

          // Work out the increments,
          // it's a third, but ensure we don't get a tiny
          // slither of an area for the last iteration (using fast ceil).
          var incX = xDiff / 3.0,
              incY = yDiff / 3.0;
          incX = (~~incX === incX) ? incX : (incX+1 | 0);
          incY = (~~incY === incY) ? incY : (incY+1 | 0);

          for ( var offsetY = 0; offsetY < incY; offsetY++ ) {
              for ( var offsetX = 0; offsetX < incX; offsetX++ ) {
                  for ( var pixelY = yMin+offsetY; pixelY < yMax; pixelY += incY ) {
                      for ( var pixelX = xMin+offsetX; pixelX < xMax; pixelX += incX ) {
                          if (
                                  ( pixels [ ((pixelX-x ) + (pixelY-y )*w )*4 + 3 ] !== 0 ) &&
                                  ( pixels2[ ((pixelX-x2) + (pixelY-y2)*w2)*4 + 3 ] !== 0 )
                          ) {
                              return true;
                          }
                      }
                  }
              }
          }
      }

      return false;
  }

  /*
    * updates the sprite once
  */
  update(){
    this.speed = {x: this.speed.x + this.acceleration.x, y: this.speed.y + this.acceleration.y}
    this.position.x += this.speed.x;
    this.position.y += this.speed.y;
  }

  /*
    * renders the sprite on the given canvas
    * @param {int} c - the canvas to draw the sprite on.
  */
  render(c){
    c.save();
    c.translate(this.position.x+this.origin.x,this.position.y+this.origin.y);
    c.rotate(-this.rotation + Math.PI/2.0);
    c.translate(-this.position.x-this.origin.x, -this.position.y-this.origin.y);
    for(var i=0;i<this.image.length;i++){
      c.drawImage(this.image[i],this.position.x,this.position.y,this.scale.width,this.scale.height);
    }
    if(this.debug.drawCollisionMask && this.collider){
      c.drawImage(this.collider,this.position.x,this.position.y,this.scale.width,this.scale.height);
    }
    c.restore();
  }
}

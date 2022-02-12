let world;
let size = 5;
let hammerScale = 1;

// objects
let ball;
let fishes = [];
let corals = [];
let buildings = [];

// position of each room
let blueroomX = size * -2;
let fishroomX = 0;
let cityroomX = size * 2;

// which room is currently displayed
let currentBlue = false;
let currentFish = false;
let currentCity = false;

// 3d models
let koi, coral, car, hammer;

// containers
let blueroom, fishroom, cityroom, hammerBox;

function setup() {
  world = new World("VRScene");
  world.setUserPosition(0, size/3, 2.5 * size);
  
  // set a background color for the world using RGB values
  world.setBackground(250, 210, 225);

  // remove perlin noise bias (towards negative)
  noiseDetail(24);

  let welcome = new Text({
    text: 'Welcome to Infinity!',
    x: 0, y: size * 1.5, z: 0,
    side: 'double',
    scaleX: 20, scaleY: 20,
    red: 0, green: 0, blue: 0
  });
  world.add(welcome);

  let instruct = new Text({
    text: 'Try entering the \nrooms and clicking \non the walls!',
    x: 0, y: 0, z: size,
    scaleX: 10, scaleY: 10,
    rotationX: -90,
    red: 0, green: 0, blue: 0
  });
  world.add(instruct);

  let choose = new Text({
    text: 'Choose a room:',
    x: 0, y: 0.01, z: size * 1.5,
    scaleX: 8, scaleY: 8,
    rotationX: -90,
    red: 0, green: 0, blue: 0
  });
  world.add(choose);

  // blue room button
  let labelBlue = new Text({
    text: '1',
    x: -1, y: 0.01, z: size * 1.7,
    scaleX: 8, scaleY: 8,
    rotationX: -90,
    red: 0, green: 0, blue: 0,
  });
  world.add(labelBlue);

  let buttonBlue = new Circle ({
    x: -1, y: 0.01, z: size * 1.7,
    radius: 0.3, 
    rotationX: -90,
    red: 255, green: 255, blue: 255,
    enterFunction: function(e) {
			e.setScale(1.2, 1.2, 1.2);
		},
		leaveFunction: function(e) {
			e.setScale(1, 1, 1);
		},
    clickFunction: function(e) {
      currentBlue = true;
      currentFish = false;
      currentCity = false;
    }
  });
  world.add(buttonBlue);

  // fish room button
  let labelFish = new Text({
    text: '2',
    x: 0, y: 0.01, z: size * 1.7,
    scaleX: 8, scaleY: 8,
    rotationX: -90,
    red: 0, green: 0, blue: 0,
  });
  world.add(labelFish);

  let buttonFish = new Circle ({
    x: 0, y: 0.01, z: size * 1.7,
    radius: 0.3, 
    rotationX: -90,
    red: 255, green: 255, blue: 255,
    enterFunction: function(e) {
			e.setScale(1.2, 1.2, 1.2);
		},
		leaveFunction: function(e) {
			e.setScale(1, 1, 1);
		},
    clickFunction: function(e) {
      currentBlue = false;
      currentFish = true;
      currentCity = false;
    }
  });
  world.add(buttonFish);

  // city room button
  let labelCity = new Text({
    text: '3',
    x: 1, y: 0.01, z: size * 1.7,
    scaleX: 8, scaleY: 8,
    rotationX: -90,
    red: 0, green: 0, blue: 0,
  });
  world.add(labelCity);

  let buttonCity = new Circle ({
    x: 1, y: 0.01, z: size * 1.7,
    radius: 0.3, 
    rotationX: -90,
    red: 255, green: 255, blue: 255,
    enterFunction: function(e) {
			e.setScale(1.2, 1.2, 1.2);
		},
		leaveFunction: function(e) {
			e.setScale(1, 1, 1);
		},
    clickFunction: function(e) {
      currentBlue = false;
      currentFish = false;
      currentCity = true;
    }
  });
  world.add(buttonCity);

  // floor for user
  let floorPlane = new Plane({
    x: 0, y:0, z: 0,
    width: 100, height: 100,
    rotationX: -90,
    red: 193, green: 215, blue: 208
  });
  world.add(floorPlane);

  // BLUE ROOM: 100 randomly placed tetrahedrons, bouncing dodecahedron, live video of user

  // create a "container" object
  blueroom = new Container3D({
    x: blueroomX, y: size/2, z: 0
  });
  world.add(blueroom);

  // grab a reference to the canvas ID using the 'id' method
  let cnv = createCanvas(512,512).id();

  // create a new video capture instance
  capture = createCapture({
    video: {
            mandatory: {
                        minWidth: 320,
                        minHeight: 240,
                        maxWidth: 320,
                        maxHeight: 240
                      }
           }
  });

  // hide the element on the HTML document (we will choose how we want to display
  // it later in the 'draw' function)
  capture.hide();
  
  // circle to hold user video
  let c = new Circle({
    x: 0, y: 0, z: -size/2 + 0.01,
    radius: 0.5, 
    asset: cnv,
    dynamicTexture: true,
    dynamicTextureWidth: 512,
    dynamicTextureHeight: 512
  });
  blueroom.addChild(c);

  // ring to frame circle
  let frame = new Ring({
    x: 0, y: 0, z: -size/2 + 0.015,
    radiusInner:0.5,
    radiusOuter: 0.55,
    red: 5, green: 15, blue: 70,
    metalness: 1
  });
  blueroom.addChild(frame);

  // add octahedrons to illustrate reflection
  for (let i = 0; i < 100; i++) {
    let o = new Octahedron({
      x: random(-size/2, size/2), y: random(-size/2, size/2), z: random(-size/2, size/2),
      radius: 0.05,
      red: random(220, 255), green: random(100, 200), blue: random(100, 200)
    });
    blueroom.addChild(o);
  }

  // this plane is being set up with a mirror component to reflect items in front of it
  let blueMirrorFront = new Plane({
    x: 0, y: 0, z: -size/2,
    width: size, height: size,
    red: 5, green: 20, blue: 100,
    clickFunction: function(e) {
      if (!e.tag.getAttribute('aframe-mirror') && currentBlue) {
        e.tag.setAttribute('aframe-mirror', "color:#777; textureWidth:1024; textureHeight:1024;");
      }
    }
  });
  blueroom.addChild(blueMirrorFront);

  let blueMirrorBack = new Plane({
    x: 0, y: 0, z: size/2,
    width: size, height: size,
    red: 5, green: 20, blue: 100,
    rotationY: 180,
    clickFunction: function(e) {
      if (!e.tag.getAttribute('aframe-mirror') && currentBlue) {
        e.tag.setAttribute('aframe-mirror', "color:#777; textureWidth:1024; textureHeight:1024;");
      }
    }
  });
  blueroom.addChild(blueMirrorBack);

  let blueMirrorLeft = new Plane({
    x: -size/2, y: 0, z: 0,
    width: size, height: size,
    red: 5, green: 20, blue: 100,
    rotationY: 90,
    clickFunction: function(e) {
      if (!e.tag.getAttribute('aframe-mirror') && currentBlue) {
        e.tag.setAttribute('aframe-mirror', "color:#777; textureWidth:1024; textureHeight:1024;");
      }
    }
  });
  blueroom.addChild(blueMirrorLeft);

  let blueMirrorRight = new Plane({
    x: size/2, y: 0, z: 0,
    width: size, height: size,
    red: 5, green: 20, blue: 100,
    rotationY: -90,
    clickFunction: function(e) {
      if (!e.tag.getAttribute('aframe-mirror') && currentBlue) {
        e.tag.setAttribute('aframe-mirror', "color:#777; textureWidth:1024; textureHeight:1024;");
      }
    }
  });
  blueroom.addChild(blueMirrorRight);

  let bluePlaneTop = new Plane({
    x: 0, y: size/2, z: 0,
    width: size, height: size,
    red: 5, green: 20, blue: 100,
    rotationX: 90
  });
  blueroom.addChild(bluePlaneTop);

  let bluePlaneBottom = new Plane({
    x: 0, y: -size/2 + 0.01, z: 0,
    width: size, height: size,
    red: 5, green: 20, blue: 100,
    rotationX: -90
  });
  blueroom.addChild(bluePlaneBottom);
  
  // add a bouncing dodecahedron
  ball = new Ball(0, 0, 0);

  // FISH ROOM: koi fish swimming in the water using perlin noise, also coral growing on ground

  // create a "container" object
  fishroom = new Container3D({
    x: fishroomX, y: size/2, z: 0
  });
  world.add(fishroom);

  let fishMirrorFront = new Plane({
    x: 0, y: 0, z: -size/2,
    width: size, height: size,
    opacity: 0.5, transparent: true,
    asset: 'water',
		repeatX: 3, repeatY: 3,
    clickFunction: function(e) {
      if (!e.tag.getAttribute('aframe-mirror') && currentFish) {
        e.tag.setAttribute('aframe-mirror', "color:#777; textureWidth:1024; textureHeight:1024;");
      }
    }
  });
  fishroom.addChild(fishMirrorFront);

  let fishMirrorBack = new Plane({
    x: 0, y: 0, z: size/2,
    width: size, height: size,
    opacity: 0.5, transparent: true,
    rotationY: 180,
    asset: 'water',
		repeatX: 3, repeatY: 3,
    clickFunction: function(e) {
      if (!e.tag.getAttribute('aframe-mirror') && currentFish) {
        e.tag.setAttribute('aframe-mirror', "color:#777; textureWidth:1024; textureHeight:1024;");
      }
    }
  });
  fishroom.addChild(fishMirrorBack);

  let fishMirrorLeft = new Plane({
    x: -size/2, y: 0, z: 0,
    width: size, height: size,
    opacity: 0.5, transparent: true,
    rotationY: 90,
    asset: 'water',
		repeatX: 3, repeatY: 3,
    clickFunction: function(e) {
      if (!e.tag.getAttribute('aframe-mirror') && currentFish) {
        e.tag.setAttribute('aframe-mirror', "color:#777; textureWidth:1024; textureHeight:1024;");
      }
    }
  });
  fishroom.addChild(fishMirrorLeft);

  let fishMirrorRight = new Plane({
    x: size/2, y: 0, z: 0,
    width: size, height: size,
    opacity: 0.5, transparent: true,
    rotationY: -90,
    asset: 'water',
		repeatX: 3, repeatY: 3,
    clickFunction: function(e) {
      if (!e.tag.getAttribute('aframe-mirror') && currentFish) {
        e.tag.setAttribute('aframe-mirror', "color:#777; textureWidth:1024; textureHeight:1024;");
      }
    }
  });
  fishroom.addChild(fishMirrorRight);

  let fishPlaneTop = new Plane({
    x: 0, y: size/2, z: 0,
    width: size, height: size,
    opacity: 0.5, transparent: true,
    rotationX: 90,
    asset: 'water',
    repeatX: 3, repeatY: 3
  });
  fishroom.addChild(fishPlaneTop);

  let fishPlaneBottom = new Plane({
    x: 0, y: -size/2 + 0.01, z: 0,
    width: size, height: size,
    rotationX: -90,
    asset: 'sand',
    repeatX: 3, repeatY: 3
  });
  fishroom.addChild(fishPlaneBottom);

  // create 10 fish
  for (let i = 0; i < 10; i++) {
    var temp = new Fish(random(-size/2, size/2), 
      random(-size/2, size/2), random(-size/2, size/2));
    fishes.push( temp );
  }

  // plant 5 coral
  for (let i = 0; i < 5; i++) {
    var temp = new Coral(random(-size/3, size/3), 
      -size/2, random(-size/3, size/3));
    corals.push( temp );
  }

  // CITY ROOM: people walking around, user can add buildings by clicking on hammer

  // create a "container" object
  cityroom = new Container3D({
    x: cityroomX, y: size/2, z: 0
  });
  world.add(cityroom);

  let cityMirrorFront = new Plane({
    x: 0, y: 0, z: -size/2,
    width: size, height: size,
    opacity: 0.8, transparent: true,
    asset: 'sky',
		repeatX: 1, repeatY: 1,
    clickFunction: function(e) {
      if (!e.tag.getAttribute('aframe-mirror') && currentCity) {
        e.tag.setAttribute('aframe-mirror', "color:#777; textureWidth:1024; textureHeight:1024;");
      }
    }
  });
  cityroom.addChild(cityMirrorFront);

  let cityMirrorBack = new Plane({
    x: 0, y: 0, z: size/2,
    width: size, height: size,
    opacity: 0.8, transparent: true,
    rotationY: 180,
    asset: 'sky',
		repeatX: 1, repeatY: 1,
    clickFunction: function(e) {
      if (!e.tag.getAttribute('aframe-mirror') && currentCity) {
        e.tag.setAttribute('aframe-mirror', "color:#777; textureWidth:1024; textureHeight:1024;");
      }
    }
  });
  cityroom.addChild(cityMirrorBack);

  let cityMirrorLeft = new Plane({
    x: -size/2, y: 0, z: 0,
    width: size, height: size,
    opacity: 0.8, transparent: true,
    rotationY: 90,
    asset: 'sky',
		repeatX: 1, repeatY: 1,
    clickFunction: function(e) {
      if (!e.tag.getAttribute('aframe-mirror') && currentCity) {
        e.tag.setAttribute('aframe-mirror', "color:#777; textureWidth:1024; textureHeight:1024;");
      }
    }
  });
  cityroom.addChild(cityMirrorLeft);

  let cityMirrorRight = new Plane({
    x: size/2, y: 0, z: 0,
    width: size, height: size,
    opacity: 0.8, transparent: true,
    rotationY: -90,
    asset: 'sky',
		repeatX: 1, repeatY: 1,
    clickFunction: function(e) {
      if (!e.tag.getAttribute('aframe-mirror') && currentCity) {
        e.tag.setAttribute('aframe-mirror', "color:#777; textureWidth:1024; textureHeight:1024;");
      }
    }
  });
  cityroom.addChild(cityMirrorRight);

  let cityPlaneTop = new Plane({
    x: 0, y: size/2, z: 0,
    width: size, height: size,
    opacity: 0.8, transparent: true,
    rotationX: 90,
    asset: 'sky',
    repeatX: 1, repeatY: 1
  });
  cityroom.addChild(cityPlaneTop);

  let cityPlaneBottom = new Plane({
    x: 0, y: -size/2 + 0.01, z: 0,
    width: size, height: size,
    rotationX: -90,
    asset: 'road',
    repeatX: 3, repeatY: 3
  });
  cityroom.addChild(cityPlaneBottom);

  hammerBox = new Box({
    x: 0, y: size/4, z: 0,
    width: 0.4, height: 1, depth: 0.4,
    opacity: 0, transparent: true,
    rotationZ: 45,
    // hammer expands when user hovers
		enterFunction: function(e) {
			hammerScale = 1.5;
		},
		leaveFunction: function(e) {
			hammerScale = 1;
    },
    upFunction: function(e) {
      let temp = new Building(random(-size/2 + 0.1, size/2 - 0.1), 
        -size/2, random(-size/2 + 0.1, size/2 - 0.1));
      buildings.push( temp );
    }
  });
  cityroom.addChild(hammerBox);

  hammer = new GLTF ({
    x: 0, y: size/4, z: 0,
    rotationZ: 45,
		asset: 'hammer',
    scaleX: 3, scaleY: 2, scaleZ: 3
	});
  cityroom.addChild(hammer);

  // placeholder white cubes for invisible rooms
  box1 = new Box({
    x: blueroomX, y: size/2, z: 0,
    width: size, height: size, depth: size,
    red: 255, green: 255, blue: 255,
    opacity: 0.7
  });
  world.add(box1);

  box2 = new Box({
    x: fishroomX, y: size/2, z: 0,
    width: size, height: size, depth: size,
    red: 255, green: 255, blue: 255,
    opacity: 0.7
  });
  world.add(box2);

  box3 = new Box({
    x: cityroomX, y: size/2, z: 0,
    width: size, height: size, depth: size,
    red: 255, green: 255, blue: 255,
    opacity: 0.7
  });
  world.add(box3);
  
}

function draw() {
  // change world background if user is in a room
  let pos = world.getUserPosition();

  // // check if inside blue room
  // if (pos.x >= blueroomX - size/2 && pos.x <= blueroomX + size/2 &&
  //   pos.z >= -size/2 && pos.z <= size/2 && currentBlue) {
  //     world.setBackground(250, 210, 225);
  //     floorPlane.setColor(250, 210, 225);
  // } else {
  //     world.setBackground(250, 210, 225);
  //     floorPlane.setColor(193, 215, 208);
  // }

  // // check if inside fish room
  // if (pos.x >= fishroomX - size/2 && pos.x <= fishroomX + size/2 &&
  //   pos.z >= -size/2 && pos.z <= size/2 && currentFish) {
  //     world.setAsset('water');
  //     floorPlane.setAsset('sand');
  // } else {
  //     world.setBackground(250, 210, 225);
  //     floorPlane.setColor(193, 215, 208);
  // }
  // // check if inside city room
  // if (pos.x >= cityroomX - size/2 && pos.x <= cityroomX + size/2 &&
  //   pos.z >= -size/2 && pos.z <= size/2 && currentCity) {
  //     world.setAsset('sky');
  //     floorPlane.setAsset('road');
  // } else {
  //     world.setBackground(250, 210, 225);
  //     floorPlane.setColor(193, 215, 208);
  // }

  if (currentBlue) {
    // draw the capture to the canvas (it will function just like an image here), flip video
    push();
    translate(width,0);
    scale(-1, 1);
    image(capture, 0, 0, width, height);
    pop();
    // move bouncing ball
    ball.moveAndDisplay();

    blueroom.show();
    fishroom.hide();
    cityroom.hide();

    box1.hide();
    box2.show();
    box3.show();

  } else if (currentFish) {
    // move all fish
    for (let i = 0; i < fishes.length; i++) {
      fishes[i].moveAndDisplay();
    }
    // grow all coral
    for (let i = 0; i < corals.length; i++) {
      corals[i].moveAndDisplay();
    }

    blueroom.hide();
    fishroom.show();
    cityroom.hide();

    box1.show();
    box2.hide();
    box3.show();

  } else if (currentCity) {
    // display all buildings
    for (let i = 0; i < buildings.length; i++) {
      buildings[i].moveAndDisplay();
    }

    // spin hammer, update size if hovered over
    hammer.spinY(1);
    hammerBox.spinY(1);
    hammer.setScale(3 * hammerScale, 2 * hammerScale, 3 * hammerScale);

    blueroom.hide();
    fishroom.hide();
    cityroom.show();

    box1.show();
    box2.show();
    box3.hide();
  } else {
    blueroom.hide();
    fishroom.hide();
    cityroom.hide();

    box1.show();
    box2.show();
    box3.show();
  }
}

// class to describe a bouncing ball's behavior
class Ball {

	constructor(x,y,z) {
		// construct a new dodecahedron that lives at this position
		this.dodec = new Dodecahedron({
								x:x, y:y, z:z,
								red: 255, green: 0, blue: 140,
								radius: 0.5
		});

		// add the dodecahedron to the world
		blueroom.addChild(this.dodec);

		// keep track of speed
    this.xSpeed = 0.09 * random(-1, 1);
    this.ySpeed = 0.1 * random(1);
    this.zSpeed = 0.09 * random(-1, 1);
	}

	// function to move our ball
	moveAndDisplay() {
    // set the position of our sphere (using the 'nudge' method)
    this.dodec.nudge(this.xSpeed, this.ySpeed, this.zSpeed);
    
    // spin
    this.dodec.spinX(1);
    this.dodec.spinY(1);
    this.dodec.spinZ(1);

    // gravity
    this.ySpeed -= 0.003;
    
    // bouncing
    if (this.dodec.x - this.dodec.radius <= -size/2 || 
      this.dodec.x + this.dodec.radius >= size/2) {
        this.xSpeed *= -1;
    }
    if (this.dodec.y - this.dodec.radius <= -size/2 || 
      this.dodec.y + this.dodec.radius >= size/2) {
        this.ySpeed *= -0.96;
        this.dodec.nudge(0, this.ySpeed, 0);
    }
    if (this.dodec.z - this.dodec.radius <= -size/2 || 
      this.dodec.z + this.dodec.radius >= size/2) {
        this.zSpeed *= -1;
    }
	}
}

// class to describe a fish's behavior
class Fish {

	constructor(x,y,z) {
		// construct a new Fish that lives at this position
		this.fish = new GLTF ({
      asset: 'koi',
      x: x, y: y, z: z,
      scaleX: 0.001, scaleY: 0.001, scaleZ: 0.001,
      rotationY: random(360)
    });
    fishroom.addChild(this.fish);

		// keep track of offsets in Perlin noise space
		this.xOffset = random(1000);
    this.yOffset = random(2000, 3000);
    this.zOffset = random(3000, 4000);
    this.rotOffset = random(4000, 5000);
	}

	// function to move our fish
	moveAndDisplay() {
		// the particle should randomly move in the x, y, z directions
    let xMovement = map( noise(this.xOffset), 0, 1, -0.03, 0.03);
    let yMovement = map( noise(this.yOffset), 0, 1, -0.03, 0.03);
    let zMovement = map( noise(this.zOffset), 0, 1, -0.03, 0.03);
    let rotation = map( noise(this.rotOffset), 0, 1, -3, 3);

		// update our positions in perlin noise space
		this.xOffset += 0.01;
    this.yOffset += 0.01;
    this.zOffset += 0.01;
    this.rotOffset += 0.01;

		// set the position of our fish (using the 'nudge' method)
    this.fish.nudge(xMovement, yMovement, zMovement);
    this.fish.spinY(rotation);
    
		// wraparound
		if (this.fish.x <= -size/3) {
      this.fish.x = size/3;
    } else if (this.fish.x >= size/3) {
      this.fish.x = -size/3;
    }
    if (this.fish.y <= -size/3) {
      this.fish.y = size/3;
    } else if (this.fish.y >= size/3) {
      this.fish.y = size/3;
    }
    if (this.fish.z <= -size/3) {
      this.fish.z = size/3;
    } else if (this.fish.z >= size/3) {
      this.fish.z = -size/3;
    }
	}
}

// class to describe a coral's behavior
class Coral {

	constructor(x,y,z) {
		// construct a new Coral that lives at this position
		this.coral = new GLTF ({
      asset: 'coral',
      x: x, y: y, z: z,
      scaleX: random(0.1, 0.2), scaleY: random(0.1, 0.2), scaleZ: random(0.1, 0.2),
      rotationY: random(360)
    });
    fishroom.addChild(this.coral);
	}

	// function to grow our coral
	moveAndDisplay() {
    let scale = this.coral.getScale();
    if (scale.y <= 0.5) {
      this.coral.setScale( scale.x+0.00005, scale.y+0.0001, scale.z+0.00005);
    }
  }
}

// class to describe a building's behavior
class Building {

	constructor(x,y,z) {
    // construct a new building at this position
    this.color = random(100, 200);
		this.building = new Box({
      x: x, y: y, z: z,
      width: random(0.1, 0.2), height: random(0.5, 2), depth: random(0.1, 0.2),
      red: this.color, green: this.color, blue: this.color,
      metalness: 1
    });
    cityroom.addChild(this.building);
	}

	// function to display our building
	moveAndDisplay() {
    let scale = this.building.getScale();
    if (scale.y <= size * 2/3) {
      this.building.setScaleY(scale.y+0.1);
    }
  }
}
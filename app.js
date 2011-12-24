(function() {
  var App, fov;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  fov = 70;

  App = (function() {

    App.fov = 70;

    function App() {
      this.animate = __bind(this.animate, this);
			this.mouseMoved = __bind(this.mouseMoved, this);
      var camera, container, i, pointLight, radius, rings, scene, segments, sphere;
      this.container = container = document.getElementById("app-container");
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      
      this.container.onmousemove = this.mouseMoved;
      this.container.ontouchstart = function(e){
        e.preventDefault();
      }
      
      this.camera = camera = new THREE.PerspectiveCamera(fov, window.innerWidth / window.innerHeight, 1, 1100);
      this.camera.target = new THREE.Vector3(0, 70, 0);
      this.camera.position.z = 300;
      this.camera.lookAt(this.camera.target);
      this.scene = scene = new THREE.Scene();
      this.renderer = new THREE.WebGLRenderer();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.container.appendChild(this.renderer.domElement);
      pointLight = new THREE.PointLight(0xFFFFFF);
      pointLight.position.x = 10;
      pointLight.position.y = 50;
      pointLight.position.z = 130;
      scene.add(pointLight);
      radius = 30;
      segments = 16;
      rings = 16;
      
      // create the particle variables
			var particleCount = 1800,
					particles = new THREE.Geometry();
			this.particleCount = particleCount;
			this.particles = particles;
					
			// create the particle variables
			var pMaterial = new THREE.ParticleBasicMaterial({
					 color: 0xFFFFFF,
					  size: 20,
					  map: THREE.ImageUtils.loadTexture(
					      "snowflake.png"
					  ),
					  blending: THREE.AdditiveBlending,
					  transparent: true
			});
				

			// now create the individual particles
			for(var p = 0; p < particleCount; p++) {

					// create a particle with random
					// position values, -250 -> 250
					var pX = Math.random() * 1000 - 500,
						  pY = Math.random() * 1000 - 250,
						  pZ = Math.random() * 500 - 250,
						  particle = new THREE.Vertex(
						      new THREE.Vector3(pX, pY, pZ)
						  );
				
					particle.velocity = new THREE.Vector3(
					Math.random()-0.5,              // x
					0, // y: start with random vel
					0);             // z
				
					// add it to the geometry
					particles.vertices.push(particle);
			}

			// create the particle system
			var particleSystem = new THREE.ParticleSystem(
					particles,
					pMaterial);
			particleSystem.sortParticles = true;
			this.particleSystem = particleSystem;

			// add it to the scene
			scene.add(particleSystem);
      
      var sphereMaterial = new THREE.MeshLambertMaterial({
				color: 0xCC0000,
				reflectivity: 1
			});
			
			var doText = function(word, x, y) {
				var text3d = new THREE.TextGeometry( word, {
					size: 70,
					height: 20,
					curveSegments: 3,
					font: "helvetiker"
				});
				text3d.computeBoundingBox();
				var textMaterial = new THREE.MeshPhongMaterial( { color: Math.random() * 0xffffff, overdraw: true } );
				var text = new THREE.Mesh( text3d, textMaterial );
				text.doubleSided = false;

				text.position.x = x;
				text.position.y = y;
				text.position.z = 0;

				text.rotation.x = 0;
				text.rotation.y = Math.PI * 2;

				var textNode = new THREE.Object3D();
				textNode.add( text );
				scene.add(textNode);
			}

      doText("MERRY", -300, 180);      
      doText("BLOODY", -300, 90);      
      doText("CHRISTMAS", -300, 0);
      
      for (i = 1; i <= 6; i++) {
        sphere = new THREE.Mesh(new THREE.SphereGeometry(radius, segments, rings), sphereMaterial);
        sphere.position.x = -200 + i * 70;
        sphere.position.y = -50;
        scene.add(sphere);
      }
    }

    App.prototype.render = function() {
		  var pCount = this.particleCount;
		  var particles = this.particles;
		  while(pCount--) {
		      // get the particle
		      var particle = particles.vertices[pCount];
		      
		      // check if we need to reset
		      if(particle.position.y < -200) {
		          particle.position.y = 600;
		          particle.velocity.y = 0;
		      }
		      
		      // update the velocity with
		      // a splat of randomniz
		      particle.velocity.y -= Math.random() * .01;
		      
		      // and the position
		      particle.position.addSelf(
		          particle.velocity);
		  }
    
      //this.particleSystem.geometry.__dirtyVertices = true;
      return this.renderer.render(this.scene, this.camera);
    };

    App.prototype.animate = function() {
      var _this = this;
      requestAnimationFrame(function() {
        return _this.animate();
      });
      return this.render();
    };

    App.prototype.start = function() {
      return this.animate();
    };
    
    App.prototype.mouseMoved = function(event) {
    	var x = event.pageX || event.offsetX;
    	var y = event.pageY || event.offsetY;
      this.camera.position.x = (this.width/2 - x)*0.1;
      this.camera.lookAt(this.camera.target);
    };

    return App;

  })();

  window.init = function() {
    return new App().start();
  };

}).call(this);

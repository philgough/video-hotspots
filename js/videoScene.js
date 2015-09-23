// Variables 

	// Three.js variables
	var renderer = new THREE.WebGLRenderer( {antialias: true} );


	// Append the canvas element created by the renderer to document body element.
	document.body.appendChild( renderer.domElement );

	// Create a three.js scene
	var scene = new THREE.Scene();

	// Create a three.js camera
	var camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 2, 10000 );
	scene.add(camera);


	renderer.setSize( window.innerWidth, window.innerHeight );



	// create controls for the camera
	// var controls = new THREE.VRControls( camera );


	// 
	// video 
	// 

		// vars for video
		movieBallSize = 1500;

		// add video elemet to the DOM
		var video = document.createElement('video');
		video.src = "assets/video/video.webm";

		video.load();

		video.play();

		video.loop = true;
		video.volume = 0;

		// get the frame and use it as a texture
		videoImage = document.createElement('canvas');
		videoImage.width = 2494;
		videoImage.height = 1246;

		videoImageContext = videoImage.getContext('2d');
		// background colour if no video present
		videoImageContext.fillStyle = '#cccccc';
		videoImageContext.fillRect(0, 0, videoImage.width, videoImage.height);

		// make a ball to play the video on
		videoTexture = new THREE.Texture(videoImage);
		videoTexture.minFilter = THREE.LinearFilter;
		videoTexture.magFilter = THREE.LinearFilter;

		var movieMaterial = new THREE.MeshBasicMaterial({
		  map : videoTexture,
		  overdraw: true,
		  side: THREE.DoubleSide
		});
		var movieGeometry = new THREE.SphereGeometry(movieBallSize, 100, 100);
		var movieBall = new THREE.Mesh(movieGeometry, movieMaterial);

		movieBall.position.set(0, 0, 0);

		// flip the texture horizontally - so video doesn't appear backwards
		movieBall.scale.x = -1;

		scene.add(movieBall);





	// 
	// Raycaster to detect interaction
	// 

		// add raycaster to see if we intersect with the lines
		        var currentIntersected;
		        var mouse = new THREE.Vector2();
		        raycaster = new THREE.Raycaster();
		        raycaster.linePrecision = 3;
		        document.addEventListener( 'mousemove', onDocumentMouseMove, false );
		            //
		            function onDocumentMouseMove( event ) {
		                event.preventDefault();
		                mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
		                mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
		            }
		        // indicator sphere

		        var inter_geometry = new THREE.SphereGeometry( 1.2 );
		        var inter_material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );

		        sphereInter = new THREE.Mesh( inter_geometry, inter_material );
		        sphereInter.visible = false;
		        scene.add( sphereInter );


        //Draw the GeoJSON
        // var json_output = [];
            var test_json = $.getJSON("assets/geoJSON/countries_states.geojson", function (data) { 
                drawThreeGeo(data, movieBallSize - 1, 'sphere', {
                    color: 'yellow'
                })    
            });

                        
        //Set the camera position
            camera.position.set(0,0,-10);            
            
        //Enable controls
            var controls = new THREE.TrackballControls(camera);
            

    function getIntersectedLine(intersects) {
                var j = undefined;
                var k = undefined;
                for (i = 0; i < intersects.length; i++) {
                    if (intersects[i].object.type === 'Line') {
                        j = intersects[i].object;
                        k = intersects[i].point;
                    }
                }
                return {"object":j, "position": k};
            }




	// 
	// render the scene
	// 

		// Request animation frame loop function
		function animate() {

            controls.update();

			raycaster.setFromCamera( mouse, camera );
                var intersects = raycaster.intersectObjects(scene.children, true)
                // console.log(intersects.length)
                // console.log(intersects.length);
                if ( intersects.length > 0 ) {
                    // if (currentIntersected !== undefined && currentIntersected.type !== 'Mesh') {
                        // console.log(currentIntersected.type);
                        if ( currentIntersected !== undefined ) {
                            currentIntersected.material.linewidth = 1;
                        }
                        

                        // currentIntersected = intersects[ 0 ].object;
                        var intersectData = getIntersectedLine(intersects);
                        currentIntersected = intersectData.object;
                        if (currentIntersected){
                            currentIntersected.material.linewidth = 5;
    
                            sphereInter.visible = true;
                            sphereInter.position.copy(intersectData.position);
                            // if (currentIntersected.type !== 'Mesh') {
                                // sphereInter.position.copy( intersects[ 0 ].point );
                            // }
                        }
                } else {

                    if ( currentIntersected !== undefined ) {

                        currentIntersected.material.linewidth = 1;

                    }

                    currentIntersected = undefined;

                    sphereInter.visible = false;

                }


		  render();

		  //Update VR headset position and apply to camera.
		  // controls.update();

		  // Render the scene through the VREffect.
		  // effect.render( scene, camera );
		  requestAnimationFrame( animate );

		}

		animate();  // Kick off animation loop
		



		// render function
		function render() 
		{ 
		  if ( video.readyState === video.HAVE_ENOUGH_DATA ) 
		  {
		    videoImageContext.drawImage( video, 0, 0 );
		    if ( videoTexture ) 
		      videoTexture.needsUpdate = true;
		  }

		  // scene.getObjectByName('overlay').material.map.needsUpdate = true;

		  renderer.render( scene, camera );
		}






	//
	// Listen for keyboard events
	//

		// vars

		var isFullscreen = false;

		function onkey(event) {
		  // turn off prevent default - so we can refresh the page easily
		  // event.preventDefault();

		// if (event.keyCode == 70 || event.keyCode == 13) { //f or enter
			// isFullscreen = !isFullscreen;
		    // effect.setFullScreen(isFullscreen) //fullscreen
		  // }
		};

		window.addEventListener("keydown", onkey, true);

		/*
		Handle window resizes
		*/
		function onWindowResize() {
		  camera.aspect = window.innerWidth / window.innerHeight;
		  camera.updateProjectionMatrix();
		  effect.setSize( window.innerWidth, window.innerHeight );
		}
		window.addEventListener( 'resize', onWindowResize, false );





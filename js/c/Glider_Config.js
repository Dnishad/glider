var camera, scene, s, controls, renderer;
var isMouseDown = false;
var cameraControls, cube;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;
var loader = new THREE.CTMLoader();
var glider_mesh;
var front_light, sun, sunFront;
var back_light;
var right_light, camera_light;
var texArray = [];
var len, index = 0;
var textureCube;
var mesh;
function GliderLoad(geometry, s, material, x, y, z, ry, name, visi)
{
	glider_mesh = new THREE.Mesh(geometry, material);
	glider_mesh.position.set(x, y, z);
	glider_mesh.scale.set(s, s, s);
	glider_mesh.rotation.y = ry;
	glider_mesh.name = name;
	glider_mesh.visible = false;
	scene.add(glider_mesh);
}

function init()
{
	scene = new THREE.Scene();
	var ambientLight = new THREE.AmbientLight(0x858585); //858585
	scene.add(ambientLight);
	var hemiLight = new THREE.HemisphereLight(0x8F8F8F, 0x8F8F8F, .3);
	hemiLight.position.set(0, 50, 0);
	scene.add(hemiLight);
	/*
	dlightHelper = new THREE.HemisphereLightHelper(hemiLight , 10); // 50 is helper size
	scene.add(dlightHelper);
	 */
	front_light = new THREE.SpotLight(0xffffff);
	front_light.position.set(-20, 0, 30);
	front_light.shadow.camera.far = 500;
	front_light.shadow.camera.left = -50;
	front_light.shadow.camera.right = 50;
	front_light.shadow.camera.top = 50;
	front_light.shadow.camera.bottom = -50;
	front_light.intensity = .01;
	front_light.lookAt(new THREE.Vector3(0, 0, 0));
	scene.add(front_light);

	var d = new THREE.SpotLight(0xBDBDBD);
	d.position.set(0, 10, 50);
	d.shadow.camera.far = 100.5;
	d.shadow.camera.left = -300;
	d.shadow.camera.right = 300;
	d.shadow.camera.top = 300;
	d.shadow.camera.bottom = -300;
	d.intensity = .22;
	scene.add(d);

	var s = new THREE.SpotLight(0xBDBDBD);
	s.position.set(0, 10, -50);
	s.shadow.camera.far = 100.5;
	s.shadow.camera.left = -300;
	s.shadow.camera.right = 300;
	s.shadow.camera.top = 300;
	s.shadow.camera.bottom = -300;
	s.intensity = .22;
	scene.add(s);

	sun = new THREE.DirectionalLight(0xffffff);
	sun.position.set(50, 30, 0);
	sun.shadow.camera.far = 100.5;
	sun.shadow.camera.left = -30;
	sun.shadow.camera.right = 30;
	sun.shadow.camera.top = 30;
	sun.shadow.camera.bottom = -30;
	sun.intensity = .2;
	scene.add(sun);

	sunFront = new THREE.DirectionalLight(0xffffff); 
	sunFront.position.set(-50, 30, 0);
	sunFront.shadow.camera.far = 100.5;
	sunFront.shadow.camera.left = -300;
	sunFront.shadow.camera.right = 300;
	sunFront.shadow.camera.top = 300;
	sunFront.shadow.camera.bottom = -300;
	sunFront.intensity = .2;
	scene.add(sunFront);

	camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 20000);
	camera.position.z = 30;
	camera.position.x = -20;
	camera.position.y = 0;
	camera.lookAt(new THREE.Vector3(0, 0, 0));
	scene.add(camera);
	cube = new THREE.Mesh(new THREE.BoxGeometry(0, 0, 0), new THREE.MeshNormalMaterial());
	cube.position.y = 0;
	scene.add(cube);
	cube.add(camera);
	camera.add(front_light);
	controls = new THREE.OrbitControls(camera, Glider);
	container = document.getElementById('Glider');
	document.body.appendChild(container);
	renderer = new THREE.WebGLRenderer(
		{
			antialias: true,
			preserveDrawingBuffer: true
		}
		);
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setClearColor(0xf4f4f4);
	renderer.shadowMapEnabled = true;
	renderer.shadowMapSoft = true;
	renderer.shadowMapType = THREE.PCFSoftShadowMap;
	renderer.physicallyBasedShading = true;
	container.appendChild(renderer.domElement);
	window.addEventListener('resize', onWindowResize, false);
	defaultLoad();
}

var aa = 0;
function defaultLoad()
{
	len = firstLoad.length;
	(function ()
	{
		function load()
		{
			if (index < len)
			{
				(aa++);
				loaderwait(aa);
				var name = firstLoad[index].substring(0, firstLoad[index].lastIndexOf('.'));
				loader.load("3D_File/" + firstLoad[index], function (geometry)
				{
					var c = name.split("_");
					if (c[c.length - 1] == "Glider")
					{
						Glider_material = new THREE.MeshPhongMaterial(
							{
								map: THREE.ImageUtils.loadTexture("tex/SM_Glider_Diffuse.jpg"),
								combine: THREE.MixOperation,
								specular: 0xBABABA,
								shininess: 5,
								side: THREE.DoubleSide,
							}
							);
						Glider_material.map.wrapS = Glider_material.map.wrapT = THREE.RepeatWrapping;
						Glider_material.map.repeat.set(1, 1); //.027  .027
						GliderLoad(geometry, .020, Glider_material, 0, 0, -30, 1, name, false);
					}
					else
					{
						trmaterial = new THREE.MeshPhongMaterial(
							{
								map: THREE.ImageUtils.loadTexture("tex/SM_Glider_Diffuse.jpg"),
								combine: THREE.MixOperation,
								specular: 0xBABABA,
								shininess: 5,
								side: THREE.DoubleSide,
							}
							);
						trmaterial.map.wrapS = trmaterial.map.wrapT = THREE.RepeatWrapping;
						trmaterial.map.repeat.set(1, 1);
						GliderLoad(geometry, .020, trmaterial, 0, 0, -30, 1, name, false);
					}
					++index;
					load();
					if (index == len)
					{
						var indoa = 0;
						scene.traverse(function (glider_mesh)
						{
							if (glider_mesh instanceof THREE.Mesh)
							{
								if (glider_mesh.name == firstLoad[indoa].substring(0, firstLoad[indoa].lastIndexOf('.')))
								{
									glider_mesh.visible = true;
									++indoa;
								}
								else
								{}
							}
						}
						);
						controls.target = new THREE.Vector3(0, 0, 0);
						var a = cube.position.x;
						var b = cube.position.z;
						var c = cube.position.y;
						TweenMax.to(cube.position, 2,
						{
							x: 0,
							z: 0,
							y: 0,
							onUpdate: function ()  {}
						}
						);
						var x = camera.position.x;
						var z = camera.position.z;
						var y = camera.position.y;
						TweenMax.to(camera.position, 2,
						{
							x: -1900,
							z: 200,
							y: 900,
							onUpdate: function ()
							{
								camera.updateProjectionMatrix();
								camera.lookAt(scene.position);
							}
						}
						);
					}
				},
				{
					useWorker: true
				}
				);
			}
			if (index == len)
			{
				$(".progdiv").css("display", "none");
				$(".pload").css("display", "none");
			}
		}
		load();
	}
	)();
}
function loaderwait(value)
{
	$(".progdiv").css("display", "block");
	$(".pload").css("display", "block");
	var progval = Math.floor(100 / 1 * value);
	$("#prog").css(
	{
		"width": progval + "%"
	}
	);
	$("#prog").text(progval + "%");
}
// FOR ADDING TO CART
function cart()
{
	var imgData;
	var strMime = "image/jpeg";
	imgData = renderer.domElement.toDataURL(strMime);
	saveFile(imgData, "Glider.jpg");
}
var saveFile = function (strData, filename)
{
	var link = document.createElement('a');
	if (typeof link.download === 'string')
	{
		document.body.appendChild(link);
		link.download = filename;
		link.href = strData;
		link.click();
		document.body.removeChild(link);
	}
	else
	{
		location.replace(uri);
	}

}

function onWindowResize()
{

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);

}
function animate()
{
	if (!isMouseDown)
	{
		cube.rotation.y -= 0.01;
	}
	requestAnimationFrame(animate);

	controls.update();

	render();

}

function render()
{

	renderer.render(scene, camera);

}
init();
animate();
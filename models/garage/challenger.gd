extends Node3D

# A lightweight reference-inspired muscle car. Front points along +Z.
var white := make_material(Color("#f1f0e9"))
var red := make_material(Color("#d72b26"))
var dark := make_material(Color("#11151c"))
var glass := make_material(Color("#202b38"), 0.25)
var silver := make_material(Color("#89909a"), 0.35)

func _init() -> void:
	var body := MeshInstance3D.new()
	body.name = "body"
	body.mesh = loft([
		[-1.28, 0.48, 0.40, 0.50], [-1.12, 0.58, 0.30, 0.68],
		[0.90, 0.58, 0.30, 0.68], [1.28, 0.51, 0.37, 0.61]
	])
	body.material_override = white
	add_child(body)
	box(body, "Lower sill", Vector3(1.13, 0.12, 2.36), Vector3(0, 0.29, 0), dark)
	var cabin := MeshInstance3D.new()
	cabin.name = "Cabin"
	cabin.mesh = loft([[-0.82, 0.48, 0.65, 0.70], [-0.53, 0.43, 0.66, 1.03], [0.18, 0.43, 0.66, 1.03], [0.55, 0.49, 0.65, 0.69]])
	cabin.material_override = white
	body.add_child(cabin)
	# Sloping windshield and rear glass; cabin side windows.
	panel(body, "Windshield", [Vector3(-0.39,1.01,0.20),Vector3(0.39,1.01,0.20),Vector3(0.45,0.71,0.53),Vector3(-0.45,0.71,0.53)], glass)
	panel(body, "Rear window", [Vector3(-0.39,1.01,-0.55),Vector3(-0.44,0.72,-0.79),Vector3(0.44,0.72,-0.79),Vector3(0.39,1.01,-0.55)], glass)
	for side in [-1, 1]:
		var x := float(side)
		panel(body, "Side windows", [Vector3(x*0.436,0.98,-0.49),Vector3(x*0.436,0.98,0.16),Vector3(x*0.484,0.73,0.47),Vector3(x*0.484,0.73,-0.72)], glass)
		box(body, "Window pillar", Vector3(0.022,0.26,0.045), Vector3(x*0.46,0.85,-0.38), white)
		box(body, "Mirror", Vector3(0.12,0.07,0.11),Vector3(x*0.59,0.74,0.35),white)
		# Red rear-quarter graphic with a sweeping triangular extension.
		panel(body, "Red quarter", [Vector3(x*0.584,0.34,-1.08),Vector3(x*0.584,0.65,-1.08),Vector3(x*0.584,0.63,-0.40),Vector3(x*0.584,0.34,0.20)], red)
		box(body, "Red accent", Vector3(0.014,0.045,0.45),Vector3(x*0.586,0.40,0.26),red)
		var number := Label3D.new()
		number.text = "426"
		number.font_size = 100
		number.outline_size = 14
		number.pixel_size = 0.004
		number.modulate = Color.WHITE
		number.outline_modulate = Color("#16191c")
		number.position = Vector3(x*0.60,0.53,0.17)
		number.rotation.y = x*PI/2
		body.add_child(number)
	box(body,"Red roof",Vector3(0.69,0.014,0.57),Vector3(0,1.039,-0.16),red)
	box(body,"Hood graphic",Vector3(0.36,0.015,0.28),Vector3(0,0.69,0.74),red)
	box(body,"Hood vent left",Vector3(0.14,0.022,0.15),Vector3(-0.30,0.697,0.64),dark)
	box(body,"Hood vent right",Vector3(0.14,0.022,0.15),Vector3(0.30,0.697,0.64),dark)
	box(body,"Front grille",Vector3(0.98,0.15,0.025),Vector3(0,0.52,1.286),dark)
	box(body,"Front splitter",Vector3(1.13,0.065,0.20),Vector3(0,0.29,1.22),dark)
	for x in [-0.42,-0.27,0.27,0.42]:
		var light := sphere(body,"Round headlight",0.065,Vector3(x,0.53,1.306),silver)
		light.scale.z = 0.3
	box(body,"Rear lights",Vector3(1.0,0.075,0.025),Vector3(0,0.51,-1.287),red)
	for x in [-0.39,0.39]:
		box(body,"Spoiler support",Vector3(0.045,0.19,0.045),Vector3(x,0.77,-1.04),dark)
	box(body,"Rear spoiler",Vector3(1.19,0.055,0.23),Vector3(0,0.88,-1.04),white)
	for side in [-1,1]:
		for front in [true,false]:
			var wheel := Node3D.new()
			wheel.name = "wheel-" + ("front" if front else "back") + ("-left" if side == 1 else "-right")
			wheel.position = Vector3(side*0.57,0.30,0.80 if front else -0.80)
			add_child(wheel)
			cylinder(wheel,"Tire",0.30,0.18,Vector3.ZERO,dark)
			cylinder(wheel,"Black rim",0.215,0.19,Vector3.ZERO,dark)
			cylinder(wheel,"Hub",0.052,0.205,Vector3.ZERO,silver)
			for outer in [-1,1]:
				var ring := MeshInstance3D.new()
				var torus := TorusMesh.new()
				torus.inner_radius = 0.205
				torus.outer_radius = 0.223
				torus.rings = 20
				torus.ring_segments = 8
				ring.mesh = torus
				ring.material_override = red
				ring.rotation.z = PI/2
				ring.position.x = outer*0.10
				wheel.add_child(ring)
				for spoke_index in range(5):
					var angle := spoke_index*TAU/5
					var spoke := box(wheel,"Spoke",Vector3(0.025,0.027,0.16),Vector3(outer*0.103,sin(angle)*0.105,cos(angle)*0.105),silver)
					spoke.rotation.x = -angle

func make_material(color: Color, metallic: float = 0.0) -> StandardMaterial3D:
	var material := StandardMaterial3D.new()
	material.albedo_color = color
	material.roughness = 0.7
	material.metallic = metallic
	material.cull_mode = BaseMaterial3D.CULL_DISABLED
	return material

func box(parent: Node3D, title: String, size: Vector3, at: Vector3, material: Material) -> MeshInstance3D:
	var mesh := BoxMesh.new()
	mesh.size = size
	return part(parent,title,mesh,at,material)

func sphere(parent: Node3D, title: String, radius: float, at: Vector3, material: Material) -> MeshInstance3D:
	var mesh := SphereMesh.new()
	mesh.radius = radius
	mesh.height = radius*2
	mesh.radial_segments = 12
	mesh.rings = 6
	return part(parent,title,mesh,at,material)

func cylinder(parent: Node3D, title: String, radius: float, depth: float, at: Vector3, material: Material) -> void:
	var mesh := CylinderMesh.new()
	mesh.top_radius = radius
	mesh.bottom_radius = radius
	mesh.height = depth
	mesh.radial_segments = 24
	var node := part(parent,title,mesh,at,material)
	node.rotation.z = PI/2

func part(parent: Node3D, title: String, mesh: Mesh, at: Vector3, material: Material) -> MeshInstance3D:
	var node := MeshInstance3D.new()
	node.name = title
	node.mesh = mesh
	node.position = at
	node.material_override = material
	parent.add_child(node)
	return node

func panel(parent: Node3D, title: String, points: Array, material: Material) -> void:
	var surface := SurfaceTool.new()
	surface.begin(Mesh.PRIMITIVE_TRIANGLES)
	for index in [0,1,2,0,2,3]:
		surface.add_vertex(points[index])
	surface.generate_normals()
	part(parent,title,surface.commit(),Vector3.ZERO,material)

func loft(sections: Array) -> ArrayMesh:
	var rings: Array = []
	for s in sections:
		var z: float = s[0]
		var w: float = s[1]
		var bottom: float = s[2]
		var top: float = s[3]
		rings.append([Vector3(-w,bottom,z),Vector3(w,bottom,z),Vector3(w,top-0.06,z),Vector3(w-0.06,top,z),Vector3(-w+0.06,top,z),Vector3(-w,top-0.06,z)])
	var surface := SurfaceTool.new()
	surface.begin(Mesh.PRIMITIVE_TRIANGLES)
	for r in range(rings.size()-1):
		for i in range(6):
			var j := (i+1)%6
			for vertex in [rings[r][i],rings[r+1][i],rings[r+1][j],rings[r][i],rings[r+1][j],rings[r][j]]:
				surface.add_vertex(vertex)
	for ring in [rings.front(),rings.back()]:
		for i in range(1,5):
			for vertex in [ring[0],ring[i],ring[i+1]]:
				surface.add_vertex(vertex)
	surface.generate_normals()
	return surface.commit()

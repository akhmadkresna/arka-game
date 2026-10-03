extends Node3D

const HOUSES = [
	preload("res://models/city/building-type-a.glb"),
	preload("res://models/city/building-type-d.glb"),
	preload("res://models/city/building-type-g.glb"),
	preload("res://models/city/building-type-n.glb")
]
const TREE = preload("res://models/city/tree-large.glb")
const ARENA_HALF := 90.0
var buildings: Array[Node3D] = []
var road_material := material(Color("#53677b"))
var grass_material := material(Color("#76c898"))
var sidewalk_material := material(Color("#dae2dd"))
var stripe_material := material(Color("#fff1bb"))

func _ready() -> void:
	slab("Grass", Vector3(180,0.08,180),Vector3(0,0.14,0),grass_material)
	# Four wide roads each way, with broad intersections.
	for axis in [-60.0,-20.0,20.0,60.0]:
		slab("Street",Vector3(16,0.06,160),Vector3(axis,0.21,0),road_material)
		slab("Street",Vector3(160,0.06,16),Vector3(0,0.22,axis),road_material)
		for mark in range(-76,77,6):
			var in_crossing := false
			for cross in [-60,-20,20,60]:
				if abs(mark-cross)<10:
					in_crossing = true
			if not in_crossing:
				slab("Lane marking",Vector3(0.20,0.02,2.5),Vector3(axis,0.265,mark),stripe_material)
				slab("Lane marking",Vector3(2.5,0.02,0.20),Vector3(mark,0.265,axis),stripe_material)
	var house_index := 0
	for x in [-40.0,0.0,40.0]:
		for z in [-40.0,0.0,40.0]:
			slab("Sidewalk block",Vector3(25,0.09,25),Vector3(x,0.25,z),sidewalk_material)
			slab("Garden",Vector3(22,0.05,22),Vector3(x,0.32,z),grass_material)
			if x == 0 and z == 0:
				slab("Open play plaza",Vector3(21,0.02,21),Vector3(0,0.36,0),road_material)
				for parking in [-8,-4,0,4,8]:
					slab("Parking line",Vector3(0.15,0.02,5),Vector3(parking,0.38,-7),stripe_material)
			else:
				for offset in [-6.0,6.0]:
					var house: Node3D = HOUSES[house_index % HOUSES.size()].instantiate()
					house.name = "House_" + str(house_index)
					house.scale = Vector3.ONE*5.5
					house.position = Vector3(x+offset,0.36,z)
					house.rotation.y = PI if house_index%2 == 0 else 0.0
					add_child(house)
					buildings.append(house)
					collider("House collision",Vector3(8,6,7),Vector3(x+offset,3.36,z))
					house_index += 1
			for corner in [Vector2(-9,-9),Vector2(9,9),Vector2(-9,9),Vector2(9,-9)]:
				var tree: Node3D = TREE.instantiate()
				tree.scale = Vector3.ONE*6
				tree.position = Vector3(x+corner.x,0.36,z+corner.y)
				add_child(tree)
	# Low perimeter barriers prevent driving off the playground.
	for side in [-1,1]:
		var x_wall := Vector3(side*83,0.65,0)
		var z_wall := Vector3(0,0.65,side*83)
		slab("City boundary",Vector3(0.7,1,167),x_wall,sidewalk_material)
		slab("City boundary",Vector3(167,1,0.7),z_wall,sidewalk_material)
		collider("Boundary collision",Vector3(0.7,1,167),x_wall)
		collider("Boundary collision",Vector3(167,1,0.7),z_wall)

func material(color: Color) -> StandardMaterial3D:
	var result := StandardMaterial3D.new()
	result.albedo_color = color
	result.roughness = 1
	result.shading_mode = BaseMaterial3D.SHADING_MODE_UNSHADED
	return result

func slab(title: String, size: Vector3, at: Vector3, surface: Material) -> void:
	var mesh := BoxMesh.new()
	mesh.size = size
	var node := MeshInstance3D.new()
	node.name = title
	node.mesh = mesh
	node.material_override = surface
	node.position = at
	add_child(node)

func collider(title: String, size: Vector3, at: Vector3) -> void:
	var body := StaticBody3D.new()
	body.name = title
	body.position = at
	var shape := BoxShape3D.new()
	shape.size = size
	var collision := CollisionShape3D.new()
	collision.shape = shape
	body.add_child(collision)
	add_child(body)

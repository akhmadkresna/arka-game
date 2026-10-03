extends Node3D

var car_catalog: Dictionary = JSON.parse_string(FileAccess.get_file_as_string("res://models/garage/cars.json"))
@onready var vehicle: Vehicle = $Vehicle
var signature := ""
var home: Vector3
var reset_id := 0

func _ready() -> void:
	home = vehicle.sphere.global_position
	if not OS.has_feature("web"):
		apply_car("race", Color("#ef5548"))

func _physics_process(_delta: float) -> void:
	if OS.has_feature("web"):
		var raw = JavaScriptBridge.eval("JSON.stringify(window.toyGarageState || {})")
		var state = JSON.parse_string(str(raw))
		if state is Dictionary:
			var toddler := bool(state.get("toddler", true))
			if toddler != vehicle.toddler_mode:
				vehicle.toddler_mode = toddler
				reset_vehicle()
			vehicle.controls_enabled = bool(state.get("driving", false))
			vehicle.touch_steering = clampf(float(state.get("steering", 0)), -1, 1)
			vehicle.touch_throttle = clampf(float(state.get("throttle", 0)), -1, 1)
			vehicle.kid_speed = 0.4 if state.get("easy", true) else 0.65
			AudioServer.set_bus_mute(0, bool(state.get("muted", false)))
			var next_signature = str(state.get("model", "race")) + str(state.get("color", "#ef5548"))
			if signature != next_signature:
				signature = next_signature
				apply_car(str(state.get("model", "race")), Color(str(state.get("color", "#ef5548"))))
			if int(state.get("reset", 0)) != reset_id:
				reset_id = int(state.get("reset", 0))
				reset_vehicle()
	if vehicle.sphere.global_position.y < -4 or absf(vehicle.sphere.global_position.x) > 88 or absf(vehicle.sphere.global_position.z) > 88:
		reset_vehicle()

func reset_vehicle() -> void:
	vehicle.toddler_distance = 0
	vehicle.toddler_speed = 0
	vehicle.sphere.global_position = home
	vehicle.sphere.linear_velocity = Vector3.ZERO
	vehicle.sphere.angular_velocity = Vector3.ZERO
	vehicle.vehicle_model.rotation = Vector3.ZERO
	vehicle.linear_speed = 0
	vehicle.acceleration = 0
	vehicle.angular_speed = 0
	vehicle.prev_position = vehicle.sphere.position - Vector3(0, 0.65, 0)

func apply_car(model_key: String, color: Color) -> void:
	if not car_catalog.has(model_key):
		model_key = "race"
	var old = vehicle.get_node("Container/Model")
	vehicle.vehicle_model.remove_child(old)
	old.queue_free()
	var entry: Dictionary = car_catalog[model_key]
	var scene: PackedScene = load(entry["scene"])
	var model: Node3D = scene.instantiate()
	model.name = "Model"
	model.position.y = float(entry.get("height_offset", 0.0))
	vehicle.vehicle_model.add_child(model)
	model.scale = Vector3.ONE * float(entry.get("scale", 1.0))
	model.rotation.y = deg_to_rad(float(entry.get("rotation_y", 0.0)))
	vehicle.vehicle_body = model.find_child("body", true, false)
	vehicle.wheel_fl = model.find_child("wheel-front-left", true, false)
	vehicle.wheel_fr = model.find_child("wheel-front-right", true, false)
	vehicle.wheel_bl = model.find_child("wheel-back-left", true, false)
	vehicle.wheel_br = model.find_child("wheel-back-right", true, false)
	if not entry.get("preserve_colors", false):
		repaint(model, color)

func repaint(node: Node, color: Color) -> void:
	if node is MeshInstance3D:
		for surface in range(node.mesh.get_surface_count()):
			var original = node.get_active_material(surface)
			if original is StandardMaterial3D and original.albedo_texture:
				var material: StandardMaterial3D = original.duplicate()
				var image: Image = original.albedo_texture.get_image()
				if image.is_compressed():
					image.decompress()
				for y in range(image.get_height()):
					for x in range(image.get_width()):
						var pixel = image.get_pixel(x, y)
						if pixel.s > 0.3 and pixel.v > 0.25:
							image.set_pixel(x, y, Color(color.r * pixel.v, color.g * pixel.v, color.b * pixel.v, pixel.a))
				material.albedo_texture = ImageTexture.create_from_image(image)
				node.set_surface_override_material(surface, material)
	for child in node.get_children():
		repaint(child, color)

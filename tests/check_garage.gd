extends SceneTree

func _initialize() -> void:
	call_deferred("check")

func check() -> void:
	var main = load("res://scenes/main.tscn").instantiate()
	root.add_child(main)
	await process_frame
	main.set_physics_process(false)
	assert(main.get_node("Plane/CollisionShape3D").shape.size.x == 180, "Arena width mismatch")
	assert(main.get_node("City").buildings.size() == 16, "City houses missing")
	for shape in ["race", "small", "suv", "van"]:
		main.apply_car(shape, Color("#ff0000"))
		var body = main.vehicle.vehicle_body
		assert(body != null, "Missing car body: " + shape)
		assert(main.vehicle.wheel_fl != null, "Missing front wheel: " + shape)
		var material = body.get_active_material(0)
		assert(material.albedo_texture != null, "Missing paint texture: " + shape)
		var image = material.albedo_texture.get_image()
		print(shape, " texture ", image.get_size())
		var red_pixels = 0
		for y in image.get_height():
			for x in image.get_width():
				var c = image.get_pixel(x, y)
				if c.r > 0.5 and c.g < 0.1 and c.b < 0.1:
					red_pixels += 1
		assert(red_pixels > 0, "Paint color was not applied: " + shape)
	main.apply_car("challenger", Color("#00ff00"))
	assert(main.vehicle.vehicle_body.material_override.albedo_color.is_equal_approx(Color("#f1f0e9")), "Reference livery should remain white")
	for wheel in [main.vehicle.wheel_fl,main.vehicle.wheel_fr,main.vehicle.wheel_bl,main.vehicle.wheel_br]:
		assert(wheel != null and wheel.get_child_count() >= 5, "Custom wheel missing")
	main.vehicle.sphere.global_position = Vector3(0, -10, 0)
	main.reset_vehicle()
	assert(main.vehicle.sphere.global_position.is_equal_approx(main.home), "Reset failed")
	print("PASS: four generic models, reference Challenger livery/wheels, and reset.")
	main.queue_free()
	await process_frame
	quit()

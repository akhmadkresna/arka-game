extends SceneTree
func _initialize() -> void:
	call_deferred("check")
func check() -> void:
	var scene = load("res://scenes/main.tscn").instantiate()
	root.add_child(scene)
	await process_frame
	var car = scene.get_node("Vehicle")
	car.set_physics_process(false)
	car.toddler_mode = true
	car.touch_throttle = 1
	for tick in range(2400):
		car.drive_toddler(1.0/60)
		var at = car.sphere.global_position
		assert(min(abs(at.x-20),abs(at.x-60),abs(at.z+20),abs(at.z+60)) <= 4.1, "Car left street")
	assert(car.toddler_distance > 0)
	car.touch_throttle = 0
	for tick in range(60): car.drive_toddler(1.0/60)
	var stopped = car.sphere.global_position
	for tick in range(60): car.drive_toddler(1.0/60)
	assert(stopped.distance_to(car.sphere.global_position)<0.001, "Car did not stop")
	print("PASS: toddler route stays on streets for a full loop and stops on release")
	quit()

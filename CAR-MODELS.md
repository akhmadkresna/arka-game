# Adding a car made with ChatGPT

Send the model here and I will integrate it, verify it, and publish the update.

An image is a reference, not a 3D asset. The most useful handoff is a textured
GLB file, or a Blender Python script that builds and exports one. A PNG/JPG
render also works as a reference for me to build a simplified car.

Suggested request to ChatGPT:

> Make a low-poly, game-ready 3D car based on these reference photos. Focus on
> the silhouette and main paint colors. Provide a self-contained GLB, or a
> Blender Python script that exports a GLB with embedded textures. Front points
> along +Z, up is +Y, and total length is about 2.6 units. Put the body at the
> origin and name it body. Keep four wheels separate, named wheel-front-left,
> wheel-front-right, wheel-back-left, wheel-back-right. Wheels rotate around
> local X. Aim for under 10,000 triangles and textures at most 1024 pixels.
> Include a preview image.

## Integration

1. Add the GLB (and referenced texture files) under models/garage/.
2. Add its entry to models/garage/cars.json with label, name, scene, and
   preserve_colors set to true. Scene is a res:// path to the model.
   Optional scale and rotation_y correct size and orientation.
   Optional photo refers to a filename saved in web/.
3. Run sh scripts/build-web.sh and check the car in the preview.
4. Push to the game's main branch. The hosting workflow builds and publishes it.

The game and garage buttons use this same catalog. Preserve_colors retains
the model's paint, decals, and materials. Fused wheels can still drive, but
wheel animation requires separately named wheel nodes.

Uploaded photos stay in browser storage and are never included in deployment.
Only reference images deliberately added to source are published.

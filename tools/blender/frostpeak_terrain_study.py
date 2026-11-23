"""Trace the new painted Frostpeak plan into graded surfaces in an editable Blender scene."""
import argparse
import math
from pathlib import Path
import sys

import bpy
from mathutils import Vector

parser = argparse.ArgumentParser()
parser.add_argument("--out", type=Path, required=True)
out = parser.parse_args(sys.argv[sys.argv.index("--") + 1:]).out.resolve()
out.parent.mkdir(parents=True, exist_ok=True)
art = Path(__file__).resolve().parents[2] / "art-source/frostpeak/frostpeak-painted-layout.png"

bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene
scene.render.resolution_x, scene.render.resolution_y = 1536, 1024
scene.render.resolution_percentage = 100
width = 132
pitch = math.radians(48)
aspect = scene.render.resolution_x / scene.render.resolution_y

# Image-space landmarks with world-space elevations in meters.
stops = {
    "Trailhead": (.44,.88,0),
    "Meadow fork": (.32,.76,.7),
    "Ruined arch": (.13,.68,.6),
    "Meadow bend": (.22,.90,.1),
    "Journal": (.49,.76,.9),
    "West abutment": (.565,.746,1.2),
    "East abutment": (.659,.719,1.2),
    "Lower switchback": (.88,.634,3.0),
    "Middle switchback": (.75,.548,4.9),
    "Upper switchback": (.91,.453,6.7),
    "Mine forecourt": (.86,.249,10.8),
    "Mine entrance": (.86,.199,11.0),
    "Station fork": (.274,.601,2.2),
    "Climbing station": (.335,.464,4.5),
    "West ledge": (.128,.493,4.0),
    "Watchtower approach": (.224,.297,7.2),
    "Watchtower": (.175,.165,9.0),
    "High pasture": (.322,.165,8.6),
    "Upper loop": (.323,.247,8.0),
    "East lookout": (.883,.879,1.5),
}
links = [
    ("Meadow loop", ["Trailhead","Meadow bend","Ruined arch","Meadow fork","Trailhead"], 2.4),
    ("Journal road", ["Trailhead","Journal","West abutment"], 2.6),
    ("Station approach", ["Journal","Meadow fork","Station fork","Climbing station"], 2.4),
    ("Western ascent", ["Station fork","West ledge","Watchtower approach","Watchtower"], 2.0),
    ("Watchtower loop", ["Watchtower","High pasture","Upper loop","Watchtower approach"], 1.8),
    ("Creek bridge", ["West abutment","East abutment"], 2.1),
    ("East overlook", ["East abutment","East lookout"], 1.8),
    ("Mine switchbacks", ["East abutment","Lower switchback","Middle switchback","Upper switchback",
                           "Mine forecourt","Mine entrance"], 2.5),
]

def world(point):
    u,v,z = point
    return Vector(((u-.5)*width, ((.5-v)*width/aspect-z*math.cos(pitch))/math.sin(pitch), z))

locations = {name:world(point) for name,point in stops.items()}
seen = {"Trailhead"}
while True:
    reached = seen | {name for _,nodes,_ in links if seen.intersection(nodes) for name in nodes}
    if reached == seen:
        break
    seen = reached
assert seen == set(stops), "Some Frostpeak stops have no route from the trailhead"

for name, location in locations.items():
    marker = bpy.data.objects.new(name,None)
    scene.collection.objects.link(marker)
    marker.empty_display_type = 'CIRCLE'
    marker.empty_display_size = .9
    marker.location = location
    marker.show_name = True

for name,nodes,trail_width in links:
    for start,end in zip(nodes,nodes[1:]):
        a,b = locations[start],locations[end]
        direction = b-a
        horizontal = math.hypot(direction.x,direction.y)
        assert horizontal and abs(direction.z)/horizontal <= .35, f"Steep route: {start} → {end}"
        offset = Vector((-direction.y,direction.x,0)).normalized()*trail_width/2
        mesh = bpy.data.meshes.new(name)
        mesh.from_pydata([a+offset,a-offset,b-offset,b+offset],[],[(0,1,2,3)])
        mesh.update()
        strip = bpy.data.objects.new(f"{name} | {start} to {end}",mesh)
        scene.collection.objects.link(strip)

bpy.ops.object.camera_add(location=(0,-100*math.cos(pitch),100*math.sin(pitch)))
camera = bpy.context.object
camera.rotation_euler = (-camera.location).to_track_quat('-Z','Y').to_euler()
camera.data.type = 'ORTHO'
camera.data.ortho_scale = width
camera.data.show_background_images = True
background = camera.data.background_images.new()
background.image = bpy.data.images.load(str(art))
background.image.pack()
background.display_depth = 'BACK'
background.alpha = .8
scene.camera = camera
bpy.ops.wm.save_as_mainfile(filepath=str(out))
print(f"Verified {len(stops)} connected destinations on {len(links)} graded routes.")

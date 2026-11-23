"""Trace the new painted Frostpeak plan into graded surfaces in an editable Blender scene."""
import argparse
import base64
from collections import deque
import json
import math
from pathlib import Path
import sys

import bpy
from mathutils import Vector

parser = argparse.ArgumentParser()
parser.add_argument("--out", type=Path, required=True)
parser.add_argument("--preview-assets", type=Path)
args = parser.parse_args(sys.argv[sys.argv.index("--") + 1:])
out = args.out.resolve()
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

# Orthographic coordinates match the camera painting, including broad walkable clearings.
# The ravine has no walkable span outside the timber bridge.
grid_width, grid_height = 300, 200
clearings = [
    (.35,.84,.17,.086,0.45),   # Lower meadow
    (.33,.46,.14,.055,4.5),   # Climbing station terrace
    (.255,.168,.126,.057,8.6),# Watchtower pasture
    (.859,.266,.10,.041,10.8),# Mine forecourt
    (.866,.878,.055,.04,1.5), # East lookout
]
obstacles = [
    (.29,.397,.096,.045),     # Station building
    (.133,.105,.03,.04),      # Watchtower
    (.848,.153,.046,.04),     # Mine machinery
    (.445,.732,.03,.022),     # Cart and support rock
    (.32,.837,.015,.027),     # Meadow spruce grove
]
trails = []
for name,nodes,trail_width in links:
    for start,end in zip(nodes,nodes[1:]):
        trails.append((name,stops[start],stops[end],trail_width))

def trail_sample(u,v):
    best = (float('inf'),0,0,'')
    for name,(ax,ay,az),(bx,by,bz),trail_width in trails:
        dx,dy=(bx-ax),(by-ay)/aspect
        t=max(0,min(1,((u-ax)*dx+(v-ay)/aspect*dy)/(dx*dx+dy*dy)))
        distance=math.hypot(u-ax-t*dx,(v-ay)/aspect-t*dy)*width
        if distance<best[0]:
            best=(distance,az+t*(bz-az),trail_width,name)
    return best

def ground(u,v):
    distance,z,trail_width,name=trail_sample(u,v)
    creek=.60+.12*max(0,v-.48)
    in_ravine=abs(u-creek)<.028
    deck = name=='Creek bridge' and distance<trail_width/2
    walking=distance<trail_width/2
    for x,y,rx,ry,level in clearings:
        radial=((u-x)/rx)**2+((v-y)/ry)**2
        if radial<1:
            walking=True
            weight=min(1,(1-radial)*.75)*min(1,max(0,distance-1)/4)
            z=z*(1-weight)+level*weight
    if in_ravine and not deck:
        z=-3.5+v*-.7
        walking=False
    elif not walking:
        z+=math.sin(u*43+v*19)*.8
    if any(((u-x)/rx)**2+((v-y)/ry)**2<1 for x,y,rx,ry in obstacles):
        walking=False
    return z,walking

terrain_vertices=[]
for y in range(grid_height+1):
    for x in range(grid_width+1):
        u,v=x/grid_width,y/grid_height
        z,_=ground(u,v)
        terrain_vertices.append(world((u,v,z)))
terrain_faces=[]
walking_faces=[]
floor=bytearray()
for y in range(grid_height):
    for x in range(grid_width):
        i=y*(grid_width+1)+x
        face=(i,i+grid_width+1,i+grid_width+2,i+1)
        terrain_faces.append(face)
        walk=ground((x+.5)/grid_width,(y+.5)/grid_height)[1]
        floor.append(int(walk))
        if walk:
            walking_faces.append(face)

def cell(u,v):
    return int(v*grid_height)*grid_width+int(u*grid_width)

def reachable(start, block_bridge=False):
    queue=deque([start])
    visited={start}
    while queue:
        i=queue.popleft()
        x,y=i%grid_width,i//grid_width
        for dx,dy in ((-1,0),(1,0),(0,-1),(0,1)):
            a,b=x+dx,y+dy
            k=b*grid_width+a
            if not (0<=a<grid_width and 0<=b<grid_height) or not floor[k] or k in visited:
                continue
            if block_bridge and a==int(grid_width*.627) and .68<b/grid_height<.79:
                continue
            visited.add(k)
            queue.append(k)
    return visited

start=cell(*stops["Trailhead"][:2])
assert floor[start]
destinations=reachable(start)
assert all(cell(u,v) in destinations for u,v,_ in stops.values()), "A painted stop has no floor connection"
assert cell(*stops["Mine entrance"][:2]) not in reachable(start,True), "Mine must require the bridge"

image=bpy.data.images.load(str(art))
image.pack()
ground_material=bpy.data.materials.new("Frostpeak | painted camera projection")
ground_material.use_nodes=True
nodes=ground_material.node_tree.nodes
connections=ground_material.node_tree.links
texture=nodes.new('ShaderNodeTexImage')
texture.image=image
emission=nodes.new('ShaderNodeEmission')
connections.new(texture.outputs['Color'],emission.inputs['Color'])
connections.new(emission.outputs[0],nodes.get('Material Output').inputs['Surface'])

def new_mesh(name,faces,material=None):
    mesh=bpy.data.meshes.new(name)
    mesh.from_pydata(terrain_vertices,[],faces)
    mesh.update()
    uv=mesh.uv_layers.new(name='Camera coordinates')
    for loop in mesh.loops:
        x,y=loop.vertex_index%(grid_width+1),loop.vertex_index//(grid_width+1)
        uv.data[loop.index].uv=(x/grid_width,1-y/grid_height)
    obj=bpy.data.objects.new(name,mesh)
    scene.collection.objects.link(obj)
    if material:
        mesh.materials.append(material)
    return obj

new_mesh("Frostpeak continuous terrain",terrain_faces,ground_material)
floor_object=new_mesh("Frostpeak walkable floor",walking_faces)
floor_object.hide_render=True
floor_object.hide_set(True)

# Lift selected painted objects into their own foreground layers. The browser
# uses the same outlines and ground depths to draw the party behind them.
foreground = [
    {"name":"Creek bridge near railing","foot":.774,
     "outline":[(.561,.747),(.586,.755),(.661,.724),(.663,.741),(.591,.775),(.564,.770)]},
    {"name":"East trail spruce","foot":.766,
     "outline":[(.835,.661),(.846,.679),(.846,.699),(.86,.722),(.855,.737),
                (.864,.749),(.846,.756),(.844,.767),(.837,.767),(.831,.754),
                (.815,.746),(.821,.731),(.824,.709),(.831,.690)]},
    {"name":"Meadow spruce","foot":.877,
     "outline":[(.320,.756),(.329,.78),(.33,.804),(.341,.82),(.338,.845),
                (.346,.858),(.326,.868),(.325,.876),(.316,.875),
                (.312,.865),(.299,.859),(.305,.838),(.304,.826),(.311,.803)]},
]
for item in foreground:
    corners=item["outline"]
    mesh=bpy.data.meshes.new(item["name"])
    mesh.from_pydata([world((u,v,ground(u,item["foot"])[0]+.3)) for u,v in corners],
                     [],[list(range(len(corners)-1,-1,-1))])
    mesh.update()
    uv=mesh.uv_layers.new(name='Camera coordinates')
    for loop in mesh.loops:
        x,y=corners[loop.vertex_index]
        uv.data[loop.index].uv=(x,1-y)
    layer=bpy.data.objects.new(item["name"],mesh)
    scene.collection.objects.link(layer)
    mesh.materials.append(ground_material)
    layer.hide_render=True

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
        strip.hide_render = True
        strip.hide_set(True)

bpy.ops.object.camera_add(location=(0,-100*math.cos(pitch),100*math.sin(pitch)))
camera = bpy.context.object
camera.rotation_euler = (-camera.location).to_track_quat('-Z','Y').to_euler()
camera.data.type = 'ORTHO'
camera.data.ortho_scale = width
camera.data.show_background_images = True
background = camera.data.background_images.new()
background.image = image
background.display_depth = 'BACK'
background.alpha = .8
scene.camera = camera
bpy.ops.wm.save_as_mainfile(filepath=str(out))
preview = {
    "w":grid_width,"h":grid_height,"floor":base64.b64encode(floor).decode("ascii"),
    "marks":{name:{"x":u,"y":v} for name,(u,v,_) in stops.items()},
    "foreground":foreground,
}
(out.parent/"frostpeak-floor.json").write_text(json.dumps(preview,separators=(',',':')),encoding='utf8')
if args.preview_assets:
    target=args.preview_assets.resolve()
    target.mkdir(parents=True,exist_ok=True)
    (target/"frostpeak-floor.json").write_text(json.dumps(preview,separators=(',',':')),encoding='utf8')
    scene.view_settings.view_transform='Standard'
    scene.render.image_settings.file_format='WEBP'
    scene.render.image_settings.quality=88
    image.save_render(str(target/"frostpeak-painted-preview.webp"),scene=scene)
print(f"Verified {len(stops)} floor-connected destinations and a bridge-only crossing.")

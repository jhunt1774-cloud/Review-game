"""Build the first Frostpeak traversal slice in Blender; no legacy map inputs."""
import argparse
import math
import random
import sys
from pathlib import Path

import bpy
from mathutils import Vector

parser = argparse.ArgumentParser()
parser.add_argument("--out", required=True, type=Path)
parser.add_argument("--rock-source", type=Path, required=True,
                    help="Folder containing the original Poly Haven Rock Moss Set 01 FBX and textures.")
args = parser.parse_args(sys.argv[sys.argv.index("--") + 1:])
out = args.out.resolve()
out.mkdir(parents=True, exist_ok=True)
rng = random.Random(241)

bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene
scene.render.engine = 'CYCLES'
scene.cycles.samples = 10
scene.cycles.use_denoising = True
scene.render.resolution_x, scene.render.resolution_y = 1280, 960
scene.render.resolution_percentage = 100
scene.view_settings.view_transform = 'AgX'
scene.world = bpy.data.worlds.new("Cold mountain sky")
scene.world.use_nodes = True
background = scene.world.node_tree.nodes["Background"]
background.inputs[0].default_value = (.58, .72, .93, 1)
background.inputs[1].default_value = .8

def material(name, color, variation=0):
    mat = bpy.data.materials.new(name)
    mat.diffuse_color = (*color, 1)
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    shader = nodes.get('Principled BSDF')
    shader.inputs['Base Color'].default_value = (*color, 1)
    shader.inputs['Roughness'].default_value = .85
    if variation:
        links = mat.node_tree.links
        noise = nodes.new('ShaderNodeTexNoise')
        noise.inputs["Scale"].default_value = 12
        ramp = nodes.new('ShaderNodeValToRGB')
        for index, sign in enumerate((-1, 1)):
            ramp.color_ramp.elements[index].color = (*(max(0, min(1, v + sign*variation)) for v in color), 1)
        links.new(noise.outputs['Fac'], ramp.inputs['Fac'])
        links.new(ramp.outputs['Color'], nodes.get('Principled BSDF').inputs['Base Color'])
    return mat

snow = material("Blue-white mountain snow", (.65,.76,.83), .15)
path = material("Packed ochre trail", (.32,.23,.16), .13)
rock = material("Layered slate", (.23,.27,.33), .13)
timber = material("Warm weathered timber", (.24,.12,.07), .1)
canvas = material("Ochre expedition canvas", (.66,.33,.12), .1)
roof = material("Expedition blue", (.095,.23,.30), .07)
cave = material("Mine interior", (.018,.025,.038))
gold = material("Journal brass", (.82,.47,.12))
pine = material("Spruce", (.07,.18,.17), .045)

# The wide shelf follows the new trail. The same vertices form the render and walk floor.
route = [(-7,-12),(-3,-9),(2,-7),(4,-3),(2,1),(-2,4),(-4,8),(-1,11),(3,12)]
segments = list(zip(route, route[1:]))

def distance_to_trail(x, y):
    distance = math.inf
    for (ax, ay), (bx, by) in segments:
        dx, dy = bx-ax, by-ay
        t = max(0, min(1, ((x-ax)*dx + (y-ay)*dy)/(dx*dx+dy*dy)))
        distance = min(distance, math.hypot(x-ax-t*dx,y-ay-t*dy))
    return distance

def height(x, y):
    off = max(0,distance_to_trail(x,y)-2)
    ridge = min(6, off*.56)**1.23
    return (y+13)*.14 + .22*math.sin(y*.34) + ridge*(.64+.36*math.sin(x*.62+y*.25)**2)

def surface(name, vertices, faces, materials):
    mesh=bpy.data.meshes.new(name)
    mesh.from_pydata(vertices,[],faces)
    mesh.update()
    obj=bpy.data.objects.new(name,mesh)
    scene.collection.objects.link(obj)
    for mat in materials:
        mesh.materials.append(mat)
    return obj

spacing=.3
nx,ny=101,101
vertices=[(x*spacing-15,y*spacing-15,height(x*spacing-15,y*spacing-15)) for y in range(ny) for x in range(nx)]
faces=[]
walk=[]
for y in range(ny-1):
    for x in range(nx-1):
        i=y*nx+x
        face=(i,i+1,i+1+nx,i+nx)
        faces.append(face)
        walk.append(distance_to_trail((x+.5)*spacing-15,(y+.5)*spacing-15)<1.65)
terrain=surface("Frostpeak terrain",vertices,faces,[snow])
trail_weight=terrain.data.attributes.new("Trail blend",'FLOAT','POINT')
trail_weight.data.foreach_set("value",[
    max(0,min(1,(1.93-distance_to_trail(x,y))/.56)) for x,y,z in vertices
])
nodes, links = snow.node_tree.nodes, snow.node_tree.links
edge = nodes.new('ShaderNodeAttribute')
edge.attribute_name = trail_weight.name
blend = nodes.new('ShaderNodeMixRGB')
shader = nodes.get('Principled BSDF')
links.new(edge.outputs['Fac'],blend.inputs[0])
links.new(shader.inputs['Base Color'].links[0].from_socket,blend.inputs[1])
blend.inputs[2].default_value = path.diffuse_color
links.new(blend.outputs[0],shader.inputs['Base Color'])
for polygon in terrain.data.polygons:
    polygon.use_smooth=True
floor=surface("Walkable floor | export only",vertices,[f for f,ok in zip(faces,walk) if ok],[])
floor.hide_render=True

def box(name,x,y,z,w,d,h,mat,angle=0):
    bpy.ops.mesh.primitive_cube_add(size=1,location=(x,y,z),rotation=(0,0,angle))
    obj=bpy.context.object
    obj.name=name
    obj.dimensions=(w,d,h)
    obj.data.materials.append(mat)
    return obj

def ground_box(name,x,y,w,d,h,mat,angle=0):
    return box(name,x,y,height(x,y)+h/2,w,d,h,mat,angle)

def stone(x,y,size):
    bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=2,radius=1,location=(x,y,height(x,y)+size*.15))
    obj=bpy.context.object
    obj.name="Slate boulder"
    obj.scale=(size,size*rng.uniform(.55,.9),size*rng.uniform(.45,.88))
    obj.rotation_euler.z=rng.random()*math.tau
    obj.data.materials.append(rock)

def imported_rock_shapes(source):
    bpy.ops.import_scene.fbx(filepath=str(source / 'rock_moss_set_01_4k.fbx'))
    imported = [obj for obj in bpy.context.selected_objects if obj.type == 'MESH']
    if len(imported) != 6:
        raise RuntimeError(f"Expected six Poly Haven rock meshes, got {len(imported)}")
    shapes = {}
    for obj in imported:
        mesh = obj.data.copy()
        mesh.transform(obj.matrix_world)
        bottom = min(v.co.z for v in mesh.vertices)
        center_x = (min(v.co.x for v in mesh.vertices) + max(v.co.x for v in mesh.vertices)) / 2
        center_y = (min(v.co.y for v in mesh.vertices) + max(v.co.y for v in mesh.vertices)) / 2
        for vertex in mesh.vertices:
            vertex.co -= Vector((center_x, center_y, bottom))
        mesh.materials.clear()
        shapes[obj.name[-2:]] = mesh
        bpy.data.objects.remove(obj, do_unlink=True)
    return shapes

def frost_rock_material(source):
    mat = material("Poly Haven slate with top-facing frost", (.24,.29,.37))
    nodes, links = mat.node_tree.nodes, mat.node_tree.links
    diffuse = nodes.new('ShaderNodeTexImage')
    diffuse.image = bpy.data.images.load(str(source / 'rock_moss_set_01_diff_4k.jpg'), check_existing=True)
    desaturate = nodes.new('ShaderNodeHueSaturation')
    desaturate.inputs['Saturation'].default_value = .22
    links.new(diffuse.outputs['Color'], desaturate.inputs['Color'])
    geometry = nodes.new('ShaderNodeNewGeometry')
    separate = nodes.new('ShaderNodeSeparateXYZ')
    links.new(geometry.outputs['Normal'], separate.inputs['Vector'])
    frost = nodes.new('ShaderNodeMapRange')
    frost.inputs['From Min'].default_value = .48
    frost.inputs['From Max'].default_value = .93
    links.new(separate.outputs['Z'], frost.inputs['Value'])
    mix = nodes.new('ShaderNodeMixRGB')
    mix.inputs[2].default_value = (.52,.63,.75,1)
    links.new(frost.outputs[0],mix.inputs[0])
    links.new(desaturate.outputs['Color'],mix.inputs[1])
    shader = nodes.get('Principled BSDF')
    links.new(mix.outputs[0],shader.inputs['Base Color'])
    shader.inputs['Roughness'].default_value = .85
    diffuse.image.pack()
    return mat

for _ in range(105):
    x,y=rng.uniform(-14,14),rng.uniform(-14,14)
    if distance_to_trail(x,y)>2.4:
        stone(x,y,rng.uniform(.3,1.45))

for x,y in [(-10,-9),(-9,-7),(-8,-9),(-11,-7),(-6,-6),(7,-7),(8,-5),(-8,3),(-9,6),(1,8),(8,6)]:
    if distance_to_trail(x,y)<2: continue
    z=height(x,y)
    box("Spruce trunk",x,y,z+.8,.18,.18,1.6,timber)
    for j in range(3):
        bpy.ops.mesh.primitive_cone_add(vertices=9,radius1=.85-j*.18,depth=1.45,location=(x,y,z+1.1+j*.55))
        bpy.context.object.data.materials.append(pine)

# Landmarks sit off the clear walking strip. Their approach points remain on it.
for name,x,y in [("Trailhead",-7,-12),("Journal",4,-3),("Climbing station",-2,4),("Mine entrance",3,12)]:
    marker=bpy.data.objects.new(name,None)
    scene.collection.objects.link(marker)
    marker.empty_display_type='CIRCLE'
    marker.location=(x,y,height(x,y))

for x in (-8.95,-5.05):
    ground_box("Trailhead cairn",x,-12.1,.7,.68,1.05,rock)
    ground_box("Trailhead post",x,-12.1,.18,.18,1.7,timber)
ground_box("Trailhead sign",-7,-12.1,4.1,.14,.55,timber).location.z+=1.35

ground_box("Journal supply crate",6,-3.6,.95,.72,.58,timber)
box("Frozen journal",6,-3.6,height(6,-3.6)+.65,.4,.31,.11,gold,.25)

x,y=-5.2,3.1
z=height(x,y)
box("Climbing station deck",x,y,z+.2,3.4,2.5,.35,timber)
box("Climbing station",x,y,z+1.05,3.1,2.2,1.45,canvas)
box("Snowy station roof",x,y,z+1.96,3.55,2.6,.32,roof)
box("Station doorway",x,y-1.115,z+.82,.63,.08,1.15,timber)
for a,b in [(-7,2.7),(-6.95,3.35),(-5.1,1.75)]:
    ground_box("Expedition equipment",a,b,.57,.46,.42,timber)

x,y=3,13.35
z=height(x,y)
box("Mine opening",x,y,z+1.15,2.65,.55,2.3,cave)
for dx in (-1.49,1.49):
    box("Mine jamb",x+dx,y-.24,z+1.19,.32,.55,2.38,timber)
box("Mine lintel",x,y-.24,z+2.38,3.3,.59,.38,timber)
rock_source = args.rock_source.resolve()
portal_shapes = imported_rock_shapes(rock_source)
portal_material = frost_rock_material(rock_source)
for name in ('01','02','04','05','06'):
    portal_shapes[name].materials.append(portal_material)
for shape, a, b, scale, angle in [
    ('04',.15,13.45,(1.15,.81,1.63),-.28),
    ('01',5.65,13.58,(1.18,.81,1.8),.26),
    ('02',1.5,14.42,(1.13,.68,2.0),.22),
    ('05',4.5,14.57,(1.15,.63,1.77),-.18),
    ('06',-1.45,12.65,(1.1,.83,1.2),.54),
]:
    obj = bpy.data.objects.new(f"Mine cliff | Poly Haven rock {shape}", portal_shapes[shape])
    scene.collection.objects.link(obj)
    obj.location = (a,b,height(a,b)-.32)
    obj.rotation_euler.z = angle
    obj.scale = scale

bpy.ops.object.light_add(type='SUN',location=(-10,-15,24))
bpy.context.object.rotation_euler=(math.radians(27),math.radians(-23),math.radians(-35))
bpy.context.object.data.energy=2.2
bpy.context.object.data.angle=math.radians(13)

bpy.ops.object.camera_add(location=(0,-23,30))
camera=bpy.context.object
camera.rotation_euler=(Vector((0,0,3))-camera.location).to_track_quat('-Z','Y').to_euler()
camera.data.type='ORTHO'
camera.data.ortho_scale=36
scene.camera=camera
scene.render.filepath=str(out/"frostpeak-route.png")
bpy.ops.wm.save_as_mainfile(filepath=str(out/"Frostpeak Route.blend"))
bpy.ops.render.render(write_still=True)

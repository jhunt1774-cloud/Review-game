"""Build the Wildwood art study. Run in Blender with --background --python."""
import argparse
import json
import math
import random
import sys
from pathlib import Path

import bpy
from bpy_extras.object_utils import world_to_camera_view
from mathutils import Vector, noise

parser = argparse.ArgumentParser()
parser.add_argument("--out", type=Path, required=True)
args = parser.parse_args(sys.argv[sys.argv.index("--") + 1:])
out = args.out.resolve()
out.mkdir(parents=True, exist_ok=True)
assets = Path(__file__).resolve().parents[2] / "assets"
random.seed(812)
bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene
scene.render.engine = 'CYCLES'
scene.cycles.samples = 10
scene.cycles.use_denoising = True
scene.cycles.transparent_max_bounces = 12
scene.render.resolution_x, scene.render.resolution_y = 3072, 2048
scene.render.resolution_percentage = 100
scene.view_settings.view_transform = 'Standard'
scene.world = bpy.data.worlds.new("Cool open sky")
scene.world.use_nodes = True
scene.world.node_tree.nodes["Background"].inputs[0].default_value = (.67, .76, .85, 1)
scene.world.node_tree.nodes["Background"].inputs[1].default_value = .68
scene.render.image_settings.file_format = 'PNG'
scene.render.image_settings.color_mode = 'RGB'
scene.render.threads_mode = 'FIXED'
scene.render.threads = 6
bpy.context.preferences.filepaths.save_version = 0

def collection(name):
    col = bpy.data.collections.new(name)
    scene.collection.children.link(col)
    return col

land = collection("01  Valley floor and running water")
timber = collection("02  Hollow crossing | joinery and stone")
places = collection("03  Places in the river valley")
trees = collection("04  Woodland canopy")
brush = collection("05  Bank stones and understory")
rig = collection("06  Cameras, sun and original painting")
guides = collection("07  Walkable ground | export only")
guides.hide_render = True
guides.hide_viewport = True

def mesh(name, verts, faces, group, mat=None):
    data = bpy.data.meshes.new(name)
    data.from_pydata(verts, [], faces)
    data.update()
    obj = bpy.data.objects.new(name, data)
    group.objects.link(obj)
    if mat:
        data.materials.append(mat)
    return obj

def material(name):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    return m, m.node_tree.nodes, m.node_tree.links

def image_node(nodes, name):
    node = nodes.new('ShaderNodeTexImage')
    node.image = bpy.data.images.load(str(assets / (name + '.webp')), check_existing=True)
    return node

def tint_material(name, color):
    m, n, links = material(name)
    bs = n.get('Principled BSDF')
    bs.inputs['Base Color'].default_value = (*color, 1)
    tc = n.new('ShaderNodeTexCoord')
    grain = n.new('ShaderNodeTexNoise')
    grain.inputs['Scale'].default_value = 13
    links.new(tc.outputs['Object'], grain.inputs[0])
    ramp = n.new('ShaderNodeValToRGB')
    for el, factor in zip(ramp.color_ramp.elements, (.55,1.5)):
        el.color = (*[min(1,c*factor) for c in color],1)
    links.new(grain.outputs['Fac'], ramp.inputs['Fac'])
    links.new(ramp.outputs[0], bs.inputs['Base Color'])
    bump=n.new('ShaderNodeBump')
    bump.inputs['Strength'].default_value=.25
    bump.inputs['Distance'].default_value=.05
    links.new(grain.outputs['Fac'],bump.inputs['Height'])
    links.new(bump.outputs[0],bs.inputs['Normal'])
    return m

def mix_texture(n, links, fac, left, right):
    mix = n.new('ShaderNodeMixRGB')
    links.new(fac,mix.inputs[0])
    links.new(left,mix.inputs[1])
    links.new(right,mix.inputs[2])
    return mix.outputs[0]

def river(y):
    return 3.7 - .19*y + 2.35*math.sin(.36*y+.65) + 1.05*math.sin(.18*y+.1)

def halfwidth(y):
    return 1.64+.18*math.sin(y*.8)+.18*math.cos(y*.34)

def field(x,y,f):
    return noise.noise_vector(Vector((x*f,y*f,2.71))).x

def smooth(a,b,t):
    u = min(1,max(0,(t-a)/(b-a)))
    return u*u*(3-2*u)

def hill(x,y,a,b,w,h):
    return math.exp(-(((x-a)/w)**2+((y-b)/h)**2))

angle=.22
bx,by=river(2),2
def bridge_point(x,y):
    return bx+x*math.cos(angle)-y*math.sin(angle), by+x*math.sin(angle)+y*math.cos(angle)
def bridge_local(x,y):
    dx,dy=x-bx,y-by
    return dx*math.cos(angle)+dy*math.sin(angle),-dx*math.sin(angle)+dy*math.cos(angle)

def height(x,y):
    dist=abs(x-river(y))-halfwidth(y)
    banks=smooth(-.37,1.05,dist)
    rises=2.8*hill(x,y,-8,9,6,6)+1.65*hill(x,y,-12,-3,5.8,6.7)+1.15*hill(x,y,1,-9,5.4,6)+2.5*hill(x,y,12,9,7,6)
    rises+=3.8*hill(x,y,24,16,10,7)+2.35*hill(x,y,-23,10,9,7)+1.4*hill(x,y,-24,-14,11,8)
    rough=.18*field(x,y,.52)+.1*field(x,y,1.2)
    ground=1.19+rises+.18*math.sin(x*.47+y*.23)+rough
    u,v=bridge_local(x,y)
    approach=(1-smooth(.78,2.8,abs(v)))*(1-smooth(3.65,5.4,abs(u)))
    ground=ground*(1-approach)+1.30*approach
    return -.68+banks*(ground+.68)+.14*field(x,y,1.8)*(1-banks)

# Follow the valley shoulder, allowing a gradual descent to the west landing.
west=bridge_point(-3.75,0)
east=bridge_point(3.75,0)
main=[(-6,-15),(-7.5,-11),(-7.3,-9),(-6.7,-7),(-5,-5.8),(-3.5,-4.6),(-3.1,-3),(-3.9,-1.8),(-3.9,-.5),(-3.1,.65),(-1.7,1.1),west,east,(10,3.25),(11.4,4.7),(11.2,6.2),(10,8.1),(10.9,10),(13,12.8),(14.4,16)]
spur=[(-3.9,-.5),(-5.2,.2),(-6.6,.8),(-7.8,2),(-8.1,3.5),(-7.65,4.55)]
camp_spur=[(-7.3,-9),(-8.7,-8.6),(-9.8,-7.9)]
# Short branches leave the main trail at the place where their landmark comes into view.
mill_x=river(-4.9)+halfwidth(-4.9)+1.11
hoist_y=-2.9
hoist_x=river(hoist_y)-halfwidth(hoist_y)-.91
gauge_y=8.05
gauge_x=river(gauge_y)-halfwidth(gauge_y)-.69
sites=[
    ('map-detail-2',-12.7,-2.8,2.15,.79),
    ('map-painted-moonwell',-11.6,1.2,1.8,.64),
    ('map-detail-3',-2.25,5.85,2.05,.48),
    ('wildwood-watermill',mill_x,-4.9,3.8,1.22),
    ('forest-courtyard-v2',13.5,.15,3.75,0),
    ('map-painted-ancient-tree',11.35,7.45,4.0,1.02),
    ('map-painted-gate',-5.85,-5.55,2.65,0),
]
sluice_y=-18.0
sluice_x=river(sluice_y)+halfwidth(sluice_y)+.80
# Stops are at the working side of each fixture, clear of its foundation.
outlying={
    'valley-apple-harvest':(-25,-11.7),'valley-cider-press':(-22,5.65),
    'valley-timber-yard':(24,-12.65),'valley-mill-sluice':(sluice_x+1.15,sluice_y-.65),
    'valley-quarry-glass':(26,3.55),'valley-ridge-beacon':(21.3,17.35)
}
routes=[main,spur,camp_spur,
    [(-12.7,-6.3),(-15.8,-7),(-18.2,-9.2),(-22,-10),(-25,-11.7),(-25.1,-14),(-20,-16.8),(-12,-17.2),(-6,-15)],
    [(-25,-11.7),(-27,-8.6),(-27.5,-3.4),(-25.6,.2),(-22.8,3.2),(-22,5.65),(-19.5,6.4),(-17,4.9),(-14,2),(-11.4,.35)],
    [(13.25,-.75),(16,-2.5),(17.5,-5.6),(20.4,-8.3),(24,-12.65),(23,-14.6),(19.1,-17.2),(14,-18.5),(sluice_x+1.15,sluice_y-.65)],
    [(sluice_x+1.15,sluice_y-.65),(river(-14)+3.3,-14),(river(-11)+3.2,-11),(mill_x+1.4,-8.2),(mill_x+1.4,-5.65)],
    [(13.25,-.75),(17.6,-.2),(20.7,2),(23.5,2.15),(26,3.55),(27.2,6.3),(25.7,9.3),(26,12.2),(24,15.1),(21.3,17.35),(18,16.1),(14.4,16)],

    [(-6.7,-7),(-8.55,-5.3),(-10.4,-4.8),(-12.3,-3.9),(-12.6,-3.55)],
    [(-12.6,-3.55),(-13,-2.1),(-12.6,-.35),(-11.4,.35)],
    [(-3.1,.65),(-2.85,2.1),(-3.52,3.45),(-2.85,4.75)],
    [(-1.7,1.1),(-1.35,-.45),(hoist_x-.86,-1.9),(hoist_x-.78,hoist_y-.48)],
    [(-2.85,4.75),(-3.15,6.24),(gauge_x-.95,7.62)],
    [(-10.4,-4.8),(-11.8,-5.4),(-12.7,-6.3)],
    [(10,3.25),(11.05,1.65),(12.45,-.65),(13.25,-.75)],
    [(11.05,1.65),(9.4,.2),(8.75,-1.85),(mill_x+1.38,-3.9),(mill_x+1.40,-5.65)],
]
def trail_dist(x,y):
    best=10000
    for route in routes:
        for (ax,ay),(ex,ey) in zip(route,route[1:]):
            dx,dy=ex-ax,ey-ay
            t=max(0,min(1,((x-ax)*dx+(y-ay)*dy)/(dx*dx+dy*dy)))
            best=min(best,(x-ax-t*dx)**2+(y-ay-t*dy)**2)
    return math.sqrt(best)

def grid(name,nx,ny,size,group):
    verts=[];faces=[]
    for j in range(ny+1):
        y=(j/ny-.5)*size
        for i in range(nx+1):
            x=(i/nx-.5)*size
            verts.append((x,y,height(x,y)))
            if i and j:
                v=len(verts)-1
                faces.append((v-nx-2,v-nx-1,v,v-1))
    return mesh(name,verts,faces,group)

ground=grid("Continuous slopes, west hollow and incised streambed",370,370,76,land)
for face in ground.data.polygons:
    face.use_smooth=True
m,n,l=material("Valley | grass, exposed limestone and trampled trail")
tc=n.new('ShaderNodeTexCoord')
def tiled(nodes, links, tc, name, repeats):
    vec=nodes.new('ShaderNodeVectorMath');vec.operation='SCALE'
    vec.inputs['Scale'].default_value=repeats
    links.new(tc.outputs['Object'],vec.inputs[0])
    tex=image_node(nodes,name);links.new(vec.outputs[0],tex.inputs[0])
    return tex.outputs['Color']
grass=tiled(n,l,tc,'wildwood-forest-floor',.24)
earth=tiled(n,l,tc,'wildwood-painted-ground',.22)
path=tiled(n,l,tc,'map-painted-path',.38)
rock=tiled(n,l,tc,'map-mountain-rock',.38)
def attrib(name):
    attr=ground.data.attributes.new(name,'FLOAT','POINT')
    node=n.new('ShaderNodeAttribute');node.attribute_name=name
    return attr,node.outputs['Fac']
glade,vg=attrib('Glade')
bank,vb=attrib('Exposed bank')
track,vt=attrib('Worn trail')
for p in ground.data.vertices:
    x,y,z=p.co
    d=trail_dist(x,y)
    shore=abs(x-river(y))-halfwidth(y)
    glade.data[p.index].value=max(.15,min(.94,.49+.39*field(x,y,.38)+.30*hill(x,y,-4,-3,5,5)))
    bank.data[p.index].value=1-smooth(.28,1.12,shore+.20*field(x,y,1.7))
    width=.99 + .70*hill(x,y,-3.7,-1.2,3.3,3.3)+.47*hill(x,y,-8.7,-8.5,2.5,2.5)
    track.data[p.index].value=(1-smooth(width*.45,width+.18,d+.23*field(x,y,1.4)))*smooth(.38,1,shore)
base=mix_texture(n,l,vg,grass,earth)
base=mix_texture(n,l,vb,base,rock)
base=mix_texture(n,l,vt,base,path)
# Break up the even valley light with broad canopy shade and warm openings.
tint=n.new('ShaderNodeValToRGB')
tint.color_ramp.elements[0].position=.23;tint.color_ramp.elements[0].color=(.40,.55,.49,1)
tint.color_ramp.elements[1].position=.72;tint.color_ramp.elements[1].color=(1,.99,.79,1)
light_noise=n.new('ShaderNodeTexNoise');light_noise.inputs['Scale'].default_value=.38
light_noise.inputs['Detail'].default_value=2.3;l.new(tc.outputs['Object'],light_noise.inputs[0])
l.new(light_noise.outputs['Fac'],tint.inputs[0])
sunwash=n.new('ShaderNodeMixRGB');sunwash.blend_type='MULTIPLY';sunwash.inputs[0].default_value=.59
l.new(base,sunwash.inputs[1]);l.new(tint.outputs[0],sunwash.inputs[2])
bs=n.get('Principled BSDF');l.new(sunwash.outputs[0],bs.inputs['Base Color'])
bs.inputs['Roughness'].default_value=.92
ground.data.materials.append(m)

# The stream follows the actual bottom of the ravine. Shallows take their tint from the bank distance.
water_verts=[];water_faces=[];depth=[]
for j in range(381):
    y=-38+j*.2
    for i in range(13):
        t=i/6-1
        water_verts.append((river(y)+t*(halfwidth(y)+.3),y,-.07+.016*math.sin(y*4+t*5)))
        depth.append(abs(t)**1.9)
        idx=j*13+i
        if i and j: water_faces.append((idx-14,idx-13,idx,idx-1))
water=mesh('Brook | gravel shallows and deep channel', water_verts,water_faces,land)
m,n,l=material('Cool water | deep teal to pale shallows')
tc=n.new('ShaderNodeTexCoord')
tex=tiled(n,l,tc,'map-painted-water',.19)
a=water.data.attributes.new('Shallows','FLOAT','POINT')
a.data.foreach_set('value',depth)
attr=n.new('ShaderNodeAttribute');attr.attribute_name='Shallows'
ramp=n.new('ShaderNodeValToRGB')
ramp.color_ramp.elements[0].color=(.14,.36,.40,1)
ramp.color_ramp.elements[1].color=(.65,.92,.76,1)
l.new(attr.outputs['Fac'],ramp.inputs[0])
mix=n.new('ShaderNodeMixRGB');mix.blend_type='MULTIPLY';mix.inputs[0].default_value=.83
l.new(tex,mix.inputs[1]);l.new(ramp.outputs[0],mix.inputs[2])
bs=n.get('Principled BSDF');l.new(mix.outputs[0],bs.inputs['Base Color']);bs.inputs['Roughness'].default_value=.37
water.data.materials.append(m)

# Assemble the bridge in local coordinates. Deck crown, rail, joints and piers are real geometry.
wood=[tint_material('Weathered oak %d'%i,c) for i,c in enumerate([(.25,.13,.055),(.32,.19,.087),(.36,.235,.117),(.29,.165,.072)])]
stone=[tint_material('Mossgate limestone %d'%i,c) for i,c in enumerate([(.40,.36,.235),(.31,.30,.195),(.47,.42,.30),(.34,.32,.224)])]
def timber_box(name,x,y,z,sx,sy,sz,mat,tilt=0):
    verts=[]
    for dz in [-sz/2,sz/2]:
        for dx,dy in [(-sx/2,-sy/2),(sx/2,-sy/2),(sx/2,sy/2),(-sx/2,sy/2)]:
            X,Y=bridge_point(x+dx,y+dy)
            verts.append((X,Y,z+dz+tilt*dx))
    return mesh(name,verts,[(3,2,1,0),(4,5,6,7),(0,1,5,4),(1,2,6,5),(2,3,7,6),(3,0,4,7)],timber,mat)
def deck(x): return 1.32+.28*max(0,1-(x/3.68)**2)
for i in range(35):
    x=-3.72+(i+.5)*7.44/35
    timber_box('Adzed deck plank',x,0,deck(x),7.44/35-.009,1.33+random.uniform(-.04,.04),.12,random.choice(wood))
for side in (-1,1):
    for i in range(8):
        x=-3.72+i*.93
        timber_box('Longitudinal beam',x+.465,side*.49,deck(x+.465)-.18,.96,.14,.24,wood[0],(deck(x+.93)-deck(x))/.93)
        timber_box('Hand rail',x+.465,side*.64,deck(x+.465)+.53,.96,.068,.085,wood[1],(deck(x+.93)-deck(x))/.93)
    for x in [-3.64,-2.78,-1.85,-.93,0,.93,1.85,2.78,3.64]:
        timber_box('Rail upright',x,side*.64,deck(x)+.23,.084,.084,.68,wood[0])
    for x in [-2.72,2.72]:
        for row in range(6):
            for k in range(2):
                timber_box('Pier course',x+(k-.5)*.30,side*.61,(row+.5)*.34-.38,.295,.44,.331,random.choice(stone))
        timber_box('Pier cap',x,side*.61,1.70,.77,.54,.15,stone[2])
        for j in range(2):
            timber_box('Parapet block',x,side*.68,1.83+j*.225,.47,.39,.217,stone[(j+1)%4])
        timber_box('Parapet coping',x,side*.68,2.21,.56,.47,.10,stone[2])
    # A polygonal timber arch springs from the masonry below the deck.
    for k in range(10):
        u=-2.72+k*.544; v=u+.544
        def arch(q): return .05+1.09*(1-(q/2.72)**2)
        timber_box('Laminated arch rib',(u+v)/2,side*.51,(arch(u)+arch(v))/2,.556,.17,.20,wood[1],(arch(v)-arch(u))/.544)

# Painted plants are shared cutouts. Each instance stands on the sloping mesh.
cards={}
def card_data(key):
    if key in cards: return cards[key]
    m,n,l=material(key+' | painted cutout')
    tex=image_node(n,key)
    uvn=n.new('ShaderNodeTexCoord');l.new(uvn.outputs['UV'],tex.inputs[0])
    bs=n.get('Principled BSDF')
    l.new(tex.outputs['Color'],bs.inputs['Base Color']);l.new(tex.outputs['Alpha'],bs.inputs['Alpha'])
    bs.inputs['Roughness'].default_value=1
    l.new(tex.outputs['Color'],bs.inputs['Emission Color']);bs.inputs['Emission Strength'].default_value=.32
    w,h=tex.image.size
    r=h/w
    data=bpy.data.meshes.new(key)
    data.from_pydata([(-.5,0,0),(.5,0,0),(.5,.32*r,1.26*r),(-.5,.32*r,1.26*r)],[],[(0,1,2,3)])
    uv=data.uv_layers.new()
    for loop,xy in zip(uv.data,[(0,0),(1,0),(1,1),(0,1)]):loop.uv=xy
    data.materials.append(m);cards[key]=data
    return data

solids=[]
def plant(key,x,y,w,group,mirror=False,foot=0):
    obj=bpy.data.objects.new(key,card_data(key))
    group.objects.link(obj);obj.location=(x,y,height(x,y)-.022)
    obj.scale=(-w if mirror else w,w,w)
    if foot: solids.append((x,y,foot,foot*.78))
    return obj
plant('map-painted-camp',-9.9,-7.85,3.25,places,False,1.05)
plant('map-painted-cave',-7.65,4.82,4.45,places,True,1.27)
plant('map-painted-runestone',-9.33,4.42,.66,places)
for key,x,y,width,foot in sites:
    plant(key,x,y,width,places,key=='wildwood-watermill',foot)
# Keep the archway and courtyard openings walkable while blocking the stonework.
solids.extend([(-7.00,-5.55,.28,.27),(-4.68,-5.55,.28,.27),
               (11.99,.25,.29,.67),(15,.25,.26,.66),(13.5,1.05,.86,.25)])
# Group large crowns along ridges, leaving the road, door and bridge readable.
accepted=[]
for attempt in range(9500):
    if attempt<2800:
        x=random.uniform(-20,20);y=random.uniform(-18,20)
    else:
        x=random.uniform(-35,35);y=random.uniform(-33,33)
        if -20<x<20 and -18<y<20:continue
    if any(abs(x-a)<3.3 and b-3.9<y<b+3.8 for a,b in outlying.values()):continue
    if -28.5<x<-21.5 and -13<y<-5.5:continue
    if abs(x-river(y))<halfwidth(y)+1.00 or trail_dist(x,y)<2.1:continue
    if any(((x-a)/w)**2+((y-b)/h)**2<1 for a,b,w,h in [(-9.6,-8.8,3.8,4.3),(-7.6,3,3.9,3.9),(bx,by-.7,5.5,4),(-3.7,-1,3.6,3.4)]):continue
    if any(abs(x-a)<1.8 and b-3.9<y<b+1 for a,b in [(hoist_x,hoist_y),(gauge_x,gauge_y),(-12.7,-6.3)]):continue
    if any(abs(x-a)<width*.57+1 and b-4.2<y<b+1.2 for _,a,b,width,_ in sites):continue
    patch=field(x,y,.16)
    if patch<-.27 or -12<x<-6 and -13<y<-8.2: continue
    w=random.uniform(2.2,4.2) * (1.08 if y>5 else .98)
    if any(math.hypot(x-a,y-b)<.43*(w+v) for a,b,v in accepted):continue
    # A crown projects uphill from its root in the game camera.
    if bx-3.5<x<bx+4.0 and -4.9<y<2.1:continue
    if any(trail_dist(x+dx,y+w*dy)<.96 for dx in [-w*.29,0,w*.29] for dy in [.25,.65,1.12]):continue
    if abs(bridge_local(x,y+w*.72)[0])<4.6 and abs(bridge_local(x,y+w*.72)[1])<2.4:continue
    species=random.choices(['wildwood-oak','wildwood-sycamore','wildwood-conifer'],[5,2 if abs(x-river(y))<5 else 1,3 if y>5 else .6])[0]
    plant(species,x,y,w,trees,random.choice([True,False]),w*.13)
    accepted.append((x,y,w))
for i in range(3700):
    x=random.uniform(-34,34);y=random.uniform(-32,33)
    if any(math.hypot(x-a,y-b)<2.1 for a,b in outlying.values()):continue
    shore=abs(x-river(y))-halfwidth(y)
    if trail_dist(x,y)<1.08 or any(math.hypot(x-a,y-b)<r for a,b,r in [(-9.9,-7.85,1.85),(-7.65,4.82,2.1),(bx,by,3.75)]):continue
    if -.34<shore<.84:
        continue
    if .84<shore<1.20:
        key='map-painted-rocks'
        w=random.uniform(.38,1.4)
    elif shore>.65 and field(x,y,.44)>.11:
        key=random.choices(['map-painted-ferns','map-painted-rocks'],[8,2])[0]
        w=random.uniform(.37,1.12)
    else: continue
    plant(key,x,y,w,brush,random.choice([True,False]),w*.25 if w>.95 and 'rock' in key else 0)

# Rounded, stratified limestone breaks through the shoulders and along the brook.
# Coordinates of the long seams follow the contours instead of the walking route.
from bmesh import new as new_bmesh, ops as bm_ops

def stone_mesh(name, seed):
    bm = new_bmesh()
    bm_ops.create_icosphere(bm,subdivisions=2,radius=1)
    for vert in bm.verts:
        v=vert.co
        v.x=math.copysign(abs(v.x)**.76,v.x);v.y=math.copysign(abs(v.y)**.81,v.y)
        v *= 1+.21*field(v.x+seed,v.y+v.z,.99)
        v.z = max(-.67,min(.68,v.z))+.06*math.sin(v.x*4+seed)
        v.x += .19*v.z
    data=bpy.data.meshes.new(name);bm.to_mesh(data);bm.free()
    for face in data.polygons:
        face.use_smooth=True
    return data

def limestone_material():
    m,n,l=material('Fractured limestone | moss cap and warm veins')
    tc=n.new('ShaderNodeTexCoord');nz=n.new('ShaderNodeTexNoise')
    nz.inputs['Scale'].default_value=12.9;nz.inputs['Detail'].default_value=5.5
    l.new(tc.outputs['Generated'],nz.inputs[0])
    ramp=n.new('ShaderNodeValToRGB')
    colors=[(.20,(.095,.10,.077)),(.39,(.23,.216,.161)),(.54,(.42,.396,.296)),(.63,(.59,.55,.414)),(.77,(.70,.675,.54))]
    r=ramp.color_ramp
    for i,(at,col) in enumerate(colors):
        el=r.elements[i] if i<2 else r.elements.new(at)
        el.position=at;el.color=(*col,1)
    l.new(nz.outputs['Fac'],ramp.inputs[0])
    separate=n.new('ShaderNodeSeparateXYZ');l.new(tc.outputs['Generated'],separate.inputs[0])
    mult=n.new('ShaderNodeMath');mult.operation='MULTIPLY';l.new(nz.outputs['Fac'],mult.inputs[0]);l.new(separate.outputs['Z'],mult.inputs[1])
    mr=n.new('ShaderNodeValToRGB');mr.color_ramp.elements[0].position=.39;mr.color_ramp.elements[1].position=.58
    l.new(mult.outputs[0],mr.inputs[0])
    moss=n.new('ShaderNodeRGB');moss.outputs[0].default_value=(.148,.157,.049,1)
    # Mineral grain uses the existing mountain texture on all three rock faces.
    grain=image_node(n,'map-mountain-rock');grain.projection='BOX';grain.projection_blend=.24
    l.new(tc.outputs['Generated'],grain.inputs[0])
    blend=n.new('ShaderNodeMixRGB');blend.blend_type='MULTIPLY';blend.inputs[0].default_value=.62
    l.new(ramp.outputs[0],blend.inputs[1]);l.new(grain.outputs[0],blend.inputs[2])
    base=mix_texture(n,l,mr.outputs[0],blend.outputs[0],moss.outputs[0])
    bs=n.get('Principled BSDF');l.new(base,bs.inputs['Base Color'])
    bump=n.new('ShaderNodeBump');bump.inputs['Strength'].default_value=.31;bump.inputs['Distance'].default_value=.10
    l.new(nz.outputs['Fac'],bump.inputs['Height']);l.new(bump.outputs[0],bs.inputs['Normal'])
    return m

stone_mat=limestone_material()
shapes=[stone_mesh('Eroded limestone %02d'%k,k+.4) for k in range(7)]
for data in shapes:data.materials.append(stone_mat)
paving=tint_material('Sun-bleached trail flags',(.36,.292,.168))
pavers=[data.copy() for data in shapes]
for data in pavers:
    data.materials.clear();data.materials.append(paving)
details=random.Random(118)
def boulder(x,y,z,scale,name='Shore limestone'):
    obj=bpy.data.objects.new(name,details.choice(pavers if name=='Inset trail limestone' else shapes));brush.objects.link(obj)
    obj.location=(x,y,z);obj.scale=scale;obj.rotation_euler.z=details.uniform(-.6,.6)
    return obj

for bank_side in (-1,1):
    y=-32
    while y<33:
        y+=details.uniform(.19,.45)
        u=details.uniform(.02,.62);x=river(y)+bank_side*(halfwidth(y)+u)
        a,b=bridge_local(x,y)
        if abs(a)<3.8 and abs(b)<.95:continue
        w=details.uniform(.18,.79)
        boulder(x,y,height(x,y)-.03,(w*.68,w*1.08,w*details.uniform(.6,1.45)))
    # Small gravel bars form on alternate bends.
    for _ in range(730):
        y=details.uniform(-32,33);f=math.sin(y*.63)*bank_side
        if f<-.1:continue
        x=river(y)+bank_side*(halfwidth(y)+details.uniform(-.55,.24))
        s=details.uniform(.055,.235)
        boulder(x,y,max(-.14,height(x,y)),(s*.82,s*1.1,s*.56),'River gravel')
for cx,cy,dx,dy,length in [(-11,3.9,1,.20,5),(-7.2,5.4,.8,.45,4),(-2.8,3.1,.74,.22,4),(-11,-4,.45,.65,4),(-1,-9.8,.9,.28,4),(9,6.8,.32,.82,5)]:
    for _ in range(24):
        t=details.uniform(-.5,.5)*length
        x=cx+dx*t+details.uniform(-.5,.5);y=cy+dy*t+details.uniform(-.5,.5)
        if trail_dist(x,y)<1.28 or math.hypot(x+7.65,y-4.65)<1.7:continue
        s=details.uniform(.21,.79)
        if s>.56:solids.append((x,y,s*.92,s*.69))
        boulder(x,y,height(x,y)-.13,(s*1.10,s*.82,s*1.14),'Outcrop on valley shoulder')
# Stone is laid where carts or feet would wear away the soil. The open forest
# trails stay earthen. Each short course is aligned across its approach.
paved_approaches = [
    ((-6.66,-6.94),(-5.38,-5.95),5,3),  # Mossgate threshold
    ((-8.00,2.38),(-7.76,3.79),5,2),    # sanctuary ascent
    (bridge_point(-5.18,0),bridge_point(-3.74,0),6,4),
    (bridge_point(3.74,0),bridge_point(4.96,0),5,4),
    ((mill_x+1.38,-3.98),(mill_x+1.40,-5.5),5,2),
    ((12.25,-.72),(13.42,-.62),4,2),    # surviving courtyard paving
]
for begin,end,rows,columns in paved_approaches:
    dx,dy=end[0]-begin[0],end[1]-begin[1]
    length=math.hypot(dx,dy);nx,ny=-dy/length,dx/length
    for row in range(rows):
        t=(row+.5)/rows
        for col in range(columns):
            if (col==0 or col==columns-1) and details.random()<.18:continue
            offset=(col-(columns-1)*.5)*.28 + (.055 if row%2==1 else -.055)
            x=begin[0]+dx*t+nx*offset;y=begin[1]+dy*t+ny*offset
            slab=boulder(x,y,height(x,y)+.02,(.168,.112,.050),'Inset trail limestone')
            slab.rotation_euler.z=math.atan2(ny,nx)+details.uniform(-.16,.16)
# Shallow current seams part around the inside gravel bars.
foam_mat=tint_material('Broken water reflections',(.51,.75,.70))
ribbons=[];faces=[]
for _ in range(3500):
    y=details.uniform(-33,33);side=details.choice((-1,1));t=details.uniform(.27,1.0)
    if details.random()>(t**3*.9+.045):continue
    x=river(y)+side*t*halfwidth(y)
    w=details.uniform(.009,.033);length=details.uniform(.06,.39)
    z=-.042
    start=len(ribbons)
    for k in range(5):
        u=k/4;yy=y+u*length
        xx=x+river(yy)-river(y)+math.sin(u*3.14)*length*.11
        ww=.001+w*math.sin(u*math.pi)
        ribbons.extend([(xx-ww,yy,z),(xx+ww,yy,z)])
        if k:faces.append(tuple(start+2*k+q for q in (-2,-1,1,0)))
mesh('Surface glints in shallow current',ribbons,faces,land,foam_mat)

# The overlook is the unloading point for the ranger stores. The timber frame
# spans the bank; the suspended crate is on the water side of its stone footing.
joinery = collection("03b  Trail signs, river gauge and ranger cargo hoist")
hardware = tint_material('Forged iron | hoist fittings',(.083,.098,.091))
hemp = tint_material('Tarred hemp | lifting line',(.21,.14,.061))
ochre = tint_material('Carved waymark | ochre',(.72,.48,.14))
chalk = tint_material('Carved waymark | limestone wash',(.75,.70,.5))
def post(name,a,b,width,depth,mat):
    a,b=Vector(a),Vector(b)
    axis=b-a
    base=axis.to_track_quat('Z','Y').to_matrix()
    vertices=[tuple(a+base@Vector((x*width*.5,y*depth*.5,z*axis.length)))
              for z in (0,1) for x,y in ((-1,-1),(1,-1),(1,1),(-1,1))]
    return mesh(name,vertices,[(3,2,1,0),(4,5,6,7),(0,1,5,4),(1,2,6,5),(2,3,7,6),(3,0,4,7)],joinery,mat)
def spindle(name,a,b,r,mat,sides=12):
    a,b=Vector(a),Vector(b);axis=b-a
    basis=axis.to_track_quat('Z','Y').to_matrix()
    pts=[tuple(end+basis@Vector((r*math.cos(i*math.tau/sides),r*math.sin(i*math.tau/sides),0)))
         for end in (a,b) for i in range(sides)]
    faces=[tuple(reversed(range(sides))),tuple(range(sides,2*sides))]
    faces.extend((i,(i+1)%sides,sides+(i+1)%sides,sides+i) for i in range(sides))
    return mesh(name,pts,faces,joinery,mat)

hx,hy=hoist_x,hoist_y
hz=height(hx,hy)
def lift(x,y,z):return (hx+x,hy+y,hz+z)
for side in (-.41,.41):
    for dx in (-.36,.36):
        x,y=hx+dx,hy+side
        post('Stone bed for hoist', (x,y,height(x,y)-.17),(x,y,height(x,y)+.15),.35,.35,stone[1])
        post('Braced oak trestle',(x,y,height(x,y)+.11),lift(0,side,1.72),.15,.17,wood[1])
    post('Diagonal under lifting jib',lift(-.16,side,.53),lift(.85,side,1.81),.12,.14,wood[0])
    post('Cantilevered oak jib',lift(-.53,side,1.77),lift(1.37,side,1.88),.18,.18,wood[2])
spindle('Winch axle',lift(0,-.65,.91),lift(0,.66,.91),.085,hardware)
spindle('Windlass drum',lift(0,-.36,.91),lift(0,.36,.91),.17,wood[2])
for i in range(11):
    y=-.30+i*.054
    spindle('Coiled turns on drum',lift(0,y,.91),lift(0,y+.029,.91),.185,hemp)
post('Winch crank',lift(0,-.63,.91),lift(-.23,-.63,1.12),.06,.065,hardware)
spindle('Hand grip',lift(-.23,-.63,1.12),lift(-.23,-.83,1.12),.044,wood[2])
spindle('Head sheave',lift(1.27,-.17,1.85),lift(1.27,.17,1.85),.15,hardware)
spindle('Hauling line',lift(.05,0,1.05),lift(1.25,0,1.98),.027,hemp)
spindle('Hanging line',lift(1.39,0,1.87),lift(1.39,0,.64),.027,hemp)
for side in (-.21,.21):
    spindle('Crate sling',lift(1.39,0,.69),lift(1.39,side,.35),.022,hemp)
post('Slung supply crate',lift(1.39,0,-.05),lift(1.39,0,.36),.52,.48,wood[1])
for y in (-.18,.18):
    post('Crate band',lift(1.39,y,-.06),lift(1.39,y,.37),.54,.034,hardware)
solids.append((hx,hy,.58,.60))

# The river gauge and stone bed identify the high-water survey cache upriver.
gx,gy=gauge_x,gauge_y
gz=height(gx,gy)
post('Survey gauge footing',(gx,gy,gz-.13),(gx,gy,gz+.15),.33,.33,stone[1])
post('Flood gauge staff',(gx,gy,gz+.12),(gx,gy,gz+1.28),.18,.14,wood[0])
for i in range(5):
    post('Cut water-level notch',(gx,gy-.08,gz+.36+i*.155),(gx,gy-.08,gz+.396+i*.155),.13 if i%2==0 else .083,.018,chalk)
solids.append((gx,gy,.18,.18))

# Directional arrowboards share a mortised post. The symbols face the game camera.
sx,sy=-4.85,.04
sz=height(sx,sy)
post('Fork waypost',(sx,sy,sz-.06),(sx,sy,sz+1.26),.14,.16,wood[0])
def arrowboard(name,direction,z,colour):
    points=[(-.13,-.10),(.39,-.10),(.39,-.16),(.64,0),(.39,.16),(.39,.1),(-.13,.1)]
    verts=[(sx+direction*x,sy+dy,sz+z+y+direction*x*.08) for dy in (-.13,-.015) for x,y in points]
    count=len(points)
    faces=[tuple(range(count)),tuple(reversed(range(count,2*count)))]
    faces.extend((i,(i+1)%count,count+(i+1)%count,count+i) for i in range(count))
    mesh(name,verts,faces,joinery,wood[2])
    post('Painted blaze', (sx+direction*.28,sy-.138,sz+z-.063),(sx+direction*.28,sy-.138,sz+z+.065),.075,.016,colour)
arrowboard('Left arm | sanctuary',-1,1.07,chalk)
arrowboard('Right arm | crossing',1,.82,ochre)
solids.append((sx,sy,.13,.13))
# Field flowers are confined to the beekeeper's forage meadow.
blooms=[];blossoms=[]
seed=random.Random(712)
for i in range(170):
    a=seed.random()*math.tau;dist=seed.random()**.5
    x=-12.7+math.cos(a)*1.75*dist;y=-6.3+math.sin(a)*.88*dist
    if trail_dist(x,y)<.58:continue
    base_z=height(x,y)+seed.uniform(.08,.16);size=seed.uniform(.023,.051);n=len(blooms)
    blooms.append((x,y,base_z))
    for j in range(8):
        ang=j*math.pi/4;r=size*(1 if j%2==0 else .44)
        blooms.append((x+math.cos(ang)*r,y+math.sin(ang)*r,base_z+.014))
    blossoms.extend((n,n+1+j,n+1+(j+1)%8) for j in range(8))
mesh('Meadow buttercups by the apiary',blooms,blossoms,brush,ochre)

# The cart roads loop back into the original valley. Orchard rows, a screw
# press, lumber stacks, a sluice gate and the signal bowl identify the jobs.
for row in range(2):
    for column in range(4):
        x=-28.1+column*1.92; y=-9.65+row*2.27+.13*math.sin(column)
        plant('wildwood-oak',x,y,1.82+column%2*.18,trees,column%2==0,.27)
apple=tint_material('Russet apple skin',(.48,.069,.022))
def orchard_bin(x,y):
    z=height(x,y)
    for side in [-1,1]:
        for i in range(3):
            lo=z+.07+i*.135
            post('Orchard bin slat',(x-.50,y+side*.33,lo),(x+.50,y+side*.33,lo),.105,.10,wood[i])
            post('Bin end slat',(x+side*.49,y-.34,lo),(x+side*.49,y+.34,lo),.105,.10,wood[i])
    for row in range(3):
        for col in range(5):
            ax=x-.37+col*.18;ay=y-.20+row*.17
            spindle('Picked russet apple',(ax,ay,z+.34),(ax+.015,ay,z+.46),.095,apple,8)
    solids.append((x,y,.52,.36))
orchard_bin(-25.3,-10.78);orchard_bin(-26.45,-10.67)
x,y=-22,6.98;z=height(x,y)
spindle('Cider press stone bed',(x,y,z-.16),(x,y,z+.36),1.05,stone[1],16)
for i in range(18):
    a=i*math.tau/18;px=x+.59*math.cos(a);py=y+.59*math.sin(a)
    post('Slatted apple basket',(px,py,z+.34),(px,py,z+.96),.15,.13,wood[i%3])
for dx in [-.93,.93]:
    post('Press frame upright',(x+dx,y,z+.14),(x+dx,y,z+1.99),.21,.24,wood[0])
post('Screw press crossbeam',(x-1.08,y,z+1.89),(x+1.08,y,z+1.89),.28,.3,wood[1])
spindle('Wooden screw',(x,y,z+.80),(x,y,z+2.35),.11,wood[2])
post('Turning bar',(x-.72,y-.21,z+2.21),(x+.72,y+.21,z+2.21),.095,.10,wood[0])
solids.append((x,y,1.05,.69))
# Weathered stave barrels at the press, with forged hoops and bung lids.
for dx,dy in ((1.52,-.11),(1.75,.66)):
    px,py=x+dx,y+dy;pz=height(px,py)
    spindle('Cider cask belly',(px,py,pz+.07),(px,py,pz+.82),.33,wood[2],14)
    for dz in (.21,.67):
        spindle('Cask hoop',(px,py,pz+dz),(px,py,pz+dz+.055),.345,hardware,14)
    spindle('Cask lid',(px,py,pz+.81),(px,py,pz+.85),.30,wood[0],14)
    solids.append((px,py,.33,.33))
# Timber is stored on the high bank, away from the waterwheel.
x,y=24,-10.55;z=height(x,y)
for row,count in enumerate((5,4,3)):
    for i in range(count):
        py=y+i*.31+row*.155
        spindle('Stacked sawlog',(x-1.75,py,z+.17+row*.28),(x+1.72,py+.06,z+.17+row*.28),.17,wood[i%3])
solids.append((x,y+.66,1.7,.8))
for dx in (-1.1,1.1):
    for sign in (-1,1):
        post('Crossed sawbuck leg',(x+dx,y-1.25+.37*sign,z),(x+dx,y-1.25-.28*sign,z+.98),.105,.13,wood[0])
spindle('Partly sawn log',(x-1.66,y-1.25,z+.79),(x+1.66,y-1.25,z+.79),.21,wood[2])
solids.append((x,y-1.25,1.55,.34))
x,y=sluice_x,sluice_y;z=height(x,y)
for dx in [-1.16,1.16]:
    post('Sluice guide post',(x+dx,y,z-1.33),(x+dx,y,z+1.64),.26,.31,wood[0])
for i in range(6):
    post('Sluice shutter',(x-1.1,y,z-.72+i*.23),(x+1.1,y,z-.72+i*.23),.22,.24,wood[1+i%2])
post('Sluice header',(x-1.38,y,z+1.48),(x+1.38,y,z+1.48),.23,.28,wood[1])
spindle('Lift screw',(x,y,z+.12),(x,y,z+1.95),.082,hardware)
post('Sluice handbar',(x-.4,y,z+1.87),(x+.4,y,z+1.87),.08,.1,wood[1])
solids.append((x,y,1.23,.3))
# Only the repaired gate spills water down this short outlet to the river.
spill_verts=[];spill_faces=[]
for i in range(19):
    t=i/18;px=x+.22-2.62*t;py=y-.17-.22*math.sin(t*math.pi)
    for side in (-1,1):
        sy=py+side*(.22+.16*t)
        spill_verts.append((px,sy,max(-.04,height(px,sy)+.038)))
    if i:spill_faces.append((2*i-2,2*i-1,2*i+1,2*i))
spill=mesh('Tailrace flow after shutter repair',spill_verts,spill_faces,land,water.data.materials[0])
spill.hide_render=True;spill.hide_viewport=True
# Beds of cut stone step back from the quarry floor. The surveyor left a lens
# on the sorting table, below the signal that once marked the ridge road.
x,y=26,5.12;z=height(x,y)
for row in range(3):
    for col in range(5-row):
        px=x-1.75+col*.78+row*.23;py=y+row*.55
        post('Quarried limestone',(px,py,z-.15),(px,py,z+.46+row*.38),.75,.70,stone[(row+col)%3])
solids.append((x,y+.50,2.0,1.12))
for i in range(30):
    dx=details.uniform(-3.4,2.7);dy=details.uniform(1.45,3.4)
    px,py=x+dx,y+dy;shelf=details.uniform(.45,1.05)
    boulder(px,py,height(px,py)+.12,(shelf*1.2,shelf*.79,shelf*1.25),'Split quarry face')
    solids.append((px,py,shelf*.86,shelf*.58))
# The lens lies on an inspection bench where quarried glass was graded.
px=x-2.30; py=y-.20; pz=height(px,py)
for dx in (-.46,.46):
    post('Sorting bench leg',(px+dx,py,pz),(px+dx,py,pz+.57),.13,.20,wood[0])
post('Quarry sorting bench',(px-.69,py,pz+.62),(px+.69,py,pz+.62),.52,.10,wood[2])
glass=tint_material('Blue-green quarry glass',(.11,.43,.47))
spindle('Polished glass lens',(px,py,pz+.69),(px,py,pz+.78),.19,glass,10)
solids.append((px,py,.64,.32))
x,y=21.3,18.46;z=height(x,y)
for tier in range(3):
    spindle('Ridge beacon plinth',(x,y,z+tier*.23-.09),(x,y,z+tier*.23+.17),1.25-.21*tier,stone[tier],8)
for i in range(4):
    a=i*math.pi/2+.45
    post('Brazier leg',(x+.68*math.cos(a),y+.68*math.sin(a),z+.60),(x+.50*math.cos(a),y+.50*math.sin(a),z+1.67),.14,.16,hardware)
spindle('Signal fire bowl',(x,y,z+1.51),(x,y,z+1.74),.78,hardware,12)
for i in range(5):
    a=i*math.pi/5
    spindle('Dry beacon billet',(x-.56*math.cos(a),y-.56*math.sin(a),z+1.79),(x+.56*math.cos(a),y+.56*math.sin(a),z+1.80),.10,wood[0],8)
solids.append((x,y,1.18,1.13))

# Retain the measured timber frames as construction guides. The camera sees
# painted elevations, with the same terrain lighting and depth as the forest.
joinery.hide_render=True
joinery.hide_viewport=True
for key,x,y,w in [
    ('apples',-25.9,-11.02,2.85),('press',-21.48,6.48,3.30),
    ('timber',24,-11.36,4.1),('quarry',25.84,4.59,5.15),
    ('hoist',hoist_x,hoist_y,2.64),('gauge',gauge_x,gauge_y,1.08),
    ('sign',-4.85,.04,1.37),('beacon',21.3,18.30,2.52)
]:
    plant('valley-painted-'+key,x,y,w,places)
closed_gate=plant('valley-painted-sluice',sluice_x,sluice_y,2.85,places)
raised_gate=plant('valley-painted-raised',sluice_x,sluice_y,2.85,places)
raised_gate.hide_render=True
raised_gate.hide_viewport=True

camera=bpy.data.cameras.new('Player view | orthographic')
cam=bpy.data.objects.new('Player view',camera);rig.objects.link(cam)
cam.location=(0,-30,36);target=Vector((0,0,1.8))
cam.rotation_euler=(target-cam.location).to_track_quat('-Z','Y').to_euler()
camera.type='ORTHO';camera.ortho_scale=67;scene.camera=cam
sun=bpy.data.lights.new("Afternoon sunlight",'SUN');sun.energy=2.8;sun.angle=math.radians(10);sun.color=(1,.93,.78)
light=bpy.data.objects.new('Sun through leaves',sun);rig.objects.link(light)
light.rotation_euler=Vector((.57,.60,-1)).to_track_quat('-Z','Y').to_euler()
# An image empty places the exact source inside the project without affecting the render.
ref=bpy.data.objects.new('REFERENCE | Forest river valley - Map Floor Studio',None)
rig.objects.link(ref);ref.empty_display_type='IMAGE';ref.data=bpy.data.images.load(str(assets/'geography-forest.webp'),check_existing=True)
ref.hide_render=True;ref.empty_display_size=30;ref.location=(42,5,2);ref.rotation_euler=cam.rotation_euler

# Export a separate binary floor with the same camera projection as the beauty image.
def solid_mat(name,value):
    m,n,l=material(name);e=n.new('ShaderNodeEmission');e.inputs[0].default_value=(value,value,value,1)
    l.new(e.outputs[0],n.get('Material Output').inputs['Surface']);return m
black=solid_mat("Blocked",0);white=solid_mat("Walkable",1)
floor=ground.copy();floor.data=ground.data.copy();floor.name='Movement floor | water and landmark footprints excluded'
guides.objects.link(floor);floor.data.materials.clear()
floor.data.materials.append(black);floor.data.materials.append(white)
for f in floor.data.polygons:
    x,y,z=f.center
    open_bank=abs(x-river(y))-halfwidth(y)>.72
    f.material_index=int(open_bank and not any(((x-a)/w)**2+((y-b)/h)**2<1 for a,b,w,h in solids))
for i in range(28):
    a=-3.76+i*7.52/28;b=a+7.52/28
    points=[(*bridge_point(u,v),deck(u)+.068) for u,v in [(a,-.61),(b,-.61),(b,.61),(a,.61)]]
    mesh('Crossing floor',points,[(0,1,2,3)],guides,white)
bpy.context.view_layer.update()
def project(x,y,z=None):
    uv=world_to_camera_view(scene,cam,Vector((x,y,height(x,y) if z is None else z)))
    return [round(uv.x,6),round(1-uv.y,6)]
anchors={'camp':project(-8.2,-8.65),'hollow':project(-3.9,-.65),'cave':project(-7.6,3.63),'bridge':project(bx,by,deck(0)+.068),'east':project(*bridge_point(4.05,0))}
# Interactions sit on open ground just outside the painted buildings.
world_stops={**outlying,
    'entry':(-8.1,-9.6),'merchant':(-8.95,-8.43),'m0':(-5.82,-5.94),
    'm1':(-3.88,-.84),'m2':bridge_point(-4.12,0),'m3':(11.25,6.28),
    'forest-supplies':(-10.3,-6.34),'forest-spirit':(-11.4,.35),
    'forest-ranger':(-2.85,4.66),'crypt-entrance':(-7.6,3.63),
    'wildwood-herbalist-cache':(-12.28,-3.6),'wildwood-watch-cache':(-1.22,5.34),
    'wildwood-mill-cache':(mill_x+1.4,-5.65),'wildwood-ruin-cache':(13.38,-.52),
    'wildwood-overlook-cache':(hoist_x-.82,hoist_y-.61),'wildwood-river-cache':(gauge_x-.93,7.62),
    'wildwood-meadow-cache':(-12.42,-6.48),'roam-0-2':(-19.50,6.40),
    'roam-0-3':(21.15,-8.96),'ranger-roots':(-1.86,4.77)
}
stops={key:project(*xy) for key,xy in world_stops.items()}
beacon_top=cards['valley-painted-beacon'].vertices[2].co
stops['beacon-flame']=project(21.3,18.30+2.52*beacon_top.y*.94,height(21.3,18.30)+2.52*beacon_top.z*.94)
stops['gate-west']=project(*bridge_point(-.55,0),deck(-.55))
stops['gate-east']=project(*bridge_point(.55,0),deck(.55))
(out/'game-stops.json').write_text(json.dumps(stops))
(out/'landmarks.json').write_text(json.dumps(anchors,indent=2))
for screen in bpy.data.screens:
    for area in screen.areas:
        if area.type=='VIEW_3D':
            area.spaces.active.region_3d.view_perspective='CAMERA'
            area.spaces.active.shading.type='MATERIAL'
            area.spaces.active.shading.use_scene_world=True
            area.spaces.active.shading.use_scene_lights=True
            area.spaces.active.overlay.show_overlays=False
bpy.ops.file.pack_all()
scene.render.filepath='//Wildwood.png'
bpy.ops.wm.save_as_mainfile(filepath=str(out/'Wildwood.blend'))
scene.render.filepath=str(out/'Wildwood.png')
bpy.ops.render.render(write_still=True)
# Render only the repaired fixture for the game's persistent terrain change.
cx,cy=project(sluice_x,sluice_y)
w,h=scene.render.resolution_x,scene.render.resolution_y
x0,y0=int(cx*w)-166,int(cy*h)-160
x1,y1=int(cx*w)+121,int(cy*h)+92
(out/'sluice-patch.json').write_text(json.dumps([x0/w,y0/h,(x1-x0)/w,(y1-y0)/h]))
closed_gate.hide_render=True
raised_gate.hide_render=False
spill.hide_render=False
scene.render.use_border=True;scene.render.use_crop_to_border=True
scene.render.border_min_x=x0/w;scene.render.border_max_x=x1/w
scene.render.border_min_y=1-y1/h;scene.render.border_max_y=1-y0/h
scene.render.filepath=str(out/'Sluice-open.png')
bpy.ops.render.render(write_still=True)
scene.render.use_border=False;scene.render.use_crop_to_border=False
closed_gate.hide_render=False
raised_gate.hide_render=True
spill.hide_render=True
for group in [land,timber,places,trees,brush,joinery]:group.hide_render=True
guides.hide_render=False;guides.hide_viewport=False
scene.world.node_tree.nodes['Background'].inputs[1].default_value=0
scene.cycles.samples=1;scene.cycles.use_denoising=False
scene.render.resolution_percentage=50
scene.render.filepath=str(out/'Floor.png')
bpy.ops.render.render(write_still=True)

# An 8-bit image stores the projected foot height of scenery in front of a traveler.
# Draw the opaque scene black so the terrain still hides buried portions of each cutout.
for group in [land,timber,places,trees,brush]:group.hide_render=False
guides.hide_render=True
for obj in [*land.objects,*timber.objects,*brush.objects]:
    if obj.type=='MESH' and obj.data not in cards.values():
        obj.data.materials.clear();obj.data.materials.append(black)
for data in cards.values():
    mat=data.materials[0];n=mat.node_tree.nodes;l=mat.node_tree.links
    tex=next(node for node in n if node.type=='TEX_IMAGE')
    info=n.new('ShaderNodeObjectInfo');em=n.new('ShaderNodeEmission')
    l.new(info.outputs['Color'],em.inputs[0])
    transparent=n.new('ShaderNodeBsdfTransparent');mix=n.new('ShaderNodeMixShader')
    l.new(tex.outputs['Alpha'],mix.inputs[0]);l.new(transparent.outputs[0],mix.inputs[1]);l.new(em.outputs[0],mix.inputs[2])
    l.new(mix.outputs[0],n.get('Material Output').inputs['Surface'])
for obj in [*trees.objects,*places.objects,*brush.objects]:
    if obj.data in cards.values():
        uv=world_to_camera_view(scene,cam,obj.location);value=max(0,min(1,1-uv.y))
        obj.color=(value,value,value,1)
scene.view_settings.view_transform='Raw'
scene.cycles.samples=3
scene.render.filepath=str(out/'Foreground.png')
bpy.ops.render.render(write_still=True)

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
scene.render.resolution_x, scene.render.resolution_y = 1536, 1024
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
places = collection("03  Camp and Rootbound entrance")
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
routes=[main,spur,camp_spur]
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

ground=grid("Continuous slopes, west hollow and incised streambed",220,220,43,land)
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
bs=n.get('Principled BSDF');l.new(base,bs.inputs['Base Color'])
bs.inputs['Roughness'].default_value=.92
ground.data.materials.append(m)

# The stream follows the actual bottom of the ravine. Shallows take their tint from the bank distance.
water_verts=[];water_faces=[];depth=[]
for j in range(201):
    y=-21.5+j*43/200
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
plant('map-painted-runestone',-4.85,-.4,.68,places)
# Group large crowns along ridges, leaving the road, door and bridge readable.
accepted=[]
for _ in range(2800):
    x=random.uniform(-20,20);y=random.uniform(-18,20)
    if abs(x-river(y))<halfwidth(y)+1.00 or trail_dist(x,y)<2.1:continue
    if any(((x-a)/w)**2+((y-b)/h)**2<1 for a,b,w,h in [(-9.6,-8.8,3.8,4.3),(-7.6,3,3.9,3.9),(bx,by-.7,5.5,4),(-3.7,-1,3.6,3.4)]):continue
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
for i in range(1100):
    x=random.uniform(-19,19);y=random.uniform(-18,19)
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
paving=tint_material('Sun-bleached trail flags',(.47,.383,.224))
pavers=[data.copy() for data in shapes]
for data in pavers:
    data.materials.clear();data.materials.append(paving)
details=random.Random(118)
def boulder(x,y,z,scale,name='Shore limestone'):
    obj=bpy.data.objects.new(name,details.choice(pavers if name=='Inset trail limestone' else shapes));brush.objects.link(obj)
    obj.location=(x,y,z);obj.scale=scale;obj.rotation_euler.z=details.uniform(-.6,.6)
    return obj

for bank_side in (-1,1):
    y=-18
    while y<18:
        y+=details.uniform(.19,.45)
        u=details.uniform(.02,.62);x=river(y)+bank_side*(halfwidth(y)+u)
        a,b=bridge_local(x,y)
        if abs(a)<3.8 and abs(b)<.95:continue
        w=details.uniform(.18,.79)
        boulder(x,y,height(x,y)-.03,(w*.68,w*1.08,w*details.uniform(.6,1.45)))
    # Small gravel bars form on alternate bends.
    for _ in range(380):
        y=details.uniform(-18,18);f=math.sin(y*.63)*bank_side
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
# Pale stone showing through a well-used dirt surface breaks its smooth edges.
for _ in range(1050):
    x=details.uniform(-15,15);y=details.uniform(-15,16)
    d=trail_dist(x,y)
    if d>1.22 or abs(x-river(y))<halfwidth(y)+.72:continue
    a,b=bridge_local(x,y)
    if abs(a)<3.66 and abs(b)<.80:continue
    number=details.randint(2,7)
    for i in range(number):
        px=x+details.uniform(-.39,.39);py=y+details.uniform(-.27,.27)
        s=details.uniform(.046,.16)
        boulder(px,py,height(px,py)+.015,(s*1.32,s*.86,s*.12),'Inset trail limestone')
# Shallow current seams part around the inside gravel bars.
foam_mat=tint_material('Broken water reflections',(.51,.75,.70))
ribbons=[];faces=[]
for _ in range(1850):
    y=details.uniform(-19,19);side=details.choice((-1,1));t=details.uniform(.27,1.0)
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

camera=bpy.data.cameras.new('Player view | orthographic')
cam=bpy.data.objects.new('Player view',camera);rig.objects.link(cam)
cam.location=(0,-30,36);target=Vector((0,0,1.8))
cam.rotation_euler=(target-cam.location).to_track_quat('-Z','Y').to_euler()
camera.type='ORTHO';camera.ortho_scale=33.5;scene.camera=cam
sun=bpy.data.lights.new("Afternoon sunlight",'SUN');sun.energy=2.8;sun.angle=math.radians(10);sun.color=(1,.93,.78)
light=bpy.data.objects.new('Sun through leaves',sun);rig.objects.link(light)
light.rotation_euler=Vector((.57,.60,-1)).to_track_quat('-Z','Y').to_euler()
# An image empty places the exact source inside the project without affecting the render.
ref=bpy.data.objects.new("REFERENCE | Forest river valley Ã¢â‚¬Â¢ Map Floor Studio",None)
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
for group in [land,timber,places,trees,brush]:group.hide_render=True
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

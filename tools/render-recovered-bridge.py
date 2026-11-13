import bpy,math
from mathutils import Vector
bpy.ops.wm.open_mainfile(filepath=r'C:\AI Workspace\lowpolly forest.blend',load_ui=False,use_scripts=False)
keep=[o for o in bpy.context.scene.objects if any(k in o.name for k in ['Individual Wooden Bridge Plank','Bridge Railing Post','Bridge Handrail'])]
for o in bpy.context.scene.objects:o.hide_render=o not in keep
wood=bpy.data.materials.new('Weathered woodland timber');wood.use_nodes=True;n=wood.node_tree.nodes;l=wood.node_tree.links;p=n.get('Principled BSDF');p.inputs['Roughness'].default_value=.86;t=n.new('ShaderNodeTexNoise');t.inputs['Scale'].default_value=8;t.inputs['Detail'].default_value=5;c=n.new('ShaderNodeTexCoord');m=n.new('ShaderNodeVectorMath');m.operation='MULTIPLY';m.inputs[1].default_value=(2,30,8);l.new(c.outputs['Generated'],m.inputs[0]);l.new(m.outputs[0],t.inputs['Vector']);r=n.new('ShaderNodeValToRGB');r.color_ramp.elements[0].color=(.08,.045,.018,1);r.color_ramp.elements[1].color=(.54,.36,.16,1);l.new(t.outputs['Fac'],r.inputs[0]);l.new(r.outputs[0],p.inputs['Base Color']);b=n.new('ShaderNodeBump');b.inputs['Strength'].default_value=.3;b.inputs['Distance'].default_value=.06;l.new(t.outputs['Fac'],b.inputs['Height']);l.new(b.outputs[0],p.inputs['Normal'])
for o in keep:
 o.data.materials.clear();o.data.materials.append(wood)
pts=[o.matrix_world@Vector(v) for o in keep for v in o.bound_box];center=sum(pts,Vector())/len(pts)
camdata=bpy.data.cameras.new('Asset camera');cam=bpy.data.objects.new('Asset camera',camdata);bpy.context.collection.objects.link(cam);cam.location=center+Vector((10,0,16));cam.rotation_euler=(center-cam.location).to_track_quat('-Z','Y').to_euler();camdata.type='ORTHO';camdata.ortho_scale=9
s=bpy.context.scene;s.camera=cam
ld=bpy.data.lights.new('Soft sun','AREA');lo=bpy.data.objects.new('Soft sun',ld);bpy.context.collection.objects.link(lo);lo.location=center+Vector((-3,-4,10));lo.rotation_euler=(center-lo.location).to_track_quat('-Z','Y').to_euler();ld.energy=1800;ld.shape='DISK';ld.size=7
s.world.color=(.4,.4,.4);s.render.engine='CYCLES';s.cycles.samples=48;s.render.film_transparent=True;s.render.resolution_x=1024;s.render.resolution_y=768;s.render.resolution_percentage=100;s.render.image_settings.color_mode='RGBA';s.render.filepath=r'C:\Users\jhunt\Documents\Codex\2026-11-09\referenced-chatgpt-conversation-this-is-an\work\Review-game\assets\recovered-timber-bridge.png';bpy.ops.render.render(write_still=True)


# Balonowe tube-lettering "mioduszewsky" w stylu flayks — Blender headless
# Uruchomienie: blender -b -P tube_logo.py -- [hex_koloru] [output.blend]
import bpy, math, sys
from mathutils import Vector

argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
HEX = (argv[0] if len(argv) > 0 else "FFD02F").lstrip("#")
OUT_BLEND = argv[1] if len(argv) > 1 else "/tmp/tube_logo.blend"

def srgb_to_linear(c):
    c = c / 255.0
    return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4

BASE_COLOR = tuple(srgb_to_linear(int(HEX[i:i+2], 16)) for i in (0, 2, 4)) + (1.0,)
R = 0.30          # promień rury (chubby)
FPS = 30
LOOP = 180

# ── Litery: monoline szkielety, x-height=1, (x, y) ─────────────────
# każda litera: {"adv": szerokość, "strokes": [[(x,y),...], ...], "dots": [(x,y)]}
LETTERS = {
    "m": {"adv": 1.78, "strokes": [
        [(0.02, 0.92), (0.0, 0.0)],
        [(0.03, 0.18), (0.08, 0.72), (0.42, 0.98), (0.76, 0.62), (0.80, 0.0)],
        [(0.82, 0.18), (0.87, 0.72), (1.21, 0.98), (1.55, 0.62), (1.59, 0.0)],
    ]},
    "i": {"adv": 0.46, "strokes": [[(0.02, 0.92), (0.0, 0.0)]], "dots": [(0.02, 1.78)]},
    "o": {"adv": 1.16, "circle": (0.52, 0.47, 0.50)},
    "d": {"adv": 1.24, "circle": (0.48, 0.45, 0.48), "strokes": [[(0.88, 1.68), (0.90, 0.0)]]},
    "u": {"adv": 1.30, "strokes": [
        [(0.03, 0.92), (0.06, 0.25), (0.50, 0.0), (0.92, 0.25), (0.95, 0.92)],
        [(0.95, 0.92), (0.99, 0.28), (1.18, 0.06)],
    ]},
    "s": {"adv": 1.06, "rscale": 0.78, "strokes": [
        [(0.88, 0.98), (0.44, 1.12), (0.02, 0.74), (0.46, 0.50), (0.90, 0.26), (0.46, -0.10), (0.0, 0.06)],
    ]},
    "z": {"adv": 0.96, "strokes": [
        [(0.06, 0.93), (0.82, 0.93)],
        [(0.80, 0.90), (0.10, 0.08)],
        [(0.08, 0.04), (0.84, 0.04)],
    ]},
    "e": {"adv": 1.20, "rscale": 0.72, "strokes": [
        [(0.05, 0.52), (0.84, 0.54)],
        [(0.84, 0.54), (0.60, 1.16), (0.02, 0.86), (-0.04, 0.40), (0.34, -0.02), (0.70, 0.02)],
    ]},
    "w": {"adv": 1.82, "rscale": 0.75, "strokes": [
        [(0.0, 0.94), (0.36, -0.02), (0.80, 0.96), (1.24, -0.02), (1.60, 0.94)],
    ]},
    "k": {"adv": 1.02, "strokes": [
        [(0.02, 1.68), (0.02, 0.0)],
        [(0.64, 0.92), (0.07, 0.38)],
        [(0.26, 0.58), (0.70, 0.0)],
    ]},
    "y": {"adv": 1.10, "strokes": [
        [(0.04, 0.92), (0.08, 0.32), (0.48, 0.10)],
        [(0.86, 0.92), (0.72, 0.0), (0.44, -0.68), (0.12, -0.52)],
    ]},
}

TEXT = "m"
TRACK = 1.02      # <1 = litery na siebie nachodzą
# playful transformy per litera: (tilt stopnie, y-offset, skala)
JIGGLE = [(5, 0.02, 1.0), (-4, -0.02, 1.0), (3, 0.03, 1.0), (-5, 0.0, 1.0),
          (4, -0.03, 1.0), (-3, 0.02, 1.0), (6, -0.01, 1.0), (-4, 0.02, 1.0),
          (3, -0.02, 1.0), (-6, 0.01, 1.0), (4, 0.0, 1.0), (-3, -0.02, 1.0)]

bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene
scene.render.engine = 'CYCLES'
scene.cycles.samples = 128
scene.cycles.use_denoising = True
try:
    prefs = bpy.context.preferences.addons['cycles'].preferences
    prefs.compute_device_type = 'METAL'
    prefs.get_devices()
    for d in prefs.devices:
        d.use = True
    scene.cycles.device = 'GPU'
except Exception as e:
    print("GPU fail:", e)
scene.render.film_transparent = True
scene.view_settings.view_transform = 'Standard'
scene.render.image_settings.file_format = 'PNG'
scene.render.image_settings.color_mode = 'RGBA'
scene.render.fps = FPS
scene.frame_start = 1
scene.frame_end = LOOP

# ── Materiał: miękki lateks ────────────────────────────────────────
mat = bpy.data.materials.new('latex')
mat.use_nodes = True
bsdf = mat.node_tree.nodes.get('Principled BSDF')
bsdf.inputs['Base Color'].default_value = BASE_COLOR
bsdf.inputs['Roughness'].default_value = 0.16
for cw, cr in (('Coat Weight', 'Coat Roughness'), ('Clearcoat', 'Clearcoat Roughness')):
    if cw in bsdf.inputs:
        bsdf.inputs[cw].default_value = 0.8
        bsdf.inputs[cr].default_value = 0.08
        break

def add_bezier(strokes_pts, name, r=None):
    cu = bpy.data.curves.new(name, 'CURVE')
    cu.dimensions = '3D'
    cu.resolution_u = 24
    cu.bevel_depth = r or R
    cu.bevel_resolution = 10
    cu.use_fill_caps = True
    for pts in strokes_pts:
        sp = cu.splines.new('BEZIER')
        sp.bezier_points.add(len(pts) - 1)
        for bp, (x, y) in zip(sp.bezier_points, pts):
            bp.co = (x, y, 0.0)
            bp.handle_left_type = bp.handle_right_type = 'AUTO'
    ob = bpy.data.objects.new(name, cu)
    scene.collection.objects.link(ob)
    return ob

def add_circle_spline(cx, cy, r, name):
    cu = bpy.data.curves.new(name, 'CURVE')
    cu.dimensions = '3D'
    cu.resolution_u = 24
    cu.bevel_depth = R
    cu.bevel_resolution = 10
    sp = cu.splines.new('BEZIER')
    sp.bezier_points.add(3)
    for bp, ang in zip(sp.bezier_points, (0, 90, 180, 270)):
        a = math.radians(ang)
        bp.co = (cx + r * math.cos(a), cy + r * math.sin(a), 0.0)
        bp.handle_left_type = bp.handle_right_type = 'AUTO'
    sp.use_cyclic_u = True
    ob = bpy.data.objects.new(name, cu)
    scene.collection.objects.link(ob)
    return ob

def add_sphere(x, y, r, name):
    bpy.ops.mesh.primitive_uv_sphere_add(radius=r, location=(x, y, 0.0), segments=24, ring_count=16)
    ob = bpy.context.active_object
    ob.name = name
    return ob

# ── Budowa liter ───────────────────────────────────────────────────
letter_objs = []
pen_x = 0.0
for idx, ch in enumerate(TEXT):
    spec = LETTERS[ch]
    tilt, dy, sc = JIGGLE[idx % len(JIGGLE)]
    parts = []
    r_let = R * spec.get("rscale", 1.0)
    g = spec.get("grow", 1.0)
    if "strokes" in spec:
        g_strokes = [[(x * g, y * g) for x, y in s] for s in spec["strokes"]]
        parts.append(add_bezier(g_strokes, f'{ch}{idx}_st', r_let))
        # kulki na końcach strokes = zaokrąglone końcówki
        for s_i, pts in enumerate(g_strokes):
            for ex, ey in (pts[0], pts[-1]):
                parts.append(add_sphere(ex, ey, r_let * 0.99, f'{ch}{idx}_cap{s_i}'))
    if "circle" in spec:
        cx, cy, r = spec["circle"]
        parts.append(add_circle_spline(cx, cy, r, f'{ch}{idx}_o'))
    if "dots" in spec:
        for dx_, dy_ in spec["dots"]:
            parts.append(add_sphere(dx_, dy_, R * 1.15, f'{ch}{idx}_dot'))
    # konwersja krzywych na mesh i join
    for p in parts:
        bpy.ops.object.select_all(action='DESELECT')
        p.select_set(True)
        bpy.context.view_layer.objects.active = p
        if p.type == 'CURVE':
            bpy.ops.object.convert(target='MESH')
    parts = [bpy.data.objects[p.name] for p in parts]
    bpy.ops.object.select_all(action='DESELECT')
    for p in parts:
        p.select_set(True)
    bpy.context.view_layer.objects.active = parts[0]
    bpy.ops.object.join()
    lob = bpy.context.active_object
    lob.name = f'L_{idx}_{ch}'
    # remesh: zlewa rurki/kulki w jedną balonową powierzchnię
    lob.data.remesh_voxel_size = 0.03
    bpy.ops.object.voxel_remesh()
    sm = lob.modifiers.new('cs', 'CORRECTIVE_SMOOTH')
    sm.factor = 0.4
    sm.iterations = 8
    bpy.ops.object.modifier_apply(modifier='cs')
    sm2 = lob.modifiers.new('sm2', 'SMOOTH')
    sm2.factor = 0.5
    sm2.iterations = 4
    bpy.ops.object.modifier_apply(modifier='sm2')
    bpy.ops.object.shade_smooth()
    lob.data.materials.append(mat)
    # origin na środek litery, potem transform
    bpy.ops.object.origin_set(type='ORIGIN_GEOMETRY', center='BOUNDS')
    w = spec["adv"] * g
    lob.location = (pen_x + w / 2 * sc, dy + lob.location.y, 0.0)
    lob.rotation_euler = (0, 0, math.radians(tilt))
    lob.scale = (sc, sc, sc)
    pen_x += w * sc * TRACK
    letter_objs.append(lob)

# ── Wyśrodkowanie słowa pod pivotem ────────────────────────────────
xs_min = min((o.location.x - o.dimensions.x / 2) for o in letter_objs)
xs_max = max((o.location.x + o.dimensions.x / 2) for o in letter_objs)
ys_min = min((o.location.y - o.dimensions.y / 2) for o in letter_objs)
ys_max = max((o.location.y + o.dimensions.y / 2) for o in letter_objs)
cx, cy = (xs_min + xs_max) / 2, (ys_min + ys_max) / 2
W, H = xs_max - xs_min, ys_max - ys_min

pivot = bpy.data.objects.new('pivot', None)
scene.collection.objects.link(pivot)
for o in letter_objs:
    o.location.x -= cx
    o.location.y -= cy
    o.parent = pivot

# ── Światła: duże miękkie softboxy (styl flayks) ───────────────────
def area_light(name, loc, rot, sx, sy, energy, color=(1, 1, 1)):
    ld = bpy.data.lights.new(name, 'AREA')
    ld.shape = 'RECTANGLE'
    ld.size = sx
    ld.size_y = sy
    ld.energy = energy
    ld.color = color
    lo = bpy.data.objects.new(name, ld)
    lo.location = loc
    lo.rotation_euler = rot
    scene.collection.objects.link(lo)

area_light("key", (2.4, 2.4, 4.2), (math.radians(-26), 0, 0), W * 1.3, 2.2, 150)
area_light("fill", (1.8, -2.6, 2.8), (math.radians(33), 0, 0), W * 1.0, 2.0, 34, (0.9, 0.93, 1.0))
area_light('rim_l', (-W * 0.7, 0.5, 1.2), (0, math.radians(-58), 0), 1.2, 3.2, 50)
area_light('rim_r', (W * 0.7, 0.5, 1.2), (0, math.radians(58), 0), 1.2, 3.2, 50)

world = bpy.data.worlds.new('world')
scene.world = world
world.use_nodes = True
bg = world.node_tree.nodes['Background']
bg.inputs['Color'].default_value = (0.02, 0.02, 0.025, 1.0)
bg.inputs['Strength'].default_value = 0.5

# ── Kamera ─────────────────────────────────────────────────────────
pad_x, pad_y = 1.14, 1.5
cam_data = bpy.data.cameras.new('cam')
cam_data.lens = 50
cam = bpy.data.objects.new('cam', cam_data)
scene.collection.objects.link(cam)
scene.camera = cam
fov_x = 2 * math.atan(cam_data.sensor_width / 2 / cam_data.lens)
cam.location = (0, 0, (W * pad_x / 2) / math.tan(fov_x / 2))
aspect = (W * pad_x) / (H * pad_y)
scene.render.resolution_x = 1024
scene.render.resolution_y = int(round(1024 / aspect / 2) * 2)

# ── Animacja: sway całości + jelly per litera ──────────────────────
for f in range(1, LOOP + 2):
    t = (f - 1) / LOOP
    pivot.rotation_euler = (
        math.radians(3.0) * math.sin(2 * math.pi * t + math.pi / 2),
        math.radians(7.5) * math.sin(2 * math.pi * t),
        math.radians(1.2) * math.sin(2 * math.pi * t),
    )
    pivot.location = (0, 0.03 * math.sin(4 * math.pi * t), 0)
    pivot.keyframe_insert('rotation_euler', frame=f)
    pivot.keyframe_insert('location', frame=f)
    for i, o in enumerate(letter_objs):
        base_tilt = math.radians(JIGGLE[i % len(JIGGLE)][0])
        o.rotation_euler = (
            math.radians(2.0) * math.sin(2 * math.pi * t + i * 0.9),
            math.radians(2.5) * math.sin(2 * math.pi * t + i * 0.7 + 1.3),
            base_tilt + math.radians(1.5) * math.sin(2 * math.pi * t + i * 1.1),
        )
        o.keyframe_insert('rotation_euler', frame=f)
        base_sc = JIGGLE[i % len(JIGGLE)][2]
        puls = base_sc * (1.0 + 0.015 * math.sin(2 * math.pi * t * 2 + i * 1.3))
        o.scale = (puls, puls, puls)
        o.keyframe_insert('scale', frame=f)

scene.frame_set(1)
bpy.ops.wm.save_as_mainfile(filepath=OUT_BLEND)
print(f"OK: {OUT_BLEND} res={scene.render.resolution_x}x{scene.render.resolution_y} W={W:.2f} H={H:.2f}")

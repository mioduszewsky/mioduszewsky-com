# Futrzane tube-lettering "mioduszewsky" — wariant dalmatyńczyk (białe futro + czarne łaty)
# Bazuje na tube_logo.py (balon); różnice: hair particles Cycles + proceduralne łaty.
# Uruchomienie: blender -b -P tube_logo_fur.py -- [output.blend]
import bpy, math, sys
from mathutils import Vector

argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
OUT_BLEND = argv[0] if len(argv) > 0 else "/tmp/tube_logo_fur.blend"

R = 0.165         # promień rury — cieńsza niż balon (0.30), futro dobija grubość
FPS = 30
LOOP = 180

# ── Futro / łaty — parametry do strojenia ──────────────────────────
FUR_LEN = 0.13            # długość włosa (R=0.30)
FUR_LEN_RANDOM = 0.18     # losowość długości
FUR_DENSITY = 340         # parenty na jednostkę² powierzchni
FUR_CHILDREN = 90         # dzieci na parenta (render)
FUR_DIAMETER = 0.0058      # grubość włosa u nasady (jedn. sceny)
SPOT_SCALE = 1.4          # voronoi: komórki na jednostkę (mniejsze = większe łaty)
SPOT_EDGE = (0.30, 0.42)  # smoothstep progu łaty (miękka krawędź jak futro)
SPOT_ON = 0.22            # R kanału koloru komórki > SPOT_ON => komórka ma łatę (~55%)
SPOT_DISTORT = 0.16       # zniekształcenie łat noise'em (organiczne brzegi)
WHITE = (0.98, 0.955, 0.90, 1.0)   # ciepła biel sierści
BLACK = (0.015, 0.014, 0.016, 1.0)

# ── Litery: monoline szkielety, x-height=1, (x, y) ─────────────────
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
    "s": {"adv": 1.06, "rscale": 0.92, "strokes": [
        [(0.88, 1.00), (0.44, 1.14), (0.02, 0.75), (0.46, 0.50), (0.90, 0.25), (0.46, -0.12), (0.0, 0.04)],
    ]},
    "z": {"adv": 0.96, "strokes": [
        [(0.06, 0.93), (0.82, 0.93)],
        [(0.80, 0.90), (0.10, 0.08)],
        [(0.08, 0.04), (0.84, 0.04)],
    ]},
    "e": {"adv": 1.20, "strokes": [
        [(0.05, 0.52), (0.84, 0.54)],
        [(0.84, 0.54), (0.60, 1.16), (0.02, 0.86), (-0.04, 0.40), (0.34, -0.02), (0.70, 0.02)],
    ]},
    "w": {"adv": 2.08, "strokes": [
        [(0.0, 0.94), (0.48, -0.02), (0.96, 0.96), (1.44, -0.02), (1.92, 0.94)],
    ]},
    "k": {"adv": 1.22, "strokes": [
        [(0.02, 1.68), (0.02, 0.0)],
        [(0.64, 0.92), (0.07, 0.38)],
        [(0.26, 0.58), (0.70, 0.0)],
    ]},
    "y": {"adv": 1.10, "strokes": [
        [(0.04, 0.92), (0.08, 0.32), (0.48, 0.10)],
        [(0.86, 0.92), (0.72, 0.0), (0.44, -0.68), (0.12, -0.52)],
    ]},
}

TEXT = "mioduszewsky"
TRACK = 1.02
JIGGLE = [(5, 0.02, 1.0), (-4, -0.02, 1.0), (3, 0.03, 1.0), (-5, 0.0, 1.0),
          (4, -0.03, 1.0), (-3, 0.02, 1.0), (6, -0.01, 1.0), (-4, 0.02, 1.0),
          (3, -0.02, 1.0), (-6, 0.01, 1.0), (4, 0.0, 1.0), (-3, -0.02, 1.0)]

bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene
scene.render.engine = 'CYCLES'
scene.cycles.samples = 256
# Denoise WYŁĄCZONY: OIDN uśrednia cienkie pasma i robi z futra filc (patrz INSTRUKCJA.md).
scene.cycles.use_denoising = False
scene.cycles.max_bounces = 24
scene.cycles.transmission_bounces = 16
scene.cycles.glossy_bounces = 10
scene.cycles.transparent_max_bounces = 24
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

# ── Wspólne węzły łat dalmatyńczyka ────────────────────────────────
# Buduje w node tree łańcuch: coords lokalne + offset per obiekt → noise distort
# → voronoi → maska łaty (0=biel, 1=czerń). Zwraca socket maski.
def build_spot_mask(nt, x0=-1400, y0=0):
    n = nt.nodes
    lk = nt.links.new
    tc = n.new('ShaderNodeTexCoord');            tc.location = (x0, y0)
    oi = n.new('ShaderNodeObjectInfo');          oi.location = (x0, y0 - 260)
    # per-literowy offset łat: random obiektu → wektor
    m1 = n.new('ShaderNodeMath'); m1.operation = 'MULTIPLY'; m1.inputs[1].default_value = 21.4
    m2 = n.new('ShaderNodeMath'); m2.operation = 'MULTIPLY'; m2.inputs[1].default_value = 11.9
    m3 = n.new('ShaderNodeMath'); m3.operation = 'MULTIPLY'; m3.inputs[1].default_value = 15.3
    for i, mm in enumerate((m1, m2, m3)):
        mm.location = (x0 + 170, y0 - 200 - i * 120)
        lk(oi.outputs['Random'], mm.inputs[0])
    cmb = n.new('ShaderNodeCombineXYZ');         cmb.location = (x0 + 340, y0 - 260)
    lk(m1.outputs[0], cmb.inputs['X']); lk(m2.outputs[0], cmb.inputs['Y']); lk(m3.outputs[0], cmb.inputs['Z'])
    off = n.new('ShaderNodeVectorMath'); off.operation = 'ADD'; off.location = (x0 + 340, y0)
    lk(tc.outputs['Object'], off.inputs[0]); lk(cmb.outputs[0], off.inputs[1])
    # organiczne zniekształcenie krawędzi
    nz = n.new('ShaderNodeTexNoise'); nz.location = (x0 + 510, y0 - 220)
    nz.inputs['Scale'].default_value = 4.0
    nz.inputs['Detail'].default_value = 3.0
    lk(off.outputs[0], nz.inputs['Vector'])
    sub = n.new('ShaderNodeVectorMath'); sub.operation = 'SUBTRACT'; sub.location = (x0 + 680, y0 - 220)
    lk(nz.outputs['Color'], sub.inputs[0])
    sub.inputs[1].default_value = (0.5, 0.5, 0.5)
    dst = n.new('ShaderNodeVectorMath'); dst.operation = 'MULTIPLY_ADD'; dst.location = (x0 + 850, y0)
    lk(sub.outputs[0], dst.inputs[0])
    dst.inputs[1].default_value = (SPOT_DISTORT / 0.5,) * 3
    lk(off.outputs[0], dst.inputs[2])
    # voronoi: kształt łaty + losowe "czy komórka ma łatę"
    vo = n.new('ShaderNodeTexVoronoi'); vo.location = (x0 + 1020, y0)
    vo.inputs['Scale'].default_value = SPOT_SCALE
    vo.inputs['Randomness'].default_value = 1.0
    lk(dst.outputs[0], vo.inputs['Vector'])
    shape = n.new('ShaderNodeMapRange'); shape.location = (x0 + 1200, y0)
    shape.interpolation_type = 'SMOOTHSTEP'
    shape.inputs['From Min'].default_value = SPOT_EDGE[1]
    shape.inputs['From Max'].default_value = SPOT_EDGE[0]
    lk(vo.outputs['Distance'], shape.inputs['Value'])
    sep = n.new('ShaderNodeSeparateColor'); sep.location = (x0 + 1200, y0 - 260)
    lk(vo.outputs['Color'], sep.inputs[0])
    on = n.new('ShaderNodeMath'); on.operation = 'GREATER_THAN'; on.location = (x0 + 1380, y0 - 260)
    on.inputs[1].default_value = SPOT_ON
    lk(sep.outputs['Red'], on.inputs[0])
    mask = n.new('ShaderNodeMath'); mask.operation = 'MULTIPLY'; mask.location = (x0 + 1560, y0)
    lk(shape.outputs[0], mask.inputs[0]); lk(on.outputs[0], mask.inputs[1])
    return mask.outputs[0]

# ── Materiał skóry (baza pod futrem, łaty jak na sierści) ──────────
skin = bpy.data.materials.new('skin')
skin.use_nodes = True
snt = skin.node_tree
sb = snt.nodes.get('Principled BSDF')
sb.inputs['Roughness'].default_value = 0.65
smask = build_spot_mask(snt)
smix = snt.nodes.new('ShaderNodeMix'); smix.data_type = 'RGBA'; smix.location = (-200, 300)
# skóra ciemniejsza od sierści, żeby prześwity nie świeciły
smix.inputs['A'].default_value = tuple(c * 0.55 for c in WHITE[:3]) + (1.0,)
smix.inputs['B'].default_value = BLACK
snt.links.new(smask, smix.inputs['Factor'])
snt.links.new(smix.outputs['Result'], sb.inputs['Base Color'])

# ── Materiał futra: Principled Hair, kolor z maski łat ─────────────
fur = bpy.data.materials.new('fur')
fur.use_nodes = True
fnt = fur.node_tree
for nd in list(fnt.nodes):
    if nd.type != 'OUTPUT_MATERIAL':
        fnt.nodes.remove(nd)
hb = fnt.nodes.new('ShaderNodeBsdfHairPrincipled')
hb.location = (0, 0)
hb.parametrization = 'COLOR'
hb.inputs['Roughness'].default_value = 0.15
fmask = build_spot_mask(fnt)
fmix = fnt.nodes.new('ShaderNodeMix'); fmix.data_type = 'RGBA'; fmix.location = (-560, 300)
fmix.inputs['A'].default_value = WHITE
fmix.inputs['B'].default_value = BLACK
fnt.links.new(fmask, fmix.inputs['Factor'])
# głębia futra: ciemniejsza nasada, jaśniejsze końcówki + lekki random per włos
hi = fnt.nodes.new('ShaderNodeHairInfo'); hi.location = (-560, -260)
root = fnt.nodes.new('ShaderNodeMapRange'); root.location = (-380, -260)
# Intercept: 0 = nasada, 1 = końcówka. Ciemna nasada daje głębię — bez niej futro jest płaskie.
root.inputs['To Min'].default_value = 0.45
root.inputs['To Max'].default_value = 1.05
fnt.links.new(hi.outputs['Intercept'], root.inputs['Value'])
rnd = fnt.nodes.new('ShaderNodeMapRange'); rnd.location = (-380, -520)
rnd.inputs['To Min'].default_value = 0.93
rnd.inputs['To Max'].default_value = 1.05
fnt.links.new(hi.outputs['Random'], rnd.inputs['Value'])
shade = fnt.nodes.new('ShaderNodeMath'); shade.operation = 'MULTIPLY'; shade.location = (-200, -380)
fnt.links.new(root.outputs[0], shade.inputs[0]); fnt.links.new(rnd.outputs[0], shade.inputs[1])
tint = fnt.nodes.new('ShaderNodeMix'); tint.data_type = 'RGBA'; tint.location = (-200, 120)
tint.blend_type = 'MULTIPLY'
tint.inputs['Factor'].default_value = 1.0
fnt.links.new(fmix.outputs['Result'], tint.inputs['A'])
gray = fnt.nodes.new('ShaderNodeCombineColor'); gray.location = (-380, -60)
for ch in ('Red', 'Green', 'Blue'):
    fnt.links.new(shade.outputs[0], gray.inputs[ch])
fnt.links.new(gray.outputs[0], tint.inputs['B'])
fnt.links.new(tint.outputs['Result'], hb.inputs['Color'])
dif = fnt.nodes.new('ShaderNodeBsdfDiffuse'); dif.location = (0, -260)
fnt.links.new(tint.outputs['Result'], dif.inputs['Color'])
mixsh = fnt.nodes.new('ShaderNodeMixShader'); mixsh.location = (200, 0)
mixsh.inputs['Fac'].default_value = 0.20
fnt.links.new(hb.outputs[0], mixsh.inputs[1])
fnt.links.new(dif.outputs[0], mixsh.inputs[2])
out = next(nd for nd in fnt.nodes if nd.type == 'OUTPUT_MATERIAL')
out.location = (420, 0)
fnt.links.new(mixsh.outputs[0], out.inputs['Surface'])

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

# ── Futro na literze ───────────────────────────────────────────────
def add_fur(ob, rl=1.0):
    area = sum(p.area for p in ob.data.polygons)
    ob.modifiers.new('fur', 'PARTICLE_SYSTEM')
    st = ob.particle_systems[-1].settings
    st.type = 'HAIR'
    st.count = max(400, int(area * FUR_DENSITY))
    st.hair_length = FUR_LEN * rl
    st.length_random = FUR_LEN_RANDOM
    st.emit_from = 'FACE'
    st.use_emit_random = True
    st.hair_step = 5
    st.render_step = 4
    st.use_advanced_hair = True
    # grubość włosa
    st.radius_scale = FUR_DIAMETER
    st.root_radius = 1.0
    st.tip_radius = 0.12
    # dzieci = gęstość + puszystość
    st.child_type = 'INTERPOLATED'
    st.rendered_child_count = FUR_CHILDREN
    try:
        st.child_percent = FUR_CHILDREN
    except AttributeError:
        pass
    st.child_length = 1.0
    st.clump_factor = 0.45       # kępki jak w prawdziwej sierści
    st.clump_shape = 0.0
    st.roughness_endpoint = 0.035  # rozczochranie końcówek
    st.roughness_end_shape = 1.0
    st.roughness_2 = 0.03         # losowe skręty (fluffy)
    st.roughness_2_size = 1.4
    st.kink = 'WAVE'              # delikatna fala, nie loczki
    st.kink_amplitude = 0.012
    st.kink_frequency = 1.2
    st.kink_shape = 0.0
    st.material = 2               # slot futra
    return st

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
        for s_i, pts in enumerate(g_strokes):
            for ex, ey in (pts[0], pts[-1]):
                parts.append(add_sphere(ex, ey, r_let * 0.99, f'{ch}{idx}_cap{s_i}'))
    if "circle" in spec:
        cx, cy, r = spec["circle"]
        parts.append(add_circle_spline(cx, cy, r, f'{ch}{idx}_o'))
    if "dots" in spec:
        for dx_, dy_ in spec["dots"]:
            parts.append(add_sphere(dx_, dy_, R * 1.15, f'{ch}{idx}_dot'))
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
    lob.data.materials.append(skin)
    lob.data.materials.append(fur)
    add_fur(lob, spec.get("rscale", 1.0))
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

# ── Światła: miękkie softboxy, moce zbite pod białą sierść ─────────
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

area_light('key', (0, 2.4, 4.2), (math.radians(-26), 0, 0), W * 1.3, 2.2, 520, (1.0, 0.97, 0.92))
area_light('fill', (0, -2.6, 2.8), (math.radians(33), 0, 0), W * 1.0, 2.0, 90, (0.9, 0.93, 1.0))
area_light('rim_l', (-W * 0.7, 0.5, 1.2), (0, math.radians(-58), 0), 1.2, 3.2, 90)
area_light('rim_r', (W * 0.7, 0.5, 1.2), (0, math.radians(58), 0), 1.2, 3.2, 90)

world = bpy.data.worlds.new('world')
scene.world = world
world.use_nodes = True
bg = world.node_tree.nodes['Background']
bg.inputs['Color'].default_value = (0.96, 0.93, 0.88, 1.0)
# Ambient wypełnia cień MIĘDZY włosami — to on zabijał fakturę. Biel futra trzymają
# bounces (24/16), nie world. Jeśli futro szarzeje: podnieś WHITE albo key, NIE to.
bg.inputs['Strength'].default_value = 0.12

# ── Kamera ─────────────────────────────────────────────────────────
pad_x, pad_y = 1.18, 1.55   # ciut więcej luzu niż balon — futro wystaje poza bryłę
cam_data = bpy.data.cameras.new('cam')
cam_data.lens = 50
cam = bpy.data.objects.new('cam', cam_data)
scene.collection.objects.link(cam)
scene.camera = cam
fov_x = 2 * math.atan(cam_data.sensor_width / 2 / cam_data.lens)
cam.location = (0, 0, (W * pad_x / 2) / math.tan(fov_x / 2))
aspect = (W * pad_x) / (H * pad_y)
scene.render.resolution_x = 2048
scene.render.resolution_y = int(round(2048 / aspect / 2) * 2)

# ── Animacja: sway całości + jelly per litera (identyczna z balonem) ─
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
strands = sum(p.settings.count for o in letter_objs for p in o.particle_systems)
print(f"OK: {OUT_BLEND} res={scene.render.resolution_x}x{scene.render.resolution_y} "
      f"W={W:.2f} H={H:.2f} parents={strands} children_x={FUR_CHILDREN}")

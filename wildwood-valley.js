/* Connect the baked valley and floor to the existing forest adventure. */
(() => {
  'use strict';
  const data = window.WildwoodValleyData;
  if (!data) return;
  const layout = WildwoodLayout;
  const stops = data.stops;
  const packed = Uint8Array.from(atob(data.cells), ch => ch.charCodeAt(0));
  const cellAt = p => {
    const x = Math.floor(p.x * data.width / 100);
    const y = Math.floor(p.y * data.height / 100);
    if (x < 0 || y < 0 || x >= data.width || y >= data.height) return 0;
    const i = y * data.width + x;
    return (packed[i >> 2] >> ((i % 4) * 2)) & 3;
  };
  const point = ([x, y]) => ({x, y});
  layout.width = 2280;
  layout.height = 1520;
  for (const key of Object.keys(layout.positions)) layout.positions[key] = stops[key];
  for (const cache of layout.caches) Object.assign(cache, point(stops[cache.id]));
  for (const patrol of layout.patrols) patrol.home = stops[patrol.questNode];
  // Use the game's equipment catalog so camp, stats, save validation and artwork agree.
  const finds = [
    {source:'wildwood-herbalist-cache', id:'apiary-smock', name:'Beekeeper’s smock', slot:'armor', role:null, hp:6, guard:.01},
    {source:'wildwood-mill-cache', id:'millwright-mallet', name:'Millwright’s mallet', slot:'weapon', role:1, damage:3},
    {source:'wildwood-ruin-cache', id:'east-warden-seal', name:'East warden’s seal', slot:'accessory', role:null, hp:4, skill:.02}
  ];
  for (const find of finds) EquipmentLoot.catalog.push({rarity:'uncommon', damage:0, hp:0, guard:0, skill:0, ...find});
  const ground = 'assets/wildwood-valley.webp';
  const canopy = 'assets/wildwood-valley-canopy.webp';
  window.WildwoodValley = {
    updatePlaces(campaign) {
      const stopsBox = document.getElementById('forest-mini-stops');
      if (!stopsBox) return;
      let select = document.getElementById('valley-destinations');
      if (!select) {
        select = document.createElement('select');
        select.id = 'valley-destinations';
        select.setAttribute('aria-label', 'Walk to a place in the valley');
        select.add(new Option('Walk to a place…', ''));
        const banks = [
          ['Camp and west bank', [['merchant','Ranger camp'],['wildwood-herbalist-cache','Apiary'],['crypt-entrance','Rootbound Sanctuary'],['wildwood-watch-cache','Ranger watch'],['wildwood-overlook-cache','Cargo hoist']]],
          ['Across the bridge', [['wildwood-mill-cache','Watermill'],['wildwood-ruin-cache','Ruined courtyard']]]
        ];
        for (const [bank, places] of banks) {
          const group = document.createElement('optgroup');
          group.label = bank;
          for (const [id,name] of places) group.append(new Option(name,id));
          select.append(group);
        }
        select.onchange = () => {
          if (select.value) ForestAdventure.walkTo(select.value);
          select.selectedIndex = 0;
        };
        stopsBox.after(select);
      }
      const east = select.lastElementChild;
      const locked = !RegionGates.open(0,campaign.completed);
      east.disabled = locked;
      east.label = locked ? 'Across the bridge · defeat the sentinel' : 'Across the bridge';
    },
    gate: point(data.gate),
    west: point(stops['gate-west']),
    east: point(stops['gate-east']),
    roots: point(stops['ranger-roots']),
    bank: p => Number(cellAt(p) === 2),
    ground: p => Number(cellAt(p) !== 0),
    ready() {
      return [ground, canopy].every(src => ForestRenderer.image(src).naturalWidth > 0);
    },
    paint(ctx, w, h) {
      ctx.drawImage(ForestRenderer.image(ground), 0, 0, w, h);
    },
    foreground(ctx, list, toScreen) {
      const img = ForestRenderer.image(canopy);
      // The actor canvas is transparent above the baked terrain. Punching out
      // silhouettes reveals the original full-resolution painting beneath it.
      if (!img.naturalWidth || ctx.canvas !== ForestRenderer.overlay) return;
      const [width, height] = data.canopySize;
      for (const [left, top, w, h, atlasY, feet] of data.layers) {
        const a = toScreen(left * 100 / width, top * 100 / height);
        const b = toScreen((left + w) * 100 / width, (top + h) * 100 / height);
        if (b.x < 0 || b.y < 0 || a.x > ctx.canvas.width || a.y > ctx.canvas.height) continue;
        list.push({y: toScreen(0, feet * 100).y, draw() {
          ctx.save();
          ctx.globalCompositeOperation='destination-out';
          ctx.drawImage(img, 0, atlasY, w, h, a.x, a.y, b.x-a.x, b.y-a.y);
          ctx.restore();
        }});
      }
    }
  };
})();

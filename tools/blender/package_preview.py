"""Package an offline comparison and walking study; uses Pillow on the authoring machine."""
import argparse
import base64
import io
import json
from collections import deque
from pathlib import Path

from PIL import Image

parser=argparse.ArgumentParser()
parser.add_argument('render_folder',type=Path)
folder=parser.parse_args().render_folder
tools=Path(__file__).resolve().parent
assets=tools.parents[1]/'assets'
def b64(data):
    return base64.b64encode(data).decode('ascii')
def image_data(im,fmt='WEBP',**options):
    stream=io.BytesIO()
    im.save(stream,format=fmt,**options)
    return 'data:image/'+fmt.lower()+';base64,'+b64(stream.getvalue())

frame=Image.open(folder/'Wildwood.png').convert('RGB')
frame.save(folder/'Wildwood.webp',quality=91,method=6)
mask=Image.open(folder/'Floor.png').convert('L').resize((256,171),Image.Resampling.BOX)
grid=bytes(int(p>=200) for p in mask.getdata())
w,h=mask.size
coords=json.loads((folder/'landmarks.json').read_text())
starts={name:int(y*h)*w+int(x*w) for name,(x,y) in coords.items()}
def connected(start,blocked=()):
    queue=deque([start]);seen={start};barred=set(blocked)
    assert grid[start]
    while queue:
        i=queue.popleft();x,y=i%w,i//w
        for dx,dy in ((-1,0),(1,0),(0,-1),(0,1)):
            nx,ny=x+dx,y+dy
            if not(0<=nx<w and 0<=ny<h):continue
            nxt=ny*w+nx
            if grid[nxt] and nxt not in seen and nxt not in barred:seen.add(nxt);queue.append(nxt)
    return seen
reachable=connected(starts['camp'])
assert set(starts.values())<=reachable,'A landmark is unreachable'
cross=starts['bridge']%w
# Remove a vertical slice only where the deck crosses the river.
row=starts['bridge']//w
cut=[j*w+cross for j in range(row-8,row+9)]
assert starts['east'] not in connected(starts['camp'],cut),'An unintended water crossing exists'
depth=Image.open(folder/'Foreground.png').convert('L')
sprite=Image.open(assets/'lira-painted-walk.webp').convert('RGBA')
sprite.thumbnail((256,256),Image.Resampling.LANCZOS)
data=dict(w=w,h=h,floor=b64(grid),marks={k:dict(x=x*frame.width,y=y*frame.height) for k,(x,y) in coords.items()},
    valley='data:image/webp;base64,'+b64((folder/'Wildwood.webp').read_bytes()),
    original='data:image/webp;base64,'+b64((assets/'geography-forest.webp').read_bytes()),
    actor=image_data(sprite,quality=92,method=6),depth=image_data(depth,'PNG',optimize=True))
page=(tools/'walk-template.html').read_text(encoding='utf-8-sig')
target=folder/'Walk Wildwood.html'
target.write_text(page.replace('__STUDY__',json.dumps(data,separators=(',',':'))),encoding='utf8')
print(f'{target} | {target.stat().st_size:,} bytes | verified all five landmarks and bridge-only access')

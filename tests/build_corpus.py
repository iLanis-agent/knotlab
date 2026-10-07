#!/usr/bin/env python3
"""KnotLab oracle: independent python recompute of WLL, recommend, compare."""
import json, os, re

KNOTS = [
 ('figure8','Figure-8 Loop','loop',0.77,1,['climbing tie-in','general loop','stopper basis']),
 ('bowline','Bowline','loop',0.60,1,['fixed loop','mooring','rescue']),
 ('alpine','Alpine Butterfly','loop',0.70,2,['mid-rope loop','isolating damaged section','3-way loading']),
 ('doublefish','Double Fisherman','bend',0.70,2,['joining ropes','prusik loops','rappel backup']),
 ('sheetbend','Sheet Bend','bend',0.55,1,['joining different diameters','temp tie-down']),
 ('clove','Clove Hitch','hitch',0.65,1,['starting lashings','temporary post attachment']),
 ('tautline','Taut-Line Hitch','hitch',0.60,2,['tent guy lines','adjustable tension']),
 ('prusik','Prusik','friction',0.85,2,['rope ascent','self-rescue','adjustable lanyard']),
 ('truckers',"Trucker's Hitch",'hitch',0.58,3,['cargo lashing','heavy tensioning']),
 ('cleat','Cleat Hitch','hitch',0.75,1,['docking','belaying to a cleat']),
 ('stopper','Figure-8 Stopper','stopper',0.72,1,['rope end stop','rappel backup']),
 ('barrel','Barrel Knot','stopper',0.68,2,['slimmer stopper','cord ends']),
]

def wll(mbs, kid, sf):
    k = next((k for k in KNOTS if k[0] == kid), None)
    if not k or not mbs > 0 or not sf > 0: return None
    return round(mbs * k[3] / sf * 10) / 10

def recommend(task):
    t = task.lower()
    scored = []
    for kid, name, cat, eff, diff, uses in KNOTS:
        s = 0
        if cat in t: s += 3
        for u in uses:
            for w in re.split(r'[^a-z]+', u.lower()):
                if len(w) > 3 and w in t: s += 2
        if s: scored.append({'id': kid, 'score': s, 'eff': eff, 'difficulty': diff})
    scored.sort(key=lambda x: (-x['score'], -x['eff'], x['difficulty']))
    return [x['id'] for x in scored]

def compare(mbs, a, b, sf):
    wa, wb = wll(mbs, a, sf), wll(mbs, b, sf)
    if wa is None or wb is None: return None
    ea = next(k[3] for k in KNOTS if k[0] == a)
    eb = next(k[3] for k in KNOTS if k[0] == b)
    return {'strongerWll': a if wa >= wb else b,
            'deltaPct': round(abs(ea - eb) * 100)}

items = []
for mbs, kid, sf in [(2400,'figure8',10),(2400,'bowline',10),(1200,'prusik',5),
                     (500,'sheetbend',8),(3000,'truckers',4),(800,'cleat',12),
                     (1500,'stopper',6),(2000,'nonexistent',5),(0,'bowline',5)]:
    items.append({'kind':'wll','mbs':mbs,'knot':kid,'sf':sf,'oracle':wll(mbs,kid,sf)})
for task in ['climbing tie in','join two ropes','tent guy line','mooring a boat',
             'ascend a rope','stop a rope end','lash cargo down','cleat docking']:
    items.append({'kind':'recommend','task':task,'oracle':recommend(task)})
for args in [(2400,'figure8','bowline',10),(1200,'prusik','clove',5),(900,'cleat','clove',6)]:
    items.append({'kind':'compare','mbs':args[0],'a':args[1],'b':args[2],'sf':args[3],
                  'oracle':compare(*args)})
out = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'expected.json')
json.dump({'items': items}, open(out,'w'))
print('cases:', len(items))

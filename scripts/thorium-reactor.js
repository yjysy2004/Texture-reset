var block = Blocks.thoriumReactor;
let fuelItem = block.fuelItem;

var buildings = new ObjectSet();

var hexPos = [];

initHexPos(block.itemCapacity);

Events.on(WorldLoadEvent, e => {
    buildings.clear();
    
    Core.app.post(() => {
        Vars.state.teams.present.each(data => {
            buildings.addAll(data.getBuildings(block));
        });
    });
});

Events.on(TilePreChangeEvent, e => {
    let {tile} = e;
    if(tileValid(tile)){
        buildings.remove(tile.build);
    }
});

Events.on(TileChangeEvent, e => {
    let {tile} = e;
    if(tileValid(tile)){
        buildings.add(tile.build);
    }
});

Events.run(Trigger.draw, () => {
    if(buildings.size > 0){
        drawReactors();
    }
});

function initHexPos(cap){
    let turnId;
    let lineId;
    let linepos;

    let v = Tmp.v1;
    for(let posId = 0; posId < cap + 6; posId++){
        turnId = 0;

        while(turnId * (turnId + 1) * 3 <= posId){
            turnId += 1;
        }

        lineId = Mathf.floor((posId - turnId * (turnId - 1) * 3) / (turnId));
        linepos = Mathf.mod(posId - turnId * (turnId - 1) * 3, turnId);

        switch(lineId){
            case 0:
                 v.set(turnId / -2 + linepos, turnId / 2 * Mathf.sqrt3);
                 break;
            case 1:
                 v.set(turnId / 2 + linepos / 2, (turnId - linepos) * Mathf.sqrt3 / 2);
                 break;
            case 2:
                 v.set(turnId - linepos / 2, (-linepos) * Mathf.sqrt3 / 2);
                 break;
            case 3:
                 v.set(turnId / 2 - linepos, -turnId / 2 * Mathf.sqrt3);
                 break;
            case 4:
                 v.set(-turnId / 2 - linepos / 2, (-turnId + linepos) * Mathf.sqrt3 / 2);
                 break;
            case 5:
                 v.set(-turnId + linepos / 2, linepos * Mathf.sqrt3 / 2);
                 break;
        }
        
        hexPos[posId] = v.cpy();
    }
}

function tileValid(tile){
    if(tile == null){
        return false;
    }
    let {build} = tile;
    return build != null && build.tile == tile && build.block == block;
}

function drawReactors(){
    Draw.z(Layer.block + 1);
    
    Draw.color(fuelItem.color);
    
    let bounds = Core.camera.bounds(Tmp.r1);
    buildings.each(reactor => {        
        let {x, y, items} = reactor;
        let fuel = items.get(fuelItem);
        
        if(fuel == 0 || !bounds.contains(x, y)){
            return;
        }

        for(let i = 0; i < fuel; i++){
            let pos = getHexPos(i + 6, 2);

            Draw.alpha(0.8);
            Fill.poly(x + pos.x, y + pos.y, 6, 0.7);
        }
    });
    
    Draw.reset();
}

function getHexPos(posId, gap){
    return Tmp.v1.set(hexPos[posId]).scl(gap);
}
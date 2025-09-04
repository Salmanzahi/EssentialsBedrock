
function seqcommand(player, scoreboard){
    player.runCommand(`effect @s regeneration 10 1 true`);
    scoreboard.setScore(player, 5);
}

world.beforeEvents.itemUse.subscribe((event) => {
    const scoreboard = world.scoreboard.getObjective("cooldown") || world.scoreboard.addObjective("cooldown", "dummy");
    const player = event.source;
    const item = event.itemStack;
    const itemName = item.typeId;
    const currentvalscoreboard = scoreboard.getScore(player);
    if (currentvalscoreboard> 0) {
        event.cancel = true;
        world.sendMessage(`you cant use this item for ${currentvalscoreboard} second(s) !`);
        return;
    }
    try {
        if (itemName === "minecraft:diamond_sword") {
            system.run(() => {
              seqcommand(player, scoreboard);
            });
        }
    } catch (error) {
        console.warn(`Error in itemUse event handler: ${error}`);
    }

    
});


// when player death event
world.afterEvents.entityDie.subscribe((event) => {
    const player = event.deadEntity;
    const scoreboard = world.scoreboard.getObjective("death");
    if(!scoreboard){
        world.scoreboard.addObjective("death", "dummy");
    }
    scoreboard.addScore(player, 1);
});


// get player total kill
world.afterEvents.entityDie.subscribe((event) => {
   const player = event.damageSource.damagingEntity;
    const scoreboard = world.scoreboard.getObjective("kill");
    if(!scoreboard){
        world.scoreboard.addObjective("kill", "dummy");
    }
    scoreboard.addScore(player, 1);
});


// get player total death
world.afterEvents.entityDie.subscribe((event) => {
    const player = event.deadEntity;
    const scoreboard = world.scoreboard.getObjective("death");
    if(!scoreboard){
        world.scoreboard.addObjective("death", "dummy");
    }
    scoreboard.addScore(player, 1);
});

system.runInterval(() => {
  //get player health
  const player = world.getPlayers()[0];
  const sc = world.scoreboard.getObjective("healthpoint");
  const schp = world.scoreboard.getObjective("health");
  if (!sc){
    world.scoreboard.addObjective("healthbar", "dummy");
  } else if (!schp){
    world.scoreboard.addObjective("healthpoint", "dummy");
  }
//   const playername = player.name;
  const health = player.getComponent("minecraft:health").currentValue;
  const roundhealth = Math.round(health * 100) / 100;
  const hp = roundhealth/2
  sc.setScore(player, roundhealth);
  schp.setScore(player, hp);

//   world.sendMessage(`your health is ${roundhealth} ${playername}`);
}, 10);


//s






// get player velo
system.runInterval(() => {
    const scresultant = world.scoreboard.getObjective("veloresultant")
    const scx = world.scoreboard.getObjective("velox")
    const scz = world.scoreboard.getObjective("veloz")
    const scy = world.scoreboard.getObjective("veloy")
    const scabsx = world.scoreboard.getObjective("veloabsx")
    const scabsz = world.scoreboard.getObjective("veloabsz")
    const scabsy = world.scoreboard.getObjective("veloabsy")


    // if (!scresultant || !scx || !scy || !scz || !scabsx || !scabsz || !scabsy){

    // world.scoreboard.addObjective("veloresultant", "dummy");
    // world.scoreboard.addObjective("velox", "dummy");
    // world.scoreboard.addObjective("veloz", "dummy"); 
    // world.scoreboard.addObjective("veloy", "dummy");
    // world.scoreboard.addObjective("veloabsx", "dummy");
    // world.scoreboard.addObjective("veloabsz", "dummy");
    // world.scoreboard.addObjective("veloabsy", "dummy");
    // }


    const player = world.getPlayers()[0];
    const velo = player.getVelocity();
    const velox = velo.x;
    const veloz = velo.z;
    const veloy = velo.y;
    const roundvelox = Math.round(velox * 20 * 100) / 100;
    const roundveloz = Math.round(veloz * 20 * 100) / 100;
    const roundveloy = Math.round(veloy * 20 * 100) / 100;
    const absx = Math.abs(roundvelox)
    const absz = Math.abs(roundveloz)
    const absy = Math.abs(roundveloy)

    const veloresultant = Math.round(Math.sqrt(Math.pow(velox * 20, 2) + Math.pow(veloz * 20, 2) + Math.pow(veloy * 20, 2)) * 10) / 10;
    scx.setScore(player, roundvelox);
    scz.setScore(player, roundveloz);
    scy.setScore(player, roundveloy);
    scabsx.setScore(player, absx);
    scabsz.setScore(player, absz);
    scabsy.setScore(player, absy);
    scresultant.setScore(player, veloresultant);
    
  

  
        // world.sendMessage(`Player speed: ${veloresultant} blocks/s`);
        // world.sendMessage(`Velocity components (blocks/s): <${(velox * 20).toFixed(2)}, ${(veloy * 20).toFixed(2)}, ${(veloz * 20).toFixed(2)}>`);
   
 
    
}, 20)

// get all block mined from player
// world.beforeEvents.playerBreakBlock.subscribe((event) => {
//     const player = event.player;
//     const block = event.block;
//     const blockType = block.typeId;
//     let sc = world.scoreboard.getObjective("blockmined");
    
//     // if (!sc) {
//     //     sc = world.scoreboard.addObjective("blockmined", "dummy");
//     // }
    
//     try {
//         sc.addScore(player, 1);
//         // world.sendMessage(`${player.name} mined ${blockType}`);
//     } catch (error) {
//         console.warn(`Error tracking block break: ${error}`);
//     }
// });
system.runInterval(() => {
    const scoreboard = world.scoreboard.getObjective("cooldown");
    if (scoreboard) {
        for (const player of world.getAllPlayers()) {
            const score = scoreboard.getScore(player);
            if (score > 0) {
                scoreboard.setScore(player, score - 1);
            }
        }
    }
}, 20);

system.runInterval(() => {
    const scoreboard = world.scoreboard.getObjective("tntcountercooldown");
    if (scoreboard) {
        for (const player of world.getAllPlayers()) {
            const score = scoreboard.getScore(player);
            if (score > 0) {
                scoreboard.setScore(player, score - 1);
            }
        }
    }
}, 20);

world.beforeEvents.playerBreakBlock.subscribe((event) => {
    const player = event.player;
    // const plstringfy = JSON.stringify(player);
    const block = event.block;
    const sc = world.scoreboard.getObjective("blockmined");
    const blockType = block.typeId
  if (!sc){
    world.scoreboard.addObjective("blockmined", "dummy");
  }
//   sc.addScore(player, 1);
// player.runCommand(`scoreboard players set @s blockmined 1`);
sc.addScore(player, 1);
world.sendMessage(`${plstringfy} mined ${blockType}`);
})

// world.afterEvents.entityDie.subscribe((event) => {
//    const entity = event.deadEntity;
//    const source = event.damageSource?.cause;
//    const score = world.scoreboard.getObjective("tntcountercooldown");
//    const killscore = world.scoreboard.getObjective("kill")
//    if(source === "explosion"){
//     world.sendMessage(`${entity} died by tnt`);
//     // for (const player of world.getAllPlayers()){
//     //     if(score.getScore(player) >= 1 && score.getScore(player) <= 2){
//     //         killscore.addScore(player, 1);
//     //         world.sendMessage(`${player} has ${killscore.getScore(player)} kills (kills using tnt explosion)`);
//     //     }
//     // }
//    }

// })

system.runInterval(() => {
    const cooldown = world.scoreboard.getObjective("cooldown");
    const kill = world.scoreboard.getObjective("kill");
    const death = world.scoreboard.getObjective("death");
    const veloresultant = world.scoreboard.getObjective("veloresultant");

    for (const player of world.getAllPlayers()) {
        const cd = cooldown?.getScore(player) ?? 0;
        const k = kill?.getScore(player) ?? 0;
        const d = death?.getScore(player) ?? 0;
        const v = veloresultant?.getScore(player) ?? 0;

        const message = `§bspeed: ${v}b/s §akills$: ${k} §7deaths: ${d}`;
        player.runCommand(`title @s actionbar ${message}`);
    }
}, 20); 


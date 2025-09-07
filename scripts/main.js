import {
  world,
  EntityType,
  Entity,
  system,
  CommandPermissionLevel,
  CustomCommandParamType,
  CustomCommandStatus,
  CustomCommandRegistry,
  CustomComponentParameters,
  
  Player,
  // Vector3,
  Dimension,
  CustomCommandOrigin,
  CustomCommandSource,
} from "@minecraft/server";
import { commands } from "./cmdlist.js";
import {
  ActionFormData,
  ModalFormData,
  MessageFormData,
  ModalFormResponse

 } from "@minecraft/server-ui";
// import { UTC } from "./config.js";


const UTC = 7;
/*
*/

system.beforeEvents.startup.subscribe(() => {
system.runTimeout(() => {
  // world.gameRules('doDaylightCycle', false)
   console.log('intisializing addons... EssentialsBE V 0.5 BETA VERSION')
  const rltime = world.getDynamicProperty('rltime')
  console.log('Fetching rltime property')
  if (rltime == undefined){
    console.log('rltime is undefined !')
    world.setDynamicProperty('rltime', false)
    const statedp = world.getDynamicProperty('rltime')
    console.log('rltime is set to' + statedp )
  } else {
  if (rltime == true){
    console.log('rltime is  on true condition !')
    const w = world.getDimension('overworld')
   const createdate = new Date()
   const hours = createdate.getUTCHours()+UTC
   console.log(hours)
   const minute = createdate.getUTCMinutes()
   console.log(minute)
   const currenttime = Math.round(mctick(hours, minute))
  const getworldday = world.getTimeOfDay()

  console.log('rounded curr time after reload:' + currenttime)

   console.log('current time (getworldday):' + getworldday)
  if( getworldday < currenttime || getworldday == currenttime){
    const deltatime = currenttime - getworldday
    w.runCommand(`time add ${deltatime}`)
    // const newsavetick = Math.round(saved_tick + rounded_tickdiff) 
    // world.setDynamicProperty('saved_tick', newsavetick)
    // console.log('saved tick:' + (newsavetick))
   } else {
    const dayleft = 24000 - getworldday
    const ticktotal = dayleft + currenttime
    const rounded_ticktotal = Math.round(ticktotal)
    w.runCommand(`time add ${rounded_ticktotal}`)

    // const newsavetick = Math.round(saved_tick + rounded_ticktotal) 
    // world.setDynamicProperty('saved_tick', newsavetick)
    // console.log('saved tick:' + (newsavetick))
   }
  } else {
    console.log('rltime is not initialized !')
  }
  }
  
})
})

system.beforeEvents.startup.subscribe((init) => {


  init.customCommandRegistry.registerCommand(commands[0], help);
  init.customCommandRegistry.registerCommand(commands[1], nukeCommand);
  init.customCommandRegistry.registerCommand(commands[2], party);
  init.customCommandRegistry.registerCommand(commands[3], bulksummon);
  init.customCommandRegistry.registerCommand(commands[4], knocback);
  init.customCommandRegistry.registerCommand(commands[5], vanish);
  init.customCommandRegistry.registerCommand(commands[6], unvanish);
  init.customCommandRegistry.registerCommand(commands[7], feed);
  init.customCommandRegistry.registerCommand(commands[8], godmode);
  init.customCommandRegistry.registerCommand(commands[9], economyinit);
  init.customCommandRegistry.registerCommand(commands[10], economyadd);
  init.customCommandRegistry.registerCommand(commands[11], economyremove);
  init.customCommandRegistry.registerCommand(commands[12], economyset);
  init.customCommandRegistry.registerCommand(commands[13], realtime);
  init.customCommandRegistry.registerCommand(commands[14], baltop);
  // init.customCommandRegistry.registerCommand(commands[14], economy);
  init.customCommandRegistry.registerEnum("creator:economyenum", [ "add", "remove", "set"]);
  init.customCommandRegistry.registerEnum("creator:bankenum", [ "withdraw", "deposit"])
  // init.customCommandRegistry.registerEnum('creator:econmyinit', ["init"])
  init.customCommandRegistry.registerCommand(
    {
    name: 'creator:economy',
    description: 'Economy Condition ! ',
    permissionLevel: CommandPermissionLevel.Admin,
    mandatoryParameters: [
      
        {
           name: "creator:economyenum",
           type: CustomCommandParamType.Enum,
                },
                {
                  name: "selector",
                  type: CustomCommandParamType.EntitySelector,
                },
                  {
                  name: "amount",
                  type: CustomCommandParamType.Integer,
                },
    ]
  }, economy);

  init.customCommandRegistry.registerCommand({
    name: 'creator:bank',
    description: 'A bank feature where u could withdraw and deposit money ',
    permissionLevel: CommandPermissionLevel.Admin,
    mandatoryParameters: [
      {
        name: "creator:bankenum",
        type: CustomCommandParamType.Enum,
      },
      {
        name: "selector",
        type: CustomCommandParamType.EntitySelector,
      },
      {
        name: "amount",
        type: CustomCommandParamType.Integer,
      },
    ]
  }, bank)
 
});

function baltop (origin, target){
  const ecosc = world.scoreboard.getObjective('economy')
  console.log(JSON.stringify(target))
  system.runTimeout(() => {

  const filtered = target.map((entity) => {
    
const e = world.getEntity(entity.id)
const name = e?.nameTag || e?.typeId || 'unknown'
let score = 0;
try {
  score = ecosc?.getScore(e) ?? 0;
} catch {
  score = 0;
}
return { name, score}
// origin.sourceEntity.sendMessage(`${e.name}: $${score}`);
    
    })

    const sort = filtered.sort((a, b) => b.score - a.score)


    sort.forEach((entity, index) => {
      // world.getDimension('overworld').getEntities()
     
      origin.sourceEntity.sendMessage(`${index + 1}. ${entity.name}: $${entity.score}`);
    })
     origin.sourceEntity.playSound('random.toast')

    console.log(JSON.stringify(sort))
   });
}

function bank (origin, bankenum, selector, amount){
const banksc = world.scoreboard.getObjective('bank')
const ecosc = world.scoreboard.getObjective('economy')

system.runTimeout(() => {
  // origin.runCommand(`bank ${amount}`)
  
if(ecosc == undefined){
    origin.sourceEntity.sendMessage('You need to initisialized Economy feature by /economyinit')
  }
  if(banksc == undefined){
    console.log('banksc is undefined !')
    world.scoreboard.addObjective('bank', 'bank')
    console.log('bank sc is added to scoreboard !')

  }
  
  if(bankenum == "withdraw"){
  for ( const entity of selector){
    const e = world.getEntity(entity.id)
    if ( banksc.getScore(e) < amount){
      origin.sourceEntity.sendMessage('§cYou dont have enough money to withdraw !')
    } else {
      banksc.addScore(e, -amount)
      ecosc.addScore(e, amount)
      origin.sourceEntity.sendMessage('$ ' + amount + ' balance has been withdrawed from current entity !')
    }
    
  }
  } else if (bankenum == "deposit"){
    for ( const entity of selector){
      const e = world.getEntity(entity.id)
      if ( ecosc.getScore(e) < amount){
        origin.sourceEntity.sendMessage('§cYou dont have enough money to deposit !')
      } else {
        banksc.addScore(e, amount)
        ecosc.addScore(e, -amount)
        origin.sourceEntity.sendMessage('$ ' + amount + ' balance has been deposited to current entity !')
      }
    
    }
  }



},)
}
function economy (origin, economynum, selector, amount){
 if (economynum == "add"){
  economyadd(origin, selector, amount)
  } else if (economynum == "remove"){
    economyremove(origin, selector, amount)
  } else if (economynum == "set"){
    economyset(origin, selector, amount)
  }
}
function realtime(origin, condition) {
  if ( condition == 1 ){
    system.runTimeout(() => {
   const createdate = new Date()
   const hours = createdate.getUTCHours()+UTC
   console.log(hours)
   const minute = createdate.getUTCMinutes()
   console.log(minute)
   console.log(mctick(hours, minute))
   const currenttime = Math.round(mctick(hours, minute))
  //  const timeofday = world.getTimeOfDay()
   const day = world.getDay()
   const multiplier = (day*24000)+currenttime

  world.getDimension('overworld').runCommand(`time set ${multiplier}`)
  world.setDynamicProperty('rltime', true)
  console.log('real time enabled')

    })
  } else {
    world.setDynamicProperty('rltime', false)
    console.log('real time disabled')
  }
  
}



function mctick(hours, minute){
  const tick = (1000*hours+(1000/60)*minute-6000+24000)%24000
  return tick;
}


system.runInterval(()=>{
  if (world.getDynamicProperty('rltime')) {
    const w = world.getDimension('overworld')
      //  let saved_tick = world.getDynamicProperty('saved_tick', value) ?? 0;
      const createdate = new Date()
      const hours = createdate.getUTCHours()+UTC
      const minute = createdate.getUTCMinutes()
      const currenttime = Math.round(mctick(hours, minute))
      const timeofday = world.getTimeOfDay();
      const deltatime = currenttime - timeofday
      // console.log(`currenttime: ${currenttime} || timeofday: ${timeofday} || deltatime: ${deltatime}`)
      // // w.runCommand(`time add ${currenttime}`)
      // const tickdiff = currenttime - saved_tick
      // const rounded_tickdiff = Math.round(tickdiff)
      w.runCommand(`time add ${deltatime}`)
      // console.log('time add:' + deltatime)
  } 
}, 1200)

function economyadd(origin, target, amount){
  system.runTimeout(() => {
    
  const isexisted = world.scoreboard.getObjective("economy")
      if (!isexisted){
    world.sendMessage('§cEconomy system not initialized !')
    return
  } else {
    // const target = origin.getEntitySelector("target")
    // const amount = origin.getInteger("amount")
    if (target) {
      if (amount) {
        for (const entity of target) {
          const e = world.getEntity(entity.id)
          const sc = world.scoreboard.getObjective("economy")
          sc.addScore(e, amount)
          // world.sendMessage('$ ' + amount + ' balance has been added to current entity !')
          origin.sourceEntity.sendMessage('$ ' + amount + ' balance has been added to current entity !')
          console.log(JSON.stringify(entity.id))
        world.getDimension(e.dimension.id).playSound('random.orb', e.location)
        }
      } else {
        world.sendMessage('§cAmount not specified !')
      }
    }
  }
  })



}

function economyremove(origin, target, amount) {
  system.runTimeout(() => {
    const isexisted = world.scoreboard.getObjective("economy")
    if (!isexisted) {
     origin.sourceEntity.sendMessage('§cEconomy system not initialized !')
      return
    } else {
      if (target) {
        if (amount) {
          for (const entity of target) {
            const e = world.getEntity(entity.id)
            const sc = world.scoreboard.getObjective("economy")
            sc.addScore(e, -amount)
            origin.sourceEntity.sendMessage('$ ' + amount + ' balance has been removed from current entity !')
            world.getDimension(e.dimension.id).playSound('random.break', e.location)
          }
        } else {
          world.sendMessage('§cAmount not specified !')
        }
      }
    }
  })
}

function economyset(origin, target, amount) {
  system.runTimeout(() => {
    const isexisted = world.scoreboard.getObjective("economy")
    if (!isexisted) {
      origin.sourceEntity.sendMessage('§cEconomy system not initialized !')
      return
    } else {
      if (target) {
        if (amount) {
          for (const entity of target) {
            const e = world.getEntity(entity.id)
            const sc = world.scoreboard.getObjective("economy")
            sc.setScore(e, amount)
            origin.sourceEntity.sendMessage('Balance has been set to $ ' + amount + ' for current entity !')
            world.getDimension(e.dimension.id).playSound('random.levelup', e.location)
          }
        } else {
          world.sendMessage('§cAmount not specified !')
        }
      }
    }
  })
}

function economyinit(origin){

  system.runTimeout(() => {
    const isexisted = world.scoreboard.getObjective("economy")
      if (!isexisted){
    world.scoreboard.addObjective('economy', 'dummy')
    origin.sourceEntity.sendMessage('§aEconomy system initialized !')
  } else {
    origin.sourceEntity.sendMessage('§cEconomy system already initialized !')
  }

  })

}

function godmode(origin, target){
  system.runTimeout(() => {
    if (target) {
      // console.log(world.getEntity())
    for (const entity of target) {
      const e = world.getEntity(entity.id)
      const isgodmode = e.getDynamicProperty("godmode") ?? false;
      
      if (isgodmode){
        e.setDynamicProperty('godmode', false)
        console.log('curr state :' + e.getDynamicProperty('godmode' ))
        e.removeEffect('resistance')
        e.removeEffect('fire_resistance')
        // origin.sendMessage('godmode disabled')

        
      } else {
        world.getDimension(e.dimension.id).spawnEntity('minecraft:lightning_bolt', e.location)
        e.setDynamicProperty("godmode", true)
         console.log('curr state :' + e.getDynamicProperty('godmode' ))
        e.addEffect('regeneration', 500, {amplifier: 255, showParticles: false})
        feed(origin, target)
        e.addEffect('resistance', 10000, {amplifier: 255, showParticles: false})
        e.addEffect('fire_resistance', 10000, {amplifier: 255, showParticles: false})
     
      }
  
    }
  } else {
  }
  }, 1);
  
}

function feed(origin, target){

  system.runTimeout(() => {
    if (target) {
      for (const entity of target) {
        const e = world.getEntity(entity.id)

    e.addEffect('saturation', 2, {amplifier: 255, showParticles: false})
    // console.log('Target: ' + JSON.stringify(target))
    console.log('Entity: ' + JSON.stringify(e))
  
    world.getDimension('overworld').playSound('random.orb', e.location)
    }
  }
}, 1);
}
function vanish(origin, target, duration){
  system.runTimeout(() => {

    if (target) {
      for (const entity of target) {
        const e = world.getEntity(entity.id)
        // e.setDynamicProperty("vanished", true)
        const isvanished = e.getDynamicProperty("vanished") ?? false
        if(isvanished){
         e.removeEffect("invisibility")
          e.setDynamicProperty("vanished", false)
        } else {
            e.addEffect("invisibility", duration ?? 6000, { amplifier: 1, showParticles: false })
          e.setDynamicProperty("vanished", true)
         
        }
      }
    }
  }, 1);
}

function unvanish(origin, target){
  system.runTimeout(() => {
    if (target) {
      for (const entity of target) {
        const e = world.getEntity(entity.id)
        e.removeEffect("invisibility")
      }
    }
  }, 1);
}

function knocback(origin, x_strength, y_strength, z_strength, target) {
  if (target) {
    system.runTimeout(() => {
    for (const entity of target) {
 const e = world.getEntity(entity.id)
 if (e.typeId === 'minecraft:player'){
  world.sendMessage('§cKnockback effect cannot be applied to player ! (try it to mob instead e.g: zombie, cow, armour stand)')
 } else {
  e.applyImpulse({ x: x_strength, y: y_strength, z: z_strength });
      e.dimension.spawnParticle("minecraft:knockback_particle", entity.location);
 }
    
   
    }
    }, 1);
  }
}

function bulksummon(origin, entitytype, amount, location) {
  // const summonCommand = `summon ${entitytype} ${location.x} ${location.y} ${location.z}`;
 
  for (let i = 0; i < amount; i++) {
    system.runTimeout(() => {
    const dim = world.getDimension('overworld');
    dim.spawnEntity(entitytype.typeId ?? entitytype, {x: location.x, y: location.y, z: location.z});
  },);
  }
}

function help(origin) {
  world.sendMessage("§a==================§aHelp Menu================\n");

const sortedcommand = commands.sort((a, b) => {
  return a.name.localeCompare(b.name);
})
  sortedcommand.forEach((cmd) => {
    const slice = cmd.name.split(":");
    world.sendMessage(`§a${slice[1]} >> §b${cmd.description}`);
  });
  return { status: CustomCommandStatus.Success };
}

function nukeCommand(origin, nukeTarget, nukeRadius) {

  world.sendMessage("Entity has been nuked!");
  if (nukeTarget) {
    try {
    
      for (const entity of nukeTarget) {
        system.runTimeout(() => {
          entity.dimension.createExplosion(entity.location, nukeRadius ?? 3);
        }, 10);
      }
    } catch (error) {
      world.sendMessage("§cError applying effects to entity: " + error.message);
    }
  } else {
    world.sendMessage("§cNo valid targets found!");
  }
  return { status: CustomCommandStatus.Success };
}

function party(origin, { partyTarget }) {
  world.sendMessage("Entity party!");
  if (partyTarget) {
    for (const entity of partyTarget) {
      entity.applyImpulse({ x: 0, y: 1, z: 0 });
      entity.dimension.spawnParticle("minecraft:ominous_spawning_particle", entity.location);
    }
  }
  return { status: CustomCommandStatus.Success };
}

world.afterEvents.entityDie.subscribe((event) => {
    const player = event.deadEntity;
    const scoreboard = world.scoreboard.getObjective("death");
    if(!scoreboard) world.scoreboard.addObjective("death", "dummy");
    scoreboard.addScore(player, 1);
});

world.afterEvents.playerBreakBlock.subscribe((event) => {
  const player = event.player;
  const scoreboard = world.scoreboard.getObjective("break");
  if(!scoreboard) world.scoreboard.addObjective("break", "dummy");
  scoreboard.addScore(player, 1);
})


// system.runInterval(() => {
//   //get player health
//   const player = world.getPlayers();
//   const sc = world.scoreboard.getObjective("healthpoint");
//   const schp = world.scoreboard.getObjective("health");
//   // if (!sc){
//   //   world.scoreboard.addObjective("healthbar", "dummy");
//   // } else if (!schp){
//   //   world.scoreboard.addObjective("healthpoint", "dummy");
//   // }
// //   const playername = player.name;
// player.forEach((player) => {
//    const health = player.getComponent("minecraft:health").currentValue;
//   const roundhealth = Math.round(health * 100) / 100;
//   const hp = roundhealth/2
//   sc.setScore(player, roundhealth);
//   schp.setScore(player, hp);

// })

// }, 10);


// world.afterEvents.entityHurt.subscribe((event) => {
  
// })

// world.afterEvents.entityHurt.subscribe((event) => {
//   const player = event.dama;
// })
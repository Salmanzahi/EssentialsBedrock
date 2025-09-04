import {
  world,
  system,
  CustomCommand,
  CommandPermissionLevel,
  CustomCommandParamType,
  StartupEvent,
  CustomCommandResult,
  CustomCommandStatus,
  Entity,
  Vector3,
  CustomCommandOrigin,
} from "@minecraft/server";

function mainTick() {
  if (system.currentTick % 100 === 0) {
    world.sendMessage("Hello custom commands! Current tick for now: " + system.currentTick);
  }

  system.run(mainTick);
}

system.beforeEvents.startup.subscribe((init: StartupEvent) => {
  const nuke: CustomCommand = {
    name: "creator:nuke",
    description: "Nukes the world !",
    permissionLevel: CommandPermissionLevel.GameDirectors,
  };
  init.customCommandRegistry.registerCommand(nuke, nukeCommand);

  const helloCommand: CustomCommand = {
    name: "creator:hellocustomcommand",
    description: "Celebration super party hello",
    permissionLevel: CommandPermissionLevel.Any,
    optionalParameters: [{ type: CustomCommandParamType.Integer, name: "celebrationSize" }],
  };
  init.customCommandRegistry.registerCommand(helloCommand, helloCustomCommand);

  const partyCommand: CustomCommand = {
    name: "creator:party",
    description: "Cause selected entities to party wohooooo",
    permissionLevel: CommandPermissionLevel.GameDirectors,
    mandatoryParameters: [{ type: CustomCommandParamType.EntitySelector, name: "partyParticipants" }],
  };
  init.customCommandRegistry.registerCommand(partyCommand, party);

  const dirtsterCommand: CustomCommand = {
    name: "creator:dirtster",
    description: "Adds some dirt, ster",
    permissionLevel: CommandPermissionLevel.GameDirectors,
    mandatoryParameters: [{ type: CustomCommandParamType.Location, name: "dirtLocation" }],
  };
  init.customCommandRegistry.registerCommand(dirtsterCommand, dirtster);
});

function helloCustomCommand(origin: CustomCommandOrigin, celebrationSize?: number): CustomCommandResult {
  world.sendMessage("Hello Custom Command! tes123");

  if (celebrationSize) {
    system.run(() => {
      for (const player of world.getPlayers()) {
        player.dimension.createExplosion(player.location, celebrationSize);
      }
    });
  }

  return {
    status: CustomCommandStatus.Success,
  };
}

function nukeCommand(origin: CustomCommandOrigin, radius: number): CustomCommandResult {
  world.sendMessage("Initiating nuclear explosion!");
  system.run(() => {
    for (const player of world.getPlayers()) {
      // Use nullish coalescing to ensure radius has a default value
      const explosionRadius = radius ?? 10;
      player.dimension.createExplosion(player.location, explosionRadius, {
        breaksBlocks: true,
        causesFire: true,
      });
    }
  });

  return {
    status: CustomCommandStatus.Success,
  };
}
function party(origin: CustomCommandOrigin, entities: Entity[]): CustomCommandResult {
  world.sendMessage("Entity partdddy!");

  system.run(() => {
    for (const entity of entities) {
      entity.applyImpulse({ x: 0, y: 1, z: 0 });
      entity.dimension.spawnParticle("minecraft:ominous_spawning_particle", entity.location);
    }
  }); //

  return {
    status: CustomCommandStatus.Success,
  };
}

function dirtster(origin: CustomCommandOrigin, loc: Vector3): CustomCommandResult {
  world.sendMessage("Lets get dirty!");

  system.run(() => {
    const dim = world.getDimension("overworld");

    dim.setBlockType(loc, "minecraft:dirt");

    // it's a mini dirt pyramid
    dim.setBlockType({ x: loc.x + 2, y: loc.y + 1, z: loc.z }, "minecraft:dirt");
    dim.setBlockType({ x: loc.x - 2, y: loc.y + 1, z: loc.z }, "minecraft:dirt");
    dim.setBlockType({ x: loc.x + 1, y: loc.y + 1, z: loc.z }, "minecraft:dirt");
    dim.setBlockType({ x: loc.x - 1, y: loc.y + 1, z: loc.z }, "minecraft:dirt");
    dim.setBlockType({ x: loc.x, y: loc.y + 1, z: loc.z }, "minecraft:dirt");

    dim.setBlockType({ x: loc.x + 1, y: loc.y + 2, z: loc.z }, "minecraft:dirt");
    dim.setBlockType({ x: loc.x - 1, y: loc.y + 2, z: loc.z }, "minecraft:dirt");
    dim.setBlockType({ x: loc.x, y: loc.y + 2, z: loc.z }, "minecraft:dirt");

    dim.setBlockType({ x: loc.x, y: loc.y + 3, z: loc.z }, "minecraft:dirt");
  }); //

  return {
    status: CustomCommandStatus.Success,
  };
}

system.run(mainTick);

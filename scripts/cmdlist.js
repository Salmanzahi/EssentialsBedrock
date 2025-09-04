import {
  world,
  EntityType,
  Entity,
  system,
  CommandPermissionLevel,
  CustomCommandParamType,
  CustomCommandStatus,
  
  Player,
  // Vector3,
  Dimension,
  CustomCommandOrigin,
} from "@minecraft/server";

export const commands = [
     {
    name: "creator:helpmenu",
    description: "Help",
    permissionLevel: CommandPermissionLevel.Any,
  },
  {
    name: "creator:nuke",
    description: "Nuke the world",
    permissionLevel: CommandPermissionLevel.Any,
    optionalParameters: [
      { type: CustomCommandParamType.EntitySelector, name: "nukeTarget" },
      { type: CustomCommandParamType.Integer, name: "nukeRadius" }
    ]
  },
  {
    name: "creator:party",
    description: "Party the world",
    permissionLevel: CommandPermissionLevel.Any,
    optionalParameters: [
      { type: CustomCommandParamType.EntitySelector, name: "partyTarget" }
    ]
  },
  {
    name:"creator:bulksummon",
    description: "Summon an entity multiple times",
    permissionLevel: CommandPermissionLevel.Any,
    optionalParameters: [
      { type: CustomCommandParamType.EntityType, name: "entitytype" },
      { type: CustomCommandParamType.Integer, name: "amount" },
      { type: CustomCommandParamType.Location, name: "location" }

    ]
  },
  {
    name:"creator:knocback",
    description: "Give a knocback to an entity ",
    permissionLevel: CommandPermissionLevel.Any,
    optionalParameters: [
      { type: CustomCommandParamType.Integer, name: "x_strength" },
      { type: CustomCommandParamType.Integer, name: "y_strength" },
      { type: CustomCommandParamType.Integer, name: "z_strength" },
      { type: CustomCommandParamType.EntitySelector, name: "target" }

    ]
  },{
     name:"creator:v",
    description: "Ability to vanish !  ",
    permissionLevel: CommandPermissionLevel.Admin,
    optionalParameters: [
      { type: CustomCommandParamType.EntitySelector, name: "target" },
      { type: CustomCommandParamType.Integer, name: "duration" }
    ]
  },
  {
    name:"creator:uv",
    description: "unvanish urself after getting vanished",
    permissionLevel: CommandPermissionLevel.Any,
    optionalParameters: [
      { type: CustomCommandParamType.EntitySelector, name: "target" }
    ]
  },
  {
    name:'creator:feed',
    description: "Feed an entity",
    permissionLevel: CommandPermissionLevel.Any,
    optionalParameters: [
      { type: CustomCommandParamType.EntitySelector, name: "target" }
    ]
  },
  {
    name:'creator:godmode',
    description: "Godmode an entity",
    permissionLevel: CommandPermissionLevel.Admin,
    optionalParameters: [
      { type: CustomCommandParamType.EntitySelector, name: "target" }
    ]
  },
  {
    name:'creator:economyinit',
    description: "Init economy system ! ",
    permissionLevel: CommandPermissionLevel.Admin,
  },
  {
    name:'creator:economyadd',
    description: "Add money to an entity ! ",
    permissionLevel: CommandPermissionLevel.Admin,
    optionalParameters: [
      { type: CustomCommandParamType.EntitySelector, name: "target" },
      { type: CustomCommandParamType.Integer, name: "amount" }
    ]
  },
  {
    name:'creator:economyremove',
    description: "Remove money from an entity ! ",
    permissionLevel: CommandPermissionLevel.Admin,
    optionalParameters: [
      { type: CustomCommandParamType.EntitySelector, name: "target" },
      { type: CustomCommandParamType.Integer, name: "amount" }
    ]
  },
  {
    name:'creator:economyset',
    description: "Set money to an entity ! ",
    permissionLevel: CommandPermissionLevel.Admin,
    optionalParameters: [
      { type: CustomCommandParamType.EntitySelector, name: "target" },
      { type: CustomCommandParamType.Integer, name: "amount" }
    ]
  },
  {
    name: 'creator:realtime',
    description: 'Realtime Condition of Time ! Based on rl ',
    permissionLevel: CommandPermissionLevel.Admin,
    optionalParameters: [
     { type: CustomCommandParamType.Integer, name: "condition"}
    ]
  }


]
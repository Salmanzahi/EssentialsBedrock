import { httpRequest } from '@minecraft/server-net';
import { world, Player, Entity, system} from '@minecraft/server';

system.beforeEvents.startup.subscribe(() => {
    httpRequest("http://example.com/").then((response) => {
        // Body content of the HTTP response.
        // Type: string
        const body = response.body;
    });
    console.log(body);
})

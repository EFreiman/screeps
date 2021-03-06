let Mission = require('mission');
// GuardMission sends a creep to fend off NPC invaders in a room.
class ReserveMission extends Mission {
    constructor(operation) {
        let missionName = operation.operationName + "(" + MISSION_RESERVE + ")";
        super(operation, missionName);
    }
    initMission() {
        this.spawn = this.operation.findSpawn();
        this.dangerPeriod = (Memory.empire[this.roomName].danger || {}).period || 0;
    }
    headCount() {
        let reserversNeeded = 0;
        if (this.hasVision &&
            this.room.controller &&
            !this.room.controller.my &&
            (!this.room.controller.reservation || this.room.controller.reservation.ticksToEnd < 4000) &&
            this.dangerPeriod === 0) {
            reserversNeeded = 1;
        }
        this.reservers = this.getMissionCreeps("reserver", reserversNeeded, Creep.BodyDef.reserver, { rcl: this.spawn.room.controller.level }, { noprespawn: true });
    }
    actions() {
        for (let creep of this.reservers) {
            Creep.behaviors.reserver.run(creep, this);
        }
    }
    // finalizeMission() {
    //     if (this.hasVision) {
    //         // Sends a reserver whenever the reserve ticks on the controller are below 4000.
    //         if (this.room.controller.reservation) {
    //             this.memory.nextReserverAt = Game.time + (this.room.controller.reservation.ticksToEnd - 4000);
    //         }
    //         else {
    //             this.memory.nextReserverAt = Game.time;
    //         }
    //     }
    // }
}
module.exports = ReserveMission;
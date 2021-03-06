/*
 * Copyright (c) 2021-2021.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import {MQ_UI_TB_EVENT_ROUTING_KEY, Train, TrainBuildStatus} from "@personalhealthtrain/ui-common";
import {consumeQueue, Message} from "amqp-extension";
import {getRepository} from "typeorm";

export enum TrainBuilderEvent {
    STARTED = 'trainBuildStarted',
    STOPPED = 'trainBuildStopped',
    FAILED = 'trainBuildFailed',
    FINISHED = 'trainBuildFinished',
}

const EventStatusMap : Record<TrainBuilderEvent, TrainBuildStatus> = {
    [TrainBuilderEvent.STARTED]: TrainBuildStatus.STARTED,
    [TrainBuilderEvent.STOPPED]: TrainBuildStatus.STOPPED,
    [TrainBuilderEvent.FAILED]: TrainBuildStatus.FAILED,
    [TrainBuilderEvent.FINISHED]: TrainBuildStatus.FINISHED
};

async function updateTrain(trainId: string, event: TrainBuilderEvent) {
    const repository = getRepository(Train);

    await repository.update({
        id: trainId
    }, {
        build_status: EventStatusMap[event]
    });
}

export function buildTrainBuilderAggregator() {
    function start() {
        return consumeQueue({routingKey: MQ_UI_TB_EVENT_ROUTING_KEY}, {
            [TrainBuilderEvent.FINISHED]: async (message: Message) => {
                await updateTrain(message.data.trainId, TrainBuilderEvent.FINISHED);
            },
            [TrainBuilderEvent.FAILED]: async (message: Message) => {
                await updateTrain(message.data.trainId, TrainBuilderEvent.FAILED);
            },
            [TrainBuilderEvent.STOPPED]: async (message: Message) => {
                await updateTrain(message.data.trainId, TrainBuilderEvent.STOPPED);
            },
            [TrainBuilderEvent.STARTED]: async (message: Message) => {
                await updateTrain(message.data.trainId, TrainBuilderEvent.STARTED);
            }
        });
    }

    return {
        start
    }
}

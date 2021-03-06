/*
 * Copyright (c) 2021-2021.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import {Message, publishMessage} from "amqp-extension";
import {isHarborStationProjectName} from "@personalhealthtrain/ui-common";
import {DispatcherHarborEventData} from "../../../domains/service/harbor/queue";
import {buildTrainRouterQueueMessage, TrainRouterHarborEvent} from "../../../domains/service/train-router";
import {useLogger} from "../../../modules/log";

export async function dispatchHarborEventToTrainRouter(
    message: Message
) : Promise<Message> {
    const data : DispatcherHarborEventData = message.data as DispatcherHarborEventData;

    // station project
    const isStationProject : boolean = isHarborStationProjectName(data.namespace);

    // only process station trains and the PUSH_ARTIFACT event
    if(!isStationProject || data.event !== 'PUSH_ARTIFACT') {
        return message;
    }

    await publishMessage(buildTrainRouterQueueMessage(
        TrainRouterHarborEvent.TRAIN_PUSHED,
        {
            repositoryFullName: data.repositoryFullName,
            operator: data.operator
        }
    ));

    useLogger().debug('train event pushed to train router aggregator.', {service: 'api-harbor-hook'})

    return message;
}


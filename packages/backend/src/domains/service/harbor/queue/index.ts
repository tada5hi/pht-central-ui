import {buildMessage, publishMessage} from "amqp-extension";
import {DispatcherEvent} from "../../../../components/event-dispatcher";
import {MQ_DISPATCHER_ROUTING_KEY} from "../../../../config/services/rabbitmq";

export type DispatcherHarborEventType = 'PUSH_ARTIFACT';

export type DispatcherHarborEventData = {
    event: DispatcherHarborEventType,
    operator: string,
    namespace: string,
    repositoryName: string,
    repositoryFullName: string,
    artifactTag?: string,
    [key: string]: string
}

export async function emitDispatcherHarborEvent(
    data: DispatcherHarborEventData,
    metaData: Record<string, any> = {},
    options?: {
        templateOnly?: boolean
    }
) {
    options = options ?? {};

    const message = buildMessage({
        options: {
            routingKey: MQ_DISPATCHER_ROUTING_KEY
        },
        type: DispatcherEvent.HARBOR,
        data,
        metadata: metaData
    });

    if(!options.templateOnly) {
        await publishMessage(message);
    }

    return message;
}